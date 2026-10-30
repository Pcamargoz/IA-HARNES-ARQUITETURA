---
title: "DeepSeek V4.1 Flash Free (OpenCode Zen)"
type: model-card
status: active
category: runtime
updated: 2026-10-29
tags: [ai-agent-ecosystem, runtime, model-card]
model_id: "deepseek-v4.1-flash-free"
provider: "DeepSeek via OpenCode Zen"
access_path: ["opencode"]
adapter: opencode
layer: core
tier: small
availability: free-limited-time
context_window: "não verificado"
cost_class: "gratis (tempo limitado)"
strengths: ["melhor open-weights do AA nesta data", "zero-retention e sem treino (docs Zen)"]
weaknesses: ["grátis por tempo limitado", "DeepSeek V4 Flash foi descontinuado em 26/10/2026 — a família muda rápido"]
data_policy:
  trains_on_inputs: false
  retention: "zero-retention (docs do OpenCode Zen)"
  opt_out_confirmed: "n/a"
cofre_allowed: "sim-internal"
local: false
verified_at: 2026-10-29
sources: ["https://opencode.ai/docs/zen/", "https://artificialanalysis.ai/leaderboards/models", "CLI no Mac do Pedro, 29/10/2026 (--list-models / opencode models / ollama list / qwen --help)"]
---
# DeepSeek V4.1 Flash Free (OpenCode Zen)

Ficha do [[Model-Catalog]] — fotografia de 2026-10-29 (revisão mensal). Camada **core**, tier `small`, disponibilidade `free-limited-time`.

## Quando usar
Código moderado e revisão leve sem gastar cota.

## Quando não usar
Dados sensitive; decisões críticas.

## Números (datados)
AA Index (DeepSeek V4.1 Flash, max): 32 — melhor modelo de pesos abertos no índice. Preço de API (referência, [[Model-Pricing]]): grátis no OpenCode. Consultado em 29/10/2026.

## Dados
Treina com entradas: False. Retenção: zero-retention (docs do OpenCode Zen). Cofre: `sim-internal` — ver regra D2 no [[Model-Catalog]].

## Fontes
- https://opencode.ai/docs/zen/
- https://artificialanalysis.ai/leaderboards/models
- CLI no Mac do Pedro, 29/10/2026 (--list-models / opencode models / ollama list / qwen --help)
