"""Grade da batida principal a partir da bateria separada (Demucs): bumbo e caixa com precisão de milissegundos.

1. Ataques de bumbo (30–120 Hz) e de caixa (150–300 Hz + 1,5–5 kHz) no stem da bateria, com passo de 2,9 ms; o tempo
   de cada ataque é o início do transiente (onde a subida passa de 30 % do pico local).
2. Grade: o andamento é muito estável, então ajusta t(k) = t0 + k·T por mínimos quadrados robustos sobre todos os
   ataques que caem perto de um tempo (semínima). Cada tempo da grade recebe o rótulo do que soa nele (bumbo, caixa,
   os dois, nada), a posição no compasso e a força.

Uso: python scripts/grade-bateria.py <drums.wav> <saida.json> [--madmom madmom.json]
O drums.wav vem do Demucs (MIT): python -m demucs --two-stems=drums -n htdemucs -d cpu <musica estéreo.wav>
(o madmom é só conferência: os modelos dele são CC BY-NC-SA, não servem para gerar o corte de um vídeo comercial)
"""
import json, sys
import numpy as np
import librosa
from scipy.signal import butter, sosfiltfilt

drums, out = sys.argv[1], sys.argv[2]
y, sr = librosa.load(drums, sr=44100, mono=True)
H = 128

def ataques(sos_list, delta, nome):
    g = sum(sosfiltfilt(s, y) for s in sos_list)
    env = np.sqrt(np.convolve(g ** 2, np.ones(384) / 384, mode='same'))[::H]
    sub = np.maximum(0, np.diff(env, prepend=env[0]))
    sub = np.convolve(sub, np.hanning(7) / np.hanning(7).sum(), mode='same')
    sub_n = sub / sub.max()
    pk = librosa.util.peak_pick(sub_n, pre_max=20, post_max=20, pre_avg=60, post_avg=20, delta=delta, wait=25)
    res = []
    for p in pk:
        a = p
        while a > 0 and sub_n[a] > 0.3 * sub_n[p]: a -= 1
        res.append((a * H / sr, float(sub_n[p]), float(env[p:p + 30].max())))
    print(f'{nome}: {len(res)} ataques')
    return res

kick = ataques([butter(4, [30, 120], btype='band', fs=sr, output='sos')], 0.06, 'bumbo')
snare = ataques([butter(4, [150, 300], btype='band', fs=sr, output='sos'), butter(4, [1500, 5000], btype='band', fs=sr, output='sos')], 0.06, 'caixa')

# ---------- grade: t0 + k·T ajustado a todos os ataques perto de um tempo ----------
T = 60 / 103.4
todos = np.array(sorted([t for t, _, _ in kick] + [t for t, _, _ in snare]))
peso = np.array([f for _, f, _ in sorted(kick + snare)])
# busca de fase e andamento: a grade que mais alinha ataques (ponderados pela força) a até ±25 ms de um tempo
melhor = (-1, 0, T)
for Tc in np.arange(T * 0.995, T * 1.005, 0.0001):
    for fase in np.arange(0, Tc, 0.001):
        r = (todos - fase) % Tc
        r = np.minimum(r, Tc - r)
        sc = peso[r < 0.025].sum()
        if sc > melhor[0]: melhor = (sc, fase, Tc)
_, t0, T = melhor
for _ in range(6):  # ajuste iterativo: casa cada ataque com o tempo mais próximo e refaz a regressão (só os que estão a ±40 ms)
    k = np.round((todos - t0) / T)
    resid = todos - (t0 + k * T)
    ok = np.abs(resid) < 0.04
    A = np.vstack([np.ones(ok.sum()), k[ok]]).T
    t0, T = np.linalg.lstsq(A, todos[ok], rcond=None)[0]
k = np.round((todos - t0) / T); resid = todos - (t0 + k * T); ok = np.abs(resid) < 0.04
print(f'grade: T = {T * 1000:.2f} ms ({60 / T:.3f} BPM), t0 = {t0:.4f} s, {ok.sum()}/{len(todos)} ataques no tempo, resíduo {np.std(resid[ok]) * 1000:.1f} ms')

dur = len(y) / sr
kmin = int(np.ceil(-t0 / T)); kmax = int((dur - t0) / T)
def perto(lista, t, tol=0.035):
    c = [(f, e) for (x, f, e) in lista if abs(x - t) <= tol]
    return max(c) if c else None
tempos = []
for kk in range(kmin, kmax + 1):
    t = t0 + kk * T
    b, c = perto(kick, t), perto(snare, t)
    tempos.append({'k': kk, 't': round(float(t), 4), 'bumbo': None if not b else round(b[0], 3), 'caixa': None if not c else round(c[0], 3)})
# colcheias e semicolcheias da grade (para acelerações), com o rótulo do que soa
sub = []
for kk in range(kmin * 4, kmax * 4 + 4):
    t = t0 + kk * T / 4
    if t < 0 or t > dur: continue
    b, c = perto(kick, t, 0.03), perto(snare, t, 0.03)
    sub.append({'s': kk, 't': round(float(t), 4), 'bumbo': None if not b else round(b[0], 3), 'caixa': None if not c else round(c[0], 3)})

res = {'periodo_s': round(float(T), 6), 'bpm': round(float(60 / T), 3), 't0': round(float(t0), 4), 'tempos': tempos, 'semicolcheias': sub,
       'bumbo_s': [round(t, 4) for t, _, _ in kick], 'caixa_s': [round(t, 4) for t, _, _ in snare]}

if '--madmom' in sys.argv:
    mm = [t for t, _ in json.load(open(sys.argv[sys.argv.index('--madmom') + 1]))['downbeat_tracker']]
    d = sorted((min(mm, key=lambda x: abs(x - t['t'])) - t['t']) * 1000 for t in tempos if 1.5 < t['t'] < 72)
    print(f'conferência madmom − grade (ms): mediana {np.median(d):.1f}, p5 {d[len(d) // 20]:.1f}, p95 {d[-len(d) // 20]:.1f}')
json.dump(res, open(out, 'w'), indent=1)
