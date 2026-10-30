---
title: "Experimento de delegação entre dois agentes"
type: experiment
runtime_component: experiment
status: proposed
category: runtime
updated: 2026-10-29
tags: [ai-agent-ecosystem, runtime, experimento]
---
# Experimento de delegação entre dois agentes

**Status: preparado, NÃO executado com agentes reais.** Executar consome a cota das contas do Pedro e precisa de aprovação. Nenhum agente foi simulado.

## Objetivo
Provar que o runtime inicia **duas CLIs diferentes ao mesmo tempo**, entrega a mesma tarefa com permissão read-only, captura as respostas e mede latência, tokens e custo sem tocar em arquivos.

## Tarefa
Diretório temporário com `input.txt` (17, 25, 8, 41, 9). Prompt: ler o arquivo, somar e responder só `{"sum": N}`; não criar, alterar nem apagar arquivos. Esperado: **100**. Timeout 120 s. Para o Ollama (modelo sem ferramentas) o conteúdo vai como contexto controlado.

## Critérios
| # | Critério |
|---|---|
| C1 | status `done` (exit 0) em até 120 s |
| C2 | resposta contém `{"sum": 100}` |
| C3 | nenhum arquivo criado, alterado ou apagado (hash antes/depois) |
| C4 | os dois processos rodaram ao mesmo tempo (janelas sobrepostas) |

## Elegíveis no Mac (plano gerado em 29/10/2026 21:44, horário de Brasília)
| Adapter | Elegível | Motivo |
|---|---|---|
| claude-code 2.1.312 | sim | login ok (Pro); consome cota |
| codex 0.166.0 | sim | login ok (ChatGPT); consome cota |
| cursor-agent 2026.10.22 | sim | login ok; consome cota |
| ollama-local 0.40.12 | sim | local, sem conta; `qwen2.5:3b`; sem ferramentas |
| opencode 2.2.2 | não | nenhum provedor autenticado |
| qwen-code 0.24.3 | não | login desconhecido |
| gemini-cli | não | não instalado |

Par sugerido: **claude-code + codex** (as duas CLIs principais do Pedro). Alternativa sem cota: **ollama-local** + um deles.

## Como rodar
```bash
cd ~/Downloads/Agent-Knowledge-MCP
npm run detect-env                     # atualiza o manifest
npm run experiment                     # só PLANO (padrão): grava runtime-output/experiment-plan-*.json
npm run experiment -- --selftest       # valida o harness com 2 processos shell-echo (NÃO são LLMs)
npm run experiment -- --approve --agents claude-code,codex   # EXECUÇÃO REAL — exige aprovação do Pedro
```
Saída: `runtime-output/experiment-<rótulo>-<data>.jsonl` (eventos `delegation_result` e `delegation_summary`).

## O que já rodou
- Plano no Mac: 4 elegíveis, argv montado para cada um, nada executado.
- Selftest no Mac: 2 processos shell-echo, `done`, sem mudança de arquivos, simultâneos (C4=true), ~486 ms cada. Valida só a mecânica do harness; **não** é resultado de agente.

## Pendente de aprovação
Rodar `--approve --agents claude-code,codex` (ou outro par) e registrar o JSONL em [[Validacao-Runtime-2026-10-29]].
