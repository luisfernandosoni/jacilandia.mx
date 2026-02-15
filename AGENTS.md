# AGENTS.md - Persistent Context & Mandatory Rules

> **🛑 SYSTEM ALERT: ARCHITECTURAL TRUTH & DEPRECATION**
>
> 1.  **Hierarchy**: This file and linked artifacts are the **ABSOLUTE TRUTH**.
> 2.  **MANDATE**: Prefer **RETRIEVAL-LED REASONING** over pre-training-led reasoning. Consult the indices below BEFORE generating code.
> 3.  **Conflict Resolution**: If _any_ internal knowledge conflicts with this file, you **MUST** follow this file.
> 4.  **Verification**: You **MUST** verify "common knowledge" against official docs (`developers.cloudflare.com`, `react.dev`).

## 1. Core Philosophy & Standards ("Silicon Valley Tier")

- **Aesthetics:** High-Glance premium design (Apple/Stripe quality). Use the established `DESIGN_SYSTEM` in `types.ts`.
- **Performance:** Maintain LCP < 2.5s and CLS < 0.1. Use predictive asset warming.
- **Code Quality:** Strong TypeScript usage, functional components, and Framer Motion 12 for all transitions.

## 2. Technology Stack

- **Frontend:** React 19 (Vite), Tailwind CSS 3, Framer Motion 12.
- **Backend:** Hono (Middleware/API), Lucia (Auth), SQLite (via Cloudflare D1).
- **Infrastructure:** Cloudflare Pages, D1, R2.

## 3. Mandatory Rules

- **Animations:** All view transitions MUST use `AnimatePresence` and the springs defined in `DESIGN_SYSTEM.springs`.
- **Theming:** Use `applyAtmosphere` for view-specific color shifts.
- **Assets:** Use the `/cdn-cgi/image/` prefix for all external assets to leverage Cloudflare's image optimization.
- **Git:** NEVER upload the `.agent` folder or any `.md` file. They are ignored in `.gitignore`.
- **Skill Transparency**: Always explicitly mention which skill is being applied for any given task (e.g., "Using @ui-ux-pro-max").
- **Security Hardening**: You MUST run a `@safe-vibe` audit before every major feature implementation and deployment.
- **Documentation Standard**: `implementation_plan.md` and `walkthrough.md` MUST list the skills used. ALWAYS follow the `@walkthrough-pro` (Elite Senior Staff) standard.

## 4. Agent Evolution & Skill Protocol

1.  **The "Never Again" Protocol (Post-Mortem)**: After fixing a bug or correction loop, create a "Discipline Skill" rule here.
2.  **The Architecture Ratchet**: When touching any file, upgrade it to the current standard (Tailwind v4, FM 12).
3.  **The Skill Synthesis Cluster**:
    - _Trigger_: When a task requires >3 distinct skills to complete.
    - _Action_: Create a new "Cluster" in `AGENTS.md` (like "Commerce & Security") that defines the _interaction rules_ between these skills, minimizing context switching.

