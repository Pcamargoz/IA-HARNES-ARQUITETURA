import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { connect, fixtureEnv, tempFixtures, text } from "./helpers.js";

test("atualização do índice: criar, alterar e remover nota (em cópia temporária) reflete na busca", async (t) => {
  const tmp = tempFixtures();
  const c = await connect(fixtureEnv(tmp.kb, tmp.harness));
  try {
    const q = { name: "search_knowledge", arguments: { query: "zebraquantica" } };
    assert.match(text(await c.client.callTool(q)), /^0 resultados/);
    const file = path.join(tmp.kb, "AI-Agent-Ecosystem", "Nova-Nota.md");
    fs.writeFileSync(file, "---\ntitle: Nova Nota\ntype: note\n---\n# Nova Nota\n## Seção\nPalavra zebraquantica aqui.\n");
    const r1 = text(await c.client.callTool(q));
    t.diagnostic("após criar: " + r1.split("\n")[1]);
    assert.match(r1, /^1 resultado\(s\)/);
    assert.match(r1, /Nova-Nota\.md › Seção \(L6\)/);
    fs.writeFileSync(file, "---\ntitle: Nova Nota\ntype: note\n---\n# Nova Nota\n## Outra\nTexto novo sem a palavra.\n## Final\nzebraquantica no fim.\n");
    const future = new Date(Date.now() + 5000); fs.utimesSync(file, future, future);
    const r2 = text(await c.client.callTool(q));
    assert.match(r2, /› Final \(L8\)/);
    fs.rmSync(file);
    assert.match(text(await c.client.callTool(q)), /^0 resultados/);
    const st = text(await c.client.callTool({ name: "knowledge_status", arguments: {} }));
    t.diagnostic(st.split("\n").slice(2, 4).join(" || "));
    assert.match(st, /removidos 0/); // a remoção já foi aplicada na chamada anterior
  } finally { await c.close(); tmp.cleanup(); }
});

test("atualização do índice: TTL evita revarredura a cada chamada", async () => {
  const tmp = tempFixtures();
  const c = await connect(fixtureEnv(tmp.kb, tmp.harness, { AKM_INDEX_TTL_MS: "600000" }));
  try {
    const q = { name: "search_knowledge", arguments: { query: "girafaquantica" } };
    await c.client.callTool(q);
    fs.writeFileSync(path.join(tmp.kb, "AI-Agent-Ecosystem", "X.md"), "# X\ngirafaquantica\n");
    assert.match(text(await c.client.callTool(q)), /^0 resultados/, "dentro do TTL ainda não vê");
    await c.client.callTool({ name: "knowledge_status", arguments: { reindex: true } });
    assert.match(text(await c.client.callTool(q)), /^1 resultado/, "reindex=true força");
  } finally { await c.close(); tmp.cleanup(); }
});
