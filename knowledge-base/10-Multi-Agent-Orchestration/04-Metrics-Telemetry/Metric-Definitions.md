---
title: "Definições de métricas"
type: metric-catalog
status: proposed
category: orchestration
updated: 2026-10-29
tags: [orchestration, metrics]
---
# Definições de métricas

Lida por `get_metric_definitions` (linha a linha da tabela). Core do Harness (`Metrics/framework.md`) + R9. Indicadores sem dado ficam **não medido**; nunca preencher com estimativa.

## Métricas
| id | nome | pergunta | unidade | fórmula/fonte | meta | coleta |
|---|---|---|---|---|---|---|
| cost_per_task | Custo por tarefa | a tarefa vale o custo? | tokens ou moeda | soma de tokens/custo dos eventos da tarefa | estável por tipo | telemetria (est. sem LLM) |
| tokens_in | Tokens de entrada | quanto contexto foi enviado? | tokens | eventos `tool_call`/`llm_call` | caindo | telemetria |
| tokens_out | Tokens de saída | quanto foi gerado? | tokens | eventos | — | telemetria |
| quality | Qualidade do resultado | atingiu o critério? | 1–5 ou pass/fail | rubrica do Harness | ≥ 4 | manual / verificador |
| duration_min | Tempo | quanto demorou? | minutos | `ended_at - started_at` | — | telemetria |
| loops | Tentativas | quantas tentativas? | contagem | eventos `fix_attempt` + 1 | ≤ 2 | telemetria |
| fix_attempts | Tentativas de correção | o loop convergiu? | contagem | eventos `fix_attempt` | ≤ 3 (teto) | telemetria |
| rework | Retrabalho | quanto foi refeito? | sim/não ou % | manual | < 20% | manual |
| context_used | Contexto usado | quanto foi carregado? | tokens | soma de `est_tokens` de leituras | caindo | telemetria |
| model_tier | Modelo usado | qual tier resolveu? | alias | evento `delegation` | — | telemetria |
| component_used | Skill/MCP usado | o componente ajudou? | nome | eventos `tool_call` | — | telemetria |
| verifier_verdict | Veredito do verificador | passou na verificação? | VERIFIED/PARTIAL/MISSING | evento `verification` | 100% VERIFIED | telemetria |
| human_interventions | Intervenções humanas | quanto o Pedro precisou agir? | contagem | eventos `hitl` | ≤ 2 por tarefa | telemetria |
| done_rate | Taxa de conclusão | as tarefas fecham? | % | done / tarefas | ≥ 80% | execution-log |
| first_pass_rate | Acerto de primeira | a 1ª tentativa resolve? | % | loops = 1 e sem retrabalho / tarefas | ≥ 60% | execution-log |
| delegation_roi | ROI de delegação | delegar compensou? | razão | (estimativa direta − real delegado) / estimativa direta | > 0 | manual |
| agent_selection_score | Pontuação da seleção | o agente escolhido casa com a tarefa? | 0–1 | termos em comum / termos da tarefa | ≥ 0,3 | simulação |

## Observações
- `est_tokens = ceil(chars / 4)` é **estimativa** usada só na simulação sem LLM; não é medição de modelo.
- Schema dos eventos: [[Telemetry-Schema]].
- Métricas da execução real de agentes (prefixo `rt_`): [[Execution-Metrics]].
