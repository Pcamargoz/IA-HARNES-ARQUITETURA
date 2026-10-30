// Checagem automática de um vídeo pronto, antes de publicar (pesquisa-mcps-e-producao, linha "v4: fundação").
// Uso: node scripts/qa.mjs <arquivo.mp4> [--folha <saida.jpg>]
// Mede com o ffmpeg: trechos pretos (>= 0,5 s), quadros congelados (>= 5 s: imagem parada demais com a voz correndo),
// silêncio (>= 1,5 s), volume integrado e pico real. Com --folha, monta uma folha de contato com 1 quadro a cada 4 s.
// Sai com código 1 se algo passar do limite.
import fs from 'node:fs';
import { spawnSync, execFileSync } from 'node:child_process';

const args = process.argv.slice(2);
const video = args[0];
if (!video || !fs.existsSync(video)) { console.error('uso: node scripts/qa.mjs <arquivo.mp4> [--folha <saida.jpg>]'); process.exit(1); }
const iFolha = args.indexOf('--folha');
const folha = iFolha >= 0 ? args[iFolha + 1] : null;

// os filtros de análise do ffmpeg escrevem no stderr
const analisa = (filtros) => String(spawnSync('ffmpeg', ['-hide_banner', '-nostats', '-i', video, ...filtros, '-f', 'null', '-'], { stdio: ['ignore', 'ignore', 'pipe'], maxBuffer: 64 * 1024 * 1024 }).stderr ?? '');
const dur = Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', video]).toString().trim());

const video_ = analisa(['-vf', 'blackdetect=d=0.5:pix_th=0.08,freezedetect=n=0.003:d=5', '-an']);
const pretos = [...video_.matchAll(/black_start:([\d.]+)/g)].map((m) => Number(m[1]));
const congelados = [...video_.matchAll(/freeze_start: ([\d.]+)/g)].map((m) => Number(m[1]));
const audio = analisa(['-vn', '-af', 'silencedetect=n=-50dB:d=1.5,ebur128=peak=true']);
const silencios = [...audio.matchAll(/silence_start: ([\d.]+)/g)].map((m) => Number(m[1]));
const lufs = Number(audio.match(/I:\s+(-?[\d.]+) LUFS/g)?.pop()?.match(/-?[\d.]+/)?.[0]);
const pico = Number(audio.match(/Peak:\s+(-?[\d.]+) dBFS/g)?.pop()?.match(/-?[\d.]+/)?.[0]);

const s = (xs) => (xs.length ? xs.map((x) => `${x.toFixed(1)} s`).join(', ') : 'nenhum');
const problemas = [];
if (pretos.length) problemas.push(`trechos pretos em ${s(pretos)}`);
// o fechamento segura o último quadro de propósito: congelado só conta antes dos 3 s finais
const congeladosNoMeio = congelados.filter((x) => x < dur - 3);
if (congeladosNoMeio.length) problemas.push(`quadros congelados em ${s(congeladosNoMeio)}`);
if (silencios.filter((x) => x > 0.5 && x < dur - 2).length) problemas.push(`silêncio em ${s(silencios)}`);
if (!Number.isFinite(lufs) || Math.abs(lufs + 14) > 1) problemas.push(`volume ${Number.isFinite(lufs) ? lufs : 'não medido'} LUFS (alvo -14)`);
if (Number.isFinite(pico) && pico > -1) problemas.push(`pico real ${pico} dBFS (limite -1)`);

console.log(`qa: ${video}`);
console.log(`  duração ${dur.toFixed(1)} s · volume ${Number.isFinite(lufs) ? lufs : '?'} LUFS · pico real ${Number.isFinite(pico) ? pico : '?'} dBFS`);
console.log(`  pretos: ${s(pretos)} · congelados: ${s(congelados)} · silêncios: ${s(silencios)}`);

if (folha) {
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', video, '-vf', 'fps=1/4,scale=384:-2,tile=6x8:padding=4:color=white', '-frames:v', '1', '-q:v', '3', folha]);
  console.log(`  folha de contato: ${folha}`);
}
if (problemas.length) { console.log('REPROVADO:\n  - ' + problemas.join('\n  - ')); process.exit(1); }
console.log('aprovado nas checagens automáticas (a revisão humana continua obrigatória)');
