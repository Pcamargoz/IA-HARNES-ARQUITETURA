---
title: "GPT-6.1 Terra"
type: model-card
status: active
category: runtime
updated: 2026-10-29
tags: [ai-agent-ecosystem, runtime, model-card]
model_id: "gpt-6.1-terra"
provider: "OpenAI"
access_path: ["codex"]
adapter: codex
plan: "ChatGPT Plus (confirmado pelo Pedro em 29/10/2026)"
layer: core
tier: balanced
availability: available
context_window: "não verificado"
cost_class: "cota-media-baixa (ChatGPT)"
strengths: ["rápido", "escrita", "trabalho visual/front"]
weaknesses: ["exige Codex CLI ≥ 0.159.0 (Mac: 0.166.0, ok)"]
data_policy:
  trains_on_inputs: "opt-out (Plus/Pro pessoal: ligado por padrão; Codex tem também 'Include environments')"
  retention: "não verificado para Codex CLI"
  opt_out_confirmed: false
  opt_out_status: "Pedro não sabe se o treino está desligado (29/10/2026) — Cofre bloqueado até confirmação"
cofre_allowed: "apos-opt-out"
local: false
verified_at: 2026-10-29
sources: ["https://developers.openai.com/codex/models", "https://learn.chatgpt.com/docs/pricing", "https://artificialanalysis.ai/leaderboards/models", "https://lmarena.ai/leaderboard"]
---
# GPT-6.1 Terra

Ficha do [[Model-Catalog]] — fotografia de 2026-10-29 (revisão mensal). Plano: ChatGPT Plus (confirmado pelo Pedro em 29/10/2026). Camada **core**, tier `balanced`, disponibilidade `available`.

## Quando usar
Front React/CSS, textos, docs quando Sol estiver curto de cota.

## Quando não usar
Debugging profundo.

## Números (datados)
AA Index: 51 (max). LMArena Agents: 8º, 10,57%. Plus: ~35–285 mensagens por 5 h. Preço de API (referência, [[Model-Pricing]]): US$ 1 / 5. Consultado em 29/10/2026.

## Dados
Treina com entradas: opt-out (Plus/Pro pessoal: ligado por padrão; Codex tem também 'Include environments'). Retenção: não verificado para Codex CLI. Cofre: `apos-opt-out` — ver regra D2 no [[Model-Catalog]]. Pedro não sabe se o treino está desligado (29/10/2026) — Cofre bloqueado até confirmação.

## Fontes
- https://developers.openai.com/codex/models
- https://learn.chatgpt.com/docs/pricing
- https://artificialanalysis.ai/leaderboards/models
- https://lmarena.ai/leaderboard
