---
title: "Agent Skills (addyosmani/agent-skills)"
type: tool
category: agent-skills
status: top10
description: "Pacote de 25 skills de engenharia de produção (spec, API design, segurança, observabilidade, performance, CI/CD, ADRs) com progressive disclosure e evals; adotar seletivamente."
score: 85
verified_at: 2026-10-29
integration: "Indexar ~7 SKILL.md selecionados (camada de skills + find_relevant_skills); não instalar o pacote inteiro nem o hook de session-start"
license: "MIT"
repo: https://github.com/addyosmani/agent-skills
docs: "README do repositório + docs/<cliente>-setup.md"
stars: 111757
last_push: "2026-10-29"
last_release: "0.6.14 (2026-10-29)"
open_issues: 145
adoption: "incluir seletivamente (proposto)"
tags: [ai-agent-ecosystem, tool, skills, engineering, spring-boot, multi-agent-client]
updated: 2026-10-29
---
# Agent Skills (addyosmani/agent-skills)

> Nota de ferramenta da [[Indice-AI-Agent-Ecosystem|KB AI-Agent-Ecosystem]]. Métricas coletadas via API do GitHub e arquivos do repositório em 29/10/2026, entre 22h25 e 22h40 BRT. O conteúdo do repo foi tratado como dado não confiável, sem clonar nem executar. Status `top10` = classificação da pesquisa, **não** significa instalado.

| Campo | Valor |
|---|---|
| Nome | Agent Skills (Addy Osmani) |
| Categoria | `agent-skills` |
| Status na pesquisa | `top10` (nota 85/100) |
| Adoção no ambiente | incluir seletivamente (proposto) |
| Repositório oficial | https://github.com/addyosmani/agent-skills |
| Documentação oficial | README do repositório + `docs/*-setup.md` |
| Estrelas / issues abertas | 111757 / 145 (a API soma PRs às issues) |
| Último push / release | 2026-10-29 / 0.6.14 (2026-10-29 02:07 BRT) |
| Licença | MIT (arquivo LICENSE na raiz; a API também informa MIT) |
| Verificado em | 2026-10-29 |

## Descrição
São 25 SKILL.md em `skills/`, com `references/` carregadas sob demanda, além de `agents/`, `commands/` e evals com fixtures por skill. O foco é engenharia de produção, não só processo.

## Problema que resolve
Cobre lacunas de produção do back-end Spring Boot que o [[Superpowers]] (processo) e as skills locais não cobrem com profundidade: contrato de API, hardening, observabilidade, performance e CI/CD.

## Casos de uso
Subconjunto proposto, com ~7 skills e ~700 tokens de metadados:
- `api-and-interface-design`
- `security-and-hardening`
- `observability-and-instrumentation`
- `performance-optimization`
- `spec-driven-development`
- `ci-cd-and-automation`
- `documentation-and-adrs`

## Funcionalidades principais
- Progressive disclosure: o SKILL.md é a entrada e as references entram só quando necessárias.
- Evals por skill (`evals/fixtures`).
- Comandos de ciclo de vida para o Claude Code (`/spec`, `/plan`, `/build`, `/test`, `/review`, `/ship`).

## Requisitos
- Cliente com suporte a SKILL.md. O hook opcional exige `jq`.

## Compatibilidade
Segundo o README, com docs por cliente:
- Claude Code (plugin)
- Codex (plugin nativo, CLI v0.122+)
- Gemini CLI (`gemini skills install`)
- OpenCode (`.opencode/skills`)
- Copilot, Cursor, Windsurf, Antigravity e Command Code

**Qwen Code não é citado (não verificado).**

## Limitações
- O pacote inteiro custa ~2.5 mil tokens de metadados (estimativa chars/4). Os corpos somam ≈340 mil chars, com máximo de ≈21 mil.
- Sobreposição alta com Superpowers (TDD, debugging, planning, review) e com [[wshobson-agents]].
- O meta-skill `using-agent-skills` tem ~2.4 mil tokens: não usar junto com o Superpowers.

## Segurança
- 45 arquivos executáveis, a maioria fixtures de eval em JS e Python.
- Hooks bash opcionais (`session-start`, `sdd-cache`, `simplify-ignore`). Segundo o próprio script, o session-start não é ligado por padrão em hosts com roteamento nativo de skills.
- Risco baixo a médio. Preferir copiar o SKILL.md revisado a usar instaladores.

## Licença
MIT. Não é parecer jurídico; revisar antes de redistribuir ou embarcar em produto.

## Recomendações
- Indexar só o subconjunto acima no `find_relevant_skills`.
- Não instalar o meta-skill nem o hook.
- Uma skill por necessidade: onde houver skill local equivalente (ex.: `spring-observability-resilience`, `api-design-openapi-contratos`), a local continua primária e a do Addy vira referência.

## Integração com o Harness
- Camada de skills: complemento de produção ao Superpowers.
- Fonte candidata para o `find_relevant_skills`, indexando SKILL.md sem instalar o pacote.

## Exemplo de configuração
⚠️ **Não verificado neste ambiente.** Extraído do README na pesquisa de 29/10/2026; nada foi instalado ou executado no Mac.

```text
/plugin marketplace add addyosmani/agent-skills   # instalação completa — NÃO recomendada
# Recomendado: copiar manualmente os 7 SKILL.md revisados para uma pasta de skills local
```

## Status
- Pesquisa: `top10` · nota 85 · verificado em 2026-10-29.
- Ambiente do Pedro: incluir seletivamente (proposto, nada instalado).
- Próxima revisão: na próxima rodada de [[Research-History]] ou antes de qualquer adoção (via ADR).

## Relacionados
[[Superpowers]] · [[Anthropic-Skills]] · [[wshobson-agents]] · [[Skill-Catalog]] · [[Repository-Catalog]]
