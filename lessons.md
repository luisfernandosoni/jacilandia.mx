# lessons.md - Cognitive Retrospection & Antirot

## 🛡️ Cloudflare Infrastructure

### [2026-02-12] Cloudflare Infrastructure Protocol

- **Issue**: Deployment failure due to outdated `compatibility_date` when using modern Node-compatible packages.
- **Root Cause**: Cloudflare Workers/Pages Functions require a `compatibility_date` of `2024-09-23` or later to correctly handle Node.js built-in module resolution even with the `nodejs_compat` flag.
- **Solution**:
  1. Enable `compatibility_flags = [ "nodejs_compat" ]` in `wrangler.toml`.
  2. **CRITICAL**: Update `compatibility_date` to `2025-02-01` (or latest) to satisfy bundler requirements.
  3. **MANUAL ACTION**: Enable the flag in the Cloudflare Dash (Settings > Functions > Compatibility Flags).
- **Proactive Measure**: Avoid native `.node` binaries entirely; prefer WebAssembly (Wasm) or pure JS if image processing is ever reintroduced.

### [2026-02-12] D1 Migration Mastery & Surgical Reconciliation

- **Issue**: `wrangler d1 migrations apply` failure on remote DB due to "Duplicate Column" errors and Cloudflare API transaction timeouts.
- **Root Cause**: SQLite lacks `ADD COLUMN IF NOT EXISTS`, and schema-heavy migrations often conflict with remote drift. Multi-statement SQL batches can cause 500 errors on the Cloudflare API layer.
- **Solution (Surgical Recovery)**:
  1. Audit remote state via `PRAGMA table_info` (use `--json` for precision).
  2. Apply SQL statements individually via `wrangler d1 execute --command`.
  3. Manually sync the `d1_migrations` table by inserting the file name.
  4. Perform a cleanup check with `wrangler d1 migrations list`.
- **Silicon Valley Standard**: Never assume local parity with remote. Always verify the "truth" on the edge before attempting schema mutations.

## ✨ Frontend Excellence

### [2026-02-12] Glassmorphic Atmospheric Shifts

- **Technique**: Combining `backdrop-blur-md` on a full-screen background overlay with a `backdrop-blur-3xl` modal creates a "Deep Polish" effect that elevates traditional notifications to a "Silicon Valley" standard.
