# AGENTS.md

## Quick Commands
- `npm install`
- `npm run sync:certs` (syncs certificates from `D:\Job Related\Certificate` to UI + Obsidian vault)
- `npm run sync:brain` (compiles `Portfolio/` Obsidian notes with `bop_ai: true` into `app/data/generated-knowledge.ts`)
- `npm run sync:all` (runs `sync:resume`, `sync:certs`, and `sync:brain`)
- `npm run dev`
- `npm run build` (main verification gate; runs `sync:all` in `prebuild`; there is no lint script)
- `node --test tests/groq.test.cjs` (routing, retry, moderation, and chat API regression checks)
- `npm run start`

## Repo Shape (single app)
- This is one Next.js App Router app (not a monorepo).
- Main UI, section content data, modal state, and chat client logic are all in `app/page.tsx`.
- Global visual system and responsive behavior are centralized in `app/globals.css`.
- Theme bootstrapping is in `app/layout.tsx` (`data-theme` + `localStorage`).
- Portfolio AI API route is `app/api/chat/route.ts`.
- Mobile navigation uses a **burger toggle + slide-in drawer** (`mobileMenuOpen` state, `.burger-toggle`, `.mobile-drawer`). Desktop keeps the pill-style sticky nav. Breakpoint is `880px`.

## AI Assistant Contract (easy to break)
- The assistant persona/name exposed to users is **Bop AI**; keep UI labels and API error copy consistent with that name.
- `/api/chat` requires at least one configured provider key; if all are missing, the route intentionally returns `503`.
- Automatic question-based routing is the default, using the live Groq model catalog. `GROQ_ROUTING=single` uses `GROQ_MODEL` (legacy default `llama-3.3-70b-versatile`).
- `app/lib/groq.ts` owns routing and Groq requests; optional `GROQ_MODERATION=true` adds a separate guard call. Default off to conserve free-tier requests.
- `app/lib/gemini.ts` is an optional fallback. When `GEMINI_API_KEY` is set, `/api/chat` uses Gemini only after Groq fails or is unavailable.
- `app/lib/cerebras.ts` is the final optional fallback. When `CEREBRAS_API_KEY` is set, `/api/chat` uses Cerebras after configured Groq and Gemini attempts fail.
- Portfolio facts are compiled from the Obsidian 2nd brain (`Portfolio/**/*.md` where `bop_ai: true`) into `app/data/generated-knowledge.ts` by `scripts/sync-brain.mjs`, then loaded via `buildKnowledgeBase()` in `app/api/chat/route.ts`. Keep `app/data/generated-knowledge.ts` as a pure relative `.ts` module (no `.json` or `@/` imports) so `tests/groq.test.cjs` loads cleanly. When updating resume/projects/contact info in UI, update the corresponding note in `Portfolio/` and run `npm run sync:all`.
- Do not add hardcoded fallback responses in the API route unless explicitly requested.

## Obsidian 2nd Brain (`Portfolio/`)
- `Portfolio/` is the repo-local Obsidian vault acting as the single source of truth for portfolio knowledge and engineering memory.
- Entry point: `Portfolio/00-Home.md`.
- Workspace skill: `.agents/skills/obsidian-second-brain/SKILL.md` (guides vault consultation, `Portfolio/06-Inbox/` triage, ADRs in `Portfolio/07-Engineering/ADRs/`, and sync execution).
- Keep private/local-only scratchpads inside `Portfolio/99-Private/` (gitignored and excluded from `sync-brain.mjs`).

## Assets and Paths
- Frontend uses URLs like `/assets/...`, which must exist under `public/assets/...`.
- The root-level `assets/` folder is not web-served by Next.js; avoid wiring new runtime URLs to it.
- Resume modal depends on `public/assets/resume.pdf`.
- Project images live in `public/assets/images/projects/`; all four projects now have images (including `kilo-bot.png`).
- When adding a new project image, copy from `assets/` (source) to `public/assets/` (served) and set the `image` field in the `projects` array.

## Deployment Notes (Vercel)
- Node engine is `>=20.9.0 <25` in `package.json`; keep Vercel Node.js version within this range.
- Set at least one provider key in Vercel Preview/Production: `GROQ_API_KEY`, `GEMINI_API_KEY`, or `CEREBRAS_API_KEY`. Provider model overrides are optional.
- After changing env vars, redeploy; status codes from `/api/chat` are meaningful:
  - `503`: all provider keys are missing or empty
  - `502`: every configured AI provider failed upstream
  - `500`: runtime failure in route

## Design System & UI Rules (Strict Aesthetic Mandate)
- **Zero Emojis / Memojis**: NEVER use emojis (e.g. 💼, 📊, 🤝, 💬, 📍, ⚡) or Memoji-style graphics in UI buttons, chips, tags, labels, navigation, or placeholders.
- **Minimalist Vector SVGs Only**: All icons must be clean, lightweight vector SVGs with consistent stroke width (`1.8px`), uniform bounding boxes, and monochromatic styling (`currentColor`, inheriting `var(--muted)` and `var(--text)`).
- **Avoid Generic "AI-Generated" UI Clichés**: Do not use generic AI template patterns such as gratuitous purple/neon gradients, bloated floating cards with meaningless metrics, or cookie-cutter SaaS layouts. Adhere strictly to the portfolio's bespoke **Data Analytics & Engineering Dashboard** visual language (dense, purposeful typography, telemetry dots, terminal aesthetic, and structured consoles).
- **Media Optimization for Free Vercel Tier**: Always use `preload="none"` on video elements to prevent consuming bandwidth on initial load, provide static poster frames, and use `muted playsInline` for seamless mobile playback.

## Current WIP Priorities
- Keep `app/page.tsx` and `app/globals.css` in sync for modal/skills class names (`preview-modal`, `clip-frame`, `skills-showcase`, `skills-aside`, `skill-card`).
- Mobile-specific class names to keep in sync: `burger-toggle`, `mobile-drawer`, `mobile-drawer__panel`, `mobile-drawer__links`, `mobile-drawer__actions`.
- Contact section uses `contact-deck`, `contact-dossier` (Resume card + Direct Directory), and `contact-console` (interactive topic chips with minimal vector icons). Maintain the asymmetric 2-column layout and minimal vector icon standard.
- Note: A horizontal sticky scroll feature was proposed for the projects section but intentionally rejected. The standard vertical stack should be maintained.
- Run `npm run build` after UI changes, then do a quick mobile pass for spacing and modal behavior.
- Never commit real API keys (`.env*` is gitignored); rotate exposed keys immediately.

## Environment Variables
- Always keep .env.example in sync with the structure of .env. Whenever you add, modify, or remove an environment variable in .env, ensure you reflect that change (without the secret values) in .env.example.
