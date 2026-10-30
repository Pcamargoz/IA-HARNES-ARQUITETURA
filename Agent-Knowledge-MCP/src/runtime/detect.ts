import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { RUNTIME_SCHEMA_VERSION } from "./port.js";

/**
 * Environment Detection. Descobre o que EXISTE na máquina, sem presumir:
 * CLIs (caminho + versão), status de login por comandos oficiais sem efeito colateral,
 * NOMES de servidores MCP nas configs (nunca valores), apps (Maestri), Ollama (Docker e Hermes fora do escopo),
 * e testa paralelismo de verdade. Nunca lê arquivos de credencial: para eles só checa existência.
 * Tudo o que sai passa por `scrub` (remove e-mails, ids longos e o caminho da home).
 */

export interface CliInfo {
  id: string; found: boolean; path?: string; version?: string;
  auth?: { status: "authenticated" | "not_authenticated" | "unknown" | "not_checked"; method?: string; plan?: string; evidence: string };
}
export interface McpConfigInfo { client: string; file: string; exists: boolean; servers: string[]; note?: string }
export interface CapabilityCheck { id: string; label: string; status: "yes" | "partial" | "no" | "not_verified"; evidence: string }
export interface EnvironmentManifest {
  schema: typeof RUNTIME_SCHEMA_VERSION; kind: "environment-manifest"; generated_at: string;
  host: { platform: string; release: string; os_version?: string; arch: string; cpus: number; cpu_model: string; mem_gb: number; node: string; shell?: string };
  execution_context: { stdin_tty: boolean; stdout_tty: boolean; parent_chain: string[]; inside_maestri_terminal: boolean };
  clis: CliInfo[];
  mcp_configs: McpConfigInfo[];
  apps: Array<{ id: string; installed: boolean; version?: string; running?: boolean; cli?: string; note?: string }>;
  services: { ollama?: { server: boolean; models: string[] } };
  parallel_probe: { processes: number; each_ms: number; wall_ms: number; parallel: boolean };
  capabilities: CapabilityCheck[];
  notes: string[];
}

export interface DetectOptions {
  home?: string; pathEnv?: string; checkAuth?: boolean; timeoutMs?: number;
  /** Lista de CLIs a procurar (padrão: DEFAULT_CLIS). */
  clis?: string[];
  /** Diretórios extras além do PATH. */
  extraDirs?: string[];
  applicationsDir?: string;
}

export const DEFAULT_CLIS = ["opencode", "codex", "claude", "gemini", "aider", "goose", "qwen", "cursor-agent", "ollama",
  "node", "npm", "git", "gh", "tmux", "python3", "jq"];

const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
const LONG_ID = /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi;
const TOKENISH = /\b(sk-|ghp_|xox[abp]-|AIza)[A-Za-z0-9_-]{8,}/g;

export function scrub(s: string, home: string): string {
  let out = s.replace(EMAIL, "<email-omitido>").replace(LONG_ID, "<id-omitido>").replace(TOKENISH, "<segredo-omitido>");
  if (home && home !== "/") out = out.split(home).join("~");
  return out;
}

function run(cmd: string, args: string[], timeoutMs: number, env?: NodeJS.ProcessEnv): Promise<{ code: number | null; out: string; err: string; ms: number }> {
  return new Promise((resolve) => {
    const t0 = Date.now();
    let out = ""; let err = "";
    let child;
    try { child = spawn(cmd, args, { stdio: ["ignore", "pipe", "pipe"], env: env ?? process.env }); } catch (e) {
      resolve({ code: null, out: "", err: String(e), ms: 0 }); return;
    }
    const timer = setTimeout(() => child.kill("SIGKILL"), timeoutMs);
    child.stdout?.on("data", (d: Buffer) => { if (out.length < 200_000) out += d.toString(); });
    child.stderr?.on("data", (d: Buffer) => { if (err.length < 200_000) err += d.toString(); });
    child.on("error", (e) => { clearTimeout(timer); resolve({ code: null, out, err: err || e.message, ms: Date.now() - t0 }); });
    child.on("close", (code) => { clearTimeout(timer); resolve({ code, out, err, ms: Date.now() - t0 }); });
  });
}

function which(id: string, dirs: string[]): string | undefined {
  for (const d of dirs) {
    const p = path.join(d, id);
    try { const st = fs.statSync(p); if (st.isFile() && (st.mode & 0o111)) return p; } catch { /* ausente */ }
  }
  return undefined;
}

function firstLine(s: string): string {
  return s.split("\n").map((l) => l.trim()).find((l) => l && !/^warning/i.test(l))?.slice(0, 120) ?? "";
}

function jsonKeys(file: string, pick: (j: Record<string, unknown>) => unknown): string[] {
  const j = JSON.parse(fs.readFileSync(file, "utf8")) as Record<string, unknown>;
  const v = pick(j);
  return v && typeof v === "object" ? Object.keys(v as object).sort() : [];
}

