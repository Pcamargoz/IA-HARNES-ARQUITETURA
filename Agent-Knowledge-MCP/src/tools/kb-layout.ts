/**
 * Mapa de documentos "nomeados" da Knowledge Base, RELATIVOS à pasta da KB (AKM_KB_SUBDIR).
 * Tools específicas (arquitetura, roadmap, tokens...) leem por chave; mudar a estrutura da KB
 * exige só editar este arquivo. As tools de orquestração (10-Multi-Agent-Orchestration) localizam notas por frontmatter (type/policy_area), não por caminho fixo.
 */
export const KB_DOCS = {
  index: "00-Dashboard/Indice-AI-Agent-Ecosystem.md",
  inventory: "00-Dashboard/Inventario-Ambiente.md",
  roadmap: "00-Dashboard/Implementation-Roadmap.md",
  updateFlow: "00-Dashboard/Fluxo-de-Atualizacao.md",
  researchHistory: "07-GitHub-Research/Research-History.md",
  repoCatalog: "07-GitHub-Research/Repository-Catalog.md",
  mcpCatalog: "03-MCP-Servers/MCP-Catalog.md",
  skillCatalog: "02-Agent-Skills/Skill-Catalog.md",
  "architecture.ecosystem": "01-Agent-Orchestration/Arquitetura-Multiagente.md",
  "architecture.harness-current": "04-Agent-Harness/Current-Architecture.md",
  "architecture.harness-proposal": "04-Agent-Harness/Harness-Improvement-Proposal.md",
  "architecture.mcp": "09-Agent-Knowledge-MCP/Agent-Knowledge-MCP.md",
  "token.overview": "05-Token-Optimization/Estrategia-de-Tokens.md",
  "token.budget": "05-Token-Optimization/Orcamento-de-Contexto.md",
  "token.routing": "05-Token-Optimization/Roteamento-de-Modelos.md",
  "token.compression": "05-Token-Optimization/Compressao-e-Cache.md",
  orchestrationMoc: "10-Multi-Agent-Orchestration/MOC-Multi-Agent-Orchestration.md",
  runtimeMoc: "11-Universal-Agent-Runtime/MOC-Universal-Agent-Runtime.md",
} as const;

export type KbDocKey = keyof typeof KB_DOCS;

/** Documentos do Harness de referência (raiz AKM_HARNESS_ROOT), relativos à raiz. */
export const HARNESS_DOCS = {
  architecture: "HARNESS/HARNESS MAIN/architecture.md",
  orchestration: "HARNESS/HARNESS MAIN/orchestration.md",
  agents: "AGENTS.md",
  decisions: "Governance/decisions.md",
} as const;

/** Pastas da KB usadas como filtros de área. */
export const KB_AREAS = {
  orchestration: "01-Agent-Orchestration",
  skills: "02-Agent-Skills",
  mcp: "03-MCP-Servers",
  harness: "04-Agent-Harness",
  tokens: "05-Token-Optimization",
  memory: "06-Memory-Systems",
  research: "07-GitHub-Research",
  implementation: "08-Implementation",
  akm: "09-Agent-Knowledge-MCP",
  multiAgent: "10-Multi-Agent-Orchestration",
  runtime: "11-Universal-Agent-Runtime",
} as const;
