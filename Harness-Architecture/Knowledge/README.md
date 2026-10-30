---
title: Knowledge Pack
type: index
status: active
updated: 2026-10-26
tags:
  - hermes
  - knowledge
  - index
related:
  - "[[MCP]]"
  - "[[Knowledge/specialists]]"
---

# Knowledge Pack

Operating guidance for specialist agents. Every note in this folder is part of the default `vault_retrieve` corpus ([[MCP]]), along with [[Process/design-patterns]] and [[Process/minimal-validation]].

## Read order

1. [[AGENTS]], then your role card in [[Agents/roles]].
2. [[Knowledge/specialists]] to find the note for your domain.
3. Only that note, then stop. Prefer `vault_retrieve` for the sections you need over reading the whole note.

## Notes

| Note | For | Owner |
|---|---|---|
| [[Knowledge/specialists]] | Map of specialist domains to their notes | Main Agent |
| [[Knowledge/backend-java-spring]] | Back-end work: API contract, auth, isolation, persistence (Java/Spring and Node) | Back-end 1 - Chef A |
| [[Process/design-patterns]] | Factory, Singleton, Strategy, and Adapter in the checkout domain and in the harness | Engenharia Reversa - Analista B |
| [[Process/minimal-validation]] | Minimum check before a merge and what blocks it; in the default `vault_retrieve` corpus, like [[Process/design-patterns]] | Engenharia Reversa - QA A |
| [[Knowledge/video-engine/README]] | Video engine v6 (Remotion): scenes, pipeline, quality metrics, studied repositories; code in `video-engine/` | Main Agent |

## Stop rule

If the guidance you need is not in this pack, search the rest of the vault with `vault_search`. Do not load whole folders.
