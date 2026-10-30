---
title: Video Engine — How to Run
type: guide
status: active
updated: 2026-10-26
tags:
  - hermes
  - video-engine
  - setup
related:
  - "[[Knowledge/video-engine/README]]"
---

# Motor de vídeo v6: como rodar

Código do motor (Remotion 4). O que ele é, as cenas e o conhecimento por trás estão em [[Knowledge/video-engine/README]]; as métricas em [[Knowledge/video-engine/quality-metrics]].

## Instalar

```bash
cd video-engine
npm install
```

Precisa de Node 18+. Para o render final e as checagens, **ffmpeg e ffprobe** no PATH (`brew install ffmpeg`). Na primeira vez, o Remotion baixa o Chrome Headless Shell; para usar um Chrome instalado, defina `CHROME_PATH`.

## Fazer um vídeo novo

1. **Roteiro:** copie `roteiros/exemplo.json` para `roteiros/<id>.json` e escreva os trechos (cenas na nota do motor).
2. **Narração** (opcional): com o VoiceStudio rodando em `127.0.0.1:3900` (ou `VOICESTUDIO_URL`), copie `voz.exemplo.json` para `voz.json` e rode `npm run narrar -- <id>`. Sem narração, o motor estima o tempo pela fala (140 palavras/min) e o vídeo sai mudo.
3. **Telas** (só para cenas `tela`): `npm run gravar -- --url <endereço do sistema>` abre o Chrome; faça o login e mande comandos com `node scripts/cmd.mjs`. As capturas vão para `capturas/<id>/`.
4. **Preparar:** `npm run preparar -- <id>` gera `src/gerado/<id>.json`.
5. **Registrar:** importe o JSON em `src/Root.tsx` e ponha na lista `VIDEOS`.
6. **Ver:** `npm run studio` abre o Remotion Studio.
7. **Renderizar:** `npm run render -- <id>` (ou `--rascunho`). Sai em `out/<id>.mp4`, `.vtt`, `.jpg` e a folha de contato, já com o `qa`.

## Ferramentas

| Comando | O que faz |
|---|---|
| `node scripts/quadros.mjs <id> <pasta> <quadro>...` | Renderiza quadros avulsos para revisar (não precisa de ffmpeg) |
| `node scripts/remotion-em-partes.mjs <id> out/teste.mp4 --de <s> --ate <s>` | Renderiza só um trecho, para testar mudança no motor |
| `npm run qa -- out/<id>.mp4 --folha out/folha.jpg` | Checagem automática (pretos, congelados, silêncio, LUFS, pico) |
| `npm run engasgos -- <id>` | Detector de paradas, quadros repetidos e pops |
| `node scripts/lote.mjs <id>...` | Fila: narra, confere, renderiza e mede vários vídeos |
| `npm run sfx` / `npm run musica` | Gera os efeitos sonoros e a música (Python + numpy) |

## Personalizar

- **Marca:** troque `public/marca/logo.svg` e o `MARCA` no topo de `src/MotorV6.tsx` (`logo` e `nome`).
- **Cores:** objeto `C` no topo de `src/MotorV6.tsx` (uma cor por significado: azul foco, limão marcador, laranja cuidado, verde concluído).
- **Pronúncia:** lista `PRONUNCIA` em `scripts/frases.mjs`.

## Fora do Git

`node_modules/`, `out/`, `voz/`, `voz.json`, `capturas/`, `public/audio/`, `public/telas/` e `public/musica/` (ver `.gitignore`).
