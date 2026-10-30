---
title: "Spec v5: bíblia de edição e efeitos (5/5)"
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

> Importado do Harness-Arquitetura-Flow (Faktory Flow) em 2026-10-26. Referência histórica do motor; o código genérico está em `video-engine/`. Índice: [[Knowledge/video-engine/README]]. Parte 5 de 5; anterior: [[Knowledge/video-engine/spec-v5-editing-bible-4]].

### 3.5 Swoosh com Doppler (0,5 a 0,8 s; sincronia na passagem)

- **Proximidade:** `prox = 1 / (1 + d²)`, com `d` medido em relação à passagem `tp = 0,62·dur`. A janela de chegada é `0,42·tp` e a de saída `0,38·(dur − tp)`.
- **Corte do filtro:** `fc = 300 · (4000/300)^prox · 2^(0,35·tanh(−(t − tp)/τ))`. A frequência fica mais aguda chegando e mais grave indo, 0,35 oitava (o Doppler).
- **Volume:** `prox^1,6`.
- **Panorâmica:** de potência constante, `0,85·tanh((t − tp)/(0,6·τ))`, onde τ = soma das janelas. `direcao = −1` vai da direita para a esquerda (o whip).

```python
def swoosh(dur=0.7, pico=0.62, lo=300.0, hi=4000.0, doppler=0.35, direcao=1):
    t = t_(dur); tp = pico * dur
    w_in, w_out = max(0.42 * tp, 0.02), max(0.38 * (dur - tp), 0.02)
    d = np.where(t < tp, (t - tp) / w_in, (t - tp) / w_out)
    prox = 1 / (1 + d ** 2)
    fc = lo * (hi / lo) ** prox * 2 ** (doppler * np.tanh(-(t - tp) / (0.5 * (w_in + w_out))))
    ruido = rng.standard_normal(len(t))
    y = (1.4 * svf(ruido, fc, 1.2, 'bp') + 0.35 * svf(ruido, 0.6 * fc, 0.6, 'lp')) * prox ** 1.6
    pan = np.clip(direcao * 0.85 * np.tanh((t - tp) / (0.6 * (w_in + w_out))), -1, 1)
    return np.stack([y * np.sqrt((1 - pan) / 2), y * np.sqrt((1 + pan) / 2)])
```

Variações: o "whoosh de ar" usa `lo=200, hi=2500, doppler=0.2` e fica centrado (`direcao=0`); o "vácuo" do portal usa `dur=1.2, lo=120, hi=1800`. O swish curto usa `dur=0.28, pico=0.55, doppler=0.25`.

### 3.6 Glitch curto, pop de interface e ding de sucesso

**Glitch (180 a 250 ms):**
- segmentos de 4 a 35 ms, sorteados entre pulso de 80 a 2500 Hz, amostra-e-segura, buraco de silêncio, varredura de seno e ruído;
- cada segmento com 0,5 ms de entrada e saída (sem estalo);
- reduzido para 11 kHz e 6 bits;
- semente fixa por uso (o mesmo glitch em todo render).

```python
def glitch(dur=0.22, semente=11):
    r = np.random.default_rng(semente); n = int(SR * dur); y = np.zeros(n); i = 0
    while i < n:
        L = min(int(SR * r.uniform(0.004, 0.035)), n - i); tt = np.arange(L) / SR
        tipo = r.integers(0, 5)
        if tipo == 0:   seg = np.sign(np.sin(2 * np.pi * r.uniform(80, 2500) * tt))
        elif tipo == 1: seg = np.repeat(r.uniform(-1, 1, L // 24 + 1), 24)[:L]
        elif tipo == 2: seg = np.zeros(L)
        elif tipo == 3: seg = np.sin(2 * np.pi * np.cumsum(np.linspace(r.uniform(300, 3000), r.uniform(300, 6000), L)) / SR)
        else:           seg = 0.6 * r.standard_normal(L)
        m = min(24, L); seg[:m] *= np.linspace(0, 1, m); seg[-m:] *= np.linspace(1, 0, m)
        y[i:i + L] = seg * r.uniform(0.4, 1.0); i += L
    passo = SR // 11025
    return np.round(np.repeat(y[::passo], passo)[:n] * 31) / 31
```

