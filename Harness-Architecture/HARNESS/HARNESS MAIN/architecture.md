---
title: Harness Architecture
type: architecture
status: active
updated: 2026-10-20
tags:
  - hermes
  - architecture
  - harness
---

# Harness Architecture

## Concept

The LLM generates; the **harness** decides what it sees, what it can do, how execution is verified, and how the result is improved. The same model can produce very different results depending on the harness around it.

```
User → [ Harness ] → LLM / tools → verification → delivery
              ↑                                  │
              └──────── metrics + memory ────────┘
```

## The four original phases

| Phase | Purpose | Where it lives |
|---|---|---|
| 1. Foundation | ensure minimum and maximum quality | IDE + model + base rules |
| 2. Cognition | process and memory | agents, memory, context, skills/MCPs |
| 3. Execution | carry out the work | processes, tools, artifacts |
| 4. Evolution | measure and improve | metrics and optimization |

## Layers

### 1. Interface
Vault, MCP, and IDE. Entry is [[HOME]] or the interface of the client in use (Claude Desktop, Cursor, OpenCode).

### 2. Cognition
- Global contract: [[AGENTS]].
- Memory and context: [[Memory Agents/memory]].
- Model selection: [[HARNESS/LLM MODELS/models]].
- Components: skills, MCPs, plugins, hooks, LSP.

### 3. Execution
Processes in [[Process/workflow]]: spec, plan, execution, validation, delivery. Subagents receive scoped handoffs; the Main Agent consolidates.

### 4. Control
Permissions, write policy, approval gates, and risk classification: [[Security/permissions]].

### 5. Evolution
Cost per task, models used, loops, review findings, and rework: [[Metrics/framework]]. Results feed the catalogs in [[Optimization/token-strategy]].

## Information flow

1. The user states the objective.
2. The Main Agent loads [[AGENTS]] and the area entry.
3. It searches the vault (`vault_search`) before reading.
4. It decides execute vs delegate.
5. Execution follows the workflow with acceptance criteria.
6. Validation happens by test, read-back, or source.
7. Delivery reports status and evidence.
8. Metrics are recorded when measurable.
9. Repeated finding → skill, rule, or process update.

## Design principles

| Principle | Reason |
|---|---|
| Minimal sufficient context | cost and quality |
| Explicit process | predictability |
| Strong verification | trust without supervision |
| Narrow writes | safety |
| Separate memory from code | durability |
| Measure before optimizing | avoid guessing |
| Human approves the irreversible | accountability |

Code-level patterns (Factory, Singleton, Strategy, Adapter) are in [[Process/design-patterns]].

## Failure modes

| Symptom | Probable cause | Fix |
|---|---|---|
| Vague answers | missing context | load the area entry and spec |
| High cost, low value | context overload | search first, read by section |
| Wrong stack | model/IDE mismatch | review [[HARNESS/LLM MODELS/models]] |
| Agent "done" without proof | no validation gate | enforce [[Process/delivery]] |
| Infinite review | no stop rule | [[Process/code-review]] limits |
| Lost rules | duplication | consolidate in [[AGENTS]] |

## What Hermes is not

- Not a prompt collection.
- Not a model.
- Not an autonomous system without supervision.
- Not a replacement for engineering judgment.
