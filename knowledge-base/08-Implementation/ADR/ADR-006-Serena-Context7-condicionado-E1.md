---
title: "ADR-006 — Serena e Context7 condicionados ao E1"
type: adr
status: proposed
date: 2026-10-29
updated: 2026-10-29
tags: [ai-agent-ecosystem, adr, proposed]
---
# ADR-006 — Serena e Context7 condicionados ao E1

## Proposta
Adotar [[Serena]] como MCP de projeto nos repositórios Java somente se o [[E1-Serena-Context7-ControlFree]] mostrar ≥30% menos tokens com os mesmos testes verdes e RAM < 2 GB. [[Context7]] (já instalado no escopo de usuário) passa a ter regra docs-first.

## Decisão por resultado
| Economia | Ação |
|---|---|
| ≥ 30% | Serena em escopo de usuário/projeto para Java |
| 10–30% | só em repositórios grandes |
| < 10% | descartar Serena |

## Pendências
Instalar `uv` (decisão do Pedro); confirmar licença da Serena.
