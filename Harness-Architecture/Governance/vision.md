---
title: Vision and Principles
type: governance
status: active
updated: 2026-10-19
tags:
  - hermes
  - vision
  - principles
---

# Vision and Principles

## Vision

Turn this vault into a **reusable operating base** for AI agents: the same knowledge, processes, and tools working across any project, machine, or MCP client.

## Mission

Give the Main Agent and specialists enough context to act with quality, bounded autonomy, and controlled cost — without depending on a specific conversation or informal memory.

## Objectives

1. **Consistency** — every project follows the same minimum workflow.
2. **Reuse** — skills, rules, and MCPs live in catalogs, not scattered around.
3. **Efficiency** — context loaded on demand; delegation only when it pays off.
4. **Traceability** — decisions in ADRs, deliveries with evidence.
5. **Portability** — clone on macOS or Windows and it works the same.
6. **Security** — broad reads, narrow writes, irreversible actions require approval.

## Scope

Inside:
- harness architecture, roles, and orchestration;
- memory, context, and retrieval;
- processes (workflow, spec, review, loops, delivery);
- skill, plugin, and MCP catalogs;
- cost, time, and quality metrics;
- vault MCP integration.

Outside (for now):
- training or fine-tuning models;
- hosting the vault publicly;
- replacing the IDE, Git, or the LLM provider.

## Intended domains

The harness starts with software development, but the same skeleton serves recurring domains. Each domain gains skills, processes, and criteria when there is real demand:

| Domain | First expected use |
|---|---|
| Software development | architecture, implementation, review |
| Content creation | outline, writing, revision |
| LinkedIn tracking | calendar, posts, metrics |
| Investment market | research, analysis, monitoring |

Do not create a skill before the second real use: see [[Optimization/skills-catalog]].

## Principles

| Principle | Practical consequence |
|---|---|
| Context is expensive | Discover before reading; read by section |
| Process before code | A short spec even for small tasks |
| Review at the end | Do not interrupt execution with continuous review |
| Loops must exit | Every iteration declares a stop condition |
| Delegation has a cost | Transferring context and consolidating also burns tokens |
| Single source of truth | Never duplicate a rule in two places |
| Evidence or silence | Without a test/source, do not claim completion |
| Writing is a privilege | Read-only by default; `Inbox/` for drafts |

## Success criteria

- A new agent finds the right information in ≤ 3 hops from [[HOME]].
- No global rule duplicated outside [[AGENTS]].
- The MCP answers search and read in under 1 s for the current vault.
- Every non-trivial delivery has an acceptance criterion and evidence.
- Cost per task is recorded when the platform exposes the data.

## Non-goals

- It is not a product for third parties.
- It is not a CMS or a published website.
- It is not a repository of loose prompts: every artifact has an owner and a purpose.
