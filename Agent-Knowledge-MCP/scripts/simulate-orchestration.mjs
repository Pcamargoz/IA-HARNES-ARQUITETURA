#!/usr/bin/env node
// Simulação determinística da validação E2E em 9 passos, SEM LLM e SEM APIs pagas.
// Usa o cliente MCP oficial (stdio) contra o servidor local, escolhe um agente por regras fixas,
// gera o handoff e grava telemetria JSONL (schema akm.orchestration.v1) FORA do cofre.
// Uso: AKM_VAULT_ROOTS="cofre=...;harness=..." node scripts/simulate-orchestration.mjs [--task "..."] [--out dir]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { getDefaultEnvironment, StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > -1 ? process.argv[i + 1] : d; };
const TASK = arg("--task", "Corrigir bug de validação de data no endpoint REST de reservas (Spring Boot) e adicionar teste de regressão");
const OUT = path.resolve(arg("--out", path.join(repo, "validation-output")));
for (const pair of (process.env.AKM_VAULT_ROOTS ?? "").split(";").filter(Boolean)) {
  const p = pair.slice(pair.indexOf("=") + 1);
  if (p && (OUT + path.sep).startsWith(path.resolve(p) + path.sep)) { console.error(`--out não pode ficar dentro de um vault (${p})`); process.exit(2); }
}
fs.mkdirSync(OUT, { recursive: true });

const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\..+/, "");
const RUN = `sim-${stamp}`;
const TASK_ID = "T-SIM-001";
const jsonlPath = path.join(OUT, `${RUN}.jsonl`);
const events = [];
const est = (n) => Math.ceil(n / 4);
const emit = (step, event, extra = {}) => {
  const e = { schema: "akm.orchestration.v1", ts: new Date().toISOString(), run_id: RUN, task_id: TASK_ID, step, event, llm_calls: 0, cost_usd: 0, ...extra };
  events.push(e);
  fs.appendFileSync(jsonlPath, JSON.stringify(e) + "\n");
};

const env = { ...getDefaultEnvironment() };
for (const [k, v] of Object.entries(process.env)) if (k.startsWith("AKM_") && v !== undefined) env[k] = v;
const client = new Client({ name: "akm-orchestration-sim", version: "0.2.0" });
await client.connect(new StdioClientTransport({ command: process.execPath, args: [path.join(repo, "dist/src/index.js")], env, stderr: "inherit" }));

let curStep = 0;
const calls = [];
async function call(name, args) {
  const t0 = performance.now();
  const r = await client.callTool({ name, arguments: args });
  const text = r.content?.[0]?.text ?? "";
  const ms = Math.round(performance.now() - t0);
  const cin = JSON.stringify(args).length;
  emit(curStep, "tool_call", { tool: name, duration_ms: ms, chars_in: cin, chars_out: text.length, est_tokens_in: est(cin), est_tokens_out: est(text.length), status: r.isError ? "error" : "ok" });
  calls.push({ step: curStep, tool: name, args, ms, chars: text.length, error: !!r.isError });
  if (r.isError) throw new Error(`${name}: ${text}`);
  return text;
}
const json = async (name, args) => JSON.parse(await call(name, { ...args, format: "json" }));

