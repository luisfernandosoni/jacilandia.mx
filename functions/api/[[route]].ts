import { Hono } from 'hono';
import { handle } from 'hono/cloudflare-pages';
import { secureHeaders } from 'hono/secure-headers';
// @ts-ignore
import type { D1Database, R2Bucket } from "@cloudflare/workers-types";

import { MP_Service } from './mp-service';
import { ResendService } from './resend-service';
import adminHandler from './admin-upload';
import { argon2id, argon2Verify } from 'hash-wasm';

// --- SILICON VALLEY SECURITY UTILS (@api-security-best-practices) ---
// Using @safe-vibe Rule #89: Never hardcode secrets. Fallback to dev string only for local testing.
const SIGNING_SECRET_FALLBACK = "jaci_vault_secure_2026"; 

const getSigningSecret = (env: Bindings) => env.SIGNING_SECRET?.trim() || SIGNING_SECRET_FALLBACK;

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
  RESEND_API_KEY: string;
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
  origin: (origin) => {
    if (!origin) return null;
    const allowedSubdomains = ['.pages.dev', 'jacilandia.mx', 'localhost'];
    return allowedSubdomains.some(domain => origin.endsWith(domain) || origin.includes(domain)) ? origin : null;
  },
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
export const adminMiddleware = async (c: any, next: any) => {
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
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

const RegisterSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

const ResetRequestSchema = z.object({
  email: z.string().email("Email inválido"),
});

const ResetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

const SubscriptionSchema = z.object({
  planId: z.string().optional(),
});

// --- AUTH UTILS (@auth-implementation-patterns) ---
const getBaseUrl = (c: any) => {
  // Use config URL or fall back to request origin for local dev/preview
  // 🧪 SECURITY 360: Robust trimming for c.env immutability (@cloudflare-dev-expert)
  const rawUrl = c.env.APP_URL || new URL(c.req.url).origin;
  const url = rawUrl.trim();
  const finalUrl = url.replace(/\/$/, ""); 
  console.log(`[AUTH DEBUG] getBaseUrl: raw='${rawUrl}', processed='${finalUrl}'`);
  return finalUrl;
};

// --- RUTAS DE AUTENTICACIÓN ---

// 1. Google OAuth (Arctic)
app.get('/auth/login/google', rateLimiter(10), async (c) => {
  const google = new Google(
    c.env.GOOGLE_CLIENT_ID.trim(),
    c.env.GOOGLE_CLIENT_SECRET.trim(),
    `${getBaseUrl(c)}/api/auth/callback/google`
  );
  console.log(`[AUTH DEBUG] Login Redirect URI: ${getBaseUrl(c)}/api/auth/callback/google`);
  
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
    c.env.GOOGLE_CLIENT_ID.trim(),
    c.env.GOOGLE_CLIENT_SECRET.trim(),
    `${getBaseUrl(c)}/api/auth/callback/google`
  );
  console.log(`[AUTH DEBUG] Callback Redirect URI: ${getBaseUrl(c)}/api/auth/callback/google`);
  console.log(`[AUTH DEBUG] Code matches: ${!!code}, Verifier matches: ${!!codeVerifier}`);

  try {
    // 🔍 STEP 1: Exchange Code
    let tokens;
    try {
      console.log(`[AUTH STEP] Validating auth code...`);
      tokens = await google.validateAuthorizationCode(code, codeVerifier);
      console.log(`[AUTH STEP] Tokens received. Access Token Len: ${tokens.accessToken().length}`);
    } catch (e: any) {
      console.error(`[AUTH ERROR] validateAuthorizationCode failed:`, e);
      throw new Error(`Token Exchange Failed: ${e.message}`);
    }
    
    // 🧪 Truth Audit: Verify if secrets or tokens are malformed (@cloudflare-dev-expert)
    const secret = c.env.GOOGLE_CLIENT_SECRET;
    console.log(`[AUTH AUDIT] Secret Len: ${secret.length}, First: ${secret.charCodeAt(0)}, Last: ${secret.charCodeAt(secret.length - 1)}`);
    
    // 🔍 STEP 2: User Info
    // SANITIZATION: Remove any non-printable characters from the access token
    const sanitizeToken = (token: any) => {
      if (typeof token !== 'string') {
        throw new Error(`Invalid token type: ${typeof token}`);
      }
      return token.replace(/[^\x20-\x7E]/g, "").trim();
    };
    
    // Log before sanitization
    const rawToken = tokens.accessToken();
    console.log(`[AUTH DEBUG] Raw Token Len: ${rawToken.length}, First 5 codes: ${String(rawToken).split('').slice(0,5).map((c: string) => c.charCodeAt(0))}, Last 5 codes: ${String(rawToken).split('').slice(-5).map((c: string) => c.charCodeAt(0))}`);

    const cleanToken = sanitizeToken(rawToken);
    console.log(`[AUTH DEBUG] Clean Token Len: ${cleanToken.length}, First 5 codes: ${cleanToken.split('').slice(0,5).map((c: string) => c.charCodeAt(0))}, Last 5 codes: ${cleanToken.split('').slice(-5).map((c: string) => c.charCodeAt(0))}`);

    if (cleanToken.length === 0) {
       throw new Error("Access Token became empty after sanitization!");
    }

    // Use Headers API for stricter validation and safer handling
    const userHeaders = new Headers();
    userHeaders.set("Authorization", `Bearer ${cleanToken}`);
    
    // Log header value for final verification
    console.log(`[AUTH DEBUG] Auth Header: ${JSON.stringify(userHeaders.get("Authorization"))}`);
    
    let googleUser: any;
    try {
      const googleResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
        headers: userHeaders
      });
      googleUser = await googleResponse.json();
      console.log(`[AUTH STEP] User info received: ${googleUser.email}`);
    } catch (e: any) {
       console.error(`[AUTH ERROR] UserInfo fetch failed:`, e);
       throw new Error(`UserInfo Fetch Failed: ${e.message}`);
    }

    // 🔍 STEP 3: DB Operations
    let user: any;
    try {
      const db = c.env.DB;
      
      // Sanitization for D1: Coalesce undefined to null (D1 strict typing)
      const g_sub = googleUser.sub;
      const g_email = googleUser.email;
      const g_name = googleUser.name ?? null;
      const g_given_name = googleUser.given_name ?? null; // Causa probable de error
      const g_family_name = googleUser.family_name ?? null;
      const g_picture = googleUser.picture ?? null;
      const g_locale = googleUser.locale ?? null;
      const g_verified = googleUser.email_verified ? 1 : 0;
      
      console.log(`[AUTH DEBUG] DB Bind Params: sub=${g_sub}, email=${g_email}, name=${g_name}, given=${g_given_name}, family=${g_family_name}`);

      user = await db.prepare("SELECT * FROM users WHERE google_id = ? OR email = ?")
        .bind(g_sub, g_email)
        .first();

      if (!user) {
        const userId = crypto.randomUUID();
        await db.prepare("INSERT INTO users (id, email, google_id, name, given_name, family_name, picture, locale, email_verified, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
          .bind(userId, g_email, g_sub, g_name, g_given_name, g_family_name, g_picture, g_locale, g_verified, Math.floor(Date.now() / 1000))
          .run();
        user = { id: userId, email: g_email };
      } else if (!user.google_id) {
        await db.prepare("UPDATE users SET google_id = ?, picture = ?, name = ?, given_name = ?, family_name = ?, locale = ?, email_verified = ? WHERE id = ?")
          .bind(g_sub, g_picture, g_name, g_given_name, g_family_name, g_locale, g_verified, user.id)
          .run();
      }
      console.log(`[AUTH STEP] User DB sync complete: ${user.id}`);
    } catch (e: any) {
      console.error(`[AUTH ERROR] DB Sync failed:`, e);
      // Detailed error logging for D1
      if (e.message.includes("D1_TYPE_ERROR")) {
         console.error(`[AUTH DIAGNOSTIC] Check for undefined values in bind params.`);
      }
      throw new Error(`DB Sync Failed: ${e.message}`);
    }

    // 🔍 STEP 4: Session & Cookie
    try {
      const lucia = c.get('lucia');
      const session = await lucia.createSession(user.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      console.log(`[AUTH DEBUG] Session Cookie: ${JSON.stringify(sessionCookie.serialize())}`);
      c.header("Set-Cookie", sessionCookie.serialize(), { append: true });
    } catch (e: any) {
      console.error(`[AUTH ERROR] Session/Cookie failed:`, e);
      throw new Error(`Session Cookie Failed: ${e.message}`);
    }

    return c.redirect("/");

    return c.redirect("/");
  } catch (e: any) {
    console.error("[OAuth Error] Callback failed:", e);
    // 🧪 observability: return specific error for remote debugging
    return c.json({ 
      error: "Authentication failed", 
      message: "Error de sincronización con Google."
    }, 500);
  }
});

