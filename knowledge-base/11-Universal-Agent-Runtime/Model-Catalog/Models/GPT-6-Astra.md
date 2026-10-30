---
title: "GPT-6 Astra"
type: model-card
status: active
category: runtime
updated: 2026-10-29
tags: [ai-agent-ecosystem, runtime, model-card]
model_id: "gpt-6-astra"
provider: "OpenAI"
access_path: ["codex"]
adapter: codex
plan: "ChatGPT Plus (confirmado pelo Pedro em 29/10/2026)"
layer: core
tier: frontier
availability: limited
context_window: "não verificado para Codex"
cost_class: "cota-alta (ChatGPT; limitada no Plus)"
strengths: ["trabalho mais difícil (docs da OpenAI)", "segunda opinião de fornecedor diferente do Claude"]
weaknesses: ["Plus: ~5–45 mensagens locais por 5 h", "caro"]
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
# GPT-6 Astra

Ficha do [[Model-Catalog]] — fotografia de 2026-10-29 (revisão mensal). Plano: ChatGPT Plus (confirmado pelo Pedro em 29/10/2026). Camada **core**, tier `frontier`, disponibilidade `limited`.

## Quando usar
Verificador frontier de outro fornecedor para decisões críticas.

## Quando não usar
Trabalho contínuo no Plus (cota curta).

## Números (datados)
AA Index: 57 (max). LMArena Agents: 5º, 12,96%. Preço de API (referência, [[Model-Pricing]]): US$ 10 / 50. Consultado em 29/10/2026.

## Dados
Treina com entradas: opt-out (Plus/Pro pessoal: ligado por padrão; Codex tem também 'Include environments'). Retenção: não verificado para Codex CLI. Cofre: `apos-opt-out` — ver regra D2 no [[Model-Catalog]]. Pedro não sabe se o treino está desligado (29/10/2026) — Cofre bloqueado até confirmação.

## Fontes
- https://developers.openai.com/codex/models
- https://learn.chatgpt.com/docs/pricing
- https://artificialanalysis.ai/leaderboards/models
- https://lmarena.ai/leaderboard
