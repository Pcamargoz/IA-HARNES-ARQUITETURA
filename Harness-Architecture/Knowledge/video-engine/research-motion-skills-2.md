---
title: "Pesquisa: motion, Remotion e skills (2/2)"
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

> Importado do Harness-Arquitetura-Flow (Faktory Flow) em 2026-10-26. Referência histórica do motor; o código genérico está em `video-engine/`. Índice: [[Knowledge/video-engine/README]]. Parte 2 de 2; anterior: [[Knowledge/video-engine/research-motion-skills-1]].

## 5. Adoções recomendadas (ordem de prioridade)

### 0. Decidir a licença do Remotion (bloqueante)
- **Ganho:** os vídeos ficam legais para uso comercial. Desbloqueia todos os pacotes "RL".
- **Custo:** US$ 25 por mês por pessoa que escreve código Remotion, mesmo via agente (*Creators*), ou mínimo de US$ 100 por mês (*Automators*, render automático). Os cenários estão na seção 2.
- **Risco:**
  - A regra conta **o total de pessoas da empresa**, e no 5.0 os prestadores também entram.
  - Hoje o `package.json` está em 4.0.537. Não suba para o 5.0 antes de decidir.
- **Código:** nenhum na opção A.
  - Registre a decisão num ADR e no `LEIA-ME.md` do projeto de vídeos.
  - Se a decisão for **não pagar** (opção C ou B da seção 4.1): as adoções 1 a 7 abaixo continuam valendo como **ideias e parâmetros**, mas são implementadas no novo renderizador, não com os pacotes `@remotion/*`. Exemplos:
    - motion blur por subquadro + `tmix`, no lugar do `CameraMotionBlur`;
    - `regionBlur` vira um `<canvas>` com `filter: blur` aplicado só no recorte;
    - `measureText` vira `canvas.measureText` depois de `document.fonts.ready`;
    - `noise2D` vira um ruído de valor com seed, escrito por nós.

### 1. `@remotion/transitions` + `@remotion/motion-blur`: transições de verdade
- **Ganho:**
  - O whip e o crash-zoom ganham desfoque de câmera real. Hoje o `filter: blur()` desfoca por igual e deixa o texto "lavado".
  - A sobreposição entre cenas passa a ser controlada pela biblioteca: acaba a conta manual de `sobra` (0,75 s, ou 1,5 s no fechamento).
  - `useTransitionProgress()` deixa a cena que entra começar a coreografia durante o wipe, como o line-carry pede.
  - Os novos `iris` e `clock-wipe` viram variações do wipe circular.
- **Custo:**
  - 2 dependências da mesma versão (`npx remotion add @remotion/transitions @remotion/motion-blur`).
  - O motion blur multiplica o tempo de render pelo número de amostras, mas só nos quadros da passagem.
- **Risco:**
  - `CameraMotionBlur` "altera cores" com muitas amostras: usar `samples` de 5 a 8 e `shutterAngle` 180.
  - O `useCurrentFrame()` precisa estar *dentro* do componente embrulhado (veja o "common mistake" na documentação).
  - A duração total muda (as transições encurtam a série); por isso o `preparar.mjs` precisa calcular os tempos com a sobreposição.
- **O que muda no código:**
  - O mapa de `bs` em `FluxoVideo` vira `<TransitionSeries>`.
  - O componente `Transicao` vira duas *presentations* próprias: `circuloDaPilula()`, com o clip-path a partir de 92 %/6 %, e `whipComFreio()`, com a curva `FREIO`.
  - O whoosh entra pelo `addSound()`.
  - O `filter: blur` do whip e o `desfoque` da `Tela` são trocados por `<CameraMotionBlur>` em volta do conteúdo que se move.

### 2. `@remotion/layout-utils` + `@remotion/paths`: geometria exata
- **Ganho:**
  - A pílula de capítulo, os cartões e a legenda param de **estimar** larguras. Hoje `CapituloAbre` calcula `largPilula = 2*22*0.62 + 12 + rot.length*20*0.72 + 44`, e com `measureText` o pouso do title-demote-to-label fica exato.
  - `fillTextBox({maxLines: 2})` vira checagem automática da regra "legenda com até 2 linhas e 42 caracteres".
  - `getPointAtLength` faz o "ponto-documento" andar pela linha de status em curvas.
  - `interpolatePath` faz o check virar seta no fechamento.
