import { z } from "zod";
import { CLI_MANIFESTS } from "../runtime/adapters/cli-specs.js";
import { NOOP_MANIFEST } from "../runtime/adapters/noop.js";
import { SHELL_ECHO_MANIFEST } from "../runtime/adapters/shell-echo.js";
import type { CapabilityManifest } from "../runtime/port.js";
import { normalize } from "../search/text.js";
import { fmList, fmText } from "./orchestration-helpers.js";
import { loadEnvManifest, runtimeDocs } from "./runtime-helpers.js";
import { defineTool } from "./types.js";

const CODE_MANIFESTS: CapabilityManifest[] = [SHELL_ECHO_MANIFEST, NOOP_MANIFEST, ...CLI_MANIFESTS];

export const listAgentAdapters = defineTool({
  name: "list_agent_adapters",
  title: "Adapters de agentes",
  description:
    "Lista os adapters do Universal Agent Runtime juntando três fontes, sem presumir: (1) notas type=adapter-spec da KB, " +
    "(2) Capability Manifest declarado no código (status implemented/spec-only) e (3) o manifest de ambiente detectado " +
    "(instalado, versão, login). Filtros: capability (ex.: session_resume, mcp, cost_usd), available_only (instalado e autenticado).",
  inputSchema: {
    capability: z.string().max(40).optional(),
    available_only: z.boolean().optional(),
    format: z.enum(["text", "json"]).optional(),
  },
  handler(ctx, a) {
    const notes = runtimeDocs(ctx, "adapter-spec");
    const env = loadEnvManifest(ctx);
    const ids = new Set<string>([...CODE_MANIFESTS.map((m) => m.adapter), ...notes.map((d) => fmText(d, "adapter") ?? "").filter(Boolean)]);
    const rows = [...ids].sort().map((id) => {
      const m = CODE_MANIFESTS.find((x) => x.adapter === id);
      const n = notes.find((d) => fmText(d, "adapter") === id);
      const cmd = m?.tool?.command ?? fmText(n ?? ({ frontmatter: {} } as never), "tool_command");
      const cli = env.manifest?.clis.find((c) => c.id === (cmd ? cmd.split("/").pop() : ""));
      const local = m?.kind === "local-process" || m?.kind === "test-double";
      const detected = local ? { installed: true, version: undefined as string | undefined, auth: "n/a" }
        : !env.manifest ? { installed: undefined, version: undefined, auth: "manifest de ambiente ausente" }
        : { installed: Boolean(cli?.found), version: cli?.version, auth: cli?.auth?.status ?? (cli?.found ? "n/a" : "—") };
      return {
        adapter: id,
        kind: m?.kind ?? fmText(n ?? ({ frontmatter: {} } as never), "kind") ?? "?",
        implementation: m?.status ?? fmText(n ?? ({ frontmatter: {} } as never), "impl_status") ?? "planned",
        capabilities: m?.capabilities ?? (n ? fmList(n, "capabilities") : []),
        metrics: m?.metrics,
        detected,
        note: n?.id,
        source: m?.verified?.source ?? (n ? fmText(n, "source") : undefined),
      };
    });
    let sel = rows;
    if (a.capability) { const c = normalize(a.capability).trim(); sel = sel.filter((r) => r.capabilities.some((x) => normalize(x) === c)); }
    if (a.available_only) sel = sel.filter((r) => r.detected.installed === true && (r.detected.auth === "authenticated" || r.detected.auth === "n/a"));
    const header = env.manifest
      ? `manifest de ambiente: ${env.manifest.generated_at} (${env.manifest.host.os_version ?? env.manifest.host.platform})`
      : `manifest de ambiente: ${env.error} — rode \`npm run detect-env\` para detectar instalação/login.`;
    if (a.format === "json") return JSON.stringify({ environment: header, adapters: sel });
    const out = [`${sel.length} de ${rows.length} adapter(s). ${header}`];
    for (const r of sel) {
      const det = r.detected.installed === undefined ? r.detected.auth
        : `${r.detected.installed ? "instalado" : "NÃO instalado"}${r.detected.version ? ` ${r.detected.version}` : ""}; login=${r.detected.auth}`;
      out.push(`- ${r.adapter} [${r.kind}; ${r.implementation}] ${det} | caps: ${r.capabilities.join(", ") || "-"}` +
        `${r.metrics ? ` | tokens=${r.metrics.tokens} custo=${r.metrics.cost}` : ""}${r.note ? ` | nota: ${r.note}` : ""}`);
    }
    out.push("", "spec-only = linha de comando e parser escritos a partir da doc oficial, nunca executados aqui (executar consome a conta do Pedro e exige aprovação).");
    return out.join("\n");
  },
});
