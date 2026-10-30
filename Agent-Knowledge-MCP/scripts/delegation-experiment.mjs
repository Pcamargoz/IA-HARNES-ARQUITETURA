#!/usr/bin/env node
// Experimento de delegação entre DOIS agentes reais (Universal Agent Runtime, akm.runtime.v1).
//
//   npm run experiment                              -> só PLANO (padrão): nada é executado, nenhum agente é iniciado.
//   npm run experiment -- --selftest                -> valida o próprio harness com 2 processos shell-echo (NÃO são LLMs).
//   npm run experiment -- --approve --agents a,b    -> executa de verdade (consome a conta/cota de cada CLI). Exige aprovação do Pedro.
//
// Regras: nunca simular um agente que não foi iniciado; tokens/custo só quando a ferramenta reporta.
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { CLI_ADAPTER_IDS, CLI_MANIFESTS, buildCliCommand, createCliAdapter, createShellEchoAdapter } from "../dist/src/runtime/index.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const argv = process.argv.slice(2);
const flag = (f) => argv.includes(f);
const opt = (f) => { const i = argv.indexOf(f); return i >= 0 ? argv[i + 1] : undefined; };
const outDir = path.resolve(opt("--out") ?? path.join(root, "runtime-output"));
const manifestPath = path.resolve(opt("--manifest") ?? path.join(outDir, "environment-manifest.json"));
const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\..*/, "");
fs.mkdirSync(outDir, { recursive: true });

// CLI detectada que corresponde a cada adapter.
const CLI_OF = { "claude-code": "claude", codex: "codex", opencode: "opencode", "gemini-cli": "gemini", "qwen-code": "qwen", "cursor-agent": "cursor-agent", "ollama-local": "ollama" };
const NUMBERS = [17, 25, 8, 41, 9];
const EXPECTED = NUMBERS.reduce((a, b) => a + b, 0);
const PROMPT = "Leia o arquivo input.txt neste diretório (um número inteiro por linha), some os números e responda SOMENTE com JSON no formato {\"sum\": N}. Não crie, altere nem apague arquivos.";
const CRITERIA = [
  "C1 processo terminou com status done (exit 0) dentro de 120 s",
  `C2 a resposta contém JSON {"sum": ${EXPECTED}}`,
  "C3 nenhum arquivo do diretório de trabalho foi criado, alterado ou apagado (hash antes/depois)",
  "C4 os dois agentes rodaram em processos distintos e simultâneos (janelas de tempo sobrepostas)",
];
const METRICS = ["latency_ms", "exit_code", "tokens_in/out/cached (só se reportado)", "cost_usd (só se reportado; senão unavailable)", "stdout/stderr bytes", "context_chars_sent", "success (C1–C3)", "retry_count (0: sem retry neste experimento)"];

function loadManifest() {
  if (!fs.existsSync(manifestPath)) return undefined;
  return JSON.parse(fs.readFileSync(manifestPath, "utf8"));
}
function eligibility(m) {
  return CLI_ADAPTER_IDS.map((id) => {
    const cli = m?.clis?.find((c) => c.id === CLI_OF[id]);
    let eligible = false; let reason;
    if (!m) reason = "manifest de ambiente ausente (rode npm run detect-env)";
    else if (!cli?.found) reason = "CLI não encontrada";
    else if (id === "ollama-local") {
      const ok = m.services?.ollama?.server && m.services.ollama.models.length > 0;
      eligible = Boolean(ok); reason = ok ? `local, sem conta; modelos: ${m.services.ollama.models.join(", ")}; é modelo sem ferramentas (recebe o arquivo no prompt)` : "servidor ollama sem modelos";
    } else if (cli.auth?.status === "authenticated") { eligible = true; reason = `login confirmado (${cli.auth.evidence}); consome a cota da conta`; }
    else reason = `login ${cli.auth?.status ?? "desconhecido"}`;
    return { adapter: id, cli: CLI_OF[id], version: cli?.version, eligible, reason };
  });
}
function hashDir(dir) {
  const h = {};
  for (const f of fs.readdirSync(dir).sort()) h[f] = crypto.createHash("sha256").update(fs.readFileSync(path.join(dir, f))).digest("hex");
  return h;
}
function makeWorkdir() {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), "akm-exp-"));
  fs.writeFileSync(path.join(d, "input.txt"), NUMBERS.join("\n") + "\n");
  return d;
}
function taskFor(id, workdir) {
  const base = { task_id: `exp-${stamp}-${id}`, prompt: PROMPT, workdir, permission_mode: "read-only", timeout_ms: 120_000, budget: { max_turns: 5 } };
  // Modelo sem ferramentas: o conteúdo do arquivo vai como contexto controlado.
  if (id.startsWith("shell-echo")) { base.timeout_ms = 10_000; base.prompt = `${PROMPT} #delay=400`; }
  if (id === "ollama-local") base.context = { snippets: [{ source: "input.txt", text: NUMBERS.join("\n") }], max_chars: 2000 };
  return base;
}
function sumFrom(output) {
  const m = /\{\s*"sum"\s*:\s*(-?\d+)\s*\}/.exec(output ?? "");
  return m ? Number(m[1]) : undefined;
}

const manifest = loadManifest();
const elig = eligibility(manifest);

