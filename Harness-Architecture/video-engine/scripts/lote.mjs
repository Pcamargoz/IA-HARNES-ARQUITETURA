// Fila de produção: narra e renderiza vários vídeos, um por vez (o VoiceStudio atende uma geração de cada vez).
// Uso: node scripts/lote.mjs video-a video-b ...  [--esperar <arquivo-de-saída-de-outro-lote>]
// Com --esperar, só começa quando aquele arquivo contém "tudo pronto" ou "falhou" (o lote anterior acabou).
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const iEsp = args.indexOf('--esperar');
const esperar = iEsp >= 0 ? args.splice(iEsp, 2)[1] : null;
const ids = args;

if (esperar) {
  process.stdout.write(`esperando o lote anterior (${path.basename(esperar)})`);
  for (;;) {
    const txt = fs.existsSync(esperar) ? fs.readFileSync(esperar, 'utf8') : '';
    if (/tudo pronto|falhou/.test(txt)) break;
    spawnSync(process.platform === 'win32' ? 'powershell' : 'sleep', process.platform === 'win32' ? ['-NoProfile', '-Command', 'Start-Sleep 60'] : ['60']);
  }
  console.log(' ... liberado');
}

const roda = (script, id) => spawnSync('node', [path.join('scripts', script), id], { cwd: RAIZ, stdio: 'inherit' }).status === 0;
// conferência da narração por transcrição (faster-whisper do VoiceStudio); sem esse Python, avisa e segue
const PY = process.env.VOICESTUDIO_PY ?? '';
// SEM_CONFERENCIA=1: pula a conferência (só re-render, com a narração já conferida e em cache)
const confere = (id) => (process.env.SEM_CONFERENCIA ? true : fs.existsSync(PY) ? spawnSync(PY, [path.join('scripts', 'conferir_narracao.py'), id], { cwd: RAIZ, stdio: 'inherit' }).status === 0 : (console.log('conferência da narração: Python do VoiceStudio não encontrado (VOICESTUDIO_PY)'), true));
const pendentes = [];
for (const id of ids) {
  const ini = Date.now();
  console.log(`== ${id}: narração`);
  if (!roda('narrar.mjs', id)) { console.log(`falhou a narração de ${id}`); process.exit(1); }
  console.log(`== ${id}: conferência da narração`);
  if (!confere(id)) pendentes.push(`${id}: narração para rever`);
  console.log(`== ${id}: render (${Math.round((Date.now() - ini) / 60000)} min de voz)`);
  if (!roda('render.mjs', id)) { console.log(`falhou o render de ${id}`); process.exit(1); }
  console.log(`== ${id}: engasgos`);
  roda('engasgos.mjs', id);
}
if (pendentes.length) console.log('PARA REVER:\n  ' + pendentes.join('\n  '));
console.log('tudo pronto');
