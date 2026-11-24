---
type: engineering
bop_ai: false
---

# Maximizing Antigravity with Obsidian

Your Obsidian vault (`Portfolio/`) lives directly inside the `d:\Dev\portfolio` workspace, giving Antigravity native zero-latency file access, plus automated build-time compilation into Bop AI.

## 1. Built-In Antigravity Integration (Active Now)
- **Workspace Skill:** `.agents/skills/obsidian-second-brain/SKILL.md` is auto-discovered by Antigravity on every session. It instructs Antigravity to consult `[[00-Home]]`, triage `06-Inbox/`, log ADRs in `07-Engineering/ADRs/`, and run `npm run sync:all`.
- **Frontmatter Control for Bop AI:**
  - Set `bop_ai: true` and `bop_order: <number>` in any note's YAML frontmatter to include it in Bop AI's compiled knowledge base.
  - Set `bop_ai: false` (or omit it) for engineering docs, inbox notes, and MOCs that are only for you and Antigravity.
- **Private Scratchpads:** Anything placed in `Portfolio/99-Private/` is gitignored and excluded from `sync-brain.mjs` and Vercel deployments.

## 2. Recommended Obsidian Community Plugins
Enable these inside Obsidian (`Settings -> Community plugins`) to supercharge your vault:
1. **Dataview** — Query certificates, projects, or ADRs dynamically inside notes (e.g., table of all `type: certification` notes sorted by `completed`).
2. **Templater** — Bound to `Portfolio/_Templates/` (`Project-Template.md`, `ADR-Template.md`, `Session-Log-Template.md`) for 1-click structured notes.
3. **Obsidian Git** (optional) — Commit vault-only edits straight from Obsidian on the go.

## 3. Optional: Cross-Workspace Obsidian MCP Setup
Because `Portfolio/` is already inside `d:\Dev\portfolio`, Antigravity can read and edit it natively without an MCP server. However, if you want **other** Antigravity workspaces (or global sessions) to query this vault live via MCP:

1. Install the **Local REST API** community plugin in Obsidian and copy your API key.
2. Ensure `uv` / `uvx` is installed.
3. Add this entry to your Antigravity global `mcp_config.json` (`C:\Users\marke\.gemini\antigravity\mcp_config.json`):

```json
{
  "mcpServers": {
    "obsidian-portfolio-brain": {
      "command": "uvx",
      "args": ["mcp-obsidian"],
      "env": {
        "OBSIDIAN_API_KEY": "<your-obsidian-local-rest-api-key>",
        "OBSIDIAN_HOST": "127.0.0.1",
        "OBSIDIAN_PORT": "27124"
      }
    }
  }
}
```

## 4. Daily Compounding Loop
1. Drop raw ideas or new achievements into `Portfolio/06-Inbox/`.
2. Drop new certificates into `D:\Job Related\Certificate\<ISSUER>\`.
3. Ask Antigravity to triage your inbox and run `npm run sync:all`.
4. Your portfolio UI, Obsidian graph, and Bop AI all stay synchronized in one pass.

Related: [[00-Home]] | [[README|Inbox Guide]] | [[ADR-001-Obsidian-Second-Brain]]
