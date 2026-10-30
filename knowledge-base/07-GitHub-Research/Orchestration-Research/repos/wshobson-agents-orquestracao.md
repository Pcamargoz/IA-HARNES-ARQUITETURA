---
title: "wshobson/agents"
type: repo-profile
status: researched
category: orchestration
updated: 2026-10-29
origem: "pesquisa de orquestração feita na box do Grok Bot (29/10/2026), importada sem alterar o conteúdo; só frontmatter e links ajustados"
reuso: "ficha é síntese própria; citações curtas e atribuídas; reutilize o repositório de origem apenas conforme a licença indicada em licenca"
tipo: ficha-repositorio
categoria: [subagentes, skills, plugins, multi-harness]
repo: https://github.com/wshobson/agents
licenca: MIT
estrelas: 41988
ultimo_push: 2026-10-26
ultima_release: nenhuma (API /releases retornou lista vazia)
arquivado: false
nota: 89
verificado_em: 2026-10-29
tags: [orquestracao, claude-code, subagentes, skills, governanca]
---

# wshobson/agents

> Importado em 29/10/2026 para [[MOC-Orchestration-Research]]. Conteúdo original preservado; ajustes: frontmatter `type/status/category` e links com nome em conflito.

> Ficha de [[Architecture-Comparison]] · padrões em [[Pattern-Catalog]] · aplicação em [[Harness-Recommendations]]

## Metadados verificados (API GitHub, 29/10/2026)
- Descrição: "Multi-harness agentic plugin marketplace for Claude Code, Codex, Cursor, OpenCode, GitHub Copilot, Google Antigravity, and Pi"
- ⭐ 41.988 · forks 4.443 · criado 24/07/2025 · último push 26/10/2026 · não arquivado
- Nenhuma release publicada no GitHub. O projeto evolui por commits na `main`, e os manifests de plugin trazem versões próprias, que não verifiquei.
- Licença: **MIT** → permite copiar, adaptar e redistribuir prompts e código, **mantendo o aviso de copyright e a licença** nos trechos copiados.

## Estrutura analisada (clone `--depth 1`)
- `AGENTS.md` (84 linhas), com `CLAUDE.md` como symlink para ele; `ARCHITECTURE.md`; `docs/` (agents, agent-skills, authoring, harnesses, plugin-eval…)
- `plugins/<nome>/{agents/*.md, commands/*.md, skills/<n>/SKILL.md}`: 92 plugins locais, 202 agentes e 185 skills, segundo o próprio AGENTS.md
- Plugins relevantes: `agent-teams` (team-lead, team-implementer, team-reviewer, team-debugger), `conductor` (Context → Spec & Plan → Implement), `agent-orchestration` (context-manager), `review-agent-governance` e `protect-mcp` (política Cedar + recibos assinados), `plugin-eval`, `jvm-languages/agents/java-pro.md`

## Padrões encontrados
1. **AGENTS.md como mapa, não enciclopédia.** Trecho de `AGENTS.md`: *"This file should never grow beyond ~150 lines"* e *"this file is a map, not an encyclopedia"*. Os detalhes ficam em `docs/` e nas skills, carregadas sob demanda.
2. **Divulgação progressiva em todos os níveis** (`ARCHITECTURE.md`, invariante 5): arquivos de contexto com até cerca de 150 linhas e corpo de skill com até cerca de 8 KB; o excesso vai para `references/details.md`.
3. **Fonte única de verdade + adaptadores.** Os agentes são escritos uma vez, no formato do Claude Code, e `tools/adapters/*.py` geram as versões para os outros harnesses. Uma regra explícita proíbe editar à mão os arquivos gerados.
4. **Frontmatter de agente:** `name`, `description` ("Use PROACTIVELY when…"), `model: fable|opus|sonnet|haiku|inherit`, `tools:` opcional e `color:`. Exemplo em `plugins/agent-teams/agents/team-lead.md`: `tools: Read, Glob, Grep, Bash, Agent, TeamCreate, TeamDelete, TaskCreate, TaskList, TaskGet, TaskUpdate, SendMessage`.
5. **Roteamento de modelo por tier** (`ARCHITECTURE.md`, "Model tiers"): Opus para arquitetura, segurança e revisão; `inherit` para tarefas complexas; Sonnet para docs, testes e debug; Haiku para operações rápidas.
6. **Posse exclusiva de arquivos** (`plugins/agent-teams/skills/parallel-feature-development/references/file-ownership.md`): *"No file appears in multiple clusters"* e *"Never: Let both modify the same file simultaneously"*. Os tipos compartilhados ficam com o lead.
7. **Team-lead:** decompõe o trabalho em 2 a 5 teammates, monta o grafo de dependências (`blockedBy/blocks`) e cuida de shutdown gracioso (`/team-shutdown`).
8. **Conductor:** artefatos persistentes `product.md`, `tech-stack.md`, `workflow.md` e `tracks/<id>/{spec.md, plan.md}`, metadados em `track-metadata.json` (`id, type, status, spec_path, plan_path`) e revert semântico por track.
9. **Governança executável:** `review-agent-governance` usa um hook `PreToolUse` que avalia uma política Cedar e bloqueia com exit 2 sem flag de aprovação humana. O `PostToolUse` grava um recibo Ed25519 em `receipts.jsonl`. O próprio README avisa que *"a deleted line goes undetected"* (os recibos não formam cadeia).
10. **Avaliação de qualidade:** `plugin-eval` combina lint estático, LLM judge e Monte Carlo, e reconhece que as duas últimas camadas são *"experimental, not validated against human labels"*.

## Pontos fortes
- O exemplo mais maduro de **economia de contexto por design** entre os analisados, com limites numéricos explícitos e verificados por CI (`make validate`, `make garden`).
- Gates mecânicos com dica de correção, fonte única e adaptadores. Serve de referência direta para o Agent Registry do Pedro.
- Tem agentes JVM (`java-pro`, Spring Boot 3.x) e um padrão de governança com hooks.

## Pontos fracos
- Volume alto (202 agentes). Instalar tudo infla os metadados de descrição carregados. É preciso escolher.
- Alguns prompts são genéricos e "elite" (ex.: `agent-orchestration/agents/context-manager.md`, com listas de tecnologias sem procedimento).
- Usa o alias `model: fable` (descrito em `docs/agents.md` como tier acima do Opus e opt-in), que pode não existir no plano do Pedro. **Não verificado** na conta dele.

## Aderência ao cenário do Pedro
Alta. Feito para Claude Code, tem agentes Java, o padrão AGENTS.md/CLAUDE.md casa com o Harness-Architecture e o Conductor se parece com o fluxo spec-driven pedido em `05-Workflows/SPEC-DRIVEN-DEVELOPMENT.md`.

## Nota (0–100)
| Critério | Peso | Sub-nota | Pontos |
|---|---|---|---|
| Utilidade | 25 | 90 | 22,5 |
| Qualidade técnica | 20 | 90 | 18,0 |
| Manutenção | 15 | 90 | 13,5 |
| Integração | 15 | 90 | 13,5 |
| Economia de recursos | 15 | 85 | 12,75 |
| Segurança/doc | 10 | 85 | 8,5 |
| **Total** | | | **≈ 89** (88,75) |

## Lacunas de verificação
- Não executei `make validate`, os hooks Cedar nem o `plugin-eval`. Os scripts não foram rodados, por política.
- Contagens (92/202/185) foram tiradas do AGENTS.md, não recontadas (`ls plugins` mostrou 92 diretórios).
