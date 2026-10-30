---
title: "Schema de telemetria (JSONL)"
type: telemetry-schema
status: proposed
category: orchestration
updated: 2026-10-29
tags: [orchestration, telemetry]
---
# Schema de telemetria (JSONL)

Uma linha JSON por evento, em arquivo local **fora do cofre** (ADR-009). Sem prompts completos, sem conteúdo de notas, sem segredos.

## Campos comuns
| campo | tipo | obrigatório | descrição |
|---|---|---|---|
| schema | string | sim | `akm.orchestration.v1` |
| ts | string ISO-8601 | sim | instante do evento (UTC) |
| run_id | string | sim | id da execução |
| task_id | string | sim | id da tarefa |
| step | inteiro | sim | passo da simulação/fase do bootstrap |
| event | enum | sim | `task_received`, `classified`, `policy_loaded`, `tool_call`, `agent_selected`, `skills_selected`, `workflow_selected`, `handoff`, `verification`, `hitl`, `task_executed`, `metrics_recorded`, `fix_attempt`, `task_completed` |
| agent | string | não | agente envolvido |
| tool | string | não | tool MCP chamada |
| duration_ms | número | não | duração |
| chars_in / chars_out | número | não | tamanho de entrada/saída |
| est_tokens_in / est_tokens_out | número | não | `ceil(chars/4)` — estimativa |
| llm_calls | número | sim em `task_completed` | 0 na simulação |
| cost_usd | número | não | 0 na simulação |
| status | string | não | `ok`, `error`, `done`, `partial`, `blocked` |
| data | objeto | não | detalhes pequenos (ids, contagens, escolhas) |

## Exemplo
```json
{"schema":"akm.orchestration.v1","ts":"2026-10-29T23:59:00.000Z","run_id":"sim-001","task_id":"T-001","step":5,"event":"agent_selected","agent":"main-agent","data":{"score":0.4}}
```

## Evolução
Migrar para atributos OpenTelemetry GenAI (Langfuse/Phoenix em Docker) só após ADR e aprovação (EVO-09).
