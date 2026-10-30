---
title: "Workflow — Correção de bug"
type: workflow-template
status: proposed
name: wf-bugfix
task_types: [fix, bugfix]
triggers: [bug, erro, falha, corrigir, fix, quebrado, exception, regressao]
agents: [main-agent, test-engineer, builder, reviewer]
skills: [java-spring-backend-senior, spring-testing-strategy, final-code-review]
autonomy: A3
max_fix_attempts: 2
category: orchestration
updated: 2026-10-29
tags: [orchestration, workflow, fix, bugfix]
---
# Workflow — Correção de bug

**Tipos:** fix, bugfix · **Autonomia:** A3 · **Correções máx.:** 2 · **Status:** proposto (validado só em simulação).

## Etapas
1. Reproduzir em teste que falha
2. Localizar causa (busca simbólica antes de ler arquivos inteiros)
3. Corrigir com mudança mínima
4. Rodar teste + suíte afetada
5. Revisão leve (< 5 arquivos)
6. Registrar causa e correção

## Agentes
[[main-agent]], [[test-engineer]], [[builder]], [[reviewer]] — usar só os `implemented`; os demais caem no main-agent até serem aprovados.

## Skills
`java-spring-backend-senior`, `spring-testing-strategy`, `final-code-review`

## Gatilhos (para `find_workflow_template`)
bug, erro, falha, corrigir, fix, quebrado, exception, regressao

Base: Harness `Process/workflow.md` (Understand → Specify → Plan → Execute → Validate → Deliver → Record) e R4.
