---
title: "Detecção de ambiente"
type: runtime-architecture
runtime_component: detection
status: proposed
category: runtime
updated: 2026-10-29
tags: [ai-agent-ecosystem, runtime]
---
# Detecção de ambiente

> **Escopo:** o alvo é o Harness em `~/Downloads/Harness-Architecture`. Hermes Agent e Docker estão **fora do escopo do ecossistema do Pedro** (29/10/2026): não são clientes, alvos de configuração nem detectados.

`npm run detect-env` (script `scripts/detect-env.mjs` → `src/runtime/detect.ts`) grava `runtime-output/environment-manifest.json` (modo 0600, ignorado pelo Git). Lido por `get_environment_capabilities` e `list_agent_adapters`.

## O que detecta e como
| Item | Como | O que **não** faz |
|---|---|---|
| Host | `os`, `sw_vers` | — |
| CLIs | `which` + `--version` em PATH e pastas comuns (`~/.local/bin`, nvm, `/usr/local/bin`, `/opt/homebrew/bin`) | não executa tarefa |
| Login | só comandos oficiais: `claude auth status`, `codex login status`, `opencode auth list`, `cursor-agent status`, `gh auth status` | nunca abre arquivos de credencial; e-mails, orgId e ids são removidos (`scrub`) |
| MCP | só **nomes** de servidores em `~/.claude.json`, Claude Desktop, `~/.codex/config.toml`, Cursor, Qwen, Gemini, OpenCode | não copia comandos, env nem tokens |
| Apps | Maestri (versão, se está rodando, se este processo está dentro de um terminal dele) | — |
| Serviços | Ollama (`ollama list`) | Docker e Hermes não são consultados |
| Paralelismo | 4 processos node de 400 ms ao mesmo tempo | — |

## Resultado real — Mac do Pedro (29/10/2026 21:44, horário de Brasília)
- Host: macOS 26.7.1, Intel Core i5-1038NG7 (x64), 8 CPUs, 16 GB, node v22.23.2, zsh.
- CLIs de agente: **claude 2.1.312** (login ok, claude.ai, plano Pro) · **codex-cli 0.166.0** (login ok, ChatGPT) · **cursor-agent 2026.10.22-27dcf5f** (login ok) · **opencode v2.2.2** (sem provedor autenticado) · **qwen 0.24.3** (login desconhecido: sem comando oficial de status; `~/.qwen/oauth_creds.json` e `settings.json` ausentes) · **ollama 0.40.12** (servidor ativo, modelo `qwen2.5:3b`).
- Ausentes: gemini, aider, goose, gh, tmux.
- MCP (só nomes): Claude Code (usuário) `agent-knowledge`, `controlfree-vault`, `hermes-vault`; Claude Desktop `agent-knowledge`; Codex `node_repl`. `hermes-vault` é o MCP **do Harness** (pasta `.mcp/` do Harness-Architecture), não o Hermes Agent.
- Maestri 0.57.1 instalado e rodando; este processo **não** está num terminal do Maestri (`maestri` CLI indisponível daqui).
- Paralelismo: 4×400 ms em 505 ms.

## Resultado real — box do Grok Bot (Linux, 29/10/2026)
Debian 13, 8 CPUs, 16 GB, node v20.19.2. Nenhuma CLI de agente instalada; gh 2.46 sem login; sem Maestri. Paralelismo 4×400 ms em 471 ms. Serve para testes do contrato, não para delegar a agentes.

## As 7 capacidades (com evidência)
| Capacidade | Mac | Evidência |
|---|---|---|
| Executar comandos de terminal | yes | spawn de 11 binários (`--version`) e 4 processos node |
| Inicializar CLIs diferentes | partial | 5 CLIs de agente encontradas; só `--version`/status executados (tarefa real consome cota) |
| Criar processos independentes | yes | 4 processos de 400 ms em 505 ms |
| Coordenar sessões simultâneas | partial | vários handles ao mesmo tempo testados com shell-echo; sessões de agente reais não verificadas |
| Capturar respostas e estados | partial | stdout/stderr/exit/latência capturados (testado); JSON das CLIs só documentado |
| Gerenciar permissões e autenticação | partial | login confirmado por comando oficial (claude, codex, cursor-agent); flags read-only nos adapters; runtime não faz login |
| Registrar métricas de execução | yes | `AgentResult.metrics` + JSONL `akm.runtime.v1` |

No box: terminal yes, CLIs no, processos yes, sessões partial, captura partial, auth no, métricas yes.
