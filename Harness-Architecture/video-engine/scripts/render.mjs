// Renderiza um vídeo e gera a versão final para entrega.
// Uso: node scripts/render.mjs <id> [--rascunho] [--usar-master]
// 1. preparar.mjs (tempos medidos da narração) · 2. Remotion em blocos → out/<id>-master.mp4
// 3. versão final em out/<id>.mp4 (H.264 yuv420p, AAC, faststart, -14 LUFS), a legenda out/<id>.vtt e a capa out/<id>.jpg
// 4. checagem automática (scripts/qa.mjs). Precisa do ffmpeg e do ffprobe no PATH.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(RAIZ, 'out');
const id = process.argv[2];
if (!id) { console.error('uso: node scripts/render.mjs <id> [--rascunho] [--usar-master]'); process.exit(1); }
const rascunho = process.argv.includes('--rascunho');
// shell só para o npx (no Windows ele é um .cmd); no ffmpeg o shell cortaria os caminhos com espaços
const roda = (cmd, args) => execFileSync(cmd, args, { cwd: RAIZ, stdio: 'inherit', shell: process.platform === 'win32' && cmd === 'npx' });

roda('node', ['scripts/preparar.mjs', id]);
const dados = JSON.parse(fs.readFileSync(path.join(RAIZ, 'src', 'gerado', `${id}.json`), 'utf8'));
fs.mkdirSync(OUT, { recursive: true });
const master = path.join(OUT, `${id}-${rascunho ? 'rascunho' : 'master'}.mp4`);
// render em blocos, um processo por bloco (ver remotion-em-partes.mjs); --usar-master pula o render
if (!(process.argv.includes('--usar-master') && fs.existsSync(master)))
  roda('node', ['scripts/remotion-em-partes.mjs', id, path.relative(RAIZ, master), ...(rascunho ? ['--escala', '0.5', '--crf', '28'] : [])]);
if (rascunho) { console.log(`rascunho: ${master}`); process.exit(0); }

const final = path.join(OUT, `${id}.mp4`);
// volume de entrega em -14 LUFS (DIRECTOR.md do lemo-opuscar)
roda('ffmpeg', ['-y', '-loglevel', 'error', '-i', master, '-vf', 'scale=in_range=full:out_range=tv,format=yuv420p',
  '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11',
  '-c:v', 'libx264', '-profile:v', 'high', '-preset', 'slow', '-crf', '24', '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', final]);

// legenda .vtt (as mesmas frases queimadas no vídeo)
const hms = (s) => { const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = (s % 60).toFixed(3).padStart(6, '0'); return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${x}`; };
// a abertura fria põe 33 quadros antes do vídeo: a diferença entre o master e a narração desloca a legenda
const durMaster = Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', master]).toString().trim());
const desloc = durMaster - dados.duracaoTotal > 0.8 ? 33 / 30 : 0;
const cues = dados.trechos.flatMap((t) => (t.legendas ?? []).map((l) => ({ ini: desloc + t.inicio + l.ini, fim: desloc + t.inicio + l.fim + 0.6, texto: l.texto })));
cues.forEach((c, i) => { if (cues[i + 1]) c.fim = Math.min(Math.max(c.fim, c.ini + 1.8), cues[i + 1].ini); });
fs.writeFileSync(path.join(OUT, `${id}.vtt`), 'WEBVTT\n\n' + cues.map((c) => `${hms(c.ini)} --> ${hms(c.fim)}\n${c.texto}\n`).join('\n'));
// capa: o quadro do título (2,5 s)
roda('ffmpeg', ['-y', '-loglevel', 'error', '-ss', '2.5', '-i', master, '-frames:v', '1', '-vf', 'scale=1280:-2', '-q:v', '3', path.join(OUT, `${id}.jpg`)]);

const mb = (fs.statSync(final).size / 1048576).toFixed(1);
console.log(`pronto: out/${id}.mp4 (${mb} MB, ${Math.round(durMaster)} s) · out/${id}.vtt · out/${id}.jpg`);
roda('node', ['scripts/qa.mjs', final, '--folha', path.join(OUT, `${id}-folha.jpg`)]);
