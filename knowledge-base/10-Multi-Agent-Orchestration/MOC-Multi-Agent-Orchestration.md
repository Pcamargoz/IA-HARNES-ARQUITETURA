---
title: "MOC — Multi-Agent Orchestration"
type: moc
status: active
category: orchestration
updated: 2026-10-29
tags: [ai-agent-ecosystem, moc, orchestration]
---
# MOC — Multi-Agent Orchestration

Desenho do **Main Orchestrator** do Pedro sobre o Harness-Architecture. Base técnica: [[Harness-Recommendations]] (R1–R10), [[Pattern-Catalog]] e [[Architecture-Comparison]] (pesquisa em [[MOC-Orchestration-Research]]). Fatos do Harness lidos em modo somente leitura em 29/10/2026.

> **Estado real (29/10/2026):** tudo nesta pasta é **documentação e proposta**. Nada foi aplicado ao Harness-Architecture nem às configs do Claude Code/Desktop (Hermes fora do escopo do ecossistema do Pedro). O que roda de fato: as 8 tools de leitura do [[Agent-Knowledge-MCP]] que servem esta pasta e o script de simulação determinística ([[Validacao-Orquestracao-2026-10-29]]).
>
> **Fonte das listas:** as 8 fases do [[Bootstrap-8-Fases]], os 9 passos da validação E2E e os 14 pontos do [[Main-Orchestrator-Prompt]] seguem o texto do Pedro (revisão de 29/10/2026).

## Estrutura
| Pasta | Conteúdo | Entrada |
|---|---|---|
| 00-Orchestrator | prompt do orquestrador, política, bootstrap de 8 fases | [[Main-Orchestrator-Prompt]] · [[Orchestrator-Policy]] · [[Bootstrap-8-Fases]] |
| 01-Agent-Registry | registro de agentes (implementado/planejado/conceitual) e templates | [[Agent-Registry]] |
| 02-Protocols | delegação, handoff, verificação, HITL, comunicação | [[Delegation-Contract]] · [[Handoff-Protocol]] · [[Verification-Protocol]] · [[HITL-e-Escalonamento]] · [[Comunicacao-entre-Agentes-Protocolo]] |
| 03-Execution | política de execução, roteamento de modelo | [[Execution-Policy]] · [[Model-Routing-Policy]] |
| 04-Metrics-Telemetry | definições de métricas e schema JSONL | [[Metric-Definitions]] · [[Telemetry-Schema]] |
| 05-Context-Memory | níveis de contexto e memória em duas camadas | [[Context-and-Memory]] |
| 06-Workflows | templates de workflow por tipo de tarefa | [[Workflow-Catalog]] |
| 07-Governance | governança, licenças, ADRs 007–010 | [[Governance-Orquestracao]] |
| 08-Roadmap | roadmap da orquestração | [[Orchestration-Roadmap]] |
| 09-Harness-Evolution | propostas EVO-01..10 com plano de reversão | [[Harness-Evolution-Proposals]] |

Execução real das delegações (contrato, adapters, detecção, roteador): [[MOC-Universal-Agent-Runtime]] (área 11).

## Tools do MCP que leem esta pasta
`get_orchestrator_policy`, `list_registered_agents`, `get_agent_specification`, `find_relevant_skills`, `find_workflow_template`, `get_execution_policy`, `get_metric_definitions`, `get_architecture_decisions` — ver [[Tools-Reference]].

## Convenções de frontmatter
`type: agent-spec | policy | workflow-template | metric-catalog | telemetry-schema | template | procedure | proposal | adr | roadmap | catalog | moc` e, em agentes, `status: implemented | planned | conceptual` ([[ADR-005-Frontmatter-Padronizado]], [[ADR-008-Registro-de-Agentes-com-Status]]).
