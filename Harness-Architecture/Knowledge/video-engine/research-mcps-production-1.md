---
title: "Pesquisa: MCPs e linha de produção (1/2)"
type: reference
status: reference
updated: 2026-10-26
tags:
  - hermes
  - video-engine
  - research
related:
  - "[[Knowledge/video-engine/README]]"
---

> Importado do Harness-Arquitetura-Flow (Faktory Flow) em 2026-10-26. Referência histórica do motor; o código genérico está em `video-engine/`. Índice: [[Knowledge/video-engine/README]]. Parte 1 de 2; próxima: [[Knowledge/video-engine/research-mcps-production-2]].

# Pesquisa: MCPs e ferramentas de produção para o motor de vídeo

**Data:** 2026-10-23
**Escopo:** ferramentas de voz, áudio, música, captura de tela, design, checagem de qualidade e publicação para os vídeos institucionais e de produto (B2B, ERP Faktory Flow). Motion design, repositórios de animação e skills ficam em `pesquisa-motion-e-skills.md`, nesta mesma pasta.
**Máquina de referência:** Windows 11, RTX 3050 8 GB, 15,6 GB de RAM. Motor atual: Remotion 4, narração no VoiceStudio (motor OmniVoice, MCP em `localhost:3900/mcp`), música e efeitos sintetizados em Python, legenda frase a frase gerada do roteiro, mixagem no ffmpeg a −14 LUFS, prints feitos com Playwright e base de conhecimento no MCP `faktory-doc`.

---

## Como pesquisamos

- **Só leitura.** Nada foi instalado, clonado para execução nem rodado.
- **Fontes consultadas:**
  - API do GitHub (licença declarada, estrelas, arquivamento, último push), até bater no limite de requisições sem login;
  - READMEs e arquivos `LICENSE` brutos (raw.githubusercontent.com);
  - API e model cards do Hugging Face (licença dos **pesos**, idiomas declarados);
  - o registro oficial de MCP (`registry.modelcontextprotocol.io/v0/servers?search=…`, com buscas por ffmpeg, whisper, transcri, tts, speech, voice, audio, music, video, subtitle, playwright, screenshot, figma, ocr e loudness);
  - a lista `punkpeye/awesome-mcp-servers`;
  - documentação oficial (Remotion, Playwright, Figma, Stability AI);
  - a documentação do próprio VoiceStudio (`docs/engines`, `docs/mcp.md`, `docs/benchmarks.md`).
- **Licença conferida em dois níveis:** a do **código** e a dos **pesos do modelo**. As duas costumam ser diferentes, e quem manda no uso comercial é a dos pesos.
- **Qualidade em pt-BR:** não achamos nenhum benchmark independente de TTS em pt-BR. Há arenas públicas para inglês, japonês, coreano, árabe e catalão, mas nenhuma para português. Os números de pt citados abaixo são **do próprio fabricante** (VoxCPM2) ou só a declaração de suporte (Chatterbox). Antes de adotar qualquer voz, fazer um teste cego interno (ver adoção 2).
- **O que o registro oficial de MCP mostrou:** a grande maioria dos servidores de mídia é **serviço hospedado e pago** (ffmpeg-api, ffmpeg-micro, TTS pagos, transcrição na nuvem). Opções locais existem, mas são pequenas: whisper-mcp, local-whisper-mcp, whisper-transcribe-mcp e alguns ffmpeg-mcp. Não há MCP de loudness.
- **Pontos que não deu para confirmar** estão marcados como *(conferir)*.

**Legenda das colunas:** "Envia dados?" diz se texto, áudio ou imagem saem da máquina. **💲** = exige chave, assinatura ou plano pago.

---

## Achados críticos (antes de qualquer melhoria)

