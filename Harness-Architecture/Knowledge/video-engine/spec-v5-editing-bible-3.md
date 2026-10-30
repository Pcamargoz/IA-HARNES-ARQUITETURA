---
title: "Spec v5: bíblia de edição e efeitos (3/5)"
type: reference
status: reference
updated: 2026-10-26
tags:
  - hermes
  - video-engine
  - spec
related:
  - "[[Knowledge/video-engine/README]]"
---

> Importado do Harness-Arquitetura-Flow (Faktory Flow) em 2026-10-26. Referência histórica do motor; o código genérico está em `video-engine/`. Índice: [[Knowledge/video-engine/README]]. Parte 3 de 5; anterior: [[Knowledge/video-engine/spec-v5-editing-bible-2]]; próxima: [[Knowledge/video-engine/spec-v5-editing-bible-4]].

### 12. Congelamento com anotação

- **Cena:** tela, no foco `congela` (no máximo 1 por vídeo e nunca na tela do `impacto`).
- **O que se vê:** a câmera dispara rumo ao campo e, no meio do voo, **tudo para** com um estalo de obturador: a imagem perde a cor fora do alvo, aparece um selo "❚❚ PAUSA", uma seta de marcador limão se desenha até o campo e um cartão escuro dá o nome dele. Depois o voo retoma, sem pressa, e pousa no campo.
- **Parâmetros:**
  - **voo com rampa:** de 0 → 0,6 do caminho em 8 q com `Easing.in(Easing.quad)` (acelera até o congelamento, sem frear antes);
  - **congelamento:** 54 q (1,8 s) parado em 0,6, cursor parado junto;
  - **entrada do congelamento:**
    - flash de 0,55 por 3 q, só na janela;
    - punch de 1,035 → 1 em 0,35 s (`E.entra`);
    - imagem com `saturate(0.58)` (−42 %) e o campo redesenhado por cima com a cor original;
    - vinheta `rgba(19,24,32,.3)`;
    - deriva lenta de 1,2 %;
  - **ordem dentro do congelamento:** cantos em L (já existem) → seta (q 10–20) → cartão (q 22–30), cada um de 0,3 a 0,6 s depois do anterior;
  - **seta de marcador:**
    - contorno escuro de largura w + 6 a `rgba(0,0,0,.55)`;
    - núcleo `#D5DD26` de 6 px com brilho de 18 px e linha clara de w × 0,28;
    - desenhada ao longo do comprimento em 10 q, com a ponta surgindo nos últimos 10 %;
    - ondulação determinística de 1,5 px nos vértices;
  - **cartão:** fundo tinta, barra limão de 6 px à esquerda, Inter 600 de 30 px com o nome do campo (`nomes`, conferido no glossário);
  - **retomada:** de 0,6 → 1 em 14 q com `smootherstep`; a cor volta em 8 q; o selo vira "▶" e some;
  - a fatia desse foco precisa de pelo menos 3,5 s (validação no `preparar.mjs`).
- **Como fazer:** no `camNoTempo`, o `k` do voo desse foco usa a rampa abaixo. Cantos, seta e cartão continuam no tempo real; só câmera e cursor congelam. O tempo dos outros focos não muda, porque o congelamento é gasto dentro da fatia do próprio foco.
  ```ts
  const suave = (x: number) => x * x * x * (x * (6 * x - 15) + 10); // smootherstep
  const kRampa = (q: number) => q < 8 ? 0.6 * Easing.in(Easing.quad)(q / 8)
    : q < 62 ? 0.6 : q < 76 ? 0.6 + 0.4 * suave((q - 62) / 14) : 1;
  ```