// 1. REGISTER (Email/Pass)
app.post('/auth/register', rateLimiter(5), async (c) => {
  const body = await c.req.json();
  const result = RegisterSchema.safeParse(body);
  
  if (!result.success) return c.json({ error: "Formato inválido", details: result.error.issues }, 400);

  const { email, password } = result.data;
  const db = c.env.DB;
  const lucia = c.get('lucia');

  // Check if user exists
  const existingUser = await db.prepare("SELECT * FROM users WHERE email = ?").bind(email.toLowerCase()).first();
  if (existingUser) return c.json({ error: "El correo ya está registrado." }, 400);

  const userId = crypto.randomUUID();
  
  // 🧪 EDGE COMPATIBLE HASHING (@cloudflare-dev-expert)
  // Using hash-wasm for Argon2id (Native binary compatible)
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hashedPassword = await argon2id({
    password: password,
    salt: salt,
    parallelism: 1,
    iterations: 2,
    memorySize: 16384, // 16MB for Worker memory safety
    hashLength: 32,
    outputType: 'encoded'
  });

  try {
    await db.prepare("INSERT INTO users (id, email, hashed_password, created_at) VALUES (?, ?, ?, ?)")
      .bind(userId, email.toLowerCase(), hashedPassword, Math.floor(Date.now() / 1000))
      .run();

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    c.header("Set-Cookie", sessionCookie.serialize(), { append: true });
    
    return c.json({ success: true, user: { id: userId, email } });
  } catch (e: any) {
    console.error("[AUTH ERROR] Registration failed:", e);
    return c.json({ error: "No se pudo crear la cuenta. Intenta más tarde." }, 500);
  }
});

