# lessons.md - Cognitive Retrospection & Antirot

## 🛡️ Cloudflare Infrastructure

### [2026-02-12] Node.js Compatibility Protocol

- **Problem**: Deployment failure with "Could not resolve 'os', 'path', 'fs'" when using `imagescript`.
- **Root Cause**: Cloudflare Workers/Pages Functions do not include Node.js built-in modules by default. Libraries like `imagescript` depend on them for certain operations (especially Wasm loading and polyfills).
- **Solution**:
  1. Enable `compatibility_flags = [ "nodejs_compat" ]` in `wrangler.toml`.
  2. **CRITICAL**: Update `compatibility_date` to a version after `2024-09-23` (e.g., `2025-02-01`) to ensure the bundler correctly resolves Node.js modules.
  3. **MANUAL ACTION**: Enable the flag in the Cloudflare Dash (Settings > Functions > Compatibility Flags).
- **Proactive Measure**: Always audit `node_modules` of new dependencies for Node-specific imports before deploying.

### [2026-02-12] Asset Personalization (Watermarking)

- **Constraint**: Edge image processing is memory-intensive. `imagescript` is performant but can hit the 128MB limit on large assets.
- **Optimization**: Use signed URLs to proxy R2 assets through a verification layer, then stream the response with low-latency transformations.

## ✨ Frontend Excellence

### [2026-02-12] Glassmorphic Atmospheric Shifts

- **Technique**: Combining `backdrop-blur-md` on a full-screen background overlay with a `backdrop-blur-3xl` modal creates a "Deep Polish" effect that elevates traditional notifications to a "Silicon Valley" standard.
