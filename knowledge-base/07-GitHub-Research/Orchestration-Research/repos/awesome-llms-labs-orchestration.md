---
title: "Awesome-llms-labs/awesome-AI-agent-orchestration"
type: repo-profile
status: researched
category: orchestration
updated: 2026-10-29
origem: "pesquisa de orquestração feita na box do Grok Bot (29/10/2026), importada sem alterar o conteúdo; só frontmatter e links ajustados"
reuso: "ficha é síntese própria; citações curtas e atribuídas; reutilize o repositório de origem apenas conforme a licença indicada em licenca"
tipo: ficha-repositorio
categoria: [awesome-list, padroes-de-orquestracao]
repo: https://github.com/Awesome-llms-labs/awesome-AI-agent-orchestration
licenca: MIT
estrelas: 1
ultimo_push: 2026-09-30
ultima_release: nenhuma
arquivado: false
nota: 64
verificado_em: 2026-10-29
tags: [awesome, padroes, descontinuados, mast]
---

# Awesome-llms-labs / awesome-AI-agent-orchestration

> Importado em 29/10/2026 para [[MOC-Orchestration-Research]]. Conteúdo original preservado; ajustes: frontmatter `type/status/category` e links com nome em conflito.

> Ver [[Pattern-Catalog]] · [[Architecture-Comparison]]

## Metadados verificados
- ⭐ 1 · forks 3 · criado e com último push em 30/09/2026, um único dia de atividade · MIT · sem releases
- Repositório jovem, sem adoção e possivelmente gerado em lote. Mesmo assim, o conteúdo de `docs/orchestration-patterns.md` é bem escrito e cita fontes.

## Contribuições úteis
1. **Catálogo de padrões com trade-offs** (`docs/orchestration-patterns.md`):
   - **Supervisor:** ponto único de falha e gargalo de contexto. A profundidade acima de 2 ou 3 níveis degrada.
   - **Swarm/handoff:** cita a taxonomia MAST, segundo a qual o desalinhamento entre agentes responde por cerca de um terço das falhas.
   - **Debate:** retorno decrescente depois de 2 ou 3 rodadas.
   - Também cobre grafo de estado, pipeline e event-driven/actor.
2. **Seção de descontinuados** (útil para não adotar o que morreu):
   - AutoGen em modo de manutenção, com o sucessor MAF.
   - Semantic Kernel substituído pelo MAF.
   - ACP incorporado ao A2A.
   - HumanLayer SDK depreciado.
   - Renomeação de LangGraph Platform para LangSmith Deployment.
3. Lista de frameworks atuais: MAF, AG2, OpenAI Agents SDK, Google ADK, Dapr Agents, PydanticAI e AgentScope (menção a JVM, **não verificada**).

## Ressalvas
- Os números (por exemplo, "cerca de 1/3 das falhas") são citações de segunda mão. Conferir no paper MAST antes de usar como métrica.

## Nota
| Critério | Peso | Sub | Pts |
|---|---|---|---|
| Utilidade | 25 | 65 | 16,25 |
| Qualidade técnica | 20 | 80 | 16,0 |
| Manutenção | 15 | 55 | 8,25 |
| Integração | 15 | 50 | 7,5 |
| Economia | 15 | 55 | 8,25 |
| Segurança/doc | 10 | 80 | 8,0 |
| **Total** | | | **≈ 64** |
