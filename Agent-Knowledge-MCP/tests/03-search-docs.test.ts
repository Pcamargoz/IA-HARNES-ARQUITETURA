import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { connect, fixtureEnv, fixtures, isError, text, type Conn } from "./helpers.js";

let c: Conn;
before(async () => { c = await connect(fixtureEnv(path.join(fixtures, "kb-vault"), path.join(fixtures, "harness-vault"))); });
after(async () => { await c.close(); });

const call = (name: string, args: Record<string, unknown>) => c.client.callTool({ name, arguments: args });

test("busca por palavra-chave: 'serena java' traz Serena primeiro com fonte, seção e linha", async (t) => {
  const r = text(await call("search_knowledge", { query: "serena java" }));
  t.diagnostic(r);
  const first = r.split("\n")[1];
  assert.match(first, /^1\. Serena — cofre:AI-Agent-Ecosystem\/03-MCP-Servers\/Serena\.md › .+ \(L\d+\) score=/);
});

test("busca: acentos/caixa são normalizados ('memória' encontra 'Memória')", async () => {
  const r = text(await call("search_knowledge", { query: "MEMORIA basic" }));
  assert.match(r, /Implementation-Roadmap\.md › F2/);
});

test("busca: filtros de frontmatter (type/status/category/path_prefix)", async () => {
  const r = JSON.parse(text(await call("search_knowledge", { query: "tokens documentação", type: "tool", format: "json" })));
  assert.ok(r.length >= 1);
  for (const h of r) assert.equal(h.type, "tool");
  const s = JSON.parse(text(await call("search_knowledge", { query: "descrição", status: "top10", category: "mcp", format: "json" })));
  assert.deepEqual(s.map((h: { title: string }) => h.title).sort(), ["Context7", "Serena"]);
  const p = JSON.parse(text(await call("search_knowledge", { query: "layers", path_prefix: "HARNESS", format: "json" })));
  assert.equal(p[0].root, "harness");
});

test("busca: limite respeita AKM_MAX_RESULTS e snippet é curto", async () => {
  const r = JSON.parse(text(await call("search_knowledge", { query: "tokens", limit: 100, format: "json" })));
  assert.ok(r.length <= 20);
  for (const h of r) assert.ok(h.snippet.length <= 222);
});

test("busca: zero resultados é resposta normal (não erro)", async () => {
  const res = await call("search_knowledge", { query: "xyzinexistente" });
  assert.equal(isError(res), false);
  assert.match(text(res), /^0 resultados/);
});

test("documento: outline, seção por heading, intervalo de linhas e truncamento", async (t) => {
  const id = "cofre:AI-Agent-Ecosystem/03-MCP-Servers/Serena.md";
  const o = text(await call("get_document", { path: id, outline_only: true }));
  assert.match(o, /L\d+ ## Compatibilidade/);
  assert.match(o, /frontmatter: title: Serena \| type: tool/);
  const s = text(await call("get_document", { path: id, heading: "compatibilidade" }));
  t.diagnostic(s);
  assert.match(s, /seção "Compatibilidade"/);
  assert.match(s, /Eclipse JDT LS/);
  assert.doesNotMatch(s, /busca semântica de símbolos/);
  const l = text(await call("get_document", { path: id, start_line: 13, max_lines: 2 }));
  assert.match(l, /trecho L13-14/);
  const tr = text(await call("get_document", { path: id, max_chars: 200 }));
  assert.match(tr, /\[truncado: \+\d+ caracteres/);
});

test("documento: caminho sem raiz é resolvido pelo índice; heading inexistente lista seções", async () => {
  const r = text(await call("get_document", { path: "03-MCP-Servers/Context7.md" }));
  assert.match(r, /fonte: cofre:AI-Agent-Ecosystem\/03-MCP-Servers\/Context7\.md/);
  const e = await call("get_document", { path: "cofre:AI-Agent-Ecosystem/03-MCP-Servers/Context7.md", heading: "Nada" });
  assert.equal(isError(e), true);
  assert.match(text(e), /Seções: # Context7; ## Descrição/);
});

test("referências e fontes: include_links devolve wikilinks e URLs", async () => {
  const r = text(await call("get_document", { path: "cofre:AI-Agent-Ecosystem/03-MCP-Servers/Serena.md", include_links: true, outline_only: true }));
  assert.match(r, /wikilinks \(1\): Context7/);
  assert.match(r, /fontes externas \(1\): https:\/\/github\.com\/oraios\/serena/);
});
