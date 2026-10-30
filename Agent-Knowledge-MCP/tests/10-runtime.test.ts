import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  AGENT_RESULT_SCHEMA, AGENT_TASK_SCHEMA, CAPABILITY_MANIFEST_SCHEMA, CLI_ADAPTER_IDS, CLI_MANIFESTS, NOOP_MANIFEST, NoopAdapter,
  SHELL_ECHO_MANIFEST, buildCliCommand, checkTask, createShellEchoAdapter, detectEnvironment, parseClaudeJson, parseCodexJsonl,
  parseGeminiJson, parseResultEnvelope, renderContext, scrub, validate, type AgentTask,
} from "../src/runtime/index.js";
import { expectedCost } from "../src/tools/get_model_routing_policy.js";
import { connect, fixtureEnv, fixtures, isError, text } from "./helpers.js";

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "akm-rt-"));
const task = (over: Partial<AgentTask> = {}): AgentTask => ({
  task_id: "t1", prompt: "olá", workdir: tmp, permission_mode: "read-only", timeout_ms: 5000, ...over,
});

test("shell-echo: processo real, resposta capturada, métricas e schema", async () => {
  const a = createShellEchoAdapter();
  const init = await a.init();
  assert.equal(init.ok, true);
  const { handle } = await a.send(task({ prompt: "soma 2+2", context: { snippets: [{ source: "nota", text: "contexto" }], max_chars: 500 } }));
  const r = await a.receive(handle);
  assert.equal(r.status, "done");
  assert.match(r.output, /contexto-controlado[\s\S]*soma 2\+2/);
  const s = r.structured as { pid: number; chars: number };
  assert.ok(s.pid > 0 && s.pid !== process.pid, "pid de outro processo");
  assert.equal(r.metrics.exit_code, 0);
  assert.equal(r.metrics.tokens_source, "unavailable");
  assert.ok(r.metrics.context_chars_sent > 0);
  assert.deepEqual(validate(AGENT_RESULT_SCHEMA, r), []);
});

test("shell-echo: timeout, cancelamento e falha com códigos estáveis", async () => {
  const a = createShellEchoAdapter();
  const t1 = await a.send(task({ prompt: "#delay=3000", timeout_ms: 300 }));
  const r1 = await a.receive(t1.handle);
  assert.equal(r1.status, "timeout"); assert.equal(r1.error?.code, "timeout"); assert.equal(r1.error?.retryable, true);
  const t2 = await a.send(task({ prompt: "#delay=3000" }));
  setTimeout(() => void a.cancel(t2.handle, "teste"), 150);
  const r2 = await a.receive(t2.handle);
  assert.equal(r2.status, "cancelled"); assert.equal(r2.error?.message, "teste");
  const r3 = await a.receive((await a.send(task({ prompt: "#fail" }))).handle);
  assert.equal(r3.status, "failed"); assert.equal(r3.error?.code, "non_zero_exit"); assert.equal(r3.metrics.exit_code, 3);
});

test("shell-echo: 4 sessões simultâneas em processos independentes", async () => {
  const a = createShellEchoAdapter();
  const t0 = Date.now();
  const hs = await Promise.all([1, 2, 3, 4].map((i) => a.send(task({ task_id: `p${i}`, prompt: `#delay=500 tarefa ${i}` }))));
  const rs = await Promise.all(hs.map((h) => a.receive(h.handle)));
  const wall = Date.now() - t0;
  assert.ok(rs.every((r) => r.status === "done"));
  assert.equal(new Set(rs.map((r) => (r.structured as { pid: number }).pid)).size, 4);
  assert.ok(wall < 1800, `paralelo (${wall} ms para 4×500 ms)`);
});

test("contrato: checkTask, contexto acima do teto e comando inexistente", async () => {
  assert.equal(checkTask(SHELL_ECHO_MANIFEST, task({ permission_mode: "workspace-write" }))?.code, "permission_denied");
  assert.equal(checkTask(SHELL_ECHO_MANIFEST, task({ session_id: "x" }))?.code, "unsupported_capability");
  assert.equal(checkTask(SHELL_ECHO_MANIFEST, task({ timeout_ms: 10_000_000 }))?.code, "unsupported_capability");
  assert.throws(() => renderContext({ snippets: [{ source: "a", text: "x".repeat(500) }], max_chars: 100 }), /context_too_large|excede/);
  const a = createShellEchoAdapter();
  const r = await a.receive((await a.send(task({ context: { snippets: [{ source: "a", text: "x".repeat(500) }], max_chars: 100 } }))).handle);
  assert.equal(r.error?.code, "context_too_large");
});

test("noop: rotulado, nunca inventa resposta", async () => {
  const a = new NoopAdapter();
  const r = await a.receive((await a.send(task())).handle);
  assert.equal(r.status, "not_executed"); assert.equal(r.output, ""); assert.equal(r.error?.code, "not_executed");
  assert.equal(NOOP_MANIFEST.kind, "test-double");
});

