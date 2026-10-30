---
title: "Serena"
type: tool
category: mcp-server
status: top10
description: "Toolkit de agente de código que expõe, como servidor MCP, recuperação e edição em nível de símbolo usando Language Servers (LSP). O agente pergunta por classes, métodos e referências em vez de ler arquivos inteiros."
score: 88
verified_at: 2026-10-29
integration: "MCP stdio (uvx/uv tool), contexto claude-code; por projeto"
license: "GPL-3.0-or-later segundo o README; a API do GitHub retorna NOASSERTION — **confirmar**"
repo: https://github.com/oraios/serena
docs: "https://oraios.github.io/serena/ (página de clientes: https://oraios.github.io/serena/02-usage/030_clients.html)"
stars: 30850
last_push: "2026-10-28"
last_release: "v2.1.0 (2026-10-19)"
open_issues: 131
adoption: "avaliar (E1)"
tags: [ai-agent-ecosystem, tool, mcp-server, code-context, lsp, java, token-optimization]
updated: 2026-10-29
---
# Serena

> Nota de ferramenta da [[Indice-AI-Agent-Ecosystem|KB AI-Agent-Ecosystem]]. Métricas coletadas da API do GitHub em 29/10/2026 (19h59–20h15 BRT). Status `top10` = classificação da pesquisa, **não** significa instalado.

| Campo | Valor |
|---|---|
| Nome | Serena |
| Categoria | `mcp-server` |
| Status na pesquisa | `top10` (nota 88/100) |
| Adoção no ambiente | avaliar (E1) |
| Repositório oficial | https://github.com/oraios/serena |
| Documentação oficial | https://oraios.github.io/serena/ (página de clientes: https://oraios.github.io/serena/02-usage/030_clients.html) |
| Estrelas / issues abertas | 30850 / 131 |
| Último push / release | 2026-10-28 / v2.1.0 (2026-10-19) |
| Licença | GPL-3.0-or-later segundo o README; a API do GitHub retorna NOASSERTION — **confirmar** |
| Verificado em | 2026-10-29 |

## Descrição
Toolkit de agente de código que expõe, como servidor MCP, recuperação e edição **em nível de símbolo** usando Language Servers (LSP). O agente pergunta por classes, métodos e referências em vez de ler arquivos inteiros.

## Problema que resolve
Em projetos Java/Spring grandes (ex.: [[Control Free]], [[Reserva de Mesas - Microservices]]) o agente gasta a maior parte do contexto lendo arquivos completos para achar um método. Na estimativa da pesquisa, leitura de código é ~35k de uma tarefa de 60k tokens.

## Casos de uso
- Localizar um símbolo e suas referências antes de editar (refactor seguro)
- Explorar um módulo desconhecido por visão geral de símbolos
- Reduzir leituras de arquivos inteiros em subagentes de código
- Memórias de projeto (onboarding) reaproveitadas entre sessões

## Funcionalidades principais
- Busca de símbolos e referências via LSP
- Edição por símbolo (substituir corpo, inserir antes/depois)
- Suporte a 40+ linguagens segundo o README (Java via Eclipse JDT LS)
- Contextos de execução (ex.: `claude-code`, `desktop-app`, `ide`) que ajustam o conjunto de tools
- Memórias de projeto em pasta local do projeto

## Requisitos
- Python 3.11–3.14 gerenciado por `uv` (o Mac do Pedro tem Python 3.9 e **não tem uv**)
- Para Java: Eclipse JDT LS (baixado pela Serena) e um JDK
- Projeto indexável localmente

## Compatibilidade
- Claude Code (stdio)
- Claude Desktop (stdio, contexto desktop-app)
- Hermes — fora do escopo do ecossistema do Pedro
- Intel Mac: sem bloqueio conhecido; consumo de RAM do JDT LS **a medir no E1**

## Limitações
- Indexação inicial demorada em repositórios grandes
- Ferramentas de edição podem se sobrepor às do Claude Code — usar o contexto `claude-code`
- Ganho de tokens (40–60% na leitura de código) é **estimativa** até o E1 medir

## Segurança
- Executa language servers locais e pode **editar arquivos**: registrar por projeto, não globalmente
- Não precisa de credenciais
- Divergência de licença (GPL vs NOASSERTION) a resolver antes de redistribuir qualquer coisa

## Licença
GPL-3.0-or-later segundo o README; a API do GitHub retorna NOASSERTION — **confirmar**. Não é parecer jurídico; revisar antes de redistribuir ou embarcar em produto.

## Recomendações
- Adotar **só depois do E1** ([[E1-Serena-Context7-ControlFree]]) e só se reduzir ≥30% de tokens
- Escopo de projeto (não user scope) até o E1 decidir
- Instalar `uv` é uma decisão do Pedro (instalação global) — não foi feita

## Integração com o Harness
Encaixa na camada **Execution** do Harness (`HARNESS/HARNESS MAIN/architecture.md`) como MCP de contexto de código; preenche a lacuna “nenhum MCP de contexto de código específico para Java” apontada em [[Current-Architecture]]. Entraria em `Optimization/mcp-catalog.md` como *candidate* via ADR.

## Exemplo de configuração
⚠️ **Não verificado neste ambiente** — extraído da documentação/README na pesquisa de 29/10/2026; nada foi instalado ou executado no Mac.

```bash
# instalação (global, exige decisão do Pedro)
uv tool install -p 3.13 serena-agent && serena init
# registro no Claude Code, por projeto
claude mcp add serena -- serena start-mcp-server --context claude-code --project "$(pwd)"
```

## Status
- Pesquisa: `top10` · nota 88 · verificado em 2026-10-29
- Ambiente do Pedro: avaliar (E1)
- Próxima revisão: na próxima rodada de [[Research-History]] ou antes de qualquer adoção (via ADR).

## Relacionados
[[Context7]] · [[Repomix]] · [[Headroom]] · [[E1-Serena-Context7-ControlFree]] · [[MCP-Catalog]] · [[Repository-Catalog]]
