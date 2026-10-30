---
title: "Contrato de delegação"
type: policy
policy_area: delegation
status: proposed
category: orchestration
updated: 2026-10-29
tags: [orchestration, delegation]
---
# Contrato de delegação

Base: R3 ([[Harness-Recommendations]]) + Harness `orchestration.md` (Delegation budget, Brief) e `delegation-cost.md`.

## Regras
| Regra | Valor | Origem |
|---|---|---|
| Filhos simultâneos | ≤ 6 | R3 (OMC) |
| Profundidade | ≤ 2 (filho não cria netos sem permissão) | R3 |
| `allow_delegation` | false por padrão | R3 (CrewAI) |
| Escritores por arquivo | 1; worktree por escritor em paralelo | R3 (ruflo, wshobson) |
| Arquivos compartilhados | pom.xml, application.yml, lockfiles, notas do cofre → só o orquestrador | R3 |
| Handoff | obrigatório, completo ([[Handoff-Protocol]]) | Harness `Templates.md` §2 |
| Orçamento | max_turns, max_retries, timeout_min do agent-spec | R2/R7 |

## Decisão de delegar
`custo(delegar) = brief + contexto transferido + execução + consolidação + risco de retrabalho` (Harness). Se maior que fazer direto → direto.

## Consolidação
O orquestrador junta os retornos, resolve conflitos e só então verifica ([[Verification-Protocol]]). Filhos não conversam entre si.