**Pop de interface, de membrana (90 ms):**
- seno de `260 + 900·e^(−t/8 ms)` Hz (1160 → 260 Hz);
- t60 de 50 ms, ataque de 0,7 ms;
- 2 ms de ruído com passa-alta de 2 kHz por cima;
- duas variantes para alternar: altura 1,0 e 1,12.

```python
def pop(altura=1.0, dur=0.09):
    t = t_(dur)
    f = 260 * altura + 900 * altura * np.exp(-t / 0.008)
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-6.9 * t / 0.05) * (1 - np.exp(-t / 0.0007))
    n = int(SR * 0.002); y[:n] += 0.2 * svf(rng.standard_normal(n), 2000, 0.7, 'hp')
    return y
```

**Ding de sucesso, de vidro (1,4 s):**
- parciais de taça de vidro nas razões 1 / 2,76 / 5,40 / 8,93, com ganhos 1 / 0,5 / 0,3 / 0,15 e t60 de 1,2 / 0,6 / 0,3 / 0,15 s;
- ataque de 1 ms;
- 25 % de reverb curta;
- f0 = 1318,5 Hz (Mi 6). **Ajustar a tônica ou a terça da trilha** do `gerar_musica.py`, para o ding soar dentro do tom.

```python
def ding_vidro(f0=1318.5, dur=1.4):
    t = t_(dur)
    y = sum(g * np.sin(2 * np.pi * f0 * r * t) * np.exp(-6.9 * t / t60)
            for r, g, t60 in [(1.0, 1.0, 1.2), (2.76, 0.5, 0.6), (5.40, 0.3, 0.3), (8.93, 0.15, 0.15)])
    y = y * (1 - np.exp(-t / 0.001))
    return y + 0.25 * reverb_curta(y)
```

**Outros sons citados nos efeitos** (mesmas peças):
- **baque de madeira:** seno de 55 + 120·e^(−t/30 ms) Hz, t60 de 0,25 s, mais ruído de 120 a 1400 Hz por 0,12 s;
- **clac de trava:** transitório de 2 ms + senos de 3,2 e 4,7 kHz com t60 de 60 ms + baque de 90 Hz;
- **rangido de marcador:** ruído de 2 a 5 kHz em passa-faixa com amplitude modulada a 12 Hz;
- **tecla:** ruído de 4 ms de 2 a 6 kHz + 180 Hz em 15 ms;
- **cintilação:** ruído de 6 a 10 kHz + senos de 3,1, 4,7 e 6,9 kHz caindo em 0,4 s;
- **obturador:** dois cliques de 3 ms a 40 ms de distância, mais ruído de 1 a 4 kHz em 30 ms.

### 3.7 Níveis em dB relativos à voz

Referência: voz = 0 dB (RMS na janela de 400 ms). O volume no `<Audio>` é `10^(dB/20)`.

| Camada | Nível | Observação |
|---|---|---|
| Voz | **0** | normalizada a −18 dBFS de RMS antes do mix |
| Música sem voz | **−8** | |
| Música sob a voz | **−18** | abaixamento de 10 dB, como no v4 (0,2 → 0,062); queda de 3 dB por ±150 ms em cada golpe e em cada swoosh de transição |
| Sub-boom do golpe herói (crash zoom, foto de família, slam) | **−6** | o som mais alto do vídeo; conferir o true peak |
| Transitório de impacto | −8 | junto do sub-boom |
| Riser | de −36 a **−10** no fim | o crescimento já está no arquivo |
| Swoosh do whip | −10 | sob a voz: −14 |
| Swoosh e whoosh das outras transições | −12 | sob a voz: −16 |
| Baque de madeira e clac de trava | −10 | |
| Ding de vidro | −12 | soa por cima do corte (L-cut) |
| Clique do cursor | −14 | |
| Glitch | −14 | |
| Pop de interface | −16, depois −17,5, −19, −20,5… | escada nas repetições |
| Tique (cartão, status, odômetro) | −18 | |
| Cintilação da varredura | −18 | |
| Rangido de marcador | −20 | |
| Tecla | −20 (±1,5 aleatório) | |
| Grãos de dígito | −22 a −26 | |

Mixagem e entrega:
- efeitos de interface baixam 4 dB sob a voz, exceto os golpes heróis (`lemo dark-keynote`: música −8 dB e efeitos −4 dB sob a voz);
- respiro = música e efeitos a zero em 2 q (rampa de 66 ms; a mudança de volume por quadro sem rampa estala);
- master em −14 LUFS integrado (±1) e true peak de no máximo −1 dBTP (mantém o `loudnorm` em duas passadas);
- passa-alta de 28 Hz e graves abaixo de 120 Hz em mono;
- fade de 25 ms no começo se houver golpe na primeira amostra (`kino-montage`).

