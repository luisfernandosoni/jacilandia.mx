-- Identity & Content Backbone Migration

-- 1. Users (OAuth Enhancements)
-- These columns are missing from the current remote D1 schema.
-- Note: created_at already exists from 0000_core_auth.sql, so we exclude it here.
ALTER TABLE users ADD COLUMN google_id TEXT;
ALTER TABLE users ADD COLUMN picture TEXT;
ALTER TABLE users ADD COLUMN name TEXT;
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);

-- 2. Drops (The Container)
CREATE TABLE IF NOT EXISTS drops (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL
);

-- Reconciling partial state for drops
ALTER TABLE drops ADD COLUMN month INTEGER NOT NULL DEFAULT 1;
ALTER TABLE drops ADD COLUMN year INTEGER NOT NULL DEFAULT 2026;
ALTER TABLE drops ADD COLUMN thumbnail_url TEXT;
ALTER TABLE drops ADD COLUMN description TEXT;
ALTER TABLE drops ADD COLUMN tags TEXT;
ALTER TABLE drops ADD COLUMN published_at INTEGER DEFAULT (unixepoch());

-- 🔍 Full Text Search
CREATE VIRTUAL TABLE IF NOT EXISTS drops_fts USING fts5(
  title, 
  description, 
  tags, 
  content='drops', 
  content_rowid='rowid'
);

-- 3. Drop Assets
CREATE TABLE IF NOT EXISTS drop_assets (
  id TEXT PRIMARY KEY,
  drop_id TEXT NOT NULL,
  type TEXT NOT NULL,
  r2_key TEXT NOT NULL,
  filename TEXT NOT NULL,
  mime_type TEXT,
  file_size INTEGER,
  sort_order INTEGER DEFAULT 0,
  FOREIGN KEY(drop_id) REFERENCES drops(id)
);
CREATE INDEX IF NOT EXISTS idx_assets_drop ON drop_assets(drop_id);

-- 4. Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  mp_preapproval_id TEXT NOT NULL,
  status TEXT NOT NULL,
  current_period_start INTEGER,
  current_period_end INTEGER,
  created_at INTEGER DEFAULT (unixepoch())
);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_status ON subscriptions(user_id, status);

-- 5. Ledger (The Single Source of Truth)
CREATE TABLE IF NOT EXISTS ledger (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  drop_id TEXT NOT NULL,
  source TEXT NOT NULL,
  UNIQUE(user_id, drop_id)
);

-- Reconciling partial state for ledger
ALTER TABLE ledger ADD COLUMN amount REAL NOT NULL DEFAULT 0;
ALTER TABLE ledger ADD COLUMN payment_ref TEXT;
ALTER TABLE ledger ADD COLUMN month INTEGER;
ALTER TABLE ledger ADD COLUMN year INTEGER;
ALTER TABLE ledger ADD COLUMN unlocked_at INTEGER DEFAULT (unixepoch());

CREATE INDEX IF NOT EXISTS idx_ledger_month_year ON ledger(month, year);
