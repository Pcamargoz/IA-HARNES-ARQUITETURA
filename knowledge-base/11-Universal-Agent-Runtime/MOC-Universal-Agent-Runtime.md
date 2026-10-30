---
title: "MOC — Universal Agent Runtime"
type: moc
status: proposed
category: runtime
updated: 2026-10-29
tags: [ai-agent-ecosystem, runtime, moc]
---
# MOC — Universal Agent Runtime

Camada que deixa o orquestrador do Pedro ([[MOC-Multi-Agent-Orchestration]]) delegar trabalho a **qualquer** agente de linha de comando ou API pelo mesmo contrato, medir o resultado e escolher o modelo pelo custo por sucesso, não pelo preço por token.

> **Escopo:** o alvo é o Harness em `~/Downloads/Harness-Architecture`. Hermes Agent e Docker estão **fora do escopo do ecossistema do Pedro** (29/10/2026): não são clientes, alvos de configuração nem detectados.

## Estado (29/10/2026)
| Camada | Situação |
|---|---|
| Documentado | esta área inteira (arquitetura, contrato, manifest, adapters, roteador, políticas, métricas, pesquisa por CLI) |
| Implementado | `src/runtime/` no [[Agent-Knowledge-MCP]] 0.3.0: Port, schemas, detecção, adapters `shell-echo` e `noop`, specs de 7 CLIs, 4 tools MCP de leitura, `npm run detect-env`, `npm run experiment` |
| Testado | `npm test` 46/48 (2 pulados = vaults reais); detecção real no Mac e no box; selftest do experimento com 2 processos reais (não LLM) |
| Integrado | **nada** no Harness nem nos clientes; executar agentes reais exige aprovação (consome cota) |

## Arquitetura
- [[Universal-Agent-Runtime]] — visão geral e camadas
- [[Agent-Port-Contract]] — o contrato `AgentPort` (init/send/receive/cancel/dispose)
- [[Capability-Manifest]] — o que cada adapter declara
- [[Environment-Detection]] — como o ambiente é detectado (resultados reais)
- [[Agent-Capability-Registry]] — catálogo de adapters cruzado com o ambiente
- [[Model-Router]] — política de roteamento (11 fatores) e custo esperado
- [[Model-Catalog]] — qual modelo usar por tarefa: 18 fichas, matriz, cotas, regras de dados (29/10/2026)
- [[Runtime-Policies]] — permissões, timeouts, paralelismo, aprovação
- [[Token-Optimization-Engine]] — contexto controlado e economia de tokens
- [[Execution-Metrics]] — 8 métricas do runtime e ligação com o Harness
- [[Cross-Agent-Communication]] — como dois agentes trocam trabalho (handoff, JSONL, Maestri)
- [[Maestri]] — o app Maestri ("Maestria") e o que ele resolve ou não

## Adapters
[[Adapter-Claude-Code]] · [[Adapter-Codex]] · [[Adapter-OpenCode]] · [[Adapter-Gemini-CLI]] · [[Adapter-Qwen-Code]] · [[Adapter-Cursor-Agent]] · [[Adapter-Ollama-Local]] · [[Adapter-Shell-Echo]] · [[Adapter-Native]] · [[Adapter-API]]

## Pesquisa e planos
- [[CLI-Headless-Reference]] — flags headless por CLI, com fonte oficial
- [[Model-Pricing]] — preços por modelo (fonte e data)
- [[Delegation-Experiment]] — experimento com 2 agentes (preparado, não executado)
- [[Portability-Roadmap]] — o que falta para rodar em outro ambiente
- [[Harness-Integration-Runtime]] — propostas EVO-11 a EVO-14 para o Harness
- Decisões: [[ADR-011-Port-Adapter-para-Agentes]] · [[ADR-012-Detecao-por-Comando-Oficial]]
- Validação: [[Validacao-Runtime-2026-10-29]]

## Tools MCP (somente leitura)
`get_runtime_architecture` · `list_agent_adapters` · `get_model_routing_policy` · `get_environment_capabilities` (detalhes em [[Tools-Reference]]).
