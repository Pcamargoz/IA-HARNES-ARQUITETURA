---
title: "Motor v6: sem engasgos (medição e correções)"
type: reference
status: reference
updated: 2026-10-26
tags:
  - hermes
  - video-engine
  - v6
related:
  - "[[Knowledge/video-engine/README]]"
---

> Importado do Harness-Arquitetura-Flow (Faktory Flow) em 2026-10-26. Referência histórica do motor; o código genérico está em `video-engine/`. Índice: [[Knowledge/video-engine/README]].

# Motor v6: sem engasgos

O v6 (`videos/src/FluxoVideoV6.tsx` no repositório do Guia) é o v5 com os travamentos e cortes errados corrigidos. O pedido veio do responsável em 24/10/2026, a partir do vídeo `consultor-04-estoque` em 1:45: "tem algumas partes dos videos que esta travando o video, alguns cortes errados". Nenhum vídeo foi refeito; o v6 foi testado em trechos renderizados só para teste.

## Como medimos

`scripts/engasgos.mjs` (novo) mede a mudança entre quadros seguidos com o `scene score` do ffmpeg, numa cópia reduzida e sem a faixa da legenda, e aponta três defeitos, cada um com o trecho do roteiro:

| Defeito | Critério | O que a pessoa vê |
|---|---|---|
| parada | mudança ~0 por 1 s ou mais | a imagem trava enquanto a voz continua |
| repete | um quadro igual ao anterior com movimento dos dois lados | o movimento engasga |
| pop | salto isolado, 8 vezes acima da vizinhança | algo aparece ou some de um quadro para o outro (corte errado) |

Uso: `node scripts/engasgos.mjs <id> [<mp4>] [--inicio <s>]`. Para testar o motor sem refazer o vídeo: `node scripts/remotion-em-partes.mjs <id> out/teste.mp4 --de <s> --ate <s>` (só o trecho, sem som) e o detector com `--inicio`.

## O que os vídeos publicados (v4) têm

| Vídeo | Tempo parado | Quadros repetidos | Pops |
|---|---|---|---|
| fluxo-1-vendas | 87,7 s em 2:54 | 8 | 9 |
| consultor-01-suprimentos | 96,0 s em 3:07 | 9 | 28 |
| consultor-02-servicos | 80,9 s em 2:36 | 5 | 26 |
| consultor-03-comercial | 106,9 s em 3:24 | 11 | 71 |
| consultor-04-estoque | 90,3 s em 2:49 | 3 | 30 |
| consultor-05-producao | 89,8 s em 2:36 | 1 | 8 |
| consultor-06-expedicao | 81,7 s em 2:30 | 3 | 19 |
| consultor-07-faturamento | 84,2 s em 3:02 | 12 | 55 |
| consultor-08-financeiro | 91,2 s em 2:50 | 3 | 16 |
| consultor-09-projetos | 75,0 s em 2:15 | 5 | 13 |
| consultor-10-tarefas | 71,7 s em 2:22 | 3 | 19 |
| consultor-fluxo-completo | 67,1 s em 2:24 | 6 | 13 |

O travamento de 1:45 no Estoque: de 1:42 a 1:44 a tela fica parada (a câmera terminou os focos e a voz ainda falava), depois vem o whip. Logo depois, a lupa troca de lado a cada poucos quadros e o escurecimento some num quadro.

## Causas e correções

