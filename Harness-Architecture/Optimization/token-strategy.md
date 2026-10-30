---
title: Token Strategy
type: catalog
status: active
updated: 2026-10-19
tags:
  - hermes
  - optimization
  - tokens
---

# Token Strategy

## Principle

Spend tokens where they change the result. The goal is not "use fewer tokens" — it is **more result per token**.

```
efficiency = delivered value / tokens consumed
```

## Where tokens are lost

| Source | Typical waste |
|---|---|
| Loading whole folders | irrelevant context |
| Duplicated rules | re-reading the same thing |
| Long conversations without compaction | accumulated noise |
| Redoing work | missing spec |
| Review in the middle | interrupted execution |
| Bad briefs | rework |
| Frontier model for trivial tasks | cost without gain |

## Techniques

### 1. Progressive loading
[[HOME]] + [[AGENTS]] → area entry → specific note. Never the vault at once.

### 2. Read by section
`vault_read` with `heading` returns only the block. It is the biggest gain on long notes.

### 3. Search before reading
`vault_search` shows snippets and paths; only then read.

### 4. Right model per task
Small for mechanical work, balanced for everyday work, frontier for high risk. See [[HARNESS/LLM MODELS/models]].

### 5. Short spec
A clear spec avoids entire rework cycles.

### 6. Compact on long tasks
Summarize decisions and facts; discard intermediate reasoning. See [[Memory Agents/context]].

### 7. Reuse components
Skill/MCP that already solves it > reimplementing in the prompt.

### 8. Do not duplicate rules
One source of truth; the rest are links.

## Budget per task

| Task | Budget |
|---|---|
| Quick question | < 4k |
| Small fix | 4–10k |
| Feature | 10–30k |
| Architecture | 30–60k |

These are references, not limits. Measure when possible.

## Signs of waste

- The agent asks for information that is in the vault.
- The answer repeats the context.
- The same file is read twice in one task.
- The conversation grows without new decisions.
- The agent "explores" before understanding the objective.

## Signs of good use

- Few reads, high precision.
- Short, evidence-based answers.
- Decisions recorded once.
- Zero silent rework.

## Trade-off

| Cheaper | Risk |
|---|---|
| Small model | hidden rework |
| Less context | wrong assumption |
| No review | defect delivered |
| No spec | scope drift |

Saving tokens by cutting verification is not optimization — it is transferring cost to the future.

Related: [[Optimization/delegation-cost]], [[Metrics/framework]].
