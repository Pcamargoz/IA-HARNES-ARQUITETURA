---
title: Specialists
type: index
status: active
updated: 2026-10-26
tags:
  - hermes
  - knowledge
  - specialists
related:
  - "[[Agents/roles]]"
  - "[[Knowledge/README]]"
---

# Specialists

Which note each specialist agent loads after reading [[AGENTS]] and its role card in [[Agents/roles]]. One domain, one note.

## Domains

| Domain | Load | Owner |
|---|---|---|
| Back-end (Java/Spring, Node APIs, auth, databases) | [[Knowledge/backend-java-spring]] | Back-end 1 - Chef A |
| Code structure and design patterns | [[Process/code-architecture]], then [[Process/design-patterns]] | Engenharia Reversa - Analista B |
| Validation before merge | [[Process/minimal-validation]] | Engenharia Reversa - QA A |
| Video editing and production (Remotion engine v6) | [[Knowledge/video-engine/README]], then [[Knowledge/video-engine/quality-metrics]] | Main Agent |

## Adding a domain

A new domain is a new note under `Knowledge/` (subfolders count). Then add one row here and one in [[Knowledge/README]]. Keep the note retrievable: write short sections that each stand on their own.

`vault_retrieve` reads its default corpus from `RETRIEVE` in `.mcp/src/search.mjs`: every note under the folders in `defaultFolders` (today `Knowledge`) plus the exact paths in `defaultNotes` (today [[Process/design-patterns]] and [[Process/minimal-validation]]). A note under `Knowledge/` is in the corpus as soon as it exists; no other change is needed.

A note under `Process/` (or any other folder) is in the default corpus only when its path is listed in `defaultNotes`, like the two notes above. To add one, list it there, update the corpus definition in [[MCP]] section 5 and the `vault_retrieve` description in `.mcp/src/index.mjs`, run `npm test`, and restart the MCP server, since the list is code loaded at startup. Without that change, agents can still reach the note with `vault_read`, `vault_search`, or `vault_retrieve` with `folder: "Process"`, which replaces the default corpus with that one folder.
