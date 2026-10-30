// Monta um vídeo de corte por batida a partir de uma PASTA DE PROJETO (fora do motor). O motor só tem código; tudo o
// que é do vídeo (capturas, música, marca, dados gerados, renders) mora na pasta do projeto.
//
// Uso: node scripts/montar-batidas.mjs <pasta-do-projeto> [--plano analise/plano-v3-a.json] [--saida video/dados-a.json]
//   <projeto>/analise/plano-de-cortes.json → (padrão) cortes, camada de títulos e trechos com o celular ao lado
//   <projeto>/video/config.json            → id, música, marca, textos, pasta das telas, rótulos das áreas, excluir
//   <projeto>/video/selecao.json           → (opcional) telas escolhidas por bloco da música, em ordem:
//                                            { "intro", "f1" … "f4", "drop", "grade", "rajada", "heroi" (meio da parede), "cel-f1" … "cel-f4", "cel-drop": [...] }
//                                            cada item é "<grupo>/<fluxo>/<nome>"; sem o arquivo, usa todas as telas por área
//   <projeto>/video/borrar.json            → (opcional) trechos a borrar por tela, em 0..1 da imagem
//   <projeto>/<pastaTelas>/<grupo>/<fluxo>/NN-<tela>.png (+ .json) → saída do gravar-telas.mjs
// Gera <projeto>/video/dados.json e copia as telas usadas para <projeto>/video/public/telas/.
import fs from 'node:fs';
import path from 'node:path';

const PROJ = process.argv[2] && path.resolve(process.argv[2]);
if (!PROJ) { console.error('uso: node scripts/montar-batidas.mjs <pasta-do-projeto>'); process.exit(1); }
const VIDEO = path.join(PROJ, 'video');
const ler = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const lerSe = (p, d) => (fs.existsSync(p) ? ler(p) : d);
const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > 0 ? process.argv[i + 1] : d; };
const plano = ler(path.resolve(PROJ, arg('plano', 'analise/plano-de-cortes.json')));
const SAIDA = path.resolve(PROJ, arg('saida', 'video/dados.json'));
const cfg = ler(path.join(VIDEO, 'config.json'));
const T = cfg.textos;
const borrar = lerSe(path.join(VIDEO, 'borrar.json'), {});
const selecao = lerSe(path.join(VIDEO, 'selecao.json'), null);
const excluir = new Set(cfg.excluir ?? []);
const ROTULOS = cfg.rotulos ?? {};

// ---------- capturas ----------
const dirTelas = path.join(PROJ, cfg.pastaTelas ?? 'telas');
const subpastas = (d) => (fs.existsSync(d) ? fs.readdirSync(d, { withFileTypes: true }).filter((x) => x.isDirectory()).map((x) => x.name).sort() : []);
const capturas = new Map(); // "<grupo>/<fluxo>/<nome>" → captura
for (const grupo of subpastas(dirTelas)) {
  for (const fluxo of subpastas(path.join(dirTelas, grupo))) {
    const dir = path.join(dirTelas, grupo, fluxo);
    for (const png of fs.readdirSync(dir).filter((f) => f.endsWith('.png')).sort()) {
      const nome = png.replace(/\.png$/, '');
      const chave = `${grupo}/${fluxo}/${nome}`;
      if (excluir.has(chave)) continue;
      const meta = lerSe(path.join(dir, `${nome}.json`), {});
      // sem .json, o tamanho vem do cabeçalho do PNG (IHDR: largura e altura nos bytes 16 a 23)
      const ihdr = meta.largura ? null : fs.readFileSync(path.join(dir, png)).subarray(16, 24);
      const w = meta.largura ?? ihdr.readUInt32BE(0), h = meta.altura ?? ihdr.readUInt32BE(4);
      // alvo: o elemento principal da tela (1ª caixa do gravador com tamanho de elemento, nem minúscula nem a página toda)
      const cx = (meta.caixas ?? []).map((x) => x.caixa).find((b) => b && b.w > 24 && b.h > 14 && b.w < w * 0.85 && b.h < h * 0.7);
      const alvo = cx ? { x: cx.x / w, y: cx.y / h, w: cx.w / w, h: cx.h / h } : undefined;
      capturas.set(chave, { chave, origem: path.join(dir, png), grupo, fluxo, nome, celular: h > w, alvo });
    }
  }
}
if (!capturas.size) { console.error(`nenhuma captura em ${dirTelas}/<grupo>/<fluxo>/`); process.exit(1); }

