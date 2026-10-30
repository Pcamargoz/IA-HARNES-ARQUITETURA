---
title: Context Management
type: architecture
status: active
updated: 2026-10-19
tags:
  - hermes
  - context
  - tokens
---

# Context Management

## Core idea

Context is the most expensive and most corruptible resource. More context is not better context: beyond a point, quality drops while cost rises.

```
quality ↑ with relevant context
quality ↓ with irrelevant/duplicated context
```

## Progressive loading

| Level | Content | Approx. budget |
|---|---|---|
| L0 | [[HOME]] + [[AGENTS]] | ~2k tokens |
| L1 | area entry | ~1–2k |
| L2 | 2–4 specific notes | ~2–6k |
| L3 | open search | on demand |
| L4 | full folder | avoid |

Never start at L4.

## Selection

Before loading a note, ask:
1. Does it answer the current question?
2. Is it the most recent version?
3. Is it the source or a copy?

If the answer is "maybe", search for the exact section instead of reading the whole file.

## Reading by section

`vault_read` accepts a `heading`. Use it:

```json
{ "path": "Process/workflow.md", "heading": "Stages and gates" }
```

This returns only the relevant block — the cheapest way to get precise context.

## Compression

When the conversation grows:

1. Summarize decisions and verified facts.
2. Keep paths and identifiers, drop narrative.
3. Keep open items and the next step.
4. Discard intermediate reasoning.
5. Re-read only if a fact is missing.

## Budget

| Task | Suggested budget |
|---|---|
| Simple question | < 4k tokens |
| Small fix | 4–10k |
| Feature | 10–30k |
| Architecture | 30–60k |
| Review | diff + criteria + rules |

These are orders of magnitude, not guarantees. Measure when the platform allows.

## Context rot

Symptoms:
- the agent repeats already-answered questions;
- it contradicts earlier decisions;
- it ignores rules present at the start;
- it produces generic answers.

Causes: long conversation, duplicated rules, irrelevant files, stale summaries.

Fixes: compact, re-anchor the contract, remove duplicates, restart with a clean brief.

## Rules

- One source of truth per rule; link, do not copy.
- Prefer structure (headings, tables) over prose.
- Keep notes < 250 lines; split when larger.
- Do not paste entire files when a section is enough.
- On long tasks, maintain a running summary of decisions.

## Related

- [[Memory Agents/memory]]
- [[Optimization/token-strategy]]
- [[Process/workflow]]
