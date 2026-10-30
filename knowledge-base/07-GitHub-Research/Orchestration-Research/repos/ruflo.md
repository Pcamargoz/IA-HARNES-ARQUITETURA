---
title: "ruvnet/ruflo (antigo claude-flow)"
type: repo-profile
status: researched
category: orchestration
updated: 2026-10-29
origem: "pesquisa de orquestração feita na box do Grok Bot (29/10/2026), importada sem alterar o conteúdo; só frontmatter e links ajustados"
reuso: "ficha é síntese própria; citações curtas e atribuídas; reutilize o repositório de origem apenas conforme a licença indicada em licenca"
tipo: ficha-repositorio
categoria: [meta-harness, swarm, memoria-vetorial, mcp]
repo: https://github.com/ruvnet/ruflo
licenca: MIT
estrelas: 80137
ultimo_push: 2026-10-29
ultima_release: v3.64.0 (2026-10-29)
arquivado: false
renomeado_de: ruvnet/claude-flow
nota: 68
verificado_em: 2026-10-29
tags: [swarm, hierarchical, model-routing, anti-drift, risco]
---

# ruflo (ex-claude-flow)

> Importado em 29/10/2026 para [[MOC-Orchestration-Research]]. Conteúdo original preservado; ajustes: frontmatter `type/status/category` e links com nome em conflito.

> Ver [[Pattern-Catalog]] · [[Architecture-Comparison]] · [[Harness-Recommendations]]

## Metadados verificados
- ⭐ 80.137 · push 29/10/2026 · release mais recente v3.64.0 (29/10/2026)
- **Renomeação:** o `package.json` mantém `"name": "claude-flow"`, `version 3.64.0` e homepage `github.com/ruvnet/claude-flow`; o andyrewlee confirma *"Formerly claude-flow"*.
- Licença **MIT**.
- Clone `--depth 1`: `CLAUDE.md` com **1.560 linhas**, `AGENTS.md` com 707, `SKILL.md` e `.claude/agents/` com 108 arquivos .md.

## Padrões encontrados
1. **Regras comportamentais curtas no topo** (`CLAUDE.md`): *"Do what has been asked; nothing more, nothing less"* e *"Never continuously check status after spawning a swarm — wait for results"*.
2. **Separar coordenação de execução:** *"Ruflo is the coordination ledger and policy decision point. Claude Code executes code"*. Estados distintos: *"registered, configured, reachable, healthy, and authorized"*.
3. **Loop operacional:** *"recall → inspect → route → plan → execute → test → validate → benchmark → optimize → receipt → handoff → separately authorized publish"*.
4. **Isolamento de escrita:** *"Never allow two writers in one worktree. Give every writing agent an isolated worktree and explicit file ownership"*, e *"Only the integration owner edits shared manifests and lockfiles"*.
5. **Limite à auto-evolução:** sistemas de aprendizado *"cannot self-promote or expand tools, network, secrets, spend, concurrency, or release authority"*. É um bom princípio de governança.
6. **Roteamento em 3 tiers** (ADR-026/143): tier 1 é codemod determinístico sem LLM (`var-to-const` etc.), tier 2 é Haiku e tier 3 é Sonnet/Opus. A ideia de *"$0, no LLM"* para transformações determinísticas vale a pena.
7. **Anti-drift:** topologia `hierarchical`, `maxAgents` 6 a 8 e uma tabela de composição por tipo de tarefa (ex.: Bug Fix com coordinator, researcher, coder e tester).
8. `claude -p --max-budget-usd 0.50` aparece como teto de custo por invocação. Não verifiquei se a flag existe na versão do Claude Code do Pedro.

## Pontos fracos e riscos
- **Contexto inchado:** o `CLAUDE.md` com 1.560 linhas contradiz o princípio de mapa curto (compare com [[wshobson-agents-orquestracao|wshobson-agents]]).
- **Números não verificáveis:** *"Optimal config (100% success rate)"* e uma tabela de economia (*"ReasoningBank retrieval -32%"*, *"Cache (95% hit rate) -10%"*) sem método publicado no trecho lido. Tratar como marketing.
- **Explosão de agentes:** *"AUTO-INVOKE SWARM when task involves: Multiple files (3+)"*, um gatilho agressivo para custo.
- **Higiene operacional:** o `CLAUDE.md` público descreve o procedimento interno de publicação no npm, incluindo um comando `gcloud secrets versions access ... NPM_TOKEN`. Não vi um valor de segredo, mas é instrução operacional sensível dentro de um arquivo de contexto de agente.
- Muitas peças (AgentDB, neural, federation, hive-mind, consensus raft), o que aumenta a superfície de manutenção.

## Aderência
Baixa-média. **Adaptar princípios** (itens 2, 4, 5 e 6) e **evitar a instalação** no Mac Intel do Pedro até medir. A dependência de muitas peças nativas (Rust/WASM) não foi verificada no Mac Intel.

## Nota
| Critério | Peso | Sub | Pts |
|---|---|---|---|
| Utilidade | 25 | 70 | 17,5 |
| Qualidade técnica | 20 | 60 | 12,0 |
| Manutenção | 15 | 90 | 13,5 |
| Integração | 15 | 75 | 11,25 |
| Economia | 15 | 60 | 9,0 |
| Segurança/doc | 10 | 45 | 4,5 |
| **Total** | | | **≈ 68** |
