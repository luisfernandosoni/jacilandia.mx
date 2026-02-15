-- Migration 0006: Auth Expansion
-- Adding support for password hashing and recovery

ALTER TABLE users ADD COLUMN hashed_password TEXT;
ALTER TABLE users ADD COLUMN password_reset_token TEXT;
ALTER TABLE users ADD COLUMN password_reset_expires INTEGER;

-- Ensure tokens are indexed for recovery flow performance
CREATE INDEX IF NOT EXISTS idx_users_reset_token ON users(password_reset_token);
