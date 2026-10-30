---
title: "Mem0"
type: tool
category: memory
status: radar
description: "Camada de memória para agentes que extrai fatos de conversas com um LLM e os guarda em vector store."
score: 70
verified_at: 2026-10-29
integration: "Biblioteca/serviço de memória (OSS + plataforma hospedada)"
license: "Apache-2.0"
repo: https://github.com/mem0ai/mem0
docs: "README do repositório"
stars: 68061
last_push: "(não registrado)"
last_release: "ts-v3.3.1 (25/09 na coleta; ano não registrado — reconferir)"
open_issues: 892
adoption: "radar"
tags: [ai-agent-ecosystem, tool, memory, vector, llm]
updated: 2026-10-29
---
# Mem0

> Nota de ferramenta da [[Indice-AI-Agent-Ecosystem|KB AI-Agent-Ecosystem]]. Métricas coletadas da API do GitHub em 29/10/2026 (19h59–20h15 BRT). Status `radar` = classificação da pesquisa, **não** significa instalado.

| Campo | Valor |
|---|---|
| Nome | Mem0 |
| Categoria | `memory` |
| Status na pesquisa | `radar` (nota 70/100) |
| Adoção no ambiente | radar |
| Repositório oficial | https://github.com/mem0ai/mem0 |
| Documentação oficial | README do repositório |
| Estrelas / issues abertas | 68061 / 892 |
| Último push / release | (não registrado) / ts-v3.3.1 (25/09 na coleta; ano não registrado — reconferir) |
| Licença | Apache-2.0 |
| Verificado em | 2026-10-29 |

## Descrição
Camada de memória para agentes que extrai fatos de conversas com um LLM e os guarda em vector store.

## Problema que resolve
Personalização e memória de longo prazo em apps com usuários.

## Casos de uso
- Memória em produto (não no ambiente de desenvolvimento)

## Funcionalidades principais
- Extração de memórias por LLM
- Vector stores plugáveis
- SDKs Python/TS

## Requisitos
- LLM + vector store

## Compatibilidade
- Apps; MCP não avaliado

## Limitações
- Cada escrita chama um LLM: **desloca custo** em vez de economizar

## Segurança
- Plataforma hospedada envia dados para fora

## Licença
Apache-2.0. Não é parecer jurídico; revisar antes de redistribuir ou embarcar em produto.

## Recomendações
- Radar; não indicado para o caso pessoal do Pedro

## Integração com o Harness
Fora do escopo do Harness atual.

## Exemplo de configuração
Nenhum exemplo publicado aqui: **não verificado**. Consultar o README oficial no momento da adoção.

## Status
- Pesquisa: `radar` · nota 70 · verificado em 2026-10-29
- Ambiente do Pedro: radar
- Próxima revisão: na próxima rodada de [[Research-History]] ou antes de qualquer adoção (via ADR).

## Relacionados
[[Basic-Memory]] · [[Claude-Mem]] · [[Repository-Catalog]]
