# AGENTS.md

## Quick Commands
- `npm install`
- `npm run dev`
- `npm run build` (main verification gate; there are no lint/test scripts)
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
- `/api/chat` requires `GROQ_API_KEY`; if missing, route intentionally returns `503`.
- `GROQ_MODEL` is optional; default is `llama-3.3-70b-versatile`.
- Portfolio facts are hardcoded in `knowledgeBase` inside `app/api/chat/route.ts`; when updating resume/projects/contact info in UI, update that knowledge base too.
- Do not add hardcoded fallback responses in the API route unless explicitly requested.

## Assets and Paths
- Frontend uses URLs like `/assets/...`, which must exist under `public/assets/...`.
- The root-level `assets/` folder is not web-served by Next.js; avoid wiring new runtime URLs to it.
- Resume modal depends on `public/assets/resume.pdf`.
- Project images live in `public/assets/images/projects/`; all four projects now have images (including `kilo-bot.png`).
- When adding a new project image, copy from `assets/` (source) to `public/assets/` (served) and set the `image` field in the `projects` array.

## Deployment Notes (Vercel)
- Node engine is `>=20.9.0 <25` in `package.json`; keep Vercel Node.js version within this range.
- Set Vercel env vars for Preview/Production: `GROQ_API_KEY` (required), `GROQ_MODEL` (optional).
- After changing env vars, redeploy; status codes from `/api/chat` are meaningful:
  - `503`: missing/empty `GROQ_API_KEY`
  - `502`: Groq request failed upstream
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
