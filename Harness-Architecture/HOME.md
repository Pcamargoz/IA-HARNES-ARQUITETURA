---
title: Hermes — Operating Base
type: index
status: active
owner: main-agent
updated: 2026-10-29
tags:
  - hermes
  - index
---

# Hermes — Agent Operating Base

This is the **entry point** of the Hermes ecosystem. Everything here exists for one purpose: give any authorized agent the context, rules, and tools it needs to execute projects with quality and controlled cost.

> [!important] Reading order for agents
> 1. [[AGENTS]] — operating contract (mandatory, ~2k tokens)
> 2. The entry note of the relevant area (see the map below)
> 3. Only the specific notes that area points to
>
> Never load the whole vault. Use the `vault_search` MCP tool to discover before reading.

New here? Paste [[INITIAL-PROMPT]] as the first message of the session, then follow [[QUICKSTART]].

## What Hermes is

Hermes is the **proprietary harness** of this ecosystem: the layer that wraps the LLM and turns a conversation into disciplined execution. It is not a model and not an IDE — it is the set of **memory, processes, components, and metrics** that standardizes how agents work.

```
LLM + IDE  →  Harness (Hermes)  →  Process  →  Delivery  →  Metrics  →  Optimization
```

The four original phases are in [[HARNESS/HARNESS MAIN/architecture|Architecture]].

## Vault map

| Area | Purpose | Entry |
|---|---|---|
| Start | Bootstrap, setup, first task | [[INITIAL-PROMPT]], [[QUICKSTART]], [[MCP]] |
| Governance | Vision, principles, decisions, standards | [[Governance/vision\|Vision and principles]] |
| HARNESS MAIN | Architecture, Main Agent, orchestration | [[HARNESS/HARNESS MAIN/architecture\|Architecture]] |
| LLM MODELS | Model selection and IDE/LLM split | [[HARNESS/LLM MODELS/models\|Models]] |
| Memory Agents | Memory, context, retrieval | [[Memory Agents/memory\|Memory]] |
| Process | Workflow, spec, review, loops, delivery | [[Process/workflow\|Workflow]] |
| Knowledge | Specialist guidance, retrieved with `vault_retrieve` | [[Knowledge/README\|Knowledge pack]] |
| Video engine | Remotion engine v6 for explainer videos (code in `video-engine/`) | [[Knowledge/video-engine/README\|Video engine]] · [[video-engine/README\|How to run]] |
| Optimization | Tokens, delegation, catalogs of skills, MCPs, plugins, repositories | [[Optimization/token-strategy\|Token strategy]] · [[Optimization/repositories-catalog\|Repositories]] |
| Metrics | Indicators, collection, scorecard, review ritual | [[Metrics/framework\|Metrics framework]] · [[Metrics/scorecard\|Scorecard]] |
| Agents | Role cards | [[Agents/roles\|Agent roles]] |
| Security | Permissions, writes, autonomy | [[Security/permissions\|Permissions]] |
| Templates | Spec, handoff, ADR, delivery | [[Templates]] |

## Current state

| Component | State | Note |
|---|---|---|
| Documentation and navigation | Implemented | This vault |
| Main Agent contract | Implemented | [[AGENTS]] + [[HARNESS/HARNESS MAIN/main-agent\|Main Agent]] |
| Workflow and processes | Implemented | [[Process/workflow\|Workflow]] |
| Skills/MCP/plugin/repository catalogs | Implemented | Active vs candidate (ADR-009) |
| Vault MCP server | Implemented (v0.3.1) | [[MCP]] · `.mcp/` · 13 tools (ADR-008) |
| Web-context MCPs | Implemented | `.mcp.json`: Playwright + Firecrawl; Perplexity candidate (ADR-010) |
| Vault health check | Implemented | `vault_health` |
| Metrics aggregation | Implemented | `vault_metrics` + [[Metrics/scorecard\|Scorecard]] |
| Embedding-based search | Planned | Search is lexical today |
| Automated metric collection | Planned | Requires client instrumentation; aggregation is automatic |

## Operating rules

- [[Ideas]] is the **original source** of the vision. Do not edit it without a decision record.
- Every structural decision becomes an ADR in [[Governance/decisions]].
- Every note has frontmatter (`title`, `type`, `status`, `updated`, `tags`).
- Internal links use `[[path/note]]`; paths with spaces are allowed.
- Duplication is debt: before creating a note, run `vault_search`.

## Maintenance

Full standards in [[Governance/documentation-standards]]. Implementation report in [[REPORT]].

- Weekly: `vault_metrics` + `vault_health` ([[Metrics/scorecard|review ritual]]).
- Monthly: broken links, orphan notes, stale `updated` dates.
- Quarterly: catalogs, metrics, obsolete notes.
- After any structural change: update this map, [[AGENTS]], and the matching ADR.
- Setup guide: [[README]].

## Agent Knowledge integration

- [[Governance/knowledge-integration|Integration scope and acceptance]] — existing agent-knowledge registration, read-only KB retrieval and pending client checks.
- [[HARNESS/HARNESS MAIN/orchestrator-prompt|Orchestrator entry]] — short operational prompt.
- [[Agents/registry|Canonical agent registry]] — KB specs, validation and activation gates.
- [[Security/runtime-policy|Runtime policy]] — client guards and kill switch.
- [[Metrics/baseline|Baseline and telemetry]] — measurable evidence, never assumed savings.

## Supervised operating session

Maestri maestro Codex coordinates native reviewer Lince and validator Prumo for HARNESS-BOOT-001. The connected Harness Operação note shows current state. Reuse these existing terminals before provisioning more. Roles use read-only native Codex and the project-scoped agent-knowledge MCP; the AgentPort CLI adapters remain spec-only. Acceptance evidence is kept in [[Governance/knowledge-integration]].

- [[Governance/controlfree-team|ControlFree development team and approval gate]] — Claude/Codex implementation lanes, final review/QA, next user OK required.
