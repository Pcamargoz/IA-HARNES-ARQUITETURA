import React from 'react';
import {
  AbsoluteFill, Audio, Easing, Img, continueRender, delayRender, interpolate, random, spring, staticFile, useCurrentFrame,
} from 'remotion';
import { noise2D } from '@remotion/noise';

// Vídeo de corte por batida, v2: um corte em cada golpe do grave, com as prints INTEIRAS numa moldura de janela.
// Os dados vêm de <projeto>/video/dados.json (scripts/montar-batidas.mjs), passados por --props; as imagens, a música e
// a marca vêm de <projeto>/video/public (--public-dir). O motor não guarda nada do vídeo (scripts/render-batidas.mjs).
//
// Gramática (regras do motor, Knowledge/video-engine): quadro = função do tempo; a print nunca recebe zoom nem
// recorte, o movimento é da janela. O golpe cai no quadro do ataque do grave: no whip, o pico de velocidade fica no
// golpe (a arrancada começa 2 quadros antes); no slam, a janela para seca no golpe e treme decaindo. Borrão só na
// direção do movimento e só na camada que se move (bible-3 efeito 14); flash de no máximo 0,55, nunca dois a menos
// de 20 quadros (bible-1 §1.3.6); nada de RGB/glitch sobre a print (bible-1 §1.3.3); texto de leitura reto.
// Exceção consciente ao "não pulsar no ritmo" (bible-5 §6): o pulso é o corte e o movimento da janela, nunca a escala.

type Retangulo = { x: number; y: number; w: number; h: number };
export type Plano = { imagem: string; celular?: boolean; escuro?: boolean; area?: string; rotulo?: string; borrar?: Retangulo[]; alvo?: Retangulo };
export type Corte = {
  i: number; quadro: number; fim: number; mov: string; forca: number; secao: string;
  tela?: Plano; telas?: Plano[]; texto?: string; flash?: boolean; fundo?: 'creme' | 'tinta' | 'vermelho';
  celTela?: Plano; // dentro de um trecho com o celular ao lado: a tela que o celular mostra neste corte
  parede?: number; // clímax: 3, 9 ou 25 telas em volta da tela do meio
  arranjo?: 'quatro' | 'dupla' | 'lado' | 'celular-solo' | 'tres-celulares'; troca?: number; // montagem do drop e a peça que trocou (-1 = todas entram)
};
type Fonte = { familia: string; arquivo: string; pesos?: string };
export type Marca = {
  nome: string; simbolo: string; fonteLogo: Fonte; fonteTexto: Fonte;
  // papéis: fundo claro, fundo claro 2, acento, acento vivo, tinta, tinta escura, branco
  cores: { creme: string; creme2: string; vermelho: string; vivo: string; tinta: string; tinta2: string; branco: string };
};
export type Titulo = { quadro: number; fim: number; texto: string };
export type DadosBatida = {
  id: string; fps: number; largura: number; altura: number; duracaoQuadros: number; musica: string; musicaDesde?: number;
  branco: number; marca: Marca; cta: string; site: string; cortes: Corte[]; titulos: Titulo[];
  celular?: { de: number; ate: number }[]; // trechos (quadros) com o celular ao lado da janela
};

// A marca vem dos dados do projeto. Fica em variáveis do módulo (e não em contexto) porque cada render tem um vídeo só
// e todos os componentes leem as mesmas cores; BatidaVideo as define antes de desenhar qualquer coisa.
let C: Marca['cores'] = { creme: '#FBF6E9', creme2: '#F6E7B6', vermelho: '#C4001A', vivo: '#FF4239', tinta: '#2A1E10', tinta2: '#15100C', branco: '#FFFFFF' };
let LOGO = 'serif';
let DISPLAY = 'system-ui, sans-serif';
let SIMBOLO = '';
let NOME = '';
const W = 1920, H = 1080;

// ---------- curvas e tempos (MotorV6 l.45–50, convertidos para 60 fps: q60 = 2 × q30) ----------
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const E = {
  entra: Easing.bezier(0.16, 1, 0.3, 1), sai: Easing.bezier(0.7, 0, 0.84, 0),
  move: Easing.bezier(0.7, 0, 0.2, 1), sobra: Easing.bezier(0.34, 1.56, 0.64, 1),
};
const rampa = (e: number, d: number, a: number, b: number, ease = E.entra) => interpolate(e, [0, d], [a, b], { ...clamp, easing: ease });
const mola = (e: number, fps: number, config: { stiffness: number; damping: number; mass?: number }) =>
  spring({ frame: Math.max(0, e), fps, config: { mass: 1, ...config } });

// tremor amortecido do slam (MotorV6 l.461: 18 px·e^(−q/1,7) a 30 fps, mais vertical); determinístico
const tremor = (e: number, amp: number, semente: string, dur = 10, horizontal = false) => {
  if (e < 0 || e > dur) return [0, 0];
  const k = amp * Math.exp(-e / 3.4);
  const rx = (random(`${semente}x${e}`) * 2 - 1) * k, ry = (random(`${semente}y${e}`) * 2 - 1) * k;
  return horizontal ? [rx, ry * 0.4] : [rx * 0.6, ry];
};

// ---------- moldura da janela (MotorV6 l.504–506, 729–742) ----------
const S = 0.76, BARRA = 64;
const JW = W * S, JH = (H + BARRA) * S;
const JX = (W - JW) / 2, JY = (H - JH) / 2 + 6;
const VAO = 120 * S; // espaço entre as duas janelas no whip (bible-3 efeito 14)

const useFontes = (m: Marca) => {
  const [h] = React.useState(() => delayRender('fontes-da-marca'));
  React.useEffect(() => {
    const fs = [m.fonteLogo, m.fonteTexto].map((f) => new FontFace(f.familia, `url(${staticFile(f.arquivo)})`, f.pesos ? { weight: f.pesos } : {}));
    Promise.all(fs.map((f) => f.load().then((x) => document.fonts.add(x)))).then(() => continueRender(h), () => continueRender(h));
  }, [h, m]);
};

// borrão direcional numa camada (feGaussianBlur "σ 0", bordas duplicadas): só enquanto ela se move
const Borrao: React.FC<{ id: string; sx: number; sy: number }> = ({ id, sx, sy }) => (
  <svg width={0} height={0} style={{ position: 'absolute' }}>
    <filter id={id} x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
      <feGaussianBlur stdDeviation={`${sx.toFixed(2)} ${sy.toFixed(2)}`} edgeMode="duplicate" />
    </filter>
  </svg>
);

// A print inteira, com os trechos de dado de teste borrados por uma cópia desfocada da própria imagem (o
// backdrop-filter pode falhar na captura; a cópia com filter não).
// Cantos de foco (MotorV6 `Cantos`): quatro "L" na cor da marca em volta do elemento principal da tela, desenhados
// em 7 quadros logo depois do corte. Levam o olho ao que importa sem zoom nenhum.
const Cantos: React.FC<{ a: Retangulo; w: number; h: number; p: number }> = ({ a, w, h, p }) => {
  const m = 10, L = Math.min(34, a.w * w * 0.3, a.h * h * 0.6) * p, esp = 5;
  const x0 = a.x * w - m, y0 = a.y * h - m, x1 = (a.x + a.w) * w + m, y1 = (a.y + a.h) * h + m;
  const cor = C.vermelho;
  const linha = (st: React.CSSProperties) => <div style={{ position: 'absolute', background: cor, borderRadius: 3, ...st }} />;
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: Math.min(1, p * 2) }}>
      {linha({ left: x0, top: y0, width: L, height: esp })}{linha({ left: x0, top: y0, width: esp, height: L })}
      {linha({ left: x1 - L, top: y0, width: L, height: esp })}{linha({ left: x1 - esp, top: y0, width: esp, height: L })}
      {linha({ left: x0, top: y1 - esp, width: L, height: esp })}{linha({ left: x0, top: y1 - L, width: esp, height: L })}
      {linha({ left: x1 - L, top: y1 - esp, width: L, height: esp })}{linha({ left: x1 - esp, top: y1 - L, width: esp, height: L })}
    </div>
  );
};