const destino = path.join(VIDEO, 'public', 'telas');
fs.mkdirSync(destino, { recursive: true });
const usadas = new Set();
const plano_ = (c) => {
  const arq = `${c.chave.replaceAll('/', '__')}.png`;
  const alvo = path.join(destino, arq);
  // compara o conteúdo (não a data): uma captura refeita pode ser mais velha que a cópia
  if (!fs.existsSync(alvo) || !fs.readFileSync(alvo).equals(fs.readFileSync(c.origem))) fs.copyFileSync(c.origem, alvo);
  usadas.add(c.chave);
  // rótulo da pílula: pela pasta e, se ela não disser a área (ex.: escuro/), pelo nome do arquivo
  const area = Object.keys(ROTULOS).find((a) => c.fluxo.includes(a)) ?? Object.keys(ROTULOS).find((a) => c.nome.includes(a));
  const escuro = c.nome.endsWith('-escuro') || c.fluxo === 'escuro';
  const b = borrar[c.chave];
  return { imagem: `telas/${arq}`, celular: c.celular, area: c.fluxo, ...(area ? { rotulo: ROTULOS[area] } : {}), ...(escuro ? { escuro } : {}),
    ...(c.alvo && !c.celular ? { alvo: c.alvo } : {}),
    ...(b?.length ? { borrar: b } : {}) };
};

// ---------- blocos da música → filas de telas ----------
// groove: uma frase musical a cada 4 compassos (5–8, 9–12, 13–16, 17–19), cada uma conta um pedaço da história
const bloco = (c) => {
  if (c.movimento === 'rajada') return 'rajada';
  if (c.secao === 'intro') return 'intro';
  if (c.secao === 'build') return 'f1';
  if (c.secao === 'drop') return c.movimento.startsWith('grade') || c.movimento.startsWith('mosaico') ? 'grade' : 'drop';
  const k = c.compasso ?? 5;
  return k <= 8 ? 'f1' : k <= 12 ? 'f2' : k <= 16 ? 'f3' : 'f4';
};
const todas = [...capturas.values()];
const filas = {};
const desktop = todas.filter((c) => !c.celular), celulares = todas.filter((c) => c.celular);
for (const b of ['intro', 'f1', 'f2', 'f3', 'f4', 'drop', 'grade', 'rajada', 'heroi', 'cel-f1', 'cel-f2', 'cel-f3', 'cel-f4', 'cel-drop']) {
  const lista = (selecao?.[b] ?? []).map((k) => capturas.get(k) ?? console.warn(`seleção: não achei ${k}`)).filter(Boolean);
  const padrao = b.startsWith('cel-') ? celulares : b === 'rajada' ? ['f1', 'f2', 'f3', 'f4'].flatMap((x) => filas[x].lista) : b === 'heroi' ? filas.drop.lista : desktop;
  filas[b] = { lista: lista.length ? lista : padrao, i: 0 };
}
const proxima = (b) => { const q = filas[b]; return q.lista[q.i++ % q.lista.length]; };
// claro e escuro alternam a cada corte de janela; a família visual (telas que se parecem, ex.: timer e dashboard são a
// mesma página) não repete a da anterior; e a mesma tela não volta em 8 cortes. Se a próxima da fila quebra uma
// regra, busca adiante a primeira que cumpre todas e troca de lugar com ela (sem nenhuma, relaxa a família e a tela).
const escura = (c) => c.nome.endsWith('-escuro') || c.fluxo === 'escuro';
const FAMILIAS = cfg.familias ?? {};
const familia = (c) => Object.entries(FAMILIAS).find(([, fl]) => fl.some((x) => c.fluxo.includes(x) || c.nome.includes(x)))?.[0] ?? c.fluxo;
const recentes = [];
const proximaAlternando = (b) => {
  const q = filas[b], n = q.lista.length;
  const ant = recentes.at(-1);
  const regras = [
    (c) => !ant || (escura(c) !== escura(ant) && familia(c) !== familia(ant) && !recentes.slice(-8).includes(c)),
    (c) => !ant || (escura(c) !== escura(ant) && familia(c) !== familia(ant)),
  ];
  for (const ok of regras) {
    if (ok(q.lista[q.i % n])) break;
    const k = Array.from({ length: n - 1 }, (_, x) => x + 1).find((x) => ok(q.lista[(q.i + x) % n]));
    if (k) { const j = (q.i + k) % n; [q.lista[q.i % n], q.lista[j]] = [q.lista[j], q.lista[q.i % n]]; break; }
  }
  const c = proxima(b);
  recentes.push(c);
  return c;
};

