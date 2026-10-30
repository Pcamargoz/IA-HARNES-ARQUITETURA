#!/usr/bin/env node
// Cliente MCP mínimo (SDK oficial) para inspecionar o servidor manualmente.
// Uso: AKM_VAULT_ROOTS="cofre=/caminho;harness=/caminho" node scripts/smoke-client.mjs "termo de busca"
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { getDefaultEnvironment, StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const env = { ...getDefaultEnvironment() };
for (const [k, v] of Object.entries(process.env)) if (k.startsWith("AKM_") && v !== undefined) env[k] = v;
const transport = new StdioClientTransport({ command: process.execPath, args: [path.join(root, "dist/src/index.js")], env, stderr: "inherit" });
const client = new Client({ name: "akm-smoke", version: "0.0.1" });
await client.connect(transport);
const { tools } = await client.listTools();
console.log(`servidor: ${client.getServerVersion()?.name} ${client.getServerVersion()?.version}`);
console.log(`tools (${tools.length}): ${tools.map((t) => t.name).join(", ")}`);
const status = await client.callTool({ name: "knowledge_status", arguments: {} });
console.log(status.content[0].text);
const q = process.argv[2] ?? "serena";
const res = await client.callTool({ name: "search_knowledge", arguments: { query: q } });
console.log(res.content[0].text);
await client.close();
