---
title: Repositories Catalog
type: catalog
status: active
updated: 2026-10-29
tags:
  - hermes
  - repositories
  - catalog
---

# Repositories Catalog

Reference repositories that feed Hermes: SDKs, official component sources, and curated lists. A repository here is a **source to consult**, not a dependency. Adopting something from it goes through the matching catalog.

Every entry was verified through the GitHub API on 2026-10-20 (stars rounded). Re-check quarterly; remove archived or moved repositories.

## Card format

```markdown
## <owner/repo>

- **Kind:** sdk | official-components | curated-list | tool | reference
- **Why Hermes uses it:** one sentence
- **Feeds:** which catalog or process note
- **Trust:** official | vendor | community
- **Last check:** YYYY-MM-DD
```

## Official — protocol and SDKs

| Repository | Stars | Kind | Why Hermes uses it | Feeds |
|---|---|---|---|---|
| `modelcontextprotocol/typescript-sdk` | 14k | sdk | the SDK `hermes-vault` is built on | [[MCP]] |
| `modelcontextprotocol/servers` | 91k | official-components | reference servers and patterns | [[Optimization/mcp-catalog]] |
| `modelcontextprotocol/registry` | 7k | curated-list | official MCP server registry | [[Optimization/mcp-catalog]] |
| `modelcontextprotocol/inspector` | 11k | tool | visual testing of MCP servers | [[MCP]] §10 |

## Official — Anthropic

| Repository | Stars | Kind | Why Hermes uses it | Feeds |
|---|---|---|---|---|
| `anthropics/claude-code` | 153k | reference | client behavior, hooks, settings, plugins | [[HARNESS/LLM MODELS/ide-harness]] |
| `anthropics/skills` | 182k | official-components | official Agent Skills | [[Optimization/skills-catalog]] |
| `anthropics/claude-plugins-official` | 43k | official-components | official plugin directory (incl. LSP plugins) | [[Optimization/plugins-catalog]] |
| `anthropics/claude-code-action` | 10k | tool | Claude Code in GitHub Actions | [[Optimization/plugins-catalog]] |
| `anthropics/claude-cookbooks` | 54k | reference | recipes: tool use, caching, agents | [[Optimization/token-strategy]] |

## Vendor MCP servers

| Repository | Stars | Kind | Feeds |
|---|---|---|---|
| `upstash/context7` | 63k | tool (active) | [[Optimization/mcp-catalog]] |
| `github/github-mcp-server` | 34k | tool | [[Optimization/mcp-catalog]] |
| `microsoft/playwright-mcp` | 39k | tool (active) | [[Optimization/mcp-catalog]] |
| `ChromeDevTools/chrome-devtools-mcp` | 54k | tool | [[Optimization/mcp-catalog]] |
| `supabase/mcp` | 3k | tool | [[Optimization/mcp-catalog]] |
| `makenotion/notion-mcp-server` | 5k | tool | [[Optimization/mcp-catalog]] |
| `exa-labs/exa-mcp-server` | 5k | tool | [[Optimization/mcp-catalog]] |
| `firecrawl/firecrawl-mcp-server` | 8k | tool (active, keyless tier) | [[Optimization/mcp-catalog]] |
| `perplexityai/modelcontextprotocol` | 3k | tool (candidate, needs API key) | [[Optimization/mcp-catalog]] |

## Web context and browser automation

Sources for live web context: search, scraping, and browser control. Checked through the GitHub API on 2026-10-24.

| Repository | Stars | Kind | License | Why Hermes uses it | Feeds |
|---|---|---|---|---|---|
| `firecrawl/firecrawl` | 195k | reference | AGPL-3.0 | web pages → clean markdown/JSON for agents (scrape, crawl, map, search); self-hostable API behind the Firecrawl MCP | [[Optimization/mcp-catalog]] |
| `microsoft/playwright` | 98k | reference | Apache-2.0 | browser automation and E2E testing (Chromium, Firefox, WebKit); engine behind Playwright MCP | [[Process/code-review]], [[Optimization/mcp-catalog]] |
| `perplexityai` (org) | — | official-components | MIT (MCP) | Perplexity API Platform: `modelcontextprotocol` (official MCP), `api-cookbook` (recipes), `perplexity-py` / `perplexity-node` (SDKs), `search_evals` (search-API evals) | [[Optimization/mcp-catalog]] |

Notes:

- Firecrawl's core is AGPL-3.0: calling its API or reading the code is fine; embedding or modifying it in distributed software triggers copyleft. The MCP server is MIT.
- Playwright's README recommends `microsoft/playwright-cli` + skills over MCP for coding agents, since CLI calls keep tool schemas and accessibility trees out of context ([[Optimization/token-strategy]]). Use the MCP for exploratory, stateful browser loops.
- Most other `perplexityai` repositories are internal infrastructure (Bazel rules, GPU kernels, forks) and do not feed Hermes.

## Community — methodology and curated lists

