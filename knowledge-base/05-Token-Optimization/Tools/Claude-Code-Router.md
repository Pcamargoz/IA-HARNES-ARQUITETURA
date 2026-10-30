---
title: "Claude Code Router"
type: tool
category: llm-gateway
status: radar
description: "Roteador que permite ao Claude Code usar modelos de outros provedores conforme regras (tarefa de fundo, raciocínio, contexto longo)."
score: 72
verified_at: 2026-10-29
integration: "Proxy local que redireciona o Claude Code para outros provedores/modelos"
license: "MIT"
repo: https://github.com/musistudio/claude-code-router
docs: "README do repositório"
stars: 37907
last_push: "2026-10-10"
last_release: "v3.1.3 (2026-10-09)"
open_issues: 1180
adoption: "radar"
tags: [ai-agent-ecosystem, tool, routing, claude-code, cost]
updated: 2026-10-29
---
# Claude Code Router

> Nota de ferramenta da [[Indice-AI-Agent-Ecosystem|KB AI-Agent-Ecosystem]]. Métricas coletadas da API do GitHub em 29/10/2026 (19h59–20h15 BRT). Status `radar` = classificação da pesquisa, **não** significa instalado.

| Campo | Valor |
|---|---|
| Nome | Claude Code Router |
| Categoria | `llm-gateway` |
| Status na pesquisa | `radar` (nota 72/100) |
| Adoção no ambiente | radar |
| Repositório oficial | https://github.com/musistudio/claude-code-router |
| Documentação oficial | README do repositório |
| Estrelas / issues abertas | 37907 / 1180 |
| Último push / release | 2026-10-10 / v3.1.3 (2026-10-09) |
| Licença | MIT |
| Verificado em | 2026-10-29 |

## Descrição
Roteador que permite ao Claude Code usar modelos de outros provedores conforme regras (tarefa de fundo, raciocínio, contexto longo).

## Problema que resolve
Reduzir custo mandando tarefas simples para modelos mais baratos.

## Casos de uso
- Experimentar modelos baratos em tarefas de baixo risco

## Funcionalidades principais
- Regras de roteamento por tipo de tarefa
- Vários provedores

## Requisitos
- Node

## Compatibilidade
- Claude Code

## Limitações
- **Desloca** custo/qualidade em vez de economizar tokens
- Comportamento com ferramentas pode variar por modelo

## Segurança
- Proxy com chaves de vários provedores; verificar termos de uso

## Licença
MIT. Não é parecer jurídico; revisar antes de redistribuir ou embarcar em produto.

## Recomendações
- Radar; preferir roteamento nativo por subagente (Haiku/Sonnet/Opus) primeiro

## Integração com o Harness
Alternativa à matriz de `models.md`; não recomendada agora.

## Exemplo de configuração
Nenhum exemplo publicado aqui: **não verificado**. Consultar o README oficial no momento da adoção.

## Status
- Pesquisa: `radar` · nota 72 · verificado em 2026-10-29
- Ambiente do Pedro: radar
- Próxima revisão: na próxima rodada de [[Research-History]] ou antes de qualquer adoção (via ADR).

## Relacionados
[[LiteLLM]] · [[Roteamento-de-Modelos]] · [[Repository-Catalog]]
