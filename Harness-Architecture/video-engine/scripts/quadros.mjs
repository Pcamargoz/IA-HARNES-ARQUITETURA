// Renderiza quadros avulsos de um vídeo para revisão, com um único bundle.
// Uso: node scripts/quadros.mjs <id> <pasta-saida> <quadro> [<quadro>...]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [id, pasta, ...quadros] = process.argv.slice(2);
if (!id || !pasta || !quadros.length) { console.error('uso: node scripts/quadros.mjs <id> <pasta-saida> <quadro>...'); process.exit(1); }
const browserExecutable = process.env.CHROME_PATH || undefined;
fs.mkdirSync(pasta, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.join(RAIZ, 'src', 'index.ts') });
const composition = await selectComposition({ serveUrl, id, browserExecutable });
for (const q of quadros) {
  await renderStill({ serveUrl, composition, frame: Number(q), output: path.join(pasta, `${id}-${q}.jpg`), imageFormat: 'jpeg', jpegQuality: 85, browserExecutable });
  console.log('ok', q);
}
