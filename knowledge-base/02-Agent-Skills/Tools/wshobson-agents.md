---
title: "wshobson/agents"
type: tool
category: agent-skills
status: top10
description: "Coleção grande de plugins para Claude Code — segundo o README, 94 plugins, 202 agentes, 185 skills e 105 comandos — organizados por domínio."
score: 78
verified_at: 2026-10-29
integration: "Marketplace de plugins do Claude Code (`/plugin marketplace add wshobson/agents`)"
license: "MIT"
repo: https://github.com/wshobson/agents
docs: "README do repositório"
stars: 41987
last_push: "2026-10-26"
last_release: "sem release publicada"
open_issues: 17
adoption: "avaliar seletivamente"
tags: [ai-agent-ecosystem, tool, skills, subagents, claude-code]
updated: 2026-10-29
---
# wshobson/agents

> Nota de ferramenta da [[Indice-AI-Agent-Ecosystem|KB AI-Agent-Ecosystem]]. Métricas coletadas da API do GitHub em 29/10/2026 (19h59–20h15 BRT). Status `top10` = classificação da pesquisa, **não** significa instalado.

| Campo | Valor |
|---|---|
| Nome | wshobson/agents |
| Categoria | `agent-skills` |
| Status na pesquisa | `top10` (nota 78/100) |
| Adoção no ambiente | avaliar seletivamente |
| Repositório oficial | https://github.com/wshobson/agents |
| Documentação oficial | README do repositório |
| Estrelas / issues abertas | 41987 / 17 |
| Último push / release | 2026-10-26 / sem release publicada |
| Licença | MIT |
| Verificado em | 2026-10-29 |

## Descrição
Coleção grande de plugins para Claude Code — segundo o README, 94 plugins, 202 agentes, 185 skills e 105 comandos — organizados por domínio.

## Problema que resolve
Ter subagentes especializados prontos (review, segurança, DevOps) sem escrever do zero.

## Casos de uso
- Copiar/adaptar definições de subagentes de revisão e segurança
- Inspiração para o mapa agente→skills do [[Skills para main agents/Índice das Skills|Índice das Skills]]

## Funcionalidades principais
- Plugins granulares por domínio
- Agentes com modelo sugerido por tarefa

## Requisitos
- Claude Code com plugins

## Compatibilidade
- Claude Code

## Limitações
- Cobertura específica para Java/Spring **não verificada**
- Instalar em massa infla o contexto com descrições de agentes

## Segurança
- Revisar cada plugin; instalar só o necessário

## Licença
MIT. Não é parecer jurídico; revisar antes de redistribuir ou embarcar em produto.

## Recomendações
- Instalar no máximo 1–2 plugins por vez, medindo /context antes e depois

## Integração com o Harness
Fonte de definições para os papéis de `Agents/roles.md` (Reviewer, Researcher).

## Exemplo de configuração
⚠️ **Não verificado neste ambiente** — extraído da documentação/README na pesquisa de 29/10/2026; nada foi instalado ou executado no Mac.

```text
/plugin marketplace add wshobson/agents
```

## Status
- Pesquisa: `top10` · nota 78 · verificado em 2026-10-29
- Ambiente do Pedro: avaliar seletivamente
- Próxima revisão: na próxima rodada de [[Research-History]] ou antes de qualquer adoção (via ADR).

## Relacionados
[[Superpowers]] · [[Skill-Catalog]] · [[Repository-Catalog]]

Ver também: [[wshobson-agents-orquestracao]] (ficha de orquestração, 29/10/2026).
