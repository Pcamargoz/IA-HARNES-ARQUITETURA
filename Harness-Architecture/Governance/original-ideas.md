---
title: Original Ideas — English Translation
type: governance
status: reference
updated: 2026-10-19
tags:
  - hermes
  - translation
  - source
---

# Original Ideas — English Translation

Faithful translation of [[Ideas]] (Portuguese, preserved unchanged). Use this note to understand intent; use the linked documents for the implemented version.

## Translation

> This will consist of a harness architecture that we will use in every project we do.
>
> **LLM** — probably Claude Code, Cursor, Grok, or something similar.
>
> **Proprietary harness** — try to focus on Grok Bot or Hermes Agent.
>
> **Processes** — always build a clean architecture with package-based organization; always keep things readable and close to a RESTful or complete engineering approach depending on the type of architecture the project needs, applying this together with code review, workflows, and loops.
>
> **Optimization metrics** — focus on the optimization folder: centralize skills, MCPs, rules, and processes that help our agents consume information so we can always, always get a good result while spending little. Do this through correct orchestration, distributing tasks well so nothing is repetitive, and choosing the right AI for the demand based on complexity.
>
> **Workflow** — standardize a workflow for every type of project: always invest in design, always comply with the rules of the harness we are applying, and be specialists in what we are talking about.
>
> **Spec-driven** — plan one that follows the same workflow principles and take great care that the AI does not turn into an infinite code review.
>
> **Code review** — preferably always at the end of delivery, precisely so it does not take time away from the demands I am assigning.
>
> **Loops** — always continue with tasks, prioritizing tasks for each agent; those agents should focus on their tasks in stages so each agent can focus on something and deliver properly focused on what it intended.
>
> **Subagents and skills + optimizations** — always be as thorough as possible with skills, plugins, MCPs, and everything else; we should always have the most up-to-date and most used things in the technology world for this whole optimization area, such as skills, models, MCPs, rules, and processes mentioned above. There should always be a process, optimization, or something similar for the most-used things, such as development, content creation, LinkedIn tracking, and the investment market — all of these will always be necessary. So, together with this harness we are creating, we need to fill this Obsidian vault with context so I can upload it to GitHub, use it on my machines, and have all my agents consume it.
>
> [Diagram: HARNESS DESING — four phases: Foundation, Memory, Processes, Metrics]

## Idea-to-implementation map

| Original idea | Implemented in |
|---|---|
| Harness for every project | [[HARNESS/HARNESS MAIN/architecture]] |
| LLM candidates (Claude Code, Cursor, Grok) | [[HARNESS/LLM MODELS/ide-harness]] |
| Proprietary harness (Grok Bot / Hermes) | [[Governance/vision]], ADR-001/002 |
| Clean architecture, packages, REST | [[Process/code-architecture]] |
| Code review, workflows, loops | [[Process/workflow]], [[Process/code-review]], [[Process/loops]] |
| Optimization folder, skills/MCPs/rules centralized | [[Optimization/token-strategy]], [[Optimization/skills-catalog]], [[Optimization/mcp-catalog]] |
| Task distribution by complexity | [[HARNESS/HARNESS MAIN/orchestration]], [[HARNESS/LLM MODELS/models]] |
| Design quality and expertise | [[Process/code-architecture]], [[Process/workflow]] |
| Spec-driven without infinite review | [[Process/spec-driven]] |
| Review at the end | [[Process/code-review]] |
| Subagents, skills, plugins, hooks, LSP | [[Optimization/plugins-catalog]] |
| Vault on GitHub accessible to all agents | [[README]], [[MCP]] |
| Metrics → optimize model/skill/MCP/rules/process | [[Metrics/framework]] |
| Domains: development, content, LinkedIn, investing | [[Governance/vision]] |

## Diagram interpretation

The original diagram defines four phases:

1. **Foundation** — IDE + LLM wrapped by the proprietary harness.
2. **Cognition** — user prompt → orchestrator → subagents/LLM, backed by memory (rules, skills, MCPs, hooks, LSP).
3. **Execution** — processes (spec-driven, workflow, code review, loops) → delivery.
4. **Evolution** — metrics (cost, result, time, loops) → optimization (model, skill, MCP, rules, process).

The implemented architecture keeps the same loop and adds explicit security, catalog, and documentation layers.
