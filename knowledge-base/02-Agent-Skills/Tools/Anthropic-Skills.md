---
title: "Anthropic Skills (anthropics/skills)"
type: tool
category: agent-skills
status: top10
description: "Repositório oficial de skills de exemplo da Anthropic, incluindo skills de documentos e a skill de criação de skills; referência de formato."
score: 82
verified_at: 2026-10-29
integration: "Marketplace de plugins do Claude Code (`/plugin marketplace add anthropics/skills`)"
license: "sem licença na raiz segundo a API (licenças por skill — **verificar**)"
repo: https://github.com/anthropics/skills
docs: "README do repositório"
stars: 184804
last_push: "2026-10-28"
last_release: "sem release publicada"
open_issues: 1446
adoption: "referência"
tags: [ai-agent-ecosystem, tool, skills, reference, claude-code]
updated: 2026-10-29
---
# Anthropic Skills (anthropics/skills)

> Nota de ferramenta da [[Indice-AI-Agent-Ecosystem|KB AI-Agent-Ecosystem]]. Métricas coletadas da API do GitHub em 29/10/2026 (19h59–20h15 BRT) e **reconferidas às 22h25–22h40 BRT** na revisão de skills. Status `top10` = classificação da pesquisa, **não** significa instalado.

| Campo | Valor |
|---|---|
| Nome | Anthropic Skills (anthropics/skills) |
| Categoria | `agent-skills` |
| Status na pesquisa | `top10` (nota 82/100) |
| Adoção no ambiente | referência |
| Repositório oficial | https://github.com/anthropics/skills |
| Documentação oficial | README do repositório |
| Estrelas / issues abertas | 184804 / 1446 |
| Último push / release | 2026-10-28 / sem release publicada |
| Licença | sem licença na raiz segundo a API (licenças por skill — **verificar**) |
| Verificado em | 2026-10-29 |

## Descrição
Repositório oficial de skills de exemplo da Anthropic, incluindo skills de documentos e a skill de criação de skills; referência de formato.

## Problema que resolve
Escrever skills próprias no formato correto e com boa progressão de contexto.

## Casos de uso
- Referência para a skill [[Skills para main agents/criar-skills-e-mcps/SKILL|criar-skills-e-mcps]]
- Usar skills de documentos quando necessário

## Funcionalidades principais
- Exemplos de SKILL.md com frontmatter `name`/`description`
- Marketplace instalável

## Requisitos
- Claude Code com plugins

## Compatibilidade
- Claude Code (formato agentskills.io)
- O repo não declara suporte a Codex, OpenCode, Gemini ou Qwen. O formato SKILL.md é aberto, mas isso não foi verificado nesses clientes

## Limitações
- Licenças variam por skill (verificar antes de copiar)
- 1446 issues abertas
- Em 29/10 (22h30 BRT): 19 SKILL.md em `skills/` e 1 template. Instalar todas custa ~2.7 mil tokens de metadados (estimativa chars/4). A `claude-api` tem ≈105 mil chars, o que pesa se for carregada

## Segurança
- Revisar scripts incluídos em skills antes de habilitar

## Licença
sem licença na raiz segundo a API (licenças por skill — **verificar**). Não é parecer jurídico; revisar antes de redistribuir ou embarcar em produto.

## Recomendações
- Usar como **referência de formato**; não instalar o pacote inteiro

## Integração com o Harness
Base de formato para o `Optimization/skills-catalog.md` do Harness e para as 22 skills do Cofre.

## Exemplo de configuração
⚠️ **Não verificado neste ambiente** — extraído da documentação/README na pesquisa de 29/10/2026; nada foi instalado ou executado no Mac.

```text
/plugin marketplace add anthropics/skills
```

## Status
- Pesquisa: `top10` · nota 82 · verificado em 2026-10-29
- Observação (revisão de skills, 29/10, 22h40 BRT): recalculada com a rubrica de [[Metodologia-de-Avaliacao]], a nota daria **77**, porque não declara clientes além do Claude e os metadados pesam. **Nota 82 mantida** por decisão de revisão; o repo-profile [[anthropics-skills]] continua em 87.
- Ambiente do Pedro: referência
- Próxima revisão: na próxima rodada de [[Research-History]] ou antes de qualquer adoção (via ADR).

## Relacionados
[[Superpowers]] · [[Skill-Catalog]] · [[Repository-Catalog]]

Ver também: [[anthropics-skills]] (ficha de orquestração, 29/10/2026).
