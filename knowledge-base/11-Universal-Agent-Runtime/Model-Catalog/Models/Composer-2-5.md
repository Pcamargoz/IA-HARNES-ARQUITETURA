---
title: "Cursor Composer 2.5"
type: model-card
status: active
category: runtime
updated: 2026-10-29
tags: [ai-agent-ecosystem, runtime, model-card]
model_id: "composer-2.5"
provider: "Cursor"
access_path: ["cursor-agent"]
adapter: cursor-agent
layer: core
tier: balanced
availability: available
context_window: "não verificado"
cost_class: "pool-semanal (Cursor)"
strengths: ["modelo próprio do Cursor, barato no pool", "edição rápida de código"]
weaknesses: ["sem número em AA/LMArena nesta data", "plano do Pedro não verificado"]
data_policy:
  trains_on_inputs: "depende do Privacy Mode do Cursor (desligado = Cursor pode usar para treino)"
  retention: "conforme Privacy Mode"
  opt_out_confirmed: false
  opt_out_status: "Pedro não sabe se o treino está desligado (29/10/2026) — Cofre bloqueado até confirmação"
cofre_allowed: "apos-privacy-mode"
local: false
verified_at: 2026-10-29
sources: ["https://cursor.com/docs/models", "https://cursor.com/data-use", "CLI no Mac do Pedro, 29/10/2026 (--list-models / opencode models / ollama list / qwen --help)"]
---
# Cursor Composer 2.5

Ficha do [[Model-Catalog]] — fotografia de 2026-10-29 (revisão mensal). Camada **core**, tier `balanced`, disponibilidade `available`.

## Quando usar
Terceiro acesso quando Claude e Codex estão sem cota; edições pequenas.

## Quando não usar
Decisões de arquitetura.

## Números (datados)
Sem ranking público verificado em 29/10/2026. Preço de API (referência, [[Model-Pricing]]): US$ 0,5 / 2,5. Consultado em 29/10/2026.

## Dados
Treina com entradas: depende do Privacy Mode do Cursor (desligado = Cursor pode usar para treino). Retenção: conforme Privacy Mode. Cofre: `apos-privacy-mode` — ver regra D2 no [[Model-Catalog]]. Pedro não sabe se o treino está desligado (29/10/2026) — Cofre bloqueado até confirmação.

## Fontes
- https://cursor.com/docs/models
- https://cursor.com/data-use
- CLI no Mac do Pedro, 29/10/2026 (--list-models / opencode models / ollama list / qwen --help)
