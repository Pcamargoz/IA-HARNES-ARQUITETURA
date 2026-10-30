---
title: "Orçamento de contexto"
type: guide
status: active
updated: 2026-10-29
tags: [ai-agent-ecosystem, tokens, context]
---
# Orçamento de contexto

## Faixas (do `Memory Agents/context.md` do Harness)
| Tarefa | Orçamento |
|---|---|
| Simples (pergunta, ajuste trivial) | < 4k |
| Correção pequena | 4–10k |
| Feature | 10–30k |
| Arquitetura | 30–60k |

## Regras de carga progressiva
1. **L0:** HOME + AGENTS (~2k) — sempre.
2. **L1:** nota de entrada da área (ex.: [[Indice-AI-Agent-Ecosystem]]).
3. **L2:** 2–4 notas, de preferência por **seção** (`get_document` com `heading`).
4. **L3:** busca (`search_knowledge`, 5 resultados) — só quando L1/L2 não bastam.

## Regras práticas
- Declarar o orçamento no handoff brief (proposta M9 da [[Harness-Improvement-Proposal]]).
- Notas da KB com 60–250 linhas (padrão do Harness) para leitura barata.
- Pedir `outline_only=true` antes de ler documento longo.
- Não colar logs inteiros: pedir ao QA o resumo da falha (arquivo, teste, mensagem, 20 linhas de stack).
- Encerrar/compactar a sessão ao trocar de tarefa (*context rot*).
