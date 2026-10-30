// Detector de engasgos de um vídeo pronto: mede a mudança entre quadros seguidos (scene score do ffmpeg, numa cópia
// reduzida) e aponta três defeitos, cada um com o trecho do roteiro em que caiu:
//   parada  — a imagem fica parada (mudança ~0) por 1 s ou mais enquanto o vídeo segue (tempo morto)
//   repete  — um quadro repetido no meio de um movimento (o movimento engasga)
//   pop     — um salto isolado: algo aparece ou some de um quadro para o outro, sem rampa
// Uso: node scripts/engasgos.mjs <id> [<arquivo.mp4>] [--json <saida.json>] [--inicio <s>]
// Sem arquivo, lê out/<id>-master.mp4. A abertura fria do v5 e do v6 (vídeo mais longo que a narração) é descontada.
// --inicio: o arquivo é um trecho que começa nesse segundo da composição (render de teste com --de/--ate).
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync, execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const id = args[0];
if (!id) { console.error('uso: node scripts/engasgos.mjs <id> [<arquivo.mp4>] [--json <saida.json>]'); process.exit(1); }
const video = args[1] && !args[1].startsWith('--') ? args[1] : path.join(RAIZ, 'out', `${id}-master.mp4`);
const iJson = args.indexOf('--json');
const dados = JSON.parse(fs.readFileSync(path.join(RAIZ, 'src', 'gerado', `${id}.json`), 'utf8'));

const PARADA = 0.0003;   // abaixo disso o quadro é praticamente igual ao anterior
const MOVE = 0.004;      // acima disso há movimento visível
const PARADA_MIN = 1.0;  // segundos de imagem parada que já contam como tempo morto
const FPS = 30;

const dur = Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', video]).toString().trim());
const iIni = args.indexOf('--inicio');
const inicio = iIni > 0 ? Number(args[iIni + 1]) : 0;
const desloc = inicio > 0 || dur - dados.duracaoTotal > 0.8 ? 33 / FPS : 0;
// a faixa da legenda (240 px de baixo, com a barra de progresso) fica de fora: a legenda karaokê muda a cada palavra e
// esconderia uma imagem parada atrás dela
const r = spawnSync('ffmpeg', ['-hide_banner', '-nostats', '-i', video, '-an', '-vf', "crop=iw:ih-240:0:0,scale=480:-2,select='gte(scene,0)',metadata=print:key=lavfi.scene_score", '-f', 'null', '-'],
  { stdio: ['ignore', 'ignore', 'pipe'], maxBuffer: 256 * 1024 * 1024 });
const s = [...String(r.stderr).matchAll(/lavfi\.scene_score=([\d.]+)/g)].map((m) => Number(m[1]));
if (!s.length) { console.error('ffmpeg não devolveu o scene score'); process.exit(1); }

const trechoEm = (t) => {
  const x = t + inicio - desloc;
  if (x < 0) return 'abertura fria';
  const tr = dados.trechos.find((q) => x >= q.inicio && x < q.inicio + q.duracao) ?? dados.trechos[dados.trechos.length - 1];
  return `${tr.id} ${tr.cena}${tr.captura ? ` (${tr.captura})` : ''}`;
};
const mmss = (t0) => { const t = t0 + inicio; return `${Math.floor(t / 60)}:${(t % 60).toFixed(1).padStart(4, '0')}`; };
const achados = [];

// parada: sequência de quadros iguais por PARADA_MIN ou mais (fora dos 3 s finais, onde o fechamento segura de propósito)
for (let i = 1; i < s.length;) {
  if (s[i] >= PARADA) { i++; continue; }
  let j = i;
  while (j < s.length && s[j] < PARADA) j++;
  const ini = i / FPS, fim = j / FPS;
  if (fim - ini >= PARADA_MIN && ini < dur - 3) achados.push({ tipo: 'parada', t: ini, dur: +(fim - ini).toFixed(2), trecho: trechoEm(ini) });
  i = j;
}
// repete: um quadro igual ao anterior com movimento dos dois lados
for (let i = 2; i < s.length - 1; i++)
  if (s[i] < PARADA && s[i - 1] > MOVE && s[i + 1] > MOVE) achados.push({ tipo: 'repete', t: i / FPS, trecho: trechoEm(i / FPS) });
// pop: salto isolado, bem acima da vizinhança (mediana de 6 quadros em volta), sem movimento antes nem depois
for (let i = 4; i < s.length - 4; i++) {
  const viz = [s[i - 3], s[i - 2], s[i - 1], s[i + 1], s[i + 2], s[i + 3]].sort((a, b) => a - b);
  const med = (viz[2] + viz[3]) / 2;
  if (s[i] > 0.03 && s[i] > 8 * Math.max(med, 0.002) && s[i - 1] < s[i] / 4 && s[i + 1] < s[i] / 4)
    achados.push({ tipo: 'pop', t: i / FPS, forca: +s[i].toFixed(3), trecho: trechoEm(i / FPS) });
}
achados.sort((a, b) => a.t - b.t);

const conta = (k) => achados.filter((a) => a.tipo === k).length;
const morto = achados.filter((a) => a.tipo === 'parada').reduce((n, a) => n + a.dur, 0);
console.log(`engasgos: ${id} (${mmss(dur)}${desloc ? ', abertura fria descontada' : ''})`);
console.log(`  paradas ${conta('parada')} (${morto.toFixed(1)} s de tempo morto) · quadros repetidos em movimento ${conta('repete')} · pops ${conta('pop')}`);
for (const a of achados)
  console.log(`  ${mmss(a.t).padStart(7)}  ${a.tipo.padEnd(6)} ${a.dur ? `${a.dur.toFixed(1)} s `.padEnd(7) : a.forca ? `${a.forca}`.padEnd(7) : ''.padEnd(7)} ${a.trecho}`);
if (iJson > 0) fs.writeFileSync(args[iJson + 1], JSON.stringify({ id, dur, desloc, morto, achados }, null, 2));
