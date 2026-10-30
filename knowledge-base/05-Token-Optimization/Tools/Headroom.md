---
title: "Headroom"
type: tool
category: token-optimization
status: top10
description: "Camada de compressão de contexto para agentes (antes chopratejas/headroom): comprime saídas de ferramentas, logs e histórico antes de chegarem ao modelo."
score: 80
verified_at: 2026-10-29
integration: "Wrapper/proxy local (`headroom wrap claude`) ou Docker"
license: "Apache-2.0"
repo: https://github.com/headroomlabs-ai/headroom
docs: "README do repositório"
stars: 78267
last_push: "2026-10-29"
last_release: "PyPI 0.42.0 (2026-10-26)"
open_issues: 489
adoption: "opcional (F4)"
tags: [ai-agent-ecosystem, tool, token-optimization, compression, proxy]
updated: 2026-10-29
---
# Headroom

> Nota de ferramenta da [[Indice-AI-Agent-Ecosystem|KB AI-Agent-Ecosystem]]. Métricas coletadas da API do GitHub em 29/10/2026 (19h59–20h15 BRT). Status `top10` = classificação da pesquisa, **não** significa instalado.

| Campo | Valor |
|---|---|
| Nome | Headroom |
| Categoria | `token-optimization` |
| Status na pesquisa | `top10` (nota 80/100) |
| Adoção no ambiente | opcional (F4) |
| Repositório oficial | https://github.com/headroomlabs-ai/headroom |
| Documentação oficial | README do repositório |
| Estrelas / issues abertas | 78267 / 489 |
| Último push / release | 2026-10-29 / PyPI 0.42.0 (2026-10-26) |
| Licença | Apache-2.0 |
| Verificado em | 2026-10-29 |

## Descrição
Camada de compressão de contexto para agentes (antes `chopratejas/headroom`): comprime saídas de ferramentas, logs e histórico antes de chegarem ao modelo.

## Problema que resolve
Logs de build/teste (`./mvnw test`) e saídas longas de ferramentas enchem o contexto.

## Casos de uso
- Comprimir logs de Maven/Gradle do agente de QA
- Sessões longas no Claude Code

## Funcionalidades principais
- `headroom wrap claude`
- Imagem Docker `ghcr.io/headroomlabs-ai/headroom`
- Recursos ONNX opcionais

## Requisitos
- Python (PyPI) ou Docker

## Compatibilidade
- **Intel Mac:** o README recomenda Docker, mas o PyPI tem wheel x86_64 — **testar**
- Recursos ONNX exigem AVX2

## Limitações
- Economia anunciada (20% / 60–95%) **não verificada**
- Compressão pode remover detalhe útil de um erro

## Segurança
- Fica no caminho entre cliente e API: vê prompts e chaves → só local, nunca serviço de terceiros

## Licença
Apache-2.0. Não é parecer jurídico; revisar antes de redistribuir ou embarcar em produto.

## Recomendações
- Só depois de F0 (baseline) e F1; medir em logs reais de `./mvnw test`

## Integração com o Harness
Implementa a técnica de compressão de `Optimization/token-strategy.md` com ferramenta concreta.

## Exemplo de configuração
⚠️ **Não verificado neste ambiente** — extraído da documentação/README na pesquisa de 29/10/2026; nada foi instalado ou executado no Mac.

```bash
headroom wrap claude
```

## Status
- Pesquisa: `top10` · nota 80 · verificado em 2026-10-29
- Ambiente do Pedro: opcional (F4)
- Próxima revisão: na próxima rodada de [[Research-History]] ou antes de qualquer adoção (via ADR).

## Relacionados
[[Repomix]] · [[Compressao-e-Cache]] · [[Estrategia-de-Tokens]] · [[Repository-Catalog]]
