---
title: "Agent-Knowledge-MCP — referência das tools"
type: reference
status: active
updated: 2026-10-29
tags: [ai-agent-ecosystem, mcp, agent-knowledge-mcp, reference]
---
# Agent-Knowledge-MCP — referência das tools

Todas: somente leitura (readOnlyHint=true, destructiveHint=false, idempotentHint=true, openWorldHint=false). Saída em texto com a **fonte** (`raiz:caminho`) e seção/linhas.

| Tool | Argumentos principais | Retorna |
|---|---|---|
| `search_knowledge` | `query`, `limit` (5, máx. 20), `root`, `path_prefix`, `type`, `status`, `category`, `tag`, `format` text/json | até N documentos, melhor seção, trecho curto, score |
| `get_document` | `path` (`raiz:caminho` ou caminho único), `heading`, `start_line`, `max_lines`, `max_chars`, `outline_only`, `include_links` | conteúdo parcial com fonte e linhas; sumário; wikilinks e URLs |
| `list_agent_skills` | `query`, `source` all/skill_files/kb_packages, `limit` | arquivos `SKILL.md` + pacotes de skills da KB |
| `find_mcp_servers` | `query`, `status`, `limit` | notas `type: tool` de MCP com nota, status, integração |
| `get_architecture` | `scope` ecosystem/harness-current/harness-proposal/harness-source/mcp, `heading`, `full`, `max_chars` | sumário por padrão; seção ou documento sob pedido |
| `recommend_integration` | `need`, `limit` (3), `status` | ferramentas ranqueadas (relevância × nota), integração, “por quê”, nota fonte |
| `get_research_history` | `heading`, `limit`, `max_chars` | rodadas de pesquisa, mais recente primeiro |
| `get_token_optimization` | `topic` overview/budget/routing/compression, `heading`, `full`, `max_chars` | orientação de tokens |
| `get_implementation_roadmap` | `phase` (ex.: F1), `heading`, `full`, `max_chars` | fases do roadmap |
| `knowledge_status` | `reindex` | raízes, contagens, avisos, configuração efetiva (sem segredos) |


### Orquestração (v0.2.0)
Leem [[MOC-Multi-Agent-Orchestration]] pelo frontmatter (sem caminhos fixos) e `Governance/decisions.md` do Harness. Pontuação determinística (fração de termos da tarefa presentes), sem LLM.

| Tool | Argumentos principais | Retorna |
|---|---|---|
| `get_orchestrator_policy` | `area` (padrão orchestrator; bootstrap, delegation, handoff, verification, hitl, communication, context, governance, routing, execution), `section`, `max_chars` | sem `section`: notas da área e suas seções; com `section`: só a seção |
| `list_registered_agents` | `status` all/implemented/planned/conceptual, `role`, `query`, `limit`, `format` | metadados dos agentes e contagem por status; `score` por aderência à tarefa |
| `get_agent_specification` | `name`, `heading`, `include_body`, `format` | ferramentas, proibidas, skills, orçamento, autonomia, evidência do status, corpo |
| `find_relevant_skills` | `task`, `agent`, `limit`, `format` | SKILL.md e pacotes da KB ranqueados; quem cita cada skill; skills citadas sem SKILL.md |
| `find_workflow_template` | `task`, `task_type`, `name`, `limit`, `format` | ranking de templates e etapas do melhor; sem match → workflow padrão do Harness |
| `get_execution_policy` | `section` all/limites/autonomia/irreversiveis/orcamentos/parada, `agent`, `max_chars` | seção da política + orçamento/autonomia/ferramentas do agente |
| `get_metric_definitions` | `metric`, `include_telemetry_schema`, `format` | tabela de métricas estruturada; campos do JSONL |
| `get_architecture_decisions` | `id` (kb:ADR-NNN, harness:ADR-NNN, ADR-NNN), `source`, `status`, `query`, `limit`, `format` | ADRs da KB e do Harness; leitura completa por id |

### Runtime universal (v0.3.0)
Leem [[MOC-Universal-Agent-Runtime]] (notas com `runtime_component`, `type: adapter-spec`, `type: routing-policy`) e o manifest de `npm run detect-env` (`AKM_RUNTIME_MANIFEST`, padrão `runtime-output/environment-manifest.json`). Não executam agentes.

| Tool | Argumentos principais | Retorna |
|---|---|---|
| `get_runtime_architecture` | `component` (overview, port, manifest, detection, registry, router, policies, tokens, metrics, communication, maestri, …), `section`, `max_chars` | sem `component`: componentes e seções; com `component`: a nota ou uma seção |
| `list_agent_adapters` | `capability`, `available_only`, `format` | adapters do código e da KB cruzados com o ambiente: instalado, versão, login, status `implemented`/`spec-only`/`planned` |
| `get_model_routing_policy` | `complexity`, `section`, `compare` (`name`, `cost_per_attempt`, `success_rate`, `rework_cost`, `max_attempts`), `task`, `view` policy/catalog/matrix/rules/all, `local`, `layer`, `format` | fatores, tiers, escalonamento; `compare` calcula custo esperado por sucesso (estimativa com os valores dados); `task` devolve a linha da matriz de [[Model-Catalog]] (primário/fallback/barato-local) com as fichas citadas, regras duras e cadeia de cota; `view` lista fichas, matriz ou regras; avisa quando a fotografia vence |
| `get_environment_capabilities` | `section` summary/host/clis/mcp/apps/services/capabilities/all, `format` | ambiente detectado e as 7 capacidades com evidência; sem manifest → erro pedindo `npm run detect-env` |

Recursos: `akm://kb/index` (índice da KB) e `akm://kb/status` (estatísticas em JSON).

## Erros
Argumento inválido → erro MCP `-32602`. Acesso negado/documento inexistente → resultado com `isError: true` e mensagem em pt-BR; o servidor segue funcionando.
