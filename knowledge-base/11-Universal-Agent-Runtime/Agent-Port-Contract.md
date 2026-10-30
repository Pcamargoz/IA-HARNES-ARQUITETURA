---
title: "Contrato AgentPort"
type: runtime-architecture
runtime_component: port
status: proposed
category: runtime
updated: 2026-10-29
tags: [ai-agent-ecosystem, runtime]
---
# Contrato AgentPort

Fonte: `src/runtime/port.ts` (schema `akm.runtime.v1`). JSON Schemas equivalentes em `src/runtime/schemas.ts`, validados nos testes.

## Métodos
| Método | Faz | Consome cota? |
|---|---|---|
| `init()` | confere binário, versão e login | não |
| `send(task)` | valida a tarefa contra o manifest e inicia o processo; devolve `handle` | sim (CLIs de LLM) |
| `receive(handle)` | espera o fim (respeita `timeout_ms`) e devolve `AgentResult` | — |
| `cancel(handle, reason?)` | encerra o processo; idempotente | — |
| `dispose()` | encerra tudo que estiver aberto | — |

## AgentTask
`task_id`, `prompt`, `workdir`, `permission_mode` (`read-only` | `workspace-write`), `timeout_ms`, opcionais `context` (trechos + teto `max_chars`), `model`, `session_id`, `budget` (`max_turns`, `max_cost_usd`).

## AgentResult
`status`: `done` | `failed` | `timeout` | `cancelled` | `not_executed`; `output`; `structured`; `error` (`code`, `message`, `retryable`); `metrics` (início, fim, latência, exit code, tokens/custo com origem `reported`/`estimated`/`unavailable`, bytes de stdout/stderr, caracteres de contexto enviados).

## Códigos de erro
`not_installed`, `not_authenticated`, `unsupported_capability`, `permission_denied`, `spawn_failed`, `timeout`, `cancelled`, `non_zero_exit`, `parse_error`, `context_too_large`, `not_executed`.

## Regras
- Contexto acima do teto lança `context_too_large`; nunca trunca em silêncio.
- `workspace-write` só se o adapter declarar `file_edit`.
- `parse` só roda com exit 0; saída com erro vira `non_zero_exit` (corrigido e testado em 29/10/2026).