if (!flag("--approve") && !flag("--selftest")) {
  const wd = "<diretório temporário criado na execução>";
  const plan = {
    schema: "akm.runtime.v1", kind: "delegation-experiment-plan", generated_at: new Date().toISOString(), status: "not_executed",
    note: "PLANO. Nenhum agente foi iniciado. Executar consome a conta/cota das CLIs e exige aprovação explícita do Pedro.",
    manifest: manifest ? { path: path.relative(root, manifestPath), generated_at: manifest.generated_at } : null,
    task: { prompt: PROMPT, input: NUMBERS, expected_sum: EXPECTED, timeout_ms: 120_000, permission_mode: "read-only" },
    criteria: CRITERIA, metrics: METRICS, eligibility: elig,
    commands: elig.filter((e) => e.eligible).map((e) => ({ adapter: e.adapter, ...buildCliCommand(e.adapter, { ...taskFor(e.adapter, wd) }) })),
    how_to_run: "npm run experiment -- --approve --agents <a>,<b>   (dois adapters elegíveis)",
  };
  const f = path.join(outDir, `experiment-plan-${stamp}.json`);
  fs.writeFileSync(f, JSON.stringify(plan, null, 2) + "\n");
  console.log(`PLANO (não executado) -> ${f}`);
  for (const e of elig) console.log(`${e.eligible ? "ELEGÍVEL " : "inelegível"} ${e.adapter.padEnd(13)} ${e.version ?? ""} — ${e.reason}`);
  for (const c of plan.commands) console.log(`  argv ${c.adapter}: ${c.command} ${c.args.map((a) => (/\s/.test(a) ? JSON.stringify(a) : a)).join(" ")}`);
  process.exit(0);
}

async function runPair(label, adapters) {
  const jsonl = path.join(outDir, `experiment-${label}-${stamp}.jsonl`);
  const results = await Promise.all(adapters.map(async ({ id, adapter }) => {
    const wd = makeWorkdir();
    const before = hashDir(wd);
    const init = await adapter.init();
    if (!init.ok) return { id, init, result: undefined, wd, before, after: before };
    const t = taskFor(id, wd);
    const { handle } = await adapter.send(t);
    const result = await adapter.receive(handle);
    return { id, init, result, wd, before, after: hashDir(wd) };
  }));
  const rows = results.map((r) => {
    const res = r.result;
    const sum = res ? sumFrom(res.output) : undefined;
    const c1 = res?.status === "done"; const c2 = sum === EXPECTED; const c3 = JSON.stringify(r.before) === JSON.stringify(r.after);
    return { schema: "akm.runtime.v1", event: "delegation_result", label, adapter: r.id, init: r.init, status: res?.status ?? "not_executed",
      error: res?.error, sum_reported: sum, criteria: { C1: c1, C2: label === "selftest" ? "n/a (shell-echo não é LLM)" : c2, C3: c3 },
      success: label === "selftest" ? c1 && c3 : c1 && c2 && c3, metrics: res?.metrics, output_preview: (res?.output ?? "").slice(0, 300) };
  });
  const ws = rows.map((r) => r.metrics && [Date.parse(r.metrics.started_at), Date.parse(r.metrics.ended_at)]).filter(Boolean);
  const overlap = ws.length === 2 && ws[0][0] < ws[1][1] && ws[1][0] < ws[0][1];
  for (const r of rows) fs.appendFileSync(jsonl, JSON.stringify(r) + "\n");
  const summary = { schema: "akm.runtime.v1", event: "delegation_summary", label, C4_concurrent: overlap,
    success_rate: rows.filter((r) => r.success).length / rows.length,
    latency_ms: rows.map((r) => r.metrics?.latency_ms ?? null),
    tokens: rows.map((r) => ({ adapter: r.adapter, source: r.metrics?.tokens_source ?? "unavailable", in: r.metrics?.tokens_in, out: r.metrics?.tokens_out })),
    cost: rows.map((r) => ({ adapter: r.adapter, source: r.metrics?.cost_source ?? "unavailable", usd: r.metrics?.cost_usd })) };
  fs.appendFileSync(jsonl, JSON.stringify(summary) + "\n");
  for (const r of results) fs.rmSync(r.wd, { recursive: true, force: true });
  console.log(`${label}: resultados -> ${jsonl}`);
  for (const r of rows) console.log(`- ${r.adapter}: status=${r.status} sucesso=${r.success} latência=${r.metrics?.latency_ms ?? "-"} ms tokens=${r.metrics?.tokens_source ?? "-"} custo=${r.metrics?.cost_source ?? "-"}${r.error ? ` erro=${r.error.code}` : ""}`);
  console.log(`- simultâneos (C4): ${overlap}`);
  return rows.every((r) => r.success) && overlap;
}

if (flag("--selftest")) {
  console.log("SELFTEST do harness com 2 processos shell-echo (NÃO são agentes LLM; nenhuma cota usada).");
  // Só valida mecânica: spawn, paralelismo, captura, hashes e JSONL.
  const ok = await runPair("selftest", [{ id: "shell-echo-A", adapter: createShellEchoAdapter() }, { id: "shell-echo-B", adapter: createShellEchoAdapter() }]);
  process.exit(ok ? 0 : 1);
}

const agents = (opt("--agents") ?? "").split(",").map((s) => s.trim()).filter(Boolean);
if (agents.length !== 2) { console.error("Use --agents <a>,<b> com exatamente dois adapters."); process.exit(2); }
for (const a of agents) {
  const e = elig.find((x) => x.adapter === a);
  if (!e) { console.error(`Adapter desconhecido: ${a}. Conhecidos: ${CLI_ADAPTER_IDS.join(", ")}`); process.exit(2); }
  if (!e.eligible) { console.error(`${a} não é elegível: ${e.reason}`); process.exit(2); }
}
console.log(`EXECUÇÃO REAL aprovada: ${agents.join(" + ")} (consome a cota de cada CLI).`);
const ok = await runPair("approved", agents.map((id) => ({ id, adapter: createCliAdapter(id) })));
process.exit(ok ? 0 : 1);
