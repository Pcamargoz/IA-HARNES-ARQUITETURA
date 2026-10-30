import { z } from "zod";
import { kbPath, readDocument } from "./helpers.js";
import { defineTool } from "./types.js";

const TOPICS = { overview: "token.overview", budget: "token.budget", routing: "token.routing", compression: "token.compression" } as const;

export const getTokenOptimization = defineTool({
  name: "get_token_optimization",
  title: "Estratégias de economia de tokens",
  description:
    "Retorna as estratégias de otimização de tokens da KB. topic: overview (padrão), budget (orçamento de contexto por tarefa), " +
    "routing (roteamento de modelos), compression (compressão, cache e ferramentas como Headroom/Repomix). " +
    "Sem heading devolve o resumo de seções; com heading, a seção. Percentuais de economia são estimativas até serem medidos.",
  inputSchema: {
    topic: z.enum(["overview", "budget", "routing", "compression"]).optional(),
    heading: z.string().max(200).optional(),
    full: z.boolean().optional(),
    max_chars: z.number().int().min(200).max(100000).optional(),
  },
  handler(ctx, a) {
    const ref = kbPath(ctx, TOPICS[a.topic ?? "overview"]);
    return readDocument(ctx, ref.root, ref.rel, { heading: a.heading, maxChars: a.max_chars, outlineOnly: !a.heading && !a.full });
  },
});
