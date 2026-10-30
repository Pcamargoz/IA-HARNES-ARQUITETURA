---
title: "Motor de otimização de tokens"
type: runtime-architecture
runtime_component: tokens
status: proposed
category: runtime
updated: 2026-10-29
tags: [ai-agent-ecosystem, runtime]
---
# Motor de otimização de tokens

Aplica [[Estrategia-de-Tokens]] e [[Compressao-e-Cache]] e [[Context-and-Memory]] na fronteira da delegação: o filho recebe só o que precisa.

## Mecanismos (implementados)
- **Contexto controlado:** `ContextShare` com trechos escolhidos (`snippets`), arquivos legíveis e teto `max_chars`; renderizado como bloco `<contexto-controlado>`; acima do teto lança `context_too_large` (testado).
- **Medição:** `context_chars_sent` em toda execução.
- **Busca antes de ler:** o orquestrador usa o MCP (`search_knowledge` → `get_document` com `heading`) para montar trechos, nunca o cofre inteiro.

## Mecanismos (propostos)
- Tier mais barato que resolve ([[Model-Router]]); tarefas triviais sem LLM.
- Cache de prompt: prefixo estável (instruções + spec) antes do conteúdo variável; preços de leitura de cache em [[Model-Pricing]].
- Resumo de handoff em vez de histórico completo ([[Handoff-Protocol]]).
- Sessões efêmeras (`--no-session-persistence`, `--ephemeral`) para não acumular contexto.

## Métricas
`context_chars_sent`, `tokens_in`/`tokens_out` quando reportados, `context_efficiency` do Harness. Ver [[Execution-Metrics]].
