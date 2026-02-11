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

## Design Tokens

- **Radius**: `card: 2.5rem`, `container: 4rem`.
- **Blur**: `standard: 20px`, `deep: 40px`.
