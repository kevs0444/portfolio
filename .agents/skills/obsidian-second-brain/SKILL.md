---
name: obsidian-second-brain
description: >-
  Workflow for using the Portfolio/ Obsidian vault as the single source of truth
  for Mar Kevin's portfolio content, Bop AI knowledge base, and architectural memory.
  Use before updating portfolio facts, triaging Portfolio/06-Inbox/, logging ADRs,
  or syncing certificates from D:\Job Related\Certificate.
---

# Obsidian Second Brain Workflow (`Portfolio/`)

The Obsidian vault at `Portfolio/` is both the **full knowledge base for Bop AI** and the **engineering second brain** for this repository.

## 1. Consult Before Editing
- Start at `Portfolio/00-Home.md` to find the canonical note for any portfolio section (profile, experience, projects, skills, gear, certifications, or architecture).
- When updating portfolio content (experience, projects, skills, contact info, gear, or credentials), update the corresponding Markdown note in `Portfolio/` alongside UI edits in `app/page.tsx` or `app/personal/page.tsx`.

## 2. Frontmatter Contract for Bop AI
Notes inside `Portfolio/` are compiled into `app/data/generated-knowledge.ts` by `scripts/sync-brain.mjs`:
- `bop_ai: true` — Includes the note in Bop AI's prompt knowledge base.
- `bop_order: <number>` — Controls deterministic ordering in the compiled prompt.
- `auto_synced: true` — Marks notes managed by `scripts/sync-certificates.mjs` under `Portfolio/05-Certifications/` (do not hand-edit; use `app/data/certificates.overrides.json` for overrides).

## 3. Triage `Portfolio/06-Inbox/`
When asked to process the inbox:
1. Read all raw Markdown files in `Portfolio/06-Inbox/` (excluding `README.md`).
2. Synthesize each item into the appropriate domain folder (`01-Profile/`, `02-Experience/`, `03-Projects/`, `04-Skills-and-Setup/`, or `07-Engineering/`) using `[[wikilinks]]` back to `[[00-Home]]` and related MOCs.
3. Add `bop_ai: true` and an appropriate `bop_order` if visitors/recruiters should be able to ask Bop AI about it.
4. Remove or archive processed inbox files, then run `npm run sync:all`.

## 4. Record Architectural Decisions (ADRs)
- Use `Portfolio/_Templates/ADR-Template.md` to record major architectural or workflow changes in `Portfolio/07-Engineering/ADRs/`.
- Keep private drafts, salary expectations, or personal scratchpads strictly inside `Portfolio/99-Private/` (gitignored and never compiled into Bop AI).

## 5. Synchronize After Every Vault or Certificate Update
Always run:
```powershell
npm run sync:all
```
This runs `sync:resume`, `sync:certs` (extracting PDFs/images from `D:\Job Related\Certificate`), and `sync:brain` (recompiling `app/data/generated-knowledge.ts` for Bop AI), keeping the UI, Obsidian vault, and Bop AI aligned.
