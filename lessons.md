# lessons.md - Knowledge Capture

## Project Insights

### Technical Lessons

- **Cloudflare CDN Integration**: All assets should be proxied through `/cdn-cgi/image/` with quality/width parameters to ensure performance across devices.
- **Atmospheric Transitions**: State-based transitions combined with `AnimatePresence` provide a seamless SPA feel without complex routing overhead.

### Animation & UX

- **Reveal vs Pulse**: Avoid combining continuous pulse animations with initial entrance reveals on the same element; the superposition of vectors can cause visual 'snapping' on high-refresh-rate displays.
- **Subtle Amplitudes**: In premium interfaces, less is more. Reducing `y` offsets from 30px to 20px and floating amplitudes from 25px to 15px creates a more controlled and professional feel.
- **Layout Collapse vs Lazy Loading**: When using `React.lazy` with `AnimatePresence mode="wait"`, the absence of a substantial `Suspense` fallback can cause the container to collapse to 0px height, forcing the footer to "snap" upwards. Always provide a `min-height` or a proportional fallback UI to preserve layout integrity.
