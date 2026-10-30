---
title: "Qwen3.5 9B (Ollama — candidato)"
type: model-card
status: active
category: runtime
updated: 2026-10-29
tags: [ai-agent-ecosystem, runtime, model-card]
model_id: "qwen3.5:9b"
provider: "Alibaba via Ollama"
access_path: ["ollama (não baixado)"]
adapter: ollama
layer: local
tier: local
availability: candidate-not-installed
context_window: "256K nominal"
cost_class: "zero (local)"
strengths: ["6,6–7,6 GB: cabe nos 16 GB com folga apertada", "melhor local para sensitive se aprovado"]
weaknesses: ["não baixado", "em CPU tende a ser lento (não medido)", "disputa RAM com IDE e navegador"]
data_policy:
  trains_on_inputs: false
  retention: "local (~/.ollama)"
  opt_out_confirmed: "n/a"
cofre_allowed: "true"
local: true
verified_at: 2026-10-29
sources: ["https://ollama.com/library/qwen3.5"]
---
# Qwen3.5 9B (Ollama — candidato)

Ficha do [[Model-Catalog]] — fotografia de 2026-10-29 (revisão mensal). Camada **local**, tier `local`, disponibilidade `candidate-not-installed`.

## Quando usar
Resumo/análise local de conteúdo sensitive, se aprovado e se a velocidade for aceitável.

## Quando não usar
Tarefas com prazo curto.

## Números (datados)
Sem ranking verificado para o 9B. Preço de API (referência, [[Model-Pricing]]): —. Consultado em 29/10/2026.

## Dados
Treina com entradas: False. Retenção: local (~/.ollama). Cofre: `true` — ver regra D2 no [[Model-Catalog]].

## Fontes
- https://ollama.com/library/qwen3.5
