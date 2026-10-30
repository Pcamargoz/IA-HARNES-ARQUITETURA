import { z } from "zod";
import { kbPath, readDocument } from "./helpers.js";
import { HARNESS_DOCS } from "./kb-layout.js";
import { defineTool, ToolInputError } from "./types.js";

const SCOPES = ["ecosystem", "harness-current", "harness-proposal", "harness-source", "mcp"] as const;

export const getArchitecture = defineTool({
  name: "get_architecture",
  title: "Consultar arquitetura",
  description:
    "Retorna a arquitetura documentada. scope: ecosystem (arquitetura multiagente alvo), harness-current (análise do Harness atual), " +
    "harness-proposal (proposta de melhorias), harness-source (nota original do Harness-Architecture, somente leitura), mcp (este servidor). " +
    "Sem heading devolve o sumário de seções; com heading devolve a seção.",
  inputSchema: {
    scope: z.enum(SCOPES).optional().describe("Padrão: ecosystem."),
    heading: z.string().max(200).optional(),
    max_chars: z.number().int().min(200).max(100000).optional(),
    full: z.boolean().optional().describe("true = documento inteiro (respeitando max_chars)."),
  },
  handler(ctx, a) {
    const scope = a.scope ?? "ecosystem";
    let ref: { root: string; rel: string };
    if (scope === "harness-source") {
      if (!ctx.guard.roots.has(ctx.config.harnessRoot)) throw new ToolInputError(`Raiz do Harness "${ctx.config.harnessRoot}" não configurada (AKM_HARNESS_ROOT/AKM_VAULT_ROOTS).`);
      ref = { root: ctx.config.harnessRoot, rel: HARNESS_DOCS.architecture };
    } else {
      const key = scope === "ecosystem" ? "architecture.ecosystem" : scope === "mcp" ? "architecture.mcp" : (`architecture.${scope}` as const);
      ref = kbPath(ctx, key);
    }
    const outline = !a.heading && !a.full;
    return readDocument(ctx, ref.root, ref.rel, { heading: a.heading, maxChars: a.max_chars, outlineOnly: outline });
  },
});