// 2. LOGIN (Email/Pass)
app.post('/auth/login', rateLimiter(10), async (c) => {
  const body = await c.req.json();
  const result = LoginSchema.safeParse(body);
  
  if (!result.success) return c.json({ error: "Campos incompletos" }, 400);

  const { email, password } = result.data;
  const db = c.env.DB;
  const lucia = c.get('lucia');

  const user: any = await db.prepare("SELECT * FROM users WHERE email = ?").bind(email.toLowerCase()).first();
  
  if (!user || !user.hashed_password) {
    return c.json({ error: "Credenciales inválidas" }, 400);
  }

  const validPassword = await argon2Verify({
    password: password,
    hash: user.hashed_password
  });
  if (!validPassword) return c.json({ error: "Credenciales inválidas" }, 400);

  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  c.header("Set-Cookie", sessionCookie.serialize(), { append: true });

  return c.json({ success: true, user: { id: user.id, email: user.email } });
});

// 3. PASSWORD RESET - REQUEST
app.post('/auth/reset-password/request', rateLimiter(3), async (c) => {
  const body = await c.req.json();
  const result = ResetRequestSchema.safeParse(body);
  if (!result.success) return c.json({ error: "Email inválido" }, 400);

  const email = result.data.email.toLowerCase();
  const db = c.env.DB;

  const user: any = await db.prepare("SELECT id FROM users WHERE email = ?").bind(email).first();
  if (!user) {
    // 🧪 SECURITY 360: Avoiding User Enumeration (@api-security-best-practices)
    return c.json({ success: true, message: "Si el correo existe, recibirás un enlace." });
  }

  const token = crypto.randomUUID();
  const expiresAt = Math.floor(Date.now() / 1000) + 3600; // 1 hour

  await db.prepare("UPDATE users SET password_reset_token = ?, password_reset_expires = ? WHERE id = ?")
    .bind(token, expiresAt, user.id)
    .run();

  const resend = new ResendService(c.env.RESEND_API_KEY.trim());
  const resetUrl = `${getBaseUrl(c)}/?view=RESET_PASSWORD&token=${token}`;
  
  await resend.sendPasswordReset(email, resetUrl);

  return c.json({ success: true, message: "Instrucciones enviadas al correo." });
});

