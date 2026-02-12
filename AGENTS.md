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
- **Skill Transparency**: Always explicitly mention which skill is being applied for any given task (e.g., "Using @ui-ux-pro-max").

## 4. Agent Evolution & Skill Manual

### Self-Growth Protocol

- **Continuous Learning**: After every major task or audit, identify new skills used or lessons learned and document them here.
- **Constitutional Updates**: If a new best practice is established (e.g., "Atmospheric Prestige" patterns), promote it to the Mandatory Rules.

### Active Skill Manual

- **@ui-ux-pro-max**: Advanced visual hierarchy, grid systems, and elite aesthetics audit.
- **@premium-design-standards**: Benchmarking against high-end Silicon Valley web interfaces.
- **@web-performance-optimization**: LCP/CLS engineering, resource preloading, and bundle hardening.
- **@performance-profiling**: Trace analysis and bottleneck identification.
- **@motion-engine-v12**: Advanced spring physics and layout animations with Framer Motion.

## 5. Baseline Documentation

- **Skill Transparency**:
  - `implementation_plan.md` MUST list "Active Skills" in the header.
  - `walkthrough.md` MUST list "Skills Used" in the summary.
- [task.md](file:///e:/Antigravity/jacilandia.mx/task.md)
- [site.md](file:///e:/Antigravity/jacilandia.mx/site.md)
- [design.md](file:///e:/Antigravity/jacilandia.mx/design.md)
- [lessons.md](file:///e:/Antigravity/jacilandia.mx/lessons.md)
- [changelog.md](file:///e:/Antigravity/jacilandia.mx/changelog.md)
