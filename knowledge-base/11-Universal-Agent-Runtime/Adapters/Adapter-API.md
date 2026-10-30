---
title: "Adapter API (HTTP)"
type: adapter-spec
runtime_component: adapter-api
adapter: api-http
kind: api
impl_status: planned
tool_command: —
capabilities: [headless, structured_output, streaming, token_usage, cost_usd]
source: planejado
status: proposed
category: runtime
updated: 2026-10-29
tags: [ai-agent-ecosystem, runtime, adapter]
---
# Adapter API (HTTP)

**Status:** `planned`. Chamada direta à API do provedor (Anthropic, OpenAI) para tarefas sem ferramentas (classificar, resumir, extrair), com tokens e custo reportados pela própria API e preço de [[Model-Pricing]].

Requisitos antes de implementar: chave de API do Pedro (nunca lida de arquivo pelo runtime; passada pelo ambiente do processo com aprovação), orçamento por tarefa e aprovação. Fase P3 de [[Portability-Roadmap]].
