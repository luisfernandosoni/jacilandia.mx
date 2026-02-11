# design.md - Design System

## Visual Theme

**Atmospheric Prestige**: A vibrant, kid-friendly yet premium aesthetic. High usage of blurs, gradients, and spring-based animations to create a "living" interface.

## Color Palette

| Name         | Hex       | Role                           |
| :----------- | :-------- | :----------------------------- |
| Primary Blue | `#25C0F4` | Core branding, primary actions |
| Pink         | `#F472B6` | Accents, playfulness           |
| Yellow       | `#FBBF24` | Highlights, energy             |
| Purple       | `#A78BFA` | Secondary elements             |
| Green        | `#22C55E` | Success, registration          |
| Slate 900    | `#0F172A` | Primary text                   |

## Typography

- **Headings**: Black-weight display font, tight tracking (`tracking-tight`), leading `0.95`.
- **Body**: Slate 500, relaxed leading, Inter/Outfit style.

## Animation Principles (springs)

- **Snappy**: `stiffness: 450, damping: 32` (UI elements, buttons).
- **Gentle**: `stiffness: 150, damping: 25` (Background shifts).
- **Bouncy**: `stiffness: 500, damping: 20` (Character movements/Jaci Squad).
- **Magnetic**: `stiffness: 200, damping: 15` (Cursor attraction).

## Interaction Physics

- **Magnetic Pull**: `0.32` strength for premium cursor-following elements.
- **Scroll Momentum**: Skew and scale transforms applied to text and images based on scroll velocity (via `useVelocity` and `useTransform`).
- **Atmospheric Blending**: 1.2s cubic-bezier transition for radial gradients in the fixed mesh background.

## Image Optimization (Cloudflare Images)

- **LQIP (Low Quality Image Placeholder)**: 32px blurred webp versions loaded instantly as backdrops.
- **Adaptive SrcSet**: Dynamic width and quality parameters injected via `/cdn-cgi/image/` (implemented in `OptimizedImage`).
- **Eager Loading**: Critical hero assets warmed up during idle callbacks (`warmUpAssets`).
- **Metadata Stripping**: `metadata=none` requested via Cloudflare for bandwidth optimization.

## Design Tokens

- **Radius**: `card: 2.5rem`, `container: 4rem`.
- **Blur**: `standard: 20px`, `deep: 40px`.