const Print: React.FC<{ p: Plano; w: number; h: number; cantos?: number }> = ({ p, w, h, cantos = 0 }) => (
  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
    <Img src={staticFile(p.imagem)} style={{ width: w, height: h, display: 'block' }} />
    {(p.borrar ?? []).map((b, k) => {
      const x = (b.x - 0.004) * w, y = (b.y - 0.006) * h, bw = (b.w + 0.008) * w, bh = (b.h + 0.012) * h;
      return (
        <div key={k} style={{ position: 'absolute', left: x, top: y, width: bw, height: bh, overflow: 'hidden', borderRadius: 6 }}>
          <Img src={staticFile(p.imagem)} style={{ position: 'absolute', left: -x, top: -y, width: w, height: h, filter: 'blur(9px)' }} />
        </div>
      );
    })}
    {p.alvo && cantos > 0.01 && <Cantos a={p.alvo} w={w} h={h} p={cantos} />}
  </div>
);

const Janela: React.FC<{ p: Plano; style?: React.CSSProperties; escala?: number; mini?: boolean; cantos?: number }> = ({ p, style, escala = S, mini, cantos }) => {
  const barra = mini ? 34 : BARRA;
  // print no tema escuro: a barra do aplicativo acompanha (uma barra clara sobre uma tela escura parece colagem)
  const k = p.escuro ? { barra: '#231C17', linha: 'rgba(255,255,255,0.06)', pilula: '#2E2620', texto: '#B8AC9C' } : { barra: '#EEF1F5', linha: 'rgba(19,24,32,0.08)', pilula: '#fff', texto: '#5A6474' };
  return (
    <div style={{ position: 'absolute', width: W * escala, height: (H + barra) * escala, ...style }}>
      <div style={{ position: 'absolute', width: W, height: H + barra, transform: `scale(${escala})`, transformOrigin: '0 0', borderRadius: mini ? 18 : 26, overflow: 'hidden',
        boxShadow: '0 30px 80px rgba(19,24,32,.18)', background: '#fff', border: '1px solid rgba(19,24,32,0.10)' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: barra, background: k.barra, borderBottom: `1px solid ${k.linha}`,
          display: 'flex', alignItems: 'center', gap: 14, padding: '0 28px' }}>
          {['#E5726B', '#E9B949', '#5DBB6A'].map((cor) => <div key={cor} style={{ width: mini ? 12 : 18, height: mini ? 12 : 18, borderRadius: '50%', background: cor, opacity: 0.85 }} />)}
          {!mini && (
            <div style={{ marginLeft: 620, display: 'flex', alignItems: 'center', gap: 12, background: k.pilula, borderRadius: 12, padding: '8px 26px',
              fontFamily: DISPLAY, fontWeight: 500, fontSize: 24, color: k.texto, border: `1px solid ${k.linha}` }}>
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={k.texto} strokeWidth={2.2}><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
              {NOME}{p.rotulo ? ` · ${p.rotulo}` : ''}
            </div>
          )}
        </div>
        <div style={{ position: 'absolute', top: barra, width: W, height: H }}>
          <Print p={p} w={W} h={H} cantos={cantos} />
        </div>
      </div>
    </div>
  );
};

// celular: a captura de 390×844 (×1,2) inteira dentro do aparelho
const Celular: React.FC<{ p: Plano; style?: React.CSSProperties; altura?: number }> = ({ p, style, altura = 900 }) => {
  const sw = altura * 0.462;
  return (
    <div style={{ position: 'absolute', width: sw + 32, height: altura + 32, borderRadius: 64, background: C.tinta2, padding: 16, boxShadow: '0 40px 90px rgba(0,0,0,.35)', ...style }}>
      <div style={{ position: 'relative', width: sw, height: altura, borderRadius: 50, overflow: 'hidden', background: '#fff' }}>
        <Print p={p} w={sw} h={altura} />
      </div>
    </div>
  );
};

// ---------- fundo do palco ----------
const Fundo: React.FC<{ tipo: Corte['fundo']; f: number }> = ({ tipo = 'creme', f }) => {
  const cor = tipo === 'tinta' ? C.tinta : tipo === 'vermelho' ? C.vermelho : C.creme;
  const marca = tipo === 'creme' ? 'rgba(196,0,26,0.045)' : tipo === 'tinta' ? 'rgba(246,231,182,0.05)' : 'rgba(255,66,57,0.45)';
  // a marca d'água desliza devagar (câmera viva do fundo); nunca para
  return (
    <AbsoluteFill style={{ background: cor, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 300, left: -200 - ((f * 0.9) % 1400), whiteSpace: 'nowrap', fontFamily: LOGO, fontSize: 520, color: marca, lineHeight: 1 }}>
        {`${NOME} ${NOME} ${NOME}`}
      </div>
    </AbsoluteFill>
  );
};

// câmera viva: a janela flutua alguns pixels num ruído contínuo (MotorV6 l.1389), começando de zero (sem pulo)
const deriva = (f: number, semente: string) => [
  14 * (noise2D(semente, f / 60 * 0.22, 0) - noise2D(semente, 0, 0)),
  9 * (noise2D(semente, 0, f / 60 * 0.22) - noise2D(semente, 0, 0)),
];

// ---------- um plano: o que aparece entre um corte e o seguinte, já com o movimento de entrada ----------
type Pose = { x: number; y: number; rx?: number; ry?: number; rz?: number; borrao?: [number, number] };

// whip com freio (bible-3 efeito 14) comprimido para planos curtos: N quadros a 60 fps, pico de velocidade no golpe
const WHIP_N = 12, WHIP_LEAD = 2;
const xWhip = (q30: number) => (q30 < 3 ? (300 * q30 * q30) / 6 : 450 + 1590 * (1 - Math.exp(-(q30 - 3) / 5.3))) / 2040;
const pWhip = (e: number) => (e + WHIP_LEAD <= 0 ? 0 : Math.min(1, xWhip(((e + WHIP_LEAD) / WHIP_N) * 22) / xWhip(22)));
const DIRS: Record<string, [number, number]> = { 'whip-esquerda': [1, 0], 'whip-direita': [-1, 0], 'whip-cima': [0, 1], 'whip-baixo': [0, -1] };

