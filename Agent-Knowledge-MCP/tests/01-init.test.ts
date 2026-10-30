import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { loadConfig, parseRootsEnv } from "../src/server/config.js";
import { createContext } from "../src/server/createServer.js";
import { Logger } from "../src/server/logger.js";
import { connect, fixtureEnv, fixtures, serverEntry } from "./helpers.js";

const kb = path.join(fixtures, "kb-vault");
const harness = path.join(fixtures, "harness-vault");

test("init: config lê raízes 'nome=caminho;...' inclusive com vírgulas no caminho", () => {
  const r = parseRootsEnv("cofre=/a/MCPS,PLUGINS,REPOS - MAIN AGENT;harness=/b");
  assert.deepEqual(r.map((x) => x.name), ["cofre", "harness"]);
  assert.equal(r[0].path, "/a/MCPS,PLUGINS,REPOS - MAIN AGENT");
});

test("init: sem raízes => erro explicativo", () => {
  assert.throws(() => loadConfig({}), /Nenhuma raiz configurada/);
});

test("init: contexto indexa fixtures e ignora ocultos/negados/fora do include", () => {
  const ctx = createContext(loadConfig(fixtureEnv(kb, harness)), new Logger("error"));
  ctx.index.refresh(true);
  const ids = ctx.index.all().map((d) => d.id);
  assert.ok(ids.includes("cofre:AI-Agent-Ecosystem/03-MCP-Servers/Serena.md"));
  assert.ok(ids.includes("harness:HARNESS/HARNESS MAIN/architecture.md"));
  assert.ok(!ids.some((i) => i.includes(".obsidian")), "não indexa .obsidian");
  assert.ok(!ids.some((i) => /chave de api/i.test(i)), "não indexa nota de chave");
  assert.ok(!ids.some((i) => i.includes("Fora/")), "não indexa fora do include");
  assert.ok(!ids.some((i) => i.endsWith(".txt")), "só .md");
});

test("init: processo com raiz inexistente sai com código 2 e mensagem em stderr", () => {
  const r = spawnSync(process.execPath, [serverEntry], { env: { ...process.env, AKM_VAULT_ROOTS: "x=/caminho/que/nao/existe" }, encoding: "utf8", timeout: 10000 });
  assert.notEqual(r.status, 0);
  assert.match(r.stderr, /não existe/);
});

test("init: servidor responde ao initialize via stdio", async () => {
  const c = await connect(fixtureEnv(kb, harness));
  try {
    const v = c.client.getServerVersion();
    assert.equal(v?.name, "agent-knowledge-mcp");
    assert.ok(c.client.getServerCapabilities()?.tools);
    assert.match(c.client.getInstructions() ?? "", /somente leitura/);
  } finally { await c.close(); }
});
