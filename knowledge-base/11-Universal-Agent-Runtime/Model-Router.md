---
title: "Model Router"
type: routing-policy
runtime_component: router
status: proposed
category: runtime
updated: 2026-10-29
tags: [ai-agent-ecosystem, runtime]
---
# Model Router

Complementa [[Model-Routing-Policy]] (área 10, tiers por papel) com a escolha **por tarefa**. Lido por `get_model_routing_policy`. Os modelos reais de cada tier e a matriz tarefa → modelo estão em [[Model-Catalog]] (fotografia de 29/10/2026, revisão mensal).

## Fatores
| fator | peso | como medir | fonte |
|---|---|---|---|
| complexidade da tarefa | alto | classificação trivial/simples/moderada/complexa/crítica | orquestrador |
| custo esperado por sucesso | alto | `custo/tentativa` ÷ P(sucesso em n tentativas) + retrabalho | `expectedCost` |
| taxa de sucesso histórica | alto | `done_rate` por tipo × tier | [[Execution-Metrics]] |
| risco/irreversibilidade | alto | lista de irreversíveis | [[Execution-Policy]] |
| tamanho do contexto | médio | caracteres/tokens a enviar | [[Token-Optimization-Engine]] |
| necessidade de ferramentas | médio | ler/editar arquivos, web, MCP | [[Capability-Manifest]] |
| latência aceitável | médio | prazo da tarefa | pedido |
| disponibilidade/cota | médio | login e limites da assinatura | [[Environment-Detection]] |
| privacidade dos dados | médio | dado pode sair da máquina? | política do Pedro |
| custo de retrabalho | médio | tempo humano para revisar/refazer | estimativa rotulada |
| cache de prompt | baixo | prefixo estável reaproveitável | [[Model-Pricing]] |

## Tiers
| complexidade | tier | exemplo | adapter sugerido |
|---|---|---|---|
| trivial | local ou sem LLM | somar números, renomear, formatar | shell / [[Adapter-Ollama-Local]] |
| simples | mini | resumo curto, extração | modelo pequeno via CLI disponível |
| moderada | balanced | feature pequena com testes | [[Adapter-Codex]] ou [[Adapter-Claude-Code]] |
| complexa | frontier | arquitetura, refatoração ampla | [[Adapter-Claude-Code]] / [[Adapter-Codex]] em modelo topo |
| crítica | frontier + verificador | segurança, dados, irreversível | frontier + [[Verification-Protocol]] + aprovação |

## Escalonamento
- Sobe um tier após 2 falhas na mesma tarefa ou veredito negativo do verificador; registrar `escalation_reason`.
- Desce um tier quando o tier atual tem `first_pass_rate` alto por 5 tarefas seguidas do mesmo tipo.
- Nunca escalar sem orçamento: respeitar `budget.max_cost_usd` e a cota.

## Custo esperado (fórmula)
Com custo por tentativa `c`, sucesso `p`, falha `q = 1 − p`, até `n` tentativas e retrabalho `r` por falha:
- P(sucesso) = 1 − qⁿ; E[tentativas] = (1 − qⁿ)/p
- custo = E[tentativas]·c + E[falhas]·r; **custo por sucesso** = custo ÷ P(sucesso)
- Exemplo (valores **hipotéticos**, n=3, r=0,05): modelo barato c=0,01 e p=0,3 → 2,19 tentativas, P(sucesso)=0,657, **0,150 por sucesso**; modelo caro c=0,05 e p=0,9 → 1,11 tentativas, P=0,999, **0,061 por sucesso**. O barato sai 2,5× mais caro por sucesso. Calculado com `expectedCost`; use `compare` na tool com números medidos.