1. **Os pesos do OmniVoice, a voz que usamos hoje, são CC-BY-NC.** O model card `k2-fsa/OmniVoice` diz: "Our code is released under the Apache 2.0 License. The pre-trained model is licensed under the CC-BY-NC". O motivo são os dados de treino (Emilia). O próprio VoiceStudio é AGPL-3.0 e avisa que "model weights… and generated-output conditions are separate". **Na leitura literal, a narração atual não pode ser usada em vídeo comercial da Faktory.** Vale submeter ao jurídico, mas o caminho seguro é trocar o motor (adoção 1). Vídeo institucional e de produto de uma empresa conta como uso comercial.
2. **A licença do Remotion exige a "Company License" para empresas com mais de 3 funcionários.** Pelo `LICENSE.md` oficial, o uso gratuito vale para pessoa física, empresa com até 3 funcionários, ONG ou avaliação. O plano "Remotion for Creators" custa **US$ 25 por mês por usuário** (remotion.pro/license), o que inclui uso local com agentes e o Remotion Studio. O Remotion 5 vai mudar a licença "levemente" (PR 3750). Se a Faktory tem mais de 3 funcionários, **é preciso regularizar**.
3. Também não servem para uso comercial: **F5-TTS** (pesos CC-BY-NC, inclusive o fine-tune pt-BR `firstpixel/F5-TTS-pt-br`), **XTTS-v2** (CPML não comercial; a Coqui fechou e não vende licença), **MusicGen** (pesos CC-BY-NC), a variante GGUF do OmniVoice (CC-BY-NC) e o **jianying-headless** (licença pessoal não comercial).

---

## Tabela

### Voz (TTS)

| Nome / link | Licença (código / pesos) | O que faz | Requisitos | Envia dados? | Veredito |
|---|---|---|---|---|---|
| **VoxCPM2** — github.com/OpenBMB/VoxCPM · hf.co/openbmb/VoxCPM2 | Apache-2.0 / **Apache-2.0** ("free for commercial use") | TTS de 2B, 30 idiomas (inclui português), saída em 48 kHz, clonagem controlável, "voice design" por descrição, ajuste fino LoRA com 5–10 min de áudio. **Já é um motor do VoiceStudio** (`pip install "voxcpm>=2.0.3"`) | **cerca de 8 GB de VRAM** (card); RTF 0,30 numa RTX 4090. Na 3050 de 8 GB fica no limite | Não | **Usar agora** (candidato a voz principal) |
| **Chatterbox Multilingual V3 + pacote pt-BR** — github.com/resemble-ai/chatterbox · hf.co/ResembleAI/Chatterbox-Multilingual-pt-br | MIT / **MIT** | TTS de 0,5B com **fine-tune dedicado a pt-BR** (separado do pt-PT), clonagem e controle de expressão. Todo áudio sai com a marca d'água inaudível Perth, da Resemble | 0,5B; estimativa de 3–5 GB de VRAM *(conferir)* | Não | **Usar agora** (candidato a voz principal; rodar fora do VoiceStudio ou pedir integração) |
| OmniVoice (motor atual) — hf.co/k2-fsa/OmniVoice | Apache-2.0 / **CC-BY-NC** | TTS de mais de 600 idiomas, zero-shot | GPU | Não | **Não serve para uso comercial**: trocar (ver achado 1) |
| Kokoro-82M — github.com/hexgrad/kokoro | Apache-2.0 / Apache-2.0 | TTS leve; pt-BR com 3 vozes (`pf_dora`, `pm_alex`, `pm_santa`) | CPU ou menos de 2 GB | Não | Usar depois, como reserva rápida. O VOICES.md avisa que o suporte a idiomas fora do inglês "may be absent or thin" |
| kokoro-tts-mcp — github.com/mberg/kokoro-tts-mcp | Apache-2.0 | MCP do Kokoro; upload para S3 opcional | local | Só se ligar o S3 | Só se o Kokoro for adotado |
| MOSS-TTS (8B) — hf.co/OpenMOSS-Team/MOSS-TTS | Apache-2.0 / Apache-2.0 (pt declarado) | TTS grande com clonagem; tem motor no VoiceStudio | **8B**: não cabe com folga em 8 GB | Não | Não serve neste hardware |
| PocketTTS (Kyutai) — hf.co/kyutai/pocket-tts | CC-BY-4.0 (pt declarado) | TTS leve em CPU, com clonagem; motor no VoiceStudio | CPU | Não | Usar depois. É comercial, **com atribuição obrigatória** |
| Supertonic-3 — hf.co/Supertone/supertonic-3 | OpenRAIL (pt declarado) | TTS em CPU, 7 vozes prontas | CPU | Não | Usar depois. OpenRAIL tem restrições de uso; ler antes |
| CosyVoice 3 — hf.co/FunAudioLLM/Fun-CosyVoice3-0.5B-2512 | Apache-2.0 | TTS de 9 idiomas, **sem português** | GPU | Não | Não serve |
| Fish Speech / OpenAudio S2 — github.com/fishaudio/fish-speech | Fish Audio Community License (13/10/2026) | TTS forte em pt (no teste do fabricante VoxCPM, o melhor WER em pt) | 8 GB ou mais | Não | Não serve agora. O uso comercial é gratuito só abaixo de um teto de receita anual; precisa do jurídico |
| F5-TTS (+ `firstpixel/F5-TTS-pt-br`) — github.com/SWivid/F5-TTS | MIT / **CC-BY-NC-4.0** | TTS com clonagem; existe fine-tune pt-BR | 6–8 GB | Não | **Não serve** |
| XTTS-v2 — github.com/idiap/coqui-ai-TTS | MPL-2.0 / **CPML não comercial** | TTS multilíngue com pt | 4–6 GB | Não | **Não serve** |
| Piper — github.com/OHF-Voice/piper1-gpl | GPL-3.0 (o rhasspy/piper MIT foi arquivado) | TTS leve; vozes pt_BR de qualidade robótica | CPU | Não | Não serve (qualidade) |
| ElevenLabs MCP hospedado — api.elevenlabs.io/v1/mcp (o repositório local `elevenlabs/elevenlabs-mcp`, MIT, foi **arquivado**) | proprietário 💲 | TTS de topo; no teste do fabricante VoxCPM, o pt da ElevenLabs teve WER 1,33 contra 1,94 do VoxCPM2 | nuvem | **Sim** (roteiro e voz) | Usar depois, só em peça premium, com roteiro sem dado sensível |
| Azure Speech / Google Chirp 3 HD (vozes neurais pt-BR) | proprietário 💲 | TTS na nuvem com vozes pt-BR prontas | nuvem | **Sim** | Usar depois, como plano B corporativo *(conferir preço)* |

