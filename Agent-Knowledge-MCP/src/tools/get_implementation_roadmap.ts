import { z } from "zod";
import { kbPath, readDocument } from "./helpers.js";
import { defineTool } from "./types.js";

export const getImplementationRoadmap = defineTool({
  name: "get_implementation_roadmap",
  title: "Roadmap de implementação",
  description:
    "Retorna o roadmap de implementação (00-Dashboard/Implementation-Roadmap.md). Sem parâmetros: resumo de fases; " +
    "phase='F1' (ou heading) devolve a fase.",
  inputSchema: {
    phase: z.string().max(40).optional().describe("Ex.: F0, F1, F2..."),
    heading: z.string().max(200).optional(),
    full: z.boolean().optional(),
    max_chars: z.number().int().min(200).max(100000).optional(),
  },
  handler(ctx, a) {
    const ref = kbPath(ctx, "roadmap");
    const heading = a.heading ?? (a.phase ? a.phase.trim() : undefined);
    return readDocument(ctx, ref.root, ref.rel, { heading, maxChars: a.max_chars, outlineOnly: !heading && !a.full });
  },
});
