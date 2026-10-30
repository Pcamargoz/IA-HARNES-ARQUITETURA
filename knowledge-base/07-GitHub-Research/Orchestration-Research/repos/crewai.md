---
title: "crewAIInc/crewAI"
type: repo-profile
status: researched
category: orchestration
updated: 2026-10-29
origem: "pesquisa de orquestração feita na box do Grok Bot (29/10/2026), importada sem alterar o conteúdo; só frontmatter e links ajustados"
reuso: "ficha é síntese própria; citações curtas e atribuídas; reutilize o repositório de origem apenas conforme a licença indicada em licenca"
tipo: ficha-repositorio
categoria: [framework-multiagente, role-based, hierarchical-process, flows]
repo: https://github.com/crewAIInc/crewAI
licenca: MIT
estrelas: 60262
ultimo_push: 2026-10-29
ultima_release: 1.15.33 (2026-10-29)
arquivado: false
nota: 74
verificado_em: 2026-10-29
tags: [orquestracao, python, crews, flows, guardrails]
---

# CrewAI

> Importado em 29/10/2026 para [[MOC-Orchestration-Research]]. Conteúdo original preservado; ajustes: frontmatter `type/status/category` e links com nome em conflito.

> Ver [[Pattern-Catalog]] · [[Architecture-Comparison]] · [[Harness-Recommendations]]

## Metadados verificados
- ⭐ 60.262 · forks 8.953 · criado 27/10/2023 · push 29/10/2026 · releases 1.15.31 a 1.15.33 entre 27 e 29/10/2026
- Licença **MIT**. Existe a oferta comercial CrewAI AMP, que não foi avaliada.

## O que li
- `AGENTS.md` (instruções de contribuição: DRY/YAGNI, *"Keep diffs as minimal as possible"*) e a documentação oficial de **Agents** e **Processes** (docs.crewai.com).

## Padrões encontrados
1. **Spec de agente declarativa** (`agents/<nome>.jsonc` + `crew.jsonc`, recomendado em projetos novos): `role`, `goal`, `backstory`, `llm`, `tools` e `settings`. É um formato de registro de agente legível e versionável.
2. **Limites de execução por agente** (doc Agents): `max_iter` (padrão 20), `max_execution_time`, `max_rpm`, `max_retry_limit` (padrão 2), `allow_delegation` (padrão **False**) e `max_reasoning_attempts`. São bons padrões de política.
3. **`function_calling_llm`:** um modelo mais barato só para chamadas de ferramenta (exemplo da doc: `"gpt-4o-mini"`). É roteamento de modelo dentro do próprio agente.
4. **`respect_context_window`** (padrão True) resume o histórico ao estourar a janela; com False, a execução para. A doc recomenda False para revisão de código e segurança: *"Prefer failure over incomplete analysis"*.
5. **Processos** (doc Processes): `sequential` e `hierarchical`, este exigindo `manager_llm` ou `manager_agent`. O gerente *"allocates tasks to agents based on their capabilities, reviews outputs, and assesses task completion"*.
6. **Execução de código:** `allow_code_execution` foi **depreciado** e o CodeInterpreterTool removido, com recomendação de sandbox dedicado (E2B/Modal).
7. `kickoff()` retorna `usage_metrics`, a contagem de tokens por execução.

## Pontos fortes
- Ótimo vocabulário de **contrato de agente** (role/goal/backstory/expected_output) e limites com padrões conservadores.
- Manutenção intensa, com documentação boa e traduzida (inclusive pt-BR, segundo o AGENTS.md).

## Pontos fracos
- Python, sem Java. Fora do Claude Code: o orquestrador vira um processo separado.
- O LLM padrão citado na doc ainda é `gpt-4`/`OPENAI_MODEL_NAME`, então Claude exige configuração.
- O modo hierárquico depende de um LLM gerente, e a qualidade da delegação varia com ele. Não testado.

## Aderência
Média. **Adotar o formato de spec e os limites** no Agent Registry; não adotar o runtime.

## Nota
| Critério | Peso | Sub | Pts |
|---|---|---|---|
| Utilidade | 25 | 65 | 16,25 |
| Qualidade técnica | 20 | 85 | 17,0 |
| Manutenção | 15 | 95 | 14,25 |
| Integração | 15 | 55 | 8,25 |
| Economia | 15 | 70 | 10,5 |
| Segurança/doc | 10 | 80 | 8,0 |
| **Total** | | | **≈ 74** |

## Lacunas
- Flows, guardrails de Task e memória não foram lidos em detalhe.
