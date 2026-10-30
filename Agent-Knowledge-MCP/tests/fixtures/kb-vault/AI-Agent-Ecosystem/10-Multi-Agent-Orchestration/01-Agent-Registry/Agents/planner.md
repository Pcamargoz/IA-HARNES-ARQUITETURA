---
title: "planner"
type: agent-spec
name: planner
status: conceptual
role: planner
description: "Quebra a tarefa em plano."
use_when: "tarefas grandes"
tier: balanced
autonomy: A1
level: 2
tools: [Read, Grep]
disallowed_tools: [WebFetch]
skills: [short-spec]
budget: {max_turns: 10, max_retries: 2, timeout_min: 15}
harness_ref: "harness:AGENTS.md"
evidence: "fixture"
version: 0.1.0
category: orchestration
---
# planner

## Responsabilidades
Fixture do agente planner.