| # | Causa (no v4 e no v5) | Correção no v6 | Fonte |
|---|---|---|---|
| 1 | A lupa escolhia o lado pela posição do campo **com a câmera**, que deriva: perto do meio da tela, trocava de lado a cada poucos quadros | Lado fixo por foco, pela posição do campo no print | medição + código |
| 2 | Escurecimento, cantos, círculo e lupa do foco só tinham rampa de saída no fim da fala, e a rampa terminava 6 quadros **depois** da troca de foco: 60% do escurecimento sumia num quadro | Tudo sai numa rampa de 11 quadros que termina antes da troca de foco | medição + código |
| 3 | A lupa só aparecia com a janela reta (`|rotZ| < 0,3`) e a inclinação ligava num degrau: a lupa piscava | A lupa não depende da inclinação; a inclinação entra em rampa | código |
| 4 | O avanço lento da câmera voltava a 1 num quadro no começo do voo seguinte | O avanço continua de onde estava durante o voo | código |
| 5 | Tempo morto: depois de chegar ao foco a câmera parava; cartões de regra, status e cuidados ficavam parados enquanto a voz corria | **Câmera viva**: toda cena avança 0,6% por segundo (até 6%) e flutua alguns pixels num ruído contínuo; o foco ganha 1,2% por segundo (até 3%); o cursor passeia até 9 px. A âncora da íris e o retângulo do portal levam a câmera viva em conta | motionmaxxing `references/motion.md` R1.12 (nada morto; Apache-2.0); video-shotcraft `cursor-flyover` (Apache-2.0) |
| 6 | O crash zoom do impacto era cortado quando a fatia do foco era curta (zoom de até 1,38x voltava a 1 num quadro) | A segurada encurta para a volta terminar 4 quadros antes da troca de foco | subagente, dedução do código |
| 7 | A porta de letra cobria a regra num quadro só (corte seco): a camada de papel que esconde a cena anterior nas passagens entrava opaca, porque a porta tem duração 0 na tabela de passagens | Sem essa camada na porta; o papel da própria porta sobe do rodapé em 8 quadros | medição |
| 8 | Marca e pílula do capítulo ligavam e desligavam num quadro | Rampas de 8 quadros | subagente |
| 9 | A legenda podia pular de baixo para cima no meio da frase | Posição fixa por frase | subagente |
| 10 | A saída de uma cena usava segundos e a entrada da seguinte usava quadros arredondados: até 1 quadro fora, o que faz o whip piscar | Saída calculada em quadros inteiros | subagente |
| 11 | O pré-som das passagens (o swoosh cresce antes do pico) era cortado no começo da cena: o som entrava seco no corte | Sons das passagens em tempo do vídeo, fora da cena | lemo-opuscar `DIRECTOR.md` §6 (J-cut, MIT) |
| 12 | A lupa usava `background-image`, que o Remotion não espera carregar | `<Img>` dentro da lupa | remotion.dev/docs/flickering |
| 13 | O flash do impacto ligava e desligava em 3 quadros e parecia um corte errado; a volta do crash zoom durava 18 quadros | Flash que decai em 8 quadros; volta em 24 | medição |

Conferido e sem problema: a emenda dos blocos de 450 quadros (o trecho de teste tem exatamente os quadros pedidos e nada muda na emenda de 1:45).

## Resultado medido (trechos de teste, sem refazer os vídeos)

| Trecho | Motor | Tempo parado | Quadros repetidos | Pops |
|---|---|---|---|---|
| Estoque 0:12–1:00 (status e regras) | v4 publicado | 30,8 s de 48 s (cartões parados de 1,4 a 6 s) | 0 | 0 |
| | **v6** | **0 s** | 1 | 1 (o slam da regra crítica, planejado) |
| Estoque 1:28–1:58 (porta de letra e telas; inclui o travamento de 1:45) | v4 publicado | 5,3 s | 2 | 25 |
| | **v6** | **0 s** | 1 | 1 leve (0,04, o mergulho da porta de letra) |
| Comercial 0:33–1:06 (íris e pilha entre regras) | **v6** | **0 s** | 1 | 0 |
| Comercial 1:39–2:07 (porta, whip e impacto) | **v6** | **0 s** | 0 | 1 leve (0,04) |

No vídeo inteiro (v4 publicado), o mesmo detector com a legenda fora da medida acusa 98 s de imagem parada no Estoque e 118 s no Comercial.

## Captura de telas (Playwright)

