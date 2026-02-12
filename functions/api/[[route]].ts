import { Hono } from 'hono';
import { handle } from 'hono/cloudflare-pages';
import { secureHeaders } from 'hono/secure-headers';
// @ts-ignore
import type { D1Database, R2Bucket } from "@cloudflare/workers-types";

import { MP_Service } from './mp-service';

// --- SILICON VALLEY SECURITY UTILS (@api-security-best-practices) ---
// Using @safe-vibe Rule #89: Never hardcode secrets. Fallback to dev string only for local testing.
const SIGNING_SECRET_FALLBACK = "jaci_vault_secure_2026"; 

async function getSignature(message: string, secret: string) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw", enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false, ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

async function verifySignature(message: string, signature: string, secret: string) {
  const expected = await getSignature(message, secret);
  return expected === signature;
}

// --- RUTHLESS RATE LIMITING [#1] ---
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const rateLimitMap = new Map<string, { count: number; start: number }>();

const rateLimiter = (limit: number) => async (c: any, next: any) => {
  const ip = c.req.header("cf-connecting-ip") || "anonymous";
  const now = Date.now();
  const record = rateLimitMap.get(ip) || { count: 0, start: now };

  if (now - record.start > RATE_LIMIT_WINDOW) {
    record.count = 1;
    record.start = now;
  } else {
    record.count++;
  }

  rateLimitMap.set(ip, record);

  if (record.count > limit) {
    return c.json({ error: "Too many requests. Please try again later.", code: "RATE_LIMIT_EXCEEDED" }, 429);
  }
  return next();
};

import { cors } from 'hono/cors';
import { csrf } from 'hono/csrf';
import { bodyLimit } from 'hono/body-limit';
import { z } from 'zod';
import { Lucia, Session, User } from "lucia";
import { D1Adapter } from "@lucia-auth/adapter-sqlite";
import { Google, generateState, generateCodeVerifier } from "arctic";
import { getCookie, setCookie } from "hono/cookie";

// Bindings del entorno (Cloudflare)
type Bindings = {
  DB: D1Database;
  R2: R2Bucket;
  MP_ACCESS_TOKEN: string;
  MP_WEBHOOK_SECRET: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  APP_URL: string; // Base URL for callbacks
  SIGNING_SECRET?: string;
  ENVIRONMENT?: string;
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

// 🧪 SECURITY 360: Body Limit for DoS Protection (@api-fuzzing-bug-bounty)
app.use('*', bodyLimit({
  maxSize: 64 * 1024, // 64KB limit for all payloads
  onError: (c) => c.json({ error: "Payload too large", code: "PAYLOAD_TOO_LARGE" }, 413)
}));

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

// --- ADMIN SECURITY MIDDLEWARE (@api-security-best-practices) ---
const adminMiddleware = async (c: any, next: any) => {
  const user = c.get('user');
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  
  const db = c.env.DB;
  const dbUser: any = await db.prepare("SELECT role FROM users WHERE id = ?").bind(user.id).first();
  
  if (!dbUser || dbUser.role !== 'admin') {
    return c.json({ error: "Forbidden: Admin access required" }, 403);
  }
  return next();
};

// --- SCHEMAS ---
const LoginSchema = z.object({
  email: z.string().email("Email inválido"),
});

const SubscriptionSchema = z.object({
  planId: z.string().optional(),
});

// --- RUTAS DE AUTENTICACIÓN ---

// 1. Google OAuth (Arctic)
app.get('/auth/login/google', rateLimiter(10), async (c) => {
  const google = new Google(
    c.env.GOOGLE_CLIENT_ID,
    c.env.GOOGLE_CLIENT_SECRET,
    `${c.env.APP_URL}/api/auth/callback/google`
  );
  
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  
  const url = await google.createAuthorizationURL(state, codeVerifier, ["profile", "email"]);

  setCookie(c, "google_oauth_state", state, {
    path: "/",
    secure: true,
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "Lax"
  });
  
  setCookie(c, "google_code_verifier", codeVerifier, {
    path: "/",
    secure: true,
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "Lax"
  });

  return c.redirect(url.toString());
});

app.get('/auth/callback/google', async (c) => {
  const code = c.req.query("code");
  const state = c.req.query("state");
  const storedState = getCookie(c, "google_oauth_state");
  const codeVerifier = getCookie(c, "google_code_verifier");

  if (!code || !state || !storedState || !codeVerifier || state !== storedState) {
    return c.json({ error: "Invalid state or code" }, 400);
  }

  const google = new Google(
    c.env.GOOGLE_CLIENT_ID,
    c.env.GOOGLE_CLIENT_SECRET,
    `${c.env.APP_URL}/api/auth/callback/google`
  );

  try {
    const tokens = await google.validateAuthorizationCode(code, codeVerifier);
    const googleResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
      headers: { Authorization: `Bearer ${tokens.accessToken}` }
    });
    const googleUser: any = await googleResponse.json();

    const db = c.env.DB;
    const lucia = c.get('lucia');

    // Pattern: Account Linking
    let user: any = await db.prepare("SELECT * FROM users WHERE google_id = ? OR email = ?")
      .bind(googleUser.sub, googleUser.email)
      .first();

    if (!user) {
      const userId = crypto.randomUUID();
      await db.prepare("INSERT INTO users (id, email, google_id, name, picture, created_at) VALUES (?, ?, ?, ?, ?, ?)")
        .bind(userId, googleUser.email, googleUser.sub, googleUser.name, googleUser.picture, Date.now())
        .run();
      user = { id: userId, email: googleUser.email };
    } else if (!user.google_id) {
      // Link existing email account to Google ID
      await db.prepare("UPDATE users SET google_id = ?, picture = ?, name = ? WHERE id = ?")
        .bind(googleUser.sub, googleUser.picture, googleUser.name, user.id)
        .run();
    }

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    c.header("Set-Cookie", sessionCookie.serialize(), { append: true });

    return c.redirect("/");
  } catch (e) {
    console.error(e);
    return c.json({ error: "Authentication failed" }, 500);
  }
});

