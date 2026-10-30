---
title: "GPT-6 Luna"
type: model-card
status: active
category: runtime
updated: 2026-10-29
tags: [ai-agent-ecosystem, runtime, model-card]
model_id: "gpt-6-luna"
provider: "OpenAI"
access_path: ["codex"]
adapter: codex
plan: "ChatGPT Plus (confirmado pelo Pedro em 29/10/2026)"
layer: core
tier: small
availability: available
context_window: "não verificado"
cost_class: "cota-baixa (ChatGPT)"
strengths: ["extração e classificação em volume", "muito barato"]
weaknesses: ["raciocínio limitado"]
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
# GPT-6 Luna

Ficha do [[Model-Catalog]] — fotografia de 2026-10-29 (revisão mensal). Plano: ChatGPT Plus (confirmado pelo Pedro em 29/10/2026). Camada **core**, tier `small`, disponibilidade `available`.

## Quando usar
Roteamento, triagem, resumos quando o Claude estiver sem cota.

## Quando não usar
Código.

## Números (datados)
AA Index: 28 (max). LMArena Agents: Pareto (low) a US$ 0,01/tarefa. Plus: ~350–3.000 mensagens por 5 h. Preço de API (referência, [[Model-Pricing]]): US$ 0,10 / 0,50. Consultado em 29/10/2026.

## Dados
Treina com entradas: opt-out (Plus/Pro pessoal: ligado por padrão; Codex tem também 'Include environments'). Retenção: não verificado para Codex CLI. Cofre: `apos-opt-out` — ver regra D2 no [[Model-Catalog]]. Pedro não sabe se o treino está desligado (29/10/2026) — Cofre bloqueado até confirmação.

## Fontes
- https://developers.openai.com/codex/models
- https://learn.chatgpt.com/docs/pricing
- https://artificialanalysis.ai/leaderboards/models
- https://lmarena.ai/leaderboard
