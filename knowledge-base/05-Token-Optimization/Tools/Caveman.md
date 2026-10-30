---
title: "Caveman"
type: tool
category: token-optimization
status: experimental
description: "Skill de respostas curtas ('caveman voice') para reduzir tokens de output; o repositório também traz CLI, proxy, roteador Auto/Cloud e Blocks — estes DESCARTADOS."
score: 78
verified_at: 2026-10-29
integration: "Somente `skills/caveman/SKILL.md` como modo opcional de resposta curta em chat; CLI, proxy, Auto, Cloud e Blocks fora da arquitetura"
license: "Apache-2.0 (há também LICENSE-MIT, LICENSING.md e TRADEMARKS.md)"
repo: https://github.com/JuliusBrussee/caveman
docs: "README + INSTALL.md + SECURITY.md do repositório"
stars: 116113
last_push: "2026-10-29"
last_release: "bin-v4.0.2 (2026-10-23)"
open_issues: 129
adoption: "só a skill, opcional (proposto); CLI/proxy/Auto/Cloud descartados"
tags: [ai-agent-ecosystem, tool, token-optimization, output-compression, telemetry]
updated: 2026-10-29
---
# Caveman

> Nota de ferramenta da [[Indice-AI-Agent-Ecosystem|KB AI-Agent-Ecosystem]]. Métricas coletadas via API do GitHub e arquivos do repositório em 29/10/2026, entre 22h25 e 22h40 BRT. O conteúdo do repo foi tratado como dado não confiável, sem clonar nem executar. Status `experimental` = candidato a experimento, **não** significa instalado.

| Campo | Valor |
|---|---|
| Nome | Caveman |
| Categoria | `token-optimization` |
| Status na pesquisa | `experimental` (nota 78/100; vale só para a skill) |
| Adoção no ambiente | só a skill, opcional (proposto). CLI, proxy, Auto, Cloud e Blocks descartados |
| Repositório oficial | https://github.com/JuliusBrussee/caveman |
| Documentação oficial | README + INSTALL.md + SECURITY.md |
| Estrelas / issues abertas | 116113 / 129 (a API soma PRs às issues) |
| Último push / release | 2026-10-29 / bin-v4.0.2 (2026-10-23 02:22 BRT) |
| Licença | Apache-2.0 (LICENSE; a API concorda), mais LICENSE-MIT, LICENSING.md e TRADEMARKS.md ("Caveman" é marca) |
| Verificado em | 2026-10-29 |

## Descrição
O repositório tem dois produtos:
1. **A skill** `caveman`, que faz o agente responder em frases curtas, mantendo código e termos técnicos. Há variantes `ultracave` e `megacave` e 22 SKILL.md no total.
2. **Uma plataforma**: CLI `@caveman-ai/cli`, proxy local em Go, roteador "Auto" com Caveman Cloud, Blocks (scripts prontos) e browse via CDP.

**Só o item 1 entra.**

## Problema que resolve
Prosa longa nas respostas do agente gasta tokens de output e tempo de leitura.

## Casos de uso
- Modo opcional de resposta curta no chat, em tarefas de depuração ou iteração rápida

## Funcionalidades principais
- Níveis de compressão de saída: caveman, ultracave e megacave
- Liga e desliga sob demanda (`/caveman`, "stop caveman")

## Requisitos
- Skill: nenhum, é texto
- O CLI, que **não** será usado, exigiria Node 22.13+

## Compatibilidade
Segundo o README: Claude Code, Codex, Gemini CLI, OpenCode e mais de 30 agentes, incluindo um modo `caveman qwen` do CLI. A skill isolada funciona em qualquer cliente com SKILL.md.

## Limitações
- **Alegações do README, não verificadas:** −33.2% de input em sessões inteiras (54 runs), Auto 54% mais barato (benchmark interim, ±7) e 1.4–2.4× mais barato citando um estudo da Adobe.
- O "65%" da descrição do repo não aparece assim no README atual.
- Piora a legibilidade de documentação em pt-BR. **Não usar para gerar notas do Cofre, ADRs ou relatórios.**
- A skill principal tem ≈4.7 mil chars (~1.2 mil tokens, estimativa).

## Segurança
- **Skill:** roda localmente e não faz rede. Exceção: `caveman-compress` envia o arquivo comprimido ao provedor configurado. Não usar essa variante.
- **CLI, proxy e Auto/Cloud (DESCARTADOS):**
  - Telemetria **ligada por padrão**: comandos, contagem de tokens, ID de instalação, sistema operacional e **IP**. Desliga com `caveman telemetry off` ou `DO_NOT_TRACK=1`.
  - O Auto envia o prompt, os anexos (CLAUDE.md, memória, arquivos citados) e o fim da última resposta ao Caveman Cloud, que pode reter esses dados no plano Free.
  - O proxy fica no caminho das requisições à API.
  - O instalador alternativo é `curl … | bash`.
  - O CLI "encontra seus agentes e logins" e altera as configurações deles.
- 1214 arquivos executáveis no repositório (Go, mjs, py).

## Licença
Apache-2.0, com arquivos MIT e de marca a verificar. Não é parecer jurídico; revisar antes de redistribuir ou embarcar em produto.

## Recomendações
- Se usar, copiar só `skills/caveman/SKILL.md` revisado e ativar sob demanda.
- Nunca rodar `npx @caveman-ai/cli` nem o `install.sh`.
- O roteamento de modelos continua no [[Model-Router]] do Harness. O Auto do Caveman concorre com ele e gera dependência de fornecedor.

## Integração com o Harness
- Economia de tokens: corta o output de prosa.
- Complementa o [[Ponytail]], que corta código.
- **Fora do Model Router.**

## Exemplo de configuração
⚠️ **Não verificado neste ambiente.** Nada foi instalado ou executado no Mac.

```text
# Recomendado: copiar manualmente skills/caveman/SKILL.md (revisado); ativar com /caveman, desativar com "stop caveman".
# NÃO usar: npx @caveman-ai/cli@latest · curl …/install.sh | bash · caveman login (Auto/Cloud)
```

## Status
- Pesquisa: `experimental` (só a skill) · nota 78 · verificado em 2026-10-29.
- Ambiente do Pedro: opcional, nada instalado.
- Próxima revisão: na próxima rodada de [[Research-History]].

## Relacionados
[[Estrategia-de-Tokens]] · [[Ponytail]] · [[Graphify]] · [[Model-Router]] · [[Repository-Catalog]]
