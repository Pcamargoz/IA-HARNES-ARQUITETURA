---
title: "Yigtwxx/awesome-claude-multi-agent"
type: repo-profile
status: researched
category: orchestration
updated: 2026-10-29
origem: "pesquisa de orquestração feita na box do Grok Bot (29/10/2026), importada sem alterar o conteúdo; só frontmatter e links ajustados"
reuso: "ficha é síntese própria; citações curtas e atribuídas; reutilize o repositório de origem apenas conforme a licença indicada em licenca"
tipo: ficha-repositorio
categoria: [awesome-list, multiagente-claude, fontes-primarias]
repo: https://github.com/Yigtwxx/awesome-claude-multi-agent
licenca: CC0-1.0
estrelas: 3
ultimo_push: 2026-10-04
ultima_release: nenhuma
arquivado: false
nota: 71
verificado_em: 2026-10-29
tags: [awesome, leitura, anthropic, observabilidade, memoria]
---

# Yigtwxx / awesome-claude-multi-agent

> Importado em 29/10/2026 para [[MOC-Orchestration-Research]]. Conteúdo original preservado; ajustes: frontmatter `type/status/category` e links com nome em conflito.

> Ver [[Pattern-Catalog]] · [[Harness-Recommendations]]

## Metadados verificados
- ⭐ 3 · forks 4 · criado 08/04/2026 · push 04/10/2026 · **CC0-1.0**, ou seja, domínio público, com reutilização livre e sem exigência de atribuição · sem releases
- A adoção é baixíssima, mas a curadoria privilegia **fontes primárias**, e por isso a nota de utilidade é alta.

## Itens mais relevantes (extraídos do README; links **não abertos** um a um)
- **Anthropic Engineering:** "Building Effective Agents", "How We Built Our Multi-Agent Research System" e "Building Multi-Agent Systems: When and How", que justificam multiagente por isolamento de contexto, paralelização e especialização.
- **Claude Code docs:** sub-agents (`code.claude.com/docs/en/sub-agents`), agent teams, hooks (`SubagentStop`, `TaskCompleted`) e Agent SDK subagents. O README cita limites de profundidade de spawn, concorrência e gasto, mas **não conferi na fonte**.
- **Pesquisa:** taxonomia MAST de falhas multiagente.
- **Frameworks alternativos:** AG2, Deep Agents, Microsoft Agent Framework, Zeroshot e Gas Town.
- **Memória:** basic-memory (Markdown + MCP, alinhado ao Obsidian do Pedro) e agentmemory.
- **Observabilidade:** Langfuse, Arize Phoenix e as convenções semânticas OpenTelemetry GenAI. Benchmark: OrchBench.

## Uso no Harness
É uma lista de leitura obrigatória para fundamentar o `Pattern-Catalog`. O basic-memory e o OTel GenAI são candidatos concretos para memória e métricas (ver [[Harness-Recommendations]]).

## Nota
| Critério | Peso | Sub | Pts |
|---|---|---|---|
| Utilidade | 25 | 75 | 18,75 |
| Qualidade técnica | 20 | 80 | 16,0 |
| Manutenção | 15 | 70 | 10,5 |
| Integração | 15 | 60 | 9,0 |
| Economia | 15 | 60 | 9,0 |
| Segurança/doc | 10 | 80 | 8,0 |
| **Total** | | | **≈ 71** |
