---
title: "Métricas de execução do runtime"
type: metric-catalog
runtime_component: metrics
status: proposed
category: runtime
updated: 2026-10-29
tags: [ai-agent-ecosystem, runtime, metrics]
---
# Métricas de execução do runtime

Lidas por `get_metric_definitions` junto com [[Metric-Definitions]] (área 10). Eventos JSONL `akm.runtime.v1` (`delegation_result`, `delegation_summary`). Sem dado → **não medido**; nunca preencher com estimativa.

## Métricas
| id | nome | pergunta | unidade | fórmula/fonte | meta | coleta |
|---|---|---|---|---|---|---|
| rt_latency_ms | Latência da execução | quanto o agente demorou? | ms | `ended_at − started_at` do `AgentResult` (alimenta duration_min) | estável por tipo | runtime |
| rt_success | Sucesso da execução | a tarefa passou nos critérios? | sim/não | status done + critérios objetivos (alimenta done_rate e first_pass_rate) | ≥ 80% | runtime + verificador |
| rt_retry_rate | Taxa de retry | quantas tentativas extras? | % | (tentativas − tarefas) / tentativas (alimenta loops e fix_attempts) | < 20% | runtime |
| rt_cost_per_success | Custo por sucesso | quanto custa uma entrega boa? | USD ou cota | custo reportado ÷ sucessos; estimado só com rótulo (alimenta cost_per_task e cost per point do Harness) | caindo | runtime |
| rt_tokens_reported | Tokens reportados | quanto entrou e saiu? | tokens | `tokens_in`/`tokens_out`/`tokens_cached` só se a CLI reporta (alimenta tokens_in/tokens_out) | — | runtime |
| rt_context_chars | Contexto enviado | quanto contexto mandamos? | caracteres | `context_chars_sent` (alimenta context_used e context efficiency) | caindo | runtime |
| rt_parallel_speedup | Ganho de paralelismo | paralelizar ajudou? | razão | Σ latências ÷ tempo de parede do lote | > 1,5 | runtime |
| rt_adapter_availability | Disponibilidade de adapters | quantos agentes estão prontos? | contagem | adapters instalados + login ok no manifest (alimenta agent_selection_score) | — | detect-env |

## Ligação com o Harness
Indicadores do Harness (`Metrics/framework.md`, lido em 29/10/2026): done rate, rework rate, average loops, average quality, review rounds, first-pass rate, cost per point, delegation ROI, escaped defects, context efficiency. O runtime alimenta diretamente 6 deles (done rate, average loops, first-pass rate, cost per point, delegation ROI, context efficiency); quality, rework, review rounds e escaped defects continuam manuais ou do verificador.

## Ligação com a área 10
Ids de [[Metric-Definitions]]: cost_per_task, tokens_in, tokens_out, quality, duration_min, loops, fix_attempts, rework, context_used, model_tier, component_used, verifier_verdict, human_interventions, done_rate, first_pass_rate, delegation_roi, agent_selection_score.
