---
title: "claude-mem"
type: tool
category: memory
status: radar
description: "Plugin que captura automaticamente o que acontece nas sessões do Claude Code, comprime e reinjeta em sessões futuras."
score: 76
verified_at: 2026-10-29
integration: "Plugin do Claude Code (captura de sessão e injeção de contexto)"
license: "Apache-2.0"
repo: https://github.com/thedotmack/claude-mem
docs: "README do repositório"
stars: 104717
last_push: "(não registrado)"
last_release: "v15.6.0 (2026-10-29)"
open_issues: 114
adoption: "radar"
tags: [ai-agent-ecosystem, tool, memory, claude-code, plugin]
updated: 2026-10-29
---
# claude-mem

> Nota de ferramenta da [[Indice-AI-Agent-Ecosystem|KB AI-Agent-Ecosystem]]. Métricas coletadas da API do GitHub em 29/10/2026 (19h59–20h15 BRT). Status `radar` = classificação da pesquisa, **não** significa instalado.

| Campo | Valor |
|---|---|
| Nome | claude-mem |
| Categoria | `memory` |
| Status na pesquisa | `radar` (nota 76/100) |
| Adoção no ambiente | radar |
| Repositório oficial | https://github.com/thedotmack/claude-mem |
| Documentação oficial | README do repositório |
| Estrelas / issues abertas | 104717 / 114 |
| Último push / release | (não registrado) / v15.6.0 (2026-10-29) |
| Licença | Apache-2.0 |
| Verificado em | 2026-10-29 |

## Descrição
Plugin que captura automaticamente o que acontece nas sessões do Claude Code, comprime e reinjeta em sessões futuras.

## Problema que resolve
Continuidade entre sessões sem o usuário escrever notas.

## Casos de uso
- Continuidade automática em projetos longos

## Funcionalidades principais
- Captura automática
- Compressão por IA
- Busca no histórico

## Requisitos
- Claude Code

## Compatibilidade
- Claude Code

## Limitações
- **Padrão é hospedado (CMEM Pro)**; modo local é opt-in
- Memória implícita pode conflitar com a memória explícita do Harness

## Segurança
- Modo hospedado envia dados da sessão para fora → só modo local
- O README contém instruções de instalação dirigidas a agentes; **não foram seguidas** (higiene contra prompt injection)

## Licença
Apache-2.0. Não é parecer jurídico; revisar antes de redistribuir ou embarcar em produto.

## Recomendações
- Radar; preferir memória explícita (Basic Memory/vault) por auditabilidade

## Integração com o Harness
Conflita com o princípio do Harness de memória explícita e auditável.

## Exemplo de configuração
Nenhum exemplo publicado aqui: **não verificado**. Consultar o README oficial no momento da adoção.

## Status
- Pesquisa: `radar` · nota 76 · verificado em 2026-10-29
- Ambiente do Pedro: radar
- Próxima revisão: na próxima rodada de [[Research-History]] ou antes de qualquer adoção (via ADR).

## Relacionados
[[Basic-Memory]] · [[Mem0]] · [[Repository-Catalog]]