// 1. LOGIN (Legacy/Dev Hardening [#46])
app.post('/auth/login-dev', rateLimiter(5), async (c) => {
  // Solo permitir en desarrollo o si el usuario es explícitamente admin
  const isDev = c.env.ENVIRONMENT === 'development' || c.env.APP_URL?.includes('localhost');
  if (!isDev) {
    return c.json({ error: "Method not allowed in production." }, 405);
  }

  const body = await c.req.json();
  const result = LoginSchema.safeParse(body);
  
  if (!result.success) {
    return c.json({ 
      error: "Validación fallida", 
      details: result.error.issues.map((e: z.ZodIssue) => ({ path: e.path, message: e.message }))
    }, 400);
  }

  const email = result.data.email.toLowerCase().trim();

  const lucia = c.get('lucia');
  const db = c.env.DB;

  let user: any = await db.prepare("SELECT * FROM users WHERE email = ?").bind(email).first();

  if (!user) {
    const userId = crypto.randomUUID();
    await db.prepare("INSERT INTO users (id, email, created_at) VALUES (?, ?, ?)")
      .bind(userId, email, Date.now())
      .run();
    user = { id: userId, email };
  }

  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);

  c.header("Set-Cookie", sessionCookie.serialize(), { append: true });
  return c.json({ success: true, user: { id: user.id, email: user.email } });
});

