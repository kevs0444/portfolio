---
type: adr
status: accepted
date: 2026-11-25
bop_ai: false
---

# ADR-001: Obsidian Vault as Portfolio Second Brain

## Context
Portfolio facts (experience, projects, skills, gear, and certifications) previously lived in two places: `app/page.tsx` and a hardcoded `knowledgeBase` string inside `app/api/chat/route.ts`. Updating a certificate or project meant editing multiple files manually.

## Decision
1. Turn the repo-local Obsidian vault (`Portfolio/`) into the single source of truth for portfolio knowledge and engineering memory.
2. Add `scripts/sync-certificates.mjs` to auto-extract certificates from `D:\Job Related\Certificate` into both `app/data/generated-certificates.ts` (for the UI) and `Portfolio/05-Certifications/*.md` (for Obsidian + Bop AI).
3. Add `scripts/sync-brain.mjs` to compile all vault notes with `bop_ai: true` into `app/data/generated-knowledge.ts` at `predev` and `prebuild`.
4. Add `.agents/skills/obsidian-second-brain/SKILL.md` so Antigravity reads, triages, and updates the vault systematically.

## Consequences
- **Positive:** Adding a new certificate PDF/image to `D:\Job Related\Certificate` and running `npm run sync:all` updates the UI rail, the Obsidian vault, and Bop AI automatically.
- **Positive:** Vercel builds stay self-contained because `Portfolio/` (minus `99-Private/` and `workspace*.json`) and generated `.ts` files are committed to Git.
- **Guardrail:** `app/data/generated-knowledge.ts` must remain a pure relative `.ts` module with no `.json` or `@/` imports so `tests/groq.test.cjs` can load `route.ts`.

Related: [[00-Home]] | [[Architecture-Overview]] | [[Obsidian-Antigravity-Setup]]
