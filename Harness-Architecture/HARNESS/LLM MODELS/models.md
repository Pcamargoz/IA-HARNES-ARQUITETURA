---
title: Model Selection
type: architecture
status: active
updated: 2026-10-29
tags:
  - hermes
  - models
  - routing
---

# Model Selection

## Principle

There is no "best model" — there is a model adequate to the task, the risk, and the budget. Choose by **capability required**, not by habit or marketing.

## Dimensions

| Dimension | Question |
|---|---|
| Reasoning | does it need multi-step planning or subtle judgment? |
| Coding | does it need to edit across files, follow architecture? |
| Context | how much must be in context at once? |
| Tool use | does it need reliable MCP/CLI calls? |
| Latency | is the interaction synchronous with the user? |
| Cost | what is the acceptable ceiling per task? |
| Availability | is it reachable from the IDE/client in use? |

## Tiers

| Tier | Profile | Typical use |
|---|---|---|
| **Small / fast** | low latency, low cost | classification, summaries, simple extraction, mechanical edits |
| **Balanced** | good reasoning/cost ratio | everyday implementation, documentation, review |
| **Frontier** | highest reasoning | architecture, ambiguous problems, high-risk review |

Tiers are organizational labels, not vendor claims. Fill in the real models when the catalog is defined — do not invent benchmarks.

## Routing matrix

| Task | Minimum tier | Reason |
|---|---|---|
| Rename/format | small | mechanical |
| Summary of a known note | small | low risk |
| Feature in an existing module | balanced | multi-file edits |
| New architecture | frontier | broad decisions |
| Final code review (high risk) | frontier | failure cost |
| Bulk spec drafting | balanced | volume + structure |
| Sensitive data analysis | depends on policy | see [[Security/permissions]] |

## Selection process

1. Classify the task by complexity and risk.
2. Define the required capability (reasoning, coding, context, tools).
3. Check availability and cost.
4. Choose the **cheapest tier that satisfies** the requirement.
5. Escalate only if quality fails, not preemptively.

## Escalation rules

- Two failed attempts on the same problem → go up a tier.
- Review of critical code → frontier, regardless of the author.
- Very long context → prefer a model with a real usable window, not just a marketing number.

## What not to do

- Using frontier for everything (cost without proportional gain).
- Using small for architecture (hidden rework).
- Choosing by benchmark alone, without testing on your own tasks.
- Changing model in the middle of a task without recording why.

## Where this is decided

- IDE/LLM split: [[HARNESS/LLM MODELS/ide-harness]].
- Per-execution record: [[Metrics/execution-log]].
- Cost model: [[Optimization/delegation-cost]].

## Client bindings (M2, EVO-06, EVO-12)

| Tier alias | Adapter / execution | Client model selection | Evidence / eligibility |
|---|---|---|---|
| tier0 | deterministic local tools | no model | Prefer for mechanical checks; no LLM quota |
| small | claude-code, conditional | sonnet as conservative initial fallback | No small-model benchmark; do not claim an optimal price tier |
| balanced | claude-code, conditional | sonnet | Alias accepted by installed CLI --help; native acceptance tracked separately |
| frontier | claude-code, conditional | opus | Alias listed by installed CLI --help; not task-tested here |
| local | ollama-local, blocked until verified | no model preselected | Server/model availability must be checked; no automatic download |

These bindings are explicit initial choices, not proof of adapter implementation. CLI adapters stay spec-only until their own authorized execution passes. Codex and other clients retain their existing model selection; no unverified model IDs or account changes are introduced.

Prefer deterministic work first. For paid execution, require an available implemented adapter, current authentication evidence, adequate permissions and an explicit task budget. --max-budget-usd exists in Claude Code 2.1.312, but subscription quota is not a dollar invoice. Stop rules in [[Process/loops]] override automatic tier escalation. Evaluate cost per successful task only after measured baselines; unknown cost or success rate stays unknown.
