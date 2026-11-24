---
type: engineering
bop_ai: false
---

# Portfolio Architecture Overview

- **Framework:** Single Next.js App Router application (`app/page.tsx`, `app/personal/page.tsx`, `app/globals.css`, `app/layout.tsx`).
- **Bop AI Pipeline (`app/api/chat/route.ts`):**
  - Multi-provider cascade: `Groq` (catalog routing via `app/lib/groq.ts`, optional `GROQ_MODERATION`) -> `Gemini` (`app/lib/gemini.ts`) -> `Cerebras` (`app/lib/cerebras.ts`).
  - Rate-limited via Upstash Redis (`app/lib/rate-limit.ts`) with in-memory fallback.
  - Knowledge base is compiled at build/dev time by `scripts/sync-brain.mjs` from `Portfolio/**/*.md` (`bop_ai: true`) into `app/data/generated-knowledge.ts`.
- **Asset & Data Sync Scripts (`npm run sync:all`):**
  1. `scripts/sync-resume.mjs` — Syncs `D:\Job Related\Resume\Mar_Kevin_Alcantara_Resume.pdf` -> `public/assets/resume.pdf` + `resume-preview.png`.
  2. `scripts/sync-certificates.mjs` — Syncs `D:\Job Related\Certificate` -> `public/assets/images/certifications/`, `app/data/generated-certificates.ts`, and `Portfolio/05-Certifications/*.md`.
  3. `scripts/sync-brain.mjs` — Compiles `Portfolio/` -> `app/data/generated-knowledge.ts`.

Related: [[00-Home]] | [[Design-System]] | [[ADR-001-Obsidian-Second-Brain]]