O `volume` acima de 1 funciona no render, mas a prévia do Studio corta em 1. **Julgar pelo MP4 renderizado** (sound-design §4.1).

---

## 4. Transições por tipo de passagem

| Passagem | Transição | Duração | Som |
|---|---|---|---|
| Abertura → conceito | **Fio-trilho:** o fio azul de 6 px sob o título estica e desce até virar a linha de status (y 600, de X0 a X1) em `E.move`; o título sai para cima por blur (y 0 → −40, blur 0 → 12 px, opacidade 1 → 0 em 10 q, `E.sai`); a linha nasce cheia (a `base` começa em 1) e o `CapituloAbre` "01 · Conceito" entra por cima | **30 q** (1,0 s) | swoosh suave de 0,6 s da esquerda para a direita, com o pico no q 14, em −14 dB; tique em −18 dB quando a linha trava |
| Conceito → regra | **Íris casada no nó** (efeito 6), com "02 · Regras de negócio" dentro | **8 q** de preparação + **38 q** | pop de membrana em −14 dB no estouro do nó; whoosh de ar de 0,8 s com o pico no q 12, em −12 dB |
| Regra → regra | **Empurrão de pilha** (efeito 7), alternando fundo papel e azul escuro | **26 q** | swish subindo de 0,3 s (pico no q 6) em −16 dB; baque de madeira no q 12 em −10 dB |
| Regra → tela | **Porta de letra** (efeito 9); a palavra "TELA" é o título do capítulo 03 | **60 q** (10 entrada + 18 janela + 8 inspiração + 24 mergulho) | riser de 1,3 s terminando no q 60 (−10 dB no fim); whoosh de ar centrado em −12 dB com o pico no q 52 |
| Tela → tela | **Whip com freio e borrão direcional** (efeito 14), as duas telas lado a lado | **37 q** | swoosh com Doppler de 0,7 s da direita para a esquerda, com o pico no pico de velocidade (q 3), em −10 dB; começa 6 q antes do corte (J-cut) |
| Tela → cuidados | **Portal do campo** (efeito 15); o campo fica laranja e vira a cena; "04 · Cuidados" entra dentro | **8 + 40 + 8 q** | whoosh de vácuo de 1,2 s com o pico a 60 %, em −12 dB; baque de alerta no q 48 em −10 dB; pad grave entrando 6 q antes (J-cut) |
| Cuidados → fechamento | **Desmonte + painel de marca:** os cartões de cuidado saem um por batida, de baixo para cima (6 q cada: `translateX` 0 → −160 px e `clip-path` fechando pela direita em 8 q, `E.sai`); o triângulo sai por último; depois vêm os painéis azul e limão do v4 acelerados (as duas faixas em 16 q, 3 q entre elas) | **3 × 6 + 16 = 34 q** (com 3 cartões) | tiques descendo (−18 / −20 / −22 dB, duas variantes alternadas); swoosh do painel em −12 dB; a música muda para o modo maior no corte |

Notas:
1. **Uma costura, uma transição.** Nada de flash por cima de whip, portal ou porta (shot-transitions: "转场不叠加").
2. Os painéis azul e limão do v4 saem da troca de capítulo e ficam só em cuidados → fechamento. O círculo que nasce da pílula vira reserva para os casos sem a cena de origem (por exemplo, um vídeo sem conceito).
3. O tempo de cada transição sai do trecho vizinho, como já acontece com a sobra de 0,75 s. A porta de letra e o portal são mais longos que a sobra. O `preparar.mjs` precisa abrir o espaço adiantando a voz do trecho seguinte (`adianta`), não esticando a cena anterior.

---

## 5. Checklist "cara de editor profissional"

Dez itens verificáveis. Cada um diz como conferir.

