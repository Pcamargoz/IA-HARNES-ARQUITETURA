---
title: "Referência headless das CLIs"
type: research
runtime_component: cli-reference
status: proposed
category: runtime
updated: 2026-10-29
tags: [ai-agent-ecosystem, runtime, cli]
---
# Referência headless das CLIs

Flags usadas pelos adapters (`src/runtime/adapters/cli-specs.ts`). Fonte oficial e data em cada linha; nada foi executado com tarefa real.

| CLI | Comando headless (read-only) | Saída | Tokens/custo | Login (status oficial) | Fonte (vista em 29/10/2026) |
|---|---|---|---|---|---|
| Claude Code | `claude -p "<prompt>" --output-format json --permission-mode dontAsk --allowedTools Read,Grep,Glob --no-session-persistence [--model] [--max-budget-usd]` | JSON com `result`, `usage`, `total_cost_usd` | tokens e custo (custo é estimativa do cliente) | `claude auth status` | https://code.claude.com/docs/en/headless |
| Codex | `codex exec --json --sandbox read-only --skip-git-repo-check --ephemeral -C <dir> [-m] "<prompt>"` | JSONL de eventos | tokens; custo não | `codex login status` | https://developers.openai.com/codex/noninteractive |
| OpenCode | `opencode run --format json [-m] "<prompt>"` | JSON (formato dos eventos não verificado) | via `opencode stats` | `opencode auth list` | https://opencode.ai/docs/cli |
| Gemini CLI | `gemini -p "<prompt>" --output-format json [-m]` | JSON com `response`, `stats` | tokens | — | https://geminicli.com/docs/cli/headless |
| Qwen Code | `qwen -p "<prompt>" -o json --approval-mode plan --max-session-turns N [-m]` | envelope JSON `result` | tokens | sem comando oficial (`qwen auth` removido) | https://qwenlm.github.io/qwen-code-docs/en/users/features/headless/ |
| cursor-agent | `cursor-agent -p --output-format json [--model] "<prompt>"` (sem `--force`) | envelope JSON `result` | não documentado | `cursor-agent status` | https://cursor.com/docs/cli/headless |
| Ollama | `ollama run <modelo> "<prompt>"` | texto | não | — (local) | `ollama --help` local |

## Avisos das fontes
- Gemini CLI: a doc (atualizada em 10/03/2026) diz que contas gratuitas/Google One migraram para o Antigravity CLI em 18/06/2026. Não instalado no Mac.
- Qwen Code: exit 53 = limite de turnos; 55 = orçamento (flags de orçamento não verificadas na versão 0.24.3 instalada).
- Claude Code com assinatura Pro: `total_cost_usd` é estimativa; o gasto real é cota da assinatura.
