#!/usr/bin/env node
// Gera o Capability Manifest REAL do computador onde roda (sem segredos).
// Uso: npm run detect-env [-- --no-auth] [--out <arquivo>]
// Só executa comandos de versão/status (sem login, sem tarefas de agente) e lê apenas NOMES de servidores MCP.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { detectEnvironment } from "../dist/src/runtime/detect.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const argv = process.argv.slice(2);
const outIdx = argv.indexOf("--out");
const out = outIdx >= 0 ? path.resolve(argv[outIdx + 1]) : path.join(root, "runtime-output", "environment-manifest.json");
const t0 = Date.now();
const m = await detectEnvironment({ checkAuth: !argv.includes("--no-auth") });
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(m, null, 2) + "\n", { mode: 0o600 });
const found = m.clis.filter((c) => c.found);
console.log(`manifest: ${out} (${Date.now() - t0} ms)`);
console.log(`host: ${m.host.os_version ?? m.host.platform} ${m.host.arch} ${m.host.cpus} CPUs ${m.host.mem_gb} GB node ${m.host.node}`);
console.log(`CLIs: ${found.map((c) => `${c.id}=${c.version}`).join(" | ")}`);
console.log(`ausentes: ${m.clis.filter((c) => !c.found).map((c) => c.id).join(", ")}`);
console.log(`login: ${found.filter((c) => c.auth).map((c) => `${c.id}=${c.auth.status}`).join(", ")}`);
console.log(`MCP: ${m.mcp_configs.filter((x) => x.exists).map((x) => `${x.client}[${x.servers.join(",")}]`).join(" ")}`);
console.log(`apps: ${m.apps.map((a) => `${a.id}=${a.installed ? a.version ?? "?" : "não"}${a.running ? " (rodando)" : ""}`).join(", ")}`);
console.log(`paralelo: ${m.parallel_probe.processes}x${m.parallel_probe.each_ms}ms em ${m.parallel_probe.wall_ms}ms`);
for (const c of m.capabilities) console.log(`[${c.status}] ${c.label}`);
