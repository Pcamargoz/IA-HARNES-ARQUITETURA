---
title: "Workflow — Documentação e ADR"
type: workflow-template
status: proposed
name: wf-docs-adr
task_types: [docs]
triggers: [documentar, documentacao, adr, decisao, readme, nota, arquitetura]
agents: [main-agent, java-architect, content-agent]
skills: [short-spec, delivery-report]
autonomy: A2
max_fix_attempts: 2
category: orchestration
updated: 2026-10-29
tags: [orchestration, workflow, docs]
---
# Workflow — Documentação e ADR

**Tipos:** docs · **Autonomia:** A2 · **Correções máx.:** 2 · **Status:** proposto (validado só em simulação).

## Etapas
1. Contexto → decisão → consequências
2. Rascunho em Inbox/ (Harness) ou na KB autorizada
3. Revisão pelo Pedro
4. Promoção para área canônica só com aprovação

## Agentes
[[main-agent]], [[java-architect]], [[content-agent]] — usar só os `implemented`; os demais caem no main-agent até serem aprovados.

## Skills
`short-spec`, `delivery-report`

## Gatilhos (para `find_workflow_template`)
documentar, documentacao, adr, decisao, readme, nota, arquitetura

Base: Harness `Process/workflow.md` (Understand → Specify → Plan → Execute → Validate → Deliver → Record) e R4.
