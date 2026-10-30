---
title: "Spec v5: bíblia de edição e efeitos (1/5)"
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

> Importado do Harness-Arquitetura-Flow (Faktory Flow) em 2026-10-26. Referência histórica do motor; o código genérico está em `video-engine/`. Índice: [[Knowledge/video-engine/README]]. Parte 1 de 5; próxima: [[Knowledge/video-engine/spec-v5-editing-bible-2]].

# Especificação do motor de vídeo v5 "exagerado"

**Data:** 23/10/2026
**Pedido do responsável:** "algo bem exagerado, bem profissional, que pareça que um editor profissional editou".
**Base:** `Guia-Do-Consultor/videos/src/FluxoVideoV4.tsx` (Remotion 4.0.537, React, 1920×1080, 30 fps), lido por inteiro. Esta especificação só propõe o que o v4 ainda não tem, ou troca algo do v4 por uma versão mais forte, e diz qual.
**Marca:** azul `#3478A7`, limão `#D5DD26`, tinta `#131820`, fundo `#F4F6F9`; Inter e JetBrains Mono.
**Fontes estudadas (só leitura, 23/10/2026):**
- `Vincentwei1021/video-shotcraft` (Apache-2.0): 60 cartões de `references/shots/` (camera, effects, rhythm, transition, typography, ui-entrance, interaction, opening, data), `references/aesthetic-rules.md` e `references/sound-design.md`.
- `lemomo-ai/lemo-opuscar` (MIT): `DIRECTOR.md`, `TECHNIQUE.md` e os estilos `dark-keynote`, `glass-product`, `telestrator`, `kino-montage`, `countdown`, `news-package`, com `swiss-motion` de referência.
- `Vincentwei1021/mg-styles-15` (MIT): `README.md`, `rubric.md`, `template.md`, os prompts `09-bauhaus`, `18-hanazi`, `22-hud`, `08-morph` e `19-paperclip`, e o `lib/audio/README.md` com as funções de efeito sonoro.
- Pesquisa anterior desta pasta: `LEIA-ME.md`, `pesquisa-motion-e-skills.md` e `pesquisa-mcps-e-producao.md`.

> **Como a pesquisa foi feita.** A API do GitHub bloqueou por limite de uso logo no começo. As listas de arquivos foram lidas das páginas públicas das pastas no GitHub, e os arquivos pelo `raw.githubusercontent.com`. Nada foi instalado nem executado. Os filmes de demonstração não foram assistidos: os parâmetros vêm do texto dos cartões, que os próprios autores marcam como "ponto de partida, não definitivo". **Licenças:** daqui saem só ideias e números. Nenhum código foi copiado (os trechos abaixo foram escritos para o nosso motor) e nenhum áudio de terceiros entra. Os áudios do video-shotcraft vêm do Mixkit, e parte deles nem tem origem rastreável.

---

## 1. Bíblia de edição

### 1.1 Ritmo

| Camada | Frequência | Exemplos |
|---|---|---|
| **Micro-acento** (algo entra, marca, conta ou estala) | a cada **0,8 a 1,5 s** | palavra que pousa, tick de status, dígito que trava, chip do glossário na legenda |
| **Acento médio** (foco novo, cartão, item, lupa) | a cada **2,5 a 4 s** | voo da câmera para um campo, item de cuidado, regra nova |
| **Troca de cena** | a cada trecho (**6 a 12 s**), nunca abaixo de 4 s | as transições da seção 3 |
| **Golpe de quadro inteiro** (tremor ou flash da tela toda) | **no máximo 3 por vídeo**, com pelo menos **20 s** entre eles e nunca em cenas vizinhas | crash zoom da tela, slam da regra crítica **ou** congelamento, foto de família |
| **Respiro** (quase silêncio, imagem quase parada) | **2 por vídeo**, de 0,4 a 0,6 s | antes do golpe da tela e antes da foto de família |

Regras de ritmo:

