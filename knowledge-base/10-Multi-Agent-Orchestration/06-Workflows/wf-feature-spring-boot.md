---
title: "Workflow — Feature Spring Boot"
type: workflow-template
status: proposed
name: wf-feature-spring-boot
task_types: [feature]
triggers: [feature, implementar, endpoint, spring, java, api, servico, microsservico]
agents: [main-agent, planner, spring-boot-implementer, test-engineer, verifier]
skills: [short-spec, java-spring-backend-senior, spring-testing-strategy, final-code-review, delivery-report]
autonomy: A3
max_fix_attempts: 3
category: orchestration
updated: 2026-10-29
tags: [orchestration, workflow, feature]
---
# Workflow — Feature Spring Boot

**Tipos:** feature · **Autonomia:** A3 · **Correções máx.:** 3 · **Status:** proposto (validado só em simulação).

## Etapas
1. Entender: objetivo e critério de aceite (main-agent)
2. Especificar: spec curta (planner → hoje main-agent + short-spec)
3. Planejar: arquivos e dono de cada um; handoff
4. Executar: implementação + testes (spring-boot-implementer → hoje builder/main)
5. Verificar: `./mvnw test`, critérios VERIFIED/PARTIAL/MISSING (verifier → hoje reviewer/main)
6. Corrigir: até 3 tentativas; depois failed
7. Entregar: delivery report
8. Registrar: telemetria + execution-log

## Agentes
[[main-agent]], [[planner]], [[spring-boot-implementer]], [[test-engineer]], [[verifier]] — usar só os `implemented`; os demais caem no main-agent até serem aprovados.

## Skills
`short-spec`, `java-spring-backend-senior`, `spring-testing-strategy`, `final-code-review`, `delivery-report`

## Gatilhos (para `find_workflow_template`)
feature, implementar, endpoint, spring, java, api, servico, microsservico

Base: Harness `Process/workflow.md` (Understand → Specify → Plan → Execute → Validate → Deliver → Record) e R4.
