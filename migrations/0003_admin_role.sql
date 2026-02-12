-- Migration 0003: Admin Role Support
ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user';

-- Temporary: Assign admin role to first user (or wait for manual update)
-- UPDATE users SET role = 'admin' WHERE email = 'soniglf@gmail.com';
