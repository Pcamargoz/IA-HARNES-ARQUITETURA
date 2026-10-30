---
title: "Validação do Universal Agent Runtime (29/10/2026)"
type: validation
status: done
category: runtime
updated: 2026-10-29
tags: [ai-agent-ecosystem, validation, runtime, agent-knowledge-mcp]
---
# Validação do Universal Agent Runtime (29/10/2026)

> **Escopo:** o alvo é o Harness em `~/Downloads/Harness-Architecture` (somente leitura nesta etapa). Hermes Agent e Docker estão **fora do escopo do ecossistema do Pedro**.

Validação da área [[MOC-Universal-Agent-Runtime]] e do [[Agent-Knowledge-MCP]] 0.3.0. Rodou no Mac do Pedro e numa máquina Linux de apoio. **Nenhum agente de IA foi executado e nenhum foi simulado como se tivesse rodado**: o experimento com duas CLIs está preparado e aguarda aprovação ([[Delegation-Experiment]]).

## 1. Detecção do ambiente (`npm run detect-env`)
Comandos oficiais `--version` e de status de login. Nenhum arquivo de credencial foi aberto; e-mails e ids foram removidos ([[ADR-012-Detecao-por-Comando-Oficial]]).

**Mac, 29/10/2026 21:44 (horário de Brasília):** macOS 26.7.1, Intel x64, 8 CPUs, 16 GB, node v22.23.2.

| CLI | Versão | Login (comando oficial) |
|---|---|---|
| claude | 2.1.312 | autenticado (claude.ai, Pro) |
| codex | 0.166.0 | autenticado (ChatGPT) |
| cursor-agent | 2026.10.22-27dcf5f | autenticado |
| opencode | 2.2.2 | não autenticado |
| qwen | 0.24.3 | desconhecido (sem comando de status) |
| ollama | 0.40.12 | servidor ativo; modelo `qwen2.5:3b` |
| gemini, aider, goose, gh, tmux | — | não instalados |

- MCP (só nomes): Claude Code (usuário) `agent-knowledge`, `controlfree-vault`, `hermes-vault` (MCP do Harness); Claude Desktop `agent-knowledge`; Codex `node_repl`. O `agent-knowledge` **já aparece registrado** no Claude Code e no Claude Desktop. Esse registro não foi feito nesta etapa; só foi detectado.
- Maestri 0.57.1 instalado e rodando; a detecção não rodou dentro de um terminal do Maestri ([[Maestri]]).
- Paralelismo: 4 processos de 400 ms terminaram em 505 ms.

**Linux de apoio:** Debian 13, 8 CPUs, 16 GB, node v20.19.2. Nenhuma CLI de agente; `gh` 2.46 sem login; sem Maestri; 4×400 ms em 471 ms.

## 2. As 7 capacidades
| Capacidade | Mac | Linux de apoio | Evidência |
|---|---|---|---|
| Executar comandos de terminal | sim | sim | spawn de 11 binários e dos processos de teste |
| Usar CLIs de agentes | parcial | não | 6 instaladas no Mac; adapters `spec-only`; nenhuma executada com tarefa |
| Iniciar e controlar processos | sim | sim | timeout, cancelamento e paralelismo nos testes (shell-echo) |
| Manter sessões | parcial | parcial | `session_resume` documentado nas CLIs; não exercitado |
| Capturar saída | parcial | parcial | stdout/stderr e JSON capturados com shell-echo; parsers das CLIs testados só com amostras |
| Detectar autenticação | parcial | não | 3 logins confirmados por comando oficial; qwen desconhecido |
| Medir execução | sim | sim | latência, status, tokens e custo com origem (`reported`/`estimated`/`unavailable`) |

## 3. Testes
| Teste | Onde | Resultado |
|---|---|---|
| `npm test` | Mac | 48 testes: 46 ok, 2 pulados, 0 falhas |
| `npm test` | Linux de apoio | 48 testes: 46 ok, 2 pulados, 0 falhas |
| `npm run test:real` (Cofre + Harness, só leitura) | Mac | 2 de 2 ok; inclui as 4 tools novas e a varredura do Cofre inteiro sem notas de chave (697 documentos) |

No `test:real`: `get_runtime_architecture` listou 25 notas, `list_agent_adapters` cruzou 10 adapters com o ambiente, `get_model_routing_policy` respondeu o tier trivial e `get_environment_capabilities` leu o manifest do Mac.

## 4. Experimento de delegação
- **Plano** (`runtime-output/experiment-plan-20261030T004423.json`): status `not_executed`. Elegíveis: claude-code, codex, cursor-agent e ollama-local.
- **Selftest** (`--selftest`): 2 processos shell-echo. Os dois terminaram com status `done` em 487 e 485 ms, sem mudar arquivos e rodando ao mesmo tempo (C4 ok). C2 não se aplica porque shell-echo não é LLM. Isso valida só a mecânica do runner.
- **Execução real:** não feita. Aguarda aprovação do Pedro porque consome cota: `npm run experiment -- --approve --agents claude-code,codex`.

## 5. Situação por camada
| Item | Documentado | Implementado | Testado | Integrado |
|---|---|---|---|---|
| Contrato `AgentPort`, manifest, eventos | sim | sim | sim (unidade) | — |
| Detecção de ambiente | sim | sim | sim (Mac e Linux reais) | — |
| Adapter shell-echo / noop | sim | sim | sim | — |
| Adapters Claude Code, Codex, cursor-agent, Qwen, Gemini, OpenCode, Ollama | sim | argv e parsers (`spec-only`) | só parsers com amostras | não |
| Adapter API | sim | não | não | não |
| 4 tools MCP do runtime | sim | sim | sim (fixtures e vaults reais) | via MCP já registrado nos clientes (detectado) |
| Model Router e cálculo de custo por sucesso | sim | sim (leitura e cálculo) | sim | não |
| Experimento com 2 agentes reais | sim | sim (runner) | só selftest | não executado |
| Harness (EVO-11..14) | sim ([[Harness-Integration-Runtime]]) | não | não | não (Harness só leitura) |

## 6. Pendências que precisam de aprovação
1. Rodar o experimento real com duas CLIs, o que consome cota.
2. Aceitar [[ADR-011-Port-Adapter-para-Agentes]] e [[ADR-012-Detecao-por-Comando-Oficial]] (hoje `proposed`).
3. Aplicar EVO-11 a EVO-14 no Harness.
4. Instalar CLIs ausentes (gemini, tmux) e fazer login no OpenCode, se o Pedro quiser.
