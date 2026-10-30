"""Gera os efeitos sonoros dos vídeos (sintetizados, sem samples nem direitos autorais).

clique.wav: clique de trackpad (ruído curto filtrado + "tic" agudo).
tick.wav, check.wav, alerta.wav: entrada de cartão, sucesso e alerta.
whoosh.wav: passagem suave de tela (ruído com envelope e varredura de filtro).
Uso: python -I gerar_sfx.py <pasta_de_saida>
"""
import array
import math
import os
import random
import sys
import wave

SR = 48000
random.seed(5)
saida = sys.argv[1]
os.makedirs(saida, exist_ok=True)


def grava(nome, amostras):
    pico = max(abs(x) for x in amostras) or 1.0
    pcm = array.array('h', (int(max(-1, min(1, x / pico * 0.9)) * 32767) for x in amostras))
    with wave.open(os.path.join(saida, nome), 'wb') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


# clique: 35 ms
n = int(SR * 0.035)
clique, ant = [], 0.0
for j in range(n):
    t = j / SR
    env = math.exp(-t * 260)
    ruido = random.uniform(-1, 1)
    ant = ant + 0.35 * (ruido - ant)          # passa-baixa simples
    tic = math.sin(2 * math.pi * 2900 * t) * math.exp(-t * 520)
    clique.append((ant * 0.7 + tic * 0.5) * env)
grava('clique.wav', clique)

# whoosh: 420 ms
n = int(SR * 0.42)
whoosh, lp, bp = [], 0.0, 0.0
for j in range(n):
    x = j / n
    env = math.sin(math.pi * x) ** 2
    corte = 0.02 + 0.25 * x                     # o filtro abre ao longo da passagem
    ruido = random.uniform(-1, 1)
    lp = lp + corte * (ruido - lp)
    bp = bp + 0.5 * (lp - bp)
    whoosh.append((lp - bp) * env)
grava('whoosh.wav', whoosh)

# tick: entrada de cartão, 60 ms (marimba curta: fundamental + 4º harmônico, ataque rápido)
n = int(SR * 0.06)
tick = []
for j in range(n):
    t = j / SR
    tick.append((math.sin(2 * math.pi * 1320 * t) + 0.35 * math.sin(2 * math.pi * 5280 * t)) * math.exp(-t * 90))
grava('tick.wav', tick)

# check: sucesso, 380 ms (duas notas de vibrafone, quinta justa subindo)
n = int(SR * 0.38)
check = []
for j in range(n):
    t = j / SR
    a = math.sin(2 * math.pi * 784 * t) * math.exp(-t * 9)
    b = math.sin(2 * math.pi * 1175 * max(0.0, t - 0.09)) * math.exp(-max(0.0, t - 0.09) * 8) if t > 0.09 else 0.0
    trem = 1 + 0.08 * math.sin(2 * math.pi * 6 * t)
    check.append((a * 0.8 + b) * trem)
grava('check.wav', check)

# alerta: thump grave, 300 ms (seno descendo de 110 para 55 Hz)
n = int(SR * 0.3)
alerta, fase = [], 0.0
for j in range(n):
    t = j / SR
    fase += 2 * math.pi * (110 - 55 * min(1, t / 0.2)) / SR
    alerta.append(math.sin(fase) * math.exp(-t * 14))
grava('alerta.wav', alerta)
print('ok', saida)
