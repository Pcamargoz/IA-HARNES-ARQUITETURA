---
title: "Gemini 4 Argon"
type: model-card
status: active
category: runtime
updated: 2026-10-29
tags: [ai-agent-ecosystem, runtime, model-card]
model_id: "gemini-4-argon"
provider: "Google (via Cursor)"
access_path: ["cursor-agent (crédito)"]
adapter: cursor-agent
layer: core
tier: frontier
availability: paid-credit
context_window: "não verificado"
cost_class: "credito-pre-pago (Cursor Premium+ ou pool legado)"
strengths: ["terceiro fornecedor para revisão cruzada"]
weaknesses: ["cobrado de crédito; Gemini CLI ausente no Mac", "Gemini 4 Carbon (o 1º do AA) não aparece na lista do Cursor"]
data_policy:
  trains_on_inputs: "depende do Privacy Mode do Cursor (desligado = Cursor pode usar para treino)"
  retention: "conforme Privacy Mode"
  opt_out_confirmed: false
  opt_out_status: "Pedro não sabe se o treino está desligado (29/10/2026) — Cofre bloqueado até confirmação"
cofre_allowed: "apos-privacy-mode"
local: false
verified_at: 2026-10-29
sources: ["https://cursor.com/docs/models", "https://artificialanalysis.ai/leaderboards/models", "https://lmarena.ai/leaderboard", "CLI no Mac do Pedro, 29/10/2026 (--list-models / opencode models / ollama list / qwen --help)"]
---
# Gemini 4 Argon

Ficha do [[Model-Catalog]] — fotografia de 2026-10-29 (revisão mensal). Camada **core**, tier `frontier`, disponibilidade `paid-credit`.

## Quando usar
Revisão de 3º fornecedor quando Claude e OpenAI discordam (com aprovação de gasto).

## Quando não usar
Rotina.

## Números (datados)
AA Index: 50 (high). LMArena Agents: 7º, 10,73%. Preço de API (referência, [[Model-Pricing]]): preço de lista da API (não verificado). Consultado em 29/10/2026.

## Dados
Treina com entradas: depende do Privacy Mode do Cursor (desligado = Cursor pode usar para treino). Retenção: conforme Privacy Mode. Cofre: `apos-privacy-mode` — ver regra D2 no [[Model-Catalog]]. Pedro não sabe se o treino está desligado (29/10/2026) — Cofre bloqueado até confirmação.

## Fontes
- https://cursor.com/docs/models
- https://artificialanalysis.ai/leaderboards/models
- https://lmarena.ai/leaderboard
- CLI no Mac do Pedro, 29/10/2026 (--list-models / opencode models / ollama list / qwen --help)