test("manifests e schemas: todos válidos; CLIs são spec-only e começam read-only", () => {
  for (const m of [SHELL_ECHO_MANIFEST, NOOP_MANIFEST, ...CLI_MANIFESTS]) assert.deepEqual(validate(CAPABILITY_MANIFEST_SCHEMA, m), [], m.adapter);
  assert.deepEqual(validate(AGENT_TASK_SCHEMA, task()), []);
  assert.ok(validate(AGENT_TASK_SCHEMA, { prompt: 1 }).length > 0);
  for (const m of CLI_MANIFESTS) { assert.equal(m.status, "spec-only"); assert.equal(m.permissions.default_mode, "read-only"); assert.ok(m.verified?.source); }
  const argv = (id: string) => buildCliCommand(id, task({ prompt: "P" })).args.join(" ");
  assert.match(argv("claude-code"), /-p P --output-format json --permission-mode dontAsk --allowedTools Read,Grep,Glob/);
  assert.match(argv("codex"), /^exec --json --sandbox read-only/);
  assert.match(argv("qwen-code"), /--approval-mode plan/);
  assert.doesNotMatch(argv("cursor-agent"), /--force|--yolo/);
  assert.ok(CLI_ADAPTER_IDS.includes("opencode"));
  assert.throws(() => buildCliCommand("inexistente", task()));
});

test("parsers: amostras no formato da documentação oficial (dados sintéticos)", () => {
  const c = parseClaudeJson('{"type":"result","result":"ok","session_id":"s1","total_cost_usd":0.01,"usage":{"input_tokens":10,"output_tokens":5,"cache_read_input_tokens":2}}');
  assert.deepEqual([c.output, c.session_id, c.tokens_in, c.tokens_out, c.tokens_cached, c.cost_usd], ["ok", "s1", 10, 5, 2, 0.01]);
  const x = parseCodexJsonl(['{"type":"thread.started","thread_id":"th"}', '{"type":"item.completed","item":{"type":"agent_message","text":"feito"}}',
    '{"type":"turn.completed","usage":{"input_tokens":100,"cached_input_tokens":40,"output_tokens":7,"reasoning_output_tokens":3}}'].join("\n"));
  assert.deepEqual([x.output, x.session_id, x.tokens_in, x.tokens_out, x.tokens_cached, x.is_error], ["feito", "th", 100, 10, 40, false]);
  assert.equal(parseResultEnvelope('[{"type":"system"},{"type":"result","result":"r","usage":{"input_tokens":3}}]').output, "r");
  assert.equal(parseResultEnvelope('{"type":"result","result":"z","is_error":true}').is_error, true);
  assert.equal(parseGeminiJson('{"response":"g","stats":{}}').output, "g");
});

test("custo esperado: o modelo barato com baixa taxa de sucesso pode custar mais por sucesso", () => {
  const cheap = expectedCost({ name: "barato", cost_per_attempt: 1, success_rate: 0.3, rework_cost: 4, max_attempts: 3 });
  const good = expectedCost({ name: "forte", cost_per_attempt: 3, success_rate: 0.95, rework_cost: 4, max_attempts: 3 });
  assert.ok(cheap.cost_per_success > good.cost_per_success, JSON.stringify({ cheap, good }));
  assert.equal(expectedCost({ name: "certo", cost_per_attempt: 2, success_rate: 1 }).expected_cost, 2);
});