async function authStatus(id: string, bin: string, home: string, t: number): Promise<CliInfo["auth"]> {
  const exists = (rel: string) => fs.existsSync(path.join(home, rel));
  switch (id) {
    case "claude": {
      const r = await run(bin, ["auth", "status"], t);
      try {
        const j = JSON.parse(r.out) as Record<string, unknown>;
        return { status: j.loggedIn === true ? "authenticated" : "not_authenticated", method: String(j.authMethod ?? "?"),
          plan: j.subscriptionType ? String(j.subscriptionType) : undefined, evidence: "`claude auth status` (JSON; só loggedIn/authMethod/subscriptionType mantidos)" };
      } catch { return { status: "unknown", evidence: `\`claude auth status\` exit ${r.code}, saída não-JSON` }; }
    }
    case "codex": {
      const r = await run(bin, ["login", "status"], t);
      const s = `${r.out}\n${r.err}`;
      if (/not logged in/i.test(s)) return { status: "not_authenticated", evidence: "`codex login status`" };
      if (/logged in/i.test(s)) return { status: "authenticated", method: /chatgpt/i.test(s) ? "chatgpt" : /api key/i.test(s) ? "api_key" : "?", evidence: "`codex login status`" };
      return { status: "unknown", evidence: `\`codex login status\` exit ${r.code}` };
    }
    case "cursor-agent": {
      const r = await run(bin, ["status"], t);
      const s = `${r.out}\n${r.err}`;
      if (/not logged in/i.test(s)) return { status: "not_authenticated", evidence: "`cursor-agent status`" };
      if (/logged in/i.test(s)) return { status: "authenticated", evidence: "`cursor-agent status` (identificador do usuário omitido)" };
      return { status: "unknown", evidence: `\`cursor-agent status\` exit ${r.code}` };
    }
    case "opencode": {
      const r = await run(bin, ["auth", "list"], t);
      const s = `${r.out}\n${r.err}`;
      if (/no authenticated/i.test(s)) return { status: "not_authenticated", evidence: "`opencode auth list` → nenhuma integração autenticada (modelos gratuitos não verificados)" };
      return { status: r.code === 0 ? "authenticated" : "unknown", evidence: `\`opencode auth list\` exit ${r.code} (provedores não listados no manifest)` };
    }
    case "qwen":
      return { status: "unknown", evidence: `sem comando oficial de status (\`qwen auth\` removido); arquivos ~/.qwen/oauth_creds.json ${exists(".qwen/oauth_creds.json") ? "existe" : "ausente"}, ~/.qwen/settings.json ${exists(".qwen/settings.json") ? "existe" : "ausente"} (só existência)` };
    case "gemini":
      return { status: "unknown", evidence: `sem comando de status verificado; ~/.gemini ${exists(".gemini") ? "existe" : "ausente"} (só existência)` };
    case "gh": {
      const r = await run(bin, ["auth", "status"], t);
      const s = `${r.out}\n${r.err}`;
      return { status: /logged in to/i.test(s) ? "authenticated" : /not logged/i.test(s) ? "not_authenticated" : "unknown", evidence: "`gh auth status` (contas omitidas)" };
    }
    default:
      return undefined;
  }
}

async function parentChain(): Promise<string[]> {
  if (process.platform === "win32") return [];
  const chain: string[] = [];
  let pid = process.ppid;
  for (let i = 0; i < 6 && pid > 1; i++) {
    const r = await run("ps", ["-o", "ppid=,comm=", "-p", String(pid)], 3000);
    const m = /^\s*(\d+)\s+(.+)$/.exec(r.out.trim());
    if (!m) break;
    chain.push(path.basename(m[2].trim()));
    pid = Number(m[1]);
  }
  return chain;
}

async function parallelProbe(n = 4, each = 400): Promise<EnvironmentManifest["parallel_probe"]> {
  const t0 = Date.now();
  await Promise.all(Array.from({ length: n }, () => run(process.execPath, ["-e", `setTimeout(()=>{},${each})`], 10_000)));
  const wall = Date.now() - t0;
  return { processes: n, each_ms: each, wall_ms: wall, parallel: wall < each * n * 0.6 };
}