1. **Gancho:** no quadro 15 já há uma ação forte (a abertura em três cortes está na tela) e o título está legível até 3,0 s. *Conferir:* stills nos quadros 15 e 90.
2. **Nada parado sem querer:** nenhum trecho estático de mais de 1,0 s fora dos dois respiros, do congelamento e do logo final. *Conferir:* `ffmpeg -i video.mp4 -vf freezedetect=n=0.003:d=1 -f null -` lista só esses trechos.
3. **Gramática das transições:** cada passagem usa a transição da tabela 4; nenhuma cena troca por dissolve cruzado; nenhuma costura soma dois efeitos. *Conferir:* a folha de eventos lista o tipo de cada costura, e no código nenhuma troca de cena é feita só por opacidade.
4. **Orçamento de golpes:** no máximo 3 golpes de quadro inteiro, com pelo menos 20 s entre eles e nunca em cenas vizinhas; flashes no máximo 3 por segundo. *Conferir:* contagem automática na folha de eventos, com erro de build se passar.
5. **Som no quadro certo:** todo evento visual tem som, e o pico do som cai a no máximo 1 quadro do evento. *Conferir:* correlação cruzada de 2 a 3 sons nítidos no MP4 final, com resíduo de no máximo 0,5 q depois de compensar o atraso medido do AAC (sound-design §4.6).
6. **Física em tudo o que anda:** todo objeto que se desloca mais de 200 px tem antecipação, passada do ponto ou mola; nenhuma posição anda linear por mais de 10 q, exceto as varreduras declaradas. *Conferir:* faixas de 0,2 s nas ações rápidas (`TECHNIQUE.md` §8) e busca por `interpolate` linear em posição no código.
7. **Leitura protegida:** em todo quadro com texto para ler, esse texto tem blur 0, rotação entre −0,5° e 0,5° e escala estável. *Conferir:* stills a cada 1 s, ampliados em 200 % nos rótulos, na legenda e no texto da regra.
8. **Tamanho e tempo de texto:** legenda de pelo menos 46 px, com no máximo 2 linhas, sem cobrir o foco, pelo menos `max(1,8 s, fala + 0,6 s)` na tela; rótulos sobre o print com pelo menos 28 px efetivos. *Conferir:* contact sheet reduzida a 480 px de largura (simula o celular, aesthetic-rules Q11): tudo o que é para ler continua legível.
9. **Mixagem de editor:** −14 LUFS ±1 e true peak de no máximo −1 dBTP; a música fica 10 dB abaixo da voz durante a fala; os dois respiros (abaixo de −50 dBFS por pelo menos 0,4 s) existem antes dos dois golpes heróis; o som mais alto do vídeo é um desses golpes. *Conferir:* `ebur128=peak=true` e `silencedetect=n=-50dB:d=0.4` no MP4.
10. **Marca e privacidade:** em cada quadro há um acento só em destaque (limão só como marcador, laranja só em cuidado); todo quadro que copia o print (abertura em três cortes, faixas, porta, portal, lupa, foto de família) mostra o `borrar` aplicado; nenhum número de cliente na tela. *Conferir:* stills de cada um desses efeitos comparados com a lista `borrar` do roteiro, mais a checagem de dados pessoais do `preparar.mjs`.

---

## 6. O que fica fora do v5 e por quê

| Ideia vista | Por que não entra |
|---|---|
| Tremor contínuo de câmera, "câmera na mão" | aesthetic-rules Q3: em vídeo de produto claro, foi a primeira reclamação do usuário |
| Glitch de RGB por cima do print, efeitos de blocos (pixel-dissolve, derretimento) | tear-streak-transitions: blocos foram reprovados três vezes; e o print precisa ser lido |
| Câmera orbitando em "bullet time", vista explodida da janela, voo rasante sobre a tela | tension-camera-moves, space-camera-moves e graze-face-tour são caros e servem para mostrar um objeto, não para explicar um campo; ficam para um vídeo de lançamento |
| Pulsar a imagem inteira no ritmo da música | aesthetic-rules R4: vira tremor no ritmo da batida; o ritmo vai só para os elementos |
| Sons do Mixkit e do próprio video-shotcraft | origem sem rastreio e licença de terceiros; todos os nossos sons são sintetizados (seção 3) |
| `@remotion/motion-blur` no whip | amarela a imagem clara e deixa rastro em degraus (crash-zoom-punch, shot-transitions); o borrão direcional SVG resolve |

*Esta especificação é proposta, não aprovação. A mudança visual grande passa por uma prévia aprovada antes de renderizar a fila (regra 5 do `LEIA-ME.md`). A sugestão é fazer primeiro a fundação 2.0 e uma prévia com os efeitos 1, 9, 11, 12 e 14 num único vídeo.*
