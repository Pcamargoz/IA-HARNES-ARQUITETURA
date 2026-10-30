// Junta roteiro + tempos da narração + capturas num único arquivo de dados da animação.
// Uso: node scripts/preparar.mjs fluxo-1-vendas
// Lê:   roteiros/<id>.json · public/audio/<id>/tempos.json (de narrar.mjs) · capturas/<id>/*.png|json
// Grava: public/telas/<id>/*.png (só as capturas usadas) · src/gerado/<id>.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { carregarVoz, frases, hashFrase, paraFala, PAUSA_ENTRE_FRASES } from './frases.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const id = process.argv[2];
if (!id) { console.error('uso: node scripts/preparar.mjs <id-do-roteiro>'); process.exit(1); }
const roteiro = JSON.parse(fs.readFileSync(path.join(RAIZ, 'roteiros', `${id}.json`), 'utf8'));
const arqTempos = path.join(RAIZ, 'public', 'audio', id, 'tempos.json');
const tempos = fs.existsSync(arqTempos) ? JSON.parse(fs.readFileSync(arqTempos, 'utf8')) : {};
const PAUSA = 0.9; // respiro entre um trecho e o seguinte (s); 0,55 até 24/10/2026 (pedido de ritmo mais lento)
const PALAVRAS_POR_S = 140 / 60; // estimativa quando ainda não há áudio

// Legenda frase a frase: a narração é gerada uma frase por vez (frases/<hash>.wav) e emendada com uma pausa fixa,
// então o início e a duração de cada frase são exatos. Sem os áudios, a legenda divide o tempo pelo tamanho do texto.
const voz = carregarVoz(RAIZ, roteiro);
const durFrase = (f) => {
  const arq = path.join(RAIZ, 'public', 'audio', id, 'frases', `${hashFrase(f, voz)}.wav`);
  return fs.existsSync(arq) ? Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', arq]).toString().trim()) : null;
};
const legendas = (t) => {
  const escritas = frases(t.fala), faladas = frases(paraFala(t.fala));
  if (escritas.length !== faladas.length) return null;
  const durs = faladas.map(durFrase);
  if (durs.some((d) => d === null)) return null;
  let ini = 0;
  return escritas.map((texto, i) => { const l = { texto, ini: +ini.toFixed(3), fim: +(ini + durs[i]).toFixed(3) }; ini += durs[i] + PAUSA_ENTRE_FRASES; return l; });
};

const destTelas = path.join(RAIZ, 'public', 'telas', id);
fs.mkdirSync(destTelas, { recursive: true });
// Sem capturas/<id>/ (ficam só na máquina que gravou), reaproveita a tela já publicada em public/telas/ e as caixas
// do src/gerado/<id>.json anterior, tirando as caixasExtras antigas para aplicar as do roteiro atual.
const arqGerado = path.join(RAIZ, 'src', 'gerado', `${id}.json`);
const anteriores = fs.existsSync(arqGerado) ? Object.fromEntries(JSON.parse(fs.readFileSync(arqGerado, 'utf8')).trechos.map((t) => [t.id, t])) : {};
const caixasBase = (t) => {
  const base = path.join(RAIZ, 'capturas', id, t.captura);
  if (fs.existsSync(`${base}.json`)) {
    fs.copyFileSync(`${base}.png`, path.join(destTelas, `${t.captura}.png`));
    return JSON.parse(fs.readFileSync(`${base}.json`, 'utf8')).caixas.map((c) => c.caixa);
  }
  const ant = anteriores[t.id];
  if (ant?.captura !== t.captura || !ant.caixas || !fs.existsSync(path.join(destTelas, `${t.captura}.png`))) {
    console.error(`${id}/${t.id}: falta a captura ${t.captura} (nem em capturas/, nem em public/telas/ com as caixas no src/gerado/). Grave a tela de novo.`);
    process.exit(1);
  }
  return ant.caixas.slice(0, ant.caixas.length - (ant.caixasExtras?.length ?? 0));
};
let inicio = 0;
const faltando = [];
const trechos = roteiro.trechos.map((t) => {
  const audio = tempos[t.id];
  const fala = audio?.duracao ?? t.fala.split(/\s+/).length / PALAVRAS_POR_S;
  if (!audio) faltando.push(t.id);
  const out = { ...t, inicio: +inicio.toFixed(3), duracao: +(fala + PAUSA).toFixed(3), fala_s: +fala.toFixed(3), audio: audio ? `audio/${id}/${audio.arquivo}` : null,
    legendas: audio ? legendas(t) : null };
  if (t.captura) {
    out.imagem = `telas/${id}/${t.captura}.png`;
    out.caixas = [...caixasBase(t), ...(t.caixasExtras ?? [])];
  }
  inicio += out.duracao;
  return out;
});
const dados = { ...roteiro, trechos, duracaoTotal: +(inicio + 1.5).toFixed(3) };
fs.mkdirSync(path.join(RAIZ, 'src', 'gerado'), { recursive: true });
fs.writeFileSync(path.join(RAIZ, 'src', 'gerado', `${id}.json`), JSON.stringify(dados, null, 1));
console.log(`${id}: ${trechos.length} trechos, ${dados.duracaoTotal.toFixed(1)} s` + (faltando.length ? ` (sem áudio: ${faltando.join(', ')} — tempos estimados)` : ''));
