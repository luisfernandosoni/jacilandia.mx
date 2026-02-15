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

## 4. Mandatory Skill Protocol & Evolution

> [!IMPORTANT]
> **Task Initialization**: You MUST start EVERY task by searching for and identifying at least **5 relevant skills** from the System Skill Library (`C:\Users\sonig\.gemini\skills`).
>
> - **Audit**: Perform a "Deep Audit" of these candidates to select the most relevant experts.
> - **Continuous Transparency**: You MUST inform the user of **EVERY SINGLE SKILL USE** at the very time it is being applied.
>   - **Technique**: Update `TaskStatus` and tool descriptions to reflect the active expert continuously.

1.  **The "Never Again" Protocol (Post-Mortem)**: After fixing a bug or correction loop, create a "Discipline Skill" rule here.
2.  **The Architecture Ratchet**: When touching any file, upgrade it to current standard (Tailwind v4, FM 12).
3.  **The Skill Synthesis Cluster**: Interaction rules for tasks requiring >3 skills.
4.  **The Persistence Mandate**: Deleting rules or simplifying granular logic in this file is STRICTLY FORBIDDEN. Preserve all technical constraints.

## 5. Active Logic & Security Context (High Density)

> **System Note:** These rules are loaded _passively_ to reduce retrieval latency.

- **Infrastructure & Cloudflare (@cloudflare-dev-expert)**:
  - **D1 Recovery (CRITICAL)**: Truth Audit (`PRAGMA table_info`) + Surgical Reconstruction.
  - **Node.js**: MUST have `compatibility_flags = [ "nodejs_compat" ]` in `wrangler.toml` for `fs/path/os`.
  - **Edge Processing**: Guard for **128MB** memory limit. Prefer streaming.
  - **R2 Security**: Public assets MUST use **Signed URLs (5min)** or **HMAC Proxying**.
  - **Guardrail**: ALWAYS use `--remote` for wrangler operations to ensure truth. Anti-Deletion is strictly mandated.

- **Design & Aesthetics (@ui-ux-pro-max, @premium-design-standards, @design-md)**:
  - **Standard**: "Silicon Valley" Tier. No basic UI. Must use `DESIGN_SYSTEM` in `types.ts`.
  - **Heuristics**: 8px grid, optical alignment, "High-Glance" aesthetic. Update `design.md` before UI work.

- **Performance & Motion (@web-performance-optimization, @motion-engine-v12)**:
  - **Metrics**: LCP < 2.5s, CLS < 0.1. No linear easings; absolute Framer Motion mastery.
  - **Loading**: Use `warmUpAssets` and predictive preloading. Images MUST use `/cdn-cgi/image/` prefix.

- **Authentication (@auth-implementation-patterns, @luciaauth-expert)**:
  - **Pattern**: Hybrid Session/Token via **Lucia**. Use **Arctic** for OAuth.
  - **Security**: Cookies MUST be `HttpOnly`, `Secure`, `SameSite=Lax`. CSRF verification via `verifyRequestOrigin()` is mandatory.

- **Payments (@payment-integration)**:
  - **Provider**: **MercadoPago**. Webhooks MUST be **Idempotent** (ledger check) and **Verified** (`x-signature`).
  - **Logic**: Grant access ONLY on `payment.approved`.

- **Database Architecture (@database-design)**:
  - **Engine**: Cloudflare D1 (SQLite).
  - **Schema**: _Analytics-First_. The `ledger` table is the Single Source of Truth for both Access and Revenue.
  - **Search**: Use **FTS5** virtual tables; NO `LIKE %...%`.

- **Analytics & Strategy (@analytics-tracking, @startup-metrics-framework)**:
  - **Metrics**: Track **MRR**, **LTV**, and **Churn Rate**. No PII; use `user_id`.

- **Security Strategy (@safe-vibe)**:
  - **Defensive Strategy**: 62-Point Vulnerability Checklist. signed R2 URLs (5min). IDOR protection via ledger verify. Server-side identity derivation.

## 6. High-Density Logic & Index

