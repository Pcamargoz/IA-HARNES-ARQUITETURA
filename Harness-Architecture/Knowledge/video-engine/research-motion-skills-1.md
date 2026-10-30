---
title: "Pesquisa: motion, Remotion e skills (1/2)"
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

> Importado do Harness-Arquitetura-Flow (Faktory Flow) em 2026-10-26. Referência histórica do motor; o código genérico está em `video-engine/`. Índice: [[Knowledge/video-engine/README]]. Parte 1 de 2; próxima: [[Knowledge/video-engine/research-motion-skills-2]].

# Pesquisa: motion design em código, pacotes e skills para o motor de vídeo

**Data:** 2026-10-23
**Escopo:** motor de vídeos do Guia do Consultor (`Guia-Do-Consultor/videos`, Remotion 4.0.537, React 19, 1920×1080, 30 fps), para vídeos institucionais e de produto B2B/ERP.
**Ponto de partida:** a especificação visual de 22/10/2026 (`docs/producao-de-videos.md`) e os cartões do video-shotcraft já aplicados (cursor-flyover, scanline-annotate-focus, crash-zoom/speed-ramp-freeze, title-demote-to-label, line-carry-transition). Não repetimos aqui os repositórios já estudados.

> **Onde mexer no código.** O pedido cita `Guia-Do-Consultor/videos/src/FluxoVideo.tsx`. Hoje, porém, o `Root.tsx` importa `FluxoVideo` de **`./FluxoVideoV3`**. Por isso o motor ativo é `src/FluxoVideoV3.tsx`. As mudanças abaixo citam os componentes pelo nome (`Transicao`, `Tela`, `Ico`, `Legenda`, `Fundo`, `SomEm`, `CapituloAbre`, `Moldura`), e esses nomes existem nos dois arquivos. Antes do v4, decida qual dos dois arquivos é o oficial e apague ou arquive o outro.

---

## 1. Como pesquisamos

- **Só leitura.** Nada foi instalado nem executado. Lemos READMEs, arquivos de licença, `package.json` e documentação pelos arquivos raw do GitHub, pelas páginas oficiais e por buscas na web.
  - A API do GitHub bloqueou por limite de uso no meio da pesquisa. A partir daí, as estrelas foram lidas do HTML público dos repositórios e as datas de último commit vieram dos feeds `commits/HEAD.atom`.
  - Os números são de 23/10/2026 e arredondados.
