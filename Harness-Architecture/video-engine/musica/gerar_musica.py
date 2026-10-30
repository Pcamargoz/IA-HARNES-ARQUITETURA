"""Gera uma trilha ambiente suave (sem samples externos, sem direitos autorais).

Pad de acordes com ataque e soltura longos + notas de "sino" espaçadas.
Uso: python -I gerar_musica.py <saida.wav> <segundos>
"""
import array
import math
import random
import sys
import wave

SR = 44100
saida = sys.argv[1]
dur = float(sys.argv[2]) if len(sys.argv) > 2 else 70.0
n = int(SR * dur)
random.seed(11)


def hz(midi):
    return 440.0 * 2 ** ((midi - 69) / 12)


# Cmaj7 – Am7 – Fmaj7 – G6 (8 s cada), voicings abertos e graves suaves
ACORDES = [[48, 55, 59, 64, 67], [45, 52, 55, 60, 64], [41, 48, 52, 57, 60], [43, 50, 55, 59, 64]]
ESCALA = [72, 74, 76, 79, 81, 84]   # pentatônica de dó para os sinos
SEG = 8.0

L = [0.0] * n
R = [0.0] * n

# pad: cada acorde dura SEG com sobreposição de 3 s (crossfade natural)
t_ac = 0.0
i_ac = 0
while t_ac < dur:
    notas = ACORDES[i_ac % len(ACORDES)]
    ini, fim = t_ac - 1.5, t_ac + SEG + 1.5
    a = max(0, int(ini * SR))
    b = min(n, int(fim * SR))
    for k, m in enumerate(notas):
        f = hz(m)
        detune = (1.0, 1.003)
        pan = 0.3 + 0.4 * (k / (len(notas) - 1))
        fase = random.random() * 6.28
        amp = 0.055 if m >= 52 else 0.07
        for j in range(a, b):
            t = j / SR
            x = (t - ini) / (fim - ini)            # 0..1 dentro do acorde
            env = math.sin(math.pi * x) ** 1.6       # sobe e desce devagar
            trem = 1 + 0.08 * math.sin(2 * math.pi * 0.18 * t + k)
            s = (math.sin(2 * math.pi * f * detune[0] * t + fase) + 0.6 * math.sin(2 * math.pi * f * detune[1] * t)) * amp * env * trem
            L[j] += s * (1 - pan)
            R[j] += s * pan
    t_ac += SEG
    i_ac += 1

# sinos: uma nota a cada ~1,6–3,2 s, decaimento exponencial
t = 2.0
while t < dur - 3:
    m = random.choice(ESCALA)
    f = hz(m)
    a = int(t * SR)
    b = min(n, a + int(3.2 * SR))
    pan = random.uniform(0.25, 0.75)
    for j in range(a, b):
        u = (j - a) / SR
        env = (1 - math.exp(-u * 60)) * math.exp(-u * 1.6)
        s = (math.sin(2 * math.pi * f * u) + 0.25 * math.sin(2 * math.pi * 2 * f * u)) * 0.035 * env
        L[j] += s * (1 - pan)
        R[j] += s * pan
    t += random.choice([1.6, 2.4, 3.2])

# fade geral e normalização
pico = max(max(abs(x) for x in L), max(abs(x) for x in R)) or 1.0
fade_in, fade_out = 3 * SR, 5 * SR
pcm = array.array('h')
for j in range(n):
    g = min(1.0, j / fade_in) * min(1.0, (n - j) / fade_out)
    pcm.append(int(max(-1, min(1, L[j] / pico * 0.8 * g)) * 32767))
    pcm.append(int(max(-1, min(1, R[j] / pico * 0.8 * g)) * 32767))

with wave.open(saida, 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print('ok', saida, dur, 's')
