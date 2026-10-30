import { z } from "zod";
import { normalize } from "../search/text.js";
import { readDocument } from "./helpers.js";
import { fmText } from "./orchestration-helpers.js";
import { runtimeDocs } from "./runtime-helpers.js";
import { defineTool, ToolInputError } from "./types.js";

export const getRuntimeArchitecture = defineTool({
  name: "get_runtime_architecture",
  title: "Arquitetura do Universal Agent Runtime",
  description:
    "Lê a arquitetura do runtime universal de agentes (KB 11-Universal-Agent-Runtime; notas com frontmatter runtime_component). " +
    "Sem 'component': lista componentes e seções (barato). Com 'component' (ex.: overview, port, manifest, detection, registry, router, policies, " +
    "token-engine, metrics, communication, portability, harness-integration, experiment): devolve a nota; com 'section', só aquela seção.",
  inputSchema: {
    component: z.string().max(60).optional(),
    section: z.string().max(120).optional(),
    max_chars: z.number().int().min(200).max(24000).optional(),
  },
  handler(ctx, a) {
    const docs = runtimeDocs(ctx).filter((d) => fmText(d, "runtime_component"));
    if (docs.length === 0) throw new ToolInputError("Nenhuma nota com runtime_component em 11-Universal-Agent-Runtime.");
    if (!a.component) {
      const out = [`Universal Agent Runtime — ${docs.length} nota(s). Leia com component="<id>" (e section="<título>").`];
      for (const d of [...docs].sort((x, y) => (fmText(x, "runtime_component") ?? "").localeCompare(fmText(y, "runtime_component") ?? ""))) {
        const secs = d.headings.filter((h) => h.level === 2).map((h) => h.text);
        out.push(`- ${fmText(d, "runtime_component")}: ${d.title} [${d.status ?? "?"}] — ${d.id}${secs.length ? ` | seções: ${secs.slice(0, 12).join("; ")}` : ""}`);
      }
      return out.join("\n");
    }
    const want = normalize(a.component).trim();
    const d = docs.find((x) => normalize(fmText(x, "runtime_component") ?? "") === want)
      ?? docs.find((x) => normalize(`${fmText(x, "runtime_component")} ${x.title}`).includes(want));
    if (!d) throw new ToolInputError(`Componente "${a.component}" não encontrado. Disponíveis: ${docs.map((x) => fmText(x, "runtime_component")).sort().join(", ")}`);
    if (a.section) {
      const s = normalize(a.section).trim();
      const h = d.headings.find((x) => normalize(x.text) === s) ?? d.headings.find((x) => normalize(x.text).includes(s));
      if (!h) throw new ToolInputError(`Seção "${a.section}" não existe em ${d.title}. Seções: ${d.headings.filter((x) => x.level >= 2).map((x) => x.text).join("; ")}`);
      return readDocument(ctx, d.root, d.rel, { heading: h.text, maxChars: a.max_chars });
    }
    return readDocument(ctx, d.root, d.rel, { maxChars: a.max_chars });
  },
});
