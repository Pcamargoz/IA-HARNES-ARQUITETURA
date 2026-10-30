#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { loadConfig } from "./server/config.js";
import { createContext, createServer, SERVER_NAME, SERVER_VERSION } from "./server/createServer.js";
import { Logger } from "./server/logger.js";

async function main(): Promise<void> {
  const log = new Logger("info");
  let config;
  try {
    config = loadConfig();
  } catch (e) {
    log.error(`configuração inválida: ${(e as Error).message}`);
    process.exit(2);
  }
  log.setLevel(config.logLevel);
  const ctx = createContext(config, log);
  // Indexação inicial (falhas por arquivo são registradas e não derrubam o servidor).
  ctx.index.refresh(true);
  log.info(`${SERVER_NAME} ${SERVER_VERSION} pronto`, { roots: [...ctx.guard.roots.keys()], docs: ctx.index.stats.docs, ms: ctx.index.stats.lastRefreshMs });
  const server = createServer(ctx);
  const transport = new StdioServerTransport();
  process.on("uncaughtException", (err) => log.error("exceção não tratada (servidor continua)", { message: err.message }));
  process.on("unhandledRejection", (r) => log.error("promise rejeitada (servidor continua)", { reason: String(r) }));
  const shutdown = async () => { try { await server.close(); } finally { process.exit(0); } };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
  await server.connect(transport);
}

main().catch((e) => {
  process.stderr.write(`[akm] erro fatal: ${(e as Error).message}\n`);
  process.exit(1);
});
