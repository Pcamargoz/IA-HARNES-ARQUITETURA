import { z } from "zod";
import { loadEnvManifest } from "./runtime-helpers.js";
import { defineTool, ToolInputError } from "./types.js";

const SECTIONS = ["summary", "host", "clis", "mcp", "apps", "services", "capabilities", "all"] as const;

export const getEnvironmentCapabilities = defineTool({
  name: "get_environment_capabilities",
  title: "Capacidades do ambiente detectado",
  description:
    "Lê o manifest de ambiente gerado por `npm run detect-env` (arquivo fora dos vaults; caminho em AKM_RUNTIME_MANIFEST). " +
    "Mostra o que foi DETECTADO: CLIs e versões, login por comando oficial, nomes de servidores MCP, Maestri, Ollama, teste de paralelismo " +
    "e as 7 capacidades de orquestração com evidência. section: summary (padrão), host, clis, mcp, apps, services, capabilities, all.",
  inputSchema: {
    section: z.enum(SECTIONS).optional(),
    format: z.enum(["text", "json"]).optional(),
  },
  handler(ctx, a) {
    const { manifest: m, path: p, error } = loadEnvManifest(ctx);
    if (!m) throw new ToolInputError(`Manifest de ambiente ${error} (${p}). Gere com \`npm run detect-env\` no computador a detectar.`);
    const sec = a.section ?? "summary";
    if (a.format === "json") {
      const pick: Record<string, unknown> = { summary: { generated_at: m.generated_at, host: m.host, capabilities: m.capabilities },
        host: { host: m.host, execution_context: m.execution_context }, clis: m.clis, mcp: m.mcp_configs, apps: m.apps,
        services: { services: m.services, parallel_probe: m.parallel_probe }, capabilities: m.capabilities, all: m };
      return JSON.stringify(pick[sec]);
    }
    const age = Math.round((Date.now() - Date.parse(m.generated_at)) / 3_600_000);
    const out = [`Ambiente detectado em ${m.generated_at} (há ~${age} h): ${m.host.os_version ?? m.host.platform} ${m.host.arch}, ${m.host.cpus} CPUs, ${m.host.mem_gb} GB, node ${m.host.node}.`];
    const clis = () => {
      out.push("", "CLIs:");
      for (const c of m.clis) out.push(`- ${c.id}: ${c.found ? `${c.version ?? "?"} (${c.path})` : "não encontrado"}${c.auth ? ` | login=${c.auth.status}${c.auth.method ? `/${c.auth.method}` : ""}${c.auth.plan ? `/${c.auth.plan}` : ""} — ${c.auth.evidence}` : ""}`);
    };
    const caps = () => {
      out.push("", "Capacidades (evidência):");
      for (const c of m.capabilities) out.push(`- [${c.status}] ${c.label}: ${c.evidence}`);
    };
    const mcp = () => { out.push("", "MCP (só nomes):"); for (const x of m.mcp_configs) out.push(`- ${x.client} ${x.file}: ${x.exists ? (x.servers.join(", ") || "(nenhum)") : "arquivo ausente"}`); };
    const apps = () => { out.push("", "Apps:"); for (const x of m.apps) out.push(`- ${x.id}: ${x.installed ? `instalado ${x.version ?? ""} rodando=${x.running}` : "não instalado"}${x.note ? ` — ${x.note}` : ""}`); };
    const services = () => {
      out.push("", "Serviços (Docker e Hermes fora do escopo):",
        `- ollama: ${m.services.ollama ? `servidor=${m.services.ollama.server} modelos=${m.services.ollama.models.join(", ") || "-"}` : "não encontrado"}`,
        `- paralelismo: ${m.parallel_probe.processes}×${m.parallel_probe.each_ms} ms em ${m.parallel_probe.wall_ms} ms (paralelo=${m.parallel_probe.parallel})`);
    };
    const host = () => out.push("", `Contexto de execução: tty(stdin)=${m.execution_context.stdin_tty}, cadeia de pais=${m.execution_context.parent_chain.join(" → ") || "-"}, dentro do Maestri=${m.execution_context.inside_maestri_terminal}`);
    switch (sec) {
      case "summary": {
        const found = m.clis.filter((c) => c.found);
        out.push(`CLIs encontradas: ${found.map((c) => c.id).join(", ")}. Ausentes: ${m.clis.filter((c) => !c.found).map((c) => c.id).join(", ") || "-"}.`);
        out.push(`Login confirmado: ${found.filter((c) => c.auth?.status === "authenticated").map((c) => c.id).join(", ") || "nenhum"}.`);
        caps(); break;
      }
      case "host": host(); break;
      case "clis": clis(); break;
      case "mcp": mcp(); break;
      case "apps": apps(); break;
      case "services": services(); break;
      case "capabilities": caps(); break;
      case "all": host(); clis(); mcp(); apps(); services(); caps(); break;
    }
    if (m.notes.length) out.push("", "Notas:", ...m.notes.map((n) => `- ${n}`));
    return out.join("\n");
  },
});
