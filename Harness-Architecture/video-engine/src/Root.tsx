import React from 'react';
import { Composition, getStaticFiles } from 'remotion';
import { FluxoVideo, ABERTURA_FRIA, FPS, type Dados } from './MotorV6';
import exemplo from './gerado/exemplo.json';
import { BatidaVideo, type DadosBatida } from './BatidaCorte';

// Um vídeo por roteiro. Para incluir outro: roteiros/<id>.json → narrar → preparar → importar aqui e pôr na lista.
const VIDEOS: Dados[] = [exemplo as Dados];
// Vídeo de corte por batida: a música manda no tempo, não a narração. Os dados e as mídias vêm de uma pasta de projeto
// fora do motor (--props e --public-dir, ver scripts/render-batidas.mjs); sem eles, a composição fica com 1 quadro.
// As props SÃO o dados.json do projeto (--props aponta para ele); sem ele, a composição fica vazia.
const SEM_DADOS: Partial<DadosBatida> = {};
const BatidaOuVazio: React.FC<Partial<DadosBatida>> = (p) => (p.cortes ? <BatidaVideo dados={p as DadosBatida} /> : null);
const temMusica = (id: string) => getStaticFiles().some((f) => f.name === `musica/${id}.wav`);
const props = (d: Dados) => ({ dados: d, musica: temMusica(d.id) ? `musica/${d.id}.wav` : undefined });

export const Root: React.FC = () => (
  <>
    {/* a abertura fria entra antes do vídeo, por isso os 33 quadros a mais */}
    {VIDEOS.map((d) => (
      <Composition key={d.id} id={d.id} component={FluxoVideo} fps={FPS} width={1920} height={1080}
        durationInFrames={Math.ceil(d.duracaoTotal * FPS) + ABERTURA_FRIA} defaultProps={props(d)} />
    ))}
    <Composition id="batidas" component={BatidaOuVazio}
      fps={60} width={1920} height={1080} durationInFrames={1} defaultProps={SEM_DADOS}
      calculateMetadata={({ props }) => {
        const d = props as Partial<DadosBatida>;
        return d.cortes ? { durationInFrames: d.duracaoQuadros, fps: d.fps, width: d.largura, height: d.altura } : {};
      }} />
  </>
);