// ---------- cortes ----------
// no drop o fundo é o oposto do tema da tela (tela escura sobre creme, clara sobre tinta): como a seleção alterna os
// temas, o fundo alterna junto e a janela nunca some no fundo; o celular entra sempre sobre o vermelho da marca
const fundoDe = (c, tela) => (tela.celular ? 'vermelho' : c.secao === 'drop' ? (tela.escuro ? 'creme' : 'tinta') : 'creme');
let abertura = 0, palavra = 0, ultimoFlash = -Infinity, carimbos = 0, paredeFixa = null;
const PECAS = { quatro: 4, dupla: 2, lado: 2, 'celular-solo': 1, 'tres-celulares': 3 };
let arranjo = { nome: null, pecas: [], n: 0, troca: -1 };
const cortes = plano.cortes.map((c, i) => {
  const base = { i, quadro: c.quadro, fim: plano.cortes[i + 1]?.quadro ?? Math.ceil(plano.duracao_s * plano.fps), mov: c.movimento, forca: c.intensidade, secao: c.secao };
  const m = c.movimento;
  if (c.secao === 'encerramento-branco') return m.startsWith('frase-palavra') ? { ...base, texto: T.frase[palavra++] ?? '' } : base;
  if (m === 'tinta-letra') return { ...base, texto: T.abertura[abertura++ % T.abertura.length] };
  if (m === 'logo-carimbo') return { ...base, fundo: carimbos++ % 2 ? 'vermelho' : 'tinta' }; // a rajada alterna os fundos
  if (['congela-preto', 'logo-respira', 'iris-fecha'].includes(m)) return base;
  if (c.arranjo) {
    // montagens do drop: cada uma guarda as peças entre os cortes e troca UMA por golpe, em rodízio (a montagem fica
    // viva sem trocar tudo); no 1º corte de uma montagem nova, todas as peças entram (troca = -1)
    const k = PECAS[c.arranjo], celular = c.arranjo.includes('celular');
    if (c.arranjo !== arranjo.nome) arranjo = { nome: c.arranjo, pecas: Array.from({ length: k }, () => plano_(celular ? proxima('cel-drop') : proximaAlternando('drop'))), n: 0, troca: -1 };
    else { arranjo.troca = arranjo.n++ % k; arranjo.pecas = arranjo.pecas.slice(); arranjo.pecas[arranjo.troca] = plano_(celular ? proxima('cel-drop') : proximaAlternando('drop')); }
    let flash = false;
    if (m === 'slam-flash' && c.quadro - ultimoFlash >= 20) { flash = true; ultimoFlash = c.quadro; }
    return { ...base, mov: m === 'slam-flash' && !flash ? 'slam' : m, arranjo: c.arranjo, telas: arranjo.pecas, troca: arranjo.troca,
      tela: arranjo.pecas[Math.max(0, arranjo.troca)], fundo: celular ? 'vermelho' : (c.compasso ?? 0) % 2 ? 'tinta' : 'creme', ...(flash ? { flash } : {}) };
  }
  if (m.startsWith('parede-')) {
    // clímax: a tela do meio (heroína) troca a cada corte; as de volta são sempre as mesmas 24, para a parede crescer
    // em volta dela sem trocar o que já estava (só janelas de desktop: celular em miniatura vira uma pílula)
    paredeFixa ??= filas.grade.lista.filter((x) => !x.celular).slice(0, 24).map(plano_);
    return { ...base, fundo: 'tinta', parede: Number(m.split('-')[1]), tela: plano_(proxima('heroi')), telas: paredeFixa };
  }
  if (m.startsWith('grade-') || m.startsWith('mosaico')) {
    const n = m.startsWith('mosaico') ? 36 : Number(m.split('-')[1]);
    return { ...base, fundo: 'tinta', telas: Array.from({ length: n }, () => plano_(proxima('grade'))) };
  }
  const tela = plano_(proximaAlternando(bloco(c)));
  // trecho com o celular ao lado: a janela vai para a esquerda e o celular troca de tela a cada corte
  const tr = (plano.celular ?? []).find((x) => c.quadro >= x.de && c.quadro <= x.ate);
  const cel = tr ? { celTela: plano_(proxima(`cel-${tr.bloco}`)) } : {};
  // orçamento de flash (bible-1 §1.3.6): no máximo 0,55 e nunca dois a menos de 20 quadros
  let flash = false;
  if (m === 'slam-flash' && c.quadro - ultimoFlash >= 20) { flash = true; ultimoFlash = c.quadro; }
  return { ...base, mov: m === 'slam-flash' && !flash ? 'slam' : m, tela, fundo: fundoDe(c, tela), ...(flash ? { flash } : {}), ...cel };
});