- **Custo:** 2 pacotes MIT, pequenos e sem dependências pesadas.
- **Risco:** só medir depois que as fontes carregarem. O `useFontes()` já espera, então as medições vão no mesmo `delayRender`.
- **O que muda no código:**
  - `CapituloAbre`: trocar `largPilula` por `measureText`.
  - `Moldura`: usar a mesma medida.
  - `Legenda`: pré-quebrar as linhas com `fillTextBox` e acusar erro se estourar.
  - Linha de status: o ponto anda por `getPointAtLength`.
  - `Ico`: continua com o `pathLength`; o `evolvePath` entra só onde o caminho é gerado em tempo de execução, como as conectoras.

### 3. `@remotion/effects` no print: privacidade e foco sem truque de CSS
- **Ganho:**
  - O `borrar` vira `regionBlur({topLeft, bottomRight, blurRadius: 40, feather: 6, roundness: 0.2})` aplicado no próprio `<Img>`. Hoje é um `div` com `backdropFilter`, que pode falhar na captura e deixa uma faixa clara visível. O borrão passa a ser determinístico e fica preso ao pixel da imagem, mesmo com zoom.
  - `vignette` e `linearProgressiveBlur` viram opções de spotlight que **não** desfocam o alvo.
- **Custo:** pacote proprietário dentro da RL, com mais de 80 efeitos. Usar só os que precisamos.
- **Risco:**
  - API nova (efeitos a partir da 4.0.464; `regionBlur` a partir da 4.0.507). Nossa base 4.0.537 atende.
  - As coordenadas são UV (0 a 1), então é preciso converter as `caixas` em pixels dividindo por 1920 e 1080.
- **O que muda no código:** em `Tela`, a lista `(r.borrar ?? []).map(...)` some e vira a prop `effects` do `<Img src={r.imagem}>`. O resto do spotlight (`boxShadow 4000px`) fica como está.

### 4. Som: biblioteca CC0 + alinhamento pelo pico
- **Ganho:**
  - Os cliques, ticks e whooshes sintetizados ganham uma camada de som real de interface: `mouseClick`, `uiSwitch`, `whip` e `pageTurn` do `@remotion/sfx` (CC0), e o kit CC0 da Kenney e Freesound do Barty-Bart.
  - Cada som entra com o **pico** no quadro do evento, não com o início do arquivo (técnica do product-launch-motion).
  - Um `report.html` de cues permite ouvir e trocar cada som.
- **Custo:** cerca de 1 a 3 MB de `.wav`/`.ogg` em `public/sfx/`, mais um CREDITS com a origem de cada arquivo. Nenhuma dependência no runtime: baixar os arquivos uma vez e guardar no projeto, sem carregar de `remotion.media` na hora do render.
- **Risco:** licença por arquivo. Só CC0 confirmado na página de cada som; **nada do Mixkit** no repositório. Os sons de meme ficam de fora.
- **O que muda no código:** `SomEm` ganha o parâmetro `picoMs`, com `from = round((em − picoMs/1000) * FPS)`. Uma tabela `SFX = {clique: {src, picoMs, volume}, ...}` substitui os caminhos soltos. O whoosh de transição passa para o `addSound()` do item 1.

### 5. Skills oficiais do Remotion no agente
- **Ganho:** o agente que mexe no motor passa a seguir as regras do próprio time do Remotion:
  - `useCurrentFrame()` no menor componente possível, para não re-renderizar o vídeo todo a cada quadro;
  - nada de CSS `transition`;
  - `fps` vindo do `useVideoConfig`;
  - propriedades de transform separadas (`scale`, `translate`), que ficam editáveis no Studio;
  - padrões de `calculateMetadata`, `TransitionSeries`, motion blur e SFX.
  - `remotion-docs` busca a documentação atual em vez de responder de memória.
- **Custo:** zero no vídeo; algumas dezenas de KB de markdown em `.claude/skills`, ou o plugin `remotion@remotion`.
- **Risco:**
  - As skills sugerem ElevenLabs para voz; manter o VoiceStudio, que é a regra do projeto.
  - Elas seguem a versão mais nova (4.0.538+). Fixar a versão das skills na mesma do Remotion.
