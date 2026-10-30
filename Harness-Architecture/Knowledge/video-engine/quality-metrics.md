---
title: Video Engine Quality Metrics
type: metrics
status: active
updated: 2026-10-26
tags:
  - hermes
  - video-engine
  - metrics
related:
  - "[[Knowledge/video-engine/README]]"
  - "[[Knowledge/video-engine/v6-no-stutters]]"
---

# Métricas de qualidade do motor de vídeo

Todos os números que o motor usa para produzir e aprovar um vídeo. Os valores saem do código em `video-engine/` (arquivo citado em cada linha) e da medição dos 12 vídeos do Flow em [[Knowledge/video-engine/v6-no-stutters]].

## Formato de saída

| Métrica | Valor | Onde |
|---|---|---|
| Resolução e quadros | 1920×1080, 30 fps | `src/MotorV6.tsx` (`FPS`), `src/Root.tsx` |
| Abertura fria | 33 quadros antes do vídeo | `ABERTURA_FRIA` |
| Master | H.264, CRF 18, JPEG 95 por quadro | `remotion.config.ts`, `remotion-em-partes.mjs` |
| Versão final | H.264 high, yuv420p, CRF 24, AAC 128k, faststart | `scripts/render.mjs` |
| Rascunho | escala 0,5, CRF 28 | `render.mjs --rascunho` |
| Render em blocos | 450 quadros (15 s) por processo, 3 tentativas | `remotion-em-partes.mjs` |

## Ritmo e narração

| Métrica | Valor | Onde |
|---|---|---|
| Respiro entre trechos | 0,9 s | `scripts/preparar.mjs` (`PAUSA`) |
| Pausa entre frases | 0,5 s | `scripts/frases.mjs` |
| Tamanho máximo da frase/legenda | ~110 caracteres (quebra em ponto, depois em vírgula) | `frases.mjs` |
| Estimativa sem áudio | 140 palavras por minuto | `preparar.mjs` |
| Velocidade da voz | 0,9 | `voz.exemplo.json` |
| Áudio de cada trecho | −16 LUFS, 48 kHz mono | `scripts/narrar.mjs` |

## Checagem automática (`scripts/qa.mjs`): reprova se passar do limite

| Defeito | Limite | Filtro do ffmpeg |
|---|---|---|
| Trecho preto | ≥ 0,5 s | `blackdetect=d=0.5:pix_th=0.08` |
| Quadro congelado | ≥ 5 s (fora dos 3 s finais) | `freezedetect=n=0.003:d=5` |
| Silêncio | ≥ 1,5 s abaixo de −50 dB | `silencedetect=n=-50dB:d=1.5` |
| Volume integrado | −14 LUFS ± 1 | `ebur128` |
| Pico real | até −1 dBFS | `ebur128=peak=true` |

Com `--folha`, gera a folha de contato: 1 quadro a cada 4 s, grade 6×8.

## Engasgos (`scripts/engasgos.mjs`)

Mede a mudança entre quadros seguidos (scene score, sem os 240 px da legenda) e aponta três defeitos:

| Defeito | Regra |
|---|---|
| **Parada** (tempo morto) | mudança < 0,0003 por 1 s ou mais, fora dos 3 s finais |
| **Repete** (movimento engasga) | quadro igual ao anterior com movimento (> 0,004) dos dois lados |
| **Pop** (salto sem rampa) | score > 0,03, mais de 8× a mediana de 6 vizinhos, vizinhos < ¼ do salto |

**Pops planejados** (não são defeito): o corte da abertura fria para o título (força 1) e o slam da regra crítica (≈ 0,54). Qualquer outro pop acima de 0,15 é para olhar no quadro.

## Resultado de referência (12 vídeos do Flow, v4 → v6)

- **Imagem parada:** caiu de 67–107 s por vídeo para 0–1,7 s.
- **Volume:** todos entre −13,9 e −14,2 LUFS, sem trechos pretos.
- **Paradas que sobraram (1,1 a 1,7 s):** telas com câmera e cursor lentos, logo acima do limite do detector. Ideias de correção em [[Knowledge/video-engine/pending-improvements]].
