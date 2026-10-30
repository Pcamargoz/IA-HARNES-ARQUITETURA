---
title: 'Maestri ("Maestria")'
type: runtime-architecture
runtime_component: maestri
status: proposed
category: runtime
updated: 2026-10-29
tags: [ai-agent-ecosystem, runtime, maestri]
---
# Maestri ("Maestria")

## O que é
App nativo de macOS da **Evercraft Labs**: um canvas infinito onde cada terminal é um nó. Cada terminal roda um agente (Claude Code, Codex, OpenCode ou shell). Ligando dois terminais com uma linha, um agente consegue mandar prompt para o outro pela CLI `maestri` (`ask`, `ask --batch`, `list`, `check`, `note`, `portal`), que fala com o app por um socket local injetado em cada terminal. Configuração em JSON e notas em Markdown, locais; sem conta. Fontes: https://themaestri.app/en, changelog https://www.themaestri.app/en/changelog e termos (atualizados em 12/10/2026), lidos em 29/10/2026.

## No Mac do Pedro (verificado em 29/10/2026)
- `/Applications/Maestri.app` versão **0.57.1**, rodando.
- CLI em `Maestri.app/Contents/Resources/maestri`; **só funciona dentro de um terminal do Maestri** (variável `MAESTRI_SOCKET`). Fora dele (este runtime, scripts, MCP) não há como chamar `maestri ask`.
- O site informa Apple Silicon e macOS 15.4+; o Mac do Pedro é Intel e o app está rodando. Funcionamento completo não foi testado.

## Como se encaixa
| Pergunta | Resposta |
|---|---|
| Substitui o runtime? | Não. Maestri coordena terminais interativos com o Pedro olhando; o runtime delega tarefas headless, medidas e reproduzíveis. |
| Pode ser um adapter? | Só como adapter que roda **dentro** de um terminal Maestri (proposta, [[Portability-Roadmap]]). Não implementado. |
| Uso recomendado agora | Pedro conduz sessões visuais no Maestri; os agentes ali dentro consultam a KB pelo MCP e seguem os mesmos protocolos ([[Cross-Agent-Communication]]). |
