---
title: MCP Catalog
type: catalog
status: active
updated: 2026-10-29
tags:
  - hermes
  - mcp
  - catalog
---

# MCP Catalog

Registry of MCP servers used by the ecosystem. Each entry says what it does, what it exposes, and what it costs.

Statuses: **active** (configured and used here), **candidate** (verified to exist and maintained, not yet tested here), **evaluating** (being tested), **deprecated**. A candidate becomes active only after the adoption rules below.

## Card format

```markdown
## <name>

- **Status:** active | candidate | evaluating | deprecated
- **Purpose:** one sentence
- **Transport:** stdio | http
- **Tools:** main tools
- **Access:** local | remote
- **Auth:** none | token | oauth
- **Cost:** tokens/complexity
- **Risk:** read-only | writes | external actions
- **Owner:** who maintains it
- **Notes:** limits
```

## Active

### hermes-vault

- **Status:** active (v0.3.1)
- **Purpose:** read, audit, and (optionally) write to this vault
- **Transport:** stdio
- **Tools:** `vault_index`, `vault_search`, `vault_retrieve`, `vault_read`, `vault_outline`, `vault_list`, `vault_links`, `vault_query`, `vault_recent`, `vault_health`, `vault_metrics`, `vault_write`, `vault_commit`
- **Access:** local
- **Auth:** none
- **Cost:** low; `vault_outline` + `vault_read(heading)` is the cheapest read path
- **Risk:** read-only by default; writes restricted to `Inbox/`
- **Owner:** this repository
- **Retrieval:** `vault_retrieve` is local RAG over the knowledge pack (`Knowledge/` + `Process/design-patterns.md` + `Process/minimal-validation.md`): heading chunks, lexical rank, max 3 chunks × 1500 chars, with citations; no network, no embeddings
- **Notes:** lexical search; index refreshes on disk changes (`VAULT_INDEX_TTL_MS`). Registration target: the global OpenBot MCP list (Settings -> MCP servers), so every agent inherits the same 13 tools; the user performs that one-time step. Full guide: [[MCP]]

### context7

- **Status:** active (user scope)
- **Purpose:** up-to-date library and framework documentation, so agents stop guessing APIs
- **Transport:** stdio
- **Tools:** `resolve-library-id`, `query-docs`
- **Access:** remote (docs API)
- **Auth:** none (optional API key for higher limits)
- **Cost:** medium; ask focused questions, not whole manuals
- **Risk:** read-only
- **Owner:** Upstash — `upstash/context7`
- **Notes:** use before writing code against any third-party library

### playwright

- **Status:** active (project scope, `.mcp.json`, pinned `@playwright/mcp@0.0.83`)
- **Purpose:** drive a real browser through the accessibility tree for UI checks and exploratory automation
- **Transport:** stdio (`cmd /c npx` on Windows)
- **Tools:** 25 `browser_*` tools — `browser_navigate`, `browser_snapshot`, `browser_click`, `browser_fill_form`, `browser_console_messages`, `browser_evaluate`, ...
- **Access:** local
- **Auth:** none
- **Cost:** high; every snapshot is an accessibility tree. Prefer a targeted check over long sessions
- **Risk:** external actions in a browser; runs `--isolated --headless` (profile in memory, no saved logins)
- **Owner:** Microsoft — `microsoft/playwright-mcp`
- **Notes:** for repeatable E2E, write Playwright tests instead; bump the pinned version on the quarterly check

### firecrawl

- **Status:** active (project scope, hosted keyless tier)
- **Purpose:** turn web pages into clean markdown/JSON; web search
- **Transport:** http — `https://mcp.firecrawl.dev/v2/mcp`
- **Tools:** keyless: `firecrawl_scrape`, `firecrawl_search`, `firecrawl_parse`. With an API key: also `crawl`, `map`, `extract`, `interact`, `agent`, monitors (27 total)
- **Access:** remote
- **Auth:** none on the keyless tier (rate-limited); API key via the client's header setting, never in the URL or chat
- **Cost:** medium; scrape only the URLs you need, `search` without `scrapeOptions` is cheapest
- **Risk:** read-only; sends URLs and queries to Firecrawl
- **Owner:** Firecrawl — `firecrawl/firecrawl-mcp-server`
- **Notes:** to unlock the full set, set the key in the client config (`Authorization: Bearer ...`); do not commit it

### Choosing a web tool

| Need | Use |
|---|---|
| Library or framework API docs | context7 |
| Read one known URL as markdown | firecrawl `firecrawl_scrape` |
| Find pages from a query | firecrawl `firecrawl_search` (or Perplexity once enabled) |
| Cited answer or deep research | Perplexity `perplexity_ask` / `perplexity_research` (candidate) |
| Click, fill, or verify a UI | playwright |

### Desktop connectors (Claude app)

