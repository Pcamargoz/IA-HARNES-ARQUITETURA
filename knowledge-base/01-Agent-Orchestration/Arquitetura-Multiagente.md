---
title: "Arquitetura multiagente alvo"
type: architecture
status: proposed
updated: 2026-10-29
tags: [ai-agent-ecosystem, architecture, orchestration]
---
# Arquitetura multiagente alvo

Proposta derivada da pesquisa de 29/10/2026 e do Harness-Architecture. **Não implementada**, exceto onde indicado.

## Princípios
1. O vault é a fonte de verdade (ADR-001 do Harness); agentes leem por MCP, escrevem só em áreas autorizadas.
2. Contexto progressivo (L0→L3 do `AGENTS.md`): começar pelo índice, carregar 2–4 notas, buscar o resto.
3. Delegar quando o custo de contexto do subagente for menor que o do principal (`Optimization/delegation-cost.md`).
4. Ferramentas novas entram por experimento medido e ADR.

## Papéis
| Papel | Cliente | Ferramentas principais | Modelo (tier) |
|---|---|---|---|
| Orquestrador (Main Agent) | Claude Code + [[Superpowers]] | hermes-vault, [[Agent-Knowledge-MCP]] | balanceado (Sonnet) |
| Pesquisa | Claude Desktop | [[Context7]], web | balanceado |
| Arquitetura | Claude Desktop | [[Basic-Memory]] (E2), Agent-Knowledge-MCP | frontier (Opus) só para ADR crítico |
| Código | subagente do Claude Code | [[Serena]] (E1), Context7 | balanceado |
| QA | subagente | `./mvnw test`, [[Playwright-MCP]] | pequeno (Haiku) |
| Contexto e memória | Consultor de contexto | Basic Memory + Obsidian | pequeno/balanceado |
| DevOps | sessão do Harness (Claude Code) — Hermes Agent fora do escopo do ecossistema do Pedro | [[GitHub-MCP-Server]] read-only | conforme [[Papeis-e-Modelos]] |

Detalhe de roteamento: [[Papeis-e-Modelos]] e [[Roteamento-de-Modelos]].

## Camadas (mapeadas no Harness)
| Camada do Harness | Neste ecossistema |
|---|---|
| Interface | Claude Code, Claude Desktop (Hermes fora do escopo do ecossistema do Pedro) |
| Cognition | Main Agent + skills de processo (Superpowers) + skills do Cofre |
| Execution | MCPs: hermes-vault, Agent-Knowledge-MCP, Serena, Context7, GitHub, Playwright |
| Control | `Security/permissions.md` (L0–L3), read-only por padrão, ADRs |
| Evolution | [[Fluxo-de-Atualizacao]], [[Research-History]], métricas (F0) |

## Fluxo de uma tarefa
```text
Pedro → Orquestrador (L0: HOME+AGENTS) → search_knowledge/get_document (L1–L2)
      → spec curta → plano → delega (código/QA) com handoff brief
      → subagentes usam Serena/Context7 → QA roda testes → orquestrador consolida
      → entrega (Status/Result/Evidence/Open items) → registro (Inbox/ ou Basic Memory)
```

## Estado atual vs. alvo
| Item | Hoje | Alvo |
|---|---|---|
| Consulta ao conhecimento | hermes-vault (só Harness) | + Agent-Knowledge-MCP (Cofre KB + Harness) ✅ implementado, não conectado aos clientes |
| Contexto de código | leitura de arquivo | Serena (após E1) |
| Memória entre clientes | manual | Basic Memory (após E2) |
| Execução do fluxo | descrito em notas | Superpowers (após E3) |

Relacionados: [[Comunicacao-entre-Agentes]] · [[Harness-Improvement-Proposal]]
