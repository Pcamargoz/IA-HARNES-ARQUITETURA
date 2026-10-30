// Divisão da fala em frases e o hash de cache de cada frase: usados por narrar.mjs (gera uma frase por vez)
// e por preparar.mjs (legenda frase a frase com o tempo medido de cada uma).
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

export const PAUSA_ENTRE_FRASES = 0.5; // s de silêncio entre as frases de um trecho (0,28 até 24/10/2026: o pedido foi um ritmo mais lento, para fixar o conteúdo)

// Pronúncia: a fala usa a forma escrita do roteiro; aqui só ajustes para o motor ler certo (não aparecem na legenda).
const PRONUNCIA = [[/\bCFOP\b/g, 'cê-efe-ó-pê'], [/\bPV\b/g, 'pê-vê'], [/\bNF-e\b/g, 'nota fiscal eletrônica']];
export const paraFala = (t) => PRONUNCIA.reduce((s, [a, b]) => s.replace(a, b), t);

// frases de até ~110 caracteres (quebra em ponto; se a frase for longa, também em vírgula)
export const frases = (t) => (t.match(/[^.!?]+[.!?]?/g) ?? [t]).map((s) => s.trim()).filter(Boolean).flatMap((f) => {
  if (f.length <= 110) return [f];
  const out = []; let atual = '';
  for (const p of f.split(/(?<=,)\s+/)) { if (atual && (atual + ' ' + p).length > 110) { out.push(atual); atual = p; } else atual = (atual + ' ' + p).trim(); }
  return atual ? [...out, atual] : out;
});

export const hashFrase = (frase, voz) => crypto.createHash('sha1').update(JSON.stringify({ frase, voz })).digest('hex').slice(0, 12);

// Voz do roteiro: videos/voz.json (ou outro arquivo com --voz) sobrescrito pelo "voz" do roteiro.
export const carregarVoz = (raiz, roteiro, arquivo = 'voz.json') => {
  const arq = path.join(raiz, arquivo);
  const padrao = fs.existsSync(arq) ? JSON.parse(fs.readFileSync(arq, 'utf8')) : { instruct: 'male, middle-aged, low pitch' };
  return { language: 'pt', seed: 7, speed: 1.0, ...padrao, ...(roteiro.voz ?? {}) };
};