test("detect: HOME e PATH falsos (fixtures); só nomes de MCP; e-mails e ids omitidos", async () => {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), "akm-home-"));
  const bin = path.join(home, "bin"); fs.mkdirSync(bin);
  const fake = (name: string, body: string) => { fs.writeFileSync(path.join(bin, name), `#!/bin/sh\n${body}\n`, { mode: 0o755 }); };
  fake("claude", 'if [ "$1" = "--version" ]; then echo "9.9.9 (Claude Code)"; else echo \'{"loggedIn":true,"authMethod":"claude.ai","email":"alguem@example.com","orgId":"123e4567-e89b-12d3-a456-426614174000","subscriptionType":"pro"}\'; fi');
  fake("codex", 'if [ "$1" = "--version" ]; then echo "codex-cli 0.0.1"; else echo "Not logged in"; fi');
  fake("cursor-agent", 'if [ "$1" = "--version" ]; then echo "2026.1"; else echo "✓ Logged in as fulano@example.com"; fi');
  fs.writeFileSync(path.join(home, ".claude.json"), JSON.stringify({ mcpServers: { "srv-a": { env: { API_KEY: "sk-ant-segredo-que-nao-pode-vazar-123" } } }, oauthAccount: { emailAddress: "x@y.com" } }));
  fs.mkdirSync(path.join(home, ".codex"));
  fs.writeFileSync(path.join(home, ".codex/config.toml"), '[mcp_servers.node_repl]\ncommand = "x"\n[mcp_servers.node_repl.env]\nTOKEN="abc"\n');
  const m = await detectEnvironment({ home, pathEnv: bin, extraDirs: [], clis: ["claude", "codex", "cursor-agent", "gemini"], applicationsDir: path.join(home, "Apps") });
  const json = JSON.stringify(m);
  assert.doesNotMatch(json, /@example\.com|x@y\.com|123e4567|sk-ant|segredo|abc"/);
  const c = (id: string) => m.clis.find((x) => x.id === id)!;
  assert.equal(c("claude").auth?.status, "authenticated"); assert.equal(c("claude").auth?.plan, "pro"); assert.equal(c("claude").path, "~/bin/claude");
  assert.equal(c("codex").auth?.status, "not_authenticated");
  assert.equal(c("cursor-agent").auth?.status, "authenticated");
  assert.equal(c("gemini").found, false);
  assert.deepEqual(m.mcp_configs.find((x) => x.client === "claude-code (user)")?.servers, ["srv-a"]);
  assert.deepEqual(m.mcp_configs.find((x) => x.client === "codex")?.servers, ["node_repl"]);
  assert.equal(m.capabilities.length, 7);
  assert.equal(m.apps.find((a) => a.id === "maestri")?.installed, false);
  assert.equal(m.services.ollama, undefined);
  assert.ok(m.notes.some((n) => /Hermes/.test(n) && /fora do escopo/.test(n)));
  assert.match(scrub("a@b.co /h/x", "/h"), /<email-omitido> ~\/x/);
});

test("tools MCP do runtime via cliente real (fixtures)", async () => {
  const c = await connect(fixtureEnv(path.join(fixtures, "kb-vault"), path.join(fixtures, "harness-vault")));
  const call = async (name: string, args: Record<string, unknown> = {}) => c.client.callTool({ name, arguments: args });
  try {
    let r = await call("get_runtime_architecture");
    assert.match(text(r), /overview/); assert.match(text(r), /router/);
    r = await call("get_runtime_architecture", { component: "overview", section: "Fluxo" });
    assert.match(text(r), /init → send/);
    assert.equal(isError(await call("get_runtime_architecture", { component: "zzz" })), true);

    r = await call("list_agent_adapters", { format: "json" });
    const j = JSON.parse(text(r)) as { adapters: Array<{ adapter: string; implementation: string; detected: { installed?: boolean; auth: string } }> };
    const a = (id: string) => j.adapters.find((x) => x.adapter === id)!;
    assert.equal(a("shell-echo").implementation, "implemented");
    assert.equal(a("claude-code").implementation, "spec-only");
    assert.equal(a("claude-code").detected.auth, "authenticated");
    assert.equal(a("gemini-cli").detected.installed, false);
    assert.equal(a("futuro-api").implementation, "planned");
    r = await call("list_agent_adapters", { available_only: true });
    assert.match(text(r), /codex/); assert.doesNotMatch(text(r), /opencode \[/); assert.doesNotMatch(text(r), /gemini-cli/);
    r = await call("list_agent_adapters", { capability: "token_usage" });
    assert.match(text(r), /futuro-api/);

    r = await call("get_model_routing_policy");
    assert.match(text(r), /2 fatores/); assert.match(text(r), /trivial/);
    r = await call("get_model_routing_policy", { complexity: "complexa" });
    assert.match(text(r), /frontier/);
    r = await call("get_model_routing_policy", { compare: [{ name: "a", cost_per_attempt: 1, success_rate: 0.3, rework_cost: 4 }, { name: "b", cost_per_attempt: 3, success_rate: 0.95 }] });
    assert.match(text(r), /estimativa/); assert.ok(text(r).indexOf("- b:") < text(r).indexOf("- a:"));

    r = await call("get_environment_capabilities");
    assert.match(text(r), /Login confirmado: claude, codex/);
    r = await call("get_environment_capabilities", { section: "mcp" });
    assert.match(text(r), /exemplo-vault/);

    r = await call("get_metric_definitions", { format: "json" });
    assert.match(text(r), /retry_rate/);
  } finally { await c.close(); }
});

test("get_environment_capabilities sem manifest: erro instrutivo", async () => {
  const c = await connect(fixtureEnv(path.join(fixtures, "kb-vault"), path.join(fixtures, "harness-vault"), { AKM_RUNTIME_MANIFEST: path.join(tmp, "nao-existe.json") }));
  try {
    const r = await c.client.callTool({ name: "get_environment_capabilities", arguments: {} });
    assert.equal(isError(r), true); assert.match(text(r), /detect-env/);
    const l = await c.client.callTool({ name: "list_agent_adapters", arguments: {} });
    assert.match(text(l), /manifest de ambiente: ausente/);
  } finally { await c.close(); }
});
