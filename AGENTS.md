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
- **Skill Transparency**: Always explicitly mention which skill is being applied for any given task (e.g., "Using @ui-ux-pro-max" or "Using @safe-vibe").
- **Security Hardening**: You MUST run a `@safe-vibe` audit before every major feature implementation and deployment.
- **Documentation Standard**: `implementation_plan.md` and `walkthrough.md` MUST list the skills used. ALWAYS follow the `@walkthrough-pro` (Elite Senior Staff) standard for walkthroughs.

## 4. Agent Evolution & Skill Manual

### Mandatory Skill Protocol

> **CRITICAL**: Requires strict adherence at the start of EVERY task.

1.  **Search First**: Before starting any task, you MUST search for relevant skills in:
    - The System Skill Library (`C:\Users\sonig\.gemini\skills`)
    - The "Active Context" below in this document.
2.  **Explicit Reporting**: You MUST explicitly state which skills you are using in your `task_boundary` or `notify_user` messages (e.g., "Using @database-design to optimize schema").
3.  **Vercel-Style Integration**: If you frequently use a skill, do NOT just list it. You MUST extract its "Critical Context" and add it to the **Active Context** section below using the rule: _Passive Context > Active Retrieval_.

### Self-Growth Patterns (derived from `@writing-skills`)

1.  **The "Never Again" Protocol (Post-Mortem)**:
    - _Trigger_: After fixing a bug or engaging in a multi-turn correction loop.
    - _Action_: Create a "Discipline Skill" rule in `AGENTS.md` that prevents this specific error from recurring (Anti-Rationalization).

2.  **The Architecture Ratchet**:
    - _Trigger_: When touching a legacy file or component.
    - _Action_: You MUST upgrade it to the current "Silicon Valley" standard (e.g., Tailwind v4, Framer Motion 12) before leaving. Leave the campground cleaner than you found it.

3.  **The Skill Synthesis Cluster**:
    - _Trigger_: When a task requires >3 distinct skills to complete.
    - _Action_: Create a new "Cluster" in `AGENTS.md` (like "Commerce & Security") that defines the _interaction rules_ between these skills, minimizing context switching.

### Active Logic & Security Context (Vercel Style)

> **System Note:** These rules are loaded _passively_ to reduce retrieval latency.

- **Infrastructure & Cloudflare (@cloudflare-dev-expert)**:
  - **Standard**: "Silicon Valley" Tier. Prefer Cloudflare-native solutions.
  - **Node.js**: Requires `compatibility_flags = [ "nodejs_compat" ]` and `compatibility_date = "2025-02-01"` in `wrangler.toml` for modern ESM modules.
  - **D1 Recovery (CRITICAL)**: If migrations fail or hang, perform a **Truth Audit** (`PRAGMA table_info`) and **Surgical Reconstruction** (one-by-one SQL execution) as defined in the hardened skill reference.
  - **Edge Processing**: Guard for **128MB** memory limit. Prefer streaming via `response.body`.
  - **Guardrail**: ALWAYS use `--remote` for wrangler operations to verify the "Truth on the Edge".
  - **Anti-Hallucination**: NEVER assume resource names (DB, Buckets, Secrets). You MUST verify via `wrangler.toml` or `wrangler [service] list` before setiap action.
  - **Anti-Deletion**: `delete` commands are strictly forbidden unless explicitly requested. If requested, audit with `list` first to confirm the exact ID/name to the user.
  - **Dashboard Deference**: Never defer to the dashboard for secrets, D1/R2 creation, or domain mapping. Use the CLI equivalents defined in `@cloudflare-dev-expert`.

- **Design & Aesthetics (`@ui-ux-pro-max`, `@premium-design-standards`, `@design-md`)**:
  - **Standard**: "Silicon Valley" Tier (Apple/Stripe quality). No basic UI.
  - **System**: Must use `DESIGN_SYSTEM` in `types.ts`.
  - **Process**: Update `design.md` before major UI work to maintain visual consistency.
  - **Heuristics**: 8px grid, optical alignment, "High-Glance" aesthetic.

- **Performance & Motion (`@web-performance-optimization`, `@performance-profiling`, `@motion-engine-v12`)**:
  - **Metrics**: Maintain LCP < 2.5s, CLS < 0.1.
  - **Animation**: MUST use `AnimatePresence` and `springs` defined in `DESIGN_SYSTEM`. No linear easings.
  - **Loading**: Use `warmUpAssets` and predictive preloading.
  - **Optimization**: ALL images must use Cloudflare `/cdn-cgi/image/` prefix.

- **Authentication (`@auth-implementation-patterns`)**:
  - **Pattern**: Hybrid Session/Token via **Lucia**.
  - **Critical**: Use `arctic` for Google OAuth. _Never_ implement OAuth manually.
  - **Security**: All Cookies MUST be `HttpOnly`, `Secure`, `SameSite=Lax`.

- **Payments (`@payment-integration`)**:
  - **Provider**: **MercadoPago** (Preapproval for Subs, Preference for One-offs).
  - **Critical Rule**: Webhooks MUST be **Idempotent** (check `ledger` before insert) and **Verified** (check `x-signature`).
  - **Flow**: Access is granted ONLY on `payment.approved`, never on `created`.

- **Database Architecture (`@database-design`)**:
  - **Engine**: **Cloudflare D1** (SQLite).
  - **Schema**: _Analytics-First_. The `ledger` table is the Single Source of Truth for both Access and Revenue.
  - **Search**: Use **FTS5** virtual tables for `drops` search; do not use `LIKE %...%`.
- **Analytics (`@analytics-tracking` & `@startup-metrics-framework`)**:
  - **Metrics**: Track **MRR**, **LTV**, and **Churn Rate** (>5% alert).
  - **Definition**: A "User" is only tracked after `subscription_started`.
  - **Privacy**: No PII in analytics logs; use `user_id`.

- **Security Strategy (@safe-vibe)**:
  - **Mandate**: 62-Point Vulnerability Checklist is required for all audits.
  - **Defense**: ALL publicly accessible downloads must use **Signed R2 URLs** (5min expiry).
  - **Vulnerability**: Prevent **IDOR** by verifying `ledger` ownership _before_ signing URLs.
  - **Hardening**: DERIVE identity server-side; NEVER trust `user_id` passed from frontend.

## 5. Baseline Documentation

- **Skill Transparency**:
  - `implementation_plan.md` MUST list "Active Skills" in the header.
  - `walkthrough.md` MUST list "Skills Used" (and link to their documentation if possible).
- **Walkthrough Pro**:
  - All walkthroughs MUST follow the `@walkthrough-pro` standard: Elite, concise, focused on ROI, and visually demonstrated with screenshots/recordings.
- [task.md](file:///e:/Antigravity/jacilandia.mx/task.md)
- [site.md](file:///e:/Antigravity/jacilandia.mx/site.md)
- [design.md](file:///e:/Antigravity/jacilandia.mx/design.md)
- [lessons.md](file:///e:/Antigravity/jacilandia.mx/lessons.md)
- [changelog.md](file:///e:/Antigravity/jacilandia.mx/changelog.md)
