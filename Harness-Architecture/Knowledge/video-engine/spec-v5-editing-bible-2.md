---
title: "Spec v5: bíblia de edição e efeitos (2/5)"
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

> Importado do Harness-Arquitetura-Flow (Faktory Flow) em 2026-10-26. Referência histórica do motor; o código genérico está em `video-engine/`. Índice: [[Knowledge/video-engine/README]]. Parte 2 de 5; anterior: [[Knowledge/video-engine/spec-v5-editing-bible-1]]; próxima: [[Knowledge/video-engine/spec-v5-editing-bible-3]].

### 6. Íris casada no nó

- **Cena:** passagem conceito → regra.
- **O que se vê:** o nó da linha de status que estava em destaque pulsa duas vezes. Depois o disco azul dele vira um anel, e o anel abre um buraco redondo por onde aparece o cartão de regra. A linha de status, por trás, se afasta e escurece.
- **Parâmetros:**
  - **âncora:** o centro do nó (`X0 + passo·destaque`, 600), uma constante só para tudo;
  - **preparação (cena que sai):** pulsos de escala 1 → 1,16 nos quadros −18 e −8, e o resto escurece a 32 %;
  - **fase A (0–12 q):** o disco vira anel, raio 30 → 140 com `Easing.out(Easing.exp)` e traço 60 → 8 px em `#3478A7`;
  - **fase B (8–38 q):** raio da abertura = raio do anel + `2400 · bezier(0.62, 0, 0.32, 1)`;
  - **cena que sai:** escala 1,03 → 1,22 em torno da âncora e brilho 1 → 0,45 em 34 q (`Easing.in(Easing.cubic)`);
  - **cena que entra:** escala 0,9 → 1 em sincronia.
- **Como fazer:** `Transicao` ganha `tipo: 'iris'` com `ancora`. A nova cena usa `clipPath: circle(${r}px at ${x}px ${y}px)`, e um `<svg>` por cima desenha o anel. A cena que sai usa o `<Saida>` (fundação 2). O `CapituloAbre` "02 · Regras de negócio" continua dentro da íris.
- **Som:** pop de membrana em −14 dB no estouro do nó (quadro 0). Whoosh de ar de 0,8 s com o pico no quadro 12, em −12 dB.
- **Origem:** `transition/circle-match-iris` (círculos concêntricos com constantes únicas, disco → anel, abertura de +2400 px em 30 q com `(0.62, 0, 0.32, 1)`, página antiga de 1,03 → 1,22 com brilho a 0,45).

### 7. Empurrão de pilha

- **Cena:** passagem regra → regra. Entra no lugar do círculo do v4 dentro do mesmo capítulo.
- **O que se vê:** a regra nova sobe do rodapé com o fundo inteiro e empurra a anterior para fora pelo topo, como um bloco rígido. Uma sombra de contato marca a junção. As regras se alternam entre fundo papel e fundo azul escuro.
- **Parâmetros:**
  - **curva:** 26 q, `bezier(0.12, 0.9, 0.2, 1)` (95 % em ~12 q);
  - **posições:** `yNova = (1 − p)·1080` e `yVelha = −p·1080`, com a mesma curva (diferença de velocidade parece escorregão);
  - **sombra na borda de cima da nova:** 56 px de `rgba(19,24,32,.42)` → transparente, mais uma linha de luz de 2 px `rgba(255,255,255,.8)`; as duas somem com p > 0,98;
  - **rastro:** borrão direcional `0 min(12, 0,05·v)` nas duas camadas, com p < 0,9;
  - **fundos:** regra ímpar com fundo `#F4F6F9`; regra par com fundo `#1C4867`, cartão branco e numeral `rgba(255,255,255,.12)`;
  - **cartão:** o desenho do contorno começa no quadro 12, quando a nova já está a 95 %;
  - **limites:** sempre de baixo para cima; de 2 a 4 empurrões seguidos (mais que isso cansa).
