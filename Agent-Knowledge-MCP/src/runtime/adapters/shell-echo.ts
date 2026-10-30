import { RUNTIME_SCHEMA_VERSION, type CapabilityManifest } from "../port.js";
import { ProcessAdapter } from "./process-adapter.js";

/**
 * shell-echo: adapter REAL de processo local, sem LLM e sem rede. Inicia `node` como processo
 * filho, recebe o prompt por stdin e devolve JSON {echo, chars, pid}. Serve para validar o
 * contrato (spawn, timeout, cancelamento, captura, métricas) sem gastar cota de ninguém.
 * Marcadores no prompt (só para testes): "#delay=<ms>" espera antes de responder; "#fail" sai com código 3.
 */
const SCRIPT = [
  "let s='';process.stdin.on('data',d=>s+=d);process.stdin.on('end',()=>{",
  "const m=/#delay=(\\d+)/.exec(s);const go=()=>{",
  "if(/#fail/.test(s)){process.stderr.write('falha pedida');process.exit(3)}",
  "process.stdout.write(JSON.stringify({echo:s,chars:s.length,pid:process.pid}))};",
  "m?setTimeout(go,Number(m[1])):go()})",
].join("");

export const SHELL_ECHO_MANIFEST: CapabilityManifest = {
  schema: RUNTIME_SCHEMA_VERSION,
  adapter: "shell-echo",
  kind: "local-process",
  status: "implemented",
  tool: { command: process.execPath },
  capabilities: ["headless", "structured_output", "cancel", "timeout", "parallel_safe"],
  requirements: ["node no PATH (o mesmo que roda o MCP)"],
  permissions: { default_mode: "read-only", allowed: ["ler stdin"], denied: ["rede", "escrita em disco", "credenciais"] },
  limits: { default_timeout_ms: 5_000, max_timeout_ms: 60_000, max_prompt_bytes: 1_000_000, max_parallel: 16 },
  metrics: { tokens: "unavailable", cost: "unavailable", latency: "reported" },
  verified: { source: "testes deste projeto (tests/10-runtime.test.ts)", date: "2026-10-29" },
};

export function createShellEchoAdapter(): ProcessAdapter {
  return new ProcessAdapter(SHELL_ECHO_MANIFEST, {
    command: process.execPath,
    args: () => ["-e", SCRIPT],
    stdinPrompt: true,
    versionArgs: ["--version"],
    parse(stdout) {
      const j = JSON.parse(stdout) as { echo: string; chars: number; pid: number };
      return { output: j.echo, structured: j };
    },
  });
}