- **Som:** **a música congela com a imagem** (`volumeMusica` vai a 0 em 2 q no quadro do congelamento). No congelamento: obturador + baque grave em −10 dB. Durante a seta: rangido de marcador em −20 dB (ruído de 2 a 5 kHz com vibração de 12 Hz). Tique em −16 dB quando o cartão pousa. Na retomada: whoosh ao contrário de 0,3 s, com a música voltando em 4 q. Se o vídeo também tiver o slam da regra crítica, este flash fica só na janela e não conta no orçamento de golpes; se não tiver, pode contar.
- **Origem:** `rhythm/speed-ramp-freeze` (inclinação 0 instantânea, flash de 3 q, círculo de marcador em 10 q com tremor `feTurbulence` de escala 6, pelo menos 45 q de congelamento, retomada em `smootherstep` de 22 q, no máximo 2 por filme); `lemo telestrator` (flash de 0,1 s a 0,55 + punch de 1,035 → 1,0 em 0,35 s + −42 % de saturação + vinheta; linha de marcador com contorno escuro, núcleo, brilho e luz; ordem anel → área → rótulo; congelamento de 1,8 a 2,4 s; "a música para com a imagem").

### 13. Campo digitado

- **Cena:** tela, nos passos de "preencher" (`digita`).
- **O que se vê:** o campo do print é apagado e um texto fictício é digitado nele, letra por letra, no ritmo de uma pessoa, com o cursor de texto firme enquanto digita e piscando depois.
- **Parâmetros:**
  - **remendo:** retângulo com a cor de fundo do campo (`cor`, padrão `#FFFFFF`) sobre o valor ou o placeholder do print;
  - **texto:** Inter no tamanho da fonte do print (`tam`, em px da captura);
  - **digitação:** 3 q por caractere (10 por segundo);
  - **cursor:** 2 px em `#131820`, firme durante a digitação e piscando com período de 8 q depois;
  - **respiro:** 11 q depois da última letra, e a borda do campo pulsa em azul (2 px, 10 q);
  - a lupa fica desligada nesse foco (ela recorta o print, não o remendo).
- **Como fazer:** um `div` absoluto dentro do mesmo contêiner da câmera (o que já tem `translate(cam) scale(cam.z)`), nas coordenadas da caixa do foco; `texto.slice(0, n)` com `n = floor((t − a) × 10)`.
- **Som:** tecla por caractere, com duas amostras alternadas e variação de ±1,5 dB, em −20 dB:
  - descida: ruído de 4 ms de 2 a 6 kHz + baque de 180 Hz em 15 ms;
  - subida: 40 ms depois, 8 dB mais baixa;
  - espaço: uma oitava abaixo;
  - Enter: estalo em −14 dB.
  O som acompanha a digitação exatamente, nem um quadro a mais (aesthetic-rules S4).
- **Origem:** `interaction/type-and-filter` (3 q por caractere, depois de pedirem para desacelerar; cursor firme → piscando em 8 q; respiro de ~11 q; remendo sobre o placeholder do print; teclado cortado no tamanho da ação).

### 14. Whip com freio e borrão direcional

- **Cena:** passagem tela → tela. Melhora o whip do v4: troca o borrão por igual pelo direcional e a entrada solitária por uma pan contínua.
- **O que se vê:** a câmera chicoteia para o lado e as duas telas passam juntas, lado a lado, na mesma linha. No pico, tudo vira rastro horizontal. A câmera freia num deslize longo até a tela nova, e o número da tela rola na pílula.
- **Parâmetros:**
  - **arranjo:** a tela nova fica 2040 px à direita da antiga (1920 + vão de 120 px), na mesma altura;
  - **velocidade:** `v(q) = 300 · q/3` até q = 3, depois `300 · e^(−(q−3)/5,3)` px/q (curva contínua, sem segunda arrancada);
  - **posição:** `x(q) = 300·q²/6` até q = 3, depois `450 + 1590·(1 − e^(−(q−3)/5,3))`; 70 % do caminho em ~8 q, e encaixe em 2040 no quadro 37;
  - **rastro:** borrão direcional `min(64, 0,085·v) 0` (pico de ~25 px), só com v > 8 px/q;
  - **pílula:** "TELA 02 / 04" com o odômetro do efeito 3 seguindo a fração percorrida;
  - **opcional:** régua de traços finos `#E2E6EC` a cada 48 px no rodapé, andando com a pan.
