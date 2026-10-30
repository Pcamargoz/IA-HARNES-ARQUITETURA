---
title: "GLM-5.3-Flash Free (OpenCode Zen)"
type: model-card
status: active
category: runtime
updated: 2026-10-29
tags: [ai-agent-ecosystem, runtime, model-card]
model_id: "glm-5.3-flash-free"
provider: "Zhipu via OpenCode Zen"
access_path: ["opencode"]
adapter: opencode
layer: core
tier: small
availability: free-limited-time
context_window: "não verificado"
cost_class: "gratis (tempo limitado)"
strengths: ["zero-retention e sem treino (docs Zen)", "não gasta cota dos planos"]
weaknesses: ["grátis por tempo limitado", "só dentro do OpenCode", "limite de taxa não publicado"]
data_policy:
  trains_on_inputs: false
  retention: "zero-retention (docs do OpenCode Zen)"
  opt_out_confirmed: "n/a"
cofre_allowed: "sim-internal"
local: false
verified_at: 2026-10-29
sources: ["https://opencode.ai/docs/zen/", "https://artificialanalysis.ai/leaderboards/models", "CLI no Mac do Pedro, 29/10/2026 (--list-models / opencode models / ollama list / qwen --help)"]
---
# GLM-5.3-Flash Free (OpenCode Zen)

Ficha do [[Model-Catalog]] — fotografia de 2026-10-29 (revisão mensal). Camada **core**, tier `small`, disponibilidade `free-limited-time`.

## Quando usar
Resumo, triagem e código simples quando os planos estão sem cota.

## Quando não usar
Dados sensitive; tarefas complexas.

## Números (datados)
AA Index (GLM-5.3-Flash): 28. Preço de API (referência, [[Model-Pricing]]): grátis no OpenCode. Consultado em 29/10/2026.

## Dados
Treina com entradas: False. Retenção: zero-retention (docs do OpenCode Zen). Cofre: `sim-internal` — ver regra D2 no [[Model-Catalog]].

## Fontes
- https://opencode.ai/docs/zen/
- https://artificialanalysis.ai/leaderboards/models
- CLI no Mac do Pedro, 29/10/2026 (--list-models / opencode models / ollama list / qwen --help)
