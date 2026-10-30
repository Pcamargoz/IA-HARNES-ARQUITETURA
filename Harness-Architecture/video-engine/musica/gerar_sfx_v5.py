"""Efeitos sonoros do motor v5 (sintetizados com numpy, sem samples nem direitos de terceiros).

Receitas da especificação docs/motor-de-video/spec-v5-exagerado.md (Harness), seção 3: riser, sub-boom, swoosh com
Doppler (e as variações whoosh de ar e swish), pop de membrana, ding de vidro, baque de madeira, clac de trava,
cintilação e baque-tique da abertura. Todos saem normalizados no mesmo nível (-18 dBFS RMS na janela de 400 ms mais
forte, pico até -1 dBFS); o volume de cada uso fica no motor, em dB relativos à voz.
Uso: python -I gerar_sfx_v5.py <pasta_de_saida>
"""
import os
import sys
import wave

import numpy as np

SR = 48000
rng = np.random.default_rng(7)  # semente fixa: o mesmo arquivo em toda execução
saida = sys.argv[1]
os.makedirs(saida, exist_ok=True)


def t_(dur):
    return np.arange(int(SR * dur)) / SR


def svf(x, fc, q, modo='bp'):
    """Filtro de estado variável (TPT) com corte que pode variar no tempo: 'bp', 'lp' ou 'hp'."""
    fc = np.broadcast_to(np.clip(fc, 20, SR * 0.45), x.shape)
    g = np.tan(np.pi * fc / SR)
    k = 1.0 / q
    a1 = 1 / (1 + g * (g + k))
    a2 = g * a1
    a3 = g * a2
    y = np.empty_like(x)
    ic1 = ic2 = 0.0
    for n in range(len(x)):
        v3 = x[n] - ic2
        v1 = a1[n] * ic1 + a2[n] * v3
        v2 = ic2 + a2[n] * ic1 + a3[n] * v3
        ic1, ic2 = 2 * v1 - ic1, 2 * v2 - ic2
        y[n] = k * v1 if modo == 'bp' else v2 if modo == 'lp' else x[n] - k * v1 - v2
    return y


def reverb_curta(y, dur=0.8):
    ir = rng.standard_normal(int(SR * dur)) * np.exp(-6.9 * t_(dur) / dur)
    n = len(y) + len(ir) - 1
    N = 1 << (n - 1).bit_length()
    c = np.fft.irfft(np.fft.rfft(y, N) * np.fft.rfft(ir, N), N)[:len(y)]
    return c / (np.max(np.abs(c)) + 1e-9)


def salva(nome, y, alvo_rms_db=-18.0, pico_db=-1.0):
    y = np.atleast_2d(y)
    p = (y ** 2).mean(0)
    c = np.concatenate([[0.0], np.cumsum(p)])
    w = min(int(SR * 0.4), y.shape[1])
    rms = np.sqrt(np.max(c[w:] - c[:-w]) / w)
    y = y * 10 ** (alvo_rms_db / 20) / (rms + 1e-12)
    lim = 10 ** (pico_db / 20)
    pk = np.max(np.abs(y))
    if pk > lim:
        y = y * lim / pk
    with wave.open(os.path.join(saida, nome), 'wb') as f:
        f.setnchannels(y.shape[0])
        f.setsampwidth(2)
        f.setframerate(SR)
        f.writeframes((np.clip(y.T, -1, 1) * 32767).astype('<i2').tobytes())
    print(f'{nome}: {y.shape[1] / SR:.2f} s, pico no quadro {np.argmax(np.abs(y).max(0)) / SR * 30:.1f}')


def riser(dur=1.3, nota=110.0):
    t = t_(dur)
    x = t / dur
    ruido = rng.standard_normal(len(t))
    ar = (0.5 * svf(ruido, 150 * 40 ** (x ** 1.4), 0.7, 'hp') + 0.9 * svf(ruido, 400 * 23.75 ** (x ** 1.2), 3.5, 'bp')) * x ** 2.2
    fase = 2 * np.pi * np.cumsum(nota * 2 ** (x ** 1.7)) / SR
    serra = lambda ph: 2 * ((ph / (2 * np.pi)) % 1) - 1
    tom = sum(g * serra(fase * 2 ** (iv / 12)) for iv, g in [(0, 1.0), (7, 0.6), (12, 0.7)])
    tom = svf(tom, 400 * 30 ** (x ** 1.3), 1.2, 'lp')
    trem = 1 - 0.5 * x * (0.5 + 0.5 * np.sin(2 * np.pi * np.cumsum(3 + 19 * x) / SR))
    y = ar + 0.45 * tom * trem * x ** 1.8
    n = int(SR * 0.003)
    y[-n:] *= np.linspace(1, 0, n)
    return y


def sub_boom(dur=1.8, f0=48.0):
    t = t_(dur)
    s = np.sin(2 * np.pi * np.cumsum(0.7 * f0 + 0.6 * f0 * np.exp(-t / 0.15)) / SR)
    env = np.minimum(1, t / 0.003) * np.exp(-6.9 * t / (0.7 * dur))
    s = np.tanh(2.5 * s * env)
    ronco = 3 * svf(rng.standard_normal(len(t)), 140, 0.7, 'lp') * np.exp(-6.9 * t / dur)
    n = int(SR * 0.01)
    clique = np.zeros_like(t)
    clique[:n] = 0.6 * svf(rng.standard_normal(n), 3000, 0.7, 'lp') * np.linspace(1, 0, n)
    return svf(0.9 * s + ronco + clique, 24, 0.7, 'hp')


