---
title: "Busca semântica — avaliação (não implementada)"
type: guide
status: proposed
updated: 2026-10-29
tags: [ai-agent-ecosystem, mcp, search, semantic]
---
# Busca semântica — avaliação (não implementada)

## Situação
O MCP usa busca lexical ([[ADR-004-Busca-Lexical-Primeiro]]). Esta nota só avalia a evolução.

## Opções
| Opção | Prós | Contras |
|---|---|---|
| Embeddings locais em Node (ex.: transformers.js + modelo pequeno multilíngue) | offline, sem custo por consulta | download de modelo (~100+ MB), CPU no Intel, dependência nativa/WASM — não testado |
| Ollama (embeddings) | já comum em setups locais | serviço extra; Ollama não verificado no Mac |
| API de embeddings | qualidade alta | envia conteúdo do vault para fora; custo |
| Híbrido BM25 + reordenação | melhora sem vetores | ganho menor em paráfrases |

## Recomendação
Manter lexical. Se o gatilho do ADR-004 disparar, testar **híbrido local**: índice lexical atual + embeddings locais só para reordenar os 20 melhores, com cache em disco fora do vault. Critério: ≥ 20% mais acertos no top-5 num conjunto de 20 perguntas reais, latência < 1 s.
