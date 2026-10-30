---
title: "Superpowers"
type: tool
category: agent-skills
status: top10
description: "Biblioteca de skills de processo para agentes de código (brainstorm, escrita de plano, execução por subagentes, TDD, depuração sistemática) que o agente aciona automaticamente."
score: 85
verified_at: 2026-10-29
integration: "Plugin do Claude Code (`/plugin install superpowers@claude-plugins-official`)"
license: "MIT"
repo: https://github.com/obra/superpowers
docs: "README do repositório"
stars: 308573
last_push: "2026-10-29"
last_release: "v7.0.1 (2026-10-21)"
open_issues: 372
adoption: "avaliar (E3)"
tags: [ai-agent-ecosystem, tool, skills, harness, workflow, claude-code]
updated: 2026-10-29
---
# Superpowers

> Nota de ferramenta da [[Indice-AI-Agent-Ecosystem|KB AI-Agent-Ecosystem]]. Métricas coletadas da API do GitHub em 29/10/2026 (19h59–20h15 BRT) e **reconferidas às 22h25–22h40 BRT** na revisão de skills. Status `top10` = classificação da pesquisa, **não** significa instalado.

| Campo | Valor |
|---|---|
| Nome | Superpowers |
| Categoria | `agent-skills` |
| Status na pesquisa | `top10` (nota 85/100) |
| Adoção no ambiente | avaliar (E3) |
| Repositório oficial | https://github.com/obra/superpowers |
| Documentação oficial | README do repositório |
| Estrelas / issues abertas | 308573 / 372 |
| Último push / release | 2026-10-29 (20:35 BRT) / v7.0.1 (2026-10-21), sem release nova |
| Licença | MIT |
| Verificado em | 2026-10-29 |

## Descrição
Biblioteca de skills de **processo** para agentes de código (brainstorm, escrita de plano, execução por subagentes, TDD, depuração sistemática) que o agente aciona automaticamente.

## Problema que resolve
Agentes pulam etapas (spec, plano, teste) e geram retrabalho; o Harness descreve o fluxo Understand→…→Record, mas não o *executa*.

## Casos de uso
- Executar o fluxo spec→plano→implementação com subagentes
- TDD disciplinado no back-end Java
- Depuração sistemática

## Funcionalidades principais
- Skills de processo acionadas por contexto
- Fluxo com subagentes
- Distribuído via marketplace oficial de plugins

## Requisitos
- Claude Code com suporte a plugins

## Compatibilidade
- Claude Code (nativo)
- Segundo o README (reconferido em 29/10, 22h30 BRT): Codex App/CLI (marketplace oficial da OpenAI), Cursor, Gemini CLI (extension), OpenCode (plugin JS próprio), **Qwen Code** (`qwen extensions install obra/superpowers`), Antigravity, Devin, Droid, Kimi e pi
- Hermes: fora do escopo do ecossistema do Pedro

## Limitações
- Muitas skills = mais metadados no contexto. São 15 SKILL.md, com ~730 tokens de frontmatter (estimativa chars/4)
- O hook SessionStart injeta o `using-superpowers` inteiro (~800 tokens) em toda sessão. O fluxo brainstorm→plano→execução gasta mais tokens por tarefa: ganha qualidade, não economiza
- Fluxo opinativo pode conflitar com o fluxo do Harness — precisa de mapeamento

## Segurança
- Skills executam comandos via ferramentas do agente: revisar antes de instalar
- Instalar pela fonte oficial
- Telemetria opt-out: o logo do visual companion (brainstorming) é carregado do site da Prime Radiant, com a versão. Desligar com `SUPERPOWERS_DISABLE_TELEMETRY`
- Hooks shell em toda sessão. A skill brainstorming sobe um servidor local (`server.cjs`)

## Licença
MIT. Não é parecer jurídico; revisar antes de redistribuir ou embarcar em produto.

## Recomendações
- Rodar o E3 ([[E3-Superpowers-QA-Frans]]) antes de adotar
- Mapear cada skill ao passo correspondente do `Process/workflow.md` do Harness

## Integração com o Harness
O `repositories-catalog.md` do Harness já cita o repositório. A proposta usa Superpowers como **motor** do fluxo do Main Agent, mantendo o contrato de `AGENTS.md` como fonte de verdade.

## Exemplo de configuração
⚠️ **Não verificado neste ambiente** — extraído da documentação/README na pesquisa de 29/10/2026; nada foi instalado ou executado no Mac.

```text
/plugin install superpowers@claude-plugins-official
```

## Status
- Pesquisa: `top10` · nota 85 · verificado em 2026-10-29
- Ambiente do Pedro: avaliar (E3)
- Próxima revisão: na próxima rodada de [[Research-History]] ou antes de qualquer adoção (via ADR).

## Relacionados
[[Anthropic-Skills]] · [[wshobson-agents]] · [[Addy-Agent-Skills]] · [[Skill-Catalog]] · [[E3-Superpowers-QA-Frans]] · [[Repository-Catalog]]
