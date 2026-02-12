-- Phase 2: The Vault (Monthly Drops & Assets)
-- Using @database-design: Analytics-First Schema

-- Drops Table
CREATE TABLE IF NOT EXISTS drops (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  thumbnail_url TEXT,
  description TEXT,
  tags TEXT, -- JSON Array ["video", "print", "desktop"]
  published_at INTEGER DEFAULT (strftime('%s', 'now'))
);

-- Drop Assets Table (Granular Explorer Content)
CREATE TABLE IF NOT EXISTS drop_assets (
  id TEXT PRIMARY KEY,
  drop_id TEXT NOT NULL,
  type TEXT NOT NULL, -- 'preview' | 'master' | 'print_ready' | 'zip_bundle'
  r2_key TEXT NOT NULL,
  filename TEXT NOT NULL,
  mime_type TEXT,
  file_size INTEGER,
  sort_order INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  FOREIGN KEY(drop_id) REFERENCES drops(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_assets_drop ON drop_assets(drop_id);

-- 🔍 Full Text Search (The "Google" within JACI)
-- Using FTS5 for performant search across titles and tags
CREATE VIRTUAL TABLE IF NOT EXISTS drops_fts USING fts5(
  title,
  description,
  tags,
  content='drops',
  content_rowid='rowid'
);

-- Triggers to keep FTS index updated
CREATE TRIGGER IF NOT EXISTS tbl_drops_ai AFTER INSERT ON drops BEGIN
  INSERT INTO drops_fts(rowid, title, description, tags) VALUES (new.rowid, new.title, new.description, new.tags);
END;

CREATE TRIGGER IF NOT EXISTS tbl_drops_ad AFTER DELETE ON drops BEGIN
  INSERT INTO drops_fts(drops_fts, rowid, title, description, tags) VALUES('delete', old.rowid, old.title, old.description, old.tags);
END;

CREATE TRIGGER IF NOT EXISTS tbl_drops_au AFTER UPDATE ON drops BEGIN
  INSERT INTO drops_fts(drops_fts, rowid, title, description, tags) VALUES('delete', old.rowid, old.title, old.description, old.tags);
  INSERT INTO drops_fts(rowid, title, description, tags) VALUES (new.rowid, new.title, new.description, new.tags);
END;
