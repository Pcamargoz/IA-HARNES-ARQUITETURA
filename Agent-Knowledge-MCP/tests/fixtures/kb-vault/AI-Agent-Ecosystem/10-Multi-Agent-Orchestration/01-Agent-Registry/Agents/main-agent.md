---
title: "main-agent"
type: agent-spec
name: main-agent
status: implemented
role: orchestrator
description: "Ponto único de entrada que orquestra."
use_when: "qualquer tarefa"
tier: balanced
autonomy: A1
level: 2
tools: [Read, Grep]
disallowed_tools: [WebFetch]
skills: [java-spring-backend-senior]
budget: {max_turns: 10, max_retries: 2, timeout_min: 15}
harness_ref: "harness:AGENTS.md"
evidence: "fixture"
version: 0.1.0
category: orchestration
---
# main-agent

## Responsabilidades
Fixture do agente main-agent.