- **Como fazer:** `Transicao` com `tipo: 'whip'` passa a mover a tela nova de `2040 − x(q)`, e o `<Saida>` move a antiga de `−x(q)`. O `filter` vai na camada de cada tela, nunca no quadro inteiro. O cartão depth-layer-moves avisa que blur em camada de tela cheia pode triplicar o tempo de render; aqui ele dura só 37 q.
- **Som:** swoosh com Doppler de 0,7 s **da direita para a esquerda** (acompanha o conteúdo), com o pico no pico de velocidade (q 3), em −10 dB. O som começa 6 q antes do corte (J-cut).
- **Origem:** `transition/shot-transitions` B (whip com freio: 70 % do caminho em 30 % do tempo, curva única de 3 q de arrancada + queda exponencial, pico de pelo menos 300 px/q, borrão de 0,085 × velocidade até 64 px, cauda de no máximo 60 q, as duas cenas na mesma linha; o aviso de que o `CameraMotionBlur` amarela a imagem).

### 15. Portal do campo

- **Cena:** passagem tela → cuidados.
- **O que se vê:** o último campo em foco se levanta da tela, a borda dele fica laranja, e ele cresce até virar a tela inteira. Dentro dele a cena de cuidados já está nascendo, e a face do campo some no começo do crescimento.
- **Parâmetros:**
  - **levante (8 q):** −10 px e 1,03×, com o resto escurecido;
  - **abertura (40 q):** `bezier(0.7, 0, 0.3, 1)`, do retângulo do campo (coordenadas do palco, com a câmera já no recuo final) até `0 0 1920 1080`;
  - **borda e cantos:** raio de 10 → 0 px; borda de `#3478A7` → `#E8590C` nos primeiros 30 %;
  - **dentro:** os cuidados de 0,42 → 1 no mesmo `t`, só em 2 camadas (fundo + cartões) e sem blur;
  - **face do campo:** recorte com opacidade `1 − 3,6t`, apagada em ~28 %;
  - **final:** 8 q de parada suave, e então os cartões de cuidado seguem o tempo da voz.
- **Como fazer:** `Transicao` com `tipo: 'portal'` e `rect` (calculado no `FluxoVideo` a partir da última caixa do trecho anterior: `x = esq + S0·c.x`, `y = OY + S0·(BARRA + c.y)`). A cena nova usa `clipPath: inset(top right bottom left round r)` e `transform` de centro e escala.
- **Som:** whoosh grave de "vácuo" de 1,2 s com o pico a 60 % da abertura, em −12 dB. O baque de alerta do v4 vai para o quadro 40, em −10 dB. O pad grave da seção de cuidados entra 6 q antes (J-cut).
- **Origem:** `transition/shot-transitions` C (portal: levante de −10 px e 1,03×, 40 q com `(0.7, 0, 0.3, 1)`, cena de dentro de 0,42 → 1 no mesmo `t`, face com `1 − t·3,6`, só 2 camadas, parada de 8 q e pelo menos 30 q de imagem estável).

### 16. Carimbo e cartões que se montam

- **Cena:** cuidados. Entra no lugar da subida simples dos cartões do v4.
- **O que se vê:** depois que o triângulo se desenha, o carimbo "ATENÇÃO" cai torto sobre o título, com um anel. Cada cuidado se monta: primeiro a barra laranja cresce, depois o corpo do cartão é revelado a partir da barra, o número embaralha e o texto entra palavra por palavra. Cada cartão chega batendo e treme sozinho.
- **Parâmetros:**
  - **carimbo:**
    - aparência: moldura dupla `#E8590C` de 4 px, texto `#B54708` em Inter 800 de 34 px com espaçamento 0,08em, rotação −8°;
    - queda: escala 1,9 → 1 em 5 q (`in(cubic)`);
    - anel: elipse laranja de 1,5 px com raio 0 → 180 px em 12 q, sumindo em linha reta;
    - tremor só do título: 6 px × e^(−q/1,7) por 5 q;
    - um por vídeo;
  - **cartão:**
    - batida: `translateX` de 1400 → 0 em 5 q (`out(cubic)`), parada seca, tremor do cartão de ±8 px × e^(−14·Δt s) por ~6 q;
    - barra: `scaleY` de 0 → 1 em 6 q, antes do corpo;
    - corpo: `clip-path` revelado da esquerda para a direita em 8 q;
    - número "01": `<Embaralha>`;
    - texto: entrada por blur das palavras (y 0,38em → 0 e blur 9 → 0 px no mesmo progresso, 2,4 q entre palavras, 20 q por palavra);
  - **com o efeito 10:** a cena entra a −3,5° e endireita no pouso do primeiro cartão.