- **Como fazer:** `Transicao` com `tipo: 'pilha'` aplica `translateY(yNova)` e a sombra; a cena anterior recebe `translateY(yVelha)` pelo `<Saida>`. Cada regra precisa de fundo opaco próprio: hoje a `Cobertura` só existe na passagem.
- **Som:** swish subindo de 0,3 s com o pico no quadro 6, em −16 dB. Baque de madeira no quadro 12 (o "encaixe"), em −10 dB: seno de 55 + 120·e^(−t/30 ms) Hz, t60 de 0,25 s, mais ruído de 120 a 1400 Hz em 0,12 s. Alternar duas variantes do baque.
- **Origem:** `transition/bottom-push-stack-wipe` (26 q, `(0.12, 0.9, 0.2, 1)`, sombra de 56 px a 0,42, linha de luz de 2 px, sempre na mesma direção, de 2 a 4 seguidos).

### 8. Slam da regra crítica

- **Cena:** regra com `critica: true` (no máximo 1 por vídeo). Só nessa regra, entra no lugar do contorno desenhado do v4.
- **O que se vê:** o cartão aparece colado na lente, enorme, desfocado e meio transparente. Cai com peso na posição. No impacto, um anel de choque se abre, lascas azuis e limão voam, a tela treme e pisca. O numeral e o título pousam logo depois.
- **Parâmetros:**
  - **pairando (q 0–9):** escala 2,75 → 2,6, blur 10 px, opacidade 0,55, rotação 5°;
  - **queda (q 9–15):** `Easing.in(Easing.quad)` até escala 0,965, blur 0, rotação 0; depois mola 260/14 até 1;
  - **impacto (q 15):**
    - anel com diâmetro de 120 → 1500 px em 16 q: abre com `out(cubic)` e some em linha reta (as duas curvas separadas), núcleo branco de 9 → 1,5 px com brilho limão `drop-shadow(0 0 18px rgba(213,221,38,.8))`;
    - 14 lascas que voam de 280 a 580 px, girando, e somem em 14 q;
    - tremor de 18 px × e^(−q/1,7) por 5 q, mais vertical que horizontal;
    - flash branco de 0,5 por 2 q;
  - **numeral e título:** o numeral pousa 3 q depois, o título 6 q depois.
  - **Conta como 1 golpe de quadro inteiro.**
- **Como fazer:** no `Regra`, se `r.critica`, desligar `traco` e calcular escala, blur e rotação pela curva acima. Anel e lascas num `<svg>` absoluto. O tremor vai num wrapper do quadro inteiro, com direção de `random('tremor' + q)`.
- **Som:** respiro, com a música a zero nos 9 quadros em que o cartão paira. No quadro 15: sub-boom em −6 dB + transitório de impacto em −8 dB + tilintar de lascas (parciais de vidro curtas) em −18 dB.
- **Origem:** `effects/slam-entrance-moves` (B score-slam: 2,6 / 5° / 6 q em `in(quad)`, anel de 120 → 1500 px, lascas, tremor de 18 px, flash de 2 q, abrir em `out(cubic)` e sumir em linha reta); `effects/impact-feedback`; aesthetic-rules R4.

### 9. Porta de letra