- **O que muda no código:** nada direto. Aplicar aos poucos a regra do `useCurrentFrame` mínimo: hoje `useT()` é chamado no topo de `FluxoVideo` (via `Fundo`, `Moldura`, `Legenda`), e isso já está separado. Revisar `Tela`, que é o componente mais pesado.

### 6. `@remotion/noise`: deriva orgânica
- **Ganho:** o drift de câmera e as manchas do `Fundo` deixam de ser senoides de 30 s, que dá para perceber o loop, e viram ruído suave com seed. Continua determinístico.
- **Custo:** pacote MIT minúsculo.
- **Risco:** nenhum relevante. Manter amplitude de no máximo 0,6 % de escala ou 6 px por segundo, como na especificação.
- **O que muda no código:** `Fundo` (o `Math.sin(w)` e o `Math.cos(w)` viram `noise2D('mancha', t*0.03, 0)`) e o drift de `cam` em `Tela`.

### 7. Tempo de cada palavra: `@remotion/captions` + whisper (v5)
- **Ganho:**
  - Os termos do glossário (status, botões) acendem em `primary` **na palavra falada**, como a especificação pede.
  - A exportação `.srt` passa a usar `serializeSrt`.
  - Abre a porta para medir o pico de cada fala e alinhar SFX longe do início das palavras.
- **Custo:** whisper local (modelo de cerca de 145 a 480 MB) num passo novo do `preparar.mjs`, fora do render.
- **Risco:**
  - O whisper erra nomes do Flow. Como texto vale o roteiro; o whisper só fornece os tempos (alinhar por letras).
  - `install-whisper-cpp` é RL; `openai-whisper` é MIT.
- **O que muda no código:**
  - O tipo `Trecho['legendas']` ganha `palavras?: Caption[]`.
  - `Legenda` passa a renderizar por token, com destaque só para os termos do glossário.

---

## 6. Roteiro do motor

### v3 (atual, `FluxoVideoV3.tsx`)
Especificação suíça de 22/10, cartões do video-shotcraft (cursor-flyover, cantos em L com rótulo, crash-zoom/speed-ramp-freeze, title-demote-to-label, line-carry, draw-svg-trace, whip com freio), voz fixa no VoiceStudio, música sintetizada com ducking, legenda frase a frase.

### v4: fundação (as adoções de 0 a 6)
- Licença decidida e registrada num ADR. Um único arquivo de motor (fim do par FluxoVideo / FluxoVideoV3).
- **Se a decisão for não pagar:** o v4 vira "v4-migração":
  1. renderizador próprio (opção C, 4 a 6 dias), ou HyperFrames (opção B, 5 a 8 dias);
  2. paridade visual quadro a quadro com o v3 nos 12 vídeos;
  3. só então os itens abaixo, reescritos sem os pacotes `@remotion/*`.
- `TransitionSeries` com as presentations próprias `circuloDaPilula` e `whipComFreio`, e `addSound`.
- `CameraMotionBlur` no whip e no crash-zoom.
- `measureText` e `fillTextBox` na pílula, nos cartões e na legenda, com erro de build se o texto estourar.
- `regionBlur` no `borrar`; `vignette` como opção de spotlight.
- Kit de SFX CC0 local com alinhamento pelo pico e CREDITS por arquivo.
- `noise2D` no fundo e na deriva.
- Skills oficiais do Remotion no agente.
- Blur-dissolve curto (0,3–0,4 s) como 3ª transição, entre um cartão e outro dentro do mesmo capítulo (seção 3.6).
- **QA novo:** varredura de diferença entre quadros (saltos grandes só onde houver impacto intencional), contact sheet de 1 quadro por segundo e checagem automática de legenda contra o alvo.

