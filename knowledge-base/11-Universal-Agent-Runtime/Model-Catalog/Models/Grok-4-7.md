---
title: "Grok 4.7"
type: model-card
status: active
category: runtime
updated: 2026-10-29
tags: [ai-agent-ecosystem, runtime, model-card]
model_id: "grok-4.7"
provider: "xAI (via Cursor)"
access_path: ["cursor-agent"]
adapter: cursor-agent
layer: core
tier: balanced
availability: available
context_window: "não verificado (varia por plano do Cursor)"
cost_class: "pool-semanal (Cursor)"
strengths: ["incluído no pool do Cursor (inclusive Plus)", "esforço low…xhigh"]
weaknesses: ["AA Index 35 (high): abaixo dos frontier"]
data_policy:
  trains_on_inputs: "depende do Privacy Mode do Cursor (desligado = Cursor pode usar para treino)"
  retention: "conforme Privacy Mode"
  opt_out_confirmed: false
  opt_out_status: "Pedro não sabe se o treino está desligado (29/10/2026) — Cofre bloqueado até confirmação"
cofre_allowed: "apos-privacy-mode"
local: false
verified_at: 2026-10-29
sources: ["https://cursor.com/docs/models", "https://artificialanalysis.ai/leaderboards/models", "CLI no Mac do Pedro, 29/10/2026 (--list-models / opencode models / ollama list / qwen --help)"]
---
# Grok 4.7

Ficha do [[Model-Catalog]] — fotografia de 2026-10-29 (revisão mensal). Camada **core**, tier `balanced`, disponibilidade `available`.

## Quando usar
Fallback geral no Cursor; pesquisa e rascunho.

## Quando não usar
Revisão crítica.

## Números (datados)
AA Index: 35 (high). Preço de API (referência, [[Model-Pricing]]): US$ 2 / 6. Consultado em 29/10/2026.

## Dados
Treina com entradas: depende do Privacy Mode do Cursor (desligado = Cursor pode usar para treino). Retenção: conforme Privacy Mode. Cofre: `apos-privacy-mode` — ver regra D2 no [[Model-Catalog]]. Pedro não sabe se o treino está desligado (29/10/2026) — Cofre bloqueado até confirmação.

## Fontes
- https://cursor.com/docs/models
- https://artificialanalysis.ai/leaderboards/models
- CLI no Mac do Pedro, 29/10/2026 (--list-models / opencode models / ollama list / qwen --help)
