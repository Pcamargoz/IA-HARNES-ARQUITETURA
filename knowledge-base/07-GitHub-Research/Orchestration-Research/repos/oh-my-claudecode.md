---
title: "Yeachan-Heo/oh-my-claudecode (OMC)"
type: repo-profile
status: researched
category: orchestration
updated: 2026-10-29
origem: "pesquisa de orquestração feita na box do Grok Bot (29/10/2026), importada sem alterar o conteúdo; só frontmatter e links ajustados"
reuso: "ficha é síntese própria; citações curtas e atribuídas; reutilize o repositório de origem apenas conforme a licença indicada em licenca"
tipo: ficha-repositorio
categoria: [orquestrador-claude-code, subagentes, skills, team-pipeline]
repo: https://github.com/Yeachan-Heo/oh-my-claudecode
licenca: MIT
estrelas: 40405
ultimo_push: 2026-10-29
ultima_release: v5.7.20 (2026-10-29)
arquivado: false
nota: 86
verificado_em: 2026-10-29
tags: [orquestracao, claude-code, main-orchestrator, verificacao, model-routing]
---

# oh-my-claudecode (OMC)

> Importado em 29/10/2026 para [[MOC-Orchestration-Research]]. Conteúdo original preservado; ajustes: frontmatter `type/status/category` e links com nome em conflito.

> Ver [[Pattern-Catalog]] · [[Architecture-Comparison]] · [[Harness-Recommendations]]

## Metadados verificados (API GitHub, 29/10/2026)
- "Teams-first Multi-agent orchestration for Claude Code" · ⭐ 40.405 · forks 3.611 · criado 09/01/2026 · push 29/10/2026 · não arquivado
- Release mais recente: v5.7.20 (29/10/2026), alinhada ao cabeçalho do `CLAUDE.md` ("OMC 5.7.20"). Cadência alta.
- Licença **MIT**: reutilização livre, mantendo o aviso de copyright.
- Leitura feita pelo conector GitHub (get_file_contents): `CLAUDE.md`, `AGENTS.md` (cerca de 415 linhas), `agents/verifier.md` e a listagem de `agents/` (19 papéis).

## Padrões encontrados (com caminhos)
1. **Prompt de orquestrador em blocos XML curtos** (`CLAUDE.md`): `<operating_principles>`, `<delegation_rules>`, `<model_routing>`, `<skills>`, `<verification>`, `<failure_mode_guards>`, `<execution_protocols>`, `<cancellation>`, `<worktree_paths>`. Cada bloco tem poucas linhas e o detalhe fica na skill `wiki`, carregada sob demanda.
2. **Regras de quando delegar** (`AGENTS.md` `<delegation_rules>`): delegar *"Multi-file implementations, refactors, debugging, reviews, planning, research, and verification"* e trabalhar direto só em *"trivial operations where delegation adds disproportionate overhead"*.
3. **Limite de paralelismo explícito:** *"up to 6 concurrent child agents"*. Cada filho tem contexto próprio: *"Each child has its own context window (not shared with parent)"* (`<child_agent_protocol>`).
4. **Injeção do papel por arquivo:** o pai lê `~/.codex/prompts/{role}.md` e passa o conteúdo na mensagem do `spawn_agent`. O registro de papéis fica separado do prompt principal.
5. **Pipeline canônico com máquina de estados** (`<team_pipeline>`): `team-plan -> team-prd -> team-exec -> team-verify -> team-fix (loop)`, com a regra *"The team-fix loop is bounded by max attempts; exceeding the bound transitions to failed"*. Estados terminais: `complete`, `failed` e `cancelled`, com retomada a partir do último estágio incompleto.
6. **Separação autor/revisor:** *"Never self-approve in the same active context"* (`CLAUDE.md` `<execution_protocols>`). O `agents/verifier.md` tem `disallowedTools: Write, Edit` e exige status VERIFIED/PARTIAL/MISSING para cada critério, com evidência fresca.
7. **Guardas contra conclusão falsa** (`<failure_mode_guards>`): *"No fake completion: TODO-style placeholder notes, test.skip/.only, stub tests ... are blockers, not evidence."*
8. **Roteamento de modelo:** `haiku` para buscas rápidas, `sonnet` para o padrão e `opus` para arquitetura. O verificador é dimensionado pelo tamanho da mudança (*"Small changes (<5 files, <100 lines): lightweight verifier"*; *">20 files: thorough verifier"*). A precedência de modelo é documentada em `<team_model_resolution>`.
9. **Estado persistente em `.omc/`:** `state/`, `notepad.md`, `project-memory.json`, `plans/`, `logs/` e `handoffs/`, além das ferramentas MCP `state_*`, `project_memory_*`, `notepad_*` e `trace_summary` (*"turn counts, timing, token usage"*).
10. **Kill switches:** `DISABLE_OMC` e `OMC_SKIP_HOOKS`, e a skill `cancel` limpa o estado.

## Pontos fortes
- Entre os repositórios analisados, é o prompt de Main Orchestrator mais próximo do que o Pedro quer: delegação, verificação independente, limites, estados e cancelamento.
- Os anti-padrões aparecem como regras: loop limitado, sem auto-aprovação e sem stubs.
- Trace de uso de tokens via MCP, ainda **não testado**.

## Pontos fracos
- Muitas palavras mágicas e modos (`autopilot`, `ralph`, `ultragoal`…), o que aumenta a superfície de comportamento implícito. O próprio `CLAUDE.md` lista 16 skills ou modos retirados na 5.0.0 ("removed, not aliased"), sinal de instabilidade de API.
- Hooks injetam `<system-reminder>`, o que conflita com harnesses que tratam esse marcador como sistema. (Hermes fora do escopo do ecossistema do Pedro.)
- O `AGENTS.md` mistura instruções para Codex (`~/.codex/prompts`) e Claude Code.
- A cadência de releases quase diária aumenta o risco de regressão.

## Aderência ao cenário
Alta para Claude Code. Média para Claude Desktop, que não usa hooks do Claude Code. O valor maior está em **adaptar os padrões**, não em instalar o plugin inteiro.

## Nota
| Critério | Peso | Sub | Pts |
|---|---|---|---|
| Utilidade | 25 | 90 | 22,5 |
| Qualidade técnica | 20 | 85 | 17,0 |
| Manutenção | 15 | 95 | 14,25 |
| Integração | 15 | 85 | 12,75 |
| Economia | 15 | 80 | 12,0 |
| Segurança/doc | 10 | 75 | 7,5 |
| **Total** | | | **≈ 86** |

## Lacunas
- Não instalei nem executei. A eficácia do `trace_summary` e do estado `.omc/` não foi testada.
- O README (43 KB) não foi lido por inteiro.
