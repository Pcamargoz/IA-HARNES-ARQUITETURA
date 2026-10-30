---
title: "Workflow — Pesquisa técnica"
type: workflow-template
status: proposed
name: wf-research
task_types: [research]
triggers: [pesquisar, pesquisa, comparar, avaliar, ferramenta, repositorio, biblioteca, alternativas]
agents: [main-agent, researcher]
skills: [context7-docs-first, consultor-de-contexto]
autonomy: A1
max_fix_attempts: 3
category: orchestration
updated: 2026-10-29
tags: [orchestration, workflow, research]
---
# Workflow — Pesquisa técnica

**Tipos:** research · **Autonomia:** A1 · **Correções máx.:** 3 · **Status:** proposto (validado só em simulação).

## Etapas
1. Definir pergunta e critério de suficiência
2. Buscar na KB primeiro (search_knowledge)
3. Até 3 buscas externas por pergunta
4. Rotular cada afirmação: confirmado/provável/não verificado
5. Sintetizar com fontes; propor nota para a KB (sem escrever no cofre)

## Agentes
[[main-agent]], [[researcher]] — usar só os `implemented`; os demais caem no main-agent até serem aprovados.

## Skills
`context7-docs-first`, `consultor-de-contexto`

## Gatilhos (para `find_workflow_template`)
pesquisar, pesquisa, comparar, avaliar, ferramenta, repositorio, biblioteca, alternativas

Base: Harness `Process/workflow.md` (Understand → Specify → Plan → Execute → Validate → Deliver → Record) e R4.