### v5: palavra e precisão
- Tempo de cada palavra (whisper local) e destaque dos termos do glossário na palavra falada.
- `.srt` gerado com `serializeSrt`.
- Prints capturados em 2× (já proposto no v3) para zoom de até 2,2× sem amolecer.
- **Esticar pelas bordas** (cada borda numa mola) na barra de progresso, na pílula e nos indicadores de aba do Flow.
- **Odômetro** para números reais da base (prazos, contagens). Nunca valores de cliente.
- Troca de conteúdo com blur curto (sai em 0,12 s, entra em mola), conforme o product-launch-motion.
- Molas somadas por mudança de alvo (o padrão `Track` do product-launch-motion e o `track()` do Barty-Bart) no lugar de reiniciar o `spring()` a cada foco da `Tela`.
- Digitação animada nos campos do print (cerca de 25 caracteres/s, cursor de texto piscando) para os passos de "preencher".
- `getPointAtLength` para o ponto-documento andar por curvas.

### v6: sistema de cenas
- Cada cena vira um componente com schema (zod) e props editáveis no Studio (`remotion-interactivity`).
- `calculateMetadata` lê a duração dos áudios, e o `preparar.mjs` fica mais simples.
- Novos tipos de vídeo além de "fluxo": **notas de versão** (modelo ds-release-649), **onboarding** e **fluxo completo em uma tomada** (modelo explainer-engaging, com as estações do fluxo num canvas grande e recuo final).
- Biblioteca curada de 5 a 10 Lotties sóbrios (Lottie Simple License) para estados vazios e de sucesso, via `@remotion/lottie`.
- Render em lote parametrizado (`scripts/lote.mjs`) com relatório por vídeo.

### v7 e além (rumo ao v10)
- **UI reconstruída em vez de print** nas telas-chave: o print vira HTML redesenhado a partir da tela real, com o texto nítido em qualquer zoom e a câmera livre. É a linha do Living Screencast e do ds-release-649. Exige validar cada nome no glossário e na tela.
- **"Uma forma, nunca cortada"**: o cartão de regra vira o campo da tela, que vira o check do fechamento, sem cortes.
- Motion blur por subquadro (`HtmlInCanvasMotionBlur`, ou 4 subquadros + `tmix`), quando a flag do Chrome sair do experimental.
- Júri automático: notas de 1 a 10 em 7 dimensões a cada render, com uma rodada de correção.
- Variações 9:16 e 1:1 do mesmo roteiro; legenda em espanhol ou inglês com a mesma linha do tempo.
- Se a licença do Remotion virar problema: migração para o HyperFrames pela skill `remotion-to-hyperframes`, cena por cena.

---

## 7. Fontes

