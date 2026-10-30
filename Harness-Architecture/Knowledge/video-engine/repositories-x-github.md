---
title: "Repositórios, skills e ferramentas (X e GitHub)"
type: reference
status: reference
updated: 2026-10-26
tags:
  - hermes
  - video-engine
  - repositories
related:
  - "[[Knowledge/video-engine/README]]"
---

> Importado do Harness-Arquitetura-Flow (Faktory Flow) em 2026-10-26. Referência histórica do motor; o código genérico está em `video-engine/`. Índice: [[Knowledge/video-engine/README]].

# Pesquisa no X e no GitHub: o que ainda não estudamos

Data: 23/10/2026. Objetivo: achar repositórios, plugins e skills **gratuitos** e conhecidos que possam levar o motor de vídeos de fluxo do Faktory Flow (Remotion 4, 1920×1080, Claude Code como agente) ao nível de um editor profissional. Pesquisa feita só lendo: nada foi instalado nem executado.

Ficou de fora de propósito o que já está em `producao-de-videos.md`, `pesquisa-motion-e-skills.md` e `pesquisa-mcps-e-producao.md` (lemo-opuscar, mg-styles-15, video-shotcraft, pdoom-video, PDoomVideo, ClaudeAnimationBase, awesome-opus5-5-videos, awesome-claude-5-5-videos, opus-video-prompts, dioramas, img2threejs, Motion2MixamoRig, dsh-blender-plugin, jianying-headless, @remotion/*, Motion Canvas, Revideo, Theatre.js, GSAP, Lottie, Rive, HyperFrames, VoiceStudio, WhisperX, Kokoro, Chatterbox, F5-TTS, XTTS, ACE-Step, MusicGen, Playwright MCP, PaddleOCR, Cap, OBS, claude-code-video-toolkit, claude-remotion-skill, motion-graphics, motion-graphics-skills, product-launch-motion e os demais das tabelas). A especificação de efeitos (`spec-v5-exagerado.md`) está com outro agente; aqui só entram fontes novas.

## Como pesquisamos

**X/Twitter.** O X pede login e devolveu "402" ao abrir posts direto, então usamos o texto que os buscadores mostram e seguimos os links para o GitHub. Buscas feitas:

- `site:x.com Remotion "Claude Code" video skill`
- `site:x.com "motion graphics" Claude Opus Remotion product demo video`
- `site:x.com remotion skill github "open source" product video` (busca estendida)
- `site:x.com "Claude Code" skill "motion design" OR "motion graphics" github repo free` (busca estendida)
- `site:x.com "Screen Studio" open source alternative github auto zoom`
- `site:x.com open source screen recorder auto zoom cursor "github" free`
- `site:x.com kinetic typography React open source library motion`
- `site:x.com "SaaS" explainer video Remotion open source template launch`
- `site:x.com "product demo video" code Remotion components open source`
- Texto do fio "Claude can now cut, grade, caption, and render your videos" e "15 GitHub repos that turn Opus 5.5 into a full motion-design studio", para achar espelhos dos fios.

Posts do X que levaram a repositórios: Brady Long (@thisguyknowsai, fio com 10 repositórios de edição com Claude), Gregor Zunic (@gregpr07, lançamento do video-use), Shadcn Labs (@shadcnlabs, lançamento do snapcn), KapishDima (@kapish_dima, lançamento do Remocn), Francesco (@francedot, abertura do trycua/launchpad), The AI Solopreneur (@aisolopreneur, motionmaxxing), Ram Maheshwari (@rammcodes, motion-designer), 0xMarioNawfal/RoundtableSpace (fio "15 repositórios" e OpenMontage), JJ Englert (@JJEnglert, pacote de skills de motion).

**GitHub e catálogos.** Página oficial de recursos da comunidade do Remotion (`remotion.dev/docs/resources`), lista `zhuyansen/awesome-claude-video-skills` (180 repositórios com nota de segurança), catálogo `agentskillshub.top/best/claude-video-skills` (335 itens com nota), `claudemarketplaces.com`, AlternativeTo para alternativas ao Screen Studio, e a página de cada repositório para conferir licença e estrelas. Buscas de apoio: alternativas abertas ao Screen Studio, `awesome-remotion`, `awesome-claude-skills video`, `@gl-transitions/remotion`, sons CC0 de interface (Kenney), skill de motion design da LottieFiles.

Estrelas são aproximadas e tiradas da página do repositório no dia; quando só um agregador deu o número, está marcado.

## Tabela

Legenda do veredito: **agora** = vale entrar no motor já; **depois** = útil, mas não é prioridade ou precisa de teste; **ideia** = só copiar a técnica (licença ou dependência impede usar o código); **não serve**.

### Componentes e bibliotecas para Remotion

| Nome | Link | Licença | Estrelas | Onde achamos | O que traz | Veredito |
|---|---|---|---|---|---|---|
| snapcn | https://github.com/snapcndev/snapcn | MIT | ~500 | Post da @shadcnlabs no X; recursos do Remotion | Componentes "feitos para mostrar software", copiados para o projeto pelo shadcn CLI: search-typing, prompt-zoom, answer-stream, laptop-frame, phone-frame, terminal-simulator, text-highlight, text-reveal, word-flip, karaoke-captions, word-captions, pulsing-border. O README lista 21; o post fala em 100+ | **agora** |
| Remocn | https://github.com/kapishdima/remocn | MIT | ~1,6 mil | Post da @kapish_dima no X; recursos do Remotion | Registro shadcn com animações, tipografia cinética, transições, fundos e cenas (ex.: blur-reveal); um agregador fala em 234 componentes. Tem skill (`npx skills add Remocn/remocn`) e plugin do Claude Code com `/remocn:video` | **agora** |
| remotion-bits | https://github.com/av/remotion-bits | MIT | ~500 | Recursos do Remotion | Blocos prontos (texto animado, partículas, gradientes, cenas 3D, gráficos) e um **MCP** com `find_remotion_bits` / `fetch_remotion_bit` para o agente buscar o bloco certo | **depois** |
| RemotionUI | https://github.com/riaz37/remotion-ui | MIT | ~70 | Recursos do Remotion | 206 componentes (cenas, primitivas, transições, shaders, mapas, molduras de aparelho), índice para agentes (`components.json`, `llms.txt`) e MCP | **depois** (pouco usado; testar qualidade) |
| Onda | https://github.com/degueba/onda | MIT (nome e logo fora) | ~30 | Recursos do Remotion | 70 componentes e 18 transições para `TransitionSeries` (crossFade, morph, wipe), cada um com schema Zod | **depois** |
| remotion-animated | https://github.com/stefanwittwer/remotion-animated | não conferida | — | Recursos do Remotion | Animação declarativa no JSX (Move, Scale, Rotate, Fade, Size) em vez de muitos `interpolate` | **depois** (conferir licença) |
| remotion-subtitles | https://github.com/ahgsql/remotion-subtitles | MIT | ~100 | Recursos do Remotion | 16 estilos de legenda a partir de SRT (Typewriter, Zoom, Glowing, TiltShift, Glitch…) | **depois** (estilos de "reels", pouco sóbrios) |
| gl-transitions | https://github.com/gl-transitions/gl-transitions | MIT (2 shaders BSD) | ~2,2 mil | Guia de contribuição do Remotion | Mais de 100 transições em GLSL (`from`, `to`, `progress`). O guia do Remotion explica como portar para uma `presentation` de `@remotion/transitions` (inverter o tempo e citar autor e licença). Não achamos o pacote `@gl-transitions/remotion` no npm | **agora** (portar 4 a 6) |
| remotion-gl-transitions | https://github.com/remotion-dev/remotion-gl-transitions | não declarada | ~30 | Recursos do Remotion | Exemplo antigo do time do Remotion com gl-transitions | **ideia** (só referência) |
| trycua/launchpad | https://github.com/trycua/launchpad | MIT | ~500 | Post do @francedot no X | Monorepo Remotion de uma startup: modelo de vídeo, componentes compartilhados (FadeIn, SlideUp, TextReveal), marca e efeitos sonoros num pacote, guia de trabalho com Claude Code | **ideia** (organização de pacotes) |
| Magic UI | https://github.com/magicuidesign/magicui | MIT | ~23 mil | GitHub (componentes animados) | Componentes animados de interface para copiar (texto, fundos, molduras). São feitos para web em tempo real: precisam ser reescritos para o quadro do Remotion | **depois** |
| React Bits | https://github.com/DavidHDev/react-bits | MIT + Commons Clause | ~50 mil | GitHub | 33 animações de texto, 63 fundos (shaders, partículas). A Commons Clause proíbe vender a biblioteca, não usar em vídeo; mesmo assim, marcar para o jurídico. Também é tempo real (CSS/RAF) | **depois** (marcar licença) |
| Paper Shaders | https://github.com/paper-design/shaders | Apache-2.0 | ~3,8 mil | GitHub | Fundos em shader para React (`@paper-design/shaders-react`), como MeshGradient e DotOrbit, sem atribuição visível | **agora** (para fundos; ver risco de tempo) |
| pmndrs/postprocessing | https://github.com/pmndrs/postprocessing | Zlib | ~2,9 mil | GitHub | Bloom, profundidade de campo, vinheta, aberração cromática, ruído, glitch, raios de luz para Three.js (usar via `@react-three/postprocessing` com `@remotion/three`) | **depois** |
| LYGIA | https://github.com/patriciogonzalezvivo/lygia | Prosperity 3.0 (não comercial) + Patron | ~3,5 mil | GitHub | Biblioteca de funções de shader | **não serve** (uso comercial só pago ou patrocinando) |

### Skills e plugins de agente para vídeo

| Nome | Link | Licença | Estrelas | Onde achamos | O que traz | Veredito |
|---|---|---|---|---|---|---|
| LottieFiles motion-design-skill | https://github.com/lottiefiles/motion-design-skill | MIT | ~2,4 mil | Fio de skills no X; busca | Os 12 princípios da Disney adaptados para interface, checklist de 8 passos, arquétipos de "personalidade" de movimento, tabelas de duração e easing, coreografia de vários elementos. Vale para qualquer motor | **agora** |
| motionmaxxing | https://github.com/Tejashmakwana/motionmaxxing | Apache-2.0 (GSAP com licença própria) | ~1 mil | Post do @aisolopreneur no X; awesome-claude-video-skills | Regras e portões G0–G5 contra o "visual de IA": cortar em movimento, nada de 3+ quadros parados, entrar movendo e não só esmaecendo, não crescer do zero, movimento mediano de ~10 quadros medido em 53 peças profissionais, lint que acusa enfeites de "UI de vibe coding" | **agora** (regras; não o runtime GSAP) |
| motion-video-kit | https://github.com/echris6/motion-video-kit | MIT | ~1,2 mil | awesome-claude-video-skills; catálogo agentskillshub | "Gauntlet": crítico separado do construtor revisa o render, item por item, com livro de registro; régua mensurável (tempo de quadro congelado, loudness, contraste, cor da marca); 16 mecanismos de movimento; padrões Three.js determinísticos; blur por acumulação | **agora** (loop crítico e régua) |
| motion-designer | https://github.com/kaventro/motion-designer | MIT (algumas músicas CC BY / Mixkit) | ~110 | Post do @rammcodes no X | Reconstrói a tela real em HTML numa moldura de notebook/celular; `beats.py` acha tempo e tempos fortes e `music_edit.py` corta por compasso; `check.mjs` acusa relógio, `Math.random` e animação CSS; tudo local (ACE-Step, Kokoro, Chatterbox) | **agora** (beats.py e check) |
| iart-ai/motion-skills | https://github.com/iart-ai/motion-skills | MIT | ~970 | Catálogo agentskillshub | 50+ skills em pacotes (tipografia cinética, explicativos, terços inferiores, dados animados, motion design), com scripts de contact sheet e sonda de MP4. Renderiza com Remotion | **depois** |
| charlie947/motion-graphics-skills | https://github.com/charlie947/motion-graphics-skills | MIT | ~370 | awesome-claude-video-skills; fio do JJ Englert | 15 skills (brand-intake gera `brand.md`/`MOTION.md`, vox-explainer, animated-chart, title-sequence-3d, motion-effects…), sem chave de API | **depois** (ideia do `MOTION.md` da marca) |
| diffusionstudio/lottie | https://github.com/diffusionstudio/lottie | MIT | ~5,6 mil | awesome-claude-video-skills | Skill `text-to-lottie`: o agente gera JSON Lottie com prévia ao vivo. O JSON roda no `@remotion/lottie` (não confirmado no README) | **depois** (ícones animados) |
| video-use | https://github.com/browser-use/video-use | MIT | ~29 mil | Post do @gregpr07 e fio do @thisguyknowsai no X | Edição de gravação bruta: tira "é…", silêncio, grade de cor, legenda de 2 palavras, fade de 30 ms em todo corte, revisão de cada corte com até 3 re-renders, `project.md` de memória. Transcrição depende do ElevenLabs Scribe (pago) | **ideia** (fade de 30 ms, revisão por corte) |
| product-demo-director | https://github.com/crimeacs/product-demo-director | MIT | ~40 | awesome-claude-video-skills | `pace.py` move os cortes para as pausas entre frases completas; zoom declarado por plano com foco; `framing.py` mede o tamanho do texto na tela; QA de quadro preto, silêncio, loudness e contagem de quadros; revisão em telas de 320 e 390 px. Narração via ElevenLabs | **ideia** (pace e framing) |
| demo-video-skill | https://github.com/surajshetty3416/demo-video-skill | MIT | ~5 | awesome-claude-video-skills | Playwright avança a tela em passos e tira um print por quadro (não grava em tempo real), câmera virtual com foco e zoom por quadro, cursor vetorial desenhado com anel no clique; extensão Chrome grava pelo screencast do CDP sem cursor do sistema e monta a câmera por grupos de cliques | **agora** (técnica; casa com nosso Playwright) |
| cursorcam | https://github.com/Avijit07x/cursorcam | Apache-2.0 | ~70 | awesome-claude-video-skills; catálogo agentskillshub | Agente percorre o app num navegador oculto a partir de um JSON de passos (`click`, `type`, `press`, `waitFor`, alvos `role=`/`label=`/`text=`) e devolve MP4 1080p60 com zoom em cada clique; pede login ao usuário sem guardar | **depois** (formato de passos) |
| saas-motion-kit | https://github.com/tugrawork-creator/saas-motion-kit | MIT (fontes OFL) | ~240 | awesome-claude-video-skills | Atlas de 24 transições narrativas com demo (match cut, carregar elemento, movimento de câmera, máscara, material, tempo); 101 temas de storyboard; render em 4K e redução Lanczos para 1080p; checagem de loop. Base HyperFrames | **ideia** (atlas de transições) |
| agent-video-editor | https://github.com/kmilo93sd/agent-video-editor | MIT; sons e gráficos CC0 | ~6 | awesome-claude-video-skills | 113 efeitos e 15 músicas CC0 (Kenney, OpenGameArt, gerados) com `LICENSES.md`; 10 regras de edição (música 18 a 25 dB abaixo da voz, −14 LUFS/−1 dBTP, gráfico no máximo 0,5 s antes da palavra, legenda de 42 caracteres × 2 linhas, zoom só motivado e nunca atravessando corte) | **agora** (regras; sons depois de conferir) |
| remotion-qa | https://github.com/GroMarketing/remotion-qa | MIT | 0 | Recursos do Remotion | Mede o MP4: ar morto, texto que sai antes de dar tempo de ler sem som, letra pequena, áreas seguras; CLI, Action e plugin do Claude Code | **depois** (novo, sem uso; copiar a ideia do teste de leitura) |
| remotion-superpowers | https://github.com/DojoCodingLabs/remotion-superpowers | MIT | ~140 | Busca de fios no X | Plugin com 13 comandos e 5 MCPs; o central depende de chave paga (KIE) e de TwelveLabs | **não serve** (depende de APIs pagas) |
| OpenMontage | https://github.com/calesthio/OpenMontage | AGPL-3.0 | ~71 mil | Post da @RoundtableSpace no X; catálogos | Sistema completo com 11 pipelines (inclui Screen Demo), portões de aprovação humana, folha de storyboard, auto-revisão com ffprobe | **ideia** (AGPL; não incorporar código) |
| onetake | https://github.com/feitangyuan/onetake | PolyForm Noncommercial | ~3 mil | Catálogo agentskillshub | Filme em plano-sequência: cada cena nasce de um elemento da anterior, `probe.py` dá nota de "continuidade", blur de obturador de 180° em luz linear | **não serve** (não comercial; a ideia do "carry" já é conhecida) |
| guizang-product-video-skill | https://github.com/op7418/guizang-product-video-skill | AGPL-3.0 + BSL 1.1 em parte | ~850 | Catálogos | Vídeo de atualização de produto a partir do repositório, usando componentes reais clicados; música e SFX sintetizados por código com registro de licença; abaixa a música nos sons de retorno | **não serve** (AGPL/BSL) |

### Gravação de tela com zoom automático (alternativas abertas ao Screen Studio)

| Nome | Link | Licença | Estrelas | Onde achamos | O que traz | Veredito |
|---|---|---|---|---|---|---|
| OpenScreen | https://github.com/siddharthvaddem/openscreen | MIT | ~40 mil | Busca; AlternativeTo; blogs | Zoom automático ou manual com profundidade, duração e easing; cursor suavizado com efeito de clique; anotações. **Arquivado**; continuação em `getopenscreen/openscreen` | **ideia** (ler o código de zoom e suavização, MIT) |
| Recordly | https://github.com/webadderallorg/Recordly | AGPL-3.0 (espelhos dizem MIT; o repositório diz AGPL) | ~35 mil (agregador) | Busca; AlternativeTo | Fork do OpenScreen: sugestão de zoom pela atividade do cursor, cursor com suavização, blur, quique no clique e balanço | **ideia** (não copiar código: AGPL) |
| Screenize | https://github.com/syi0808/screenize | Apache-2.0 | ~620 | AlternativeTo | Duas câmeras inteligentes (segue o cursor com mola; ou planeja zoom por atividade: digitar, clicar, rolar, arrastar), ondas no clique, selo de atalho de teclado. Só macOS; desenvolvimento pausado | **ideia** (zoom por tipo de atividade) |
| Reframed | https://github.com/jkuri/reframed | MIT | ~170 | Busca no X (resultado de terceiros) | Zoom por agrupamento de cliques e tempo de permanência; keyframes com interpolação Hermite; cursor SVG, holofote que escurece fora do raio do cursor; 30 sons de clique. Só macOS 15 | **ideia** (holofote e agrupamento) |
| ScreenArc | https://github.com/tamnguyenvan/screenarc | GPL-3.0 | ~450 (agregador) | AlternativeTo | Pan e zoom automáticos pelos cliques, editor de linha do tempo | **não serve** (GPL; o OpenScreen cobre o mesmo em MIT) |
| Screenity | (extensão do Chrome; repositório não aberto) | não conferida | — | AlternativeTo | Gravação no navegador com destaque de clique e zoom | **não serve** (não conferido; o Playwright já cobre) |

### Som

| Nome | Link | Licença | Estrelas | Onde achamos | O que traz | Veredito |
|---|---|---|---|---|---|---|
| Kenney (Interface Sounds, UI Audio) | https://kenney.nl/assets (espelho: https://opengameart.org/content/interface-sounds) | CC0 | — | Busca; citado pelo agent-video-editor | 100 sons de interface (cliques, encaixes, abrir, confirmar) e 50 de UI; crédito pedido, não obrigatório | **agora** (completar o banco de SFX) |
| ZzFX | https://github.com/KilledByAPixel/ZzFX | MIT | ~800 | GitHub | Gerador de SFX de 1 KB com 20 parâmetros; o editor web salva WAV. Útil para gerar "tique", "whoosh" curto e "pop" variados por semente | **depois** (temos síntese em Python; conferir se roda fora do navegador) |

## As 8 adoções mais valiosas, em ordem

1. **Câmera de screencast planejada por eventos (técnica do demo-video-skill + Reframed/Screenize/OpenScreen).** No script do Playwright, registrar cada clique, digitação e rolagem num JSON (posição, alvo, tempo) e gerar a câmera a partir dele: agrupar cliques próximos num só enquadramento, zoom por tipo de atividade (digitação aproxima mais que clique), segurar enquanto houver permanência, nunca atravessar corte. Cursor vetorial com anel no clique e um "holofote" que escurece fora do raio.
   - Ganho: a câmera passa a seguir o que acontece na tela, como no Screen Studio, sem keyframe manual por cena.
   - Custo: médio (registro no Playwright + função de câmera no motor; 2 a 3 dias).
   - Risco: baixo. É código nosso. Só ler o OpenScreen (MIT); não copiar Recordly (AGPL) nem ScreenArc (GPL).

2. **Componentes de software do snapcn e do Remocn.** Trazer pelo shadcn CLI, como código-fonte nosso: search-typing, prompt-zoom, text-highlight, laptop-frame, terminal-simulator, karaoke/word-captions, blur-reveal e títulos cinéticos.
   - Ganho: alto. Peças prontas e no vocabulário de vídeo de SaaS, para editar à vontade.
   - Custo: baixo (precisa de `components.json` e do alias `@/` no projeto do Remotion).
   - Risco: qualidade varia entre componentes; revisar cada um para cores da Faktory, fontes e determinismo antes de usar.

3. **Portões de qualidade "sem cara de IA" (motionmaxxing + agent-video-editor + remotion-qa).** Transformar em checagens do nosso pipeline: falha se houver mais de 3 quadros parados fora de pausa de leitura; elemento entra movendo, nunca só com opacidade; nada cresce de escala zero; movimento mediano perto de 10 quadros; gráfico aparece até 0,6 s depois de a narração citar; legenda até 42 caracteres × 2 linhas e mínimo de 20 quadros; música 18 a 25 dB abaixo da voz; −14 LUFS e −1 dBTP; teste de "dá para ler sem som".
   - Ganho: alto. É o que separa vídeo de editor de vídeo de template.
   - Custo: baixo (regras na skill + scripts ffmpeg/ffprobe que já usamos).
   - Risco: regras demais podem engessar; aplicar como aviso primeiro e depois como bloqueio.

4. **Loop de crítico independente (Gauntlet do motion-video-kit).** Depois do render, um agente separado, que não escreveu o código, recebe a folha de quadros (contact sheet) e a régua, confere item por item e anota num registro; o construtor corrige; no máximo 3 voltas (como o video-use).
   - Ganho: pega erro que quem construiu não vê (texto cortado, quadro vazio, zoom fora do campo).
   - Custo: baixo (prompt de crítico + script de contact sheet).
   - Risco: custo de tokens e falsos alarmes; o crítico nunca aprova sozinho (aprovação continua humana).

5. **Transições GLSL portadas do gl-transitions.** Portar 4 a 6 (por exemplo: directional warp, cube, crosszoom, ripple, luma wipe) como `presentation` de `@remotion/transitions`, seguindo o guia de contribuição do Remotion (inverter o tempo e citar autor e licença MIT no shader). Usar o atlas do saas-motion-kit como cardápio de transições narrativas (carregar elemento, match cut, máscara).
   - Ganho: trocas de capítulo com "peso" de editor, além dos painéis que já temos.
   - Custo: médio (WebGL no render; testar `--gl=angle` ou `swangle` no Windows).
   - Risco: render mais lento e diferença entre prévia e render; usar com parcimônia.

6. **Corte no ritmo e banco de sons ampliado (motion-designer + Kenney CC0 + fade de 30 ms do video-use).** Detectar tempo e tempos fortes da música (como o `beats.py`) para alinhar entradas de título e trocas de capítulo ao compasso; completar o banco de SFX com os sons de interface CC0 da Kenney; fade de 30 ms em toda emenda de áudio para não estalar.
   - Ganho: a montagem passa a "respirar" com a trilha, que é o que mais dá sensação de edição profissional.
   - Custo: baixo (librosa ou similar em Python; baixar o pacote CC0 com autorização).
   - Risco: com narração, o ritmo da fala manda; o tempo forte só ajusta dentro das pausas (como o `pace.py` do product-demo-director).

7. **Regras de motion design da LottieFiles (motion-design-skill).** Incorporar as tabelas de duração e easing, os arquétipos de personalidade (escolher um para a Faktory) e a coreografia de vários elementos na skill do motor, como fonte única de tempos e curvas.
   - Ganho: consistência; todo movimento sai da mesma "personalidade".
   - Custo: muito baixo (leitura e adaptação).
   - Risco: quase nenhum; conferir que não conflita com a spec v5 do outro agente.

8. **Fundos e pós-processamento em shader (Paper Shaders + @react-three/postprocessing).** MeshGradient nas cores da marca para fundos de abertura e capítulo; bloom leve, profundidade de campo e vinheta na janela 3D do sistema.
   - Ganho: acabamento "de estúdio" nas cenas 3D e nas aberturas.
   - Custo: médio.
   - Risco: determinismo. Os shaders animam por relógio próprio (`speed`); é preciso amarrar o tempo ao `useCurrentFrame()`, e isso não está documentado. Testar render quadro a quadro antes de adotar.

## O que ficou sem conferir

- **Posts do X** não foram abertos (o X devolveu "402"/login). O texto veio dos trechos dos buscadores. Os itens 9 e 10 do fio do @thisguyknowsai e a lista completa do fio "15 repositórios" da @RoundtableSpace não apareceram.
- **Estrelas** são do dia da leitura e alguns números vêm de agregadores (Recordly, ScreenArc). O snapcn tem 21 componentes no README e "100+" no post do lançamento: conferir.
- **Licenças não confirmadas:** remotion-animated (só vimos o link para o LICENSE), remotion-gl-transitions (sem licença declarada), Screenity, licença dos efeitos sonoros do trycua/launchpad, `LICENSES.md` arquivo por arquivo do agent-video-editor, e a página de licença do próprio site da Kenney (vimos CC0 no OpenGameArt e em espelhos).
- **Recordly:** espelhos e uma resenha dizem MIT; a página do repositório diz AGPL-3.0. Tratamos como AGPL.
- **React Bits:** MIT + Commons Clause; uso em vídeo parece permitido, mas precisa de leitura do jurídico.
- **Funcionamento não testado** (nada foi instalado): determinismo dos componentes do snapcn/Remocn e dos Paper Shaders no render, se o ZzFX roda fora do navegador para gerar WAV, se o Lottie do diffusionstudio toca no `@remotion/lottie`, e se existe pacote pronto de gl-transitions para Remotion (não achamos `@gl-transitions/remotion` no npm).
- **Não abrimos:** howseen-ai/claude-motion-design (marcado como "cuidado" na lista de segurança), OpenChatCut, explainroo, pixel2motion, live-panel-skill, remotion-director, OpenVideoHarness, flow-video-recorder, getopenscreen/openscreen e audio-bed-check. Ficam para uma próxima leva se as 8 adoções acima não bastarem.
