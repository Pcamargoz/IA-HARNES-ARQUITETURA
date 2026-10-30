---
title: "Spec v5: bíblia de edição e efeitos (4/5)"
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

> Importado do Harness-Arquitetura-Flow (Faktory Flow) em 2026-10-26. Referência histórica do motor; o código genérico está em `video-engine/`. Índice: [[Knowledge/video-engine/README]]. Parte 4 de 5; anterior: [[Knowledge/video-engine/spec-v5-editing-bible-3]]; próxima: [[Knowledge/video-engine/spec-v5-editing-bible-5]].

## 3. Som

### 3.1 Princípios

1. **Todo evento visível tem som** do material dele: papel, madeira, vidro, metal (`DIRECTOR.md` §6; aesthetic-rules S4).
2. **Vocabulário de filme de produto, não de jogo:** whoosh, impacto, riser, brilho, transição. Nada de bleep, bloop ou apito de "sucesso" (aesthetic-rules S1). O "pop" é de membrana (cai de tom, como uma bolha estourando), não um tom eletrônico. O "ding" é de vidro (parciais inarmônicas), não de notificação.
3. **Alinhar pelo pico, não pelo começo do arquivo.** `from = evento − pico − atraso do AAC` (fundação 3). Ponto de sincronia de cada som:
   - riser: o **fim** do arquivo;
   - whoosh e swoosh: a **passagem** (`0,62 × duração`);
   - boom, impacto, pop e ding: o começo.
4. **Sons repetidos não podem soar como metralhadora:** duas variantes alternadas, volume em escada decrescente (−1,5 dB por repetição) e intervalo acompanhando a animação. Quando ficam densos demais, os sons se fundem num swoosh só (aesthetic-rules S2).
5. **Dois respiros e duas costuras por vídeo:**
   - respiros: antes do crash zoom e antes do riser da foto de família;
   - J-cut no whip e no portal; L-cut no ding final.

### 3.2 Base comum (Python puro + numpy)

O gerador atual (`videos/musica/gerar_sfx.py`) usa só a biblioteca padrão. A versão v5 pode usar numpy. Rodar com `python -I`.

```python
import wave
import numpy as np

SR = 48000
rng = np.random.default_rng(7)          # semente fixa: o mesmo arquivo em toda execução

def t_(dur):
    return np.arange(int(SR * dur)) / SR

def svf(x, fc, q, modo='bp'):
    """Filtro de estado variável (topologia TPT) com corte que pode variar no tempo.
    modo: 'bp' (passa-faixa com ganho 1 no centro), 'lp' (passa-baixa), 'hp' (passa-alta)."""
    fc = np.broadcast_to(np.clip(fc, 20, SR * 0.45), x.shape)
    g = np.tan(np.pi * fc / SR); k = 1.0 / q
    a1 = 1 / (1 + g * (g + k)); a2 = g * a1; a3 = g * a2
    y = np.empty_like(x); ic1 = ic2 = 0.0
    for n in range(len(x)):
        v3 = x[n] - ic2
        v1 = a1[n] * ic1 + a2[n] * v3
        v2 = ic2 + a2[n] * ic1 + a3[n] * v3
        ic1, ic2 = 2 * v1 - ic1, 2 * v2 - ic2
        y[n] = k * v1 if modo == 'bp' else v2 if modo == 'lp' else x[n] - k * v1 - v2
    return y

def reverb_curta(y, dur=0.8):
    """Cauda de reverb por convolução (FFT) com ruído de decaimento exponencial."""
    ir = rng.standard_normal(int(SR * dur)) * np.exp(-6.9 * t_(dur) / dur)
    n = len(y) + len(ir) - 1; N = 1 << (n - 1).bit_length()
    c = np.fft.irfft(np.fft.rfft(y, N) * np.fft.rfft(ir, N), N)[:len(y)]
    return c / (np.max(np.abs(c)) + 1e-9)

def salva(nome, y, alvo_rms_db=-18.0, pico_db=-1.0):
    """Normaliza pela janela de 400 ms mais forte (aproximação do volume curto), limita o pico
    e grava WAV de 16 bits. Devolve a posição do pico em quadros, para o alinhamento do SomEm."""
    y = np.atleast_2d(y)
    p = (y ** 2).mean(0); c = np.concatenate([[0.0], np.cumsum(p)])
    w = min(int(SR * 0.4), y.shape[1])
    rms = np.sqrt(np.max(c[w:] - c[:-w]) / w)
    y = y * 10 ** (alvo_rms_db / 20) / (rms + 1e-12)
    lim = 10 ** (pico_db / 20); pk = np.max(np.abs(y))
    if pk > lim:
        y = y * lim / pk                      # som muito curto: quem manda é o pico
    pico_q = int(np.argmax(np.abs(y).max(0))) / SR * 30
    with wave.open(nome, 'wb') as f:
        f.setnchannels(y.shape[0]); f.setsampwidth(2); f.setframerate(SR)
        f.writeframes((np.clip(y.T, -1, 1) * 32767).astype('<i2').tobytes())
    return pico_q
```

