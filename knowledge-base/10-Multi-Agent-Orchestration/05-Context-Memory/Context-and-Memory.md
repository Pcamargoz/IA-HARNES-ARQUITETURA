---
title: "Contexto e memória"
type: policy
policy_area: context
status: proposed
category: orchestration
updated: 2026-10-29
tags: [orchestration, context, memory]
---
# Contexto e memória

## Níveis de contexto (Harness AGENTS.md)
| Nível | Conteúdo | Quando |
|---|---|---|
| L0 | HOME + AGENTS.md (+ prompt do orquestrador) | sempre, no início |
| L1 | nota de entrada da área relevante | antes de planejar |
| L2 | notas específicas citadas pela área | sob demanda |
| L3 | busca aberta no cofre | só se L1/L2 forem insuficientes |

## Orçamento por tipo de tarefa (Harness `Optimization/token-strategy.md`, referências e não limites)
| Tarefa | Orçamento |
|---|---|
| Pergunta rápida | < 4k tokens |
| Fix pequeno | 4–10k |
| Feature | 10–30k |
| Arquitetura | 30–60k |

Regra: buscar antes de ler; ler a seção, não o arquivo (`get_document` com `heading`/`outline_only`).

## O que cada papel carrega
| Papel | Carrega |
|---|---|
| Orquestrador | L0 + metadados do registro + política aplicável |
| Worker | handoff + arquivos que possui + skill escolhida |
| Verificador | handoff (critérios) + diff + saída de testes |
| Researcher | pergunta + fontes |
Filhos recebem **resumo**, não o histórico (R7). Revisão e segurança: falhar em vez de resumir.

## Memória em duas camadas (R8)
- **Longo prazo:** Obsidian, servido **somente leitura** pelo [[Agent-Knowledge-MCP]] e pelo hermes-vault; escrita só pelo orquestrador com aprovação (Harness: só `Inbox/`).
- **Curto prazo (proposta):** `.harness/` no repositório de trabalho: `state.json`, `plans/`, `handoffs/`, `notepad.md`. Após compactação: revalidar com `git status`.
- Ver também [[Memoria-de-Agentes]] e [[Orcamento-de-Contexto]].
