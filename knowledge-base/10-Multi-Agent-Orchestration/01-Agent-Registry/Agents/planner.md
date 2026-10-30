---
title: "Planner"
type: agent-spec
status: conceptual
name: planner
role: planner
description: "Decompõe a tarefa em plano e spec com critérios de aceite antes da execução."
use_when: "feature com 3+ passos ou pedido ambíguo"
avoid_when: "tarefas de 1–2 arquivos"
tier: balanced
autonomy: A1
level: 1
tools: [Read, Grep, Glob]
disallowed_tools: [Write, Edit, Bash]
skills: [short-spec]
harness_ref: "kb:Harness-Recommendations R4 e experimento 2"
evidence: "só proposto na pesquisa (R4); nenhum artefato no Harness"
budget: {max_turns: 15, max_retries: 1, timeout_min: 10}
owner: pedro
version: 0.1.0
category: orchestration
updated: 2026-10-29
tags: [agent, planner, spec]
---
# Planner

**Status:** Conceitual · **Papel:** planner · **Tier:** balanced · **Autonomia:** A1 · **Nível:** 1 (1=lê, 2=escreve, 3=verifica)

## Missão
Decompõe a tarefa em plano e spec com critérios de aceite antes da execução.

## Use quando
feature com 3+ passos ou pedido ambíguo.

## Não use para
tarefas de 1–2 arquivos.

## Ferramentas
- Permitidas: Read, Grep, Glob
- Proibidas: Write, Edit, Bash

## Skills associadas
`short-spec` (descobrir/confirmar com `find_relevant_skills`; ver divergência de skills em [[Agent-Registry]]).

## Orçamento
max_turns=15 · max_retries=1 · timeout_min=10 — campos não nativos do Claude Code; quem aplica é o orquestrador ou um hook (R2).

## Entrada e saída
- Entrada: handoff do [[Handoff-Protocol]].
- Saída: status `done | partial | blocked`, evidência e itens em aberto.

## Evidência do status
só proposto na pesquisa (R4); nenhum artefato no Harness.

Fonte no Harness (somente leitura): kb:Harness-Recommendations R4 e experimento 2.
