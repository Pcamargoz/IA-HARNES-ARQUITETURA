---
title: Decision Records (ADR)
type: governance
status: active
updated: 2026-10-29
tags:
  - hermes
  - adr
---

# Decision Records

Format: context → decision → consequences. One decision per entry. Do not rewrite an accepted ADR; supersede it with a new one and mark the old one `superseded`.

---

## ADR-001 — Vault as the single source of context

**Status:** accepted · 2026-10-19

**Context:** ideas and rules were scattered across conversations and informal notes.

**Decision:** the Obsidian vault, versioned in Git, is the official source of vision, rules, processes, and catalogs.

**Consequences:** agents read from the vault; duplication outside it is forbidden; changes go through commits.

---

## ADR-002 — Local MCP over stdio

**Status:** accepted · 2026-10-19

**Context:** agents run on the same machine as the vault; remote hosting would add auth, latency, and attack surface.

**Decision:** Node MCP server inside `.mcp/`, stdio transport, vault path via `VAULT_ROOT`.

**Consequences:** no exposed network; portable between Windows and macOS; moving to remote HTTP requires a new ADR.

---

## ADR-003 — Writes disabled by default

**Status:** accepted · 2026-10-19

**Context:** an agent with unrestricted write access can corrupt context and rules.

**Decision:** `VAULT_ALLOW_WRITES=0` by default; when enabled, writes only inside `VAULT_WRITE_ROOTS` (default `Inbox`).

**Consequences:** agents propose changes through `Inbox/`; promotion to a canonical area is human or explicitly authorized.

---

## ADR-004 — Markdown + YAML frontmatter

**Status:** accepted · 2026-10-19

**Context:** need metadata for search, filters, and status.

**Decision:** every note has `title`, `type`, `status`, `updated`, `tags`.

**Consequences:** search can filter by type/status; Obsidian Properties displays the fields.

---

## ADR-005 — Lexical search first

**Status:** accepted · 2026-10-19

**Context:** embeddings require an index, a model, and maintenance cost; the vault is still small.

**Decision:** lexical search ranked by title, tags, headings, and body.

**Consequences:** works offline with no external dependency; synonyms and semantics are limited. Revisit when the vault passes ~500 notes.

---

## ADR-006 — Preserve the original folder structure

**Status:** superseded by ADR-007 · 2026-10-19

**Context:** the user had already created `HARNESS`, `Memory Agents`, `Metrics`, `Optimization`, and `Process`.

**Decision:** keep those names and fill them; create only the governance, security, and inbox folders.

**Consequences:** less friction and continuity with the original vision; navigation explained in [[HOME]]. The Portuguese folder names were later renamed to English by ADR-007.

---

## ADR-007 — English file and folder names

**Status:** accepted · 2026-10-19

**Context:** the vault mixed English content with Portuguese file and folder names, plus inconsistencies such as `RELATORIO.md` and `arquitetura-codigo.md`.

**Decision:** all note names and folders use English (`Governance`, `Security`, `Process`, `Process/code-architecture.md`, `REPORT.md`). `Ideas.md` keeps its original Portuguese content; only the file name is translated.

**Consequences:** navigation matches the language of the content; every `[[link]]` and index was updated; the MCP and link checker validate the result. Acronyms (`HARNESS`, `LLM MODELS`, `MCP`) remain uppercase.

---

## ADR-008 — Vault MCP v0.2: audit, query, and metrics tools

**Status:** accepted · 2026-10-20

**Context:** v0.1 ignored YAML list tags (so tag ranking never worked), never noticed edits made outside the server, matched headings by substring only ("Log" landed on "Execution Log"), and gave agents no way to audit the vault or aggregate metrics without reading whole files.

**Decision:** `hermes-vault` 0.2.0 parses list frontmatter, refreshes its index when files change (`VAULT_INDEX_TTL_MS`), prefers exact heading matches, and adds five read-only tools: `vault_outline`, `vault_query`, `vault_recent`, `vault_health`, `vault_metrics`. `vault_index` can skip the contract. Write and Git gates are unchanged (ADR-003).

**Consequences:** cheaper reads (outline → section), standards enforced by a tool instead of memory, metrics aggregated on demand. The health rules live in code (`STANDARD` in `.mcp/src/search.mjs`) and must change together with [[Governance/documentation-standards]].

---

## ADR-009 — Candidate status and a repositories catalog

**Status:** accepted · 2026-10-20

**Context:** the catalogs were empty templates; listing popular components as "active" would misstate what is actually installed.

**Decision:** catalogs distinguish **active** (configured here) from **candidate** (verified to exist and be maintained, not installed). A new [[Optimization/repositories-catalog]] lists source repositories, each verified through the GitHub API with a check date. Promotion from candidate to active follows [[Metrics/scorecard]].

**Consequences:** agents can recommend components without implying they are installed; catalogs need a quarterly re-check of every repository.

---

## ADR-010 — Web-context MCPs at project scope

**Status:** accepted · 2026-10-24

**Context:** `hermes-vault` was documented but not registered in Claude Code, so sessions in this folder had no vault tools. Agents also lacked a sanctioned way to read live web content; Firecrawl, Playwright, and Perplexity were added as context sources.

**Decision:** a committed `.mcp.json` registers `hermes-vault`, `playwright` (pinned, `--isolated --headless`), and `firecrawl` (hosted keyless tier) for this project. Perplexity stays a candidate until the user supplies an API key, and any keyed server is added at user scope so no secret is committed. `hermes-vault` moves to 0.3.1 (MCP SDK 1.32.2, `body-parser` audit fix); its tools are unchanged.

