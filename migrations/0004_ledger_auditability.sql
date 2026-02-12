-- Migration: Add payment_status to ledger
-- Using @safe-vibe & @database-design standards

-- 1. Add the column
ALTER TABLE ledger ADD COLUMN payment_status TEXT DEFAULT 'approved';

-- 2. Update existing records (assume approved for legacy data)
-- This is a safe default for existing successful transactions.
UPDATE ledger SET payment_status = 'approved' WHERE payment_status IS NULL;
