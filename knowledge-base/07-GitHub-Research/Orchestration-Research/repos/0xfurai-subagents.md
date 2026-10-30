---
title: "0xfurai/claude-code-subagents"
type: repo-profile
status: researched
category: orchestration
updated: 2026-10-29
origem: "pesquisa de orquestração feita na box do Grok Bot (29/10/2026), importada sem alterar o conteúdo; só frontmatter e links ajustados"
reuso: "ficha é síntese própria; citações curtas e atribuídas; reutilize o repositório de origem apenas conforme a licença indicada em licenca"
tipo: ficha-repositorio
categoria: [colecao-de-subagentes, claude-code]
repo: https://github.com/0xfurai/claude-code-subagents
licenca: MIT
estrelas: 1020
ultimo_push: 2025-10-15
ultima_release: nenhuma
arquivado: false
nota: 54
verificado_em: 2026-10-29
tags: [subagentes, java, spring-boot, docker, desatualizado]
---

# 0xfurai/claude-code-subagents

> Importado em 29/10/2026 para [[MOC-Orchestration-Research]]. Conteúdo original preservado; ajustes: frontmatter `type/status/category` e links com nome em conflito.

> Ver [[Architecture-Comparison]] · [[Harness-Recommendations]]

## Metadados verificados
- ⭐ 1.020 · **último push 15/10/2025, há mais de um ano** · sem releases · MIT
- Estrutura: `agents/` com 138 arquivos `.md` (contados na listagem da API), README e LICENSE.
- Relevantes para o Pedro: `java-expert.md`, `spring-boot-expert.md`, `kotlin-expert.md` e `docker-expert.md`.

## Padrão de spec (`agents/spring-boot-expert.md`)
- Frontmatter: `name`, `description` e **`model: claude-sonnet-4-20250514`**, um ID de modelo fixo e datado, sem `tools:`. Sem a lista de ferramentas, o subagente herda todas, o que contraria o mínimo privilégio.
- Corpo em 4 seções fixas: *Focus Areas*, *Approach*, *Quality Checklist* e *Output*. Curto e barato em tokens, mas genérico (ex.: *"Use opinionated defaults provided by Spring Boot"*).

## Avaliação
- Ponto forte: formato enxuto, fácil de usar como esqueleto.
- Pontos fracos: manutenção parada, modelo fixo e datado, sem ferramentas restritas, sem protocolo de handoff e sem critério de conclusão verificável.
- Aderência: baixa. Serve como exemplo do que **não** fazer em relação a model pinning e tools.

## Nota
| Critério | Peso | Sub | Pts |
|---|---|---|---|
| Utilidade | 25 | 55 | 13,75 |
| Qualidade técnica | 20 | 50 | 10,0 |
| Manutenção | 15 | 35 | 5,25 |
| Integração | 15 | 75 | 11,25 |
| Economia | 15 | 60 | 9,0 |
| Segurança/doc | 10 | 50 | 5,0 |
| **Total** | | | **≈ 54** |