**Consequences:** every Claude Code session here gets vault and web tools after a one-time approval. Playwright's version must be bumped on the quarterly catalog check. Web tools send queries to third parties: follow [[Security/permissions]].

---

## ADR-011 — Video engine v6 imported from the Flow harness

**Status:** accepted · 2026-10-26

**Context:** the user wants to make explainer videos about any subject here. The Remotion engine v6 and its research (repositories, editing spec, quality metrics) lived in Harness-Arquitetura-Flow and in the Guia-Do-Consultor repository, tied to the Faktory Flow brand and client content.

**Decision:** copy only the engine into `video-engine/` (MotorV6, scripts, sound generators, SFX) with brand, Chrome path, and recorder URL made configurable, plus a neutral example script. Import the engine knowledge into `Knowledge/video-engine/` (split to stay under 250 lines), so it is in the default `vault_retrieve` corpus. Client scripts, screen captures, narration audio, and the cloned voice were not copied.

**Consequences:** agents reach the engine knowledge through `hermes-vault`. Rendering needs Node and, for the final file and QA, ffmpeg. The Remotion company license applies to teams of 4 or more people. Engine improvements happen here; the Flow copy is not kept in sync.

---

## ADR-012 — Agent Knowledge integration and canonical registry

**Status:** accepted · 2026-10-29 (Pedro approved the integration plan)

**Context:** the Agent-Knowledge-MCP is already registered at user scope in Claude Code and Desktop. Its approved configuration exposes only AI-Agent-Ecosystem and this Harness. Its agent tools read the KB registry, not arbitrary Harness specs.

**Decision:** keep the existing registrations and hermes-vault unchanged. Use Agent-Knowledge-MCP as a read-only knowledge source. Keep agent specs canonical in AI-Agent-Ecosystem/10-Multi-Agent-Orchestration/01-Agent-Registry/Agents; the Harness links to them and validates them instead of keeping another copy. Adopt a short orchestrator entry, bounded delegation, independent verification, explicit budgets, project-local Claude hooks and metadata-only telemetry outside both vaults.

**Consequences:** the KB remains the registry authority. Installed CLI, implemented adapter, authenticated session and integrated workflow are separate states. No CLI adapter is promoted by a successful direct client check. E1–E3, global installs and the two-agent experiment remain separate work. Existing user changes are preserved byte-for-byte.

**Rollback:** revert only integration commits on integration/agent-knowledge; remove only the project hook entries added by this integration. Never reset the repository or alter existing client MCP servers. Base before integration: e58744dca6d88bbf043110950c08f75ce82fa043.

---

## ADR-013 — Activate supervised orchestration in Maestri

**Status:** accepted · 2026-10-29 (Pedro requested activation here)

**Context:** the integration is configured but its first delivery lacks independent review and a native Codex MCP session. The current terminal is the Maestri maestro; no teammates are connected. Claude Code remains quota-blocked.

**Decision:** use the existing Codex preset/account for two scoped, read-only native Maestri roles: integration reviewer and technical validator. Run one bounded real acceptance workflow, then keep the team available without polling or autonomous new work. Add agent-knowledge at project scope for Codex with the already approved restricted AKM_CONFIG. Carry the same MCP configuration as launch overrides when project trust prevents loading it. Preserve every other MCP server and existing work.

**Consequences:** native Maestri transport is a supervised client workflow, not proof that the CLI AgentPort adapter has been tested. No model override, global install, two-agent experiment script or permission bypass is introduced. Promote role specs only after a real bounded task succeeds with evidence. This session cannot hot-add tools to its already loaded inventory; use SDK retrieval here and native MCP in newly launched teammates.

**Rollback:** remove only the new project MCP block/config and role activation references; revert this decision's commits if desired. Do not stop or delete existing nodes; these recruits remain visible and idle after completion unless Pedro requests otherwise.

---

## ADR-014 — Project-bound ControlFree team and explicit development gate

**Status:** accepted · 2026-10-29 (Pedro requested configuration and contextualization before his next OK)

**Context:** the next target is ControlFree_Api and the project specs in the explicitly authorized Control Free vault directory. Its onda-3 branch contains preexisting work, including E11/wave-4 migrations. Starting the next wave cannot be inferred from that state.

**Decision:** reuse Lince and Prumo as independent back-end review/QA, add Cedro (Claude Code CC lane) and Nexo (Codex AUX lane), and keep Codex as maestro. Configure project-only entry/MCP files and a shared role briefing. Hold all children in read-only/plan onboarding until Pedro approves development. Respect one owner per file, serialized Maven/hot-file edits, progressive context and reported-only usage metrics.

**Consequences:** three Codex agents acknowledged context. Claude received the prompt but remains quota-blocked; its automatic continuation was cancelled, and no account/model substitution is made. No feature, test, compile, database action, migration promotion, API commit or push is authorized by this setup. The original source/migration work was preserved by hash.

**Rollback:** revert only Harness setup records; remove only newly added ControlFree project entry/MCP configuration if requested. Existing user work, user-scope MCP registrations and other projects remain unchanged. Do not delete canvas nodes or roles without Pedro requesting it.

---

## Template for a new ADR

```markdown
## ADR-00N — Title

**Status:** proposed | accepted | superseded by ADR-00M · YYYY-MM-DD

**Context:** ...

**Decision:** ...

**Consequences:** ...
```
