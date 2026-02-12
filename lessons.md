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

## ✨ Frontend Excellence

### [2026-02-12] Glassmorphic Atmospheric Shifts

- **Technique**: Combining `backdrop-blur-md` on a full-screen background overlay with a `backdrop-blur-3xl` modal creates a "Deep Polish" effect that elevates traditional notifications to a "Silicon Valley" standard.
