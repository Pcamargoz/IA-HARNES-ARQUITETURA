---
title: "Roadmap de portabilidade"
type: roadmap
runtime_component: roadmap
status: proposed
category: runtime
updated: 2026-10-29
tags: [ai-agent-ecosystem, runtime, roadmap]
---
# Roadmap de portabilidade

> **Escopo:** o alvo é o Harness em `~/Downloads/Harness-Architecture`. Hermes Agent e Docker estão **fora do escopo do ecossistema do Pedro** (29/10/2026): não são clientes, alvos de configuração nem detectados.

| Fase | Entrega | Situação |
|---|---|---|
| P0 | Contrato, schemas, detecção, shell-echo/noop, 4 tools MCP | feito (29/10/2026) |
| P1 | Executar 2 CLIs reais (experimento) e validar os parsers com saída real | aguarda aprovação |
| P2 | Adapters de CLI promovidos de `spec-only` para `implemented` (um por vez, com teste gravado) | depois de P1 |
| P3 | [[Adapter-API]] (HTTP direto, sem CLI) para tarefas sem ferramentas | planejado |
| P4 | Adapter dentro de terminal [[Maestri]] (`maestri ask`) | ideia; depende do app |
| P5 | Linux/box: mesmas CLIs instaladas e logadas (exige aprovação de instalação) | não iniciado |
| P6 | Integração com o Harness ([[Harness-Integration-Runtime]]) | proposta |

## Riscos
- Formatos JSON das CLIs mudam entre versões → parsers com teste por versão.
- Cotas de assinatura não têm API de consulta → custo em cota fica "não medido".
- Mac Intel: alguns apps (Maestri) anunciam só Apple Silicon.