// ---------- títulos (camada por cima, atravessa vários cortes) ----------
const textoTitulo = (t) => (typeof t === 'string' ? t : t.texto);
const titulos = (plano.titulos ?? []).map((t, k) => ({ quadro: t.quadro, fim: t.fim, texto: textoTitulo(T.titulos[k % T.titulos.length]) }));

// config.cortarInicio (s): tira o silêncio do começo da música; todos os quadros andam junto com o áudio
const DQ = Math.round((cfg.cortarInicio ?? 0) * plano.fps);
const menos = (q) => q - DQ;
for (const c of cortes) { c.quadro = menos(c.quadro); c.fim = menos(c.fim); }
const saida = {
  id: cfg.id, fps: plano.fps, largura: 1920, altura: 1080, duracaoQuadros: Math.ceil(plano.duracao_s * plano.fps) - DQ,
  musica: cfg.musica, musicaDesde: DQ, branco: menos(Math.round(plano.branco_a_partir_s * plano.fps)),
  marca: cfg.marca, cta: T.cta, site: T.site, cortes, titulos: titulos.map((t) => ({ ...t, quadro: menos(t.quadro), fim: menos(t.fim) })),
  celular: (plano.celular ?? []).map(({ de, ate }) => ({ de: menos(de), ate: menos(ate) })),
};
fs.writeFileSync(SAIDA, JSON.stringify(saida, null, 1));

const usos = {};
for (const c of cortes) for (const t of [c.tela, ...(c.telas ?? [])].filter(Boolean)) usos[t.imagem] = (usos[t.imagem] ?? 0) + 1;
const repetidas = Object.values(usos).filter((n) => n > 1).length;
console.log(`${cortes.length} cortes · ${capturas.size} capturas disponíveis · ${usadas.size} usadas · ${repetidas} aparecem mais de uma vez · ${cortes.filter((c) => c.flash).length} flashes`);
for (const [b, q] of Object.entries(filas)) if (q.i > q.lista.length) console.warn(`bloco ${b}: ${q.i} cortes para ${q.lista.length} telas (repete)`);
console.log(`gerado: ${SAIDA}`);
