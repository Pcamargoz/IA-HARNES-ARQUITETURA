import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const serverEntry = path.join(here, "..", "src", "index.mjs");
const vaultRoot = path.resolve(here, "..", "..");
const target = path.join(vaultRoot, "Inbox", ".smoke-write.md");
const external = path.join(vaultRoot, "Inbox", ".smoke-external.md");

const transport = new StdioClientTransport({
  command: process.execPath,
  args: [serverEntry],
  env: {
    ...process.env,
    VAULT_ROOT: vaultRoot,
    VAULT_ALLOW_WRITES: "1",
    VAULT_WRITE_ROOTS: "Inbox",
    VAULT_INDEX_TTL_MS: "0",
  },
});

const client = new Client({ name: "hermes-write-smoke", version: "0.1.0" });
let ok = false;

try {
  await client.connect(transport);

  const write = await client.callTool({
    name: "vault_write",
    arguments: {
      path: "Inbox/.smoke-write.md",
      content: "---\ntitle: smoke\n---\n# Smoke\ntest content",
      mode: "create",
    },
  });
  const writeText = write.content?.[0]?.text ?? "";
  if (write.isError || !writeText.includes('"ok": true')) {
    throw new Error(`write failed: ${writeText}`);
  }

  const read = await client.callTool({
    name: "vault_read",
    arguments: { path: "Inbox/.smoke-write.md", heading: "Smoke" },
  });
  const readText = read.content?.[0]?.text ?? "";
  if (read.isError || !readText.includes("test content")) {
    throw new Error(`read-back failed: ${readText}`);
  }

  const denied = await client.callTool({
    name: "vault_write",
    arguments: { path: "Process/bloqueado.md", content: "x", mode: "create" },
  });
  if (!denied.isError) throw new Error("write outside Inbox should fail");

  // A note created outside the server must show up without a restart.
  fs.writeFileSync(external, "---\ntitle: external\n---\n# External\nzebraquokka marker\n", "utf8");
  const fresh = await client.callTool({
    name: "vault_search",
    arguments: { query: "zebraquokka", limit: 3 },
  });
  if (!String(fresh.content?.[0]?.text).includes("Inbox/.smoke-external.md")) {
    throw new Error("index did not pick up an external change");
  }

  ok = true;
  console.log("PASS writes enabled in Inbox + read-back + blocked outside the area + index refresh");
} catch (error) {
  console.log(`FAIL ${error.message}`);
} finally {
  await client.close();
  fs.rmSync(target, { force: true });
  fs.rmSync(external, { force: true });
}

process.exit(ok ? 0 : 1);
