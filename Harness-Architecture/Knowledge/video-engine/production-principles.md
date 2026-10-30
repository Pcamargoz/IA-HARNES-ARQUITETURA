---
title: "Produção de vídeos: princípios e repositórios estudados"
type: reference
status: reference
updated: 2026-10-26
tags:
  - hermes
  - video-engine
  - production
related:
  - "[[Knowledge/video-engine/README]]"
---

> Importado do Harness-Arquitetura-Flow (Faktory Flow) em 2026-10-26. Referência histórica do motor; o código genérico está em `video-engine/`. Índice: [[Knowledge/video-engine/README]].

# Produção de vídeos de fluxo — referências e pipeline

Estudo de 2026-10-22 de oito repositórios públicos de vídeos feitos com o Claude Opus 5.5 escrevendo a animação em código. Só leitura: nada foi instalado ou executado a partir deles. As regras de conteúdo ficam em `harness/regras/videos-de-fluxo.md`; o roteiro sai do workflow `harness/workflows/roteirizar-video.md` (prompt `roteirizar-video` do MCP).

## Os oito repositórios

| Repositório | Licença | O que tem | O que aproveitamos |
|---|---|---|---|
| [yihui-dev/awesome-opus5-5-videos](https://github.com/yihui-dev/awesome-opus5-5-videos) | MIT | Coleção de vídeos virais com o prompt de cada um (seção *Explainers*) | Referência de prompts de explicativos; "peça um HTML único e grave" |
| [lemomo-ai/lemo-opuscar](https://github.com/lemomo-ai/lemo-opuscar) | MIT (código) · CC BY 4.0 (demos) | Plugin do Claude Code com ~59 estilos de filme em código; guias `DIRECTOR.md` e `TECHNIQUE.md`; narração TTS (Kokoro) e trilhas | Estilos **Living Screencast** (walkthrough de tela), **Swiss Motion Graphics**, **Whiteboard Explainer**, **Data Storytelling**. Instalar exige aprovação (baixa ferramentas para `~/lemo-opuscar`) |
| [mexicat/pdoom-video](https://github.com/mexicat/pdoom-video) | MIT | Clipe em three.js + Vite; alinhamento forçado palavra a palavra (Whisper), batidas, render 4K60 | Quadro = função pura do tempo; legendas palavra a palavra a partir do alinhamento |
| [JohnHeibel/PDoomVideo](https://github.com/JohnHeibel/PDoomVideo) | sem licença declarada | Mesmo clipe em p5.js; um arquivo por capítulo, timeline central, `STORYBOARD.md` | Uma cena por arquivo; timeline separada do visual; áudio mixado só no encoding. **Sem licença: só estudar, não copiar código** |
| [Vincentwei1021/mg-styles-15](https://github.com/Vincentwei1021/mg-styles-15) | MIT | 15 estilos de motion design, cada página expõe `window.renderAt(t)`; `template.md` de prompt | Estrutura de prompt em 4 blocos: especificação de saída, rota técnica, semente criativa, traços do estilo. Estilos sóbrios: Flat Vector, Line Art, Isometric |
| [JohnHeibel/ClaudeAnimationBase](https://github.com/JohnHeibel/ClaudeAnimationBase) | MIT | p5.js + p5.brush, personagem Clawd com 31 emoções | Ideia de personagem-guia. O Clawd é personagem da Anthropic: **não usar** na marca Faktory; criar um guia próprio se quisermos |
| [athemeroy/awesome-claude-5-5-videos](https://github.com/athemeroy/awesome-claude-5-5-videos) | CC BY 4.0 | 424 casos com fonte; cita *Video Production Skills* (pesquisa, plano, tempo de voz e legendas, entrega) | Etapas de produção: preparar ativos, áudio e entrega juntos; comparar tratamentos visuais antes de escolher |
| [joeseesun/opus-video-prompts](https://github.com/joeseesun/opus-video-prompts) | sem licença declarada | 18 prompts e 54 casos (chinês); "primeiro o storyboard, depois o código" | Modelo de explicativo: problema → conceito → passos → conclusão, TTS, legendas, trilha discreta. 1080p; rascunho a 30 fps; revisar quadros-chave antes do render completo |

## Princípios que adotamos

1. **Storyboard antes do código.** O roteiro (template `roteiro-video.md`) fecha narração, duração e visual de cada cena antes de animar.
2. **Quadro = função do tempo.** Cada cena calcula o que mostra a partir do tempo; prévia e exportação ficam idênticas e dá para renderizar em partes.
3. **Uma cena por arquivo, timeline central.** Textos e tempos da narração num arquivo de dados; o visual lê de lá.
4. **A voz manda no tempo.** Gera-se a narração primeiro, mede-se a duração de cada trecho e as cenas se ajustam a ela. Legendas saem do mesmo texto, com os tempos medidos.
5. **Áudio no fim.** Voz e música são mixadas no encoding, com a música abaixo da voz e ducking.
6. **Rascunho barato, final caprichado.** Rascunho em 720p/30 fps; final em 1080p/30 fps, H.264 `yuv420p`, AAC.

## Regras dos repositórios aplicadas no motor de vídeo (22/10/2026)

Do **lemo-opuscar** (`styles/living-screencast/STYLE.md` e `DIRECTOR.md`) e do **pdoom-video**:

| Regra | Como ficou no projeto `videos/` do Guia |
|---|---|
| Legenda ancorada à fala, permanência mínima max(1,8 s, fala + 0,6 s), sem cobrir o elemento | Narração gerada frase a frase; o tempo de cada frase vira a legenda exata; a pílula sobe quando o destaque está embaixo; vidro fosco neutro |
| Câmera: zoom ≥ 1, push-in no ponto da ação, drift lento na fala, nunca borrar texto a ler | Zoom 1,4 no foco, drift de 2,2 % enquanto a voz fala, spotlight que escurece em volta (sem blur) |
| Cursor com mola, empurrão no clique, nunca teleporta | Mola por foco, cursor continua de onde parou na tela anterior, "aperto" no clique |
| Pílula de capítulo; wipes, nunca dissolve | 01 Conceito · 02 Regras · 03 Na tela · 04 Cuidados; círculo entre capítulos, whip-pan entre telas |
| Toda ação visível tem som; música sob a voz; −14 LUFS | Clique sintetizado em cada ação, whoosh nas passagens, ducking da música, entrega em −14 LUFS |
| Legenda queimada e exportada; checagens antes de entregar | `.vtt` publicado junto do vídeo; `render.mjs` mede quadros pretos e volume integrado |

## Pipeline do Faktory (Guia do Consultor)

| Etapa | Ferramenta | Onde |
|---|---|---|
| Roteiro e regras | MCP `faktory-doc` (prompt `roteirizar-video`, `kb_search`, `glossary_lookup`) | este Harness |
| Gravação das telas | Navegador no **ambiente de teste**, dados fictícios | — |
| Animação | [Remotion](https://www.remotion.dev/) (React → MP4), mesma base de `docs/apresentacao/projeto-video/` | projeto de vídeos do Guia |
| Voz | [VoiceStudio](#voz-voicestudio) local (motor OmniVoice), voz clonada do consultor | app desktop, `http://127.0.0.1:3900` |
| Música | Sintetizada sem direitos de terceiros (`docs/apresentacao/projeto-video/musica/gerar_musica.py`) | — |
| Mixagem e entrega | ffmpeg (loudnorm, ducking, H.264 + AAC, `+faststart`) | — |
| Publicação | Guia do Consultor: aba "Vídeos de fluxo" e vídeo dentro de cada trilha | repositório do Guia |

## Voz: VoiceStudio

[debpalash/VoiceStudio](https://github.com/debpalash/VoiceStudio) (AGPL-3.0, conferido em 23/10/2026): alternativa local ao ElevenLabs, com clonagem de voz, voz desenhada por descrição, dublagem, transcrição e audiolivros. É o motor que o Guia do Consultor já usa em `videos/scripts/narrar.mjs`.

| Item | Como é |
|---|---|
| Instalação no Windows | Instalador `.exe` da [última release](https://github.com/debpalash/VoiceStudio/releases/latest), ou `irm https://voicestudio.sh/install \| iex`. O modelo OmniVoice (~2,3 GB) baixa no primeiro uso; a versão para CPU precisa de ~5 GB livres |
| Hardware | GPU NVIDIA usa CUDA. Sem GPU funciona na CPU, bem mais devagar (na estação antiga: ~5 min por frase e limite de 600 s por geração) |
| API local | `POST :3900/generate` (formulário com `text`, `language` e a voz: `ref_audio` + `ref_text` para clonar, ou `instruct` + `seed` para voz desenhada). Estado: `GET :3900/model/status` |
| MCP | Já vem no backend, em `http://localhost:3900/mcp/` (ou `python -m backend.mcp_shim` por stdio): `generate_speech`, `clone_voice`, `design_voice`, `describe_voice`, `transcribe`, `list_voices`, `check_health`. Com `OMNIVOICE_MCP_OUTPUT_MODE=files` e `OMNIVOICE_MCP_BASE_PATH`, o áudio vai para o disco em vez de voltar em base64 |
| Vozes do Guia | `videos/voz.json`: voz clonada do consultor (referência de 8 s em `videos/voz/`, fora do git). Reserva: `videos/voz-masculina.json` (`instruct: "male, middle-aged, low pitch"`, `seed: 7`) |
| Licença | AGPL-3.0 cobre o app. Pesos dos modelos e uso do áudio gerado têm condições próprias (ver o Model Manager). Só clonar voz com autorização do dono |

## Visual v2 e voz fixa (23/10/2026)

Aprovados pelo usuário com a prévia do vídeo Comercial. O código fica em `Guia-Do-Consultor/videos/src/FluxoVideo.tsx`.

| Tema | Decisão | Origem |
|---|---|---|
| Cor | Um significado por cor no vídeo inteiro: azul da marca = foco e estado atual; limão da marca = marcador (não existe na interface do Flow); laranja = cuidado; verde = concluído | lemo-opuscar `swiss-motion` e `whiteboard` |
| Tipografia | Inter (texto) e JetBrains Mono (caminho de menu, numerais, rótulos), guardadas no projeto | lemo-opuscar `TECHNIQUE.md`, pdoom-video |
| Movimento | Texto entra por máscara, nunca por fade; ícones desenhados pelo traço; mola dos objetos 250/23, do cursor 110/18, da câmera 45/13 (a câmera assenta depois do objeto); zoom ≤ 2,2 | lemo-opuscar, mg-styles-15, coleções de explicativos |
| Cenas | Numeral gigante atrás do cartão de regra; documento que percorre a linha de status; caminho de menu entrando trecho a trecho; parede com as telas do vídeo no fechamento | lemo-opuscar `DIRECTOR.md` |
| Som | Clique, whoosh, tick (cartão), check (sucesso) e alerta sintetizados; música ~10 dB abaixo da voz; entrega em −14 LUFS | lemo-opuscar, mg-styles-15 `template.md` |
| Voz | Voz L clonada da amostra escolhida. Voz só desenhada muda de timbre a cada frase, e o usuário recusou | teste com o usuário |
| Render | Blocos de 15 s em processos próprios, com nova tentativa e retomada (`scripts/remotion-em-partes.mjs`) | falhas do render longo nesta estação |

## Segunda leva de repositórios (23/10/2026)

Estudo só de leitura (API do GitHub e arquivos raw). Nada foi instalado nem executado.

| Repositório | Licença | Veredito | Motivo |
|---|---|---|---|
| [Vincentwei1021/video-shotcraft](https://github.com/Vincentwei1021/video-shotcraft) | Apache-2.0 | **usar agora** (ideias e parâmetros) | Skill de Remotion para vídeos de produto com prints reais: 124 cartões de tomada em `references/shots/<categoria>/` (camera, data, effects, interaction, opening, outro, rhythm, transition, typography, ui-entrance) e regras em `references/aesthetic-rules.md`. **Não usar os áudios**: parte deles não tem origem rastreável |
| [blendi-remade/dioramas](https://github.com/blendi-remade/dioramas) | MIT | depois, só como ideia | Acabamento (grão, vinheta, luz de borda) poderia virar CSS no fundo; o 3D não serve |
| [img2threejs/img2threejs](https://github.com/img2threejs/img2threejs) | Apache-2.0 | não serve | Reconstrói objetos em Three.js; vídeo de ERP não tem objeto 3D |
| [MaxLiu22/Motion2MixamoRig](https://github.com/MaxLiu22/Motion2MixamoRig) | Apache-2.0 | não serve | Movimento de pessoa para personagem 3D; ~5 GB de pesos; só Mac |
| [sixtysevenlf/dsh-blender-plugin](https://github.com/sixtysevenlf/dsh-blender-plugin) | BSD-3-Clause | não serve | Blender via DeepSeek Harness |
| [mcncarl/jianying-headless](https://github.com/mcncarl/jianying-headless) | não comercial | **não usar** | A licença proíbe uso por empresa; só Jianying para macOS, sem CapCut internacional |

Cartões do video-shotcraft mais úteis para as nossas cenas: `camera/cursor-flyover` (câmera da tela com recuo no meio do voo, desfoque pela velocidade, recuo final), `effects/scanline-annotate-focus` (cantos em L que fecham no campo + rótulo mono digitado), `camera/crash-zoom-punch` e `rhythm/speed-ramp-freeze` (um momento de impacto por vídeo), `interaction/type-and-filter`, `ui-entrance/row-embed`, `ui-entrance/product-card-progressive-assemble`, `ui-entrance/draw-svg-trace`, `typography/marker-underline-title`, `typography/title-demote-to-label`, `transition/line-carry-transition`, `data/timeline-travel`, `ui-entrance/list-stack-press`, `outro/ui-strip-away-outro` e o whip com freio de `transition/shot-transitions`.

Melhorias propostas para o motor (v3), em ordem: (1) prints capturados em 2x para o zoom não amolecer a imagem (exige regravar as telas no DEV); (2) câmera no estilo cursor-flyover; (3) cantos em L com o nome do campo, conferido no glossário; (4) um momento de impacto por vídeo na regra mais crítica; (5) costura entre capítulos (título que vira a pílula, linha de status que desenha a moldura da regra).

Projeto editável no CapCut: as ferramentas existentes visam o Jianying chinês e não foram testadas no Windows. Caminho seguro: exportar uma versão sem legenda e sem música, com a legenda `.srt` e os áudios separados, para montar no CapCut à mão.
