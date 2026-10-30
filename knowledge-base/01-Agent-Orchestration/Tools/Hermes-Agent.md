---
title: "Hermes Agent"
type: tool
category: agent-harness
status: radar
description: "Agente autônomo da Nous Research com skills, memória e cliente MCP. Rodava em Docker no Mac do Pedro até 29/10/2026 ([[Hermes Agent no Docker]]); hoje fora do escopo do ecossistema do Pedro."
score: 76
verified_at: 2026-10-29
integration: "fora do escopo do ecossistema do Pedro (29/10/2026) — não integrar"
license: "MIT"
repo: https://github.com/NousResearch/hermes-agent
docs: "https://hermes-agent.nousresearch.com/docs (MCP: https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp)"
stars: 258498
last_push: "2026-10-29"
last_release: "sem release publicada"
open_issues: 51901
adoption: "fora do escopo do ecossistema do Pedro"
tags: [ai-agent-ecosystem, tool, harness, agent, mcp-client, docker]
updated: 2026-10-29
---
# Hermes Agent

> **Fora do escopo do ecossistema do Pedro (29/10/2026).** Esta ficha fica só como dado de pesquisa. Não é cliente nem alvo de configuração do [[Agent-Knowledge-MCP]]; o alvo é o Harness em `~/Downloads/Harness-Architecture`. Container e rede do Hermes foram removidos do Docker pelo Pedro.

> Nota de ferramenta da [[Indice-AI-Agent-Ecosystem|KB AI-Agent-Ecosystem]]. Métricas coletadas da API do GitHub em 29/10/2026 (19h59–20h15 BRT). Status `radar` = classificação da pesquisa, **não** significa instalado.

| Campo | Valor |
|---|---|
| Nome | Hermes Agent |
| Categoria | `agent-harness` |
| Status na pesquisa | `radar` (nota 76/100) |
| Adoção no ambiente | fora do escopo do ecossistema do Pedro |
| Repositório oficial | https://github.com/NousResearch/hermes-agent |
| Documentação oficial | https://hermes-agent.nousresearch.com/docs (MCP: https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp) |
| Estrelas / issues abertas | 258498 / 51901 |
| Último push / release | 2026-10-29 / sem release publicada |
| Licença | MIT |
| Verificado em | 2026-10-29 |

## Descrição
Agente autônomo da Nous Research com skills, memória e cliente MCP. Rodava em Docker no Mac do Pedro até 29/10/2026 ([[Hermes Agent no Docker]]); hoje fora do escopo do ecossistema do Pedro.

## Problema que resolve
Ter um agente operacional 24/7 (DevOps, colaboração) separado do Claude Code.

## Casos de uso
- Papel DevOps/colaborador na arquitetura multiagente
- Consumir as 22 skills via `skills: external_dirs`
- ~~Cliente do Agent-Knowledge-MCP~~ — cancelado (fora do escopo)

## Funcionalidades principais
- Cliente MCP stdio/HTTP com filtros `tools.include/exclude`
- Tools prefixadas `mcp_<servidor>_<tool>`; recarga com `/reload-mcp`
- Filtragem de env para servidores stdio (só env explícito + base segura)
- Skills no formato agentskills.io

## Requisitos
- Docker (imagem `nousresearch/hermes-agent:latest`)

## Compatibilidade
- Dados de 29/10/2026 antes da remoção; não há montagens a propor (fora do escopo)

## Limitações
- Contagem de 51.901 issues abertas veio da API e **parece anômala** — reconferir
- Sem releases marcadas

## Segurança
- Tokens em `~/.hermes/.env`/`dashboard.env` — não lidos nesta auditoria
- Saída de tools tratada como dado (regra da skill de operação)

## Licença
MIT. Não é parecer jurídico; revisar antes de redistribuir ou embarcar em produto.

## Recomendações
- Nenhuma: fora do escopo do ecossistema do Pedro. Não integrar ao Agent-Knowledge-MCP.

## Relação com o Harness
Nenhuma integração prevista. O nome “hermes-vault” do MCP do Harness é histórico; o MCP pertence ao Harness e continua lá.

## Exemplo de configuração
Removido em 29/10/2026: Hermes fora do escopo do ecossistema do Pedro.

## Status
- Pesquisa: `radar` · nota 76 · verificado em 2026-10-29
- Ambiente do Pedro: fora do escopo do ecossistema do Pedro (container e rede removidos; imagem mantida)
- Próxima revisão: na próxima rodada de [[Research-History]] ou antes de qualquer adoção (via ADR).

## Relacionados
[[Hermes Agent no Docker]] · [[OpenCode]] · [[Repository-Catalog]]
