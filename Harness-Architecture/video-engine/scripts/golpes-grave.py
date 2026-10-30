"""Golpes do grave com precisão de milissegundos: onde exatamente o bumbo/baixo ataca.

Uso: python scripts/golpes-grave.py <musica.wav> <mapa-ritmico.json> <saida.json>  (numpy, scipy, librosa)

Filtra a música abaixo de 120 Hz, mede a energia com janela curta (2,9 ms de passo), acha cada ataque e refina
o instante para o começo do transiente (onde a energia sobe mais rápido). Compara com a grade de batidas.
"""
import json, sys
import numpy as np
import librosa
from scipy.signal import butter, sosfiltfilt

wav, mapa, out = sys.argv[1], sys.argv[2], sys.argv[3]
y, sr = librosa.load(wav, sr=44100, mono=True)
d = json.load(open(mapa))
bt = np.array([b['t'] for b in d['batidas']])

sos = butter(4, 120, btype='low', fs=sr, output='sos')
g = sosfiltfilt(sos, y)
H = 128  # 2,9 ms
env = np.sqrt(np.convolve(g ** 2, np.ones(512) / 512, mode='same'))[::H]
t_env = np.arange(len(env)) * H / sr
env_db = 20 * np.log10(env + 1e-9)
# fluxo positivo do envelope (subida de energia) suavizado
sub = np.maximum(0, np.diff(env, prepend=env[0]))
sub = np.convolve(sub, np.hanning(9) / np.hanning(9).sum(), mode='same')
sub_n = sub / sub.max()

picos = librosa.util.peak_pick(sub_n, pre_max=40, post_max=40, pre_avg=120, post_avg=40, delta=0.04, wait=60)
golpes = []
for p in picos:
    # pico de energia logo depois do ataque (força) e início do ataque (onde a subida passa de 30 % do pico local)
    j = p + np.argmax(env[p:p + 40])
    a = p
    while a > 0 and sub_n[a] > 0.3 * sub_n[p]: a -= 1
    golpes.append({'t': round(float(t_env[a]), 4), 'pico_t': round(float(t_env[j]), 4),
                   'forca': float(env[j]), 'subida': float(sub_n[p])})

fmax = max(g_['forca'] for g_ in golpes)
for g_ in golpes:
    g_['forca'] = round(g_['forca'] / fmax, 3)
    g_['subida'] = round(g_['subida'], 3)
    k = int(np.argmin(np.abs(bt - g_['t'])))
    g_['batida'] = k
    g_['desvio_ms'] = round((g_['t'] - bt[k]) * 1000, 1)
    # posição na grade de colcheias (0 = na batida, 0,5 = contratempo)
    ibi = 0.5769
    fase = ((g_['t'] - bt[0]) / ibi) % 1
    g_['fase'] = round(float(fase), 2)

forcas = np.array([g_['forca'] for g_ in golpes])
res = {'n': len(golpes), 'golpes': golpes,
       'envelope_grave_db_100hz': [round(float(env_db[int(i)]), 1) for i in np.arange(0, len(env), sr / H / 100)]}
json.dump(res, open(out, 'w'), indent=1)
print(f'{len(golpes)} golpes de grave; força mediana {np.median(forcas):.2f}')
desv = np.array([g_['desvio_ms'] for g_ in golpes])
print('desvio para a batida mais próxima (ms): mediana', np.median(desv), 'p10', np.percentile(desv, 10), 'p90', np.percentile(desv, 90))
from collections import Counter
print('fase (0=batida, .5=contratempo):', Counter(round(g_['fase'] * 4) / 4 % 1 for g_ in golpes))
for sec, (a, b) in {'intro': (0, 8.9), 'build': (8.9, 11.2), 'groove': (11.2, 45.9), 'break': (45.9, 48.2), 'drop': (48.2, 65.5), 'fim': (65.5, 73)}.items():
    gs = [g_ for g_ in golpes if a <= g_['t'] < b]
    fortes = [g_ for g_ in gs if g_['forca'] >= 0.5]
    print(f'{sec:7} {len(gs):3} golpes, {len(fortes):3} fortes (>=0,5) · por compasso: {len(gs) / max((b - a) / 2.3077, 1e-9):.1f}')
