---
title: "Prompt inicial — configuração do Agent-Knowledge-MCP no Harness"
type: prompt
status: active
category: orchestration
updated: 2026-10-30
tags: [ai-agent-ecosystem, prompt, harness, mcp, bootstrap]
---
# Prompt inicial — configuração do Agent-Knowledge-MCP no Harness

Prompt para entregar a um agente (Claude Code, Codex, OpenCode…) quando ele for configurar a integração do [[Agent-Knowledge-MCP]] com o Harness. O alvo é **só** o Harness em `~/Downloads/Harness-Architecture`. Ver também [[Indice-AI-Agent-Ecosystem]], [[Harness-Improvement-Proposal]] e [[Bootstrap-8-Fases]]. Depois da configuração, o próximo passo obrigatório é [[Prompt-Iniciar-Time-de-Agentes]].

> Status: documentado. Usar este prompt não equivale a integração; o resultado precisa ser validado e registrado em `08-Implementation/Validation-Results/`.

## Prompt

```text
Você vai configurar a integração do Agent-Knowledge-MCP com o meu HARNESS. Responda em português do Brasil.

ALVO (único)
- Harness de referência: ~/Downloads/Harness-Architecture (cofre Obsidian). É a "arquitetura de Harness".
- NÃO use ~/Downloads/Harness-Arquitetura-Flow (outro projeto).
- NÃO configure, altere nem inicie o Hermes Agent, ~/hermes-docker ou ~/.hermes. O Hermes está fora do escopo. O MCP "hermes-vault" já existe; não mexa nele.

ORDEM DE LEITURA E CAMINHOS (siga nesta ordem)
1. Este prompt de configuração.
2. 00-Dashboard/Indice-AI-Agent-Ecosystem.md (mapa da KB).
3. 00-Dashboard/Prompt-Iniciar-Time-de-Agentes.md: OBRIGATÓRIO depois da configuração e antes de montar
   qualquer time de agentes.
4. 10-Multi-Agent-Orchestration/ (prompt do orquestrador, registry, templates, políticas, workflows).
5. 11-Universal-Agent-Runtime/ e 11-Universal-Agent-Runtime/Model-Catalog/Model-Catalog.md (qual modelo para
   cada tarefa, cotas e regras de dados). Consulte pelo MCP: get_model_routing_policy view=all e
   task=<tipo>. Se a nota e a tool divergirem, vale a resposta da tool.
6. 08-Implementation/Validation-Results/ e Auditoria-Arquitetura-2026-10-29.md (o que foi realmente testado).
7. ~/Downloads/Harness-Architecture: somente leitura até eu aprovar.

FONTES DE CONTEXTO (leia antes de agir)
1. Base de conhecimento: ~/Downloads/Cofre do Pedro/AI-Agent-Ecosystem
   - 00-Dashboard/Indice-AI-Agent-Ecosystem.md (comece por aqui)
   - 04-Agent-Harness/Harness-Improvement-Proposal.md
   - 10-Multi-Agent-Orchestration/ (Main Orchestrator: prompt, registry, factory, políticas, métricas, Bootstrap-8-Fases)
   - 11-Universal-Agent-Runtime/ (Ports & Adapters, adapters de CLI, Model Router, ADR-011/012, EVO-11..14)
   - 08-Implementation/Validation-Results/ (o que foi realmente testado)
   - CHANGELOG.md
2. MCP: ~/Downloads/Agent-Knowledge-MCP (TypeScript, stdio, somente leitura, v0.3.0 conferida no package.json em 30/10/2026, 22 tools)
   - README.md, docs/INSTALLATION.md, docs/CLIENT-INTEGRATION.md, examples/
3. Harness: ~/Downloads/Harness-Architecture (só leitura até eu aprovar)

PROIBIDO LER
- Arquivos .env e qualquer nota em "Cofre do Pedro/Projetos/TRADERS FAKALUM/" (contêm chaves).

TAREFAS
1. Detecte o ambiente, sem presumir: versões de node/npm, CLIs disponíveis (claude, codex, cursor-agent, opencode, qwen, ollama, gemini) e se o app Maestri está rodando.
2. Na pasta do MCP: npm install (só local, nada global), npm run build, npm test. Mostre a saída real.
3. Verifique se o servidor "agent-knowledge" já está registrado no Claude Code (claude mcp list) e no Claude Desktop (~/Library/Application Support/Claude/claude_desktop_config.json).
   - Se já estiver, confira se o caminho e as variáveis apontam para o Cofre (AI-Agent-Ecosystem) e para o Harness-Architecture. Não registre de novo.
   - Se faltar algo, mostre o diff proposto e só aplique depois que eu aprovar. No Desktop, preserve os outros servidores do JSON.
4. Teste de ponta a ponta pelo cliente: chame knowledge_status, get_orchestrator_policy, get_runtime_architecture, list_agent_adapters e get_model_routing_policy (view=all e task=codigo-java-spring), e mostre o resultado real.
5. Leia o Harness-Architecture e as propostas (Harness-Improvement-Proposal, EVO-01..14). Monte um PLANO de integração ao Harness com justificativa técnica, impacto esperado, riscos e rollback para cada mudança. NÃO aplique nada no Harness sem minha aprovação.

REGRAS
- Não instale ferramentas globalmente, não use credenciais e não faça alterações importantes sem minha autorização.
- Nunca simule a execução de um agente; não rode o experimento (npm run experiment -- --approve) sem eu pedir.
- Não invente métricas; diga quando um dado não puder ser verificado.
- Atualize arquivos no próprio lugar, sem cópias nem backups.
- Só diga que criou ou alterou algo depois de conferir no sistema de arquivos.

RELATÓRIO FINAL
Separe em: documentado, implementado, testado e efetivamente integrado. Liste o que ficou pendente de aprovação.

PRÓXIMO PASSO
Após concluir a configuração, siga o Prompt-Iniciar-Time-de-Agentes
(00-Dashboard/Prompt-Iniciar-Time-de-Agentes.md). Não monte nenhum time antes disso.
```

## Histórico
- 2026-10-29: versão inicial, sem Hermes e com as pastas 10 e 11.
- 2026-10-30: seção ORDEM DE LEITURA E CAMINHOS; Model-Catalog e get_model_routing_policy com task; versão do MCP conferida (v0.3.0, 22 tools); fim aponta para [[Prompt-Iniciar-Time-de-Agentes]].
