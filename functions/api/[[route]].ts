import { Hono } from 'hono';
import { handle } from 'hono/cloudflare-pages';
import { Lucia, generateIdFromEntropySize, Session, User } from "lucia";
import { D1Adapter } from "@lucia-auth/adapter-sqlite";

// Bindings del entorno (Cloudflare)
type Bindings = {
  DB: any; // D1Database
  R2: any; // R2Bucket
  MP_ACCESS_TOKEN: string; // Variable de entorno (Secret)
};

type Variables = {
  user: User | null;
  session: Session | null;
  lucia: Lucia;
};

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>().basePath('/api');

// --- FACTORY DE LUCIA AUTH ---
const getLucia = (db: any) => {
  const adapter = new D1Adapter(db, {
    user: "users",
    session: "sessions"
  });

  return new Lucia(adapter, {
    sessionCookie: {
      attributes: {
        secure: true
      }
    },
    getUserAttributes: (attributes: any) => {
      return {
        email: attributes.email
      };
    }
  });
};

// --- MIDDLEWARE DE SESIÓN ---
app.use('*', async (c, next) => {
  const lucia = getLucia(c.env.DB);
  c.set('lucia', lucia);

  const sessionId = lucia.readSessionCookie(c.req.header("Cookie") ?? "");
  if (!sessionId) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }

  const { session, user } = await lucia.validateSession(sessionId);
  if (session && session.fresh) {
    c.header("Set-Cookie", lucia.createSessionCookie(session.id).serialize(), { append: true });
  }
  if (!session) {
    c.header("Set-Cookie", lucia.createBlankSessionCookie().serialize(), { append: true });
  }

  c.set("user", user);
  c.set("session", session);
  return next();
});

// --- RUTAS ---

// 1. LOGIN
app.post('/auth/login-dev', async (c) => {
  const { email } = await c.req.json();
  if (!email) return c.json({ error: "Email required" }, 400);

  const lucia = c.get('lucia');
  const db = c.env.DB;

  let user: any = await db.prepare("SELECT * FROM users WHERE email = ?").bind(email).first();

  if (!user) {
    const userId = generateIdFromEntropySize(10);
    await db.prepare("INSERT INTO users (id, email) VALUES (?, ?)")
      .bind(userId, email)
      .run();
    user = { id: userId, email };
  }

  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);

  c.header("Set-Cookie", sessionCookie.serialize(), { append: true });
  return c.json({ success: true, user: { id: user.id, email: user.email } });
});

// 2. USUARIO ACTUAL
app.get('/user', (c) => {
  const user = c.get('user');
  return c.json({ user: user || null });
});

// 3. CHECKOUT DE SUSCRIPCIÓN (NUEVO - MERCADOPAGO)
app.post('/checkout/subscription', async (c) => {
  const user = c.get('user');
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  const accessToken = c.env.MP_ACCESS_TOKEN;
  if (!accessToken) return c.json({ error: "Server config error: Missing MP Token" }, 500);

  // URL a la que regresará el usuario después de pagar
  const origin = new URL(c.req.url).origin;
  const backUrl = `${origin}/?view=DASHBOARD&payment=success`;

  const payload = {
    reason: "Suscripción JACI Monstruomente (Mensual)",
    auto_recurring: {
      frequency: 1,
      frequency_type: "months",
      transaction_amount: 99,
      currency_id: "MXN"
    },
    back_url: backUrl,
    // Fix: Explicitly cast 'user' to any to access the 'email' property defined via Lucia's getUserAttributes
    payer_email: (user as any).email, // Autocompletar el email del usuario en MP
    external_reference: user.id, // CRÍTICO: Esto vincula el pago con tu usuario en D1
    status: "authorized"
  };

  try {
    const mpResponse = await fetch("https://api.mercadopago.com/preapproval", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      },
      body: JSON.stringify(payload)
    });

    const data: any = await mpResponse.json();

    if (!mpResponse.ok) {
      console.error("MP Error:", data);
      return c.json({ error: "Error creating subscription", details: data }, 500);
    }

    // Devolvemos la URL mágica para redirigir al usuario
    return c.json({ init_point: data.init_point });

  } catch (error) {
    return c.json({ error: "Network error connecting to MercadoPago" }, 500);
  }
});

