import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { connect, fixtureEnv, tempFixtures, isError, text } from "./helpers.js";

test("recuperação: erros de entrada e de arquivo não derrubam o servidor", async (t) => {
  const tmp = tempFixtures();
  const c = await connect(fixtureEnv(tmp.kb, tmp.harness, { AKM_INDEX_TTL_MS: "600000" }));
  try {
    // 1) argumentos inválidos (validação zod)
    let bad: unknown;
    try { bad = await c.client.callTool({ name: "search_knowledge", arguments: { query: 123 } }); } catch (e) { bad = { isError: true, content: [{ type: "text", text: String(e) }] }; }
    assert.equal(isError(bad), true);
    t.diagnostic("args inválidos -> " + text(bad).slice(0, 160));
    // 2) tool inexistente
    let unk: unknown;
    try { unk = await c.client.callTool({ name: "nao_existe", arguments: {} }); } catch (e) { unk = { isError: true, content: [{ type: "text", text: String(e) }] }; }
    assert.equal(isError(unk), true);
    // 3) arquivo apagado entre indexação e leitura (índice com TTL longo ainda o lista)
    const f = path.join(tmp.kb, "AI-Agent-Ecosystem", "03-MCP-Servers", "Context7.md");
    fs.rmSync(f);
    const gone = await c.client.callTool({ name: "get_document", arguments: { path: "cofre:AI-Agent-Ecosystem/03-MCP-Servers/Context7.md" } });
    assert.equal(isError(gone), true);
    t.diagnostic("arquivo apagado -> " + text(gone).replace(tmp.dir, "<tmp>"));
    // 4) documento nomeado ausente -> erro claro
    fs.rmSync(path.join(tmp.kb, "AI-Agent-Ecosystem", "00-Dashboard", "Implementation-Roadmap.md"));
    const rm = await c.client.callTool({ name: "get_implementation_roadmap", arguments: {} });
    assert.equal(isError(rm), true);
    // 5) servidor segue respondendo
    const ok = await c.client.callTool({ name: "search_knowledge", arguments: { query: "serena" } });
    assert.equal(isError(ok), false);
    assert.match(text(ok), /Serena/);
  } finally { await c.close(); tmp.cleanup(); }
});

test("recuperação: frontmatter YAML inválido é indexado mesmo assim (com aviso em stderr)", async () => {
  const tmp = tempFixtures();
  const c = await connect(fixtureEnv(tmp.kb, tmp.harness));
  try {
    const r = text(await c.client.callTool({ name: "search_knowledge", arguments: { query: "frontmatterquebradoteste" } }));
    assert.match(r, /broken-frontmatter\.md/);
    assert.match(c.stderr(), /frontmatter inválido/);
  } finally { await c.close(); tmp.cleanup(); }
});
