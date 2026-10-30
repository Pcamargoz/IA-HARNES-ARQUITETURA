---
title: "Ponytail"
type: tool
category: token-optimization
status: experimental
description: "Skill de 'código mínimo necessário' (ladder: precisa existir? já existe no repo? stdlib? plataforma?) com review/audit; alega −45% tokens e −53% código em benchmark próprio."
score: 80
verified_at: 2026-10-29
integration: "Experimento: só `skills/ponytail/SKILL.md` ou `AGENTS.md` copiados e revisados; sem hooks, sem band/board"
license: "MIT"
repo: https://github.com/DietrichGebert/ponytail
docs: "README + INSTALL.md do repositório"
stars: 180218
last_push: "2026-10-29"
last_release: "v5.3.3 (2026-10-29)"
open_issues: 137
adoption: "experimento (proposto)"
tags: [ai-agent-ecosystem, tool, token-optimization, skills, minimal-code]
updated: 2026-10-29
---
# Ponytail

> Nota de ferramenta da [[Indice-AI-Agent-Ecosystem|KB AI-Agent-Ecosystem]]. Métricas coletadas via API do GitHub e arquivos do repositório em 29/10/2026, entre 22h25 e 22h40 BRT. O conteúdo do repo foi tratado como dado não confiável, sem clonar nem executar. Status `experimental` = candidato a experimento, **não** significa instalado.

| Campo | Valor |
|---|---|
| Nome | Ponytail |
| Categoria | `token-optimization` |
| Status na pesquisa | `experimental` (nota 80/100) |
| Adoção no ambiente | experimento (proposto) |
| Repositório oficial | https://github.com/DietrichGebert/ponytail |
| Documentação oficial | README + INSTALL.md |
| Estrelas / issues abertas | 180218 / 137 (a API soma PRs às issues) |
| Último push / release | 2026-10-29 / v5.3.3 (2026-10-29 00:11 BRT) |
| Licença | MIT (arquivo LICENSE na raiz; a API também informa MIT) |
| Verificado em | 2026-10-29 |

## Descrição
São 6 SKILL.md canônicos em `skills/`: `ponytail`, `-review`, `-audit`, `-debt`, `-gain` e `-help`. A regra é escrever só o que a tarefa precisa, sem cortar validação, tratamento de erro, segurança ou acessibilidade.

## Problema que resolve
O agente gera código e dependências demais, como reinventar o que o Spring Boot ou a stdlib já entregam. Menos código gerado significa menos tokens de output e menos revisão.

## Casos de uso
- Implementação de features no back-end Spring e no front React com o mínimo de código novo
- `ponytail-review` para apontar código desnecessário em PRs

## Funcionalidades principais
- "Ladder" antes de escrever código
- Modos de intensidade
- Review e audit de repositório

## Requisitos
- Para o experimento proposto: nenhum. O SKILL.md ou AGENTS.md é texto puro.
- Os hooks, que **não** serão usados, exigiriam Node.

## Compatibilidade
- Segundo o README: Claude Code (plugin), Codex (plugin + 2 hooks), Gemini (`gemini-extension.json`), OpenCode (`opencode.json` + plugins JS), Cursor, Copilot, Devin, Kiro, Qoder, Windsurf, Kimi e Grok Build.
- Fallback: `AGENTS.md`.
- **Qwen Code não é listado explicitamente:** o README cita Qoder, não Qwen. Não verificado.

## Limitações
- Benchmark do próprio autor (Claude Code, 39 tarefas, 5 runs): −45% tokens, −53% código, −26% custo, 98% da lógica de risco com teste. **Alegações não verificadas.**
- A skill principal tem ≈3.5 mil chars (~870 tokens, estimativa) se ficar sempre carregada.
- Projeto jovem: criado em 2026-06-12, com crescimento de estrelas atípico.

## Segurança
- 59 executáveis.
- Os hooks Node rodam em SessionStart, SubagentStart e **UserPromptSubmit**, ou seja, a cada prompt (`node -e require(...)`).
- A "band" e o "board" leem o histórico de sessões do Claude Code (dados sensíveis) para calcular custo. Segundo o README, isso fica local.
- O autor alerta para cópias falsas com `.exe`/`.dll`. Fontes legítimas: só `DietrichGebert/ponytail` e o pacote npm `@dietrichgebert/ponytail`.
- **Decisão: sem hooks, sem band, sem board.**

## Licença
MIT. Não é parecer jurídico; revisar antes de redistribuir ou embarcar em produto.

## Recomendações
- Experimento A/B em uma tarefa Spring/React: só o SKILL.md copiado e revisado versus baseline.
- Medir LOC, tokens (`/cost`), testes verdes e retrabalho.
- Adotar só se a economia aparecer sem perda de qualidade.

## Integração com o Harness
- Economia de tokens: corta o output de código.
- Complementa o [[Caveman]], que corta prosa, e o [[Graphify]], que corta leitura.
- Na camada de skills, `ponytail-review` sobrepõe parcialmente `code-review-senior`, que continua primária.

## Exemplo de configuração
⚠️ **Não verificado neste ambiente.** Nada foi instalado ou executado no Mac.

```text
# Recomendado: copiar manualmente skills/ponytail/SKILL.md (revisado) para a pasta de skills do projeto.
# Não usar: /plugin install ponytail@ponytail (instala hooks)
```

## Status
- Pesquisa: `experimental` · nota 80 · verificado em 2026-10-29.
- Ambiente do Pedro: experimento proposto (nada instalado).
- Próxima revisão: após o experimento ou na próxima rodada de [[Research-History]].

## Relacionados
[[Estrategia-de-Tokens]] · [[Caveman]] · [[Graphify]] · [[Skill-Catalog]] · [[Repository-Catalog]]