- **Como fazer:** no `Alertas`, cada item ganha três progressos (barra, corpo, texto) a partir do mesmo `a` que já existe. O carimbo é um `div` absoluto ao lado do título.
- **Som:**
  - carimbo: baque de 90 → 45 Hz em 120 ms + estalo de ruído acima de 1,5 kHz em 25 ms, em −10 dB;
  - cada cartão: batida curta alternando duas variantes, em −12, −13 e −14 dB (escada decrescente, aesthetic-rules S2);
  - música: passa-baixa em 1,2 kHz durante a seção.
- **Origem:** `lemo news-package` (carimbo de 1,9× em 0,16 s com elipse que se abre, −6° a −10°, um por matéria); `lemo kino-montage` (slam de 0,08 a 0,2 s com parada seca e tremor de 3 a 18 px × exp(−14·Δt)); `ui-entrance/product-card-progressive-assemble` (montagem campo a campo); `typography/blur-slide` (três canais no mesmo progresso).

### 17. Legenda karaokê com o termo do glossário

- **Cena:** legenda, o vídeo todo.
- **O que se vê:**
  - as palavras ainda não ditas ficam meio apagadas; a palavra falada fica branca e ganha um sublinhado limão que corre embaixo dela; as já ditas ficam brancas;
  - os nomes de tela, botão e status da base aparecem como um chip azul em fonte mono, que salta de leve logo depois de ser falado.
- **Parâmetros:**
  - **cores:** palavra não dita em `rgba(255,255,255,.55)`; falada e já dita em `#fff`;
  - **sublinhado:** 6 px, cantos arredondados, 6 px abaixo da base, largura de `p·100 %` na palavra ativa;
  - **chip:**
    - aparência: JetBrains Mono 600, fundo `rgba(52,120,167,.92)`, texto `#fff`, raio de 8 px, `padding: 0 10px`;
    - salto: escala 0 → 1,12 → 1 em 8 q (mola 300/16), 2 a 3 q **depois** do fim da palavra falada;
    - a largura do chip é reservada desde o início (`visibility: hidden` antes de saltar), para a linha não se rearrumar;
  - **pílula:** 46 px, no máximo 2 linhas; entrada por blur (y 10 → 0, blur 6 → 0 px e opacidade no mesmo progresso, 5 q).
  - **Tempo das palavras:** de `palavras` (WhisperX do VoiceStudio, como já previsto no roteiro do v5). Sem ele, proporcional às letras dentro da frase.
- **Como fazer:** em `Legenda`, quebrar `c.texto` em palavras e, para cada uma, `p = interpolate(t, [ini, fim], [0, 1], clamp)`. Os termos são casados com `termos` (conferidos no `glossary_lookup` no roteiro).
- **Som:** nenhum. A legenda nunca tem som.
- **Origem:** `typography/type-rhythm-sync` B (preenchimento palavra por palavra no tempo da narração, sublinhado de leitura com largura p·100 %, aviso de que 4 px some no vídeo reduzido); `mg 18-hanazi` (salto de 0 → 1,15 → 1 em ~8 quadros, 2 a 3 quadros depois da fala); `typography/blur-slide`.

### 18. Foto de família

