---
title: Plugins, Hooks, and LSP
type: catalog
status: active
updated: 2026-10-20
tags:
  - hermes
  - plugins
  - catalog
---

# Plugins, Hooks, and LSP

Catalog of extensions that change how the agent works — not what it knows.

## Categories

| Category | What it does | Example of use |
|---|---|---|
| **Plugin** | adds capability to a tool | browser, database, issue tracker |
| **Hook** | automatic action on an event | validate before commit |
| **LSP** | semantic code intelligence | diagnostics, symbols, references |
| **Formatter/linter** | enforces style | automatic correction |
| **CI** | verifies on every push | tests and build |

## Card format

```markdown
## <name>

- **Status:** active | candidate | evaluating | deprecated
- **Category:** plugin | hook | lsp | formatter | ci
- **Purpose:** one sentence
- **Triggers:** when it acts
- **Prerequisites:** install, access
- **Effect:** what changes in the flow
- **Risk:** low | medium | high
- **Owner:** who maintains it
```

## Hooks: recommended order

```
before commit → lint + tests + secret scan
before push   → build + full tests
after edit    → format (optional)
```

A hook that takes more than a few seconds gets disabled by the user. Keep it fast or move it to CI.

## LSP: what it solves

- The agent stops guessing symbols and signatures.
- Diagnostics before running the code.
- Navigation in large repositories.

LSP is the highest-value capability per token in code projects: it replaces exploratory reads with precise queries.

## Candidates

Verified on 2026-10-20. Nothing below is installed yet; "candidate" means it exists, is maintained, and fits a known need.

### Claude Code plugins (official directory)

Source: `anthropics/claude-plugins-official` (43k stars). Install from the marketplace inside Claude Code (`/plugin`).

| Plugin | Category | Fits which Hermes step | Note |
|---|---|---|---|
| `code-review`, `pr-review-toolkit` | plugin | Validate — [[Process/code-review]] | overlaps the `final-code-review` skill; keep one owner per gate |
| `security-guidance` | hook | Execute — warns on risky edits | complements secret scan, does not replace it |
| `commit-commands` | plugin | Deliver — commit/push/PR | follow [[Security/autonomy]] for push |
| `feature-dev` | plugin | Specify → Execute for features | compare against `short-spec` before adopting |
| `hookify` | hook | turns repeated corrections into hooks | review every generated hook |
| `claude-md-management` | plugin | Record — keeps CLAUDE.md lean | |
| `skill-creator`, `plugin-dev`, `mcp-server-dev` | plugin | building Hermes components | use when extending `.mcp/` or skills |
| `session-report` | plugin | Metrics — session summaries | feed results into [[Metrics/execution-log]] |
| `typescript-lsp`, `pyright-lsp`, `gopls-lsp`, `rust-analyzer-lsp`, `csharp-lsp`, `jdtls-lsp` | lsp | Execute — precise symbols | install only for the languages in use |

Community marketplaces: `wshobson/agents` (41k, multi-harness plugins), `obra/superpowers` (302k, skills methodology). Treat third-party plugins as untrusted code: read before installing.

### Hooks, linters, and CI

| Tool | Repository | Category | Hermes use |
|---|---|---|---|
| gitleaks | `gitleaks/gitleaks` (30k) | hook | secret scan before commit (priority 2) |
| pre-commit | `pre-commit/pre-commit` (16k) | hook | runner for multi-language commit hooks |
| Biome | `biomejs/biome` (26k) | formatter/linter | JS/TS lint + format in one fast binary |
| Ruff | `astral-sh/ruff` (50k) | formatter/linter | Python lint + format |
| Claude Code Action | `anthropics/claude-code-action` (10k) | ci | agent reviews and fixes on GitHub PRs |

Suggested first hook for this vault: `npm --prefix .mcp test` before push (≈ a few seconds), so link and MCP regressions never reach `main`.

## Adoption rules

1. Solve an existing pain.
2. Low risk and reversible.
3. Documented in this catalog.
4. Fast (hooks).
5. No secrets in configuration.
6. Tested before entering the daily flow.

## Priority

| Priority | Item | Reason |
|---|---|---|
| 1 | tests + lint in CI | prevents regression |
| 2 | secret scan on commit | security |
| 3 | LSP in the main IDE | reduces context |
| 4 | formatter on save | consistency |
| 5 | domain plugins | only with real demand |

## Anti-patterns

| Anti-pattern | Effect |
|---|---|
| Hook that runs the whole suite on every save | slows work |
| Plugin without an owner | abandoned |
| LSP disabled | agent guesses APIs |
| Automatic formatting without review | noisy diff |
| Secret in hook config | leak |

Related: [[Optimization/skills-catalog]], [[Optimization/mcp-catalog]], [[Optimization/repositories-catalog]], [[Process/code-architecture]].