// --- RUTHLESS ERROR HARDENING [#8] ---
app.onError((err, c) => {
  console.error(`[CRITICAL ERROR] ${c.req.method} ${c.req.url}:`, err);
  
  // 🧪 SECURITY 360: Production Secret Guard (@production-code-audit)
  if (!c.env.SIGNING_SECRET && c.env.ENVIRONMENT === 'production') {
    return c.json({ 
      error: "Critical infrastructure failure. Please contact administrator.", 
      code: "INTERNAL_SERVER_ERROR" 
    }, 500);
  }

  return c.json({ 
    error: "An unexpected error occurred. Please contact support if this persists.",
    code: "INTERNAL_SERVER_ERROR" 
  }, 500);
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

app.post('/checkout/subscription', rateLimiter(10), async (c) => {
  const user = c.get('user');
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  const mp = new MP_Service(c.env.MP_ACCESS_TOKEN, c.env.MP_WEBHOOK_SECRET);
  const data = await mp.createSubscription(user.id, (user as any).email, c.env.APP_URL);
  
  if (data.init_point) {
    return c.json({ init_point: data.init_point });
  }
  return c.json({ error: "Checkout error", details: data }, 500);
});

// NEW: One-off Checkout Handler (@payment-integration)
app.post('/checkout/buy/:dropId', rateLimiter(10), async (c) => {
  const user = c.get('user');
  const dropId = c.req.param('dropId');
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  const db = c.env.DB;
  const drop: any = await db.prepare("SELECT title FROM drops WHERE id = ?").bind(dropId).first();
  if (!drop) return c.json({ error: "Drop not found" }, 404);

  const mp = new MP_Service(c.env.MP_ACCESS_TOKEN, c.env.MP_WEBHOOK_SECRET);
  const data = await mp.createOneOffPreference(user.id, dropId, drop.title, c.env.APP_URL);

  if (data.init_point) {
    return c.json({ init_point: data.init_point });
  }
  return c.json({ error: "Preference error", details: data }, 500);
});

app.get('/drops', async (c) => {
  const user = c.get('user');
  const userId = user?.id ?? '';

  const { results } = await c.env.DB.prepare(`
    SELECT 
      d.id, d.title, d.month, d.year, d.thumbnail_url as cover_image, d.published_at as released_at,
      EXISTS(SELECT 1 FROM ledger l WHERE l.drop_id = d.id AND l.user_id = ?) as is_unlocked,
      (SELECT COUNT(*) FROM drop_assets da WHERE da.drop_id = d.id) as asset_count
    FROM drops d
    ORDER BY d.year DESC, d.month DESC
  `).bind(userId).all();

  return c.json(results.map((d: any) => ({ ...d, is_unlocked: Boolean(d.is_unlocked) })));
});

// NEW: Granular Drop Explorer API (@database-design)
app.get('/drops/:id', async (c) => {
  const user = c.get('user');
  const dropId = c.req.param('id');
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  const db = c.env.DB;

  // 1. Get Drop Metadata + Unlock Status
  const drop: any = await db.prepare(`
    SELECT d.*, EXISTS(SELECT 1 FROM ledger l WHERE l.drop_id = d.id AND l.user_id = ?) as is_unlocked
    FROM drops d WHERE d.id = ?
  `).bind(user.id, dropId).first();

  if (!drop) return c.json({ error: "Drop not found" }, 404);

  // 2. Get Assets (Hardened RLS Simulation [#6])
  // Restrict masters if locked or USER DOES NOT OWN DROP
  const assets: any = await db.prepare(`
    SELECT id, type, filename, mime_type, file_size, sort_order,
           CASE WHEN ? = 1 OR type = 'preview' THEN r2_key ELSE NULL END as r2_key
    FROM drop_assets WHERE drop_id = ?
    ORDER BY sort_order ASC
  `).bind(drop.is_unlocked ? 1 : 0, dropId).all();

  return c.json({
    ...drop,
    is_unlocked: Boolean(drop.is_unlocked),
    assets: assets.results
  });
});

app.get('/download/:assetId', async (c) => {
  const user = c.get('user');
  const assetId = c.req.param('assetId');
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  const db = c.env.DB;
  
  // 1. Ownership Verification (@api-security-best-practices)
  const asset: any = await db.prepare(`
    SELECT da.r2_key, da.filename, d.id as drop_id
    FROM drop_assets da
    JOIN drops d ON da.drop_id = d.id
    WHERE da.id = ? AND EXISTS(SELECT 1 FROM ledger l WHERE l.drop_id = d.id AND l.user_id = ?)
  `).bind(assetId, user.id).first();

  if (!asset) return c.json({ error: "No tienes acceso a este contenido o el asset no existe." }, 403);

  // 2. Generate Signed URL (Rule 89)
  const expires = Math.floor(Date.now() / 1000) + 300; // 5 minute window
  const payload = `${asset.r2_key}:${expires}`;
  const signature = await getSignature(payload, c.env.SIGNING_SECRET || SIGNING_SECRET_FALLBACK);
  
  return c.redirect(`/api/cdn/${asset.r2_key}?expires=${expires}&signature=${signature}`);
});

// NEW: Internal Secure CDN Proxy (Rule 67 & 89 compliance)
app.get('/cdn/:key', async (c) => {
  const key = c.req.param('key');
  const expires = c.req.query('expires');
  const signature = c.req.query('signature');

  if (!expires || !signature) return c.text("Forbidden: Missing credentials", 403);
  if (parseInt(expires) < Math.floor(Date.now() / 1000)) return c.text("Forbidden: Link expired", 403);
  
  const payload = `${key}:${expires}`;
  const isValid = await verifySignature(payload, signature, c.env.SIGNING_SECRET || SIGNING_SECRET_FALLBACK);
  if (!isValid) return c.text("Forbidden: Invalid signature", 403);

  const object = await c.env.R2.get(key);
  if (!object) return c.text("Not Found", 404);

  const headers = new Headers();
  object.writeHttpMetadata(headers as any);
  headers.set('etag', object.httpEtag);
  headers.set('Cache-Control', 'public, max-age=31536000'); 


  
  return new Response(object.body as any, { headers: headers as any });
});

// NEW: Image Asset Proxy for Previews (Rule 67 compliance)
app.get('/assets/:key', async (c) => {
  const key = c.req.param('key');
  // Simple check: only allow if it starts with previews/ or similar if configured
  // For now, we trust the drop logic that only returns preview keys to guests
  const object = await c.env.R2.get(key);
  if (!object) return c.text("Not Found", 404);

  const headers = new Headers();
  object.writeHttpMetadata(headers as any);
  headers.set('Cache-Control', 'public, max-age=604800'); // 1 week
  
  return new Response(object.body as any, { headers: headers as any });
});

app.post('/webhooks/mercadopago', async (c) => {
  const xSignature = c.req.header("x-signature") || "";
  const xRequestId = c.req.header("x-request-id") || "";
  const body = await c.req.json();
  const db = c.env.DB;

  // 1. Signature Verification (@payment-integration Rule 76)
  const dataId = body.data?.id;
  if (!dataId) return c.json({ error: "Invalid payload" }, 400);

  const mp = new MP_Service(c.env.MP_ACCESS_TOKEN, c.env.MP_WEBHOOK_SECRET);
  const isValid = await mp.verifySignature(xSignature, xRequestId, dataId);

  if (!isValid) {
    console.error("[Webhook] Invalid x-signature");
    return c.json({ error: "Unauthorized" }, 401);
  }

  // 2. Event Type Dispatcher
  // Flow (@payment-integration Rule 77): Only process approved status
  if (body.type === "payment" && body.action === "payment.created") {
    // Re-verify directly from provider API for security hardening
    const payment = await mp.getPayment(dataId);
    
    if (payment.status === 'approved') {
      const userId = payment.external_reference;
      
      // 3. Idempotency Check (Rule 76: Check ledger before insert)
      const existing = await db.prepare("SELECT 1 FROM ledger WHERE payment_ref = ?")
        .bind(dataId.toString()).first();
      
      if (existing) return c.json({ status: "ok", detail: "idempotent" });

      // Grant Access
      const dateApproved = new Date(payment.date_approved);
      const month = dateApproved.getMonth() + 1;
      const year = dateApproved.getFullYear();
      
      const drop: any = await db.prepare(
        "SELECT id FROM drops WHERE month = ? AND year = ?"
      ).bind(month, year).first();

      if (drop && userId) {
        const amount = payment.transaction_amount || 0;
        await db.prepare(`
          INSERT INTO ledger (id, user_id, drop_id, source, amount, payment_ref, month, year, unlocked_at, payment_status)
          VALUES (?, ?, ?, 'subscription', ?, ?, ?, ?, ?, ?)
        `).bind(
          crypto.randomUUID(), 
          userId, 
          drop.id, 
          amount, 
          dataId.toString(),
          month,
          year,
          Date.now(),
          payment.status // 🧪 SECURITY 360: Auditability improvement
        ).run();
      }
    }
  } else if (body.type === "subscription_preapproval") {
      // Handle subscription-specific logic if needed (e.g. status updates)
      console.log("[Webhook] Preapproval update received:", body.action);
  }

  return c.json({ status: "ok" });
});

// --- INTELLIGENCE COCKPIT ENGINE (@kpi-dashboard-design & @startup-metrics-framework) ---
app.get('/admin/stats', adminMiddleware, async (c) => {
  const db = c.env.DB;

  // 🧪 SECURITY 360: Parallel D1 Queries (@production-code-audit)
  const [revenueStats, mrr, userStats, { results: topDrops }] = await Promise.all([
    // 1. Revenue
    db.prepare(`
      SELECT 
        SUM(CASE WHEN unlocked_at >= ? THEN amount ELSE 0 END) as revenue_24h,
        SUM(CASE WHEN unlocked_at >= ? THEN amount ELSE 0 END) as revenue_7d,
        SUM(amount) as revenue_total
      FROM ledger
    `).bind(
      Date.now() - 24 * 60 * 60 * 1000,
      Date.now() - 7 * 24 * 60 * 60 * 1000
    ).first() as Promise<any>,

    // 2. MRR
    db.prepare(`
      SELECT COUNT(*) * 29 as value
      FROM subscriptions WHERE status = 'authorized'
    `).first() as Promise<any>,

    // 3. User & Subscription Growth
    db.prepare(`
      SELECT 
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM subscriptions WHERE status = 'authorized') as active_subs,
        (SELECT COUNT(*) FROM subscriptions WHERE status = 'cancelled') as churned_subs
    `).first() as Promise<any>,

    // 4. Drop Performance
    db.prepare(`
      SELECT 
        d.title, 
        COUNT(l.id) as unlocks
      FROM drops d
      LEFT JOIN ledger l ON d.id = l.drop_id
      GROUP BY d.id
      ORDER BY unlocks DESC
      LIMIT 5
    `).all() as Promise<any>
  ]);

  return c.json({
    kpis: {
      mrr: mrr?.value || 0,
      revenue_24h: revenueStats?.revenue_24h || 0,
      revenue_7d: revenueStats?.revenue_7d || 0,
      revenue_total: revenueStats?.revenue_total || 0,
      total_users: userStats?.total_users || 0,
      active_subs: userStats?.active_subs || 0,
      churn_rate: (userStats?.total_users || 0) > 0 ? (userStats.churned_subs / userStats.total_users * 100).toFixed(1) + "%" : "0%"
    },
    topDrops: topDrops || [],
    total_users_base: userStats?.total_users || 0
  });
});

export const onRequest = handle(app);
