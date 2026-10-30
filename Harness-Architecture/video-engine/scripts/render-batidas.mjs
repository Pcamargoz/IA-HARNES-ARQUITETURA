// Renderiza (ou abre no Studio) um vídeo de corte por batida a partir da pasta do projeto. Nada é gravado no motor:
// os dados, as mídias e a saída ficam em <projeto>/video/.
//
// Uso: node scripts/render-batidas.mjs <pasta-do-projeto> [--dados video/dados-a.json] [--rascunho] [--frames 2700-3400] [--quadros 60,126,700] [--studio]
//   final:     <projeto>/video/out/<id>.mp4 (1080p, 60 fps)
//   rascunho:  <projeto>/video/out/<id>-rascunho.mp4 (metade da resolução)
//   --quadros: stills em <projeto>/video/out/quadros/<n>.jpg
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PROJ = process.argv[2] && path.resolve(process.argv[2]);
if (!PROJ) { console.error('uso: node scripts/render-batidas.mjs <pasta-do-projeto> [--rascunho] [--frames a-b] [--quadros n,n] [--studio]'); process.exit(1); }
const tem = (n) => process.argv.includes(`--${n}`);
const arg = (n) => { const i = process.argv.indexOf(`--${n}`); return i > 0 ? process.argv[i + 1] : undefined; };
const VIDEO = path.join(PROJ, 'video');
const dados = path.resolve(PROJ, arg('dados') ?? 'video/dados.json');
const sufixo = path.basename(dados, '.json').replace(/^dados-?/, ''); // dados-a.json → "a"
if (!fs.existsSync(dados)) { console.error(`falta ${dados}: rode antes node scripts/montar-batidas.mjs "${PROJ}"`); process.exit(1); }
const id = JSON.parse(fs.readFileSync(dados, 'utf8')).id + (sufixo ? `-${sufixo}` : '');
const OUT = path.join(VIDEO, 'out');
fs.mkdirSync(OUT, { recursive: true });

const comum = ['src/index.ts', `--props=${dados}`, `--public-dir=${path.join(VIDEO, 'public')}`];
const rodar = (args) => {
  const r = spawnSync('npx', ['remotion', ...args], { cwd: RAIZ, stdio: 'inherit' });
  if (r.status !== 0) process.exit(r.status ?? 1);
};

if (tem('studio')) rodar(['studio', ...comum]);
else if (arg('quadros')) {
  fs.mkdirSync(path.join(OUT, 'quadros'), { recursive: true });
  for (const q of arg('quadros').split(',')) rodar(['still', comum[0], 'batidas', path.join(OUT, 'quadros', `${q}.jpg`), ...comum.slice(1), `--frame=${q}`, '--log=error']);
} else {
  const rascunho = tem('rascunho') || arg('frames');
  const nome = arg('frames') ? `${id}-trecho-${arg('frames')}.mp4` : `${id}${rascunho ? '-rascunho' : ''}.mp4`;
  // áudio AAC a 320 kbps: a música não pode ganhar artefato de compressão
  rodar(['render', comum[0], 'batidas', path.join(OUT, nome), ...comum.slice(1), '--audio-bitrate=320k', ...(rascunho ? ['--scale=0.5'] : []),
    ...(arg('frames') ? [`--frames=${arg('frames')}`] : []), '--log=error']);
  console.log(path.join(OUT, nome));
}
