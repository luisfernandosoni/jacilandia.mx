-- Migration 0005: Extended User Profile
-- Adding columns to support full Google OAuth profile data

ALTER TABLE users ADD COLUMN given_name TEXT;
ALTER TABLE users ADD COLUMN family_name TEXT;
ALTER TABLE users ADD COLUMN locale TEXT;
ALTER TABLE users ADD COLUMN email_verified INTEGER DEFAULT 0;

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
