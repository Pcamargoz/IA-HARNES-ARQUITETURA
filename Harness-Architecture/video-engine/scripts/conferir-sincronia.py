"""Confere, no vídeo renderizado, se cada corte cai no ataque do grave.

Lê o MP4 (imagem e áudio do próprio arquivo, não da fonte), acha:
  - as trocas de imagem: diferença entre quadros seguidos, em tons de cinza e baixa resolução;
  - os ataques do grave no áudio do MP4 (passa-baixa de 120 Hz, envelope com passo de 2,9 ms).
Para cada corte planejado (dados.json), mede: quadro da troca real × quadro planejado, e ataque real × início do quadro.

Uso: python scripts/conferir-sincronia.py <video.mp4> <dados.json> <ffmpeg_dir> [--relatorio saida.json]
"""
import json, subprocess, sys, os
import numpy as np
from scipy.signal import butter, sosfiltfilt

mp4, dados, ffdir = sys.argv[1], sys.argv[2], sys.argv[3]
rel = sys.argv[sys.argv.index('--relatorio') + 1] if '--relatorio' in sys.argv else None
d = json.load(open(dados))
FPS = d['fps']
W, H = 96, 54
ff = os.path.join(ffdir, 'ffmpeg')

def rodar(args):
    return subprocess.run([ff, '-v', 'error', *args], cwd=ffdir, capture_output=True, check=True).stdout

# imagem
# o ffmpeg do Remotion não tem os muxers rawvideo/s16le: quadros crus por image2pipe e áudio em WAV
raw = rodar(['-i', mp4, '-vf', f'scale={W}:{H}', '-pix_fmt', 'gray', '-c:v', 'rawvideo', '-f', 'image2pipe', '-'])
fr = np.frombuffer(raw, np.uint8).reshape(-1, H, W).astype(np.float32)
dif = np.r_[0, np.abs(np.diff(fr, axis=0)).mean(axis=(1, 2))]  # dif[k] = mudança do quadro k-1 para k

# áudio do próprio MP4
SR = 44100
import io
from scipy.io import wavfile
_, pcm = wavfile.read(io.BytesIO(rodar(['-i', mp4, '-vn', '-ac', '1', '-ar', str(SR), '-c:a', 'pcm_s16le', '-f', 'wav', '-'])))
pcm = pcm.astype(np.float32) / 32768
g = sosfiltfilt(butter(4, 120, btype='low', fs=SR, output='sos'), pcm)
Hh = 128
env = np.sqrt(np.convolve(g ** 2, np.ones(512) / 512, mode='same'))[::Hh]
sub = np.maximum(0, np.diff(env, prepend=env[0]))
sub = np.convolve(sub, np.hanning(9) / np.hanning(9).sum(), mode='same')
t_env = np.arange(len(env)) * Hh / SR

def ataque_perto(t, janela=0.08):
    a, b = np.searchsorted(t_env, [t - janela, t + janela])
    if b <= a: return None
    p = a + int(np.argmax(sub[a:b]))
    if sub[p] < 0.15 * sub.max(): return None
    k = p
    while k > 0 and sub[k] > 0.3 * sub[p]: k -= 1
    return float(t_env[k])

linhas = []
for c in d['cortes']:
    q = c['quadro']
    if q < 1 or q >= len(dif): continue
    # troca real: o maior salto de imagem entre q-3 e q+3 (whip começa antes do golpe; o pico de mudança é no golpe)
    jan = range(max(1, q - 3), min(len(dif), q + 4))
    qr = max(jan, key=lambda k: dif[k])
    viz = np.median(dif[max(1, q - 12):q - 3]) if q > 15 else np.median(dif[1:q]) if q > 1 else 0
    ta = ataque_perto(q / FPS) if c['secao'] not in ('intro', 'encerramento-branco') else None
    linhas.append({'i': c['i'], 'mov': c['mov'], 'secao': c['secao'], 'quadro': q, 'troca_real': int(qr), 'salto': round(float(dif[qr]), 2),
                   'salto_sobre_vizinhos': round(float(dif[qr] / (viz + 0.5)), 1),
                   'ataque_ms_desde_inicio_do_quadro': None if ta is None else round((ta - q / FPS) * 1000, 1)})

desv_q = np.array([l['troca_real'] - l['quadro'] for l in linhas])
at = np.array([l['ataque_ms_desde_inicio_do_quadro'] for l in linhas if l['ataque_ms_desde_inicio_do_quadro'] is not None])
fracos = [l for l in linhas if l['salto_sobre_vizinhos'] < 2.5 and l['secao'] not in ('encerramento-branco', 'break')]
print(f"{len(linhas)} cortes conferidos · {len(fr)} quadros · {len(pcm) / SR:.3f} s de áudio")
print(f"troca real − planejada (quadros): exatos {np.sum(desv_q == 0)}, ±1 {np.sum(np.abs(desv_q) == 1)}, mais longe {np.sum(np.abs(desv_q) > 1)}")
if len(at):
    print(f"ataque do grave em relação ao início do quadro do corte (ms): mediana {np.median(at):.1f}, p5 {np.percentile(at, 5):.1f}, p95 {np.percentile(at, 95):.1f}, "
          f"dentro do quadro (0 a 16,7 ms): {np.sum((at >= -1) & (at <= 17.7))}/{len(at)}")
print(f"cortes com troca pouco visível (salto < 2,5× os vizinhos): {len(fracos)}", [(l['i'], l['mov']) for l in fracos[:15]])
if rel: json.dump(linhas, open(rel, 'w'), indent=1)