1. **Nada parado por mais de 1 s.** As exceções são planejadas: os dois respiros, o logo final (1 s, regra R1 do video-shotcraft) e o congelamento, que tem uma ação nova a cada 0,3 a 0,6 s.
2. **Variar a velocidade.** Cada capítulo tem pelo menos uma série que acelera (a mesma ação, com intervalos cada vez menores) e uma freada forte. Um vídeo numa velocidade só é reprovado (`DIRECTOR.md` §7).
3. **A velocidade vem da aceleração.** Nenhuma posição anda em linha reta e velocidade constante por mais de 10 quadros. As exceções são as varreduras mecânicas (luz, scanner), que são lineares de propósito (aesthetic-rules R2; spotlight-sweep-moves).
4. **Tempo de leitura.** Depois que um texto termina de entrar, ele fica parado por pelo menos `letras ÷ 15 + 1,5 s` (`DIRECTOR.md` §7). A legenda fica pelo menos `max(1,8 s, fala + 0,6 s)`, como já é hoje.
5. **Som antes de imagem.** A transição seguinte começa a soar 6 quadros antes do corte (J-cut) pelo menos duas vezes por vídeo, e um som de sucesso atravessa o corte (L-cut) pelo menos uma vez (`DIRECTOR.md` §6).

### 1.2 Hierarquia de energia por cena (1 = calmo, 5 = máximo)

| Cena | Energia | Pico permitido | Efeitos v5 (seção 2) | O que tem de ficar quieto |
|---|---|---|---|---|
| Abertura | **5 → 3** | abertura em três cortes, depois a palavra-guia | 1, 2 | o título, depois que pousa: 1 s parado |
| Conceito (linha de status) | **3 → 4** na trava | rasgo de faixas na trava | 3, 4, 5 | os nomes dos status enquanto a voz fala deles |
| Regras | **3**; a crítica **4 a 5** | slam (1 por vídeo) | 3, 7, 8 | o texto da regra depois que entra: nada se mexe sobre ele |
| Telas | **2** na leitura, **5** no golpe | crash zoom (1 por vídeo) e congelamento (1 por vídeo, nunca na mesma tela) | 9, 10, 11, 12, 13, 14 | o print enquanto um campo é lido: câmera parada, só a deriva de até 1,2 % |
| Cuidados | **3 a 4**, tensão contida | carimbo | 10 (dutch), 15, 16 | o texto de cada item depois que pousa |
| Fechamento | **4 → 5 → 1** | foto de família | 18, 19 | o logo e o "Próximo vídeo" no último segundo |
| Legenda (o vídeo todo) | **1** | o chip do termo do glossário | 17 | a legenda inteira: ela nunca treme, gira nem borra |

### 1.3 Onde o exagero não entra

1. **Texto que é para ler não se mexe.** Legenda, rótulo, título e texto da regra, item de cuidado, nome do campo: enquanto estão sendo lidos, ficam com blur 0, rotação 0 (±0,5°) e escala estável. Blur e rastro só existem com movimento acima de 8 px por quadro, e zeram até 3 quadros depois da parada.
2. **A legenda não ganha efeito.** Ela só entra e sai. A única animação dentro dela é o chip do termo, que não muda a largura da linha (efeito 17).
3. **O print não leva glitch, divisão de cor (RGB) nem inversão** enquanto um campo dele é explicado. O rasgo de faixas (efeito 5) fica na linha de status e dura no máximo 10 quadros.
4. **Sem tremor contínuo.** Tremor só no golpe, por no máximo 6 quadros (aesthetic-rules Q3). Nada de "câmera na mão".
5. **Brilho e varredura de luz: uma vez por vídeo,** sempre recortados pela borda arredondada do elemento (aesthetic-rules Q4).
6. **Flashes:** no máximo 3 por segundo, e nunca dois flashes de tela inteira a menos de 10 quadros um do outro (critério de segurança para fotossensibilidade, WCAG 2.3.1). Sobre o fundo claro, o flash branco vai até 0,55 de opacidade, não 0,95.
7. **Nada de dado de cliente.** Tudo o que copia o print (abertura em três cortes, faixas, porta de letra, portal, lupa, foto de família) desenha a camada `borrar` junto: a cópia é da camada inteira (imagem + borrões), nunca só da `<Img>`. Contadores e odômetros mostram só ordem e contagem (regra 2 de 4, etapa 3) ou números da base com fonte. O texto digitado (efeito 13) é fictício e passa por uma checagem de CPF, CNPJ, e-mail, telefone e valor no `preparar.mjs`.
8. **Uma cor, um papel,** como no v4: azul para foco e estado atual, limão só como marcador, laranja só em cuidado, verde só em concluído. A divisão de cor do rasgo usa azul e limão em `multiply`. Nenhuma cor nova.
9. **Continuam proibidos:** dissolve cruzado entre cenas, mola de desenho animado (damping abaixo de 11), som de jogo (bleep, bloop, apito de "sucesso"; aesthetic-rules S1) e glitch em texto de leitura.
10. **Tamanho mínimo.** O exagero não pode encolher texto. O v5 sobe a legenda de 38 para **46 px** (no máximo 2 linhas) e os rótulos mono sobre a tela de 20 a 22 px para **28 px efetivos** (fontSize × escala da câmera). O aesthetic-rules Q11 pede 56 px para legenda vista no celular; 46 px é o meio-termo para o nosso pedaço de até 78 caracteres.