- **Cena:** passagem regra → tela. A palavra gigante é o título do capítulo 03 e entra no lugar do `CapituloAbre` dele.
- **O que se vê:** "TELA" em letras enormes e pretas de tão grossas, recortadas no papel. Dentro das letras aparece a primeira tela do sistema, andando devagar. O título inspira (encolhe um pouco) e mergulha: a haste do T cresce até virar a tela inteira, e a janela do sistema já está no lugar.
- **Parâmetros:**
  - **texto:** Inter 900, 470 px, espaçamento −0,03em; rótulo mono "03 · NA TELA" de 36 px em cima;
  - **entrada (q 0–10):** a máscara sobe da linha de base (`clip-path` inset de baixo), com escala 1,04 → 1;
  - **janela dentro (q 0–28):** escala 1,32, `translateX` de +60 → −60 px (~4 px/q);
  - **inspiração (q 28–36):** escala 1 → 0,965 em `(0.4, 0, 0.2, 1)`; o rótulo mono sai em `E.sai`;
  - **mergulho (q 36–60):**
    - `S = 0,965 · (46 / 0,965)^(u^1,8)`, com `u` linear de 0 → 1;
    - origem no meio da haste do T (sempre num traço cheio; num vazio aparece o fundo);
    - translação `(960 − ox, 540 − oy)·u`;
    - conteúdo de dentro com contraescala `1/S`, e a escala dele indo de 1,32 → 1 em `Easing.out(Easing.exp)`, com 4 q de atraso;
    - camada de segurança sem máscara aparece quando `u^1,8` vai de 0,86 a 0,95;
  - **duração total:** 60 q; a voz da tela começa no quadro 28 (adiantamento de 0,9 s, pelo mesmo mecanismo do `adianta`).
- **Como fazer:** o recorte é um `<clipPath>` SVG **inline** com `<text>`. Não usar SVG em `data:` URI como `mask-image`: SVG usado como imagem não enxerga as fontes do documento e cai na fonte do sistema.
  ```tsx
  <svg width={0} height={0} style={{ position: 'absolute' }}>
    <clipPath id="porta" clipPathUnits="userSpaceOnUse">
      <text x={xTexto} y={base} fontFamily={SANS} fontWeight={900} fontSize={470} letterSpacing="-0.03em">TELA</text>
    </clipPath>
  </svg>
  <div style={{ position: 'absolute', inset: 0, transformOrigin: `${ox}px ${oy}px`, transform: `translate(${tx}px, ${ty}px) scale(${S})` }}>
    <div style={{ position: 'absolute', inset: 0, clipPath: 'url(#porta)' }}>
      {/* contraescala: anula o zoom e a translação de fora, e a janela não deforma */}
      <div style={{ position: 'absolute', inset: 0, transformOrigin: `${ox}px ${oy}px`, transform: `translate(${-tx / S}px, ${-ty / S}px) scale(${1 / S})` }}>
        <Tempo.Provider value={() => 0}><Tela r={primeira} entrada={false} /></Tempo.Provider>
      </div>
    </div>
  </div>
  ```
  `ox` e `oy` vêm de `measureText("T")`: x = esquerda do texto + metade da largura do T; y = linha de base − 0,36 × 470 (meia altura de maiúscula). A `Tela` ganha `entrada={false}` (janela já assentada, `e = 1`), para a imagem de dentro ser exatamente a primeira imagem da cena real.
- **Som:** riser de 1,3 s terminando no quadro 60, chegando a −10 dB no fim. Whoosh de ar centrado, com o pico no quadro 52, em −12 dB. A música abre o filtro junto com o riser.
- **Origem:** `opening/text-as-mask` (palavra como janela, inspiração de 1 → 0,965 em 8 q, mergulho de 46× em 24 q no espaço logarítmico com `t^1,8`, origem num traço cheio, contraescala, camada de segurança entre 0,86 e 0,95); `transition/transition-travel` (letra como porta para o capítulo).

### 10. Inclinação de curva e ângulo holandês

- **Cena:** telas (inclinação da câmera nos voos) e cuidados (ângulo holandês na entrada).
- **O que se vê:**
  - **telas:** quando a câmera voa de um campo a outro, a janela inclina um pouco para o lado do voo, como um avião na curva, e volta reta quando a câmera para;
  - **cuidados:** a cena inteira entra torta, como desordem, e endireita quando o primeiro cuidado pousa ("o problema foi nomeado").
- **Parâmetros:**
  - **inclinação:** `rotZ = clamp(−0,035 · vx, −2,2°, 2,2°)`, com `vx` a velocidade horizontal da câmera em px/q, filtrada por mola 120/18; abaixo de 4 px/q o alvo é 0°, e a lupa só aparece com |rotZ| < 0,3°;
  - **ângulo holandês:** −3,5° na entrada da cena, mola 110/16 até 0° no pouso do primeiro cartão, por no máximo 0,8 s.
