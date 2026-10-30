---
title: "Regras dos vídeos de fluxo"
type: reference
status: reference
updated: 2026-10-26
tags:
  - hermes
  - video-engine
  - rules
related:
  - "[[Knowledge/video-engine/README]]"
---

> Importado do Harness-Arquitetura-Flow (Faktory Flow) em 2026-10-26. Referência histórica do motor; o código genérico está em `video-engine/`. Índice: [[Knowledge/video-engine/README]].

# Regras dos vídeos de fluxo (motion + narração)

Vídeos curtos que explicam **um fluxo do Faktory Flow**: o conceito, a regra de negócio e o caminho nas telas. Público: estagiários, consultores e quem está chegando. Os vídeos ficam no Guia do Consultor, na aba "Vídeos de fluxo" e dentro da trilha correspondente.

## O que o vídeo precisa ter

1. **Abertura (até 8 s):** o problema do dia a dia que o fluxo resolve, em uma frase.
2. **Conceito (20–40 s):** o que é cada peça (ex.: lead, oportunidade, pedido, nota) e como uma vira a outra. Diagrama animado, sem tela ainda.
3. **Regras de negócio (30–60 s):** os bloqueios e condições que mais confundem. Cada regra vem de uma fonte `regra_negocio` da base (cite o id no roteiro) e aparece na tela como cartão curto.
4. **Na tela (60–120 s):** o caminho real, com a gravação do ambiente de teste ou a tela recriada. Destaque o botão ou campo antes de ele ser clicado.
5. **Armadilhas (15–30 s):** limitações conhecidas (`faq-limitacoes-conhecidas-…`) e o erro mais comum.
6. **Fechamento (até 10 s):** resumo em três tópicos e qual é o próximo vídeo da trilha.

Duração total: **2 a 4 minutos** por fluxo. Um vídeo por fluxo; se passar de 4 minutos, divida.

## Evidência (igual aos manuais)

- Toda afirmação sobre regra, bloqueio ou efeito entre módulos tem fonte na base: `regra_negocio`, `funcional`, `procedimento` ou manual oficial. Sem fonte, não entra.
- Nomes de telas, botões, campos, abas e status **exatamente** como no glossário (`glossary_lookup`). Na narração, fale o nome como aparece na tela.
- Limitação conhecida nunca é descrita como funcionamento correto: diga "hoje o sistema ainda…".
- Fonte com confiança B entra, mas o roteiro marca "B — revisar" até uma pessoa conferir.

## Narração

- Português do Brasil, tom calmo e próximo, falando com "você". Frases curtas (até ~20 palavras), uma ideia por frase.
- Ritmo de ~140 palavras por minuto; pausa curta entre cenas.
- Sem jargão técnico interno (MCP, índice, chunk). Termos do produto, sim, sempre explicados na primeira vez.
- Números e siglas por extenso quando ajudam a fala ("sessenta por cento", "B-A-N-T").
- Legendas sempre ligadas (acessibilidade e para assistir sem som), sincronizadas com a fala.

## Som

- Música calma de fundo, sem direitos autorais de terceiros (sintetizada ou com licença livre registrada).
- Música bem abaixo da voz: voz em torno de -16 LUFS, música 18–22 dB abaixo, com abaixamento automático (ducking) quando há fala.
- Efeitos sonoros sintetizados (ou com licença livre registrada), alinhados pelo pico ao movimento; a música respira (abaixa) antes dos golpes.
- Entrega final em -14 LUFS integrado, pico real até -1 dBFS (conferido por `scripts/qa.mjs` no repositório do Guia).
- **Uma voz só no vídeo inteiro:** a voz L, clonada da amostra escolhida pelo responsável. Voz só desenhada muda de timbre a cada frase e não é aceita.

## Imagem

- 1920×1080, 30 fps. Identidade visual Faktory Flow (logo, cores do Guia), fundo claro, animações suaves (sem piscar, sem cortes bruscos).
- Gravações só do **ambiente de teste**, com dados fictícios. Nenhum dado real de cliente, CNPJ, e-mail, valor de contrato ou código de registro do ambiente aparece legível; se aparecer, borre.
- Destaques: círculo ou moldura no elemento, cursor visível, zoom suave no ponto da ação.

## Segurança

- Nada de cliente real no vídeo, na narração ou no roteiro. Os vídeos são de produto (escopo geral).
- Senhas e tokens nunca aparecem na gravação.

## Produção

- O motor padrão é o **v6** (Remotion, no repositório do Guia do Consultor). Passo a passo, campos do roteiro e checagens: `workflows/produzir-video.md`.
- Renderizar, narrar de novo ou republicar vídeos só com **ordem explícita do responsável**. Mudança visual grande passa por prévia aprovada.
- **Sem engasgos:** a imagem nunca fica parada enquanto a voz corre (no máximo 1 s, e só como respiro planejado); nada aparece ou some de um quadro para o outro sem rampa, fora dos golpes planejados; nenhum quadro se repete no meio de um movimento.
- Nenhum vídeo é publicado com a checagem automática reprovada (pretos, imagem parada, engasgos, silêncio, volume, pico).

## Referências de produção

Ferramentas e repositórios estudados (padrões de roteiro, estilos e pipeline): veja `docs/producao-de-videos.md` e `docs/motor-de-video/` (pesquisas, especificação do v5, correções do v6 e roteiro do motor até o v10).
