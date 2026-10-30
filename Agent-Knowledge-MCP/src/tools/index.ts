import { findMcpServers } from "./find_mcp_servers.js";
import { getArchitecture } from "./get_architecture.js";
import { getDocument } from "./get_document.js";
import { getImplementationRoadmap } from "./get_implementation_roadmap.js";
import { getResearchHistory } from "./get_research_history.js";
import { getTokenOptimization } from "./get_token_optimization.js";
import { knowledgeStatus } from "./knowledge_status.js";
import { listAgentSkills } from "./list_agent_skills.js";
import { recommendIntegration } from "./recommend_integration.js";
import { searchKnowledge } from "./search_knowledge.js";
import type { ToolDefinition } from "./types.js";
import { findRelevantSkills } from "./find_relevant_skills.js";
import { findWorkflowTemplate } from "./find_workflow_template.js";
import { getAgentSpecification } from "./get_agent_specification.js";
import { getArchitectureDecisions } from "./get_architecture_decisions.js";
import { getExecutionPolicy } from "./get_execution_policy.js";
import { getMetricDefinitions } from "./get_metric_definitions.js";
import { getOrchestratorPolicy } from "./get_orchestrator_policy.js";
import { listRegisteredAgents } from "./list_registered_agents.js";
import { getEnvironmentCapabilities } from "./get_environment_capabilities.js";
import { getModelRoutingPolicy } from "./get_model_routing_policy.js";
import { getRuntimeArchitecture } from "./get_runtime_architecture.js";
import { listAgentAdapters } from "./list_agent_adapters.js";

/**
 * Registro único de tools. Para estender, crie o arquivo da tool e adicione-o aqui.
 * v0.2.0: + 8 tools de orquestração (somente leitura) sobre 10-Multi-Agent-Orchestration e Governance/decisions.md.
 * v0.3.0: + 4 tools do Universal Agent Runtime (11-Universal-Agent-Runtime + manifest de ambiente detectado).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TOOLS: ToolDefinition<any>[] = [
  searchKnowledge,
  getDocument,
  listAgentSkills,
  findMcpServers,
  getArchitecture,
  recommendIntegration,
  getResearchHistory,
  getTokenOptimization,
  getImplementationRoadmap,
  knowledgeStatus,
  getOrchestratorPolicy,
  listRegisteredAgents,
  getAgentSpecification,
  findRelevantSkills,
  findWorkflowTemplate,
  getExecutionPolicy,
  getMetricDefinitions,
  getArchitectureDecisions,
  getRuntimeArchitecture,
  listAgentAdapters,
  getModelRoutingPolicy,
  getEnvironmentCapabilities,
];
