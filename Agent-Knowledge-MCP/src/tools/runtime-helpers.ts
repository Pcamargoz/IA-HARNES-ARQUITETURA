import fs from "node:fs";
import type { IndexedDoc } from "../search/indexer.js";
import { filterDocs } from "../search/query.js";
import type { EnvironmentManifest } from "../runtime/detect.js";
import { redact } from "../security/redact.js";
import { kbPrefix } from "./helpers.js";
import { KB_AREAS } from "./kb-layout.js";
import type { ToolContext } from "./types.js";

/** Notas de <KB>/11-Universal-Agent-Runtime, filtradas por type (frontmatter). */
export function runtimePrefix(ctx: ToolContext): string {
  return kbPrefix(ctx, KB_AREAS.runtime);
}

export function runtimeDocs(ctx: ToolContext, type?: string | string[]): IndexedDoc[] {
  return filterDocs(ctx.index, { root: ctx.config.kbRoot, pathPrefix: runtimePrefix(ctx) + "/", type });
}

/** Lê o manifest de ambiente (arquivo gerado fora dos vaults). undefined se não existir. */
export function loadEnvManifest(ctx: ToolContext): { manifest?: EnvironmentManifest; path: string; error?: string } {
  const p = ctx.config.runtimeManifest;
  if (!fs.existsSync(p)) return { path: p, error: "ausente" };
  try {
    const st = fs.statSync(p);
    if (st.size > 2_000_000) return { path: p, error: "grande demais" };
    // Defesa extra: redige qualquer coisa com cara de segredo antes de interpretar.
    const raw = redact(fs.readFileSync(p, "utf8"));
    const m = JSON.parse(raw) as EnvironmentManifest;
    if (m.kind !== "environment-manifest") return { path: p, error: "arquivo não é um environment-manifest" };
    return { manifest: m, path: p };
  } catch (e) {
    return { path: p, error: `inválido: ${(e as Error).message}` };
  }
}
