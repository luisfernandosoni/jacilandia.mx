-- Identity & Content Backbone Migration

-- 1. Users (Enhanced for OAuth)
-- Removed ALTER statements that were causing "duplicate column" errors on this specific D1 instance.
-- The columns (google_id, picture, name, created_at) are already present in the remote schema.
-- For new environments, they should be included in the initial CREATE TABLE.
-- CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);

-- 2. Drops (The Container)
CREATE TABLE IF NOT EXISTS drops (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  thumbnail_url TEXT,
  description TEXT,
  tags TEXT, -- JSON Array ["video", "print", "desktop"] for filtering
  published_at INTEGER
);

-- 🔍 Full Text Search (The "Google" within JACI)
CREATE VIRTUAL TABLE IF NOT EXISTS drops_fts USING fts5(
  title, 
  description, 
  tags, 
  content='drops', 
  content_rowid='rowid'
);

-- 3. Drop Assets (Granular "Explorer" Content)
CREATE TABLE IF NOT EXISTS drop_assets (
  id TEXT PRIMARY KEY,
  drop_id TEXT NOT NULL,
  type TEXT NOT NULL, -- 'preview' (image/video), 'master' (high-res), 'print_ready' (CMYK PDF), 'zip_bundle'
  r2_key TEXT NOT NULL,
  filename TEXT NOT NULL,
  mime_type TEXT,
  file_size INTEGER,
  sort_order INTEGER DEFAULT 0, -- For manual reordering
  FOREIGN KEY(drop_id) REFERENCES drops(id)
);
CREATE INDEX IF NOT EXISTS idx_assets_drop ON drop_assets(drop_id);

-- 4. Subscriptions (State Machine)
CREATE TABLE IF NOT EXISTS subscriptions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  mp_preapproval_id TEXT NOT NULL,
  status TEXT NOT NULL, -- 'authorized', 'paused', 'cancelled'
  current_period_start INTEGER,
  current_period_end INTEGER,
  created_at INTEGER
);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_status ON subscriptions(user_id, status);

-- 5. Ledger (The "Golden Table")
CREATE TABLE IF NOT EXISTS ledger (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  drop_id TEXT NOT NULL,
  source TEXT NOT NULL, -- 'subscription_renewal', 'one_off_purchase'
  amount REAL NOT NULL,
  payment_ref TEXT,
  month INTEGER,
  year INTEGER,
  unlocked_at INTEGER,
  UNIQUE(user_id, drop_id)
);
CREATE INDEX IF NOT EXISTS idx_ledger_month_year ON ledger(month, year);
