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

test("list_agent_skills: SKILL.md + pacotes da KB, com filtro", async () => {
  const all = await call("list_agent_skills");
  assert.match(all.out, /\[skill\] java-spring-backend-senior/);
  assert.match(all.out, /\[pacote\(top10\)\] Superpowers/);
  const f = await call("list_agent_skills", { query: "spring" });
  assert.match(f.out, /^1 skill/);
});

test("find_mcp_servers: ordena por nota e filtra por termo", async () => {
  const r = await call("find_mcp_servers");
  const lines = r.out.split("\n");
  assert.match(lines[1], /^- Serena \| status=top10 nota=88/);
  assert.match(lines[2], /^- Context7/);
  assert.match((await call("find_mcp_servers", { query: "java" })).out, /^1 servidor/);
});

test("recommend_integration: necessidade -> ferramenta com justificativa", async (t) => {
  const r = await call("recommend_integration", { need: "ler código java com menos tokens" });
  t.diagnostic(r.out);
  assert.match(r.out.split("\n")[1], /^1\. Serena/);
  assert.match(r.out, /por quê:/);
});

test("Harness: get_architecture harness-source lê o Harness de referência; demais escopos da KB", async (t) => {
  const h = await call("get_architecture", { scope: "harness-source", heading: "Layers" });
  t.diagnostic(h.out);
  assert.equal(h.err, false);
  assert.match(h.out, /fonte: harness:HARNESS\/HARNESS MAIN\/architecture\.md/);
  assert.match(h.out, /Interface, Cognition, Execution, Control, Evolution/);
  for (const scope of ["ecosystem", "harness-current", "harness-proposal", "mcp"]) {
    const r = await call("get_architecture", { scope });
    assert.equal(r.err, false, scope);
    assert.match(r.out, /Seções/);
  }
});

test("get_research_history: mais recente primeiro; heading lê a rodada", async () => {
  const r = await call("get_research_history");
  assert.match(r.out.split("\n")[1], /2026-10-29/);
  assert.match((await call("get_research_history", { heading: "2026-09-01" })).out, /Pesquisa anterior/);
});

test("get_token_optimization e get_implementation_roadmap", async () => {
  for (const topic of ["overview", "budget", "routing", "compression"]) {
    const r = await call("get_token_optimization", { topic });
    assert.equal(r.err, false, topic);
  }
  assert.match((await call("get_token_optimization", { topic: "routing", heading: "Resumo" })).out, /Roteamento-de-Modelos e economia/);
  const p = await call("get_implementation_roadmap", { phase: "F1" });
  assert.match(p.out, /Instalar Serena e Context7/);
  assert.doesNotMatch(p.out, /Basic Memory/);
});
