---
title: "anthropics/skills"
type: repo-profile
status: researched
category: orchestration
updated: 2026-10-29
origem: "pesquisa de orquestração feita na box do Grok Bot (29/10/2026), importada sem alterar o conteúdo; só frontmatter e links ajustados"
reuso: "ficha é síntese própria; citações curtas e atribuídas; reutilize o repositório de origem apenas conforme a licença indicada em licenca"
tipo: ficha-repositorio
categoria: [agent-skills, especificacao, exemplos-oficiais]
repo: https://github.com/anthropics/skills
licenca: "Mista por skill: Apache-2.0 na maioria; docx/pdf/pptx/xlsx proprietárias (source-available); sem LICENSE na raiz"
estrelas: 184787
ultimo_push: 2026-10-28
ultima_release: nenhuma (API /releases vazia)
arquivado: false
nota: 87
verificado_em: 2026-10-29
tags: [skills, progressive-disclosure, claude-code, claude-desktop, licenca]
---

# anthropics/skills

> Importado em 29/10/2026 para [[MOC-Orchestration-Research]]. Conteúdo original preservado; ajustes: frontmatter `type/status/category` e links com nome em conflito.

> Ver [[Pattern-Catalog]] · [[Architecture-Comparison]] · [[Harness-Recommendations]]

## Metadados verificados
- ⭐ 184.787 · forks 21.851 · criado 22/09/2025 · push 28/10/2026 · não arquivado · sem releases
- A API do GitHub não reporta licença (`license: null`), porque não há LICENSE na raiz.
- **Licença resolvida por skill** (`skills/*/LICENSE.txt`, conferida arquivo a arquivo):
  - **Apache-2.0:** academy-guide, algorithmic-art, brand-guidelines, canvas-design, claude-api, discernment-nudge, frontend-design, internal-comms, **mcp-builder**, **skill-creator**, slack-gif-creator, theme-factory, web-artifacts-builder, webapp-testing. Permite adaptar e redistribuir **com cópia da licença, aviso de mudanças e preservação de NOTICE**.
  - **Proprietária ("© 2025 Anthropic, PBC. All rights reserved")**: docx, pdf, pptx, xlsx. O README diz *"source-available, not open source"*. **Não copiar nem derivar**, só usar como referência de padrão.
  - `doc-coauthoring`: **sem LICENSE.txt**, situação não esclarecida. Tratar como não reutilizável.
- Isso encerra a divergência de licença registrada no levantamento anterior.

## Estrutura
- `skills/<nome>/SKILL.md` + `scripts/`, `references/`, `assets/`; `template/SKILL.md`; `spec/agent-skills-spec.md` aponta para https://agentskills.io/specification.
- Frontmatter mínimo (`template/SKILL.md`): `name`, `description` (*"Replace with description of the skill and when Claude should use it."*). O `mcp-builder` acrescenta `license: Complete terms in LICENSE.txt`.

## Padrões encontrados
1. **Divulgação progressiva em 3 níveis** (`skills/skill-creator/SKILL.md`, seção "Progressive Disclosure"): *"Metadata (name + description) - Always in context (~100 words)"*, *"SKILL.md body ... (<500 lines ideal)"* e *"Bundled resources - As needed"*. É a base de economia de tokens para skills.
2. **A descrição é o gatilho:** o `skill-creator` tem `scripts/improve_description.py` e evals para medir a precisão do acionamento.
3. **Loop de avaliação com subagentes:** `skill-creator/agents/{grader,comparator,analyzer}.md` + `scripts/run_eval.py`, `aggregate_benchmark.py`. É o padrão evaluator-optimizer aplicado a skills.
4. **`mcp-builder`:** guia de MCP em Python (FastMCP) ou TypeScript. Serve de referência direta para evoluir o `Agent-Knowledge-MCP`.
5. **Plugin marketplace:** `/plugin marketplace add anthropics/skills`, depois `document-skills` e `example-skills`.

## Pontos fortes
- É a fonte primária do formato SKILL.md, usado por Claude Code, Claude Desktop e outros harnesses (o wshobson faz o espelhamento).
- O formato é o mais econômico de todos, porque só o nome e a descrição ficam sempre no contexto.

## Pontos fracos
- Não há orquestração multiagente: skills são conhecimento, não coordenação.
- Licença heterogênea, que pede auditoria por skill. Disclaimer: *"provided for demonstration and educational purposes only"*.

## Aderência
Muito alta como **formato de spec de skill** para o Harness e para o MCP de conhecimento. O próprio cofre pode expor notas como "skills" com metadados primeiro.

## Nota
| Critério | Peso | Sub | Pts |
|---|---|---|---|
| Utilidade | 25 | 85 | 21,25 |
| Qualidade técnica | 20 | 90 | 18,0 |
| Manutenção | 15 | 85 | 12,75 |
| Integração | 15 | 95 | 14,25 |
| Economia | 15 | 90 | 13,5 |
| Segurança/doc (licença mista) | 10 | 70 | 7,0 |
| **Total** | | | **≈ 87** |

## Lacunas
- A especificação completa em agentskills.io não foi lida nesta sessão.
- Os scripts de eval não foram executados.
