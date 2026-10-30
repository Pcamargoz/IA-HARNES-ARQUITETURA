---
title: "Workflow — Revisão de código"
type: workflow-template
status: proposed
name: wf-code-review
task_types: [review]
triggers: [revisar, revisao, review, pr, pull, diff, auditar, qualidade]
agents: [main-agent, reviewer, qa-validator]
skills: [final-code-review, code-review-senior]
autonomy: A1
max_fix_attempts: 2
category: orchestration
updated: 2026-10-29
tags: [orchestration, workflow, review]
---
# Workflow — Revisão de código

**Tipos:** review · **Autonomia:** A1 · **Correções máx.:** 2 · **Status:** proposto (validado só em simulação).

## Etapas
1. Ler spec e critérios
2. Ler diff e resultados de teste
3. Achados por severidade (blocker/major/minor)
4. Veredito; no máximo 2 rodadas

## Agentes
[[main-agent]], [[reviewer]], [[qa-validator]] — usar só os `implemented`; os demais caem no main-agent até serem aprovados.

## Skills
`final-code-review`, `code-review-senior`

## Gatilhos (para `find_workflow_template`)
revisar, revisao, review, pr, pull, diff, auditar, qualidade

Base: Harness `Process/workflow.md` (Understand → Specify → Plan → Execute → Validate → Deliver → Record) e R4.
