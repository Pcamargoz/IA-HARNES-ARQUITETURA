---
title: "MOC — Implementação"
type: moc
status: active
updated: 2026-10-29
tags: [ai-agent-ecosystem, moc, implementation]
---
# MOC — Implementação

## Decisões (ADR)
| ADR | Decisão | Status |
|---|---|---|
| [[ADR-001-KB-no-Cofre]] | KB dentro do Cofre do Pedro, em pasta própria | accepted |
| [[ADR-002-MCP-em-TypeScript]] | MCP em TypeScript (SDK oficial), stdio | accepted |
| [[ADR-003-Somente-Leitura-Multi-Raiz]] | MCP só leitura, várias raízes com allowlist | accepted |
| [[ADR-004-Busca-Lexical-Primeiro]] | busca lexical; semântica só avaliada | accepted |
| [[ADR-005-Frontmatter-Padronizado]] | frontmatter type/status/category consistente | accepted |
| [[ADR-006-Serena-Context7-condicionado-E1]] | Serena/Context7 condicionados ao E1 | proposed |
| [[ADR-007-Orquestracao-Documentada-Antes-do-Harness]] | orquestração desenhada na KB antes de mudar o Harness | accepted |
| [[ADR-008-Registro-de-Agentes-com-Status]] | registro de agentes com status implemented/planned/conceptual | accepted |
| [[ADR-009-Telemetria-JSONL-Local]] | telemetria JSONL local, fora do cofre | proposed |
| [[ADR-010-Simulacao-Deterministica]] | validação por simulação determinística, sem LLM | accepted |

ADR-007 a 010 ficam em `10-Multi-Agent-Orchestration/07-Governance/ADR/`. O Harness tem numeração própria (`Governance/decisions.md`); no MCP use `kb:ADR-NNN` ou `harness:ADR-NNN`.

## Experimentos
[[E1-Serena-Context7-ControlFree]] · [[E2-Basic-Memory-Obsidian]] · [[E3-Superpowers-QA-Frans]]

## Validação
[[Validacao-Agent-Knowledge-MCP-2026-10-29]] · [[Validacao-Orquestracao-2026-10-29]] · [[Validacao-Runtime-2026-10-29]]

## Planejamento
[[Implementation-Roadmap]] · [[Harness-Improvement-Proposal]] · [[Orchestration-Roadmap]] · [[Harness-Evolution-Proposals]]