Available in the Claude desktop session, not configured in this repository: **Vercel** (deployments, logs, env vars, domains) and **Claude in Chrome** (drives the user's browser). Both can take external actions — follow [[Security/permissions]] before any write, deploy, or form submission.

## Candidates

Verified on 2026-10-20 to exist and be maintained (GitHub stars in parentheses). None is installed; pick by real need.

| Server | Repository | Use when | Risk |
|---|---|---|---|
| Reference servers (filesystem, git, fetch, memory, sequentialthinking, time, everything) | `modelcontextprotocol/servers` (91k) | baseline capabilities; `everything` is a protocol test server | filesystem/git write locally |
| GitHub | `github/github-mcp-server` (34k) | issues, PRs, code search, Actions | writes to remote repos (token scope) |
| Perplexity | `perplexityai/modelcontextprotocol` (3k) | web search, cited answers, deep research (`perplexity_search`, `perplexity_ask`, `perplexity_research`, `perplexity_reason`) | external API, paid per call; needs `PERPLEXITY_API_KEY` |
| Chrome DevTools | `ChromeDevTools/chrome-devtools-mcp` (54k) | performance traces, network, console debugging | browser control |
| Supabase | `supabase/mcp` (3k) | schema, SQL, migrations on Supabase projects | database writes — use read-only mode |
| Notion | `makenotion/notion-mcp-server` (5k) | reading/writing Notion workspaces | writes to shared docs |
| Exa | `exa-labs/exa-mcp-server` (5k) | web search and crawling for research | external API, cost per call |

Discovery: the official registry `modelcontextprotocol/registry` and the community list `punkpeye/awesome-mcp-servers`. Testing: `modelcontextprotocol/inspector`. See [[Optimization/repositories-catalog]].

### Recommended next adoptions

| Order | Server | Why |
|---|---|---|
| 1 | GitHub (read-only token first) | the vault already lives on GitHub; issues and PRs without leaving the agent |
| 2 | Perplexity | cited research answers; activate once the user provides an API key (see [[MCP]] §3) |
| 3 | `git` reference server | only if the client lacks a shell; otherwise the shell is cheaper |

## Evaluating

Fill only with what was actually tested. Suggested dimensions:

| Criterion | Question |
|---|---|
| Real utility | does it solve a recurring need? |
| Tool quality | do the tools return useful, compact data? |
| Security | what access does it require? |
| Cost | how many tokens per call? |
| Maintenance | who fixes it when it breaks? |

Record each evaluation as a row in [[Metrics/execution-log]] with the server in the `Skill/MCP` column; the component scorecard in [[Metrics/scorecard]] decides promotion.

## Rules for adopting an MCP

1. It solves a need that already exists (not a solution looking for a problem).
2. Minimum privilege: read-only whenever possible.
3. No secrets in arguments or logs.
4. Preference for local/stdio when the data is local.
5. Document tools and limits in this catalog.
6. Test before enabling in the daily flow.
7. Installing a global MCP requires explicit user approval ([[AGENTS]] §7).

## Anti-patterns

| Anti-pattern | Risk |
|---|---|
| Installing many servers "just in case" | attack surface and noise |
| Broad write access | corrupted data |
| Remote server without auth | exposure |
| Duplicated function | confusion about which to use |
| No owner | abandoned server |

## Remote MCP

Only when there is a real need for mobile or cloud use. Requires: authentication, TLS, rate limit, audit log, and a new ADR. The local model remains the default (ADR-002).

Related: [[Optimization/skills-catalog]], [[Optimization/plugins-catalog]], [[Optimization/repositories-catalog]], [[Security/permissions]].

## Agent-Knowledge-MCP

- **Status:** active for local SDK retrieval; native client acceptance tracked in [[Governance/knowledge-integration]].
- **Version / transport:** 0.3.0 / stdio; 22 tools, readOnlyHint=true.
- **Purpose:** retrieve AI-Agent-Ecosystem policies, architecture, canonical agent specs and runtime contracts by section.
- **Access / auth:** local read-only files; MCP itself needs no credentials.
- **Configuration:** existing user-scope agent-knowledge in Claude Code and Claude Desktop; no duplicate project registration.
- **Allowed roots:** Cofre do Pedro with include=AI-Agent-Ecosystem; Harness-Architecture. No expansion to skills or project notes without approval.
- **Limits:** lexical search; proposed policies are data; adapter detection uses a timestamped manifest.
- **Owner / checked:** Pedro / 2026-10-29, local configuration and SDK tests.
- **Rollback:** revert this card and workflow references; leave existing registrations and hermes-vault unchanged.

## Research-backed candidates (M8)

These entries come from the approved AI-Agent-Ecosystem KB read on 2026-10-29. That date verifies local research availability, not current upstream maintenance or production acceptance. No component below is installed by this integration.

| Candidate | Need / gate | Status |
|---|---|---|
| Serena | symbol-level code retrieval; E1 before project registration | candidate |
| Basic Memory | shared durable facts in a separate directory; E2 | candidate |
| Spring AI | Java AI integration when a project requires it | candidate |
| MCP Java SDK | Java MCP client/server when a project requires it | candidate |
| Headroom | output reduction only after F0 shows material log cost | candidate |
| LangChain4j | compare only for a concrete Java runtime need | candidate |

Sources: query agent-knowledge for the matching tool note before adoption. Preserve least privilege and existing read-only vault policy. No candidate is promoted by this catalog entry.
