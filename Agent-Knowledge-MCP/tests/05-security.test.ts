import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { connect, fixtureEnv, tempFixtures, isError, text } from "./helpers.js";

test("isolamento: traversal, absoluto, ocultos, não-.md, fora do include, nota de chave, symlinks e redação", async (t) => {
  const tmp = tempFixtures();
  const ai = path.join(tmp.kb, "AI-Agent-Ecosystem");
  fs.symlinkSync(path.join(tmp.outside, "externo.md"), path.join(ai, "link-externo.md"));
  fs.symlinkSync(tmp.outside, path.join(ai, "pasta-link"));
  const c = await connect(fixtureEnv(tmp.kb, tmp.harness));
  const get = (p: string) => c.client.callTool({ name: "get_document", arguments: { path: p } });
  try {
    const cases: Array<[string, RegExp]> = [
      ["cofre:AI-Agent-Ecosystem/../../outside/externo.md", /'\.\.'/],
      ["cofre:../outside/externo.md", /'\.\.'/],
      ["cofre:AI-Agent-Ecosystem/..%2F..%2Foutside/externo.md", /não encontrado|bloqueado|fora/],
      [`cofre:${path.join(tmp.outside, "externo.md")}`, /relativo|absoluto/],
      ["cofre:.obsidian/nota-oculta.md", /bloqueado/],
      ["cofre:.obsidian/app.json", /Markdown/],
      ["cofre:AI-Agent-Ecosystem/notas.txt", /Markdown/],
      ["cofre:Fora/fora.md", /fora das pastas autorizadas/],
      ["cofre:AI-Agent-Ecosystem/chave de api trello.md", /credencial|bloqueado/],
      ["cofre:AI-Agent-Ecosystem/link-externo.md", /simbólicos/],
      ["cofre:AI-Agent-Ecosystem/pasta-link/externo.md", /fora da raiz/],
      ["desconhecida:x.md", /Raiz desconhecida/],
    ];
    for (const [p, re] of cases) {
      const res = await get(p);
      assert.equal(isError(res), true, `deveria recusar ${p}`);
      assert.match(text(res), re, p);
      assert.doesNotMatch(text(res), /segredoexternoxyz|proibidochavexyz|ocultoobsidianxyz/);
      t.diagnostic(`recusado ${p.replace(tmp.dir, "<tmp>")} -> ${text(res).replace(tmp.dir, "<tmp>")}`);
    }
    for (const q of ["segredoexternoxyz", "proibidochavexyz", "ocultoobsidianxyz", "foradoincludexyz"]) {
      assert.match(text(await c.client.callTool({ name: "search_knowledge", arguments: { query: q } })), /^0 resultados/, q);
    }
    const st = text(await c.client.callTool({ name: "knowledge_status", arguments: {} }));
    assert.match(st, /symlinks=2/);
    const leak = text(await get("cofre:AI-Agent-Ecosystem/token-leak.md"));
    t.diagnostic(leak.split("\n").find((l) => l.startsWith("Configuração")) ?? "");
    assert.doesNotMatch(leak, /sk-ABCDEFGHIJ|abcdefghijklmnopqrstuvwxyz123456/);
    assert.match(leak, /api_key = \[REDACTED\]/);
  } finally { await c.close(); tmp.cleanup(); }
});

test("isolamento: AKM_DENY_PATTERNS extra bloqueia pasta inteira", async () => {
  const tmp = tempFixtures();
  const c = await connect(fixtureEnv(tmp.kb, tmp.harness, { AKM_DENY_PATTERNS: "03-MCP-Servers/" }));
  try {
    const r = await c.client.callTool({ name: "get_document", arguments: { path: "cofre:AI-Agent-Ecosystem/03-MCP-Servers/Serena.md" } });
    assert.equal(isError(r), true);
    assert.match(text(await c.client.callTool({ name: "find_mcp_servers", arguments: {} })), /^0 servidor/);
  } finally { await c.close(); tmp.cleanup(); }
});
