---
title: "Especialista Back-end Java/Spring"
type: agent-spec
status: planned
name: backend-java-specialist
role: specialist
description: "Especialista de domínio back-end (Java/Spring, APIs Node, auth, bancos)."
use_when: "decisões e implementação back-end Java/Spring de alto risco"
avoid_when: "front-end; tarefas triviais"
tier: balanced
autonomy: A3
level: 2
tools: [Read, Grep, Glob, Edit, Write, Bash]
disallowed_tools: []
skills: [java-spring-backend-senior, spring-security-jwt, spring-data-jpa-postgres]
harness_ref: "harness:Knowledge/specialists.md (Back-end 1 - Chef A); harness:Knowledge/backend-java-spring.md"
evidence: "linha de domínio e nota de conhecimento existem; sem arquivo de agente"
budget: {max_turns: 30, max_retries: 2, timeout_min: 25}
owner: pedro
version: 0.1.0
category: orchestration
updated: 2026-10-29
tags: [agent, specialist, java, spring]
---
# Especialista Back-end Java/Spring

**Status:** Planejado · **Papel:** specialist · **Tier:** balanced · **Autonomia:** A3 · **Nível:** 2 (1=lê, 2=escreve, 3=verifica)

## Missão
Especialista de domínio back-end (Java/Spring, APIs Node, auth, bancos).

## Use quando
decisões e implementação back-end Java/Spring de alto risco.

## Não use para
front-end; tarefas triviais.

## Ferramentas
- Permitidas: Read, Grep, Glob, Edit, Write, Bash
- Proibidas: —

## Skills associadas
`java-spring-backend-senior`, `spring-security-jwt`, `spring-data-jpa-postgres` (descobrir/confirmar com `find_relevant_skills`; ver divergência de skills em [[Agent-Registry]]).

## Orçamento
max_turns=30 · max_retries=2 · timeout_min=25 — campos não nativos do Claude Code; quem aplica é o orquestrador ou um hook (R2).

## Entrada e saída
- Entrada: handoff do [[Handoff-Protocol]].
- Saída: status `done | partial | blocked`, evidência e itens em aberto.

## Evidência do status
linha de domínio e nota de conhecimento existem; sem arquivo de agente.

Fonte no Harness (somente leitura): harness:Knowledge/specialists.md (Back-end 1 - Chef A); harness:Knowledge/backend-java-spring.md.
