---
title: "Claude Fable 5.1"
type: model-card
status: active
category: runtime
updated: 2026-10-29
tags: [ai-agent-ecosystem, runtime, model-card]
model_id: "claude-fable-5-1"
provider: "Anthropic"
access_path: ["claude-code (usage credits)", "cursor-agent (crédito; NO ZDR)"]
adapter: claude-code
layer: core
tier: frontier
availability: paid-extra
context_window: "1M (API)"
cost_class: "pago-extra (fora da cota do Pro)"
strengths: ["raciocínio exigente", "tarefas de horizonte longo (posicionamento da Anthropic)"]
weaknesses: ["no Pro só via usage credits (cobrança à parte)", "mais lento e caro", "no Cursor marcado NO ZDR"]
data_policy:
  trains_on_inputs: "opt-out (plano pessoal: treina se 'Help improve Claude' estiver ligado)"
  retention: "30 dias sem treino; até 5 anos com treino"
  opt_out_confirmed: false
  opt_out_status: "Pedro não sabe se o treino está desligado (29/10/2026) — Cofre bloqueado até confirmação"
cofre_allowed: "nao"
local: false
verified_at: 2026-10-29
sources: ["https://docs.claude.com/en/docs/about-claude/models/overview", "https://claude.com/pricing", "https://artificialanalysis.ai/leaderboards/models", "https://lmarena.ai/leaderboard", "CLI no Mac do Pedro, 29/10/2026 (--list-models / opencode models / ollama list / qwen --help)"]
---
# Claude Fable 5.1

Ficha do [[Model-Catalog]] — fotografia de 2026-10-29 (revisão mensal). Camada **core**, tier `frontier`, disponibilidade `paid-extra`.

## Quando usar
Só com aprovação explícita do Pedro (gasta dinheiro) e quando Opus 5.5 falhou 2× por capacidade.

## Quando não usar
Rotina; nunca automático.

## Números (datados)
AA Index: 50 (xhigh) — abaixo do Opus 5.5 nessa medição. LMArena Agents: 4º, 13,35%. Preço de API (referência, [[Model-Pricing]]): US$ 10 / 50. Consultado em 29/10/2026.

## Dados
Treina com entradas: opt-out (plano pessoal: treina se 'Help improve Claude' estiver ligado). Retenção: 30 dias sem treino; até 5 anos com treino. Cofre: `nao` — ver regra D2 no [[Model-Catalog]]. Pedro não sabe se o treino está desligado (29/10/2026) — Cofre bloqueado até confirmação.

## Fontes
- https://docs.claude.com/en/docs/about-claude/models/overview
- https://claude.com/pricing
- https://artificialanalysis.ai/leaderboards/models
- https://lmarena.ai/leaderboard
- CLI no Mac do Pedro, 29/10/2026 (--list-models / opencode models / ollama list / qwen --help)
