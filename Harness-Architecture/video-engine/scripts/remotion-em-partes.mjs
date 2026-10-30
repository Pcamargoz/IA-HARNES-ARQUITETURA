// Renderiza uma composição em blocos e junta tudo num único mp4.
// Motivo: nesta estação o processo que renderiza é encerrado de fora depois de alguns minutos de trabalho pesado
// (sem erro, sem evento no Windows; um Node parado não é afetado). Então cada bloco roda num processo próprio e
// curto, com nova tentativa se cair, e o que já ficou pronto não é refeito. O vídeo dos blocos é emendado sem
// recompressão e o áudio é renderizado inteiro de uma vez, então não há emenda no som.
// Uso: node scripts/remotion-em-partes.mjs <id> <saida.mp4> [--escala 0.5] [--crf 18] [--public-dir pasta]
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const arg = (n) => { const i = process.argv.indexOf(`--${n}`); return i > 0 ? process.argv[i + 1] : undefined; };
const QUADROS_POR_BLOCO = 450; // 15 s de vídeo: cerca de 1 min de render por processo
// CHROME_PATH: usa um Chrome já instalado; sem ele, o Remotion baixa e usa o Chrome Headless Shell
const browserExecutable = process.env.CHROME_PATH || undefined;
const TENTATIVAS = 3;

// ---- modo filho: renderiza um bloco (ou o áudio) a partir do bundle pronto e sai ----
if (process.argv.includes('--filho')) {
  const { renderMedia, selectComposition } = await import('@remotion/renderer');
  const [serveUrl, id, saida, a, b] = process.argv.slice(2);
  const composition = await selectComposition({ serveUrl, id, browserExecutable });
  const audio = a === 'audio';
  await renderMedia({ serveUrl, composition, outputLocation: saida, browserExecutable, overwrite: true,
    ...(audio ? { codec: 'wav' } : { codec: 'h264', frameRange: [Number(a), Number(b)], muted: true, scale: Number(arg('escala') ?? 1),
      crf: Number(arg('crf') ?? 18), imageFormat: 'jpeg', jpegQuality: 95, concurrency: 6 }) });
  process.exit(0);
}

// ---- modo principal: bundle uma vez, um processo por bloco, junta no fim ----
const [id, saida] = process.argv.slice(2);
if (!id || !saida) { console.error('uso: node scripts/remotion-em-partes.mjs <id> <saida.mp4> [--escala 0.5] [--crf 18] [--public-dir pasta] [--de <s> --ate <s>]'); process.exit(1); }
// --de/--ate (segundos da composição): só um trecho, sem som, para testar o motor sem refazer o vídeo
const trecho = arg('de') !== undefined && arg('ate') !== undefined ? [Math.round(Number(arg('de')) * 30), Math.round(Number(arg('ate')) * 30)] : null;
const pasta = path.join(RAIZ, 'out', trecho ? `partes-${id}-${trecho[0]}-${trecho[1]}` : `partes-${id}`);
fs.mkdirSync(pasta, { recursive: true });
const { bundle } = await import('@remotion/bundler');
const publicDir = arg('public-dir') ? path.resolve(RAIZ, arg('public-dir')) : undefined;
const serveUrl = await bundle({ entryPoint: path.join(RAIZ, 'src', 'index.ts'), publicDir, outDir: path.join(pasta, 'bundle') });
// o total vem da composição (o motor pode somar quadros antes do vídeo, como a abertura fria do v5)
const { selectComposition } = await import('@remotion/renderer');
const total = (await selectComposition({ serveUrl, id, browserExecutable })).durationInFrames;

const extras = ['escala', 'crf'].flatMap((n) => (arg(n) ? [`--${n}`, arg(n)] : []));
const roda = (destino, a, b, rotulo) => {
  if (fs.existsSync(destino) && fs.statSync(destino).size > 0) { console.log(`${rotulo}: já pronto`); return; }
  for (let k = 1; k <= TENTATIVAS; k++) {
    const t0 = Date.now();
    const r = spawnSync(process.execPath, [fileURLToPath(import.meta.url), serveUrl, id, `${destino}.tmp${path.extname(destino)}`, String(a), String(b ?? ''), '--filho', ...extras],
      { cwd: RAIZ, stdio: ['ignore', 'ignore', 'pipe'] });
    if (r.status === 0) { fs.renameSync(`${destino}.tmp${path.extname(destino)}`, destino); console.log(`${rotulo}: ${Math.round((Date.now() - t0) / 1000)} s`); return; }
    console.log(`${rotulo}: tentativa ${k} caiu (saída ${r.status}) ${String(r.stderr ?? '').trim().split('\n').pop()?.slice(0, 200) ?? ''}`);
  }
  console.error(`${rotulo}: falhou ${TENTATIVAS} vezes; rode de novo para retomar daqui.`);
  process.exit(1);
};

const blocos = [];
const [q0, q1] = trecho ? [Math.max(0, trecho[0]), Math.min(total, trecho[1])] : [0, total];
for (let ini = q0; ini < q1; ini += QUADROS_POR_BLOCO) blocos.push([ini, Math.min(q1, ini + QUADROS_POR_BLOCO) - 1]);
blocos.forEach(([a, b], i) => roda(path.join(pasta, `bloco-${String(i).padStart(3, '0')}.mp4`), a, b, `bloco ${i + 1}/${blocos.length}`));
const audio = path.join(pasta, 'audio.wav');
if (!trecho) roda(audio, 'audio', null, 'áudio');

const lista = path.join(pasta, 'lista.txt');
fs.writeFileSync(lista, blocos.map((_, i) => `file '${path.join(pasta, `bloco-${String(i).padStart(3, '0')}.mp4`).replace(/\\/g, '/')}'`).join('\n'));
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', lista,
  ...(trecho ? ['-c:v', 'copy'] : ['-i', audio, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-shortest']), saida]);
fs.rmSync(pasta, { recursive: true, force: true });
console.log(`pronto: ${saida}`);
