---
title: "Estratégia de economia de tokens"
type: guide
status: active
updated: 2026-10-29
tags: [ai-agent-ecosystem, tokens, moc]
---
# Estratégia de economia de tokens

Entrada da área 05. Complementa `Optimization/token-strategy.md` do Harness (8 técnicas, sem medição) com ferramentas concretas e um plano de medição.

## Princípio: economia real × custo deslocado
- **Economia real:** menos tokens para o mesmo resultado (Serena em vez de ler arquivo inteiro; leitura por seção; resumir logs).
- **Custo deslocado:** o gasto vai para outro lugar (Mem0 chama LLM a cada escrita; roteadores mandam para outro provedor; Ollama local troca dinheiro por hardware e qualidade). Só contar como economia se a qualidade for medida.

## Onde está o custo (estimativa para tarefa de 60k)
| Fonte | Tokens (est.) | Alavanca | Economia (est.) |
|---|---|---|---|
| Leitura de código | 35k | [[Serena]], leitura por símbolo/seção | 40–60% |
| Logs e saídas | 15k | resumo pelo QA, [[Headroom]] | 30–60% |
| Documentação | 10k | [[Context7]] | 30–50% |
| **Total** | 60k | | **36–58% — não medido** |

## Notas da área
- [[Orcamento-de-Contexto]] — faixas por tipo de tarefa e regras de carga.
- [[Roteamento-de-Modelos]] — tier por papel.
- [[Compressao-e-Cache]] — compressão, cache de prompt, empacotamento.
- Ferramentas: [[Headroom]] · [[Repomix]] · [[LiteLLM]] · [[Claude-Code-Router]] · [[Graphify]] · [[Ponytail]] · [[Caveman]].

## Skills e ferramentas de economia (revisão de 29/10/2026)
| Alavanca | Ferramenta | Corta | Status | Regra |
|---|---|---|---|---|
| Leitura de código | [[Graphify]] | tokens de leitura (grafo AST local) | experimental | só `--code-only`, sem Graphify Cloud; atenção ao nome `graphifyy` no PyPI |
| Código gerado | [[Ponytail]] | output de código | experimental | só SKILL.md/AGENTS.md, sem hooks |
| Prosa das respostas | [[Caveman]] (só a skill) | output de texto | experimental | só em chat, nunca em notas/ADRs; CLI/proxy/Auto/Cloud descartados |

Proxies e roteadores de terceiros (Caveman Auto/Cloud, Graphify Cloud) ficam **fora** do [[Model-Router]], por independência de fornecedor e privacidade. As alegações de economia vêm dos autores e **não foram medidas**: medir contra a baseline F0 abaixo.

## Medição (F0)
Sem baseline não há economia comprovada. Registrar por tarefa: `/cost`, `/context`, nº de leituras de arquivo inteiro, nº de chamadas de tool, testes verdes. Ver [[Implementation-Roadmap]].

## Como o Agent-Knowledge-MCP economiza
Busca devolve só 5 resultados com trecho de ~220 caracteres; `get_document` tem `outline_only`, `heading` e `max_chars`; ferramentas específicas (`get_architecture`, `get_token_optimization`) devolvem o **sumário** por padrão. Medição real do tamanho das respostas: [[Validacao-Agent-Knowledge-MCP-2026-10-29]].
