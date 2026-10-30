---
title: "microsoft/autogen"
type: repo-profile
status: researched
category: orchestration
updated: 2026-10-29
origem: "pesquisa de orquestração feita na box do Grok Bot (29/10/2026), importada sem alterar o conteúdo; só frontmatter e links ajustados"
reuso: "ficha é síntese própria; citações curtas e atribuídas; reutilize o repositório de origem apenas conforme a licença indicada em licenca"
tipo: ficha-repositorio
categoria: [framework-multiagente, event-driven, group-chat]
repo: https://github.com/microsoft/autogen
licenca: "Docs CC-BY-4.0 (LICENSE) + código MIT (LICENSE-CODE)"
estrelas: 61623
ultimo_push: 2026-10-28
ultima_release: python-v0.7.5 (2025-09-30)
arquivado: "README diz arquivado/sem manutenção; API GitHub ainda reporta archived=false"
sucessor: https://github.com/microsoft/agent-framework
nota: 47
verificado_em: 2026-10-29
tags: [autogen, descontinuado, referencia-historica]
---

# AutoGen

> Importado em 29/10/2026 para [[MOC-Orchestration-Research]]. Conteúdo original preservado; ajustes: frontmatter `type/status/category` e links com nome em conflito.

> Ver [[Pattern-Catalog]] · [[Architecture-Comparison]] · [[Harness-Recommendations]]

## Status: ⚠️ descontinuado
- O README atual exibe o selo "status-archived" e o aviso: *"This project has been archived and is no longer actively maintained by Microsoft"* e *"New users should start with Microsoft Agent Framework"*.
- **Divergência:** a API do GitHub em 29/10/2026 retorna `archived: false` e push em 28/10/2026. O repositório ainda não está tecnicamente arquivado, mas o mantenedor declara fim de suporte, incluindo de segurança.
- Última release: `python-v0.7.5`, de 30/09/2025.
- ⭐ 61.623 · forks 9.328.
- Licença dupla: a documentação está em **CC-BY-4.0**, o que exige atribuição e indicação de mudanças, e o código está em **MIT**.

## Padrões de referência (históricos)
1. Camadas **Core API** (message passing, event-driven, runtime distribuído), **AgentChat** (two-agent chat, group chat) e **Extensions**.
2. **Agent-as-tool:** `AgentTool(math_agent, return_value_as_last_message=True)` com `max_tool_iterations=10` (exemplo do README). O supervisor chama especialistas como ferramentas.
3. Aviso de MCP: *"Only connect to trusted MCP servers as they may execute commands in your local environment"*.
4. **Magentic-One:** equipe com orquestrador líder, citada pelo Awesome-llms-labs como exemplo de supervisor.

## Recomendação
Não adotar. Use só como referência conceitual (agent-as-tool, event-driven). Para Java ou .NET, avaliar o **Microsoft Agent Framework**, que tem SDK .NET, mas não Java, e não foi verificado nesta sessão. O fork comunitário **AG2** (Apache-2.0) é citado pelos awesome lists.

## Nota
| Critério | Peso | Sub | Pts |
|---|---|---|---|
| Utilidade | 25 | 45 | 11,25 |
| Qualidade técnica | 20 | 80 | 16,0 |
| Manutenção | 15 | 10 | 1,5 |
| Integração | 15 | 40 | 6,0 |
| Economia | 15 | 55 | 8,25 |
| Segurança/doc | 10 | 40 | 4,0 |
| **Total** | | | **≈ 47** |
