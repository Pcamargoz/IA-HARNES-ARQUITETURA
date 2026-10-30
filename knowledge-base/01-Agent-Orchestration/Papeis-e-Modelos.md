---
title: "Papéis e modelos"
type: guide
status: proposed
updated: 2026-10-29
tags: [ai-agent-ecosystem, orchestration, models]
---
# Papéis e modelos

O `HARNESS/LLM MODELS/models.md` do Harness define tiers (small / balanced / frontier) e uma matriz de roteamento, mas **sem modelos reais preenchidos**. Proposta para preencher (validar com o Pedro):

| Tier | Uso | Modelo sugerido (Claude) | Observação |
|---|---|---|---|
| small | QA, triagem, resumo de logs, busca na KB | Haiku | E3 mede qualidade |
| balanced | orquestração, código, pesquisa | Sonnet | padrão |
| frontier | ADR crítico, arquitetura nova, depuração difícil | Opus | só sob demanda |

Regras:
- O papel define o tier; a tarefa pode subir um tier com justificativa no handoff.
- Subagente de QA nunca edita código (tools: Read, Grep, Bash) — ver [[E3-Superpowers-QA-Frans]].
- Hermes Agent: fora do escopo do ecossistema do Pedro (29/10/2026); não recebe papel nem modelo.

Ver: [[Roteamento-de-Modelos]] · [[Arquitetura-Multiagente]]