**Números de pt publicados pelo fabricante do VoxCPM2** (README do OpenBMB/VoxCPM, teste "MiniMax Multilingual"; não é independente):

| Português | Minimax | ElevenLabs | Qwen3-TTS | FishAudio S2 | VoxCPM2 |
|---|---|---|---|---|---|
| WER (menor é melhor) | 1,877 | 1,331 | 1,526 | **1,140** | 1,938 |
| Similaridade de voz (maior é melhor) | 80,5 | 71,1 | 81,7 | 78,1 | **83,7** |

Em outro teste do mesmo README, o WER em pt foi de 1,48% para o VoxCPM2 contra 1,49% para o Fish S2-Pro. **Leitura:** o VoxCPM2 clona bem o timbre e erra um pouco mais as palavras. Por isso a checagem de pronúncia da adoção 3 é obrigatória.

### Transcrição, alinhamento e áudio

| Nome / link | Licença | O que faz | Requisitos | Envia dados? | Veredito |
|---|---|---|---|---|---|
| **WhisperX** — github.com/m-bain/whisperX | BSD-2-Clause; o alinhador pt `jonatasgrosman/wav2vec2-large-xlsr-53-portuguese` é Apache-2.0 | Transcrição com **tempo por palavra** (alinhamento wav2vec2). **Já vem instalado no VoiceStudio** como motor de STT | GPU; large-v3 em int8 ou turbo cabe em 8 GB | Não | **Usar agora** |
| faster-whisper — github.com/SYSTRAN/faster-whisper | MIT | Whisper 4× mais rápido, base do WhisperX | 2–5 GB | Não | Usar agora, via WhisperX |
| Transcrição do VoiceStudio (MCP `transcribe`; HTTP `POST :3900/v1/audio/transcriptions`, compatível com OpenAI) | AGPL-3.0 (app) | O MCP devolve texto; o endpoint HTTP imita a API da OpenAI | local | Não | Usar agora para checar o texto. O tempo por palavra pelo endpoint está *(conferir)* |
| @remotion/install-whisper-cpp + @remotion/captions — remotion.dev/docs/install-whisper-cpp | Licença Remotion | whisper.cpp com tempo por token dentro do ecossistema Remotion; gera legendas estilo "TikTok" | CPU/GPU | Não | Usar depois. O alinhamento do WhisperX é melhor em pt |
| whisper-mcp (jwulff), local-whisper-mcp (OrihuelaConde), whisper-transcribe-mcp (ZahiriNatZuke), whisper-windows-mcp (eviscerations) | MIT (o último é MIT dupla) | MCPs locais de transcrição | local | Não | Não serve: duplica o que o VoiceStudio já tem |
| Filtros do ffmpeg: `loudnorm` (duas passadas), `ebur128`, `silencedetect`, `astats` | LGPL/GPL | Normaliza e mede LUFS e true peak, acha silêncio | CPU | Não | **Usar agora** (já é a base da mixagem) |
| pyloudnorm — github.com/csteinmetz1/pyloudnorm | MIT | Medidor BS.1770-4 em Python, para testes automáticos | CPU | Não | Usar agora, no QA |
| ffmpeg-mcp (video-creator, PedroMarianoAlmeida, Ashutos1997) | MIT | Cortar, juntar e converter por conversa | ffmpeg | Não | Não serve. O ffmpeg direto por script é mais auditável |
| ffmpeg-api, ffmpeg-micro, ihateaudio, audiopod (registro oficial) | proprietários 💲 | ffmpeg e separação na nuvem | nuvem | **Sim** | Não serve |
| Demucs — github.com/facebookresearch/demucs | MIT (arquivado) | Separa voz de música | GPU 4 GB | Não | Não serve (voz e música já nascem separadas) |
| DeepFilterNet — github.com/Rikorose/DeepFilterNet | MIT/Apache | Remove ruído | CPU | Não | Usar depois, só se entrar narração gravada com microfone |

