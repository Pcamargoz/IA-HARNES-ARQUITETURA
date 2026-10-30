import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { connect, fixtureEnv, fixtures, isError, text, type Conn } from "./helpers.js";

let c: Conn;
before(async () => { c = await connect(fixtureEnv(path.join(fixtures, "kb-vault"), path.join(fixtures, "harness-vault"))); });
after(async () => { await c.close(); });
const call = async (name: string, args: Record<string, unknown> = {}) => {
  const r = await c.client.callTool({ name, arguments: args });
  return { err: isError(r), out: text(r) };
};

test("get_orchestrator_policy: visão geral, seção e área inválida", async () => {
  const o = await call("get_orchestrator_policy");
  assert.equal(o.err, false);
  assert.match(o.out, /Políticas da área "orchestrator" \(1 nota/);
  assert.match(o.out, /- Seleção de agente/);
  const s = await call("get_orchestrator_policy", { section: "seleção de agente" });
  assert.match(s.out, /Prefira agentes implemented/);
  assert.doesNotMatch(s.out, /Execute direto/);
  const bad = await call("get_orchestrator_policy", { area: "inexistente" });
  assert.equal(bad.err, true);
  assert.match(bad.out, /Áreas disponíveis: .*execution.*orchestrator/);
});

test("list_registered_agents: contagem por status, filtros e ordenação por tarefa", async () => {
  const all = await call("list_registered_agents");
  assert.match(all.out, /^3 agente\(s\) \[implemented=1 planned=1 conceptual=1\]/);
  const impl = JSON.parse((await call("list_registered_agents", { status: "implemented", format: "json" })).out);
  assert.deepEqual(impl.map((a: { name: string }) => a.name), ["main-agent"]);
  const q = JSON.parse((await call("list_registered_agents", { query: "corrigir bug java spring", format: "json" })).out);
  assert.equal(q[0].name, "builder");
  assert.ok(q[0].score > q[1].score);
  const role = await call("list_registered_agents", { role: "planner" });
  assert.match(role.out, /^1 agente/);
});

test("get_agent_specification: campos estruturados, aviso de não implementado e erro", async () => {
  const j = JSON.parse((await call("get_agent_specification", { name: "builder", format: "json" })).out);
  assert.equal(j.status, "planned");
  assert.deepEqual(j.budget, { max_turns: 10, max_retries: 2, timeout_min: 15 });
  assert.deepEqual(j.disallowed_tools, ["WebFetch"]);
  const t = await call("get_agent_specification", { name: "builder" });
  assert.match(t.out, /NÃO executável sem aprovação/);
  assert.match(t.out, /## Responsabilidades/);
  const m = await call("get_agent_specification", { name: "main-agent", include_body: false });
  assert.doesNotMatch(m.out, /NÃO executável/);
  assert.doesNotMatch(m.out, /## Responsabilidades/);
  const bad = await call("get_agent_specification", { name: "nao-existe" });
  assert.equal(bad.err, true);
  assert.match(bad.out, /Registrados: builder, main-agent, planner/);
});

test("find_relevant_skills: acha SKILL.md, mostra quem cita e skills esperadas não encontradas", async () => {
  const r = JSON.parse((await call("find_relevant_skills", { task: "corrigir bug em spring boot", format: "json" })).out);
  assert.equal(r.skills[0].name, "java-spring-backend-senior");
  assert.deepEqual(r.skills[0].cited_by.sort(), ["builder", "main-agent"]);
  assert.ok(r.expected_not_found.some((s: { name: string }) => s.name === "skill-inexistente-spring"));
  const a = JSON.parse((await call("find_relevant_skills", { task: "planejamento", agent: "planner", format: "json" })).out);
  assert.deepEqual(a.expected_not_found.map((s: { name: string }) => s.name), ["short-spec"]);
  const bad = await call("find_relevant_skills", { task: "x y", agent: "ninguem" });
  assert.equal(bad.err, true);
});

test("find_workflow_template: por task_type, por texto, por nome e fallback", async () => {
  const t = await call("find_workflow_template", { task: "corrigir um bug", task_type: "fix" });
  assert.match(t.out, /melhor: wf-bugfix/);
  assert.match(t.out, /## Etapas[\s\S]*Teste de regressão/);
  const j = JSON.parse((await call("find_workflow_template", { task: "pesquisar e comparar libs", format: "json" })).out);
  assert.equal(j.templates[0].name, "wf-research");
  assert.match((await call("find_workflow_template", { name: "wf-research" })).out, /Definir pergunta/);
  assert.match((await call("find_workflow_template", { task: "plantar batatas" })).out, /workflow padrão do Harness/);
  assert.equal((await call("find_workflow_template", {})).err, true);
});

test("get_execution_policy: seção e aplicação a agente", async () => {
  const l = await call("get_execution_policy", { section: "limites" });
  assert.match(l.out, /3 tentativas/);
  assert.doesNotMatch(l.out, /Pare após/);
  const a = await call("get_execution_policy", { section: "orcamentos", agent: "builder" });
  assert.match(a.out, /Aplicação ao agente builder \(status=planned\)/);
  assert.match(a.out, /"max_turns":10/);
  assert.match(a.out, /exige aprovação/);
  assert.equal((await call("get_execution_policy", { agent: "ninguem" })).err, true);
});

test("get_metric_definitions: tabela estruturada, filtro e schema", async () => {
  const all = JSON.parse((await call("get_metric_definitions", { format: "json" })).out);
  assert.equal(all.metrics.length, 3); // 2 de 10-Orchestration + 1 de 11-Universal-Agent-Runtime;
  assert.equal(all.metrics[1].formula_fonte, "termos em comum | termos");
  const one = await call("get_metric_definitions", { metric: "agent_selection_score", include_telemetry_schema: true });
  assert.match(one.out, /^1 de 3 métrica/);
  assert.match(one.out, /## Campos comuns/);
  assert.equal((await call("get_metric_definitions", { metric: "nada" })).err, true);
});

test("get_architecture_decisions: KB + Harness, ignora template em cerca, filtros e leitura por id", async () => {
  const all = await call("get_architecture_decisions");
  assert.match(all.out, /^3 ADR\(s\) \[kb=1 harness=2\]/);
  assert.doesNotMatch(all.out, /ADR-00N/);
  const h = JSON.parse((await call("get_architecture_decisions", { source: "harness", status: "proposed", format: "json" })).out);
  assert.deepEqual(h.map((d: { key: string }) => d.key), ["harness:ADR-002"]);
  assert.equal(h[0].date, "2026-10-20");
  const q = JSON.parse((await call("get_architecture_decisions", { query: "telemetria jsonl", format: "json" })).out);
  assert.equal(q[0].key, "kb:ADR-009");
  assert.equal(q[0].title, "Telemetria JSONL local");
  assert.match((await call("get_architecture_decisions", { id: "harness:ADR-001" })).out, /single source of context/);
  assert.match((await call("get_architecture_decisions", { id: "kb:ADR-009" })).out, /fora do cofre/);
  assert.equal((await call("get_architecture_decisions", { id: "ADR-999" })).err, true);
});
