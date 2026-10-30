---
title: "Compressão, cache e empacotamento"
type: guide
status: active
updated: 2026-10-29
tags: [ai-agent-ecosystem, tokens, compression]
---
# Compressão, cache e empacotamento

## Resumo
Reduzir o que entra no contexto sem perder a informação necessária.

## Técnicas
| Técnica | Ferramenta | Quando |
|---|---|---|
| Recuperação por símbolo | [[Serena]] | código (iterativo) |
| Leitura por seção | `get_document heading` ([[Agent-Knowledge-MCP]]), `vault_read heading` (hermes-vault) | notas |
| Compressão de saídas/logs | [[Headroom]] (proxy local) | logs longos de build/teste |
| Empacotamento filtrado | [[Repomix]] | revisão de arquitetura pontual |
| Cache de prompt | nativo do provedor/cliente | prefixos estáveis (L0: HOME+AGENTS) — manter o início do contexto estável |
| Resumo por subagente | QA em Haiku | falhas de teste |

## Cuidados
- Compressão pode esconder a linha que explica o erro: validar com amostra (critério M10 da [[Harness-Improvement-Proposal]]).
- Headroom fica entre cliente e API: só local; Intel Mac não testado.
- Repomix sem filtro gera o oposto de economia.