### Música e efeitos

| Nome / link | Licença | O que faz | Requisitos | Envia dados? | Veredito |
|---|---|---|---|---|---|
| **ACE-Step 1.5** — hf.co/ACE-Step/Ace-Step1.5 | **MIT**; o card diz que o treino usou música licenciada e royalty-free e que a saída pode ser usada comercialmente | Gera música completa ou instrumental, de loops curtos até 10 min, com edição (repaint, instrumental a partir de voz) | **menos de 4 GB de VRAM** (card) | Não | **Usar agora**, com registro de prompt e seed |
| ACE-Step v1 (3,5B) — github.com/ace-step/ACE-Step | Apache-2.0 | Versão anterior | cerca de 8 GB | Não | Substituído pela 1.5 |
| Stable Audio Open (1.0 / small) — hf.co/stabilityai | Stability Community License | Efeitos e trechos de até cerca de 47 s | cerca de 8 GB (1.0); o small é menor | Não, mas o download pede login no HF | Usar depois. É grátis só para quem fatura **menos de US$ 1 milhão por ano**; acima disso, licença paga |
| MusicGen — github.com/facebookresearch/audiocraft | MIT / **CC-BY-NC-4.0** | Gera música | 8–16 GB | Não | **Não serve** |
| Pixabay Music/SFX — pixabay.com | Pixabay Content License *(conferir na página; ficou bloqueada durante a pesquisa)* | Biblioteca com uso comercial e sem atribuição | só para baixar | Só o download | Usar depois. Música pode ser reivindicada pelo Content ID do YouTube; guardar o comprovante |
| Freesound (filtro **CC0**) — freesound.org | CC0 por arquivo (outros arquivos são CC-BY ou CC-BY-NC) | Efeitos | só para baixar | Só o download | Usar depois, **só CC0** |
| Mubert, Arcalune, Kindlemusic (MCPs no registro) | proprietários 💲 | Música licenciada ou gerada na nuvem | nuvem | **Sim** | Não serve agora |

