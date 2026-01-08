import { Hono } from 'hono';
import { handle } from 'hono/cloudflare-pages';
import { secureHeaders } from 'hono/secure-headers';
import { cors } from 'hono/cors';
import { csrf } from 'hono/csrf';
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

// --- MIDDLEWARE DE SEGURIDAD (DEVSECOPS SPRINT 1 & 3) ---
app.use('*', secureHeaders()); 
app.use('*', cors({
  origin: (origin) => origin.endsWith('.pages.dev') || origin.includes('localhost') ? origin : null,
  credentials: true,
}));

// SPRINT 3: CSRF Protection (Solo permite peticiones del mismo origen)
app.use('*', csrf());

// --- FACTORY DE LUCIA AUTH ---
const getLucia = (db: any) => {
  const adapter = new D1Adapter(db, {
    user: "users",
    session: "sessions"
  });

  return new Lucia(adapter, {
    sessionCookie: {
      attributes: {
        secure: true, // Siempre secure en producción
        sameSite: "lax"
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

// --- RUTAS DE AUTENTICACIÓN ---

// 1. LOGIN
app.post('/auth/login-dev', async (c) => {
  const body = await c.req.json();
  const email = body.email?.toLowerCase().trim();
  
  if (!email || !email.includes('@')) {
    return c.json({ error: "Email inválido o requerido" }, 400);
  }

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

// SPRINT 3: LOGOUT (Invalidación de sesión)
app.post('/auth/logout', async (c) => {
  const lucia = c.get('lucia');
  const session = c.get('session');
  
  if (session) {
    await lucia.invalidateSession(session.id);
  }
  
  const logoutCookie = lucia.createBlankSessionCookie();
  c.header("Set-Cookie", logoutCookie.serialize(), { append: true });
  
  return c.json({ success: true });
});

// 2. USUARIO ACTUAL
app.get('/user', (c) => {
  const user = c.get('user');
  return c.json({ user: user || null });
});

// --- RESTO DE RUTAS (PROTEGIDAS) ---

app.post('/checkout/subscription', async (c) => {
  const user = c.get('user');
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  const accessToken = c.env.MP_ACCESS_TOKEN;
  if (!accessToken) return c.json({ error: "Server config error" }, 500);

  const origin = new URL(c.req.url).origin;
  const backUrl = `${origin}/?view=DASHBOARD&payment=success`;

  const payload = {
    reason: "Suscripción JACI Premium",
    auto_recurring: {
      frequency: 1,
      frequency_type: "months",
      transaction_amount: 99,
      currency_id: "MXN"
    },
    back_url: backUrl,
    payer_email: (user as any).email,
    external_reference: user.id,
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
    if (!mpResponse.ok) return c.json({ error: "Checkout error" }, 500);

    return c.json({ init_point: data.init_point });
  } catch (error) {
    return c.json({ error: "Network error" }, 500);
  }
});

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

  return c.json(results.map((d: any) => ({ ...d, is_unlocked: Boolean(d.is_unlocked) })));
});

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

app.post('/webhooks/mercadopago', async (c) => {
  const body = await c.req.json();
  const db = c.env.DB;

  if (body.type === "payment" && body.action === "payment.created") {
    const paymentId = body.data.id;
    const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { "Authorization": `Bearer ${c.env.MP_ACCESS_TOKEN}` }
    });
    
    const paymentData: any = await mpResponse.json();
    
    if (paymentData.status === 'approved') {
      const userId = paymentData.external_reference;
      const dateApproved = new Date(paymentData.date_approved);
      const month = dateApproved.getMonth() + 1;
      const year = dateApproved.getFullYear();
      
      const drop: any = await db.prepare(
        "SELECT id FROM drops WHERE month = ? AND year = ?"
      ).bind(month, year).first();

      if (drop && userId) {
        try {
          await db.prepare(`
            INSERT INTO ledger (id, user_id, drop_id, source, payment_ref, unlocked_at)
            VALUES (?, ?, ?, 'subscription', ?, ?)
          `).bind(crypto.randomUUID(), userId, drop.id, paymentId.toString(), Date.now()).run();
        } catch (e) {}
      }
    }
  }
  return c.json({ status: "ok" });
});

export const onRequest = handle(app);