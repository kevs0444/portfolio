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

## AI Assistant Contract (easy to break)
- `/api/chat` requires `GROQ_API_KEY`; if missing, route intentionally returns `503`.
- `GROQ_MODEL` is optional; default is `llama-3.3-70b-versatile`.
- Portfolio facts are hardcoded in `knowledgeBase` inside `app/api/chat/route.ts`; when updating resume/projects/contact info in UI, update that knowledge base too.
- Do not add hardcoded fallback responses in the API route unless explicitly requested.

## Assets and Paths
- Frontend uses URLs like `/assets/...`, which must exist under `public/assets/...`.
- The root-level `assets/` folder is not web-served by Next.js; avoid wiring new runtime URLs to it.
- Resume modal depends on `public/assets/resume.pdf`.

## Deployment Notes (Vercel)
- Node engine is `>=20.9.0 <25` in `package.json`; keep Vercel Node.js version within this range.
- Set Vercel env vars for Preview/Production: `GROQ_API_KEY` (required), `GROQ_MODEL` (optional).
- After changing env vars, redeploy; status codes from `/api/chat` are meaningful:
  - `503`: missing/empty `GROQ_API_KEY`
  - `502`: Groq request failed upstream
  - `500`: runtime failure in route

## Current WIP Priorities
- Keep `app/page.tsx` and `app/globals.css` in sync for modal/skills class names (`preview-modal`, `clip-frame`, `skills-showcase`, `skills-aside`, `skill-card`).
- Run `npm run build` after UI changes, then do a quick mobile pass for spacing and modal behavior.
- Never commit real API keys (`.env*` is gitignored); rotate exposed keys immediately.