---

## 2. Efeitos novos (19)

Convenções: `q` = quadro (30 fps); "mola 250/23" = `spring({ stiffness: 250, damping: 23, mass: 1 })`; as curvas são `Easing.bezier(...)` do Remotion; `f(n)` e `prog`, `mola`, `clamp`, `E` são os auxiliares que já existem no v4. Volumes em dB relativos à voz (tabela na seção 3.7).

### 2.0 Fundação técnica (antes dos efeitos)

Seis peças que vários efeitos usam. Nenhuma depende de pacote novo.

1. **Tempo remapeável.** Hoje `useT()` lê o quadro direto. Ele passa a ler um contexto, para o congelamento (efeito 12) e para desenhar uma cena "parada" dentro da porta de letra (efeito 9):
   ```tsx
   const Tempo = React.createContext<((t: number) => number) | null>(null);
   const useT = () => { const t = useCurrentFrame() / FPS; const m = React.useContext(Tempo); return m ? m(t) : t; };
   // <Tempo.Provider value={() => 0}>{cena}</Tempo.Provider> desenha a cena no instante 0
   ```
2. **Saída da cena anterior.** No v4 só a cena que entra se anima. A cena que sai continua parada por baixo durante a sobra de 0,75 s. A pan contínua, a íris e o empurrão precisam mover a cena que sai. Cada bloco recebe `saida={{ tipo, ini }}` com o tipo da transição seguinte, e um componente `<Saida>` aplica o transform nos últimos 0,75 s.
3. **`SomEm` com duração e pico.** Hoje o som é cortado em 15 quadros, o que mata riser e sub-boom. O componente passa a receber a duração do arquivo e alinha pelo **pico**, não pelo começo do arquivo:
   `from = round(evento × 30 − pico_q − 1,28)`. Os 1,28 q são o atraso típico do codificador AAC a 48 kHz (sound-design §4.6). **Medir no nosso pipeline** (Remotion 4.0.537 + AAC) antes de fixar. `pico_q` sai do gerador de sons (seção 3.6).