function poseEntrada(mov: string, e: number, i: number, fps: number): Pose {
  const d = DIRS[mov];
  if (d) {
    const D = d[0] ? JW + VAO : JH + VAO;
    const p = pWhip(e), v = D * (p - pWhip(e - 1));
    const s = v > 4 ? Math.min(64, 0.17 * v) : 0;
    const rz = d[0] ? Math.max(-2.2, Math.min(2.2, -0.07 * v * d[0])) : 0;
    return { x: d[0] * D * (1 - p), y: d[1] * D * (1 - p), rz, borrao: [d[0] ? s : 0, d[1] ? s : 0] };
  }
  switch (mov) {
    case 'slam': case 'slam-flash': case 'tela-slam': {
      // para seco no golpe; depois treme e assenta (kino-montage: tremor que decai)
      const [tx, ty] = tremor(e, 12, `s${i}`);
      return { x: tx, y: ty + rampa(e, 3, -26, 0, Easing.out(Easing.quad)) };
    }
    case 'slam-lateral': {
      const [tx, ty] = tremor(e, 12, `l${i}`, 10, true);
      return { x: tx + (i % 2 ? 1 : -1) * rampa(e, 5, 46, 0, Easing.out(Easing.quad)), y: ty };
    }
    case 'flip-3d': {
      const m = mola(e, fps, { stiffness: 110, damping: 15 });
      return { x: (1 - m) * 260, y: (1 - m) * 120, rx: (1 - m) * 22, ry: (1 - m) * -40 };
    }
    case 'deslize-cima': case 'tela-desliza': {
      const p = pWhip(e);
      const D = JH + VAO;
      const v = D * (p - pWhip(e - 1));
      return { x: 0, y: D * (1 - p), borrao: [0, v > 4 ? Math.min(40, 0.17 * v) : 0] };
    }
    case 'corte-seco': return { x: 0, y: rampa(e, 6, 12, 0) }; // corte no mesmo enquadramento (match cut), com um tranco leve
    case 'rajada': return { x: 0, y: rampa(e, 4, i % 2 ? 16 : -16, 0) }; // virada em semicolcheia: tranco curto alternado
    case 'chimbal': return { x: rampa(e, 5, i % 2 ? 22 : -22, 0), y: 0 }; // colcheia do chimbal no drop: tranco lateral
    default: return { x: 0, y: 0 };
  }
}

// posição da janela antiga durante a entrada da nova (só nos movimentos que empurram)
function poseSaida(mov: string, e: number): Pose | null {
  const d = DIRS[mov];
  if (d) {
    const D = d[0] ? JW + VAO : JH + VAO;
    const p = pWhip(e), v = D * (p - pWhip(e - 1));
    const s = v > 4 ? Math.min(64, 0.17 * v) : 0;
    return { x: -d[0] * D * p, y: -d[1] * D * p, rz: d[0] ? Math.max(-2.2, Math.min(2.2, -0.07 * v * d[0])) : 0, borrao: [d[0] ? s : 0, d[1] ? s : 0] };
  }
  if (mov === 'deslize-cima' || mov === 'tela-desliza') return { x: 0, y: -0.35 * (JH + VAO) * pWhip(e) };
  return null;
}
// quadros antes do golpe em que o movimento já começou: só o whip/deslize de janela única (as duas janelas passam juntas
// e o pico de velocidade cai no golpe). Nas trocas por dentro da peça e na janela + celular, nada muda antes do som.
const comeca = (c: Corte) => ((DIRS[c.mov] || c.mov === 'deslize-cima' || c.mov === 'tela-desliza') && !c.arranjo && !c.celTela && !c.parede && !c.telas ? WHIP_LEAD : 0);
const dura = (mov: string) => (DIRS[mov] || mov === 'deslize-cima' || mov === 'tela-desliza' ? WHIP_N - WHIP_LEAD : 0);

// com o celular ao lado, a janela menor não pode atravessar a tela inteira: whip, deslize e flip ficam curtos e no lugar
function poseDupla(mov: string, e: number, i: number, fps: number): Pose {
  const d = DIRS[mov];
  if (d) { const p = pWhip(e); return { x: d[0] * 140 * (1 - p), y: d[1] * 100 * (1 - p) }; } // curto: sem rastro (num deslocamento pequeno o rastro só borra)
  if (mov === 'deslize-cima') return { x: 0, y: rampa(e, 8, 140, 0) };
  if (mov === 'flip-3d') { const m = mola(e, fps, { stiffness: 110, damping: 15 }); return { x: 0, y: 0, ry: (1 - m) * 28 }; }
  return poseEntrada(mov, e, i, fps);
}

const transformar = (q: Pose) => `translate(${q.x}px, ${q.y}px) rotateX(${q.rx ?? 0}deg) rotateY(${q.ry ?? 0}deg) rotateZ(${q.rz ?? 0}deg)`;

// ---------- tipografia ----------
const Carimbo: React.FC<{ texto: string; e: number; fps: number; cor?: string; tamanho?: number; fonte?: string; de?: number }> = ({ texto, e, cor = C.vermelho, tamanho = 150, fonte = LOGO, de = 1.9 }) => {
  // carimbo (bible-3 efeito 16): 1,9 → 1 em 10 q60, gira de −8° até reto, treme 6 px por 10 q60; em rajada parte menor
  const s = rampa(e, de < 1.5 ? 5 : 10, de, 1, Easing.in(Easing.quad));
  const giro = rampa(e, 10, -8, 0, Easing.in(Easing.quad));
  const [tx, ty] = tremor(e - 10, 6, texto, 10);
  return (
    <div style={{ fontFamily: fonte, fontSize: tamanho, color: cor, lineHeight: 1, whiteSpace: 'nowrap', opacity: e < 0 ? 0 : 1,
      transform: `translate(${tx}px, ${ty}px) scale(${s}) rotate(${giro}deg)` }}>{texto}</div>
  );
};

// Palavras cinéticas (MotorV6 l.92): cada palavra cai no lugar vinda de cima, maior e girada, numa mola 170/11
const Palavras: React.FC<{ texto: string; e: number; fps: number; cor: string; tamanho: number; passo?: number }> = ({ texto, e, fps, cor, tamanho, passo = 6 }) => (
  <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: tamanho, color: cor, letterSpacing: '-0.025em', whiteSpace: 'nowrap' }}>
    {texto.split(' ').map((w, k) => {
      const s = mola(e - k * passo, fps, { stiffness: 170, damping: 11 });
      return (
        <React.Fragment key={k}>
          <span style={{ display: 'inline-block', opacity: Math.min(1, s * 2), transformOrigin: '50% 100%',
            transform: `translateY(${(1 - s) * -70}px) scale(${1.5 - 0.5 * s}) rotate(${(1 - s) * (k % 2 ? 9 : -9)}deg)` }}>{w}</span>{' '}
        </React.Fragment>
      );
    })}
  </div>
);

const Simbolo: React.FC<{ tamanho: number; style?: React.CSSProperties }> = ({ tamanho, style }) => (
  <Img src={staticFile(SIMBOLO)} style={{ width: tamanho, height: tamanho, borderRadius: tamanho * 0.24, boxShadow: '0 18px 50px rgba(42,30,16,.25)', ...style }} />
);

