---
title: Video Engine
type: guide
status: active
updated: 2026-10-26
tags:
  - hermes
  - video-engine
  - index
related:
  - "[[Knowledge/README]]"
  - "[[Knowledge/specialists]]"
  - "[[video-engine/README]]"
---

# Motor de vídeo v6

Motor que transforma um **roteiro em JSON** num vídeo explicativo 1920×1080 com narração, legenda karaokê, tipografia cinética, câmera em mola e efeitos sonoros. Feito em **Remotion 4 + React**. Extraído do Harness-Arquitetura-Flow / Guia do Consultor em 2026-10-26 e deixado **genérico**: serve para vídeo de qualquer assunto.

- **Código:** pasta `video-engine/` na raiz do vault. Como rodar: [[video-engine/README]].
- **O que não veio:** roteiros, telas, áudios e a voz clonada do Flow (são do cliente).

## Como um vídeo é montado

```
roteiros/<id>.json → narrar (VoiceStudio) → preparar → Remotion (MotorV6) → render → qa + engasgos
```

1. **Roteiro:** uma lista de trechos; cada trecho é uma cena com a fala.
2. **A voz manda no tempo:** narra primeiro, mede cada trecho e as cenas se ajustam à fala.
3. **Preparar** junta roteiro, tempos e capturas em `src/gerado/<id>.json`.
4. **Render** em blocos, versão final a −14 LUFS, legenda `.vtt` e capa.
5. **Checagens** automáticas antes de aprovar: [[Knowledge/video-engine/quality-metrics]].

## Cenas disponíveis

| Cena | Para quê | Campos principais |
|---|---|---|
| `abertura` | Título do vídeo | (usa `titulo`, `subtitulo`, `trilha`, `icone` do roteiro) |
| `status` | Linha de etapas de um processo | `tituloCena`, `etapas[]`, `destaque` |
| `regra` | Cartão de regra numerada | `n`, `titulo`, `texto`, `icone`, `fonte`, `critica` |
| `tela` | Print de sistema com zoom, cursor e lupa | `captura`, `focos[]`, `nomes[]`, `impacto`, `borrar[]` |
| `alertas` | Cuidados com carimbo | `itens[]` |
| `fechamento` | Resumo + próximo vídeo | `topicos[]` |

Ícones: `carrinho cfop caixa lapis nota alerta cadeado aberto check seta funil estrela caminhao fabrica tarefa obra estoque ferramenta compra`. As passagens entre cenas (íris, empurrão de pilha, porta de letra, whip, portal) são escolhidas sozinhas pelo par de cenas.

## Conhecimento importado

| Nota | O que tem |
|---|---|
| [[Knowledge/video-engine/quality-metrics]] | Todas as métricas: formato, ritmo, QA, engasgos e resultados |
| [[Knowledge/video-engine/production-principles]] | Princípios de produção e os primeiros repositórios estudados |
| [[Knowledge/video-engine/repositories-x-github]] | ~40 repositórios, skills e ferramentas do X e do GitHub, com licenças |
| [[Knowledge/video-engine/research-motion-skills-1]] · [[Knowledge/video-engine/research-motion-skills-2]] | Pacotes do Remotion, outras engines, skills, licença do Remotion |
| [[Knowledge/video-engine/research-mcps-production-1]] · [[Knowledge/video-engine/research-mcps-production-2]] | Voz, transcrição, música, captura de tela e checagem automática |
| [[Knowledge/video-engine/spec-v5-editing-bible-1]] · [[Knowledge/video-engine/spec-v5-editing-bible-2]] · [[Knowledge/video-engine/spec-v5-editing-bible-3]] · [[Knowledge/video-engine/spec-v5-editing-bible-4]] · [[Knowledge/video-engine/spec-v5-editing-bible-5]] | Bíblia de edição: 19 efeitos com parâmetros, receitas de som, transições |
| [[Knowledge/video-engine/v6-no-stutters]] | Como os engasgos foram medidos e corrigidos no v6 |
| [[Knowledge/video-engine/video-rules]] | Regras de roteiro e produção dos vídeos de fluxo |
| [[Knowledge/video-engine/pending-improvements]] | O que ainda dá para melhorar no motor |

## Regras que valem para qualquer vídeo

1. **Licença:** nenhum modelo, som ou imagem entra sem conferir a licença dos **pesos e arquivos**, não só do código. O Remotion pede licença paga para empresas com 4 ou mais pessoas.
2. **Dados sensíveis:** nada de cliente ou dado pessoal no vídeo; use `borrar` nas telas.
3. **Prévia antes da fila:** mudança visual grande passa por prévia aprovada antes de renderizar vários vídeos.
