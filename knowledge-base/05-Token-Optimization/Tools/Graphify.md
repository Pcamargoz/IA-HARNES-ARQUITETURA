---
title: "Graphify"
type: tool
category: token-optimization
status: experimental
description: "Transforma um codebase em grafo de conhecimento consultável via parsing AST local (tree-sitter, sem LLM); candidato a reduzir leituras de arquivo inteiro em repos Java/Spring."
score: 81
verified_at: 2026-10-29
integration: "Experimento: `graphify` com `--code-only` em um repo Spring Boot; sem Graphify Cloud"
license: "Apache-2.0 (há também LICENSE-MIT — verificar NOTICE)"
repo: https://github.com/Graphify-Labs/graphify
docs: "README do repositório + docs.graphify.com"
stars: 138721
last_push: "2026-10-27"
last_release: "v0.9.97 (2026-10-27)"
open_issues: 1653
adoption: "experimento (proposto)"
tags: [ai-agent-ecosystem, tool, token-optimization, code-graph, tree-sitter, java]
updated: 2026-10-29
---
# Graphify

> Nota de ferramenta da [[Indice-AI-Agent-Ecosystem|KB AI-Agent-Ecosystem]]. Métricas coletadas via API do GitHub e arquivos do repositório em 29/10/2026, entre 22h25 e 22h40 BRT. O conteúdo do repo foi tratado como dado não confiável, sem clonar nem executar. Status `experimental` = candidato a experimento, **não** significa instalado.

| Campo | Valor |
|---|---|
| Nome | Graphify |
| Categoria | `token-optimization` |
| Status na pesquisa | `experimental` (nota 81/100) |
| Adoção no ambiente | experimento (proposto) |
| Repositório oficial | https://github.com/Graphify-Labs/graphify (antigo `safishamsi/graphify`, com redirect 301; branch padrão `v8`) |
| Documentação oficial | README + docs.graphify.com |
| Estrelas / issues abertas | 138721 / 1653 (a API soma PRs às issues) |
| Último push / release | 2026-10-27 / v0.9.97 (2026-10-27 15:15 BRT), pré-1.0 |
| Licença | Apache-2.0 no LICENSE (a API concorda). Há também um LICENSE-MIT: verificar o NOTICE |
| Verificado em | 2026-10-29 |

## Descrição
CLI e skill em Python que monta um grafo do código (calls, imports, herança e comunidades via Leiden/Louvain). O parsing é por tree-sitter AST, local e determinístico, para cerca de 40 linguagens. Docs, PDFs e imagens passam por uma etapa semântica opcional, feita pelo modelo do assistente.

## Problema que resolve
O agente lê arquivos inteiros para entender a estrutura de um codebase grande. Um grafo consultável reduz os tokens de leitura, que são a maior fatia da [[Estrategia-de-Tokens]].

## Casos de uso
- Mapear módulos e dependências de um microserviço Spring Boot antes de uma mudança
- Análise de impacto ("quem chama isto?")

## Funcionalidades principais
- Grafo local com 0 crédito de LLM para código
- Links entre arquivos resolvidos por AST
- Comunidades de subsistemas
- Export HTML/graphdb

## Requisitos
- Python e `uv` ou `pipx`
- **Mac Intel:** disponibilidade de wheels tree-sitter x86_64 **não verificada**

## Compatibilidade
- Segundo o README, `graphify install` detecta o host. Hosts citados: Claude Code, Cursor, Codex, Gemini CLI, Copilot, OpenCode, Kiro, Trae, pi, VS Code, Amp e mais de 20 outros.
- Qwen: não verificado.
- Java tem testes dedicados (`tests/test_java_*.py`) e há suporte a Kotlin. A cobertura de anotações e injeção de dependência do Spring **não foi verificada**.

## Limitações
- O `skill.md` da skill tem ≈47 mil chars (~11.9 mil tokens, estimativa) por invocação. Esse custo é alto e precisa ser compensado pela economia de leitura.
- Não segue o layout `skills/*/SKILL.md`.
- 1653 issues abertas, e a versão ainda é pré-1.0.

## Segurança
- ⚠️ **Nome no PyPI: `graphifyy` (com dois "y").** Há risco de typosquatting: conferir o nome exato antes de qualquer instalação.
- `graphify install` escreve a skill e os hooks na configuração do assistente (`graphify/hooks.py`, `install.py`).
- A etapa semântica envia docs, PDFs e imagens ao provedor configurado, com autodetecção por API key. Usar `--code-only` para evitar.
- O README declara "No telemetry", o que não foi verificado no código.
- **Graphify Cloud** (empresa YC S26) aparece com forte upsell ("80% menos tokens" é alegação do Cloud). Fica fora da arquitetura por independência de vendor.

## Licença
Apache-2.0 (com LICENSE-MIT presente, a verificar). Não é parecer jurídico; revisar antes de redistribuir ou embarcar em produto.

## Recomendações
- Fazer o experimento em um repo Spring Boot, com `--code-only` e escopo de projeto, sem Cloud.
- Medir tokens de leitura e acertos contra a baseline F0 da [[Estrategia-de-Tokens]].
- Comparar com o [[Serena]], que tem leitura por símbolo e o mesmo objetivo.

## Integração com o Harness
Fase *Understand*: fornece contexto de código, complementando o `find_relevant_skills`, que ranqueia skills e não código. Não participa do [[Model-Router]].

## Exemplo de configuração
⚠️ **Não verificado neste ambiente.** Extraído do README na pesquisa de 29/10/2026; nada foi instalado ou executado no Mac.

```bash
uv tool install graphifyy        # atenção: "graphifyy" com dois y
graphify install --project       # escreve skill/hooks no projeto atual
graphify extract --code-only     # só código, offline, sem API key
```

## Status
- Pesquisa: `experimental` · nota 81 · verificado em 2026-10-29.
- Ambiente do Pedro: experimento proposto (nada instalado).
- Próxima revisão: após o experimento ou na próxima rodada de [[Research-History]].

## Relacionados
[[Estrategia-de-Tokens]] · [[Serena]] · [[Repomix]] · [[Ponytail]] · [[Caveman]] · [[Repository-Catalog]]
