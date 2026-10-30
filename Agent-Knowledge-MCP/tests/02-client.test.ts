import { test } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { connect, fixtureEnv, fixtures, isError, text } from "./helpers.js";

const env = fixtureEnv(path.join(fixtures, "kb-vault"), path.join(fixtures, "harness-vault"));

const EXPECTED = [
  "search_knowledge", "get_document", "list_agent_skills", "find_mcp_servers", "get_architecture",
  "recommend_integration", "get_research_history", "get_token_optimization", "get_implementation_roadmap", "knowledge_status",
  "get_orchestrator_policy", "list_registered_agents", "get_agent_specification", "find_relevant_skills",
  "find_workflow_template", "get_execution_policy", "get_metric_definitions", "get_architecture_decisions",
  "get_runtime_architecture", "list_agent_adapters", "get_model_routing_policy", "get_environment_capabilities",
];

test("cliente real: lista tools, todas read-only, e chama cada uma", async (t) => {
  const c = await connect(env);
  try {
    const { tools } = await c.client.listTools();
    const names = tools.map((x) => x.name).sort();
    assert.deepEqual(names, [...EXPECTED].sort());
    for (const tool of tools) assert.equal(tool.annotations?.readOnlyHint, true, `${tool.name} readOnlyHint`);
    const calls: Array<[string, Record<string, unknown>]> = [
      ["search_knowledge", { query: "serena" }],
      ["get_document", { path: "cofre:AI-Agent-Ecosystem/03-MCP-Servers/Serena.md", outline_only: true }],
      ["list_agent_skills", {}],
      ["find_mcp_servers", {}],
      ["get_architecture", {}],
      ["recommend_integration", { need: "documentação de bibliotecas" }],
      ["get_research_history", {}],
      ["get_token_optimization", {}],
      ["get_implementation_roadmap", {}],
      ["knowledge_status", {}],
      ["get_orchestrator_policy", {}],
      ["list_registered_agents", {}],
      ["get_agent_specification", { name: "main-agent" }],
      ["find_relevant_skills", { task: "spring" }],
      ["find_workflow_template", { task_type: "fix" }],
      ["get_execution_policy", {}],
      ["get_metric_definitions", {}],
      ["get_architecture_decisions", {}],
      ["get_runtime_architecture", {}],
      ["list_agent_adapters", {}],
      ["get_model_routing_policy", {}],
      ["get_environment_capabilities", {}],
    ];
    for (const [name, args] of calls) {
      const res = await c.client.callTool({ name, arguments: args });
      assert.equal(isError(res), false, `${name}: ${text(res)}`);
      assert.ok(text(res).length > 0);
      t.diagnostic(`${name}: ok (${text(res).length} chars)`);
    }
  } finally { await c.close(); }
});

test("cliente real: recursos akm://kb/index e akm://kb/status", async () => {
  const c = await connect(env);
  try {
    const { resources } = await c.client.listResources();
    assert.deepEqual(resources.map((r) => r.uri).sort(), ["akm://kb/index", "akm://kb/status"]);
    const idx = await c.client.readResource({ uri: "akm://kb/index" });
    assert.match(String((idx.contents[0] as { text: string }).text), /Índice \(fixture\)/);
    const st = await c.client.readResource({ uri: "akm://kb/status" });
    assert.ok(JSON.parse(String((st.contents[0] as { text: string }).text)).docs > 5);
  } finally { await c.close(); }
});