- Licença do Remotion: [LICENSE.md](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md), [remotion.pro/license](https://www.remotion.pro/license), [FAQ de licença](https://www.remotion.dev/docs/license/faq), [PR #3750 (5.0)](https://github.com/remotion-dev/remotion/pull/3750)
- Alternativas: [HyperFrames vs Remotion](https://hyperframes.heygen.com/guides/hyperframes-vs-remotion), [introdução do HyperFrames](https://hyperframes.heygen.com/introduction), [README do Revideo](https://github.com/midrender/revideo), [documentação do Motion Canvas](https://motioncanvas.io/docs/)
- Demo de produto: [`explainer-default/SKILL.md`](https://github.com/Barty-Bart/motion-graphics/blob/main/skills/explainer-default/SKILL.md)
- Documentação do Remotion: [transitions](https://www.remotion.dev/docs/transitions), [TransitionSeries](https://www.remotion.dev/docs/transitions/transitionseries), [audio transitions](https://www.remotion.dev/docs/transitions/audio-transitions), [motion blur](https://www.remotion.dev/docs/motion-blur), [CameraMotionBlur](https://www.remotion.dev/docs/motion-blur/camera-motion-blur), [effects](https://www.remotion.dev/docs/effects/api), [regionBlur](https://www.remotion.dev/docs/effects/region-blur), [vignette](https://www.remotion.dev/docs/effects/vignette), [captions](https://www.remotion.dev/docs/captions), [createTikTokStyleCaptions](https://www.remotion.dev/docs/captions/create-tiktok-style-captions), [sfx](https://www.remotion.dev/docs/sfx), [rough-notation](https://www.remotion.dev/docs/rough-notation/api), [mac-cursors](https://www.remotion.dev/docs/mac-cursors), [gsap](https://www.remotion.dev/docs/gsap), [light-leaks (descontinuado)](https://www.remotion.dev/docs/light-leaks/api), [Agent Skills](https://www.remotion.dev/docs/ai/skills), [plugin para Claude Code](https://www.remotion.dev/docs/ai/claude-code-plugin), [templates](https://www.remotion.dev/templates); skill `remotion-markup` em `packages/skills/skills/remotion-markup/` (timing.md, transitions.md, text-highlights.md, measuring-text.md, calculate-metadata.md, voiceover.md, html-in-canvas.md)
- GSAP: [anúncio da Webflow](https://webflow.com/blog/gsap-becomes-free), [licença padrão](https://gsap.com/community/standard-license/)
- Rive: [runtimes MIT](https://rive.app/docs/runtimes), [plano de exportação](https://rive.app/blog/rive-s-new-9-mo-plan)
- Skills: [digitalsamba/claude-code-video-toolkit](https://github.com/digitalsamba/claude-code-video-toolkit), [Barty-Bart/motion-graphics](https://github.com/Barty-Bart/motion-graphics), [AbubakrChan/product-launch-motion](https://github.com/AbubakrChan/product-launch-motion) (`references/technique.md`), [haidrrrry/claude-remotion-skill](https://github.com/haidrrrry/claude-remotion-skill), [heygen-com/hyperframes](https://github.com/heygen-com/hyperframes), [anthropics/skills](https://github.com/anthropics/skills), [imMamdouhaboammar/motion-graphics-skills](https://github.com/imMamdouhaboammar/motion-graphics-skills), [wilwaldon/Claude-Code-Video-Toolkit](https://github.com/wilwaldon/Claude-Code-Video-Toolkit), [agentskillshub.top](https://agentskillshub.top/best/claude-video-skills/)
- Engines: [motion-canvas](https://github.com/motion-canvas/motion-canvas), [revideo](https://github.com/midrender/revideo), [theatre](https://github.com/theatre-js/theatre), [lottie-web](https://github.com/airbnb/lottie-web), [dotlottie-web](https://github.com/LottieFiles/dotlottie-web)
- Ícones e ilustrações: [Lucide (ISC)](https://github.com/lucide-icons/lucide), [Phosphor](https://github.com/phosphor-icons/homepage), [Tabler](https://github.com/tabler/tabler-icons), [Heroicons](https://github.com/tailwindlabs/heroicons), [Material](https://github.com/google/material-design-icons), [unDraw](https://undraw.co/license), [LottieFiles](https://lottiefiles.com/page/license), [Lordicon](https://lordicon.com/licenses)
- Exemplos: [github-unwrapped](https://github.com/remotion-dev/github-unwrapped), [trailer](https://github.com/remotion-dev/trailer)

## 8. O que ainda não foi verificado

A pesquisa foi interrompida uma vez por limite de uso e depois retomada. Na retomada, completamos:
- as regras de licença do Remotion na fonte (LICENSE.md, remotion.pro e o FAQ);
- as alternativas e o esforço de migrar;
- as licenças de `ding` e `uiSwitch`;
- as licenças de `github-unwrapped` e `trailer`;
- o `SKILL.md` do `explainer-default`;
- Open Peeps e Humaaans.

Ainda em aberto:
- **Filmes de exemplo não assistidos.** Os vereditos se baseiam no que os autores descrevem e no código, não em qualidade vista.
- **Motion Canvas sem render headless confirmado.** A documentação de introdução não fala de exportação; confirme no código antes de cogitar a opção E.
- **HyperFrames:** só lemos o README e o guia "HyperFrames vs Remotion". O pipeline de render (Chrome, ffmpeg, paralelismo), o áudio e as legendas não foram conferidos.
- **Licença do Humaaans** não confirmada.
- **Não pesquisados:** outros marketplaces de skills (skills.sh, agentskills.io) e o catálogo completo de blocos do HyperFrames.
- **Esforço de migração** (seção 4.1) é estimativa, não medição.
- **Interpretação de licença:** o enquadramento do `lote.mjs` como "Creators" precisa de confirmação por escrito do Remotion. Este documento não é parecer jurídico.

*Este documento é pesquisa, não aprovação: as adoções dependem de decisão humana. A decisão de licença é a primeira.*