// ---------- telas compostas ----------
const Grade: React.FC<{ telas: Plano[]; e: number; fps: number }> = ({ telas, e, fps }) => {
  const n = telas.length;
  const cols = n <= 4 ? 2 : n <= 9 ? 3 : 4;
  const rows = Math.ceil(n / cols);
  const gap = n >= 16 ? 18 : 28;
  const esc = Math.min((W - gap * (cols + 1)) / cols / W, (H - gap * (rows + 1)) / rows / (H + 34));
  const tw = W * esc, th = (H + 34) * esc;
  const ox = (W - cols * tw - (cols - 1) * gap) / 2, oy = (H - rows * th - (rows - 1) * gap) / 2;
  return (
    <AbsoluteFill style={{ perspective: 2600 }}>
      {telas.map((t, k) => {
        const c = k % cols, r = Math.floor(k / cols);
        // entrada em onda (parede do fechamento, MotorV6 l.924): mola 120/13, de trás e girada
        const m = mola(e - (c + r) * 1.2, fps, { stiffness: 120, damping: 13 });
        return (
          <div key={k} style={{ position: 'absolute', left: ox + c * (tw + gap), top: oy + r * (th + gap), width: tw, height: th, opacity: Math.min(1, m * 3),
            transform: `translateZ(${(1 - m) * -900}px) rotateY(${(1 - m) * (c % 2 ? 50 : -50)}deg)` }}>
            {t.celular
              ? <Celular p={t} altura={th - 32} style={{ left: (tw - (th - 32) * 0.462 - 32) / 2, padding: 8, borderRadius: 30 }} />
              : <Janela p={t} escala={esc} mini />}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const Mosaico: React.FC<{ telas: Plano[]; e: number; dur: number; gira: boolean }> = ({ telas, e, dur, gira }) => {
  const n = 6, gap = 10, w = (W - gap * (n + 1)) / n, h = (H - gap * (n + 1)) / n;
  // a parede inteira recua e gira (é a câmera se afastando, não zoom na print) e acende até o branco
  const z = gira ? rampa(e, dur, 1, 0.84, Easing.inOut(Easing.cubic)) : 1;
  const rot = gira ? rampa(e, dur, 0, 7, Easing.in(Easing.cubic)) : 0;
  const acende = gira ? interpolate(e, [dur * 0.3, dur], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) }) : 0;
  return (
    <AbsoluteFill style={{ background: C.tinta }}>
      <AbsoluteFill style={{ transform: `scale(${z}) rotate(${rot}deg)` }}>
        {telas.slice(0, 36).map((t, k) => {
          const c = k % n, r = Math.floor(k / n);
          const ek = gira ? 99 : e - (Math.abs(c - 2.5) + Math.abs(r - 2.5)) * 0.9; // nasce do centro para fora
          const m = Math.min(1, Math.max(0, ek / 6));
          return (
            <div key={k} style={{ position: 'absolute', left: gap + c * (w + gap), top: gap + r * (h + gap), width: w, height: h, overflow: 'hidden', borderRadius: 8,
              background: '#fff', opacity: m, transform: `translateY(${(1 - E.entra(m)) * 40}px)` }}>
              {t.celular
                ? <div style={{ position: 'absolute', left: (w - h * 0.462) / 2, width: h * 0.462, height: h }}><Print p={t} w={h * 0.462} h={h} /></div>
                : <Print p={t} w={w} h={h} />}
            </div>
          );
        })}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: C.branco, opacity: acende }} />
    </AbsoluteFill>
  );
};

// ---------- clímax: a parede cresce em volta da tela do meio ----------
// Layouts centrados (3 = 1×3, 9 = 3×3, 25 = 5×5). Cada tela de fora tem um lugar fixo (anel 1, depois anel 2), então
// a parede cresce sem trocar o que já estava: as telas que ficam deslizam para o novo lugar numa mola (120/14) e as
// novas chegam de fora para dentro, anel por anel. Tudo plano (sem giro 3D, que deformava as miniaturas) e só janelas.
// O meio é a heroína: maior, contorno vermelho e sombra, e troca a cada corte subindo por dentro da moldura.
const LAYOUT: Record<number, { tw: number; gap: number; heroi: number }> = { 3: { tw: 560, gap: 44, heroi: 780 }, 9: { tw: 500, gap: 30, heroi: 720 }, 25: { tw: 336, gap: 18, heroi: 640 } };
const ANEL = (() => {
  const r1 = [[-1, 0], [1, 0], [-1, -1], [0, -1], [1, -1], [-1, 1], [0, 1], [1, 1]];
  const r2: number[][] = [];
  for (let y = -2; y <= 2; y++) for (let x = -2; x <= 2; x++) if (Math.max(Math.abs(x), Math.abs(y)) === 2) r2.push([x, y]);
  return [...r1, ...r2];
})();
const qtd = (n: number) => (n === 0 ? 0 : n === 3 ? 2 : n === 9 ? 8 : 24); // telas em volta do meio
const ASP = (H + 34) / W;
const posParede = (n: number, k: number) => {
  const L = LAYOUT[n], [gx, gy] = ANEL[k];
  return { x: W / 2 + gx * (L.tw + L.gap), y: H / 2 + gy * (L.tw * ASP + L.gap), w: L.tw };
};
const Parede: React.FC<{ c: Corte; ant?: Corte; e: number; f: number; fps: number }> = ({ c, ant, e, f, fps }) => {
  const n = c.parede ?? 9, nAnt = ant?.parede ?? 0;
  const m = mola(e, fps, { stiffness: 120, damping: 14 });
  const telas = c.telas ?? [];
  const L = LAYOUT[n], hAnt = nAnt ? LAYOUT[nAnt].heroi : L.heroi * 0.86;
  const hw = hAnt + (L.heroi - hAnt) * m;
  const troca = ant?.parede && ant.tela && e < 7 ? rampa(e, 7, 1, 0) : 0;
  const [dx, dy] = deriva(f, 'parede');
  return (
    <AbsoluteFill style={{ background: C.tinta, transform: `translate(${dx}px, ${dy}px)` }}>
      {telas.slice(0, qtd(n)).map((t, k) => {
        const novo = k >= qtd(nAnt);
        const fim = posParede(n, k);
        const ini = novo ? (() => { const [gx, gy] = ANEL[k]; return { x: W / 2 + gx * 1400, y: H / 2 + gy * 900, w: fim.w }; })() : posParede(nAnt, k);
        const anel = Math.max(Math.abs(ANEL[k][0]), Math.abs(ANEL[k][1]));
        const mk = novo ? mola(e - (anel - 1) * 3 - (k % 4), fps, { stiffness: 120, damping: 14 }) : m;
        const x = ini.x + (fim.x - ini.x) * mk, y = ini.y + (fim.y - ini.y) * mk, w = ini.w + (fim.w - ini.w) * mk;
        return (
          <div key={k} style={{ position: 'absolute', left: x - w / 2, top: y - (w * ASP) / 2, width: w, height: w * ASP }}>
            <Janela p={t} escala={w / W} mini />
            <div style={{ position: 'absolute', inset: 0, borderRadius: 18 * (w / W) * 4, background: 'rgba(21,16,12,0.42)' }} />
          </div>
        );
      })}
      {c.tela && (
        <div style={{ position: 'absolute', left: W / 2 - hw / 2, top: H / 2 - (hw * ASP) / 2, width: hw, height: hw * ASP,
          borderRadius: 14, boxShadow: `0 0 0 6px ${C.vermelho}, 0 40px 100px rgba(0,0,0,.55)`, overflow: 'hidden' }}>
          {troca > 0 && ant?.tela && <div style={{ position: 'absolute', inset: 0, transform: `translateY(${-(1 - troca) * 25}%)` }}><Janela p={ant.tela} escala={hw / W} mini /></div>}
          <div style={{ position: 'absolute', inset: 0, transform: `translateY(${troca * 100}%)` }}><Janela p={c.tela} escala={hw / W} mini /></div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------- montagens do drop: várias peças ao mesmo tempo, uma troca a cada golpe ----------
// quatro (2×2), dupla (um quadro em cima e outro embaixo, deslocados, SEM sobreposição), lado (duas janelas viradas
// para o centro, como um livro), celular-solo e tres-celulares (leque). Regra: cada peça fica no seu lugar e a troca
// acontece POR DENTRO da moldura dela (nenhuma peça invade a vizinha; peça passando por cima da outra parece bug).
// A print fica inteira, sem zoom. O golpe decide como o conteúdo troca: whip (o antigo sai e o novo entra por dentro,
// com rastro), chimbal (deslize lateral curto), deslize (sobe), máscara (revela), flip (a moldura gira no próprio
// eixo) e slam (troca seca e a moldura dá um tranco).
type Lugar = { x: number; y: number; esc?: number; alt?: number; ry?: number; z?: number };
const lugares = (a: NonNullable<Corte['arranjo']>): Lugar[] => {
  if (a === 'quatro') {
    const esc = 0.43, w = W * esc, h = (H + 34) * esc, g = 26;
    return [[0, 0], [1, 0], [0, 1], [1, 1]].map(([cx, cy]) => ({ x: W / 2 - w - g / 2 + cx * (w + g), y: H / 2 - h - g / 2 + cy * (h + g), esc }));
  }
  if (a === 'dupla') {
    const esc = 0.44, w = W * esc, h = (H + 34) * esc;
    return [{ x: W / 2 - w / 2 - 230, y: H / 2 - h - 14, esc }, { x: W / 2 - w / 2 + 230, y: H / 2 + 14, esc }];
  }
  if (a === 'lado') {
    const esc = 0.47, w = W * esc, h = (H + 34) * esc;
    return [{ x: W / 2 - w - 18, y: H / 2 - h / 2, esc, ry: 14 }, { x: W / 2 + 18, y: H / 2 - h / 2, esc, ry: -14 }];
  }
  if (a === 'celular-solo') return [{ x: W / 2, y: H / 2, alt: 920 }];
  return [{ x: W / 2 - 540, y: H / 2, alt: 740, ry: 20 }, { x: W / 2, y: H / 2, alt: 800, z: 60 }, { x: W / 2 + 540, y: H / 2, alt: 740, ry: -20 }];
};
const TelaCelular: React.FC<{ p: Plano; ant?: Plano; e: number; alt: number }> = ({ p, ant, e, alt }) => {
  const sw = alt * 0.462, sobe = ant && e < 7 ? rampa(e, 7, 1, 0) : 0;
  return (
    <div style={{ width: sw + 28, height: alt + 28, borderRadius: alt * 0.068, background: C.tinta2, padding: 14, boxShadow: '30px 50px 90px rgba(0,0,0,.42)' }}>
      <div style={{ position: 'relative', width: sw, height: alt, borderRadius: alt * 0.054, overflow: 'hidden', background: '#fff' }}>
        {sobe > 0 && ant && <div style={{ position: 'absolute', inset: 0, transform: `translateY(${-(1 - sobe) * 30}%)` }}><Print p={ant} w={sw} h={alt} /></div>}
        <div style={{ position: 'absolute', inset: 0, transform: `translateY(${sobe * 100}%)` }}><Print p={p} w={sw} h={alt} /></div>
      </div>
    </div>
  );
};
// troca dentro da moldura: deslocamento (em fração do tamanho da peça) da camada nova e da antiga, recorte e rastro
type Troca = { nx: number; ny: number; ax: number; ay: number; clip?: number; borrao?: [number, number] };
function trocaDentro(mov: string, e: number, i: number): Troca {
  const d = DIRS[mov];
  if (d) { const p = pWhip(e), v = (p - pWhip(e - 1)) * 600; const b = v > 4 ? Math.min(30, 0.17 * v) : 0;
    return { nx: d[0] * (1 - p), ny: d[1] * (1 - p), ax: -d[0] * p, ay: -d[1] * p, borrao: [d[0] ? b : 0, d[1] ? b : 0] }; }
  if (mov === 'chimbal') { const p = rampa(e, 5, 0, 1); return { nx: (i % 2 ? 0.35 : -0.35) * (1 - p), ny: 0, ax: 0, ay: 0 }; }
  if (mov === 'deslize-cima') { const p = rampa(e, 8, 0, 1); return { nx: 0, ny: 1 - p, ax: 0, ay: -0.35 * p }; }
  if (MASCARAS.includes(mov)) return { nx: 0, ny: 0, ax: 0, ay: 0, clip: rampa(e, 7, 0, 1) };
  return { nx: 0, ny: 0, ax: 0, ay: 0 };
}
// tranco da moldura (a peça não sai do lugar): slam treme e assenta, flip gira no próprio eixo, o resto dá um toque
function trancoMoldura(mov: string, e: number, i: number): { x: number; y: number; ry: number } {
  if (mov.startsWith('slam')) { const [tx, ty] = tremor(e, 7, `m${i}`, 9); return { x: tx, y: ty - 18 * rampa(e, 4, 1, 0, Easing.in(Easing.quad)), ry: 0 }; }
  if (mov === 'flip-3d') return { x: 0, y: 0, ry: rampa(e, 9, 88, 0) };
  return { x: 0, y: rampa(e, 4, 8, 0), ry: 0 };
}
const Arranjo: React.FC<{ c: Corte; ant?: Corte; e: number; f: number; fps: number }> = ({ c, ant, e, f, fps }) => {
  const a = c.arranjo!, L = lugares(a), pecas = c.telas ?? [], troca = c.troca ?? -1;
  const antPecas = ant?.arranjo === a ? ant.telas : undefined;
  const ordem = L.map((_, k) => k).sort((x, y) => (L[x].z ?? 0) - (L[y].z ?? 0));
  const [dx, dy] = deriva(f, `arr-${a}`);
  const s = f / fps;
  return (
    <AbsoluteFill style={{ perspective: 2200, perspectiveOrigin: '50% 50%', transform: `translate(${dx}px, ${dy}px)` }}>
      {ordem.map((k) => {
        const lg = L[k], p = pecas[k];
        if (!p) return null;
        const celular = !!lg.alt;
        const w = celular ? lg.alt! * 0.462 + 28 : W * lg.esc!, h = celular ? lg.alt! + 28 : (H + 34) * lg.esc!;
        const left = celular ? lg.x - w / 2 : lg.x, top = celular ? lg.y - h / 2 : lg.y;
        // montagem nova: todas as peças JÁ ESTÃO no lugar no quadro do golpe e assentam em 6 quadros (sem quadro vazio)
        const ee = Math.max(0, e - k);
        const chega = troca < 0 ? { x: 0, y: rampa(ee, 6, 36, 0), ry: 0 } : k === troca ? trancoMoldura(c.mov, Math.max(0, e), c.i + k) : { x: 0, y: 0, ry: 0 };
        const giro = celular ? { ry: (lg.ry ?? 0) + 14 * Math.sin(s * 1.7 + k), rx: 4 * Math.sin(s * 1.2 + k), y: 12 * Math.sin(s * 2 + k) } : { ry: lg.ry ?? 0, rx: 0, y: 0 };
        const t = `translate(${chega.x}px, ${chega.y + giro.y}px) translateZ(${lg.z ?? 0}px) rotateX(${giro.rx}deg) rotateY(${chega.ry + giro.ry}deg)`;
        const tr = !celular && k === troca && antPecas?.[k] && e < 10 ? trocaDentro(c.mov, e, c.i + k) : null;
        const id = `pc${c.i}-${k}`;
        const temBorrao = !!tr?.borrao && (tr.borrao[0] > 0.3 || tr.borrao[1] > 0.3);
        const janela = (pp: Plano) => <Janela p={pp} escala={lg.esc!} mini={a === 'quatro'} cantos={0} style={{ position: 'absolute', left: 0, top: 0 }} />;
        return (
          <div key={k} style={{ position: 'absolute', left, top, width: w, height: h, transform: t }}>
            {celular ? <TelaCelular p={p} ant={k === troca ? antPecas?.[k] : undefined} e={e} alt={lg.alt!} /> : (
              <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: (a === 'quatro' ? 18 : 26) * lg.esc!, boxShadow: '0 24px 60px rgba(19,24,32,.22)' }}>
                {temBorrao && <Borrao id={`mb-${id}`} sx={tr!.borrao![0]} sy={tr!.borrao![1]} />}
                {tr && antPecas?.[k] && (
                  <div style={{ position: 'absolute', inset: 0, transform: `translate(${tr.ax * w}px, ${tr.ay * h}px)`, filter: temBorrao ? `url(#mb-${id})` : undefined }}>{janela(antPecas[k])}</div>
                )}
                <div style={{ position: 'absolute', inset: 0, transform: tr ? `translate(${tr.nx * w}px, ${tr.ny * h}px)` : undefined,
                  clipPath: tr?.clip !== undefined ? `inset(0 0 ${(1 - tr.clip) * 100}% 0)` : undefined, filter: temBorrao ? `url(#mb-${id})` : undefined }}>
                  {janela(p)}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// janela ou celular no lugar, na pose dada
// com o celular ao lado, a janela encolhe para a esquerda e o celular ocupa a direita
const SD = 0.64, DX = 96, DY = (H - (H + BARRA) * SD) / 2;
const Principal: React.FC<{ p: Plano; pose: Pose; f: number; id: string; viva: boolean; dupla?: boolean; cantos?: number }> = ({ p, pose, f, id, viva, dupla, cantos }) => {
  const [dx, dy] = viva ? deriva(f, id) : [0, 0];
  // câmera viva também inclina (MotorV6 l.704: até 2,2° em x e 3° em y), num ruído lento: a janela nunca fica morta
  const irx = viva ? 1.6 * noise2D(`${id}rx`, f / 60 * 0.3, 0) : 0, iry = viva ? 2.2 * noise2D(`${id}ry`, 0, f / 60 * 0.3) : 0;
  const temBorrao = !!pose.borrao && (pose.borrao[0] > 0.3 || pose.borrao[1] > 0.3);
  const t = transformar({ ...pose, x: pose.x + dx, y: pose.y + dy, rx: (pose.rx ?? 0) + irx, ry: (pose.ry ?? 0) + iry });
  return (
    <AbsoluteFill style={{ perspective: 2600, perspectiveOrigin: '50% 40%' }}>
      {temBorrao && <Borrao id={`mb-${id}`} sx={pose.borrao![0]} sy={pose.borrao![1]} />}
      <div style={{ position: 'absolute', inset: 0, transform: t, filter: temBorrao ? `url(#mb-${id})` : undefined }}>
        {p.celular
          ? <Celular p={p} style={{ left: (W - 900 * 0.462 - 32) / 2, top: (H - 932) / 2 }} />
          : dupla ? <Janela p={p} escala={SD} style={{ left: DX, top: DY }} cantos={cantos} /> : <Janela p={p} style={{ left: JX, top: JY }} cantos={cantos} />}
      </div>
    </AbsoluteFill>
  );
};

// palco de um corte inteiro (fundo + conteúdo), na pose de entrada; usado também por baixo das máscaras
const Palco: React.FC<{ c: Corte; e: number; f: number; fps: number; pose?: Pose; semFundo?: boolean; ant?: Corte }> = ({ c, e, f, fps, pose, semFundo, ant }) => {
  const dur = c.fim - c.quadro;
  const fundo = semFundo ? null : <Fundo tipo={c.fundo} f={f} />;
  if (c.mov === 'tinta-letra') return (
    <AbsoluteFill style={{ background: C.tinta, alignItems: 'center', justifyContent: 'center' }}>
      <Carimbo texto={c.texto ?? ''} e={e} fps={fps} cor={C.creme2} tamanho={210} />
    </AbsoluteFill>
  );
  if (c.mov === 'congela-preto') return <AbsoluteFill style={{ background: C.tinta }} />;
  if (c.mov === 'logo-respira' || c.mov === 'iris-fecha') return (
    <AbsoluteFill style={{ background: C.tinta, alignItems: 'center', justifyContent: 'center' }}>
      <Simbolo tamanho={200} style={{ opacity: rampa(e, dur, 0, 1, Easing.inOut(Easing.quad)), transform: `translateY(${rampa(e, dur, 30, 0, Easing.inOut(Easing.quad))}px)` }} />
    </AbsoluteFill>
  );
  if (c.mov === 'logo-carimbo') {
    const segundo = c.fundo === 'vermelho';
    return (
      <AbsoluteFill style={{ background: segundo ? C.vermelho : C.tinta, alignItems: 'center', justifyContent: 'center', gap: 40, flexDirection: 'row' }}>
        <Simbolo tamanho={230} />
        {/* na rajada (golpes a cada semicolcheia) o carimbo parte de 1,2: de 1,9 ele ficaria gigante e cortado o tempo todo */}
        <Carimbo texto={NOME} e={e} fps={fps} cor={segundo ? C.creme : C.vermelho} tamanho={190} de={dur < 14 ? 1.2 : 1.9} />
      </AbsoluteFill>
    );
  }
  if (c.parede) return <Parede c={c} ant={ant} e={e} f={f} fps={fps} />;
  if (c.arranjo) return <AbsoluteFill>{fundo}<Arranjo c={c} ant={ant} e={e} f={f} fps={fps} /></AbsoluteFill>;
  if (c.telas && c.mov.startsWith('mosaico')) return <Mosaico telas={c.telas} e={e} dur={dur} gira={c.mov.includes('gira')} />;
  if (c.telas) return <AbsoluteFill>{fundo}<Grade telas={c.telas} e={e} fps={fps} /></AbsoluteFill>;
  if (!c.tela) return <AbsoluteFill style={{ background: C.creme }} />;
  return (
    <AbsoluteFill>
      {fundo}
      {/* cantos de foco só em planos com tempo de leitura (≥ 14 quadros), depois que a entrada assentou */}
      <Principal p={c.tela} pose={pose ?? (c.celTela ? poseDupla(c.mov, e, c.i, fps) : poseEntrada(c.mov, e, c.i, fps))} f={f} id={`c${c.i}`} viva dupla={!!c.celTela}
        cantos={dur >= 14 ? rampa(e - 3, 7, 0, 1) : 0} />
    </AbsoluteFill>
  );
};

// máscaras de passagem (a cena nova é revelada por cima da antiga): só wipes, nunca dissolve
const MASCARAS = ['mascara-diagonal', 'fatias', 'persiana', 'iris'];
const DUR_MASCARA = 8;
// curva de freio (E.entra): a maior parte da revelação acontece nos 2–3 primeiros quadros, junto do golpe do grave
const Mascara: React.FC<{ mov: string; e: number; children: React.ReactNode }> = ({ mov, e, children }) => {
  const p = rampa(e, DUR_MASCARA, 0, 1, E.entra);
  if (mov === 'mascara-diagonal') {
    const x = -40 + p * 180;
    return (
      <>
        <AbsoluteFill style={{ clipPath: `polygon(0 0, ${x}% 0, ${x - 40}% 100%, 0 100%)` }}>{children}</AbsoluteFill>
        {p < 1 && <AbsoluteFill style={{ background: C.vermelho, clipPath: `polygon(${x}% 0, ${x + 0.8}% 0, ${x - 39.2}% 100%, ${x - 40}% 100%)` }} />}
      </>
    );
  }
  if (mov === 'iris') return <AbsoluteFill style={{ clipPath: `circle(${p * 75}% at 50% 50%)` }}>{children}</AbsoluteFill>;
  // fatias (horizontais) e persiana (verticais): faixas que deslizam para o lugar, uma depois da outra (nunca crescem do zero)
  const n = mov === 'persiana' ? 8 : 6;
  return (
    <>{Array.from({ length: n }, (_, k) => {
      const pk = rampa(e - k * 0.5, DUR_MASCARA - 2, 0, 1, E.entra);
      const clip = mov === 'persiana'
        ? `inset(0 ${100 - ((k + 1) * 100) / n}% 0 ${(k * 100) / n}%)`
        : `inset(${(k * 100) / n}% 0 ${100 - ((k + 1) * 100) / n}% 0)`;
      const tr = mov === 'persiana' ? `translateY(${(1 - pk) * (k % 2 ? H : -H)}px)` : `translateX(${(1 - pk) * (k % 2 ? W : -W)}px)`;
      return <AbsoluteFill key={k} style={{ clipPath: clip }}><AbsoluteFill style={{ transform: tr }}>{children}</AbsoluteFill></AbsoluteFill>;
    })}</>
  );
};

// ---------- títulos: camada por cima que atravessa vários cortes (o texto precisa de tempo de leitura) ----------
const CamadaTitulo: React.FC<{ t: Titulo; f: number; fps: number }> = ({ t, f, fps }) => {
  const e = f - t.quadro, resta = t.fim - f;
  if (e < 0 || resta < 0) return null;
  const veu = Math.min(rampa(e, 8, 0, 1), rampa(resta, 10, 0, 1));
  const sai = rampa(10 - resta, 10, 0, 1, E.sai); // as palavras saem subindo, recortadas
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      <AbsoluteFill style={{ background: `rgba(21,16,12,${0.62 * veu})` }} />
      <div style={{ overflow: 'hidden', padding: '10px 40px 26px' }}>
        <div style={{ transform: `translateY(${-sai * 120}%)` }}>
          <Palavras texto={t.texto} e={e} fps={fps} cor={C.creme} tamanho={124} />
        </div>
      </div>
      <div style={{ height: 14, borderRadius: 8, background: C.vermelho, width: rampa(e - 10, 14, 0, 520) * (1 - sai), marginTop: 8 }} />
    </AbsoluteFill>
  );
};

// ---------- encerramento em tela branca ----------
const Encerramento: React.FC<{ d: DadosBatida; f: number }> = ({ d, f }) => {
  const cs = d.cortes.filter((c) => c.secao === 'encerramento-branco');
  const q = (mov: string) => cs.find((c) => c.mov === mov)?.quadro ?? Infinity;
  const palavras = cs.filter((c) => c.mov.startsWith('frase-palavra'));
  const eLogo = f - q('logo-carimbo-tinta'), eAssenta = f - q('logo-assenta');
  const eCta = f - q('cta-entra'), eSub = f - q('cta-sublinha'), ePonto = f - q('ponto-final');
  const sobe = eAssenta >= 0 ? rampa(eAssenta, 18, 0, -40) : 0;
  return (
    <AbsoluteFill style={{ background: C.branco, alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `translateY(${sobe}px)` }}>
        {eLogo >= 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 34 }}>
            <Simbolo tamanho={170} style={{ transform: `translateY(${rampa(eLogo, 10, -60, 0, E.sobra)}px)` }} />
            <Carimbo texto={NOME} e={eLogo - 2} fps={d.fps} cor={C.vermelho} tamanho={150} />
          </div>
        )}
        <div style={{ display: 'flex', gap: 26, marginTop: 46, height: 110, fontFamily: DISPLAY, fontWeight: 600, fontSize: 92, color: C.tinta }}>
          {palavras.map((p, k) => {
            const e = f - p.quadro;
            if (e < 0) return null;
            const s = mola(e, d.fps, { stiffness: 170, damping: 11 });
            return <span key={k} style={{ display: 'inline-block', color: k % 2 ? C.vermelho : C.tinta, opacity: Math.min(1, s * 2),
              transform: `translateY(${(1 - s) * 70}px) scale(${1.4 - 0.4 * s})` }}>{p.texto}</span>;
          })}
        </div>
        <div style={{ marginTop: 50, height: 120, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {eCta >= 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 22, fontFamily: DISPLAY, fontWeight: 600,
              transform: `translateY(${rampa(eCta, 10, 40, 0)}px)`, opacity: rampa(eCta, 6, 0, 1) }}>
              <span style={{ background: C.vermelho, color: C.branco, fontSize: 46, padding: '16px 38px', borderRadius: 999 }}>{d.cta}</span>
              <span style={{ fontSize: 46, color: C.tinta }}>{d.site}</span>
              {ePonto >= 0 && <span style={{ width: 22, height: 22, borderRadius: 11, background: C.vermelho, transform: `translateY(${rampa(ePonto, 8, -40, 0, E.sobra)}px)` }} />}
            </div>
          )}
          {eSub >= 0 && <div style={{ height: 8, borderRadius: 4, background: C.vermelho, marginTop: 18, alignSelf: 'flex-end', width: rampa(eSub, 14, 0, 430) }} />}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// O celular ao lado da janela: uma camada contínua (as transições das janelas não o interrompem). Entra girando na
// mola do motor (110/15), fica girando em 3D e flutuando (ruído lento, nunca parado) e troca a tela no ritmo: a tela
// nova sobe por dentro do aparelho em 7 quadros. Sai deslizando para a direita nos últimos 14 quadros do trecho.
const CelularVivo: React.FC<{ de: number; ate: number; f: number; fps: number; atual: Plano; anterior?: Plano; e: number }> = ({ de, ate, f, fps, atual, anterior, e }) => {
  const ent = mola(f - de, fps, { stiffness: 110, damping: 15 });
  const sai = rampa(f - (ate - 14), 14, 0, 1, E.sai);
  const s = (f - de) / fps;
  const ry = -16 + 12 * Math.sin(s * 1.9) - (1 - ent) * 70 + sai * 40;
  const rx = 5 * Math.sin(s * 1.3 + 1);
  const rz = 2.5 * Math.sin(s * 1.1) - (1 - ent) * 12;
  const y = 14 * Math.sin(s * 2.2) + (1 - ent) * 160;
  const x = (1 - ent) * 760 + sai * 900;
  const alt = 820, sw = alt * 0.462;
  const sobe = anterior && e < 7 ? rampa(e, 7, 1, 0) : 0;
  return (
    <AbsoluteFill style={{ perspective: 1800, perspectiveOrigin: '75% 50%', pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', left: W - sw - 32 - 150, top: (H - alt - 32) / 2,
        transform: `translate(${x}px, ${y}px) rotateY(${ry}deg) rotateX(${rx}deg) rotateZ(${rz}deg)`, transformStyle: 'preserve-3d' }}>
        <div style={{ width: sw + 32, height: alt + 32, borderRadius: 60, background: C.tinta2, padding: 16, boxShadow: '30px 50px 90px rgba(0,0,0,.42)' }}>
          <div style={{ position: 'relative', width: sw, height: alt, borderRadius: 46, overflow: 'hidden', background: '#fff' }}>
            {sobe > 0 && anterior && <div style={{ position: 'absolute', inset: 0, transform: `translateY(${-(1 - sobe) * 30}%)` }}><Print p={anterior} w={sw} h={alt} /></div>}
            <div style={{ position: 'absolute', inset: 0, transform: `translateY(${sobe * 100}%)` }}><Print p={atual} w={sw} h={alt} /></div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const PreRolagem: React.FC<{ f: number; ate: number }> = ({ f, ate }) => (
  <AbsoluteFill style={{ background: C.tinta, alignItems: 'center', justifyContent: 'center' }}>
    <Simbolo tamanho={140} style={{ opacity: interpolate(f, [0, ate * 0.7], [0, 0.9], clamp), transform: `translateY(${interpolate(f, [0, ate], [24, 0], { ...clamp, easing: E.entra })}px)` }} />
  </AbsoluteFill>
);

export const BatidaVideo: React.FC<{ dados: DadosBatida }> = ({ dados: d }) => {
  C = d.marca.cores;
  LOGO = `"${d.marca.fonteLogo.familia}", serif`;
  DISPLAY = `"${d.marca.fonteTexto.familia}", system-ui, sans-serif`;
  SIMBOLO = d.marca.simbolo;
  NOME = d.marca.nome;
  useFontes(d.marca);
  const f = useCurrentFrame();
  const fps = d.fps;
  const cs = d.cortes;
  // a música termina cortada a seco (ainda a −11 dB): fade de 120 ms no fim para não estalar (fade de emenda do video-use)
  // musicaDesde: o projeto cortou o silêncio do começo da música (os cortes já vêm deslocados junto)
  const audio = <Audio src={staticFile(d.musica)} trimBefore={d.musicaDesde ?? 0}
    volume={(q) => interpolate(q, [d.duracaoQuadros - 8, d.duracaoQuadros - 1], [1, 0], clamp)} />;

  if (f >= d.branco) return <AbsoluteFill>{audio}<Encerramento d={d} f={f} /></AbsoluteFill>;
  if (!cs.length || f < cs[0].quadro - comeca(cs[0])) return <AbsoluteFill>{audio}<PreRolagem f={f} ate={cs[0]?.quadro ?? 120} /></AbsoluteFill>;

  // o plano atual é o último cujo movimento já começou (o whip começa WHIP_LEAD quadros antes do golpe)
  let i = 0;
  // a antecipação também exige que o corte anterior seja uma janela única (senão o whip de palco inteiro fica desligado)
  const simples = (x: Corte) => !x.arranjo && !x.celTela && !x.parede && !x.telas;
  const antecede = (k: number) => (k > 0 && simples(cs[k - 1]) ? comeca(cs[k]) : 0);
  while (i + 1 < cs.length && cs[i + 1].quadro - antecede(i + 1) <= f) i++;
  const c = cs[i], e = f - c.quadro, ant = cs[i - 1];
  // whip e máscara de palco inteiro só entre duas janelas únicas comuns (montagens, parede e janela + celular trocam no lugar)
  const comum = (x?: Corte) => !!x && !x.arranjo && !x.parede && !x.celTela && !x.telas;
  const saida = comum(ant) && comum(c) && e < dura(c.mov) ? poseSaida(c.mov, e) : null;
  const ehMascara = MASCARAS.includes(c.mov) && comum(ant) && comum(c) && e < DUR_MASCARA;
  // íris que fecha (entrada do break): a cena antiga encolhe num círculo até o dragão, com o anel vermelho na borda
  const irisFecha = c.mov === 'iris-fecha' && ant && e < 16 ? rampa(e, 16, 1, 0, E.sai) : 0;
  // cortina (saída da rajada do logo): faixas vermelhas e pretas cobrem tudo no golpe e abrem, uma depois da outra
  const cortina = c.mov === 'cortina' && e < 16;
  // flash do golpe (só nos cortes que o montador liberou pelo orçamento): 0,55 decaindo (v6, correção 13)
  const flash = c.flash ? 0.55 * Math.exp(-Math.max(0, e) / 4.8) : 0;
  const titulo = d.titulos.find((t) => f >= t.quadro && f <= t.fim);
  const trecho = (d.celular ?? []).find((t) => f >= t.de && f <= t.ate);

  return (
    <AbsoluteFill style={{ background: C.creme, overflow: 'hidden' }}>
      {audio}
      {saida && ant && ant.tela && !ant.telas ? (
        // whip/deslize: o fundo é o do plano novo e as duas janelas passam juntas, lado a lado
        <>
          <Fundo tipo={c.fundo} f={f} />
          <Principal p={ant.tela} pose={saida} f={f} id={`c${ant.i}`} viva={false} dupla={!!ant.celTela} />
          <Palco c={c} e={e} f={f} fps={fps} semFundo />
        </>
      ) : ehMascara ? (
        <>
          <Palco c={ant} e={ant.fim - ant.quadro} f={f} fps={fps} pose={{ x: 0, y: 0 }} />
          <Mascara mov={c.mov} e={e}><Palco c={c} e={e} f={f} fps={fps} pose={{ x: 0, y: 0 }} /></Mascara>
        </>
      ) : (
        <Palco c={c} e={e} f={f} fps={fps} ant={ant} />
      )}
      {irisFecha > 0 && ant && (
        <>
          <AbsoluteFill style={{ clipPath: `circle(${irisFecha * 75}% at 50% 50%)` }}><Palco c={ant} e={ant.fim - ant.quadro} f={f} fps={fps} pose={{ x: 0, y: 0 }} /></AbsoluteFill>
          <div style={{ position: 'absolute', left: '50%', top: '50%', width: irisFecha * 1.5 * Math.hypot(W, H), height: irisFecha * 1.5 * Math.hypot(W, H),
            transform: 'translate(-50%, -50%)', borderRadius: '50%', border: `12px solid ${C.vermelho}` }} />
        </>
      )}
      {cortina && Array.from({ length: 8 }, (_, k) => {
        const p = rampa(e - k * 0.8, 10, 0, 1, E.sai);
        return <div key={k} style={{ position: 'absolute', top: 0, left: (k * W) / 8, width: W / 8 + 1, height: H, background: k % 2 ? C.vermelho : C.tinta,
          transform: `translateY(${(k % 2 ? -1 : 1) * p * H}px)` }} />;
      })}
      {trecho && c.celTela && (
        <CelularVivo de={trecho.de} ate={trecho.ate} f={f} fps={fps} atual={c.celTela} e={e}
          anterior={ant?.celTela && ant.quadro >= trecho.de ? ant.celTela : undefined} />
      )}
      {titulo && <CamadaTitulo t={titulo} f={f} fps={fps} />}
      {flash > 0.01 && <AbsoluteFill style={{ background: C.branco, opacity: flash }} />}
    </AbsoluteFill>
  );
};