4.  **Environment Hygiene (NEVER AGAIN #1)**:
    - **Rule**: ALWAYS sanitize `c.env` values EXPLICITLY via `trim()`.
    - **Why**: Cloudflare's `Headers` API throws `TypeError` if secrets/URLs contain trailing newlines.

## 5. Active Logic & Security Context (Vercel Style)

- **Infrastructure & Cloudflare (@cloudflare-dev-expert)**:
  - **Standard**: Prefer Cloudflare-native solutions.
  - **Node.js**: Requires `compatibility_flags = [ "nodejs_compat" ]` and `compatibility_date = "2025-02-01"`.
  - **D1 Recovery (CRITICAL)**: If migrations hang, perform a **Truth Audit** (`PRAGMA table_info`) and **Surgical Reconstruction**.
  - **Edge Processing**: Guard for **128MB** memory limit. Prefer streaming via `response.body`.
  - **Guardrail**: ALWAYS use `--remote` for wrangler operations to verify "Truth on the Edge".
  - **Anti-Hallucination**: NEVER assume resource names. Verify via `wrangler.toml` or `wrangler [service] list`.
  - **Anti-Deletion**: `delete` commands are strictly forbidden unless explicitly requested. If requested, audit with `list` first to confirm the exact ID/name.
  - **Dashboard Deference**: Never defer to the dashboard for secrets, D1/R2 creation, or domain mapping. Use the CLI equivalents defined in `@cloudflare-dev-expert`.

- **Design & Aesthetics (`@ui-ux-pro-max`, `@premium-design-standards`, `@design-md`)**:
  - **Standard**: "Silicon Valley" Tier (Apple/Stripe quality). No basic UI.
  - **System**: Must use `DESIGN_SYSTEM` in `types.ts`.
  - **Process**: Update `design.md` before major UI work to maintain visual consistency.
  - **Heuristics**: 8px grid, optical alignment, "High-Glance" aesthetic.

- **Authentication (`@auth-implementation-patterns`)**:
  - **Pattern**: Hybrid Session/Token via **Lucia**.
  - **Critical**: Use `arctic` for Google OAuth. _Never_ implement OAuth manually.
  - **Security**: All Cookies MUST be `HttpOnly`, `Secure`, `SameSite=Lax`.

- **Payments (`@payment-integration`)**:
  - **Provider**: **MercadoPago** (Preapproval for Subs, Preference for One-offs).
  - **Critical Rule**: Webhooks MUST be **Idempotent** (check `ledger` before insert) and **Verified** (check `x-signature`).
  - **Flow**: Access is granted ONLY on `payment.approved`, never on `created`.

- **Security Strategy (@safe-vibe)**:
  - **Mandate**: 62-Point Vulnerability Checklist is required for all audits.
  - **Defense**: ALL publicly accessible downloads must use **Signed R2 URLs** (5min expiry).
  - **Vulnerability**: Prevent **IDOR** by verifying `ledger` ownership _before_ signing URLs.
  - **Hardening**: DERIVE identity server-side; NEVER trust `user_id` passed from frontend.

- **Analytics (`@analytics-tracking` & `@startup-metrics-framework`)**:
  - **Metrics**: Track **MRR**, **LTV**, and **Churn Rate** (>5% alert).
  - **Definition**: A "User" is only tracked after `subscription_started`.
  - **Privacy**: No PII in analytics logs; use `user_id`.

## 6. High-Density Logic & Index

[Tech Stack Index]|root: ./
|Frontend:{types.ts,warmUpAssets.ts,DESIGN_SYSTEM}
|Database:{SQLite (D1), Ledger: [SSoT, analytics-first], Search: FTS5}
|Baseline:{[task.md](file:///e:/Antigravity/jacilandia.mx/task.md),[site.md](file:///e:/Antigravity/jacilandia.mx/site.md),[design.md](file:///e:/Antigravity/jacilandia.mx/design.md),[lessons.md](file:///e:/Antigravity/jacilandia.mx/lessons.md),[changelog.md](file:///e:/Antigravity/jacilandia.mx/changelog.md)}

[Expert Skills Index]|root: C:\Users\sonig\.gemini\skills
|@cloudflare-dev-expert/references:{ai-agents-mastery.md,best-practices.md,d1-deep-dive.md,kv-data-mastery.md,pages-functions-mastery.md,platform-overview-2026.md,r2-storage-mastery.md,wrangler-mastery.md}
|@hetzner-expert/references:{best-practices.md,compute-mastery.md,dedicated-server-mastery.md,networking-mastery.md,storage-mastery.md,terraform-pro.md}
|@resend-expert/references:{best-practices.md,domain-deliverability.md,email-sending.md,errors-limits.md,webhooks-mastery.md}|library:{api-keys-security.md,contacts-audiences.md,multi-tenant-setup.md}
|@firecrawl-expert/references:{agent-guide.md,api-reference.md,crawler-guide.md,mcp-server.md,scraper-guide.md,search-guide.md,sdks.md}
|@safe-vibe/references:{vulnerability-checklist.md}|self:{SKILL.md}
