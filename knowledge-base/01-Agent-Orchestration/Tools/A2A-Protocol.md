---
title: "A2A Protocol (Agent2Agent)"
type: tool
category: protocol
status: radar
description: "Protocolo aberto para comunicação entre agentes de fornecedores diferentes (descoberta por agent card, tarefas, mensagens)."
score: 66
verified_at: 2026-10-29
integration: "Protocolo HTTP entre agentes (cards, tarefas)"
license: "Apache-2.0"
repo: https://github.com/a2aproject/A2A
docs: "README do repositório"
stars: 26342
last_push: "(não registrado)"
last_release: "v1.0.1 (2026-05-28)"
open_issues: 300
adoption: "adiado"
tags: [ai-agent-ecosystem, tool, protocol, multi-agent]
updated: 2026-10-29
---
# A2A Protocol (Agent2Agent)

> Nota de ferramenta da [[Indice-AI-Agent-Ecosystem|KB AI-Agent-Ecosystem]]. Métricas coletadas da API do GitHub em 29/10/2026 (19h59–20h15 BRT). Status `radar` = classificação da pesquisa, **não** significa instalado.

| Campo | Valor |
|---|---|
| Nome | A2A Protocol (Agent2Agent) |
| Categoria | `protocol` |
| Status na pesquisa | `radar` (nota 66/100) |
| Adoção no ambiente | adiado |
| Repositório oficial | https://github.com/a2aproject/A2A |
| Documentação oficial | README do repositório |
| Estrelas / issues abertas | 26342 / 300 |
| Último push / release | (não registrado) / v1.0.1 (2026-05-28) |
| Licença | Apache-2.0 |
| Verificado em | 2026-10-29 |

## Descrição
Protocolo aberto para comunicação entre agentes de fornecedores diferentes (descoberta por *agent card*, tarefas, mensagens).

## Problema que resolve
Agentes heterogêneos (Claude Code, Codex, outros) conversarem sem acoplamento.

## Casos de uso
- Futuro: o Harness delegar a um agente remoto (Hermes fora do escopo do ecossistema do Pedro)

## Funcionalidades principais
- Agent cards
- Ciclo de vida de tarefas

## Requisitos
- Servidores A2A em cada agente

## Compatibilidade
- Clientes atuais do Pedro não falam A2A nativamente (não verificado)

## Limitações
- Complexidade alta para um ambiente de uma pessoa

## Segurança
- Autenticação entre agentes a desenhar

## Licença
Apache-2.0. Não é parecer jurídico; revisar antes de redistribuir ou embarcar em produto.

## Recomendações
- **Adiado**: MCP + handoff em arquivo resolve o caso atual

## Integração com o Harness
Fora do escopo atual; reavaliar na etapa 10-Multi-Agent-Orchestration.

## Exemplo de configuração
Nenhum exemplo publicado aqui: **não verificado**. Consultar o README oficial no momento da adoção.

## Status
- Pesquisa: `radar` · nota 66 · verificado em 2026-10-29
- Ambiente do Pedro: adiado
- Próxima revisão: na próxima rodada de [[Research-History]] ou antes de qualquer adoção (via ADR).

## Relacionados
[[Comunicacao-entre-Agentes]] · [[Repository-Catalog]]