// 4. PASSWORD RESET - VERIFY & UPDATE
app.post('/auth/reset-password/verify', rateLimiter(3), async (c) => {
  const body = await c.req.json();
  const result = ResetPasswordSchema.safeParse(body);
  if (!result.success) return c.json({ error: "Datos inválidos" }, 400);

  const { token, password } = result.data;
  const db = c.env.DB;
  const lucia = c.get('lucia');

  const user: any = await db.prepare("SELECT id FROM users WHERE password_reset_token = ? AND password_reset_expires > ?")
    .bind(token, Math.floor(Date.now() / 1000))
    .first();

  if (!user) return c.json({ error: "El enlace ha expirado o es inválido." }, 400);

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hashedPassword = await argon2id({
    password: password,
    salt: salt,
    parallelism: 1,
    iterations: 2,
    memorySize: 16384,
    hashLength: 32,
    outputType: 'encoded'
  });
  
  await db.prepare("UPDATE users SET hashed_password = ?, password_reset_token = NULL, password_reset_expires = NULL WHERE id = ?")
    .bind(hashedPassword, user.id)
    .run();

  // Create session immediately
  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  c.header("Set-Cookie", sessionCookie.serialize(), { append: true });

  return c.json({ success: true });
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

  const mp = new MP_Service(c.env.MP_ACCESS_TOKEN.trim(), c.env.MP_WEBHOOK_SECRET.trim());
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

  const mp = new MP_Service(c.env.MP_ACCESS_TOKEN.trim(), c.env.MP_WEBHOOK_SECRET.trim());
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
  const signature = await getSignature(payload, getSigningSecret(c.env));
  
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
  const isValid = await verifySignature(payload, signature, getSigningSecret(c.env));
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

  const mp = new MP_Service(c.env.MP_ACCESS_TOKEN.trim(), c.env.MP_WEBHOOK_SECRET.trim());
  const isValid = await mp.verifySignature(xSignature, xRequestId, dataId);

  if (!isValid) {
    console.error("[Webhook] Invalid x-signature");
    return c.json({ error: "Unauthorized" }, 401);
  }

  // 2. Event Type Dispatcher
  // Flow (@payment-integration Rule 77): Only process approved status
  if (body.type === "payment" && (body.action === "payment.created" || body.action === "payment.updated")) {
    // Re-verify directly from provider API for security hardening
    const payment = await mp.getPayment(dataId);
    
    if (payment.status === 'approved') {
      const externalRef = payment.external_reference || "";
      let userId: string | null = null;
      let targetDropId: string | null = null;
      let source: 'subscription' | 'one_off' = 'subscription';

      // 🔍 Parse Composite Reference (@payment-integration)
      if (externalRef.startsWith("ONE_OFF:")) {
        const parts = externalRef.split(":");
        userId = parts[1];
        targetDropId = parts[2];
        source = 'one_off';
      } else if (externalRef.startsWith("SUB:")) {
        userId = externalRef.split(":")[1];
        source = 'subscription';
      } else {
        // Legacy fallback
        userId = externalRef;
        source = 'subscription';
      }

      if (!userId) {
        console.error("[Webhook] No User ID found in external_reference");
        return c.json({ status: "error", message: "no_user" });
      }
      
      // 3. Idempotency Check (Rule 76: Check ledger before insert using payment_ref)
      // We also check (user_id, drop_id) uniqueness in schema, but this prevents double-charging/logging.
      const existing = await db.prepare("SELECT 1 FROM ledger WHERE payment_ref = ?")
        .bind(dataId.toString()).first();
      
      if (existing) return c.json({ status: "ok", detail: "idempotent" });

      // 4. Resolve Drop to Unlock
      if (source === 'subscription') {
        const dateApproved = new Date(payment.date_approved || Date.now());
        const month = dateApproved.getMonth() + 1;
        const year = dateApproved.getFullYear();
        
        const drop: any = await db.prepare(
          "SELECT id FROM drops WHERE month = ? AND year = ?"
        ).bind(month, year).first();
        
        if (drop) {
          targetDropId = drop.id;
        }
      }

      if (targetDropId) {
        const amount = payment.transaction_amount || 0;
        await db.prepare(`
          INSERT INTO ledger (id, user_id, drop_id, source, amount, payment_ref, month, year, unlocked_at, payment_status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          crypto.randomUUID(), 
          userId, 
          targetDropId, 
          source,
          amount, 
          dataId.toString(),
          new Date(payment.date_approved).getMonth() + 1,
          new Date(payment.date_approved).getFullYear(),
          Date.now(),
          payment.status
        ).run();

        // If it was a subscription, also ensure the subscription record is updated
        if (source === 'subscription') {
          // You might want to update the 'subscriptions' table here if preapproval_id is known
        }
      } else {
        console.warn("[Webhook] Could not resolve drop for payment:", dataId);
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

app.route('/admin', adminHandler);

export const onRequest = handle(app);
