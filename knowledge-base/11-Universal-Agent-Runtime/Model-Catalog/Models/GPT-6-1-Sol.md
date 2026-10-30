---
title: "GPT-6.1 Sol"
type: model-card
status: active
category: runtime
updated: 2026-10-29
tags: [ai-agent-ecosystem, runtime, model-card]
model_id: "gpt-6.1-sol"
provider: "OpenAI"
access_path: ["codex", "opencode (Sign in with ChatGPT — não configurado)"]
adapter: codex
plan: "ChatGPT Plus (confirmado pelo Pedro em 29/10/2026)"
layer: core
tier: balanced
availability: available
context_window: "500k (padrão no Codex)"
cost_class: "cota-media (ChatGPT)"
strengths: ["quase Astra por menor custo", "código e debugging", "melhor custo/tarefa entre os frontier"]
weaknesses: ["Plus: ~15–160 mensagens por 5 h"]
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
# GPT-6.1 Sol

Ficha do [[Model-Catalog]] — fotografia de 2026-10-29 (revisão mensal). Plano: ChatGPT Plus (confirmado pelo Pedro em 29/10/2026). Camada **core**, tier `balanced`, disponibilidade `available`.

## Quando usar
Fallback do Claude Code em código; revisor quando o autor foi Claude; `codex exec -m gpt-6.1-sol`.

## Quando não usar
Classificação em massa (use Luna).

## Números (datados)
AA Index: 55 (max, US$ 1,27/tarefa), 50 (high, US$ 0,59). LMArena Agents: 6º, 12,47%; Pareto a US$ 0,89/tarefa. Substitui GPT-5.5 no Codex com login ChatGPT desde 14/10/2026. Preço de API (referência, [[Model-Pricing]]): US$ 2 / 10. Consultado em 29/10/2026.

## Dados
Treina com entradas: opt-out (Plus/Pro pessoal: ligado por padrão; Codex tem também 'Include environments'). Retenção: não verificado para Codex CLI. Cofre: `apos-opt-out` — ver regra D2 no [[Model-Catalog]]. Pedro não sabe se o treino está desligado (29/10/2026) — Cofre bloqueado até confirmação.

## Fontes
- https://developers.openai.com/codex/models
- https://learn.chatgpt.com/docs/pricing
- https://artificialanalysis.ai/leaderboards/models
- https://lmarena.ai/leaderboard