4. **Borrão direcional.** O `filter: blur()` do v4 borra por igual e "lava" o texto. Para movimento, só a direção do movimento borra:
   ```tsx
   const BorraoDir: React.FC<{ id: string; sx: number; sy?: number }> = ({ id, sx, sy = 0 }) => (
     <svg width={0} height={0} style={{ position: 'absolute' }}>
       <filter id={id} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
         <feGaussianBlur stdDeviation={`${sx.toFixed(2)} ${sy.toFixed(2)}`} edgeMode="duplicate" />
       </filter>
     </svg>
   );
   // uso: style={{ filter: sx > 0.3 || sy > 0.3 ? `url(#${id})` : undefined }}
   ```
   Desvio padrão = `min(64, 0,085 × velocidade em px/q)`, e só acima de 8 px/q (shot-transitions B, speed-ramp-freeze). Não usar `@remotion/motion-blur` em tela clara: o cartão crash-zoom-punch registra que ele amarela a imagem e deixa rastro em degraus.
5. **Folha de eventos (cue sheet).** Uma lista `{ t, tipo, som, dB, golpe? }` gerada da linha do tempo, com os tempos relativos ao início de cada trecho (sound-design §4.5). Ela alimenta os `SomEm`, a checagem de golpes (no máximo 3) e o item 4 do checklist.
6. **Validações no `preparar.mjs`:** no máximo 3 golpes de quadro inteiro; flash no máximo 3 por segundo; foco com `congela` com fatia de pelo menos 3,5 s; `digita` sem dado pessoal; palavra da porta de letra com no máximo 8 letras.

Campos novos do roteiro (`Trecho`): `critica?: boolean` (regra), `congela?: number` (índice do foco), `digita?: { foco: number; texto: string; cor?: string; tam?: number }`, `palavras?: { w: string; ini: number; fim: number }[]` (tempo de cada palavra) e `termos?: string[]` (nomes do glossário que viram chip).

---

### 1. Abertura em três cortes (cold open)

- **Cena:** abertura, antes do logo. Entra no lugar do início "logo e título" do v4, que passa a começar no quadro 33.
- **O que se vê:** três cortes secos de 9 quadros cada, sempre do mesmo print (o da tela com `impacto`), cada vez mais perto do campo de impacto: visão geral, meio e campo. Cada corte tem um empurrão linear e leve. Depois vêm 6 quadros de tinta pura, em silêncio, e o título entra.
- **Parâmetros:**
  - cortes nos quadros 0, 9 e 18, sem nenhum quadro de transição;
  - zoom de 1,0, 1,6 e 2,4, com `transform-origin` no centro do campo de impacto;
  - dentro de cada corte, escala de 1 → 1,04, linear;
  - quadros 27 a 32: fundo `#131820` liso, sem nada em cima (o "silêncio de uma batida");
  - título e logo a partir do quadro 33;
  - a voz do primeiro trecho começa 1,1 s depois do v4 (o `preparar.mjs` soma o deslocamento).
- **Como fazer:** dentro de `Abertura`, `const k = Math.floor(frame / 9)`. Para k < 3, desenhar a mesma camada da `Tela` (Img + `borrar`) com `scale(z[k] * (1 + 0.04 * (frame % 9) / 9))`. Para k = 3, só o fundo tinta. O resto da abertura vai para dentro de `<Sequence from={33}>`. O recorte tem de mostrar o `borrar` (regra 1.3.7).
- **Som:** um "baque-tique" por corte, com o pico no quadro do corte, em −10, −9 e −8 dB (crescendo): sub de 70 → 45 Hz em 80 ms mais um clique de 5 ms. Silêncio digital nos quadros 27 a 32, música incluída. A trilha entra no quadro 33 junto com o sub-boom da palavra-guia.
- **Origem:** `rhythm/trailer-grammar-moves` (três cortes de 9 q, empurrão de 1 → 1,04, 6 q de preto vazio, título no quadro 33); `rhythm/beat-cut-moves` (aproximação 1,0 / 1,6 / 2,8 do mesmo objeto); `DIRECTOR.md` §3 (gancho nos primeiros 3 s).

### 2. Palavra-guia gigante

- **Cena:** abertura, no título. Entra no lugar do "palavra a palavra" do v4.
- **O que se vê:** a primeira palavra do título nasce sozinha, enorme, no centro, e ainda avança na direção da câmera. Depois ela encolhe e desliza até o lugar dela na frase, e as outras palavras são empurradas para dentro dos seus lugares.
- **Parâmetros:**
  - **palavra-guia:** escala 2,3 → 2,3 × 1,06 nos quadros 0 a 12, curva `(0.25, 1, 0.5, 1)`; depois vai para 1 nos quadros 12 a 24;
  - **deslize até o lugar:** quadros 12 a 36, curva `(0.5, 0, 0.05, 1)` (a mesma do encolhimento, para ler como um movimento só);
  - **foco na entrada:** blur de 8 → 0 px nos 6 primeiros quadros;
  - **demais palavras:** a palavra i começa em `18 + (i − 1) × 4` q e entra de `translateX(0.5em)` → 0 em 12 q, curva `(0.22, 0.8, 0.36, 1)`, com opacidade em 2 q;
  - **limites:** a escala inicial é `min(2,3, 1600 / largura da palavra)`. Com palavra-guia de mais de 14 letras, ou título de uma palavra só, volta o `Palavras` do v4.
- **Como fazer:** medir cada palavra com `measureText` do `@remotion/layout-utils` (já instalado) em Inter 700, 112 px, espaçamento −0,025em. O ponto de apoio é `transform-origin: ${centroDaPalavra}px ${linhaDeBase}px`; com o apoio no meio da caixa da linha, a base treme. O deslocamento inicial põe o centro da palavra em x = 960: `dx = 960 − (esquerdaDoTítulo + centroDaPalavra)`. O espaço entre palavras fica **fora** do `inline-block`, senão as palavras grudam (bug registrado no cartão).
- **Som:** sub-boom em −8 dB no quadro 0 da palavra. É o primeiro som depois do silêncio, e por isso precisa ser um dos mais fortes (`DIRECTOR.md` §6). Um swish curto em −16 dB no quadro 12. As outras palavras ficam sem som, para não virar metralhadora.
- **Origem:** `typography/lead-word-zoom-assemble`.

### 3. Odômetro e numeral embaralhado

- **Cena:** contador "02 / 04" da linha de status; numeral gigante e rótulo "Regra 02" do cartão de regra; número dos cartões de cuidado; "TELA 02 / 04" na pílula da tela.
- **O que se vê:** o contador rola como um odômetro mecânico, uma casa por vez, sem voltar a zero. O numeral gigante da regra entra embaralhando dígitos e trava um dígito de cada vez, com um pequeno assento.
- **Parâmetros:**
  - **odômetro:** uma casa em 8 q, curva `(0.25, 0.8, 0.25, 1)`, dígitos tabulares;
  - **embaralhamento:** dígito aleatório trocado a cada 2 q; o dígito i trava no quadro `6 + 3i` com um assento de −8 % → 0 de altura (mola 250/23);
  - **rastro vertical:** borrão direcional `0 6` px enquanto os dígitos rolam.
- **Como fazer:**
  ```tsx
  const Rolo: React.FC<{ valor: number; h: number }> = ({ valor, h }) => { // valor contínuo, ex.: 1,37
    const uni = valor % 10, dez = Math.floor(valor / 10) + Math.max(0, uni - 9); // dezena rola junto no 9 → 10
    const col = (v: number) => (
      <span style={{ display: 'inline-block', height: h, overflow: 'hidden', verticalAlign: 'top' }}>
        <span style={{ display: 'block', transform: `translateY(${-v * h}px)` }}>
          {Array.from({ length: 11 }, (_, i) => <span key={i} style={{ display: 'block', height: h, lineHeight: `${h}px` }}>{i % 10}</span>)}
        </span>
      </span>
    );
    return <span style={{ fontVariantNumeric: 'tabular-nums' }}>{col(dez)}{col(uni)}</span>;
  };
  // valor = anterior + interpolate(t, [tMuda, tMuda + f(8)], [0, 1], { ...clamp, easing: Easing.bezier(0.25, 0.8, 0.25, 1) })

  const Embaralha: React.FC<{ texto: string; t: number; a: number }> = ({ texto, t, a }) => {
    const q = Math.round((t - a) * FPS);
    return <>{texto.split('').map((ch, i) => (q >= 6 + 3 * i || !/\d/.test(ch)
      ? <span key={i}>{ch}</span>
      : <span key={i} style={{ opacity: q < 0 ? 0 : 1 }}>{Math.floor(random(`g${i}-${Math.floor(q / 2)}`) * 10)}</span>))}</>;
  };
  ```
  `random` vem do `remotion` (determinístico). O numeral da regra mantém a travessia do v4 e só troca o conteúdo por `<Embaralha>`.
- **Som:** "grãos de dígito", com um tique a cada 2 q durante o embaralhamento, alternando 1,8 e 2,4 kHz e descendo de −22 para −26 dB. Um clique de madeira em −14 dB na trava. O odômetro leva um tique de −18 dB por casa.
- **Origem:** `lemo dark-keynote` ("Number from glyph noise"); `ui-entrance/list-stack-press` (rolo de dígitos de 8 q que não recomeça do zero, `tabular-nums`); `mg 22-hud` (números trocando por 3 a 5 quadros antes de assentar).

### 4. Documento vivo

- **Cena:** conceito. Muda como o documento anda pela linha de status.
- **O que se vê:** antes de andar, o documento recua e se agacha (antecipação). Depois dispara, esticando-se pela velocidade, com linhas de velocidade atrás, passa do ponto e volta, e pousa com um achatamento.
- **Parâmetros:**
  - **antecipação:** 8 q, recuo de −18 px, escala X 0,94 e Y 1,06, curva `E.entra`;
  - **disparada:** `Easing.out(Easing.poly(4))` em 24 q; com 2 passos de linha (~880 px) dá pico de ~147 px/q;
  - **esticamento pela velocidade v (px/q):** `scaleX = 1 + min(0.3, 0.002·v)` e `scaleY = 1 − min(0.1, 0.0007·v)`;
  - **linhas de velocidade:** 7 linhas de 3 px atrás do documento, comprimento `1,6·v` px, deslocadas ±8, ±18 e ±28 px em y, `#3478A7` a 0,5; só existem com v > 12 px/q;
  - **passa do ponto:** 40 px além do alvo, volta em 6 q (mola 250/15);
  - **pouso:** escala X 0,92 e Y 1,07 por 4 q, depois mola 250/23 até 1;
  - **rastro:** borrão direcional `min(10, 0,06·v) 0`.
- **Como fazer:** trocar o `interpolate(... E.move)` de `pos` em `LinhaStatus` por uma função de posição em px com as três fases; `pos` continua dirigindo as ondas dos nós, então cada nó acende quando o documento passa.
- **Som:** swoosh com Doppler de 0,5 s da esquerda para a direita, com o pico na velocidade máxima, em −14 dB. Um tique em cada nó atravessado, alternando duas variantes, em −16, −18 e −20 dB. Baque de madeira em −12 dB no pouso.
- **Origem:** `rhythm/sakuga-timing-shift` (a disparada em `out(poly(4))`, passar 40 px e voltar em 6 q, pouso 0,92/1,07, linhas de velocidade proporcionais que só aparecem com velocidade); `lemo dark-keynote` (o "elemento vivo", antecipação de 8 quadros ou mais).

### 5. Rasgo de faixas na trava

- **Cena:** conceito, quando o documento chega ao status com `cadeado`.
- **O que se vê:** só a faixa da linha de status se rasga em tiras horizontais que deslizam para os lados, com um fantasma azul e um limão. No meio do rasgo, o estado muda de uma vez (o cadeado aparece) e tudo volta ao lugar.
- **Parâmetros:**
  - **região:** y de 380 a 760;
  - **tiras:** 12 de alturas desiguais (18 a 48 px);
  - **deslocamento** `dx = 48 · sinal(h) · |h|^0.6`, com `h = random(i·31 + q·7) · 2 − 1`; 20 % das tiras paradas, 30 % no máximo, o resto leve;
  - **envelope de 10 q:** q 0–1 aviso (2 tiras finas ±12 px), q 2–4 ataque em `Easing.out(Easing.cubic)`, q 5–6 platô, q 7–10 dissipação linear;
  - **troca de estado:** corte seco no quadro 5;
  - **fantasmas:** cópias em `#3478A7` e `#D5DD26`, `mix-blend-mode: multiply`, ±10 px, opacidade 0,6, só nas tiras com |dx| > 25 px; linha branca de 1,5 px no topo das tiras mais rasgadas;
  - **fim:** depois do quadro 10, desmontar tudo, sem filtro sobrando.
- **Como fazer:** um `<Faixas>` desenha o miolo do `LinhaStatus` 12 vezes, cada cópia com `clipPath: inset(y0px 0 ${1080 − y1}px 0)` e o seu `translateX`, só durante os 10 quadros. Custo: 12 desenhos por 0,33 s, aceitável.
- **Som:** glitch curto de 220 ms em −14 dB no quadro 2, e um "clac" de trava em −10 dB no quadro 5: transitório de 2 ms + ressonâncias de 3,2 e 4,7 kHz em 60 ms + baque de 90 Hz.
- **Origem:** `transition/tear-streak-transitions` (faixas, nunca blocos; ±70 px; fantasmas em `multiply` sobre fundo claro; desmontar ao final); `lemo glass-product` (o clique "magnético": transitório + ressonâncias metálicas + baque).