| Repository | Stars | Kind | Why Hermes uses it | Trust |
|---|---|---|---|---|
| `obra/superpowers` | 302k | reference | skills-based development methodology; compare with [[Process/workflow]] | community |
| `wshobson/agents` | 41k | curated-list | multi-harness plugins and subagents | community |
| `hesreallyhim/awesome-claude-code` | 56k | curated-list | commands, hooks, workflows for Claude Code | community |
| `punkpeye/awesome-mcp-servers` | 97k | curated-list | broad MCP discovery | community |
| `travisvn/awesome-claude-skills` | 15k | curated-list | community skills | community |

## Developer tooling used by Hermes hooks

| Repository | Stars | Use |
|---|---|---|
| `gitleaks/gitleaks` | 30k | secret scan |
| `pre-commit/pre-commit` | 16k | hook runner |
| `biomejs/biome` | 26k | JS/TS lint + format |
| `astral-sh/ruff` | 50k | Python lint + format |

## Video production (Frans videos)

Evaluated by the video team on 2026-10-20 while producing the System Design + AI video (1080×1350, Remotion). Data read from the GitHub API that day. Decisions: **adopt**, **test**, **reference**. ElevenLabs is intentionally left out of this catalog (owner decision, 2026-10-20).

### Composition, motion and render

| Repository | Stars | License | Decision | Why |
|---|---|---|---|---|
| `remotion-dev/remotion` | 66k | Remotion License (free for individuals and companies up to 3 people; paid above) | adopt (base) | video as React code; renders 4:5, 9:16, 16:9 |
| `remotion-dev/skills` | 5k | not declared | adopt | 12 official Agent Skills; `npx skills add` needs Node ≥ 22.20 (box has 20), so clone instead |
| `FFmpeg/FFmpeg` | 66k | LGPL/GPL (build-dependent) | adopt | encode, mix, `loudnorm` |
| `browser-use/browser-use` | 119k | MIT | adopt | real browser captures; v0.13 runs without an LLM key (the calling agent issues the commands) |
| `ManimCommunity/manim` | 42k | MIT | test | algorithm and math diagrams, exported as clips into Remotion |
| `Zulko/moviepy` | 15k | MIT | test | simple scripted batch cuts |
| `airbnb/lottie-web` | 32k | MIT | test with caution | slow maintenance (last push 2025-09); use via `@remotion/lottie` |
| `motion-canvas/motion-canvas` | 19k | MIT | reference | overlaps Remotion |
| `yihui-dev/awesome-opus5-5-videos` | 7k | MIT (list only; prompts belong to authors) | reference | 703 motion-video prompts; restraint rules for Remotion, 4:5 LinkedIn layouts |

### Captions, automatic editing and voice

| Repository | Stars | License | Decision | Why |
|---|---|---|---|---|
| `WyattBlue/auto-editor` | 6k | Unlicense | adopt | removes silences from recordings; `--export v3` timeline feeds Remotion |
| `SYSTRAN/faster-whisper` | 26k | MIT | adopt (unscripted audio only) | CPU float32 with a glossary; int8 produced garbage on the box |
| `rany2/edge-tts` | 12k | LGPLv3 | adopt with caution | word timestamps give exact captions; unofficial Edge endpoint is a brand risk |
| `m-bain/whisperX` | 25k | BSD-2-Clause | test | forced alignment of recorded voice to the script |
| `ggml-org/whisper.cpp` | 55k | MIT | test | Node-only path via `@remotion/install-whisper-cpp` |
| `Breakthrough/PySceneDetect` | 5k | BSD-3-Clause | test | find screen changes in app recordings |
| `openai/whisper` | 111k | MIT | reference | already embedded in faster-whisper |
| `debpalash/VoiceStudio` | 79k | AGPL-3.0 (default model weights CC-BY-NC) | reference | local voice and cloning; slow on CPU and non-commercial weights, so not the Frans brand voice |

Discarded: `jianfch/stable-ts` (archived), `linto-ai/whisper-timestamped` (redundant, AGPL), Piper (archived).

Pipeline contracts between stages are plain JSON files (script, scene timings, `Caption[]`, auto-editor timeline), so each stage can swap tools without touching the others.

## Rules

1. Official and vendor sources first; community sources need a read of the code before anything is installed.
2. Stars signal adoption, not safety or fit.
3. Do not copy large content from a repository into the vault; link and summarize ([[Governance/documentation-standards]]).
4. A repository that moved or was archived is updated or removed at the next check.

Related: [[Optimization/mcp-catalog]], [[Optimization/skills-catalog]], [[Optimization/plugins-catalog]].

## Agent ecosystem candidates (M8)

Local research source: AI-Agent-Ecosystem, consulted 2026-10-29. Upstream status is not revalidated by this integration. These are references, not new dependencies.

| Repository | Purpose | Adoption gate |
|---|---|---|
| oraios/serena | code symbols and scoped retrieval | E1 |
| basicmachines-co/basic-memory | shared facts | E2 |
| spring-projects/spring-ai | Java integration | concrete project review |
| modelcontextprotocol/java-sdk | MCP in Java | concrete project review |
| headroomlabs-ai/headroom | log/context reduction | measured F0 need |
| langchain4j/langchain4j | Java runtime alternative | concrete project comparison |