const t0 = performance.now();
const report = { run_id: RUN, task: TASK, steps: [] };
const step = (n, title, data) => { report.steps.push({ n, title, ...data }); };
try {
  // Os 9 passos seguem a lista de validação E2E definida pelo Pedro.
  // 1. Recebimento de uma tarefa pelo Main Orchestrator
  curStep = 1; emit(1, "task_received", { agent: "main-agent", chars_in: TASK.length, data: { task: TASK } });
  const deleg = await call("get_orchestrator_policy", { section: "Quando executar direto e quando delegar" });
  emit(1, "policy_loaded", { data: { orchestrator_policy_chars: deleg.length } });
  step(1, "Recebimento da tarefa pelo Main Orchestrator", { task: TASK, orchestrator: "main-agent", orchestrator_policy_chars: deleg.length });

  // 2. Identificação da especialização necessária (regras fixas por palavra-chave + papéis do workflow, sem LLM)
  curStep = 2;
  const n = TASK.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
  const RULES = [["fix", /\b(bug|erro|falha|corrigir|fix|regress)/], ["review", /\b(revisar|review|auditar)/], ["research", /\b(pesquisar|comparar|avaliar)/], ["docs", /\b(documentar|adr|readme)/], ["feature", /\b(implementar|criar|endpoint|feature|adicionar)/]];
  const task_type = (RULES.find(([, re]) => re.test(n)) ?? ["feature"])[0];
  const complexity = n.split(/\s+/).length > 25 ? "alta" : /\b(teste|test|spring|java)/.test(n) ? "media" : "baixa";
  const STACK = [["java-spring", /\b(spring|java|jpa|maven)/], ["frontend", /\b(react|frontend|playwright|css)/], ["dados", /\b(postgres|sql|banco|schema)/], ["testes", /\b(teste|test|regress)/], ["docs", /\b(documentar|adr|readme)/]];
  const specialization = STACK.filter(([, re]) => re.test(n)).map(([k]) => k);
  emit(2, "classified", { data: { task_type, complexity, specialization, rule: "primeira regra que casa, na ordem fix>review>research>docs>feature" } });
  const wf = await json("find_workflow_template", { task: TASK, task_type });
  const workflow = wf.templates[0];
  emit(2, "workflow_selected", { data: { workflow: workflow?.name ?? null, score: workflow?.score ?? 0, roles: workflow?.agents ?? [], candidates: wf.templates.map((t) => `${t.name}:${t.score}`) } });
  step(2, "Identificação da especialização necessária", { task_type, complexity, specialization, workflow: workflow?.name, workflow_score: workflow?.score, roles: workflow?.agents ?? [], candidates: wf.templates.map((t) => `${t.name}=${t.score}`) });

  // 3. Seleção de um agente existente ou proposta de criação
  //    score = 0.5*aderência(termos) + 0.3*(papel previsto no workflow) + bônus de status (implemented +0.2, planned 0, conceptual -0.2)
  //    Só agentes implemented executam. Se nenhum implemented tiver aderência >= 0,3, propõe criar/ativar o melhor
  //    candidato não implementado (exige aprovação; nada é criado).
  curStep = 3;
  const agents = await json("list_registered_agents", { query: TASK, limit: 100 });
  const BONUS = { implemented: 0.2, planned: 0, conceptual: -0.2 };
  const wfAgents = new Set(workflow?.agents ?? []);
  const ranked = agents.map((a) => ({ name: a.name, status: a.status, term: a.score, inWf: wfAgents.has(a.name),
    score: Math.round((0.5 * a.score + (wfAgents.has(a.name) ? 0.3 : 0) + (BONUS[a.status] ?? -0.5)) * 1000) / 1000 }))
    .sort((x, y) => y.score - x.score || x.name.localeCompare(y.name));
  const executor = ranked.find((r) => r.status === "implemented") ?? ranked[0];
  const MIN_TERM = 0.3;
  const bestNonImpl = ranked.find((r) => r.status !== "implemented");
  const proposal = executor.term < MIN_TERM && bestNonImpl
    ? { action: bestNonImpl.status === "planned" ? "ativar agente planejado" : "criar agente conceitual", agent: bestNonImpl.name, status: bestNonImpl.status, reason: `nenhum agente implementado com aderência >= ${MIN_TERM}`, requires_approval: true }
    : null;
  emit(3, "agent_selected", { agent: executor.name, data: { score: executor.score, term_match: executor.term, top3: ranked.slice(0, 3).map((r) => `${r.name}:${r.score}:${r.status}`) } });
  if (proposal) emit(3, "hitl", { status: "pending", data: { kind: "agent_creation_proposal", ...proposal } });
  step(3, "Seleção de agente existente ou proposta de criação", { executor: executor.name, executor_score: executor.score, executor_term_match: executor.term, top5: ranked.slice(0, 5), proposal });

  // 4. Recuperação de conhecimento via MCP
  curStep = 4;
  const limits = await call("get_execution_policy", { section: "limites" });
  const spec = await json("get_agent_specification", { name: executor.name });
  const sk = await json("find_relevant_skills", { task: TASK, agent: executor.name, limit: 5 });
  const adrs = await json("get_architecture_decisions", { query: "telemetria jsonl" });
  emit(4, "skills_selected", { agent: executor.name, data: { skills: sk.skills.map((s) => s.name), expected_not_found: sk.expected_not_found.map((s) => s.name) } });
  step(4, "Recuperação de conhecimento via MCP", { execution_limits_chars: limits.length, agent_spec: `${spec.name} [${spec.status}]`, skills: sk.skills.map((s) => `${s.name} (${s.kind}, ${Math.round(s.score * 1000) / 1000})`), expected_not_found: sk.expected_not_found.map((s) => s.name), adrs: adrs.map((a) => `${a.key} (${a.status})`) });

  // 5. Delegação controlada (handoff + guardas antes de entregar ao executor)
  curStep = 5;
  const b = spec.budget ?? {};
  const handoff = [
    `# Handoff — ${TASK_ID} → ${spec.name}`,
    `Objetivo: ${TASK}`,
    `Contexto: classificação=${task_type}/${complexity}; especialização=${specialization.join("+") || "-"}; workflow=${workflow?.name ?? "padrão do Harness"}; proposta pendente: ${proposal ? `${proposal.action} ${proposal.agent} [${proposal.status}] — exige aprovação` : "nenhuma"}`,
    `Escopo: reproduzir o bug, corrigir a validação, adicionar teste de regressão`,
    `Fora de escopo: refatorações não relacionadas; mudanças de configuração; push`,
    `Critérios de aceite: 1) teste de regressão falha antes e passa depois; 2) suíte existente verde; 3) sem novos avisos de segurança`,
    `Evidência esperada: saída dos testes; diff dos arquivos alterados`,
    `Arquivos que possui: (definir na etapa Specify; um escritor por arquivo)`,
    `Restrições: stack Java/Spring Boot; autonomia ${spec.autonomy ?? "A1"}; ferramentas permitidas: ${spec.tools.join(", ") || "-"}; proibidas: ${spec.disallowed_tools.join(", ") || "-"}`,
    `Orçamento: max_turns=${b.max_turns ?? "?"}, max_retries=${b.max_retries ?? "?"}, timeout_min=${b.timeout_min ?? "?"}, tier=${spec.tier ?? "?"}`,
    `Aprovações: nenhuma além da leitura (simulação)`,
    `Workflow: ${workflow?.name ?? "-"} · etapa 1`,
    `Skills: ${sk.skills.map((s) => s.name).join(", ") || "-"}`,
    `Retorno: status done | partial | blocked + evidência + itens em aberto`,
  ].join("\n") + "\n";
  const REQUIRED = ["Objetivo:", "Escopo:", "Fora de escopo:", "Critérios de aceite:", "Evidência esperada:", "Orçamento:", "Retorno:"];
  const guards = {
    executor_implementado: spec.status === "implemented",
    orcamento_definido: [b.max_turns, b.max_retries, b.timeout_min].every((x) => x !== undefined),
    handoff_campos_obrigatorios: REQUIRED.every((r) => handoff.includes(r)),
    sem_acao_irreversivel: !/\b(push|deploy|delete|apagar)\b/i.test(handoff.split("\n").filter((l) => !l.startsWith("Fora de escopo:")).join("\n")),
  };
  const delegated = Object.values(guards).every(Boolean);
  const handoffPath = path.join(OUT, `${RUN}-handoff.md`);
  fs.writeFileSync(handoffPath, handoff, { flag: "wx" });
  emit(5, "handoff", { agent: spec.name, status: delegated ? "ok" : "error", chars_out: handoff.length, est_tokens_out: est(handoff.length), data: { file: path.basename(handoffPath), guards } });
  step(5, "Delegação controlada", { file: handoffPath, chars: handoff.length, guards, delegated });

  // 6. Execução da tarefa — SIMULADA: nenhum modelo é chamado e nenhum código é alterado.
  //    O executor devolve um resultado fixo no formato do Retorno do handoff.
  curStep = 6;
  const result = delegated
    ? { status: "done", simulated: true, files_changed: [], evidence: [path.basename(handoffPath)], open_items: ["execução real pendente: exige LLM e aprovação"] }
    : { status: "blocked", simulated: true, files_changed: [], evidence: [], open_items: ["guardas da delegação falharam"] };
  emit(6, "task_executed", { agent: executor.name, status: result.status, data: result });
  step(6, "Execução da tarefa (simulada)", { result });

  // 7. Validação do resultado (checagens estruturais; verificador separado do executor)
  curStep = 7;
  const checks = {
    ...guards,
    workflow_encontrado: !!workflow,
    retorno_no_formato: ["done", "partial", "blocked"].includes(result.status) && Array.isArray(result.evidence),
    evidencia_presente: result.evidence.length > 0,
    sem_llm: events.every((e) => e.llm_calls === 0),
    adr_telemetria_encontrada: adrs.some((a) => /telemetria/i.test(a.title)),
  };
  const passed = Object.values(checks).every(Boolean);
  emit(7, "verification", { agent: "verifier (script)", status: passed ? "ok" : "error", data: checks });
  step(7, "Validação do resultado", { checks, passed });

  // 8. Registro das métricas disponíveis
  curStep = 8;
  const metrics = await json("get_metric_definitions", {});
  const toolEvents = events.filter((e) => e.event === "tool_call");
  const measured = {
    tool_calls: toolEvents.length, tool_errors: toolEvents.filter((e) => e.status !== "ok").length,
    chars_out_total: toolEvents.reduce((s, e) => s + e.chars_out, 0), est_tokens_out_total: toolEvents.reduce((s, e) => s + e.est_tokens_out, 0),
    duration_ms: Math.round(performance.now() - t0), llm_calls: 0, cost_usd: 0,
    agent_selection_score: executor.score, agent_term_match: executor.term, verification_passed: passed,
  };
  emit(8, "metrics_recorded", { data: { ...measured, catalog_size: metrics.metrics.length } });
  step(8, "Registro das métricas disponíveis", { catalog_size: metrics.metrics.length, measured });

  // 9. Encerramento e documentação
  curStep = 9;
  const status = passed ? "done" : "partial";
  emit(9, "task_completed", { agent: executor.name, status, duration_ms: Math.round(performance.now() - t0), data: { events: events.length + 1, report: `${RUN}-report.json`, handoff: path.basename(handoffPath) } });
  step(9, "Encerramento e documentação", { status, jsonl: jsonlPath, report: path.join(OUT, `${RUN}-report.json`), events: events.length });
  report.summary = measured;
  report.ok = passed;
} catch (e) {
  emit(curStep, "task_completed", { status: "blocked", data: { error: String(e.message ?? e) } });
  report.ok = false; report.error = String(e.message ?? e);
} finally {
  await client.close();
}
report.calls = calls;
fs.writeFileSync(path.join(OUT, `${RUN}-report.json`), JSON.stringify(report, null, 2), { flag: "wx" });
console.log(JSON.stringify(report, null, 2));
process.exit(report.ok ? 0 : 1);
