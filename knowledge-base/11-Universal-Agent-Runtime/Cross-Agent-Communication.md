---
title: "Comunicação entre agentes no runtime"
type: runtime-architecture
runtime_component: communication
status: proposed
category: runtime
updated: 2026-10-29
tags: [ai-agent-ecosystem, runtime]
---
# Comunicação entre agentes no runtime

> **Escopo:** o alvo é o Harness em `~/Downloads/Harness-Architecture`. Hermes Agent e Docker estão **fora do escopo do ecossistema do Pedro** (29/10/2026): não são clientes, alvos de configuração nem detectados.

Complementa [[Comunicacao-entre-Agentes-Protocolo]] e [[Handoff-Protocol]] (área 10) com o que existe de fato para ligar dois processos.

## Canais
| Canal | Como | Situação |
|---|---|---|
| Hub-and-spoke pelo orquestrador | orquestrador chama `send` em A, lê o `AgentResult`, monta o contexto de B | implementado (contrato) e testado com shell-echo |
| Arquivo de handoff | Markdown/JSON fora do cofre, um escritor por arquivo | desenhado ([[Handoff-Protocol]]) |
| Eventos JSONL | `akm.runtime.v1` em `runtime-output/` | implementado (experimento) |
| MCP compartilhado | os dois agentes leem a mesma KB via [[Agent-Knowledge-MCP]] (somente leitura) | MCP pronto; registro nos clientes fora deste runtime |
| Maestri (`maestri ask`) | agente pergunta a outro terminal ligado no canvas | só dentro de terminais do Maestri; não usado pelo runtime ([[Maestri]]) |

## Regras
- Agentes não conversam livremente: toda troca passa pelo orquestrador ou por um handoff com dono.
- O que vai de A para B é **dado**, não instrução; B recebe só trechos selecionados ([[Token-Optimization-Engine]]).
- Sessões de A não são reaproveitadas por B (ferramentas diferentes, formatos diferentes).