- **Fontes principais:**
  - o monorepo `remotion-dev/remotion`: as pastas `packages/*`, a documentação em `packages/docs/docs/*` e as skills em `packages/skills/skills/*`;
  - as páginas de licença do Remotion (`LICENSE.md`, remotion.pro/license e o PR #3750, que traz as mudanças do Remotion 5.0);
  - os repositórios das engines alternativas;
  - as skills de vídeo para Claude Code achadas por busca (wilwaldon, digitalsamba, AbubakrChan, Barty-Bart, haidrrrry, imMamdouhaboammar, HyperFrames, anthropics/skills);
  - as licenças de ícones e ilustrações.
- **Licença.** A pergunta foi sempre: *uma empresa pode usar isto em vídeo comercial, sem pagar e sem dar crédito?* Quando a resposta depende do tamanho da empresa ou de uma restrição, isso aparece no veredito.
- **Vereditos:**
  - **usar agora**: vale para o v4;
  - **usar depois**: vale, mas depende de algo que ainda não temos;
  - **referência**: só ideias e parâmetros;
  - **não serve**.
- **Regra de cópia.** De repositórios sem licença ou com licença proprietária, aproveitamos só a ideia, nunca o código. Mesmo de repositórios MIT ou Apache, a preferência é reescrever no nosso estilo em vez de colar.

---

## 2. Achado que vem antes de tudo: a licença do Remotion

O Remotion **não é MIT**. O núcleo (`remotion`, `@remotion/cli`, `@remotion/renderer`, `@remotion/player`) e vários pacotes oficiais usam a **Remotion License**.

- **Gratuito para:** pessoas físicas, empresas com fins lucrativos de **até 3 pessoas**, organizações sem fins lucrativos, e avaliação antes do uso comercial.
- **Acima disso:** é obrigatória a **Company License**.
  - *Remotion for Creators*: US$ 25 por mês por pessoa que mexe no projeto;
  - *Remotion for Automators*: US$ 0,01 por render, mínimo de US$ 100 por mês;
  - *Enterprise*: a partir de US$ 500 por mês.
- **No Remotion 5.0 (PR #3750):** **prestadores de serviço passam a contar** no tamanho do time, e a licença fica amarrada aos novos termos de uso.

**Conferido na fonte em 23/10/2026.** Fontes: [LICENSE.md](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md), [remotion.pro/license](https://www.remotion.pro/license) e o [FAQ de licença](https://www.remotion.dev/docs/license/faq) (o endereço remotion.pro/faq redireciona para ele). Pontos que importam para nós:

| Pergunta | Resposta da fonte |
|---|---|
| Quem conta no limite de 3 pessoas? | **O total de pessoas da empresa**, não só quem usa o Remotion: "Eligibility depends on your company's total headcount". Mesmo com uma única pessoa usando, a empresa precisa da Company License, salvo se se enquadrar numa isenção |
| Prestadores contam? | Sim. Freelancers ou outro estúdio no mesmo projeto somam ao número de pessoas da empresa. O 5.0 deixa isso explícito ("Contractors also count towards team size") |
| Uma agência que entrega só o MP4 para um cliente? | O cliente não conta ("is not a User"); só conta a agência. Se o cliente opera o projeto, somam-se as duas empresas |
| Uso interno ou comercial? | Qualquer uso comercial é permitido. A única proibição é revender o próprio Remotion. Vídeo interno de treinamento de uma empresa com 4 pessoas ou mais também precisa da licença: a regra é o tamanho da empresa, não o tipo de uso |
| Como se cobra? | *Creators*: US$ 25 por mês **por pessoa que escreve código Remotion, inclusive por meio de agente de IA**, para criação manual em baixo volume. *Automators*: US$ 0,01 por render, mínimo de US$ 100 por mês. Os dois planos juntos têm mínimo combinado de US$ 100 por mês. *Enterprise*: mínimo de US$ 500 por mês. Previews no Studio e no Player não contam como render |
| E os vídeos já feitos se cancelarmos? | Continuam podendo ser usados depois do cancelamento |
| É open source? | Não. É *source-available*, nas palavras do próprio FAQ |

**Custo para a Faktory (estimativa, preços de 23/10/2026)**

| Cenário | Plano | Custo |
|---|---|---|
| 1 pessoa (o consultor que mantém o motor, com o agente) gera os vídeos no próprio PC | Creators × 1 | US$ 25/mês (US$ 300/ano) |
| 3 pessoas mexem nos roteiros e no código | Creators × 3 | US$ 75/mês (US$ 900/ano) |
| Render automático num servidor ou CI, sem pessoa no meio | Automators | mínimo de US$ 100/mês (cobre até 10 mil renders) |

O `scripts/lote.mjs` renderiza cerca de 12 vídeos por rodada, disparado por uma pessoa. Isso parece "baixo volume manual" (Creators), mas é interpretação nossa. Confirme por escrito com o Remotion antes de automatizar no CI.

**Consequência para a Faktory.** Com 4 pessoas ou mais no total, os vídeos do Guia precisam de Company License. Isso vale desde já, inclusive para os vídeos de treinamento interno. É uma **decisão humana** (financeiro ou jurídico), não do agente. Também valem para isso os pacotes oficiais marcados como "Remotion License". Os pacotes MIT (`paths`, `noise`, `captions`, `motion-blur`, `layout-utils`) não servem sem o núcleo, que é RL.

Se a Faktory não quiser pagar, existe saída sem custo de licença:
- **HyperFrames** (Apache-2.0);
- **Revideo** e **Motion Canvas** (MIT);
- **renderizador próprio**: React DOM (MIT) + Playwright + ffmpeg.

A comparação e o esforço de migrar estão na seção 4.

---

## 3. Tabela geral

Legenda: ★ = estrelas no GitHub (aproximado); "RL" = Remotion License (segue a regra de tamanho de empresa acima).

### 3.1 Pacotes oficiais do Remotion (todos na versão 4.0.538; nossa base é 4.0.537)

| Nome | Link | Licença | O que traz de novo para nós | Veredito |
|---|---|---|---|---|
| `@remotion/transitions` | [docs](https://www.remotion.dev/docs/transitions) | RL | `<TransitionSeries>` com Transition (as cenas se sobrepõem e a duração total encurta) e **Overlay** (efeito por cima do corte, sem mexer na duração). Traz `useTransitionProgress()` para coreografar *dentro* da cena que entra ou sai, `addSound()` para pôr o whoosh no corte, e 20 apresentações prontas (`iris`, `clock-wipe`, `push-cut`, `blur-slide`, `zoom-blur`, `swap`, `slide`, `wipe`, entre outras) | **usar agora** |
| `@remotion/motion-blur` | [docs](https://www.remotion.dev/docs/motion-blur) | MIT | `<CameraMotionBlur shutterAngle samples>`: desfoque de movimento real, com várias amostras de tempo misturadas, no lugar do `filter: blur()` em CSS. `<HtmlInCanvasMotionBlur>` é a versão de ponta, mas exige uma flag do Chrome no preview | **usar agora** (só no whip e no crash-zoom) |
| `@remotion/paths` | [docs](https://www.remotion.dev/docs/paths) | MIT | `evolvePath`, `getLength`, `getPointAtLength`, `interpolatePath`: desenhar qualquer caminho SVG, mover um ponto ao longo de uma curva e transformar uma forma em outra | **usar agora** |
| `@remotion/layout-utils` | [docs](https://www.remotion.dev/docs/layout-utils) | MIT | `measureText`, `fitText`, `fillTextBox`: medir texto, ajustar o tamanho da fonte ao espaço e detectar estouro de caixa de forma determinística | **usar agora** |
| `@remotion/effects` | [docs](https://www.remotion.dev/docs/effects/api) | proprietária (RL) | Mais de 80 efeitos de canvas para `<Img>`, `<Video>`, `<Solid>` e formas. Os que servem para nós: `regionBlur` (borrar dados sensíveis no print), `vignette`, `dropShadow`, `linearProgressiveBlur` (foco seletivo) e `zoomBlur` | **usar agora** (regionBlur, vignette) |
| `@remotion/captions` | [docs](https://www.remotion.dev/docs/captions) | MIT | Tipo `Caption` com o tempo de cada palavra, `createTikTokStyleCaptions` (agrupa palavras em páginas), `parseSrt` e `serializeSrt` | **usar depois** (v5, quando tivermos o tempo de cada palavra) |
| `@remotion/openai-whisper` / `@remotion/install-whisper-cpp` | [docs](https://www.remotion.dev/docs/install-whisper-cpp) | MIT / RL | Transcrição local com tempo de cada palavra, no formato `Caption` | **usar depois** (v5) |
| `@remotion/noise` | [docs](https://www.remotion.dev/docs/noise) | MIT | `noise2D` e `noise3D` com seed: a deriva da câmera e do fundo fica orgânica e continua determinística | **usar agora** (barato) |
| `@remotion/shapes` | [docs](https://www.remotion.dev/docs/shapes) | MIT | `Rect`, `Circle`, `Arrow`, `Pie`, `Polygon` como SVG, que aceitam `effects` | **referência** (já fazemos à mão) |
| `@remotion/sfx` | [docs](https://www.remotion.dev/docs/sfx) | MIT (pacote) e CC0 por som | Sons normalizados com pico em −3 dB: `mouseClick`, `uiSwitch`, `whoosh`, `whip`, `pageTurn`, `shutterModern`. Conferimos `mouseClick`, `uiSwitch` (Kenney), `whoosh`, `whip`, `pageTurn` (Kenney) e `shutterModern`: todos CC0. **`ding` não serve**: a origem informada é o site myinstants, sem licença rastreável. Metade da lista são memes (vine-boom, bruh) | **usar agora** (baixar só os sons sóbrios e guardar no projeto) |
| `@remotion/rough-notation` | [docs](https://www.remotion.dev/docs/rough-notation/api) | MIT | Grifo, círculo, sublinhado, risco e colchete "à mão", com `progress` determinístico | **usar depois**, e só no marcador de palavra-chave com `roughness` baixa (o traço à mão briga com o estilo suíço) |
| `@remotion/mac-cursors` | [docs](https://www.remotion.dev/docs/mac-cursors) | RL | 39 cursores do macOS com hotspot correto | **não serve** (o consultor usa Windows; o cursor próprio já está calibrado) |
| `@remotion/lottie` | [docs](https://www.remotion.dev/docs/lottie) | RL | `<Lottie animationData>` sincronizado com o quadro | **usar depois** (ícones animados curados) |
| `@remotion/rive` | [docs](https://www.remotion.dev/docs/rive) | RL | Arquivos `.riv` em vídeo | **não serve** (exportar do editor Rive é pago) |
| `@remotion/gsap` | [docs](https://www.remotion.dev/docs/gsap) | MIT (o GSAP é grátis pela licença da Webflow) | `useGsapTimeline()` congela uma timeline do GSAP no quadro atual | **não serve agora** (nossas molas e curvas cobrem o necessário; seria mais uma dependência) |
| `@remotion/three` | [docs](https://www.remotion.dev/docs/three) | MIT | React Three Fiber dentro do vídeo | **não serve** (3D não combina com o tom de ERP) |
| `@remotion/light-leaks` | [docs](https://www.remotion.dev/docs/light-leaks/api) | RL, **descontinuado** no 5.0 | Vazamentos de luz | **não serve** |
| `@remotion/google-fonts` | [docs](https://www.remotion.dev/docs/google-fonts) | RL | `loadFont()` com `waitUntilDone()` | **não serve** (já usamos `@fontsource` local, que é mais seguro) |
| Agent Skills do Remotion | [remotion-dev/skills](https://github.com/remotion-dev/skills) (~5,5 mil ★) | acompanha o Remotion (o pacote `@remotion/skills` é privado e não declara licença; são instruções em markdown) | `remotion-best-practices`, `remotion-markup` (regras de animação, texto, transições, motion blur, SFX, voz), `remotion-captions`, `remotion-render`, `remotion-docs`, `remotion-interactivity` | **usar agora** (no agente, não no vídeo) |
| Plugin do Remotion para Claude Code | [remotion-dev/claude-code-plugin](https://github.com/remotion-dev/claude-code-plugin) | acompanha o Remotion | As mesmas skills, instaladas como plugin | **usar agora** (alternativa às skills soltas) |
| Templates oficiais | [remotion.dev/templates](https://www.remotion.dev/templates) | RL | Grátis: TikTok (legenda palavra a palavra), Code Hike (código animado), Recorder (gravação de tela), Prompt to Video, Audiogram. Pagos: Editor Starter, `<Timeline/>` | **referência** (TikTok e Recorder) |

### 3.2 Outras engines de motion em código

| Nome | Link | Licença | ★ / atividade | O que traz | Veredito |
|---|---|---|---|---|---|
| HyperFrames (HeyGen) | [heygen-com/hyperframes](https://github.com/heygen-com/hyperframes) | Apache-2.0 | ~70 mil ★, ativo | HTML, CSS e GSAP renderizados em MP4 determinístico. Feito para agentes: 7 skills, plugin para Claude Code, catálogo de blocos (gráficos, bar chart race), skill `remotion-to-hyperframes`, Node 22 ou superior | **referência / plano B** se a Company License do Remotion for vetada |
| Motion Canvas | [motion-canvas/motion-canvas](https://github.com/motion-canvas/motion-canvas) | MIT | ~19,4 mil ★, commit em 07/2026 | Cenas como *generators* (`yield*`), *signals* reativos, nó `Code` com animação de diff entre versões, editor com waveform para sincronizar com a voz | **referência** (ideia da linha do tempo por `yield`; migrar não compensa) |
| Revideo (Midrender) | [midrender/revideo](https://github.com/midrender/revideo) | MIT | ~4,1 mil ★, commit em 07/2026 | Fork do Motion Canvas com API de render headless e player React; sem dependências no núcleo | **referência / plano B** |
| Theatre.js | [theatre-js/theatre](https://github.com/theatre-js/theatre) | Apache-2.0 | ~12,8 mil ★, **último commit em 04/2024** | Editor visual de keyframes para a web | **não serve** (parado há 2 anos e meio) |
| GSAP | [greensock/GSAP](https://github.com/greensock/GSAP) | "Standard No-Charge" da Webflow | ~29,6 mil ★ | Grátis para uso comercial, inclusive os antigos plugins pagos. Restrição: não pode ir em ferramenta visual sem código que concorra com a Webflow | **não serve agora** (só se migrarmos para HyperFrames) |
| lottie-web / dotLottie | [airbnb/lottie-web](https://github.com/airbnb/lottie-web) (~32 mil ★, último commit 11/2024), [LottieFiles/dotlottie-web](https://github.com/LottieFiles/dotlottie-web) (~0,9 mil ★, ativo) | MIT | | Players de Lottie. O Remotion usa o lottie-web por baixo do `@remotion/lottie` | **usar depois** (via `@remotion/lottie`, com arquivos `.json`) |
| Rive | [rive-app/rive-wasm](https://github.com/rive-app/rive-wasm) | MIT (runtime) | ~1 mil ★ | Animações com máquina de estados | **não serve** (exportar do editor exige plano pago) |

### 3.3 Skills famosas de Claude Code e Agent Skills para vídeo

| Nome | Link | Licença | ★ | O que traz | Veredito |
|---|---|---|---|---|---|
| claude-code-video-toolkit | [digitalsamba/claude-code-video-toolkit](https://github.com/digitalsamba/claude-code-video-toolkit) | MIT | ~2,3 mil | Ambiente completo de produção sobre Remotion: skills (`playwright-recording`, elevenlabs, ideogram, qwen), comandos `/record-demo`, `/generate-voiceover`, `/redub`, templates `product-demo`, `sprint-review` e `sprint-review-v2` (cenas modulares). Exemplos reais de empresa: **ds-release-649** (vídeo de notas de versão com 3 UIs reconstruídas a partir do código-fonte, cursor e câmera roteirizados) e ds-free-schedule-demo (demo de produto de 26 s) | **referência** (arquitetura de cenas modulares e "UI reconstruída"); **não usar** as transições glitch, RGB split e lightLeak (vão contra a nossa lista de proibidos) |
| motion-graphics (Bart) | [Barty-Bart/motion-graphics](https://github.com/Barty-Bart/motion-graphics) | MIT; sons CC0 (Kenney, Freesound); fontes Geist OFL; ícones Lucide ISC | ~0,8 mil | `explainer-default` (demo calma de 45–90 s com a UI real grande enquanto é usada), `explainer-engaging` (uma peça viaja pelas "estações" do fluxo e a câmera recua no fim), `sound-effects` (lista de cues tirada da animação, conferência do beat pelo bumbo abaixo de 120 Hz, 1 SFX por cue, mix medida no MP4 final, `report.html` para ouvir e trocar cada som; biblioteca CC0 de 110 sons, ~2,7 MB). Os sons do Mixkit **não** vêm no repositório | **usar agora** (método e biblioteca de som CC0); **referência** (explainer-engaging para o vídeo "fluxo completo") |
| product-launch-motion | [AbubakrChan/product-launch-motion](https://github.com/AbubakrChan/product-launch-motion) | MIT | ~0,3 mil | `references/technique.md`: mola fechada com uma mola por mudança de alvo; troca de conteúdo com blur (sai curto e cedo, entra em mola); "esticar pelas bordas" (cada borda do indicador de aba numa mola diferente); cursor com aperto `1 − 0.16·exp(−((t−tc)/0.045)²)` e ripple de 0,4 s; odômetro de números reais; SFX alinhado pelo **pico medido**; 4 subquadros por quadro + `tmix` do ffmpeg para motion blur; QA por varredura de diferença entre quadros. Filmes de exemplo: cheerful.ai (30 s) e Hoopoe Club (43 s) | **usar agora** (técnicas; reescrever no nosso código) |
| claude-remotion-skill | [haidrrrry/claude-remotion-skill](https://github.com/haidrrrry/claude-remotion-skill) | MIT | ~0,6 mil | Regras gerais de motion para Remotion e o laço "renderizar → olhar os quadros → corrigir → renderizar de novo" | **referência** (nossa especificação já é mais específica) |
| HyperFrames skills | [heygen-com/hyperframes](https://github.com/heygen-com/hyperframes) | Apache-2.0 | (repo ~70 mil) | `/hyperframes` com referências de filme, legendas, overlays, motion e look | **referência** |
| anthropics/skills | [anthropics/skills](https://github.com/anthropics/skills) | Apache-2.0 na maioria (docx, pdf, pptx e xlsx são source-available) | ~183 mil | Nada específico de vídeo. `theme-factory` e `brand-guidelines` servem de modelo para uma skill "tema Faktory" | **referência** |
| motion-graphics-skills | [imMamdouhaboammar/motion-graphics-skills](https://github.com/imMamdouhaboammar/motion-graphics-skills) | **proprietária, todos os direitos reservados** | ~0,03 mil | Skills sobre HyperFrames | **não serve** (licença) |
| Claude-Code-Video-Toolkit | [wilwaldon/Claude-Code-Video-Toolkit](https://github.com/wilwaldon/Claude-Code-Video-Toolkit) | sem licença declarada | ~0,1 mil | Lista de skills, MCPs e ferramentas de vídeo | **referência** (só como índice) |
| Ranking de skills de vídeo | [agentskillshub.top](https://agentskillshub.top/best/claude-video-skills/) | n/a | n/a | Classifica 335 skills de vídeo. Alerta útil: em skill de promo, "o estilo é o da skill, não o seu" | **referência** |

### 3.4 Ícones, ilustrações e animações com licença livre

| Nome | Link | Licença | Uso comercial sem crédito? | Como usar no Remotion | Veredito |
|---|---|---|---|---|---|
| Lucide | [lucide-icons/lucide](https://github.com/lucide-icons/lucide) (~25 mil ★) | ISC | Sim (manter o aviso de copyright nos CREDITS) | **Já usamos**: os paths em `ICONES` são do Lucide, desenhados com `pathLength="1"`. Grade 24 px e traço 2 px, ideal para "ícone desenhado por traço" | **usar agora** (formalizar a origem nos CREDITS; tirar novos ícones do pacote `lucide-static` em vez de copiar à mão) |
| Phosphor | [phosphor-icons](https://github.com/phosphor-icons/homepage) (~7,7 mil ★) | MIT | Sim | 6 pesos (thin a fill, e duotone). O duotone serve para cartões de regra | **usar depois** (se faltar ícone no Lucide) |
| Tabler Icons | [tabler/tabler-icons](https://github.com/tabler/tabler-icons) (~22 mil ★) | MIT | Sim | Mais de 6.200 ícones de traço, compatíveis com o estilo do Lucide | **usar depois** (reserva para ícones de ERP: nota fiscal, código de barras, armazém) |
| Heroicons | [tailwindlabs/heroicons](https://github.com/tailwindlabs/heroicons) (~24 mil ★) | MIT | Sim | Poucos ícones (~300) | **não serve** (o Lucide cobre) |
| Material Symbols | [google/material-design-icons](https://github.com/google/material-design-icons) (~54 mil ★) | Apache-2.0 | Sim | Fonte variável de ícones | **não serve** (visual Google, destoa) |
| unDraw | [undraw.co/license](https://undraw.co/license) | licença própria | Sim, sem crédito; **proibido** redistribuir em pacote, compilar acervo e usar em treino de IA | SVG recolorido para a cor `primary` | **usar depois**, com cuidado: só ilustrações avulsas no vídeo; nunca guardar uma "coleção unDraw" no repositório |
| LottieFiles (animações grátis) | [Lottie Simple License](https://lottiefiles.com/page/license) | licença própria | Sim, sem crédito; derivados ficam na mesma licença; proibido montar serviço concorrente | `@remotion/lottie` com o `.json` local | **usar depois** (curar 5 a 10 animações sóbrias; a qualidade varia muito) |
| Lordicon | [lordicon.com/licenses](https://lordicon.com/licenses) | grátis = **não comercial e com crédito** | Não (só no plano PRO) | n/a | **não serve** |
| Open Peeps | [openpeeps.com](https://www.openpeeps.com/) | CC0 (segundo fontes secundárias, sem leitura do texto oficial) | Sim | SVG de pessoas desenhadas à mão | **não serve** (o traço à mão destoa do estilo suíço e de ERP) |
| Humaaans | humaaans.com | **não confirmada** (as fontes divergem entre "free" e "CC0") | ? | n/a | **não usar** até ler a licença oficial |

### 3.5 Exemplos abertos de product demo e explicativo SaaS

| Exemplo | Onde | Por que olhar |
|---|---|---|
| ds-release-649 | digitalsamba toolkit, `examples/ds-release-649` | Notas de versão sem gravação de tela: a UI é reconstruída do código, com cursor e câmera roteirizados. É o caminho para o nosso v7 ou superior |
| Templates `product-demo` e `sprint-review-v2` | digitalsamba toolkit, `templates/` | Cenas modulares com props: modelo para a biblioteca de cenas do v6 |
| Filmes do product-launch-motion | releases v2.0.0 do repositório | "Uma forma, nunca cortada", odômetro, logos no tempo da música, motion blur por subquadro |
| explainer-default / explainer-engaging | Barty-Bart/motion-graphics | Demo calma a 60 fps; história em uma tomada só, com estações |
| GitHub Unwrapped | [remotion-dev/github-unwrapped](https://github.com/remotion-dev/github-unwrapped) (~1,3 mil ★) | Vídeo personalizado em escala a partir de dados (como o nosso `gerado/*.json`). O README diz: código MIT, mas o áudio foi licenciado da SmartSound só para esse site. Não reaproveitar o som. Continua precisando do Remotion (RL) para rodar |
| Trailer do Remotion | [remotion-dev/trailer](https://github.com/remotion-dev/trailer) (~1,1 mil ★) | Promo de produto feita pelo próprio time. O README avisa que é preciso Company License: **só referência** |

### 3.6 Padrões que se repetem nas melhores demos de produto feitas em código

Comparamos o `SKILL.md` do `explainer-default` (Barty-Bart), o `references/technique.md` do product-launch-motion, o toolkit da digitalsamba e as regras do `remotion-markup`. Isto é o que aparece em mais de uma fonte e ainda não está no nosso motor:

| Padrão | Valor concreto | Fonte | Situação no nosso motor |
|---|---|---|---|
| Uma coisa por vez: no máximo uma linha de texto e um elemento de UI; texto e UI quase nunca dividem o quadro | — | Barty-Bart | Em parte (os cartões de regra mostram até 3) |
| A câmera é o editor: sem corte seco; cada troca é push, pull ou glide, ou um blur-dissolve curto sobre o fundo liso | blur-dissolve de 0,3–0,4 s; câmera com ease de 0,6–1,2 s ou mola com ζ ≥ 0,95 | Barty-Bart | Temos wipe e whip; falta o blur-dissolve curto como 3ª transição |
| Título pequeno que a câmera aumenta (em vez de fonte grande) | linha de cerca de 28 px a 1080p, empurrada até ocupar cerca de 75 % da largura | Barty-Bart | Não; os títulos já nascem grandes |
| Marcador de palavra-chave: caixa na cor da marca passando da esquerda para a direita | acento com 15–20 % de opacidade | Barty-Bart | Temos o marcador `spot`; conferir a opacidade |
| Tempo de leitura e de ação real | título fica cerca de 2 s depois de pousar; digitação a cerca de 25 caracteres/s; pausa de 0,5 s depois de cada resultado | Barty-Bart | Falta digitação animada nos campos do print |
| Recuo depois da ação: a câmera abre para mostrar a tela inteira antes de seguir | — | Barty-Bart, video-shotcraft | Já temos (cursor-flyover) |
| Mola fechada, com uma mola somada por mudança de alvo; alvo que precisa *chegar* em T é disparado cerca de 0,3 s antes | ζ 0,72–0,9 para objetos e 1,0 para câmera e texto | product-launch-motion | Usamos o `spring()` do Remotion, que reinicia a cada alvo; a soma de molas evita trancos |
| O que depende de histórico (câmera atrasada em relação ao objeto) é "assado" uma vez | passo de 1/240 s, depois interpolar | Barty-Bart | Não precisamos hoje |
| SFX com o **pico** no evento, 1 som por cue, relatório para ouvir | −16 LUFS e TP < −4 dBFS (Barty-Bart); ≈ −15 LUFS (product-launch-motion) | ambos | Usamos −14 LUFS (padrão do YouTube): **manter** |
| Motion blur por subquadro no render final, draft sem blur | 4 subquadros + `tmix`; draft a 30 fps sem blur | ambos | Não; o blur é por CSS |
| UI reconstruída em vetor no lugar do print, nos pontos-chave | — | Barty-Bart, digitalsamba (ds-release-649) | Não (v7 ou além) |
| Proibidos | bounce, mais de uma cor de acento, emoji, sombra grande, glassmorphism por toda parte, número inventado | Barty-Bart (+ nossa lista) | Já na especificação |

---

## 4. Comparação: ficar no Remotion ou trocar de engine?

| Critério | Remotion (atual) | HyperFrames | Revideo / Motion Canvas |
|---|---|---|---|
| Licença para empresa | Company License a partir de 4 pessoas (US$ 25 por mês por assento) | Apache-2.0, grátis | MIT, grátis |
| Custo de migrar | zero | reescrever as 6 cenas em HTML + GSAP (existe a skill `remotion-to-hyperframes`) | reescrever em generators; o React fica de fora |
| Ecossistema para o nosso caso | o maior: transições, motion blur, efeitos de print, legendas, whisper, skills oficiais | grande e voltado para agentes, mas mais novo | menor; forte em diagramas e código |
| Determinismo | sim (`useCurrentFrame`) | sim (timeline buscável) | sim |

### 4.1 O que muda se a Faktory não quiser pagar

O motor tem hoje cerca de 1.300 linhas de React: `FluxoVideoV3.tsx` (665), `FluxoVideo.tsx` (592) e `Root.tsx`. Usa do Remotion:
- `AbsoluteFill`, `Sequence`, `Img` e `Audio`;
- `interpolate`, `spring` e `Easing.bezier`;
- `useCurrentFrame`, `staticFile`, `getStaticFiles` e `delayRender`/`continueRender`;
- o render pelo `@remotion/renderer` (`scripts/render.mjs` e `remotion-em-partes.mjs`).

Os roteiros, a narração (VoiceStudio), a música (Python), a gravação de telas (Playwright) e o `preparar.mjs` **não dependem do Remotion** e ficam como estão em qualquer opção.

| Opção | Licença | Como seria | Esforço estimado* | O que se perde | Risco |
|---|---|---|---|---|---|
| **A. Pagar o Remotion** | Company License | Nada muda | 0 | Nada | Custo recorrente; preço sujeito a mudança no 5.0 |
| **B. HyperFrames** | Apache-2.0 (+ GSAP na licença grátis da Webflow) | Cada cena vira HTML, com uma timeline GSAP pausada que o renderizador busca quadro a quadro. A skill `remotion-to-hyperframes` traduz mecanicamente cerca de 80 % de uma composição típica (`useCurrentFrame`/`interpolate` viram tweens, `Sequence` vira clip, quadros viram segundos). Ela **sinaliza** o que não traduz, como `useState`/`useEffect` (nosso `useFontes`) e metadados assíncronos, e renderiza as duas versões para comparar quadro a quadro | 5 a 8 dias de dev, mais 2 a 3 dias de revisão visual dos 12 vídeos | Studio do Remotion, `@remotion/transitions`, `motion-blur` e `effects`: refazer em GSAP/CSS ou no nosso código; molas fechadas reescritas | Projeto novo (2025–26), de uma empresa (HeyGen); Node 22 ou superior; a licença do GSAP proíbe uso em construtor visual que concorra com a Webflow, o que não é o nosso caso |
| **C. Renderizador próprio** (padrão do product-launch-motion e do Barty-Bart) | MIT (React DOM, Playwright, ffmpeg) + código nosso | Manter os componentes React e trocar o Remotion por cerca de 300 linhas nossas: um `seek(t)` por contexto React, `Sequence`/`AbsoluteFill` simples, `interpolate`/`spring`/`bezier` (fórmulas públicas; **escrever do zero, sem copiar código do Remotion**), espera de fontes e imagens, captura com Playwright (já está no `package.json`) e montagem com ffmpeg. O áudio sai do `<Audio>` e vira mix no ffmpeg, a partir da lista de eventos | 4 a 6 dias de dev, mais 2 dias de revisão visual | Studio (preview com barra de tempo), transições prontas, efeitos de canvas. Em troca, ganha-se subquadro + `tmix` para motion blur real | Manter um renderizador sozinho (paralelismo, falhas do Chrome, sincronia de áudio); exige testes de determinismo |
| **D. Revideo** | MIT | Reescrever as 6 cenas como *generators* (`yield*`) com nós próprios, não React. Tem render headless (`renderVideo()` ou endpoint), workers paralelos, `<Audio>`/`<Video>` com sincronia por quadro e `<Player>` React | 8 a 12 dias de dev (reescrita total das cenas) | Todo o JSX/CSS atual: layout por flexbox, sombras e máscaras precisam ser refeitos nos nós do Revideo | Telemetria ligada por padrão (PostHog; desligar com `DISABLE_TELEMETRY=true`); comunidade menor; mantido por uma empresa (Midrender) |
| **E. Motion Canvas** | MIT | Mesmo modelo de generators e signals, com editor visual e waveform da voz | 8 a 12 dias, e o render em lote fica limitado | Igual à D, e ainda o lote: a exportação é pelo editor. Não confirmamos um render headless oficial; o Revideo nasceu justamente para cobrir isso | Ótimo para diagramas e código, fraco para render em lote de 12 vídeos |

\* Estimativas nossas, para 1 dev que conhece o motor, sem contar novas funções. Não foram medidas.

**Recomendação**
1. **Se o custo de US$ 25 a 75 por mês for aceitável: opção A.** É de longe a mais barata quando se conta o tempo de dev (uma semana de migração custa mais que anos de licença).
2. **Se a Faktory não quiser pagar: opção C** (renderizador próprio). Mantém o React e todos os componentes atuais, não cria nova dependência de fornecedor, e o motion blur por subquadro é até melhor.
3. **Opção B (HyperFrames)** é a segunda escolha, se preferirmos uma base mantida por terceiros e voltada para agentes.
4. **D e E** só valem se quisermos mudar o modelo de animação inteiro, o que não precisamos.

**Antes de decidir:**
- não subir o Remotion para o 5.0;
- registrar a decisão num ADR em `docs/adr/`;
- se for a opção C ou B, congelar novas funções no motor atual até terminar a migração.

---
