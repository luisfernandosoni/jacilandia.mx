import { Hono } from 'hono';
// @ts-ignore
import type { D1Database, R2Bucket } from "@cloudflare/workers-types";
import { adminMiddleware } from './[[route]]';
import { z } from 'zod';

type Bindings = {
  DB: D1Database;
  R2: R2Bucket;
  SIGNING_SECRET: string;
};

const admin = new Hono<{ Bindings: Bindings }>();

// Apply security middleware to all admin routes (@safe-vibe)
admin.use('*', adminMiddleware);

// Generar URL firmada para PUT en R2 (@cloudflare-dev-expert)
admin.post('/upload-intent', async (c) => {
  const { filename, contentType } = await c.req.json();
  const key = `drops/${crypto.randomUUID()}-${filename}`;
  
  // En Cloudflare Workers, R2 no soporta presigned URLs nativamente vía SDK como S3 (AWS) 
  // Sin embargo, podemos usar un Worker como proxy o usar la API de S3 compatible.
  // Por simplicidad y performance, usaremos un "Direct Upload" vía el Worker mismo 
  // o devolveremos una ruta que el Worker procese.
  
  // Decisión: Usaremos una ruta de proxy interna para el upload para mantener el control de seguridad.
  return c.json({ 
    uploadUrl: `/api/admin/proxy-upload?key=${encodeURIComponent(key)}&type=${encodeURIComponent(contentType)}`,
    key 
  });
});

// Proxy de subida para R2 (Evita CORS directo a R2 y maneja auth)
admin.put('/proxy-upload', async (c) => {
  const key = c.req.query('key');
  const type = c.req.query('type');
  
  if (!key) return c.text("Missing key", 400);
  if (!key.startsWith('drops/')) return c.text("Forbidden: Key must be in drops/", 403);
  
  // Use streaming to avoid buffering the entire file in Worker memory (@cloudflare-dev-expert)
  const body = c.req.raw.body;
  if (!body) return c.text("No body", 400);

  // Cast to any to handle type mismatch between Hono's ReadableStream and R2 expectance
  await c.env.R2.put(key, body as any, {
    httpMetadata: { contentType: type || 'application/octet-stream' }
  });
  
  return c.json({ success: true, key });
});

const PublishDropSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  month: z.number().min(1).max(12),
  year: z.number().min(2025),
  slug: z.string().min(1),
  thumbnail_key: z.string(),
  assets: z.array(z.object({
    type: z.enum(['preview', 'master', 'print_ready']),
    r2_key: z.string(),
    filename: z.string(),
    mime_type: z.string(),
    file_size: z.number(),
    sort_order: z.number().optional()
  }))
});

// Finalizar publicación del Drop
admin.post('/publish-drop', async (c) => {
  const body = await c.req.json();
  const result = PublishDropSchema.safeParse(body);
  
  if (!result.success) {
    return c.json({ error: "Invalid data", details: result.error.issues }, 400);
  }

  const { title, description, month, year, slug, assets, thumbnail_key } = result.data;
  const db = c.env.DB;
  const dropId = crypto.randomUUID();

  try {
    // 1. Crear Drop
    await db.prepare(`
      INSERT INTO drops (id, title, slug, month, year, description, thumbnail_url, published_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      dropId, 
      title, 
      slug, 
      month, 
      year, 
      description, 
      `/api/assets/${thumbnail_key}`, 
      Math.floor(Date.now() / 1000)
    ).run();

    // 2. Insertar Assets
    const assetQueries = assets.map((a: any) => {
      return db.prepare(`
        INSERT INTO drop_assets (id, drop_id, type, r2_key, filename, mime_type, file_size, sort_order)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        crypto.randomUUID(),
        dropId,
        a.type,
        a.r2_key,
        a.filename,
        a.mime_type,
        a.file_size,
        a.sort_order || 0
      );
    });

    await db.batch(assetQueries);

    return c.json({ success: true, dropId });
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

export default admin;
