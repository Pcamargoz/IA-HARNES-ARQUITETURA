---
title: "Qwen3.8-Max (Qwen Code)"
type: model-card
status: active
category: runtime
updated: 2026-10-29
tags: [ai-agent-ecosystem, runtime, model-card]
model_id: "qwen3.8-max"
provider: "Alibaba (Qwen)"
access_path: ["qwen-code (sem provedor)"]
adapter: qwen-code
layer: core
tier: balanced
availability: unavailable
context_window: "não verificado"
cost_class: "pago (chave de API própria)"
strengths: ["Qwen Code aceita --fallback-model (até 3) e --auth-type openai|anthropic|gemini…"]
weaknesses: ["tier grátis Qwen OAuth encerrado em 15/04/2026", "`qwen auth` removido na 0.24.3", "nenhum provedor configurado no Mac (não verificado)"]
data_policy:
  trains_on_inputs: "não verificado"
  retention: "não verificado"
  opt_out_confirmed: false
cofre_allowed: "nao"
local: false
verified_at: 2026-10-29
sources: ["CLI no Mac do Pedro, 29/10/2026 (--list-models / opencode models / ollama list / qwen --help)", "https://artificialanalysis.ai/leaderboards/models"]
---
# Qwen3.8-Max (Qwen Code)

Ficha do [[Model-Catalog]] — fotografia de 2026-10-29 (revisão mensal). Camada **core**, tier `balanced`, disponibilidade `unavailable`.

## Quando usar
Hoje não entra na cadeia. Opção futura: apontar o Qwen Code para o Ollama local (endpoint OpenAI-compatível) — não testado.

## Quando não usar
Até haver provedor.

## Números (datados)
Sem número oficial lido nesta data. Preço de API (referência, [[Model-Pricing]]): não verificado. Consultado em 29/10/2026.

## Dados
Treina com entradas: não verificado. Retenção: não verificado. Cofre: `nao` — ver regra D2 no [[Model-Catalog]].

## Fontes
- CLI no Mac do Pedro, 29/10/2026 (--list-models / opencode models / ollama list / qwen --help)
- https://artificialanalysis.ai/leaderboards/models