Com todos os arquivos normalizados no mesmo nível, o volume no Remotion é `10^(dB/20)`, com os dB da tabela 3.7. **A voz também precisa ser normalizada para −18 dBFS de RMS na janela de 400 ms** (passo no `preparar.mjs`); senão a tabela não vale.

### 3.3 Riser (1,2 a 2,0 s; sincronia no fim)

- **Ruído:**
  - passa-alta de 150 → 6000 Hz com curva `x^1,4`;
  - mais passa-faixa de 400 → 9500 Hz com curva `x^1,2` e Q 3,5;
  - volume `x^2,2`.
- **Tom:**
  - três serras (fundamental + quinta + oitava, ganhos 1 / 0,6 / 0,7);
  - subindo uma oitava com curva `x^1,7`;
  - passa-baixa de 400 → 12000 Hz;
  - trêmolo que acelera de 3 → 22 Hz;
  - volume `x^1,8 × 0,45`.
- **Fim:** corte seco de 3 ms no golpe. O silêncio depois dele é o que dá força ao impacto.

```python
def riser(dur=1.3, nota=110.0):
    t = t_(dur); x = t / dur
    ruido = rng.standard_normal(len(t))
    ar = (0.5 * svf(ruido, 150 * 40 ** (x ** 1.4), 0.7, 'hp')
          + 0.9 * svf(ruido, 400 * 23.75 ** (x ** 1.2), 3.5, 'bp')) * x ** 2.2
    fase = 2 * np.pi * np.cumsum(nota * 2 ** (x ** 1.7)) / SR
    serra = lambda ph: 2 * ((ph / (2 * np.pi)) % 1) - 1
    tom = sum(g * serra(fase * 2 ** (iv / 12)) for iv, g in [(0, 1.0), (7, 0.6), (12, 0.7)])
    tom = svf(tom, 400 * 30 ** (x ** 1.3), 1.2, 'lp')
    trem = 1 - 0.5 * x * (0.5 + 0.5 * np.sin(2 * np.pi * np.cumsum(3 + 19 * x) / SR))
    y = ar + 0.45 * tom * trem * x ** 1.8
    n = int(SR * 0.003); y[-n:] *= np.linspace(1, 0, n)
    return y
```

### 3.4 Impacto grave, o sub-boom (1,8 s; sincronia no começo)

- **Seno:** frequência de `0,7·f0 + 0,6·f0·e^(−t/0,15 s)` com f0 = 48 Hz (62 → 34 Hz).
- **Envelope:** ataque de 3 ms, t60 de 1,26 s.
- **Saturação:** `tanh(2,5·x)`, que cria o 2º e o 3º harmônicos. É o que faz o grave aparecer em caixa de notebook e de celular (`TECHNIQUE.md` §5).
- **Ronco:** ruído com passa-baixa de 140 Hz, decaindo na duração inteira.
- **Clique:** 10 ms de ruído com passa-baixa de 3 kHz, para marcar o instante.
- **Final:** passa-alta de 24 Hz.

```python
def sub_boom(dur=1.8, f0=48.0):
    t = t_(dur)
    s = np.sin(2 * np.pi * np.cumsum(0.7 * f0 + 0.6 * f0 * np.exp(-t / 0.15)) / SR)
    env = np.minimum(1, t / 0.003) * np.exp(-6.9 * t / (0.7 * dur))
    s = np.tanh(2.5 * s * env)
    ronco = 3 * svf(rng.standard_normal(len(t)), 140, 0.7, 'lp') * np.exp(-6.9 * t / dur)
    n = int(SR * 0.01); clique = np.zeros_like(t)
    clique[:n] = 0.6 * svf(rng.standard_normal(n), 3000, 0.7, 'lp') * np.linspace(1, 0, n)
    return svf(0.9 * s + ronco + clique, 24, 0.7, 'hp')
```
