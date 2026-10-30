import { test } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { connect, fixtureEnv, fixtures, isError, text } from "./helpers.js";

test("get_model_routing_policy: catálogo, matriz e regras (fixtures)", async () => {
  const c = await connect(fixtureEnv(path.join(fixtures, "kb-vault"), path.join(fixtures, "harness-vault")));
  const call = async (args: Record<string, unknown> = {}) => c.client.callTool({ name: "get_model_routing_policy", arguments: args });
  try {
    // comportamento antigo preservado + dica do catálogo
    let r = await call();
    assert.match(text(r), /2 fatores/); assert.match(text(r), /Catálogo de modelos: 3 fichas, 2 tarefas/);

    r = await call({ task: "java" });
    assert.match(text(r), /codigo-java-spring/); assert.match(text(r), /modelo-a/); assert.match(text(r), /modelo-local/);
    assert.match(text(r), /D1: sensitive só local/); assert.match(text(r), /claude-code → codex → ollama/);
    assert.match(text(r), /snapshot 2026-10-29/);

    r = await call({ task: "credencial", format: "json" });
    const j = JSON.parse(text(r)) as { task: { id: string; dados_max: string }; models: Array<{ model_id: string; local: boolean }> };
    assert.equal(j.task.id, "dados-sensiveis"); assert.equal(j.task.dados_max, "sensitive");
    assert.deepEqual(j.models.map((m) => m.model_id), ["modelo-local"]); assert.equal(j.models[0].local, true);

    r = await call({ view: "catalog", local: true });
    assert.match(text(r), /1 de 3 ficha/); assert.match(text(r), /Cofre: local/);
    r = await call({ view: "catalog", layer: "core", format: "json" });
    const cj = JSON.parse(text(r)) as { models: Array<{ model_id: string; cofre_allowed: string }> };
    assert.deepEqual(cj.models.map((m) => m.model_id), ["modelo-a", "modelo-b"]);
    assert.equal(cj.models[0].cofre_allowed, "apos-opt-out");

    r = await call({ view: "matrix" });
    assert.match(text(r), /2 tarefas/);
    r = await call({ view: "rules" });
    assert.match(text(r), /data_class → availability → complexity/); assert.match(text(r), /claude-code: janela de 5 h/);
    r = await call({ view: "all", format: "json" });
    const aj = JSON.parse(text(r)) as { models: unknown[]; matrix: unknown[]; quotas: unknown[] };
    assert.equal(aj.models.length, 3); assert.equal(aj.matrix.length, 2); assert.equal(aj.quotas.length, 2);

    assert.equal(isError(await call({ task: "zzzqqq" })), true);
  } finally { await c.close(); }
});
