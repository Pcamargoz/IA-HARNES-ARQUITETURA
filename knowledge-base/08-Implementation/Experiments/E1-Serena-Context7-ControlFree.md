---
title: "E1 — Serena + Context7 no Control Free"
type: experiment
status: planned
updated: 2026-10-29
tags: [ai-agent-ecosystem, experiment, tokens, serena]
---
# E1 — Serena + Context7 no Control Free

## Hipótese
Recuperar código por símbolo ([[Serena]]) e documentação por API ([[Context7]]) reduz ≥30% dos tokens de uma tarefa Java sem piorar o resultado.

## Alvo
Projeto [[Control Free]] (Java/Spring). Caminho do repositório: **a confirmar com o Pedro**.

## Preparação
1. Decisão do Pedro sobre instalar `uv` (necessário para a Serena).
2. Serena em escopo de **projeto**, sem ferramentas de edição na primeira rodada (modo leitura, se disponível — verificar na doc).
3. Context7 já instalado (escopo de usuário).

## Procedimento
1. Escolher 2 tarefas reais equivalentes (ex.: corrigir bug + adicionar endpoint pequeno).
2. **Baseline:** executar sem Serena; registrar `/cost`, `/context`, leituras de arquivo, testes.
3. **Tratamento:** mesma tarefa (ou par equivalente) com Serena + regra docs-first.
4. Registrar RAM do processo da Serena.

## Métricas e critérios
| Métrica | Critério |
|---|---|
| Tokens totais | ≥30% menos |
| Testes | mesmos testes verdes |
| RAM | < 2 GB |
| Intervenções humanas | não aumentar |

## Decisão
≥30% adotar · 10–30% só repositórios grandes · <10% descartar. Ver [[ADR-006-Serena-Context7-condicionado-E1]].

## Resultado
Não executado.
