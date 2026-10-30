---
title: "builder"
type: agent-spec
name: builder
status: planned
role: worker
description: "Implementa código Java Spring com testes."
use_when: "feature ou bug em spring"
tier: balanced
autonomy: A1
level: 2
tools: [Read, Grep]
disallowed_tools: [WebFetch]
skills: [java-spring-backend-senior, skill-inexistente-spring]
budget: {max_turns: 10, max_retries: 2, timeout_min: 15}
harness_ref: "harness:AGENTS.md"
evidence: "fixture"
version: 0.1.0
category: orchestration
---
# builder

## Responsabilidades
Fixture do agente builder.
