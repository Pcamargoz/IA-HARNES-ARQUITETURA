---
title: "Políticas do runtime"
type: runtime-architecture
runtime_component: policies
status: proposed
category: runtime
updated: 2026-10-29
tags: [ai-agent-ecosystem, runtime]
---
# Políticas do runtime

Aplicam [[Execution-Policy]] e [[HITL-e-Escalonamento]] (área 10) à execução real de processos.

## Permissões
- Padrão `read-only` em todo adapter. Tradução por ferramenta: Claude Code `--permission-mode dontAsk --allowedTools Read,Grep,Glob`; Codex `--sandbox read-only`; Qwen `--approval-mode plan`; cursor-agent sem `--force` (só propõe). Fontes em [[CLI-Headless-Reference]].
- `workspace-write` só com aprovação explícita, adapter com `file_edit` e `writable_files` declarados (um escritor por arquivo, [[Delegation-Contract]]).
- Proibido: `--yolo`, `--dangerously-skip-permissions`, `bypassPermissions`, sandbox `danger-full-access`.

## Execução
| Limite | Valor | Motivo |
|---|---|---|
| timeout padrão (CLI) | 120 s | tarefas curtas; maior só pedido |
| timeout máximo (CLI) | 30 min | evita processo esquecido |
| filhos paralelos | ≤ 6, profundidade ≤ 2 | [[Delegation-Contract]] |
| tentativas | ≤ 3 (`max_fix_attempts`) | [[Model-Router]] |
| contexto | teto `max_chars` por tarefa; acima → `context_too_large` | [[Token-Optimization-Engine]] |

## Aprovação (HITL)
Precisa de "sim" do Pedro: qualquer execução de CLI que consome cota; escrita em arquivos; instalar ferramenta; editar config de cliente (Claude Code/Desktop, Codex, Cursor); qualquer ação irreversível. O `init()` (versão/login) não precisa.

## Credenciais
O runtime não faz login, não lê nem guarda credenciais. Login é responsabilidade da própria CLI; o runtime só consulta o status oficial ([[ADR-012-Detecao-por-Comando-Oficial]]).

## Fora do escopo
Hermes Agent e Docker (decisão do Pedro, 29/10/2026).