### Captura de tela e de interface

| Nome / link | Licença | O que faz | Requisitos | Envia dados? | Veredito |
|---|---|---|---|---|---|
| **Playwright MCP** — github.com/microsoft/playwright-mcp | Apache-2.0 | Navegador por MCP. `--snapshot-boxes` devolve a caixa (x,y,w,h) de cada elemento; screenshot com `scale:"device"` sai em resolução de dispositivo; `--viewport-size`; `browser_start_video` | local | Não | **Usar agora** |
| Playwright (biblioteca, já em uso) — `deviceScaleFactor: 2` | Apache-2.0 | Prints 3840×2160 com o layout de 1920×1080 | local | Não | **Usar agora** |
| Vídeo do Playwright (`recordVideo`) | Apache-2.0 | Grava webm; o padrão reduz para caber em 800×800 | local | Não | Não serve para tela final (resolução e bitrate baixos). Bom para rascunho de roteiro |
| Chrome DevTools MCP — github.com/ChromeDevTools/chrome-devtools-mcp | Apache-2.0 | Captura, emulação e performance via CDP | local | Não | Usar depois (duplica o Playwright) |
| OBS Studio — obsproject.com | GPL-2.0 | Grava a tela de verdade com NVENC na RTX 3050 | GPU NVENC | Não | Usar depois, para fluxos longos que precisem de vídeo real |
| Cap — github.com/CapSoftware/Cap | AGPL-3.0 (núcleo) + MIT (crates de captura) | Gravador com zoom automático, Windows | local; o compartilhamento em nuvem é opcional | Opcional | Usar depois, só no modo local |
| MCPs de screenshot hospedados (registro: screenshotscout, apiscreenshot…) | proprietários 💲 | Print de URL pública | nuvem | **Sim** | **Não serve**: o Flow é interno e tem dados de cliente |

### Design e marca

| Nome / link | Licença | O que faz | Requisitos | Envia dados? | Veredito |
|---|---|---|---|---|---|
| Figma MCP oficial (remoto) — developers.figma.com/docs/figma-mcp-server | proprietário; o remoto funciona em todos os planos, inclusive Starter, com limite de uso; o servidor desktop pede assento Dev ou Full em plano pago; escrever no canvas fora dos rascunhos pede assento Full | Lê variáveis de cor e tipografia (`get_variable_defs`) e o contexto do design. **Já aparece conectado nesta sessão** | nuvem | **Sim** (os arquivos do Figma) | Usar depois, se a marca Faktory estiver em Figma |
| Figma-Context-MCP — github.com/GLips/Figma-Context-MCP | MIT, mas usa token Figma 💲 | Layout do Figma para o agente | nuvem | **Sim** | Alternativa ao oficial |
| Adobe Leonardo — github.com/adobe/leonardo | Apache-2.0 | Gera paleta pelo **contraste-alvo** (WCAG), bom para derivar estados claro e escuro das cores da marca | Node | Não | Usar depois, para formalizar os tokens `C` do motor |
| Thumbnails com `renderStill` do Remotion | Licença Remotion | Thumbnail 1280×720 com o mesmo design system do vídeo | local | Não | **Usar agora** (em vez de MCPs de imagem) |
| MCPs de geração de imagem (Higgsfield, Figma generate_image, avots…) | proprietários 💲 | Imagem gerada por IA | nuvem | **Sim** | Não serve: risco de marca e de dados; o print real comunica melhor |

### Checagem de qualidade e publicação

