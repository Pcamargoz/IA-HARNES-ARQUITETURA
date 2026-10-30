---
title: "Política do orquestrador"
type: policy
policy_area: orchestrator
status: proposed
category: orchestration
updated: 2026-10-29
tags: [orchestration, policy]
---
# Política do orquestrador

Regras que o Main Orchestrator aplica. Cada seção é lida isoladamente por `get_orchestrator_policy` (parâmetro `section`).

## Quando executar direto e quando delegar
| Situação | Decisão | Fonte |
|---|---|---|
| 1–2 arquivos ou uma pergunta | direto | Harness `orchestration.md` (Delegation budget) |
| 3–10 arquivos, um domínio | direto ou 1 subagente | idem |
| várias frentes independentes | subagentes em paralelo (≤6) | idem; R3 |
| decisão de alto risco | especialista + validação do orquestrador | idem |
| custo de delegar > custo direto | direto | `Optimization/delegation-cost.md` |

## Seleção de agente
1. `list_registered_agents` com `status=implemented` (só metadados).
2. Pontuar pela sobreposição entre a tarefa e `description`/`use_when`/`tags`; desempatar pelo menor tier.
3. Se o melhor candidato for `planned`/`conceptual`: **não executar**; propor ao Pedro ou fazer direto.
4. Carregar a spec completa só do escolhido (`get_agent_specification`).

## Seleção de workflow
`find_workflow_template` por tipo de tarefa (feature, bugfix, research, review, docs). Sem correspondência → workflow padrão do Harness (`Process/workflow.md`: Understand → Specify → Plan → Execute → Validate → Deliver → Record).

## Roteamento de modelo
Ver [[Model-Routing-Policy]]. Regra curta: tier 0 (sem LLM) primeiro; subir tier só com causa registrada.

## Verificação
Ver [[Verification-Protocol]]. Autor ≠ verificador; evidência fresca; 2 rodadas de revisão no máximo.

## Guardas contra falhas
- Loop de correção ≤3 (R4); por tipo de tarefa, limites do Harness `Process/loops.md` ([[Execution-Policy]]).
- Duas falhas com a mesma causa → parar.
- "Concluído" sem evidência é bloqueio.
- Filhos não conversam entre si em loop; o orquestrador coordena (Harness `Agents/roles.md`, Shared rules).

## Cancelamento e estados terminais
`complete | failed | cancelled`. Cancelar limpa `.harness/` (estado de trabalho, proposto em R8), nunca o cofre. Retomada a partir do último estágio incompleto, após `git status`.

## HITL
Ver [[HITL-e-Escalonamento]] e a lista de irreversíveis em [[Execution-Policy]].