export async function detectEnvironment(opts: DetectOptions = {}): Promise<EnvironmentManifest> {
  const home = opts.home ?? os.homedir();
  const t = opts.timeoutMs ?? 15_000;
  const checkAuth = opts.checkAuth ?? true;
  const pathDirs = (opts.pathEnv ?? process.env.PATH ?? "").split(path.delimiter).filter(Boolean);
  const extra = opts.extraDirs ?? [path.join(home, ".local/bin"), "/usr/local/bin", "/opt/homebrew/bin", path.dirname(process.execPath)];
  const dirs = [...new Set([...pathDirs, ...extra])];
  const notes: string[] = [];

  const clis: CliInfo[] = [];
  for (const id of opts.clis ?? DEFAULT_CLIS) {
    const bin = which(id, dirs);
    if (!bin) { clis.push({ id, found: false }); continue; }
    const v = await run(bin, ["--version"], t);
    const info: CliInfo = { id, found: true, path: scrub(bin, home), version: scrub(firstLine(`${v.out}\n${v.err}`), home) || `exit ${v.code}` };
    if (checkAuth) {
      const a = await authStatus(id, bin, home, t);
      if (a) info.auth = { ...a, evidence: scrub(a.evidence, home) };
    } else if (["claude", "codex", "cursor-agent", "opencode", "qwen", "gemini", "gh"].includes(id)) {
      info.auth = { status: "not_checked", evidence: "checkAuth=false" };
    }
    clis.push(info);
  }
  const binOf = (id: string) => (clis.find((c) => c.id === id && c.found) ? which(id, dirs) : undefined);

  // MCP: só nomes de servidores.
  const mcp: McpConfigInfo[] = [];
  const addJson = (client: string, rel: string, pick: (j: Record<string, unknown>) => unknown, note?: string) => {
    const f = path.join(home, rel);
    if (!fs.existsSync(f)) { mcp.push({ client, file: `~/${rel}`, exists: false, servers: [] }); return; }
    try { mcp.push({ client, file: `~/${rel}`, exists: true, servers: jsonKeys(f, pick), note }); } catch (e) {
      mcp.push({ client, file: `~/${rel}`, exists: true, servers: [], note: `não foi possível ler: ${(e as Error).name}` });
    }
  };
  addJson("claude-code (user)", ".claude.json", (j) => j.mcpServers, "só chaves de mcpServers do escopo de usuário");
  {
    const f = path.join(home, ".claude.json");
    if (fs.existsSync(f)) {
      try {
        const j = JSON.parse(fs.readFileSync(f, "utf8")) as { projects?: Record<string, { mcpServers?: Record<string, unknown> }> };
        const names = new Set<string>();
        for (const p of Object.values(j.projects ?? {})) for (const k of Object.keys(p.mcpServers ?? {})) names.add(k);
        mcp.push({ client: "claude-code (projetos)", file: "~/.claude.json", exists: true, servers: [...names].sort(), note: "união das chaves por projeto (caminhos de projeto omitidos)" });
      } catch { /* já registrado acima */ }
    }
  }
  addJson("claude-desktop", process.platform === "darwin" ? "Library/Application Support/Claude/claude_desktop_config.json" : ".config/Claude/claude_desktop_config.json", (j) => j.mcpServers);
  {
    const rel = ".codex/config.toml"; const f = path.join(home, rel);
    if (fs.existsSync(f)) {
      const names = [...fs.readFileSync(f, "utf8").matchAll(/^\s*\[mcp_servers\.([^\].]+)\]/gm)].map((m) => m[1].replace(/^"|"$/g, ""));
      mcp.push({ client: "codex", file: `~/${rel}`, exists: true, servers: [...new Set(names)].sort() });
    } else mcp.push({ client: "codex", file: `~/${rel}`, exists: false, servers: [] });
  }
  addJson("cursor", ".cursor/mcp.json", (j) => j.mcpServers);
  addJson("qwen", ".qwen/settings.json", (j) => j.mcpServers);
  addJson("gemini", ".gemini/settings.json", (j) => j.mcpServers);
  addJson("opencode", ".config/opencode/opencode.json", (j) => j.mcp);
  notes.push("Arquivos de credencial (ex.: ~/.codex/auth.json, ~/.qwen/oauth_creds.json) NUNCA são abertos; quando citados, só a existência.");

  // Apps nativos de orquestração.
  const apps: EnvironmentManifest["apps"] = [];
  const appsDir = opts.applicationsDir ?? "/Applications";
  const maestriApp = path.join(appsDir, "Maestri.app");
  if (fs.existsSync(maestriApp)) {
    let version: string | undefined;
    if (process.platform === "darwin") {
      const r = await run("plutil", ["-extract", "CFBundleShortVersionString", "raw", path.join(maestriApp, "Contents/Info.plist")], 5000);
      version = r.code === 0 ? r.out.trim() : undefined;
    }
    const pg = process.platform === "win32" ? { code: 1 } : await run("pgrep", ["-x", "Maestri"], 5000);
    const cli = path.join(maestriApp, "Contents/Resources/maestri");
    apps.push({ id: "maestri", installed: true, version, running: pg.code === 0, cli: fs.existsSync(cli) ? scrub(cli, home) : undefined,
      note: "CLI `maestri` só funciona dentro de um terminal do Maestri (MAESTRI_SOCKET)." });
  } else apps.push({ id: "maestri", installed: false });

  // Serviços.
  const services: EnvironmentManifest["services"] = {};
  // Docker e Hermes estão FORA DO ESCOPO (decisão do Pedro, 29/10/2026): não são consultados.
  notes.push("Docker e Hermes Agent estão fora do escopo deste runtime: não são detectados nem configurados (foco: Harness).");
  const ollama = binOf("ollama");
  if (ollama) {
    const l = await run(ollama, ["list"], t);
    const models = l.code === 0 ? l.out.trim().split("\n").slice(1).map((x) => x.trim().split(/\s+/)[0]).filter(Boolean) : [];
    services.ollama = { server: l.code === 0, models };
  }

  const chain = await parentChain();
  const probe = await parallelProbe();
  const insideMaestri = Boolean(process.env.MAESTRI_SOCKET);
  const found = clis.filter((c) => c.found);
  const agentIds = ["claude", "codex", "opencode", "gemini", "qwen", "cursor-agent", "aider", "goose"];
  const agentsFound = found.filter((c) => agentIds.includes(c.id));
  const authed = agentsFound.filter((c) => c.auth?.status === "authenticated");
  const cpus = os.cpus();
  let osVersion: string | undefined;
  if (process.platform === "darwin") { const r = await run("sw_vers", ["-productVersion"], 5000); osVersion = r.code === 0 ? `macOS ${r.out.trim()}` : undefined; }
  else if (fs.existsSync("/etc/os-release")) { osVersion = /PRETTY_NAME="?([^"\n]+)/.exec(fs.readFileSync("/etc/os-release", "utf8"))?.[1]; }

  const capabilities: CapabilityCheck[] = [
    { id: "terminal_commands", label: "Executar comandos de terminal", status: "yes",
      evidence: `spawn de ${found.length} binários (--version) e de ${probe.processes} processos node no teste de paralelismo` },
    { id: "start_different_clis", label: "Inicializar CLIs diferentes", status: agentsFound.length >= 2 ? "partial" : agentsFound.length ? "partial" : "no",
      evidence: `CLIs de agente encontradas: ${agentsFound.map((c) => `${c.id} ${c.version}`).join("; ") || "nenhuma"}. Só --version/status foram executados; nenhuma tarefa de agente foi iniciada (consumiria cota).` },
    { id: "independent_processes", label: "Criar processos independentes", status: probe.parallel ? "yes" : "no",
      evidence: `${probe.processes} processos de ${probe.each_ms} ms terminaram em ${probe.wall_ms} ms (paralelo=${probe.parallel})` },
    { id: "concurrent_sessions", label: "Coordenar sessões simultâneas", status: "partial",
      evidence: `runtime mantém vários handles ao mesmo tempo (testado com shell-echo); dentro de terminal Maestri=${insideMaestri}; sessões de agente reais não verificadas` },
    { id: "capture_responses", label: "Capturar respostas e estados", status: "partial",
      evidence: "stdout/stderr/exit/latência capturados pelo ProcessAdapter (testado); formatos JSON das CLIs só documentados, não executados" },
    { id: "permissions_auth", label: "Gerenciar permissões e autenticação", status: authed.length ? "partial" : "no",
      evidence: `login verificado por comando oficial: ${authed.map((c) => c.id).join(", ") || "nenhum"}; permissões por flag (read-only) definidas nos adapters; o runtime não faz login nem guarda credenciais` },
    { id: "execution_metrics", label: "Registrar métricas de execução", status: "yes",
      evidence: "AgentResult.metrics (latência, exit, bytes, contexto) + JSONL akm.runtime.v1; tokens/custo só quando a ferramenta reporta" },
  ];
  if (!insideMaestri && apps.find((a) => a.id === "maestri")?.installed) {
    notes.push("Maestri está instalado, mas este processo NÃO roda dentro de um terminal do Maestri: `maestri ask/list/note` não estão disponíveis daqui.");
  }

  return {
    schema: RUNTIME_SCHEMA_VERSION, kind: "environment-manifest", generated_at: new Date().toISOString(),
    host: { platform: process.platform, release: os.release(), os_version: osVersion, arch: os.arch(), cpus: cpus.length, cpu_model: cpus[0]?.model?.trim() ?? "?",
      mem_gb: Math.round(os.totalmem() / 1024 ** 3), node: process.version, shell: process.env.SHELL ? path.basename(process.env.SHELL) : undefined },
    execution_context: { stdin_tty: Boolean(process.stdin.isTTY), stdout_tty: Boolean(process.stdout.isTTY), parent_chain: chain, inside_maestri_terminal: insideMaestri },
    clis, mcp_configs: mcp, apps, services, parallel_probe: probe, capabilities, notes,
  };
}