`scripts/gravar-telas.mjs` ganhou `mascarar` (o `mask` do Playwright pinta o dado pessoal já no print) e `caret: 'hide'` (o cursor de texto não aparece nos campos). Vale para as próximas gravações; as telas atuais não mudam.

## Repositórios novos pedidos pelo responsável (24/10/2026)

| Repositório | Licença | Para nós | Decisão |
|---|---|---|---|
| [microsoft/playwright](https://github.com/microsoft/playwright) | Apache-2.0 | Já é o gravador de telas (`playwright-core` 1.56.1). Úteis agora: `mask`/`maskColor`, `caret: 'hide'`; depois: `page.clock` (fixar datas nas telas) e o trace para depurar capturas. `recordVideo` não serve (qualidade baixa) | Adotado no v6 (mask e caret) |
| [firecrawl/firecrawl](https://github.com/firecrawl/firecrawl) | AGPL-3.0 | Raspa sites para markdown (scrape, crawl, map), roda em casa por Docker. Serviria para coletar documentação e referências | Não precisa no v6; se usar, só como ferramenta, sem incorporar código (AGPL) |
| [perplexityai](https://github.com/perplexityai) | MIT (servidor MCP `modelcontextprotocol`) | Pesquisa na web pelo MCP oficial; pede chave paga e manda as perguntas para a nuvem | Depois, opcional, e só com conteúdo neutro (regra 3 do motor) |
| [FFmpeg/FFmpeg](https://github.com/FFmpeg/FFmpeg) | LGPL/GPL | Já faz parte da linha de produção como programa instalado: junta os blocos, normaliza o volume (−14 LUFS), checa pretos, silêncio e pico (`qa.mjs`) e mede os engasgos (`engasgos.mjs`) | Já em uso |

## Refação dos 12 vídeos (24 e 25/10/2026)

Pedido do responsável com o documento "Melhorias vídeos fluxo checklist consultor" (cards bugados com minuto a minuto, voz feminina, ritmo mais lento, ajustes de texto). O que foi feito:

| Item do documento | O que era | O que foi feito |
|---|---|---|
| Cards bugados (todos os vídeos, minutos citados) | Quase todos caem exatamente nos pops medidos: a lupa trocando de lado e o escurecimento sumindo num quadro (itens 1 a 3 acima). Suprimentos 1:39: a lupa ampliava um menu que o print cortou na borda | Motor v6; lupa desligada em campo encostado na borda do print |
| Voz feminina | O responsável ouviu 16 vozes femininas (8 no OmniVoice, 8 no VoxCPM2) e preferiu manter a voz L | Voz L mantida, clonada da mesma amostra |
| Ritmo mais lento | — | Velocidade da voz 0,95 → 0,9; pausa entre frases 0,28 → 0,5 s; respiro entre trechos 0,55 → 0,9 s. Os vídeos ficaram de 2:27 a 3:40 |
| Financeiro, regra 03 | "nasce um título novo com o saldo" | "…com o saldo remanescente" (fala e cartão) |
| Produção: apontamento de OP com erro de data futura | Dito como "limitação conhecida" | Dito como defeito já reportado, com o contorno (fonte `faq-limitacoes-conhecidas-v1-22-12`, PRO-1) |
| Tarefas: Ctrl+K não acha o módulo | Ensinado como cuidado, como se fosse o normal | Dito como defeito já reportado (a Ane confirmou que é bug), com o contorno pelo menu. Em 25/10/2026, a pedido do responsável, a base passou a descrever como defeito (`faq-limitacoes-conhecidas-v1-22-12`, `funcional-tarefas-quadros-listas-e-cartoes`, `regra-tarefas-cartao-so-aparece-em-minhas-tarefas-com-responsavel`; item 5 da fila de correção) |
| Tarefas: áudio cortado em 0:59 | Frase da narração antiga | Narração refeita; conferência nova por transcrição (`scripts/conferir_narracao.py`) em toda narração |

Achados na própria refação, corrigidos antes da versão final:

| Defeito | Causa | Correção |
|---|---|---|
| Troca entre regras parecia corte seco (pop 0,97) | O empurrão de pilha movia ~286 px no primeiro quadro; entre a regra azul e a clara, um quarto da tela trocava de cor de uma vez | Curva com começo suave (pico de 135 px por quadro) |
| A tela anterior reaparecia por 2 quadros em Cuidados | O papel que esconde a cena anterior saía pela duração da passagem, antes de a cena anterior terminar | O papel sai no quadro exato em que a cena anterior acaba |
| "TELA" aparecia por cima do cartão da regra (cerca de 5 quadros) | Só o papel da porta de letra subia em cortina; as letras apareciam inteiras | Letras e rótulo dentro da mesma cortina, em 12 quadros com começo suave. **Está no motor, mas não nos vídeos publicados**: o responsável viu a comparação e decidiu manter a versão publicada sem renderizar de novo |
| Telas de foco único com 1 a 2 s quase paradas | O avanço no foco parava em 3% | Avanço de 1,5% por segundo até 8%; câmera viva até 10%. Nos vídeos publicados, só Estoque, Faturamento, Financeiro e Suprimentos têm essa correção |
| Narração parava a fila | O VoiceStudio abandona uma frase que passa de 300 s e, com a semente fixa, repetir travava de novo; reinstalar o VoiceStudio derrubava a fila | `narrar.mjs` espera o VoiceStudio voltar e repete a frase com a semente seguinte (até 3 vezes) |
| Conferência acusava números como corte | O Whisper escreve "R$ 75" e o roteiro fala "setenta e cinco reais" | Números fora da comparação |

### Vídeos publicados (25/10/2026), medidos com `engasgos.mjs`

Os pops contados incluem os planejados: o corte da abertura fria para o título (força 1 em todos) e o slam da regra crítica (≈0,54). Os trechos "para rever" da conferência foram ouvidos: são erros do Whisper ("fotografa o saldo", "almoxarifado", número da NF), não cortes.

| Vídeo | Duração | Imagem parada v4 → v6 | Quadros repetidos | Pops (com os planejados) |
|---|---|---|---|---|
| Fluxo 1 · Vendas | 3:08 | 87,7 s → 1,7 s | 6 | 10 |
| 01 Suprimentos | 3:23 | 96,0 s → 0 s | 8 | 11 |
| 02 Serviços | 2:48 | 80,9 s → 0 s | 14 | 11 |
| 03 Comercial | 3:40 | 106,9 s → 0 s | 8 | 11 |
| 04 Estoque | 3:03 | 90,3 s → 0 s | 7 | 10 |
| 05 Produção | 2:53 | 89,8 s → 1,1 s | 3 | 8 |
| 06 Expedição | 2:41 | 81,7 s → 1,6 s | 5 | 11 |
| 07 Faturamento | 3:18 | 84,2 s → 0 s | 6 | 12 |
| 08 Financeiro | 3:04 | 91,2 s → 1,1 s | 5 | 10 |
| 09 Projetos | 2:27 | 75,0 s → 0 s | 1 | 10 |
| 10 Tarefas | 2:38 | 71,7 s → 0 s | 1 | 10 |
| Fluxo completo | 2:37 | 67,1 s → 0 s | 9 | 11 |

Todos sem trechos pretos e com volume entre −13,9 e −14,2 LUFS. As paradas que sobraram (1,1 a 1,7 s) são telas com movimento lento de câmera e cursor, logo acima do limite do detector.

## Ainda não feito (próximas versões)

- Pôr cada foco na frase que cita o campo (`legendas` + `nomes`), mudando de foco só nas pausas entre frases (product-demo-director `docs/EDITING.md`, MIT).
- Cortar em movimento: terminar a cena no pico de velocidade e planejar os 6 últimos quadros de uma cena com os 6 primeiros da seguinte (motionmaxxing `transitions.md` R1.1 e R1.2).
- Renderizar os blocos em `h264-ts` e juntar com `combineChunks()` do Remotion, se algum dia a emenda falhar.
