---
title: "Universal Agent Runtime"
type: runtime-architecture
runtime_component: overview
status: proposed
category: runtime
updated: 2026-10-29
tags: [ai-agent-ecosystem, runtime]
---
# Universal Agent Runtime

> **Escopo:** o alvo é o Harness em `~/Downloads/Harness-Architecture`. Hermes Agent e Docker estão **fora do escopo do ecossistema do Pedro** (29/10/2026): não são clientes, alvos de configuração nem detectados.

## Problema
O orquestrador ([[Orchestrator-Policy]]) decide **o que** delegar; faltava **como** delegar sem amarrar o desenho a uma ferramenta. Cada CLI tem flags, formatos de saída, modos de permissão e formas de login diferentes ([[CLI-Headless-Reference]]).

## Camadas
| # | Camada | Responsabilidade | Onde |
|---|---|---|---|
| 1 | Orquestrador | escolhe tarefa, agente e modelo; aplica políticas | KB área 10 (desenho) |
| 2 | Model Router | tier por complexidade, custo esperado por sucesso | [[Model-Router]] |
| 3 | Registry | quais adapters existem e estão prontos neste ambiente | [[Agent-Capability-Registry]] |
| 4 | Port | contrato único `AgentPort` | [[Agent-Port-Contract]] |
| 5 | Adapters | traduzem o contrato para cada ferramenta | `Adapters/` |
| 6 | Detecção | descobre CLIs, versões, login, MCPs, paralelismo | [[Environment-Detection]] |
| 7 | Métricas | latência, sucesso, tokens e custo (só reportados) | [[Execution-Metrics]] |

## Fluxo
1. `detect-env` gera o manifest de ambiente (sem segredos).
2. O orquestrador pede ao Router o tier e ao Registry os adapters disponíveis com as capacidades exigidas.
3. `init()` confere instalação e login **sem consumir cota**.
4. `send(task)` inicia o processo com contexto controlado ([[Token-Optimization-Engine]]) e modo read-only por padrão.
5. `receive(handle)` devolve `AgentResult` (status, saída, métricas); `cancel` mata o processo; `dispose` libera recursos.
6. Resultado vira evento JSONL `akm.runtime.v1` e alimenta [[Execution-Metrics]].

## Princípios
- Um contrato, muitos adapters (Ports & Adapters, [[ADR-011-Port-Adapter-para-Agentes]]).
- Nada de simular agente: adapter que não executou devolve `not_executed` ([[Adapter-Native]], `noop`).
- Tokens e custo só quando a ferramenta reporta; estimativa sempre rotulada (`tokens_source`, `cost_source`).
- Login só por comando oficial de status; arquivos de credencial nunca são abertos ([[ADR-012-Detecao-por-Comando-Oficial]]).
- Leitura por padrão; escrita exige `workspace-write` declarado e aprovação ([[Runtime-Policies]]).

## Implementação
`Agent-Knowledge-MCP/src/runtime/` (TypeScript, sem dependência do servidor MCP): `port.ts`, `schemas.ts`, `detect.ts`, `adapters/process-adapter.ts`, `adapters/shell-echo.ts`, `adapters/noop.ts`, `adapters/cli-specs.ts`.
