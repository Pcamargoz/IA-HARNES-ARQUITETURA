---
title: "Roteamento de modelos"
type: guide
status: proposed
updated: 2026-10-29
tags: [ai-agent-ecosystem, tokens, models]
---
# Roteamento de modelos

## Resumo
Rotear por **papel** primeiro, por tarefa depois. Tiers do Harness: small / balanced / frontier.

| Papel | Tier | Modelo Claude sugerido |
|---|---|---|
| QA, triagem, resumo de logs | small | Haiku |
| Orquestração, código, pesquisa | balanced | Sonnet |
| ADR crítico, arquitetura nova | frontier | Opus |

## Opções técnicas
| Opção | Economia real? | Situação |
|---|---|---|
| Subagentes com `model:` no Claude Code | sim (mesmo provedor, tarefa certa) | recomendado (E3) |
| [[Claude-Code-Router]] | desloca custo para outro provedor | radar |
| [[LiteLLM]] | gateway multi-provedor com orçamento | radar |

## Validação
E3 compara custo e qualidade do QA em Haiku vs. baseline: meta custo ≤ baseline +10% (ou −20% com Haiku) e testes verdes. Ver [[E3-Superpowers-QA-Frans]].
