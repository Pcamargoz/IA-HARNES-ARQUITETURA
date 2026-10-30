// Envia um comando ao gravador (scripts/gravar-telas.mjs) e mostra a resposta.
// Uso: node scripts/cmd.mjs '{"acao":"url"}'   (ou um arquivo .json com o comando)
import fs from 'node:fs';

const a = process.argv[2] ?? '{"acao":"url"}';
const corpo = a.trim().startsWith('{') ? a : fs.readFileSync(a, 'utf8');
const porta = process.env.PORTA_GRAVADOR ?? 3999;
const r = await fetch(`http://127.0.0.1:${porta}/`, { method: 'POST', body: corpo });
const j = await r.json();
for (const k of ['texto', 'arvore']) if (j[k]) { const t = j[k]; delete j[k]; console.log(JSON.stringify(j)); console.log(t); process.exit(0); }
console.log(JSON.stringify(j, null, 1));
