---
title: "ADR-004 — Busca lexical primeiro"
type: adr
status: accepted
date: 2026-10-29
updated: 2026-10-29
tags: [ai-agent-ecosystem, adr, search]
---
# ADR-004 — Busca lexical primeiro

## Decisão
Busca lexical ponderada (título, tags, headings, caminho, frontmatter, corpo), sem acentos, com stopwords pt/en e filtros de frontmatter. Busca semântica foi **avaliada, não implementada** — ver [[Busca-Semantica-Avaliacao]].

## Motivo
Corpus pequeno (KB ~65 notas + skills + Harness), vocabulário controlado por frontmatter, zero dependências nativas, resultados explicáveis. Segue o ADR-005 do Harness (revisar perto de 500 notas).

## Gatilho de revisão
Mais de 500 documentos indexados **ou** 3 buscas reais falhando por sinônimo/paráfrase registradas no [[Research-History]].
