# AGENTS.md - Persistent Context & Mandatory Rules

> **CRITICAL INSTRUCTION:** This file contains MANDATORY rules and context for the `jacilandia.mx` project.
> **IMPORTANT:** This project uses React 19, Vite, and Cloudflare Pages.

## 1. Core Philosophy & Standards ("Silicon Valley Tier")

- **Aesthetics:** High-Glance premium design. Use the established `DESIGN_SYSTEM` in `types.ts`.
- **Performance:** Maintain the predictive asset warming and performance profiles.
- **Code Quality:** Strong TypeScript usage, functional components, and Framer Motion for all transitions.

## 2. Technology Stack

- **Frontend:** React 19 (Vite), Tailwind CSS 3, Framer Motion 12.
- **Backend:** Hono (Middleware/API), Lucia (Auth), SQLite (via Cloudflare D1).
- **Infrastructure:** Cloudflare Pages, D1, R2.

## 3. Mandatory Rules

- **Animations:** All view transitions MUST use `AnimatePresence` and the springs defined in `DESIGN_SYSTEM.springs`.
- **Theming:** Use `applyAtmosphere` for view-specific color shifts.
- **Assets:** Use the `/cdn-cgi/image/` prefix for all external assets to leverage Cloudflare's image optimization as implemented in `warmUpAssets`.
- **Git:** NEVER upload the `.agent` folder or any `.md` file. They are ignored in `.gitignore`.
- **Skill Transparency:** Always explicitly mention which skill is being applied for any given task (e.g., "Using @ui-ux-pro-max").

## 4. Baseline Documentation

- [task.md](file:///e:/Antigravity/jacilandia.mx/task.md)
- [site.md](file:///e:/Antigravity/jacilandia.mx/site.md)
- [design.md](file:///e:/Antigravity/jacilandia.mx/design.md)
- [lessons.md](file:///e:/Antigravity/jacilandia.mx/lessons.md)
- [changelog.md](file:///e:/Antigravity/jacilandia.mx/changelog.md)
