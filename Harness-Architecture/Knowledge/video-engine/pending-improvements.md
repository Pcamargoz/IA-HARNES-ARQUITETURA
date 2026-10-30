---
title: "Melhorias pendentes do motor"
type: reference
status: reference
updated: 2026-10-26
tags:
  - hermes
  - video-engine
  - backlog
related:
  - "[[Knowledge/video-engine/README]]"
---

> Importado do Harness-Arquitetura-Flow (Faktory Flow) em 2026-10-26. Referência histórica do motor; o código genérico está em `video-engine/`. Índice: [[Knowledge/video-engine/README]].

# Melhorias pendentes dos vídeos de fluxo

Pontos que ficaram para a próxima refação, levantados na produção de 24 e 25/10/2026 (motor v6, voz L a 0,9). Os 12 vídeos publicados estão bons para uso; esta lista é o que ainda dá para refinar. Antes de refazer, leia "Como refazer" no fim.

## 1. Já corrigido no motor, falta renderizar

| # | O que é | Onde aparece | O que fazer |
|---|---|---|---|
| 1.1 | Na passagem da regra para a tela, a palavra "TELA" surge por cima do cartão da regra por cerca de 5 quadros, antes de o papel subir. O motor (`src/FluxoVideoV6.tsx`, `PortaDeLetra`) já põe letras e rótulo dentro da cortina | Os 12 vídeos, na entrada do capítulo 03 · Na tela | Renderizar de novo (só imagem; a narração está em cache). O responsável viu a comparação em 25/10/2026 e preferiu publicar sem esta correção |
| 1.2 | Telas de foco único com fala longa ficam de 1 a 2 s quase paradas. O motor já avança a câmera até 8% no foco (antes 3%) e a câmera viva até 10% | Produção 2:01 (1,1 s), Expedição 2:02 (1,6 s), Fluxo 1 · Vendas 1:45 (1,7 s). Estoque, Faturamento, Financeiro e Suprimentos já têm a correção | Entra no mesmo re-render do item 1.1 |

## 2. Para melhorar no motor

| # | O que é | Onde aparece | Ideia |
|---|---|---|---|
| 2.1 | Parada de 1,1 s mesmo com a correção 1.2: câmera e cursor se mexem, mas devagar, e o detector marca | Financeiro 2:18 (tela 03b-parcial) | Distribuir os focos pelas frases da fala (`legendas` + `nomes`) em vez de fatias iguais; mudar de foco nas pausas entre frases (product-demo-director `docs/EDITING.md`) |
| 2.2 | Quadros repetidos no meio de um movimento (1 a 14 por vídeo), quase sempre no começo de um movimento que arranca de muito devagar | Mais no Serviços (14) e no Fluxo completo (9) | Ver cada um com `scripts/engasgos.mjs`; dar velocidade inicial às curvas de voo da câmera (`VOO`) e do empurrão de pilha |
| 2.3 | O corte da abertura fria para o título é seco (planejado no v5) e o detector marca com força 1 | 0:01 de todos | Avaliar com o responsável se fica seco ou ganha 3 a 4 quadros de transição |
| 2.4 | Cortar em movimento: hoje as passagens começam do repouso | Todas as passagens | Terminar a cena no pico de velocidade e casar os 6 últimos quadros de uma cena com os 6 primeiros da seguinte (motionmaxxing `transitions.md` R1.1 e R1.2) |
| 2.5 | Blocos do render em mp4 emendados com `concat -c copy` (funciona, sem defeito medido) | Render | Se um dia a emenda falhar, usar `h264-ts` e `combineChunks()` do Remotion |

## 3. Narração

| # | O que é | Onde aparece | O que fazer |
|---|---|---|---|
| 3.1 | A conferência por transcrição (`scripts/conferir_narracao.py`, Whisper `small`) dá alarme falso quando o Whisper erra a palavra | Estoque 03 e 06 ("fotografa o saldo", "Super Usuário"), Faturamento 06 ("almoxarifado"), Suprimentos 12 (número da NF), Serviços 10 ("Na lista") | Ouvidos em 25/10/2026: o áudio está inteiro. Para menos alarme falso, usar um modelo maior (`--modelo medium` ou large-v3) |
| 3.2 | O OmniVoice às vezes não termina uma frase e o VoiceStudio abandona depois de 300 s | Aconteceu no Financeiro 06.2 | Já tratado: `narrar.mjs` espera e repete com a semente seguinte (até 3 vezes). Se repetir muito, trocar a frase de lugar ou dividi-la |
| 3.3 | Licença: os pesos do OmniVoice (voz L) são CC-BY-NC | Todos | Decisão do responsável de manter. Alternativa de uso comercial livre já instalada no F:: VoxCPM2 (Apache-2.0, 48 kHz), que também clona a amostra da voz L |
| 3.4 | Valores da conta de teste ditos na fala ("mil duzentos e trinta reais…", "cinquenta reais de um título de cento e vinte e cinco") | Financeiro 10 a 12 | São dados fictícios do ambiente de teste, mas a regra do Harness pede vídeo sem valores: confirmar com o responsável se ficam |


## Como refazer

1. VoiceStudio aberto (`curl http://127.0.0.1:3900/health` mostra `cuda`).
2. Só imagem (itens da seção 1 e 2): `SEM_CONFERENCIA=1 node scripts/lote.mjs <ids…>`. A narração em cache é reaproveitada.
3. Com texto novo: edite `roteiros/<id>.json` e rode `node scripts/lote.mjs <id>` (narra o que mudou, confere, renderiza, publica e mede).
4. Antes de uma fila inteira, teste o motor num trecho: `node scripts/remotion-em-partes.mjs <id> out/teste.mp4 --de <s> --ate <s>` e `node scripts/engasgos.mjs <id> out/teste.mp4 --inicio <s>`.
5. Depois de cada vídeo, confira a saída de `engasgos.mjs`: pops planejados são o corte da abertura fria (força 1) e o slam da regra crítica (≈0,54); qualquer outro pop forte (acima de 0,15) é para olhar no quadro.

Histórico das decisões e números: `docs/motor-de-video/v6-sem-engasgos.md` no Harness-Arquitetura-Flow.