| Nome / link | Licença | O que faz | Requisitos | Envia dados? | Veredito |
|---|---|---|---|---|---|
| ffmpeg `blackdetect`, `freezedetect`, `silencedetect`, `ebur128`, `signalstats` | LGPL/GPL | Quadro preto, imagem congelada, silêncio, loudness, nível de sinal | CPU | Não | **Usar agora** |
| **PaddleOCR (PP-OCRv6)** — github.com/PaddlePaddle/PaddleOCR | Apache-2.0 | OCR com um único modelo para 50 idiomas (46 de escrita latina, português incluso) | CPU, ou GPU opcional | Não | **Usar agora**, no QA de texto da tela |
| Tesseract — github.com/tesseract-ocr/tesseract | Apache-2.0 | OCR leve (`por`) | CPU | Não | Reserva do PaddleOCR |
| PySceneDetect — github.com/Breakthrough/PySceneDetect | BSD-3-Clause | Detecta cortes e cenas; serve para conferir se as transições caem onde o JSON manda | CPU | Não | Usar depois |
| mcp-video-analyzer — github.com/guimatheus92/mcp-video-analyzer | *(conferir)* | Transcrição, quadros-chave e OCR de MP4 | local | Não | Usar depois; um script próprio é mais controlável |
| Registro oficial de MCP — registry.modelcontextprotocol.io | — | Catálogo; em mídia, quase só serviços hospedados | — | — | Fonte de consulta, não ferramenta |

---

## Adoções recomendadas (em ordem de prioridade)

### 1. Trocar a voz para um motor com pesos comerciais (VoxCPM2 ou Chatterbox pt-BR)
- **Onde entra:** **voz**.
- **Ganho:**
  - Elimina o risco jurídico do achado 1.
  - O VoxCPM2 tem a melhor similaridade de timbre em pt no teste do fabricante, sai em 48 kHz e aceita ajuste fino LoRA com 5–10 min de áudio (base de uma voz própria da Faktory na v6).
  - O Chatterbox tem um modelo **dedicado a pt-BR** e é menor.
- **Custo:**
  - VoxCPM2: só ativar como motor no VoiceStudio (download de alguns GB); o MCP `localhost:3900/mcp` continua o mesmo.
  - Chatterbox: ambiente Python à parte ou pedido de integração.
  - Sem gasto em dinheiro.
- **Risco:**
  - O VoxCPM2 pede cerca de 8 GB e a placa tem 8 GB: rodar sozinho, nunca junto com render ou WhisperX. Se faltar memória, fica o Chatterbox.
  - Clonagem só de voz própria ou com autorização por escrito.
  - A marca d'água Perth do Chatterbox é inofensiva, mas deve ser registrada.
  - **Regularizar a licença do Remotion** (achado 2) na mesma rodada.

### 2. Teste cego de voz pt-BR com critério fixo
- **Onde entra:** **voz** (decisão da adoção 1).
- **Ganho:** a escolha passa a ter base, já que não existe benchmark independente de pt-BR. Comparar VoxCPM2, Chatterbox pt-BR, Kokoro `pm_alex` e, como teto de referência, uma amostra paga da ElevenLabs.
- **Como fazer:**
  - Mesmos 3 parágrafos de roteiro real, com siglas e termos do ERP (CFOP, NF-e, "Lib. Expedição", "Faturado").
  - Três ouvintes que não sabem qual é qual, nota de 1 a 5 para naturalidade, pronúncia e ritmo.
  - Mais o WER automático da adoção 3.
- **Custo:** uma tarde. A amostra da ElevenLabs pode exigir plano pago 💲 e envia o texto para fora (usar texto sem dado de cliente).
- **Risco:** baixo; se nenhuma voz local passar, a decisão vira "voz paga para peças de vitrine".

### 3. WhisperX para tempo por palavra e checagem de pronúncia
- **Onde entra:** **voz → animação** (legendas e cliques) e **checagem**.
- **Ganho:**
  - Legenda no tempo **medido** de cada palavra. Hoje o `cuesDe` distribui as frases pelo número de caracteres.
  - Destaque palavra a palavra.
  - Cliques e destaques presos à palavra-chave da fala ("clique em **Faturar**").
  - O texto transcrito, comparado com o roteiro, acusa palavra trocada, sílaba engolida ou sigla mal lida antes do render.
