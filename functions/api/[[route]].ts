
import { Hono } from 'hono';
import { handle } from 'hono/cloudflare-pages';
import { Lucia, generateIdFromEntropySize, Session, User } from "lucia";
import { D1Adapter } from "@lucia-auth/adapter-sqlite";

// Bindings reales según tu configuración en Cloudflare Dashboard
type Bindings = {
  DB: any; // D1Database
  R2: any; // R2Bucket
  MP_ACCESS_TOKEN: string; // MercadoPago Access Token
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
        secure: true // Cloudflare Pages siempre es HTTPS
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

// --- ROUTES ---

// 1. LOGIN DE DESARROLLADOR (Para probar sin Google Auth aún)
app.post('/auth/login-dev', async (c) => {
  const { email } = await c.req.json();
  if (!email) return c.json({ error: "Email required" }, 400);

  const lucia = c.get('lucia');
  const db = c.env.DB;

  // Buscar usuario existente
  let user: any = await db.prepare("SELECT * FROM users WHERE email = ?").bind(email).first();

  if (!user) {
    // Crear usuario si no existe (Auto-Registration para Dev)
    const userId = generateIdFromEntropySize(10);
    await db.prepare("INSERT INTO users (id, email) VALUES (?, ?)")
      .bind(userId, email)
      .run();
    user = { id: userId, email };
  }

  // Crear sesión
  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);

  c.header("Set-Cookie", sessionCookie.serialize(), { append: true });
  return c.json({ success: true, user: { id: user.id, email: user.email } });
});

// 2. OBTENER USUARIO ACTUAL
app.get('/user', (c) => {
  const user = c.get('user');
  return c.json({ user: user || null });
});

// 3. EL CATÁLOGO (MAGAZINE MODE)
// Devuelve todos los drops y marca con "is_unlocked" los que el usuario posee.
app.get('/drops', async (c) => {
  const user = c.get('user');
  const userId = user?.id ?? ''; // Si no hay usuario, userId es cadena vacía (nadie es dueño de nada)

  const { results } = await c.env.DB.prepare(`
    SELECT 
      d.id, 
      d.title, 
      d.month, 
      d.year, 
      d.cover_image,
      d.released_at,
      CASE 
        WHEN l.user_id IS NOT NULL THEN 1 
        ELSE 0 
      END as is_unlocked
    FROM drops d
    LEFT JOIN ledger l ON d.id = l.drop_id AND l.user_id = ?
    ORDER BY d.year DESC, d.month DESC
  `).bind(userId).all();

  // Convertimos el 1/0 de SQLite a Boolean real para el Frontend
  const drops = results.map((d: any) => ({
    ...d,
    is_unlocked: Boolean(d.is_unlocked)
  }));

  return c.json(drops);
});

// 4. DESCARGA SEGURA (THE VAULT)
// Verifica propiedad en Ledger -> Stream desde R2
app.get('/download/:dropId', async (c) => {
  const user = c.get('user');
  const dropId = c.req.param('dropId');

  if (!user) return c.json({ error: "Unauthorized" }, 401);

  // Verificar en el Ledger (La verdad absoluta)
  // Nota: Usamos 'r2_path' que es el nombre correcto en tu Schema
  const ownership = await c.env.DB.prepare(`
    SELECT drops.r2_path, drops.title 
    FROM ledger 
    JOIN drops ON ledger.drop_id = drops.id 
    WHERE ledger.drop_id = ? AND ledger.user_id = ?
  `).bind(dropId, user.id).first() as { r2_path: string, title: string } | null;

  if (!ownership) {
    return c.json({ error: "Forbidden: You do not own this drop" }, 403);
  }

  // Obtener objeto de R2
  const object = await c.env.R2.get(ownership.r2_path);

  if (!object) {
    return c.json({ error: "Asset missing in R2 bucket" }, 404);
  }

  // Stream binario al navegador
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);
  // Forzamos la descarga con el nombre bonito del título
  const safeFilename = ownership.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  headers.set('Content-Disposition', `attachment; filename="${safeFilename}.zip"`);

  return new Response(object.body, { headers });
});

// 5. CHECKOUT SUSCRIPCIÓN (MERCADOPAGO)
app.post('/checkout/subscription', async (c) => {
  const user = c.get('user');
  
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  // Configuración del Payload para Preapproval (Suscripción)
  const payload = {
    reason: "Suscripción JACI Monstruomente",
    auto_recurring: {
      frequency: 1,
      frequency_type: "months",
      transaction_amount: 99,
      currency_id: "MXN"
    },
    back_url: "https://jaci.pages.dev/?view=DASHBOARD&payment=success",
    external_reference: user.id, // Vinculamos la suscripción al ID del usuario
    // Fix: Access custom email property via any cast
    payer_email: (user as any).email,
    status: "pending"
  };

  try {
    const response = await fetch("https://api.mercadopago.com/preapproval", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${c.env.MP_ACCESS_TOKEN}`
      },
      body: JSON.stringify(payload)
    });

    const data: any = await response.json();

    if (!response.ok) {
      console.error("MercadoPago Error:", data);
      return c.json({ error: "Payment creation failed", details: data }, 500);
    }

    // Retornamos el link de pago (init_point)
    return c.json({ init_point: data.init_point });
  } catch (error) {
    console.error("Internal Error:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

export const onRequest = handle(app);