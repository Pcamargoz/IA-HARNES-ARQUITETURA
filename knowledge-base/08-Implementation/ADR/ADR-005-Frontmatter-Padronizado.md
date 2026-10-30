---
title: "ADR-005 — Frontmatter padronizado"
type: adr
status: accepted
date: 2026-10-29
updated: 2026-10-29
tags: [ai-agent-ecosystem, adr, frontmatter]
---
# ADR-005 — Frontmatter padronizado

## Decisão
Toda nota da KB tem `title`, `type`, `status`, `updated`, `tags`. Notas de ferramenta (`type: tool`) também têm `category`, `score`, `verified_at`, `integration`, `license`, `repo`, `adoption`.

| Campo | Valores |
|---|---|
| type | tool, moc, catalog, guide, architecture, proposal, adr, experiment, validation, research-log, comparison, methodology, roadmap, dashboard, inventory, changelog, reference; desde 29/10 (área 10 e pesquisa de orquestração): agent-spec, policy, procedure, template, workflow-template, metric-catalog, telemetry-schema, repo-profile, research-synthesis, research-recommendation; desde 29/10 (catálogo de modelos): model-catalog (com `snapshot_date`, `review_every_days`), model-card (com `model_id`, `provider`, `access_path`, `layer`, `tier`, `availability`, `context_window`, `cost_class`, `strengths`, `weaknesses`, `data_policy`, `cofre_allowed`, `local`, `sources`); desde 30/10: prompt (prompts de bootstrap e de time em 00-Dashboard) |
| status | top10, radar, discarded, experimental (ferramentas; `experimental` = candidata a experimento, desde 29/10); active, proposed, accepted, superseded, planned, done (demais); implemented, planned, conceptual (agent-spec — ver [[ADR-008-Registro-de-Agentes-com-Status]]); researched (fichas de pesquisa) |
| category | mcp-server, agent-skills, orchestration, framework-java, protocol, memory, token-optimization, ... |

## Motivo
O MCP filtra por `type`/`status`/`category`/`tag` (`search_knowledge`, `find_mcp_servers`, `recommend_integration`). A próxima etapa (10-Multi-Agent-Orchestration) adicionou `agent-spec`, `policy` (com `policy_area`), `workflow-template` (com `task_types`/`triggers`), `metric-catalog` e `telemetry-schema` — as 8 tools de orquestração do MCP leem esses campos. O indexador também aceita `tipo`/`categoria`, comuns no Cofre.