- **Custo:** um script no `preparar.mjs` ou em Python, gravando `legendas[]` e `palavras[]` no JSON. O WhisperX já está instalado no VoiceStudio; o alinhador pt é Apache-2.0.
- **Risco:**
  - Siglas podem ser transcritas errado: comparar com o roteiro e tolerar sinônimos de sigla.
  - Não ligar a diarização (pyannote é pesado e tem modelos com acesso restrito).

### 4. Captura em 2x com caixas automáticas (Playwright)
- **Onde entra:** **telas**.
- **Ganho:**
  - Prints em 3840×2160 (`deviceScaleFactor: 2`) deixam o zoom de 1,5 a 2,2× nítido; hoje o zoom amplia um PNG de 1920.
  - O `--snapshot-boxes` do Playwright MCP, ou o `boundingBox()` da biblioteca, preenche as `caixas` com as coordenadas reais do botão ou campo localizado pelo nome do glossário. Acaba a marcação manual e acaba a caixa fora do lugar.
- **Custo:** baixo. Configuração do Playwright, coordenadas convertidas de CSS px para px do print (×2), e o `<Img>` com 3840 de largura e escala-base 0,5.
- **Risco:**
  - Arquivos cerca de 4× maiores.
  - Dados de cliente: continuar com `borrar` e homologação.
  - O login é sempre feito pelo usuário.

### 5. QA automático do MP4 antes de entregar
- **Onde entra:** **checagem**.
- **Ganho:** um relatório de aprovação ou reprovação por vídeo:
  - `blackdetect` e `freezedetect` (quadro preto ou travado fora das pausas previstas);
  - `ebur128` e pyloudnorm (−14 LUFS ±1, true peak até −1 dBTP);
  - `silencedetect` (buraco na narração);
  - OCR (PaddleOCR) nos quadros das cenas "na tela", conferindo os nomes de tela e botão contra o `glossary_lookup` (regra 2 do CLAUDE.md);
  - checagem geométrica: a caixa da legenda não pode cobrir a caixa em foco (as duas estão no JSON);
  - texto da tela com no mínimo cerca de 3% da altura do quadro.
- **Custo:** um script de 200–300 linhas. Tudo local e grátis.
- **Risco:** falso positivo do OCR em fonte pequena; rodar o OCR no print 2x e no quadro renderizado, não no MP4 comprimido.

### 6. Trilha com ACE-Step 1.5
- **Onde entra:** **mixagem**.
- **Ganho:** música com instrumentação real, acima do sintetizado em Python, que soa "de jogo" e pouco institucional. Licença MIT, uso comercial declarado e menos de 4 GB de VRAM. Pode gerar uma família de trilhas da marca (a mesma progressão em versões de 60, 90 e 180 s).
- **Custo:**
  - Ambiente Python e download do modelo; gerar fora do horário de render.
  - Manter `musica/REGISTRO.md` com prompt, seed, versão e data de cada faixa.
- **Risco:**
  - Qualidade variável: escolher e masterizar na mão.
  - A declaração de dados "licenciados" é do fabricante; guardar o card na data do uso.
- **Reserva:** Pixabay ou Freesound CC0, guardando o comprovante de cada arquivo.

### 7. Publicação padronizada
- **Onde entra:** **publicação**.
- **Ganho:**
  - Thumbnail 1280×720 com `renderStill` no mesmo estilo do vídeo.
  - `.srt` exportado das `legendas[]`.
  - Capítulos do YouTube gerados de `CAPITULO` e dos `inicio` de cada trecho.
  - Uma versão "plate" (sem legenda, música e efeitos) com os áudios separados, para ajuste manual no CapCut (que importa SRT).
- **Custo:** baixo; é só ler o JSON que já existe.
- **Risco:** nenhum relevante.

---