[Tech Stack Index]|root: ./
|Frontend:{types.ts,warmUpAssets.ts,DESIGN_SYSTEM}
|Database:{SQLite (D1), Ledger: [SSoT, analytics-first], Search: FTS5}
|Baseline:{[task.md](file:///e:/Antigravity/jacilandia.mx/task.md),[site.md](file:///e:/Antigravity/jacilandia.mx/site.md),[design.md](file:///e:/Antigravity/jacilandia.mx/design.md),[lessons.md](file:///e:/Antigravity/jacilandia.mx/lessons.md),[changelog.md](file:///e:/Antigravity/jacilandia.mx/changelog.md)}

[Expert Skills Reference]|root: C:\Users\sonig\.gemini\skills
|@cloudflare-dev-expert:{ai-agents-mastery,d1-deep-dive,kv-data-mastery,pages-functions,r2-storage,wrangler-mastery}
|@hetzner-expert:{compute-mastery,dedicated-server,networking,storage,terraform-pro}
|@resend-expert:{domain-deliverability,email-sending,webhooks-mastery,api-keys-security}
|@firecrawl-expert:{agent-guide,crawler-guide,mcp-server,scraper-guide,search-guide}
|@safe-vibe:{vulnerability-checklist,SKILL.md}

## 7. Universal Skill Index (The "Global Expert" Library)

> [!IMPORTANT]
> **Retrieval Mandate**: Consult these indices for specialized tasks. Passive Context > Active Retrieval.

[Expert Packs Index]|root: C:\Users\sonig\.gemini\skills
|Essentials Pack:{concise-planning,lint-and-validate,git-pushing,kaizen,systematic-debugging}
|Security Pack/Engineer:{ethical-hacking-methodology,burp-suite-testing,top-web-vulnerabilities,linux-privilege-escalation,cloud-penetration-testing,security-auditor,vulnerability-scanner}
|Security Pack/Developer:{api-security-best-practices,auth-implementation-patterns,backend-security-coder,frontend-security-coder,cc-skill-security-review,pci-compliance}
|Identity Pack:{luciaauth-expert,arctic-oauth,auth-implementation-patterns,identity-management-mastery}

|Web Pack/Wizard:{frontend-design,react-best-practices,react-patterns,nextjs-best-practices,tailwind-patterns,form-cro,seo-audit}
|Web Pack/Designer:{ui-ux-pro-max,3d-web-experience,canvas-design,mobile-design,scroll-experience}
|Full-Stack Pack:{senior-fullstack,frontend-developer,backend-dev-guidelines,api-patterns,database-design,stripe-integration}
|AI/Agent Pack:{agent-evaluation,langgraph,mcp-builder,prompt-engineering,ai-agents-architect,rag-engineer}
|AI/LLM App Pack:{llm-app-patterns,rag-implementation,prompt-caching,context-window-management,langfuse}
|Game Dev Pack:{game-design,2d-games,3d-games,unity-developer,godot-gdscript-patterns,algorithmic-art}
|Backend/Python Pack:{python-pro,python-patterns,fastapi-pro,fastapi-templates,django-pro,python-testing-patterns,async-python-patterns}
|Backend/JS/TS Pack:{typescript-expert,javascript-pro,react-best-practices,nodejs-best-practices,nextjs-app-router-patterns}
|Backend/Systems Pack:{rust-pro,go-concurrency-patterns,golang-pro,memory-safety-patterns,cpp-pro}
|Startup/Founder Pack:{product-manager-toolkit,competitive-landscape,competitor-alternatives,launch-strategy,copywriting,stripe-integration}
|Startup/Business Pack:{business-analyst,startup-metrics-framework,startup-financial-modeling,market-sizing-analysis,kpi-dashboard-design}
|Marketing/Growth Pack:{content-creator,seo-audit,programmatic-seo,analytics-tracking,ab-test-setup,email-sequence}
|DevOps/Cloud Pack:{docker-expert,aws-serverless,kubernetes-architect,terraform-specialist,environment-setup-guide,deployment-procedures,bash-linux}
|DevOps/Monitoring Pack:{observability-engineer,distributed-tracing,slo-implementation,incident-responder,postmortem-writing,performance-engineer}
|Data/Analytics Pack:{analytics-tracking,claude-d3js-skill,sql-pro,postgres-best-practices,ab-test-setup,database-architect}
|Data/Engineering Pack:{data-engineer,airflow-dag-patterns,dbt-transformation-patterns,vector-database-engineer,embedding-strategies}
|Creative/Content Pack:{canvas-design,frontend-design,content-creator,copy-editing,algorithmic-art,interactive-portfolio}
|QA/Testing Pack:{test-driven-development,systematic-debugging,browser-automation,e2e-testing-patterns,ab-test-setup,code-review-checklist,test-fixing}
|Mobile Pack:{mobile-developer,react-native-architecture,flutter-expert,ios-developer,app-store-optimization}
|Integration/API Pack:{stripe-integration,twilio-communications,hubspot-integration,plaid-fintech,algolia-search}
|Architecture/Design Pack:{senior-architect,architecture-patterns,microservices-patterns,event-sourcing-architect,architecture-decision-records}
|OSS/Author Pack:{commit,create-pr,requesting-code-review,receiving-code-review,changelog-automation,git-advanced-workflows,documentation-templates,skill-creator,skill-developer,writing-skills,documentation-generation-doc-generate,lint-and-validate,verification-before-completion}
