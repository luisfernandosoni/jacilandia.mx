# lessons.md - Knowledge Capture

## Project Insights

### Technical Lessons

- **Cloudflare CDN Integration**: All assets should be proxied through `/cdn-cgi/image/` with quality/width parameters to ensure performance across devices.
- **Atmospheric Transitions**: State-based transitions combined with `AnimatePresence` provide a seamless SPA feel without complex routing overhead.

### Design Lessons

- **Dynamic Theming**: Modifying CSS variables on the root element (`--theme-primary`, etc.) is an efficient way to sync multiple components to a shared atmospheric state.