def swoosh(dur=0.7, pico=0.62, lo=300.0, hi=4000.0, doppler=0.35, direcao=1):
    t = t_(dur)
    tp = pico * dur
    w_in, w_out = max(0.42 * tp, 0.02), max(0.38 * (dur - tp), 0.02)
    d = np.where(t < tp, (t - tp) / w_in, (t - tp) / w_out)
    prox = 1 / (1 + d ** 2)
    fc = lo * (hi / lo) ** prox * 2 ** (doppler * np.tanh(-(t - tp) / (0.5 * (w_in + w_out))))
    ruido = rng.standard_normal(len(t))
    y = (1.4 * svf(ruido, fc, 1.2, 'bp') + 0.35 * svf(ruido, 0.6 * fc, 0.6, 'lp')) * prox ** 1.6
    pan = np.clip(direcao * 0.85 * np.tanh((t - tp) / (0.6 * (w_in + w_out))), -1, 1)
    return np.stack([y * np.sqrt((1 - pan) / 2), y * np.sqrt((1 + pan) / 2)])


def pop(altura=1.0, dur=0.09):
    t = t_(dur)
    f = 260 * altura + 900 * altura * np.exp(-t / 0.008)
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-6.9 * t / 0.05) * (1 - np.exp(-t / 0.0007))
    n = int(SR * 0.002)
    y[:n] += 0.2 * svf(rng.standard_normal(n), 2000, 0.7, 'hp')
    return y


def ding_vidro(f0=1318.5, dur=1.4):
    t = t_(dur)
    y = sum(g * np.sin(2 * np.pi * f0 * r * t) * np.exp(-6.9 * t / t60)
            for r, g, t60 in [(1.0, 1.0, 1.2), (2.76, 0.5, 0.6), (5.40, 0.3, 0.3), (8.93, 0.15, 0.15)])
    y = y * (1 - np.exp(-t / 0.001))
    return y + 0.25 * reverb_curta(y)


def baque_madeira(dur=0.3, variante=1.0):
    t = t_(dur)
    s = np.sin(2 * np.pi * np.cumsum(55 * variante + 120 * np.exp(-t / 0.03)) / SR) * np.exp(-6.9 * t / 0.25)
    n = int(SR * 0.12)
    r = np.zeros_like(t)
    r[:n] = 0.5 * svf(rng.standard_normal(n), 500, 0.6, 'bp') * np.exp(-6.9 * t[:n] / 0.12)
    return s + r


def clac():
    t = t_(0.2)
    y = np.zeros_like(t)
    n = int(SR * 0.002)
    y[:n] = rng.standard_normal(n)
    y += (np.sin(2 * np.pi * 3200 * t) + 0.7 * np.sin(2 * np.pi * 4700 * t)) * 0.4 * np.exp(-6.9 * t / 0.06)
    y += np.sin(2 * np.pi * 90 * t) * np.exp(-6.9 * t / 0.12)
    return y


def cintilacao(dur=0.5):
    t = t_(dur)
    ar = svf(rng.standard_normal(len(t)), 8000, 1.5, 'bp') * np.exp(-6.9 * t / 0.4)
    tons = sum(np.sin(2 * np.pi * f * t) for f in (3100, 4700, 6900)) * 0.3 * np.exp(-6.9 * t / 0.4)
    y = (ar + tons) * np.minimum(1, t / 0.02)
    pan = np.linspace(-0.8, 0.8, len(t))
    return np.stack([y * np.sqrt((1 - pan) / 2), y * np.sqrt((1 + pan) / 2)])


def baque_tique():
    """Abertura em três cortes: sub de 70 -> 45 Hz em 80 ms + clique de 5 ms."""
    t = t_(0.25)
    s = np.sin(2 * np.pi * np.cumsum(45 + 25 * np.exp(-t / 0.03)) / SR) * np.exp(-6.9 * t / 0.18)
    n = int(SR * 0.005)
    s[:n] += 0.8 * svf(rng.standard_normal(n), 3000, 0.7, 'hp')
    return np.tanh(1.8 * s)


salva('riser.wav', riser())
salva('sub-boom.wav', sub_boom())
salva('swoosh-whip.wav', swoosh(0.7, 0.62, direcao=-1))
salva('swoosh.wav', swoosh(0.6, 0.55, direcao=1))
salva('whoosh-ar.wav', swoosh(0.8, 0.62, 200, 2500, 0.2, 0))
salva('swish-a.wav', swoosh(0.28, 0.55, doppler=0.25, direcao=1))
salva('swish-b.wav', swoosh(0.28, 0.55, 380, 4600, 0.25, -1))
salva('pop-a.wav', pop(1.0))
salva('pop-b.wav', pop(1.12))
salva('ding-vidro.wav', ding_vidro())
salva('baque-a.wav', baque_madeira(variante=1.0))
salva('baque-b.wav', baque_madeira(variante=1.15))
salva('clac.wav', clac())
salva('cintilacao.wav', cintilacao())
salva('baque-tique.wav', baque_tique())