// 4. CATÁLOGO DE DROPS
app.get('/drops', async (c) => {
  const user = c.get('user');
  const userId = user?.id ?? '';

  const { results } = await c.env.DB.prepare(`
    SELECT 
      d.id, d.title, d.month, d.year, d.cover_image, d.released_at,
      CASE WHEN l.user_id IS NOT NULL THEN 1 ELSE 0 END as is_unlocked
    FROM drops d
    LEFT JOIN ledger l ON d.id = l.drop_id AND l.user_id = ?
    ORDER BY d.year DESC, d.month DESC
  `).bind(userId).all();

  const drops = results.map((d: any) => ({
    ...d,
    is_unlocked: Boolean(d.is_unlocked)
  }));

  return c.json(drops);
});

// 5. DESCARGA SEGURA
app.get('/download/:dropId', async (c) => {
  const user = c.get('user');
  const dropId = c.req.param('dropId');
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  const ownership = await c.env.DB.prepare(`
    SELECT drops.r2_path, drops.title 
    FROM ledger JOIN drops ON ledger.drop_id = drops.id 
    WHERE ledger.drop_id = ? AND ledger.user_id = ?
  `).bind(dropId, user.id).first() as { r2_path: string, title: string } | null;

  if (!ownership) return c.json({ error: "Forbidden" }, 403);

  const object = await c.env.R2.get(ownership.r2_path);
  if (!object) return c.json({ error: "Asset missing" }, 404);

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);
  const safeFilename = ownership.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  headers.set('Content-Disposition', `attachment; filename="${safeFilename}.zip"`);

  return new Response(object.body, { headers });
});

// 6. WEBHOOK: EL MOMENTO DE LA VERDAD
// MercadoPago llamará a esta ruta cuando ocurra un pago.
app.post('/webhooks/mercadopago', async (c) => {
  const secret = c.req.header("x-signature"); // Recomendado validar esto en prod
  const body = await c.req.json();
  const db = c.env.DB;

  // Solo nos interesan los eventos de "pago actualizado" o "creado"
  // Nota: MP manda eventos de 'subscription_preapproval' y 'payment'.
  // Para entrega inmediata, escuchamos 'payment'.
  
  if (body.type === "payment" && body.action === "payment.created") {
    const paymentId = body.data.id;
    
    // 1. Preguntar a MP detalles del pago para ver quién es el usuario
    // (Usamos el ACCESS_TOKEN para validar que es real)
    const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { "Authorization": `Bearer ${c.env.MP_ACCESS_TOKEN}` }
    });
    
    const paymentData: any = await mpResponse.json();
    
    // Solo procesamos pagos APROBADOS
    if (paymentData.status === 'approved') {
      const userId = paymentData.external_reference; // ¡Aquí está el ID que enviamos al crear la suscripción!
      const dateApproved = new Date(paymentData.date_approved);
      
      // 2. Lógica de "Revista": Determinar qué Drop le toca
      // Si pagó en Septiembre 2025, desbloqueamos el drop 'sep-2025'
      // Ajusta este ID según tu formato en base de datos (ej: 'sep-2025' o '09-2025')
      const month = dateApproved.getMonth() + 1; // JS es 0-11, SQL suele ser 1-12
      const year = dateApproved.getFullYear();
      
      // Asumimos formato de ID 'sep-2025' o similar. 
      // Para ser más robusto, podrías buscar en la tabla 'drops' por mes/año.
      const monthStr = month < 10 ? `0${month}` : month; // '09'
      // Ojo: En tu seed data usaste IDs como 'sep-2025'. Vamos a intentar inferirlo o buscarlo.
      
      // ESTRATEGIA SEGURA: Buscar el drop por fecha
      const drop: any = await db.prepare(
        "SELECT id FROM drops WHERE month = ? AND year = ?"
      ).bind(month, year).first();

      if (drop && userId) {
        // 3. Escribir en el Ledger (Entregar el producto)
        try {
          await db.prepare(`
            INSERT INTO ledger (id, user_id, drop_id, source, payment_ref, unlocked_at)
            VALUES (?, ?, ?, 'subscription', ?, ?)
          `).bind(
            crypto.randomUUID(), 
            userId, 
            drop.id, 
            paymentId.toString(), 
            Date.now()
          ).run();
          
          console.log(`Drop ${drop.id} unlocked for user ${userId}`);
        } catch (e) {
          // Si ya existe (UNIQUE constraint), ignoramos el error. El usuario ya lo tenía.
          console.log("User already has this drop.");
        }
      }
    }
  }

  return c.json({ status: "ok" });
});

export const onRequest = handle(app);