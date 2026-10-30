import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { connect, isError, text } from "./helpers.js";

/**
 * Teste contra os vaults reais, SOMENTE LEITURA. Só roda se AKM_REAL_VAULT_ROOTS estiver definido
 * (ver scripts/test-real-vaults.sh). Nada é escrito nos vaults.
 */
const roots = process.env.AKM_REAL_VAULT_ROOTS;
// Manifest gerado por `npm run detect-env` (dist/tests -> raiz do pacote).
const pkgRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const manifest = process.env.AKM_REAL_RUNTIME_MANIFEST ?? path.join(pkgRoot, "runtime-output", "environment-manifest.json");

test("vaults reais (somente leitura)", { skip: !roots && "defina AKM_REAL_VAULT_ROOTS para rodar" }, async (t) => {
  const env: Record<string, string> = {
    AKM_VAULT_ROOTS: roots!,
    AKM_ROOT_INCLUDE: process.env.AKM_REAL_ROOT_INCLUDE ?? JSON.stringify({ cofre: ["AI-Agent-Ecosystem", "Skills para main agents"] }),
    AKM_KB_ROOT: "cofre", AKM_KB_SUBDIR: "AI-Agent-Ecosystem", AKM_HARNESS_ROOT: "harness", AKM_LOG_LEVEL: "warn",
    AKM_RUNTIME_MANIFEST: manifest,
  };
  const c = await connect(env);
  const call = async (name: string, args: Record<string, unknown> = {}) => {
    const t0 = Date.now();
    const r = await c.client.callTool({ name, arguments: args });
    const out = text(r);
    t.diagnostic(`### ${name} ${JSON.stringify(args)} (${Date.now() - t0} ms, ${out.length} chars)\n${out.split("\n").slice(0, 8).join("\n")}`);
    assert.equal(isError(r), false, `${name}: ${out}`);
    return out;
  };
  try {
    const st = await call("knowledge_status");
    assert.match(st, /cofre=\d+/);
    assert.match(st, /harness=\d+/);
    assert.match(await call("search_knowledge", { query: "serena java lsp" }), /Serena/);
    assert.match(await call("search_knowledge", { query: "progressive context loading", root: "harness" }), /harness:/);
    await call("get_document", { path: "cofre:AI-Agent-Ecosystem/00-Dashboard/Indice-AI-Agent-Ecosystem.md", outline_only: true });
    await call("list_agent_skills", { query: "spring" });
    await call("find_mcp_servers", { status: "top10" });
    await call("recommend_integration", { need: "memória persistente compartilhada entre sessões do Claude Code e o Harness" });
    await call("get_architecture", { scope: "harness-source" });
    await call("get_architecture", { scope: "harness-proposal" });
    await call("get_research_history");
    await call("get_token_optimization", { topic: "budget" });
    await call("get_implementation_roadmap", { phase: "F1" });
    // v0.2.0 — tools de orquestração
    assert.match(await call("get_orchestrator_policy"), /Quando executar direto/);
    // The live registry evolves as approved native roles gain execution evidence.
    // Verify the existing orchestrator, rather than freezing its original count.
    const agents = await call("list_registered_agents");
    assert.match(agents, /implemented=[1-9]\d*/);
    assert.match(agents, /main-agent \| status=implemented/);
    assert.match(await call("get_agent_specification", { name: "main-agent", include_body: false }), /status=implemented/);
    await call("find_relevant_skills", { task: "feature spring boot com testes" });
    assert.match(await call("find_workflow_template", { task: "corrigir bug no endpoint", task_type: "fix" }), /wf-bugfix/);
    assert.match(await call("get_execution_policy", { section: "irreversiveis", agent: "builder" }), /builder/);
    assert.match(await call("get_metric_definitions", { metric: "agent_selection_score" }), /agent_selection_score/);
    const adrs = await call("get_architecture_decisions");
    assert.match(adrs, /kb=\d+ harness=[1-9]\d*/);
    // v0.3.0 — runtime universal (só leitura; nenhum agente é executado)
    assert.match(await call("get_runtime_architecture"), /Universal Agent Runtime — \d+ nota/);
    assert.match(await call("get_model_routing_policy", { complexity: "trivial" }), /trivial/i);
    assert.match(await call("list_agent_adapters"), /shell-echo/);
    if (fs.existsSync(manifest)) assert.match(await call("get_environment_capabilities"), /CLIs encontradas:.*claude/);
    const sec = await call("search_knowledge", { query: "chave api trello" });
    assert.doesNotMatch(sec, /chave de api trello\.md|Chave da api IA/);
  } finally { await c.close(); }
});

test("vaults reais: varredura do cofre INTEIRO não indexa notas de chave nem .obsidian (só ids, sem conteúdo)",
  { skip: !(roots && process.env.AKM_REAL_FULL_SCAN === "1") && "defina AKM_REAL_FULL_SCAN=1" }, async (t) => {
  const c = await connect({ AKM_VAULT_ROOTS: roots!, AKM_ROOT_INCLUDE: "{}", AKM_KB_ROOT: "cofre", AKM_LOG_LEVEL: "error" });
  try {
    const st = text(await c.client.callTool({ name: "knowledge_status", arguments: {} }));
    t.diagnostic(st.split("\n").filter((l) => /^(documentos|ignorados)/.test(l)).join(" || "));
    for (const q of ["chave api trello", "chave api ia embarcada", "obsidian workspace plugins"]) {
      const hits = JSON.parse(text(await c.client.callTool({ name: "search_knowledge", arguments: { query: q, limit: 20, format: "json" } }))) as Array<{ id: string }>;
      const bad = hits.filter((h) => /chave|\/\.obsidian\//i.test(h.id));
      t.diagnostic(`"${q}": ${hits.length} hits, ${bad.length} proibidos`);
      assert.equal(bad.length, 0);
    }
  } finally { await c.close(); }
});