- **Cena:** fechamento, no `tProx` (o "Próximo vídeo").
- **O que se vê:** cada capítulo manda um representante, que voa de uma direção e pousa em volta do bloco "Próximo vídeo" e do logo: o documento da linha de status (pela esquerda), o numeral da regra (por cima), um recorte da lupa do campo de impacto (pela direita, com o `borrar`) e o triângulo dos cuidados (por baixo). As chegadas ficam cada vez mais rápidas. Com todos no lugar, o logo carimba com um anel, e 25 quadros depois uma luz passa por ele.
- **Parâmetros:**
  - **voos:** 16 q com curva de sobra `(0.34, 1.56, 0.64, 1)`, de 120 a 420 px de distância e ±7° de rotação; a rotação chega 4 q depois da posição;
  - **chegadas:** q 0, 8, 13, 16 e 18 (aceleração forte, aesthetic-rules R2), todos parados no q 34;
  - **carimbo do logo (q 34):** escala 1,15 → 1 em 6 q, anel limão de 1,5 px com raio 0 → 220 px em 14 q, flash de 0,4 por 2 q;
  - **câmera:** empurrão de 1 → 1,04 ao longo da montagem;
  - **final:** pelo menos 1 s parado (R1); só a parede de telas do v4 continua respirando;
  - **conta como 1 golpe de quadro inteiro.**
- **Como fazer:** um componente `FotoDeFamilia` dentro de `Fechamento`, com os quatro ícones já existentes (`ICONES.cfop`, numeral em Inter 300, recorte do print por `background-position` como a `Lupa`, `ICONES.alerta`).
- **Som:**
  - **respiro 2:** a música vai a zero 0,4 s antes do riser, com no máximo um whoosh ao contrário dentro;
  - **voos:** swish curto em cada voo, alternando duas variantes, de −18 a −22 dB; quando o intervalo fica abaixo de 3 q, os swishes se fundem num swoosh só (S2);
  - **trinca final:** riser de 1,2 s terminando no q 34 → sub-boom em −6 dB no q 34 → ding de vidro em −12 dB no q 59, junto com a varredura de luz (efeito 19), soando por cima do fim (L-cut);
  - **música:** muda para o modo maior.
- **Origem:** aesthetic-rules Q8 (fechamento em "foto de família", com a energia no máximo do filme); sound-design §4.3 (riser → 35 q → impacto → 25 q → brilho); `effects/assemble-then-type-flyin` (16 q com sobra, 120 a 420 px, ±7°, rotação 4 q depois).

### 19. Varredura de luz única

- **Cena:** fechamento, no logo e na pílula "Próximo vídeo". Uma vez por vídeo.
- **O que se vê:** um brilho diagonal e macio passa uma vez pela pílula azul e pelo logo, preso ao formato de cada um.
- **Parâmetros:**
  - **faixa:** 360 px de largura, rotação de 14°, gradiente `transparent → rgba(255,255,255,.22) → transparent` (pico de 22 %, frente macia);
  - **movimento:** `translateX` de −500 px → largura + 500 px em 14 q, **linear**;
  - **na pílula:** `overflow: hidden` + `borderRadius: 999`;
  - **no logo:** `mask-image` com o próprio PNG do logo, para o brilho não vazar do desenho.
- **Como fazer:** um `div` filho da pílula; no logo, um `div` irmão com `maskImage: url(logo)` e `maskSize` igual ao `Img`.
- **Som:** cintilação em −18 dB, panorâmica da esquerda para a direita junto com a luz: ruído de 6 a 10 kHz + parciais inarmônicas de 3,1, 4,7 e 6,9 kHz caindo em 0,4 s.
- **Origem:** aesthetic-rules Q4 (um brilho por vídeo, só no protagonista, recortado pela borda arredondada); `ui-entrance/list-stack-press` (faixa de 360 px, 14°, `soft-light`, recortada); `lemo dark-keynote` (frente macia, brilho de no máximo 20 %; branco duro parece reflexo de adesivo).

---
