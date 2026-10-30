---
title: "VoltAgent/awesome-claude-code-subagents"
type: repo-profile
status: researched
category: orchestration
updated: 2026-10-29
origem: "pesquisa de orquestração feita na box do Grok Bot (29/10/2026), importada sem alterar o conteúdo; só frontmatter e links ajustados"
reuso: "ficha é síntese própria; citações curtas e atribuídas; reutilize o repositório de origem apenas conforme a licença indicada em licenca"
tipo: ficha-repositorio
categoria: [colecao-de-subagentes, claude-code, meta-orquestracao]
repo: https://github.com/VoltAgent/awesome-claude-code-subagents
licenca: MIT
estrelas: 26186
ultimo_push: 2026-10-11
ultima_release: nenhuma
arquivado: false
nota: 76
verificado_em: 2026-10-29
tags: [subagentes, templates, spring-boot, tools-por-papel]
---

# VoltAgent / awesome-claude-code-subagents

> Importado em 29/10/2026 para [[MOC-Orchestration-Research]]. Conteúdo original preservado; ajustes: frontmatter `type/status/category` e links com nome em conflito.

> Ver [[Pattern-Catalog]] · [[Architecture-Comparison]] · [[Harness-Recommendations]]

## Metadados verificados
- "A collection of 100+ specialized Claude Code subagents" · ⭐ 26.186 · forks 3.006 · criado 30/07/2025 · push 11/10/2026 · sem releases
- Licença **MIT**. Há um instalador `install-agents.sh`, **não executado**.
- Clone `--depth 1`: 173 arquivos `.md` em `categories/01…10`.

## Padrões encontrados
1. **Template de subagente** (`CLAUDE.md`): frontmatter `name`, `description` (*"When this agent should be invoked (used by Claude Code for auto-selection)"*), `tools`, `model`, seguido de "Communication Protocol" e "Development Workflow".
2. **Ferramentas por tipo de papel** (`CLAUDE.md`, "Tool Assignment by Role Type"): revisores e auditores ficam em `Read, Grep, Glob`; pesquisa em `+ WebFetch, WebSearch`; quem escreve código em `Read, Write, Edit, Bash, Glob, Grep`. É uma matriz de mínimo privilégio pronta para adaptar.
3. **Modelo por agente:** contagem em todo o repositório de `sonnet` 109, `inherit` 26 e `haiku` 19 (grep em `model:`).
4. **Meta-orquestração** (`categories/09-meta-orchestration/`): agent-organizer, multi-agent-coordinator, task-distributor, workflow-orchestrator, error-coordinator, context-manager, memory-curator, knowledge-synthesizer e performance-monitor.
5. **Honestidade sobre o runtime** (`09-meta-orchestration/multi-agent-coordinator.md`): *"There is **no runtime message bus in this repo**. Subagents in Claude Code coordinate two ways: through shared files ... and through the orchestrator"* e *"Do not invent throughput, latency, efficiency, or agent-count numbers."* Define um *single writer per file*, escrita em temp seguida de swap, e trata ciclos como algo a quebrar antes da execução.
6. **Anti-padrão ainda presente:** 130 agentes mantêm uma "Communication Protocol" com JSON fictício enviado a um `context-manager`. Exemplo em `02-language-specialists/spring-boot-engineer.md`: `{"requesting_agent": "spring-boot-engineer", "request_type": "get_spring_context", ...}`. Não existe destinatário real, e isso gasta tokens com uma cerimônia inexistente.

## Pontos fortes
- Tem agentes prontos para o stack: `spring-boot-engineer` (`model: sonnet`, tools de escrita) e `java-architect`.
- Os agentes de meta-orquestração foram reescritos com regras de honestidade aproveitáveis.

## Pontos fracos
- Qualidade irregular entre agentes, com o protocolo JSON fictício em cerca de 130 arquivos.
- Prompts longos, com checklists extensos, o que custa tokens a cada invocação.

## Aderência
Média-alta como **fonte de templates por papel**, desde que se removam as seções de protocolo fictício.

## Nota
| Critério | Peso | Sub | Pts |
|---|---|---|---|
| Utilidade | 25 | 80 | 20,0 |
| Qualidade técnica | 20 | 70 | 14,0 |
| Manutenção | 15 | 75 | 11,25 |
| Integração | 15 | 90 | 13,5 |
| Economia | 15 | 70 | 10,5 |
| Segurança/doc | 10 | 70 | 7,0 |
| **Total** | | | **≈ 76** |
