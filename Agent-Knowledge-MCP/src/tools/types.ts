import type { z } from "zod";
import type { AkmConfig } from "../server/config.js";
import type { Logger } from "../server/logger.js";
import type { PathGuard } from "../security/paths.js";
import type { KnowledgeIndex } from "../search/indexer.js";

export interface ToolContext {
  config: AkmConfig;
  guard: PathGuard;
  index: KnowledgeIndex;
  log: Logger;
}

/**
 * Contrato de uma tool. Para adicionar uma tool nova: crie src/tools/<nome>.ts exportando
 * `defineTool({...})` e acrescente-a ao array em src/tools/index.ts. Nada mais muda.
 */
export interface ToolDefinition<S extends z.ZodRawShape = z.ZodRawShape> {
  name: string;
  title: string;
  description: string;
  inputSchema: S;
  handler: (ctx: ToolContext, args: z.infer<z.ZodObject<S>>) => Promise<string> | string;
}

export function defineTool<S extends z.ZodRawShape>(def: ToolDefinition<S>): ToolDefinition<S> {
  return def;
}

/** Erro "esperado" (entrada inválida, documento ausente): vira isError=true sem stack. */
export class ToolInputError extends Error {
  constructor(message: string) { super(message); this.name = "ToolInputError"; }
}
