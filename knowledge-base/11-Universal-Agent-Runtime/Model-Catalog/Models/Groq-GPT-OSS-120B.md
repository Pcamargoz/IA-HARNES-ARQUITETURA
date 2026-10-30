---
title: "gpt-oss-120b (Groq free — reserva)"
type: model-card
status: active
category: runtime
updated: 2026-10-29
tags: [ai-agent-ecosystem, runtime, model-card]
model_id: "groq/gpt-oss-120b"
provider: "OpenAI (pesos abertos) via Groq"
access_path: ["api (não configurada)"]
adapter: api
layer: reserve
tier: balanced
availability: not-configured
context_window: "não verificado"
cost_class: "gratis (limites baixos)"
strengths: ["sem treino e sem retenção por padrão (auditoria 29/10)", "rápido"]
weaknesses: ["~30 RPM, 1k RPD, 8k TPM", "exige chave e adapter API (não implementado)"]
data_policy:
  trains_on_inputs: false
  retention: "sem retenção por padrão (não reverificado)"
  opt_out_confirmed: "n/a"
cofre_allowed: "nao-ate-configurar"
local: false
verified_at: 2026-10-29
sources: ["https://console.groq.com/docs/rate-limits", "08-Implementation/Validation-Results/Auditoria-Arquitetura-2026-10-29.md"]
---
# gpt-oss-120b (Groq free — reserva)

Ficha do [[Model-Catalog]] — fotografia de 2026-10-29 (revisão mensal). Camada **reserve**, tier `balanced`, disponibilidade `not-configured`.

## Quando usar
Camada OPCIONAL de reserva, só com dados public.

## Quando não usar
Núcleo; Cofre.

## Números (datados)
— Preço de API (referência, [[Model-Pricing]]): free tier. Consultado em 29/10/2026.

## Dados
Treina com entradas: False. Retenção: sem retenção por padrão (não reverificado). Cofre: `nao-ate-configurar` — ver regra D2 no [[Model-Catalog]].

## Fontes
- https://console.groq.com/docs/rate-limits
- 08-Implementation/Validation-Results/Auditoria-Arquitetura-2026-10-29.md