- **Como fazer:** na `Tela`, `rotZ` entra no mesmo `transform` de `rx` e `ry` da janela, calculado da diferença entre `cam` e `antes`, que já existem. Nos cuidados, um wrapper com `rotate()` e origem no centro.
- **Som:** a inclinação não tem som próprio (o whoosh do voo cobre). No ângulo holandês, o baque de alerta do v4 vai para o quadro em que a cena endireita.
- **Origem:** `lemo dark-keynote` (camera grammar: "Dutch angle and wobble only for disorder"); `camera/steep-tilt-glide` (rotateZ −2° fixo); aesthetic-rules Q6 (quadro denso de informação fica de frente).

### 11. Crash zoom com freio e tremor

- **Cena:** tela, no foco `impacto`. Entra no lugar do punch de +12 % do v4. O flash e o círculo de marcador continuam.
- **O que se vê:** a câmera recua um pouco, como quem toma impulso, e se atira no campo em 6 quadros. Chega com um tranco seco, e a imagem treme e para. O campo ocupa quase toda a janela.
- **Parâmetros:**
  - **recuo de impulso:** 6 q até −3 % (`out(quad)`);
  - **avanço:** 6 q em `Easing.in(Easing.cubic)` até `zCrash = min(2,2, max(1,6, 0,7·1920 / (c.w + 40)))`; até existirem prints em 2×, o teto é 1,8 (aesthetic-rules Q2: print em 1× amolece no zoom);
  - **eco radial só no avanço:** 3 cópias com escala `z·(1 − 0,012k)` e opacidades 0,3 / 0,18 / 0,1;
  - **chegada:** tremor de 14 px × e^(−q/1,8) por 6 q, em direção aleatória determinística, sem volta elástica; flash do v4 no quadro de chegada;
  - **permanência:** pelo menos 45 q parado no campo;
  - **retorno:** 18 q em `E.move` até o zoom de leitura (1,3);
  - a lupa fica desligada nesse foco (a câmera já amplia);
  - **conta como 1 golpe de quadro inteiro.**
- **Como fazer:**
  ```ts
  const crash = (q: number, zAlvo: number) => { // q = quadros desde o início do golpe
    if (q < 0) return { m: 1, dx: 0, dy: 0 };
    const pre = interpolate(q, [0, 6], [0, -0.03], { ...clamp, easing: Easing.out(Easing.quad) });
    const vai = interpolate(q, [6, 12], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
    const volta = interpolate(q, [57, 75], [0, 1], { ...clamp, easing: E.move });
    const amp = q >= 12 && q < 18 ? 14 * Math.exp(-(q - 12) / 1.8) : 0;
    const ang = random(`tremor-${q}`) * 2 * Math.PI;
    return { m: (1 + pre) * (1 + (zAlvo / Z - 1) * vai * (1 - volta)), dx: Math.cos(ang) * amp, dy: Math.sin(ang) * amp };
  };
  // em camNoTempo: m = hop * drift * crash(...).m (no lugar do punch); dx e dy entram no translate da janela
  ```
- **Som:** **respiro 1**: a música vai a zero em 2 q, 0,5 s antes do golpe, e fica em zero sem nenhum outro som. Nos 0,4 s antes da chegada, um "inchaço" de reverb ao contrário. Na chegada, sub-boom em −6 dB + clique transitório em −10 dB (o som mais alto do vídeo junto com o da foto de família). A música volta em 4 q depois do tremor.
- **Origem:** `camera/crash-zoom-punch` (6 q em `ease-in`, 2,4 a 2,8, recuo de 3 a 4 % antes, tremor de 14 px × e^(−t/1,8) que seca em 6 q, borrão só no avanço, pelo menos 45 q no destino, no máximo 2 por vídeo); aesthetic-rules R4.
