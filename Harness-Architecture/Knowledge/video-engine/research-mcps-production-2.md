---
title: "Pesquisa: MCPs e linha de produção (2/2)"
type: reference
status: reference
updated: 2026-10-26
tags:
  - hermes
  - video-engine
  - research
related:
  - "[[Knowledge/video-engine/README]]"
---

> Importado do Harness-Arquitetura-Flow (Faktory Flow) em 2026-10-26. Referência histórica do motor; o código genérico está em `video-engine/`. Índice: [[Knowledge/video-engine/README]]. Parte 2 de 2; anterior: [[Knowledge/video-engine/research-mcps-production-1]].

## Roteiro da linha de produção

Linha: **roteiro → voz → telas → animação → mixagem → checagem → publicação**

| Etapa | v4 (próxima) | v5 | Além (v6 a v10) |
|---|---|---|---|
| Roteiro | Sem mudança (base `faktory-doc` e glossário) | Lista de pronúncia (siglas → como falar) alimentando a voz | Roteiro com marcação de ênfase e pausa que o TTS respeita |
| Voz | **Trocar o OmniVoice** por VoxCPM2 ou Chatterbox pt-BR (teste cego) | Voz fixa da marca (perfil salvo, seed fixa) | LoRA do VoxCPM2 com 5–10 min de voz contratada (contrato de cessão de voz) |
| Telas | **Prints 2x + caixas automáticas** pelo nome do glossário | Estados da tela capturados em sequência (antes e depois do clique) | Vídeo real com OBS e NVENC para fluxos longos |
| Animação | Legenda no **tempo por palavra** (WhisperX) | Cliques e destaques presos à palavra falada; destaque palavra a palavra | Itens de `pesquisa-motion-e-skills.md` |
| Mixagem | `loudnorm` em duas passadas e true peak −1 dBTP | **ACE-Step 1.5** com registro de faixas | Família de trilhas da marca; efeitos CC0 catalogados |
| Checagem | **QA ffmpeg** (preto, congelado, silêncio, LUFS) e WER da voz contra o roteiro | OCR contra o glossário; legenda sobre o elemento; tamanho mínimo de texto | Relatório HTML de QA por vídeo, com quadros problemáticos anexados |
| Publicação | `.srt` e capítulos gerados do JSON | Thumbnail com `renderStill`; versão "plate" para o CapCut | Publicação assistida (YouTube/LMS) com aprovação humana |
| Licenças | **Regularizar o Remotion (Company License)**; registro de licenças por ativo | Revisar a licença do Remotion 5 antes de migrar | Auditoria anual das licenças dos modelos |

**Regras para a v4 e depois:**
1. Nenhum modelo entra sem conferir a licença **dos pesos** (não só do código) e sem registro em uma tabela de licenças do projeto.
2. Nada de cliente sai da máquina: serviços na nuvem (ElevenLabs, Figma, MCPs hospedados) só com conteúdo neutro e decisão explícita do responsável.
3. Com 8 GB de VRAM: voz, transcrição e música rodam **uma de cada vez** e nunca junto com o render do Remotion.

---

## O que faltou conferir (pesquisa encerrada por limite de uso)

- Texto atual da Pixabay Content License (a página bloqueou o acesso automatizado).
- VRAM real do Chatterbox Multilingual pt-BR numa placa de 8 GB.
- Se o endpoint `POST :3900/v1/audio/transcriptions` do VoiceStudio devolve tempo por palavra (`timestamp_granularities=word`).
- Licença do `guimatheus92/mcp-video-analyzer`.
- Preços atuais de ElevenLabs, Azure Speech e Google Chirp para uso comercial.
- Avaliação jurídica das licenças com teto de receita (Fish Audio Community, Stability Community) e confirmação do número de funcionários e do faturamento da Faktory.
- Teste cego de voz pt-BR (adoção 2): ainda não foi feito.
