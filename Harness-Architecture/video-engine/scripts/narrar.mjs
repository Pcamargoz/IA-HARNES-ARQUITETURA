// Gera a narração de um roteiro no VoiceStudio local (http://127.0.0.1:3900, motor OmniVoice, roda na própria máquina).
// Uso: node scripts/narrar.mjs fluxo-1-vendas [--so 01,02] [--forcar]
// Cada trecho vira public/audio/<id>/<trecho>.wav, normalizado (-16 LUFS, 48 kHz mono). A duração medida vai para
// public/audio/<id>/tempos.json, que o preparar.mjs usa para encaixar as cenas na fala. Trecho cujo texto e voz não
// mudaram não é gerado de novo (cache pelo hash).
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { Agent, fetch, FormData } from 'undici';
import { carregarVoz, frases, hashFrase, paraFala, PAUSA_ENTRE_FRASES } from './frases.mjs';

// Na CPU um trecho pode levar mais de 5 min: sem limite de espera pela resposta (o padrão do fetch é 300 s).
const SEM_LIMITE = new Agent({ headersTimeout: 0, bodyTimeout: 0 });

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = process.env.VOICESTUDIO_URL ?? 'http://127.0.0.1:3900';
const id = process.argv[2];
if (!id) { console.error('uso: node scripts/narrar.mjs <id-do-roteiro> [--so 01,02] [--forcar]'); process.exit(1); }
const arg = (n) => { const i = process.argv.indexOf(`--${n}`); return i > 0 ? process.argv[i + 1] : undefined; };
const so = arg('so')?.split(',');
const forcar = process.argv.includes('--forcar');

const roteiro = JSON.parse(fs.readFileSync(path.join(RAIZ, 'roteiros', `${id}.json`), 'utf8'));
// Voz: voz.json (copie de voz.exemplo.json; --voz <arquivo> usa outra); o roteiro pode sobrescrever.
const voz = carregarVoz(RAIZ, roteiro, arg('voz') ?? 'voz.json');
const pasta = path.join(RAIZ, 'public', 'audio', id);
fs.mkdirSync(pasta, { recursive: true });
const arqTempos = path.join(pasta, 'tempos.json');
const tempos = fs.existsSync(arqTempos) ? JSON.parse(fs.readFileSync(arqTempos, 'utf8')) : {};

const ffprobeDur = (f) => Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString().trim());

// Espera o VoiceStudio responder (reinstalação, app fechado, motor subindo) em vez de derrubar a fila: até 2 h.
async function esperarVoiceStudio() {
  for (let i = 0; i < 480; i++) {
    try { const h = await (await fetch(`${BASE}/health`, { signal: AbortSignal.timeout(5000) })).json(); if (h.status === 'ok') return; } catch { /* ainda fora */ }
    if (i % 20 === 0) console.log(`  esperando o VoiceStudio em ${BASE}...`);
    await new Promise((ok) => setTimeout(ok, 15000));
  }
  console.error('o VoiceStudio não respondeu em 2 h'); process.exit(1);
}

async function gerar(texto, destino, tentativa = 1) {
  await esperarVoiceStudio();
  const form = new FormData();
  form.set('text', texto);
  for (const [k, v] of Object.entries(voz)) {
    if (k === 'nome' || v === undefined || v === null) continue;
    // ref_audio: arquivo local (até 20 s) enviado junto com o ref_text, para clonar a voz sem depender de transcrição automática
    if (k === 'ref_audio') form.set(k, new Blob([fs.readFileSync(path.join(RAIZ, v))], { type: 'audio/wav' }), path.basename(v));
    else if (k === 'seed') form.set(k, String(Number(v) + tentativa - 1));
    else form.set(k, String(v));
  }
  let r;
  try {
    r = await fetch(`${BASE}/generate`, { method: 'POST', body: form, dispatcher: SEM_LIMITE, signal: AbortSignal.timeout(45 * 60 * 1000) });
  } catch (e) {
    // o VoiceStudio caiu no meio (fechado ou reinstalado): espera voltar e repete a mesma frase
    console.log(`  VoiceStudio fora do ar (${e.cause?.code ?? e.message}); repetindo a frase quando ele voltar`);
    await new Promise((ok) => setTimeout(ok, 15000));
    return gerar(texto, destino, tentativa);
  }
  if (!r.ok) {
    const erro = (await r.text()).slice(0, 300);
    // O motor às vezes não termina uma frase e o VoiceStudio abandona o pedido depois de 300 s (HTTP 503), mas o
    // trabalho abandonado segura a GPU até acabar sozinho. Com a semente fixa, repetir igual trava de novo: espera
    // 3 min e tenta com a semente seguinte (a voz continua clonada da mesma amostra), até 3 vezes.
    if (r.status === 503 && tentativa < 3) {
      console.log(`  frase abandonada pelo VoiceStudio (tentativa ${tentativa}); nova tentativa com a semente ${Number(voz.seed ?? 0) + tentativa} em 3 min`);
      await new Promise((ok) => setTimeout(ok, 180000));
      return gerar(texto, destino, tentativa + 1);
    }
    console.error(`HTTP ${r.status} ${erro}`); process.exit(1);
  }
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  const bruto = `${destino}.bruto`;
  fs.writeFileSync(bruto, Buffer.from(await r.arrayBuffer()));
  // sem silêncio sobrando nas pontas
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', bruto, '-af',
    'silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05,areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.08,areverse',
    '-ar', '48000', '-ac', '1', destino]);
  fs.unlinkSync(bruto);
}

for (const t of roteiro.trechos) {
  if (so && !so.includes(t.id)) continue;
  const texto = paraFala(t.fala);
  const hash = crypto.createHash('sha1').update(JSON.stringify({ texto, voz, v: 2 })).digest('hex').slice(0, 12);
  const final = path.join(pasta, `${t.id}.wav`);
  if (!forcar && tempos[t.id]?.hash === hash && fs.existsSync(final)) { console.log(`${t.id}: igual, mantido`); continue; }
  // Na CPU o motor abandona gerações com mais de 600 s de processamento: gera frase por frase (cache por frase)
  // e emenda com uma pausa curta.
  const ini = Date.now();
  const partes = [];
  for (const [i, frase] of frases(texto).entries()) {
    const hf = hashFrase(frase, voz);
    const arq = path.join(pasta, 'frases', `${hf}.wav`);
    if (!fs.existsSync(arq)) {
      await gerar(frase, arq);
      console.log(`  ${t.id}.${i + 1}: ${ffprobeDur(arq).toFixed(1)} s`);
    }
    partes.push(arq);
  }
  const lista = path.join(pasta, `${t.id}.lista.txt`);
  const pausa = path.join(pasta, 'frases', 'pausa.wav');
  if (!fs.existsSync(pausa)) execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=mono', '-t', String(PAUSA_ENTRE_FRASES), pausa]);
  fs.writeFileSync(lista, partes.flatMap((p, i) => (i ? [pausa, p] : [p])).map((p) => `file '${p.replace(/\\/g, '/')}'`).join('\n'));
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', lista, '-af', 'loudnorm=I=-16:TP=-1.5:LRA=9', '-ar', '48000', '-ac', '1', final]);
  fs.unlinkSync(lista);
  const duracao = +ffprobeDur(final).toFixed(3);
  tempos[t.id] = { arquivo: `${t.id}.wav`, duracao, hash };
  fs.writeFileSync(arqTempos, JSON.stringify(tempos, null, 1));
  console.log(`${t.id}: ${duracao.toFixed(1)} s de fala (gerado em ${Math.round((Date.now() - ini) / 1000)} s)`);
}
console.log('ok');
