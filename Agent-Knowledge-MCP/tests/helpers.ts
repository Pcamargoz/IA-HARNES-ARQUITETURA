import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { getDefaultEnvironment, StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const here = path.dirname(fileURLToPath(import.meta.url)); // dist/tests
export const projectRoot = path.resolve(here, "..", "..");
export const fixtures = path.join(projectRoot, "tests", "fixtures");
export const serverEntry = path.join(projectRoot, "dist", "src", "index.js");

/** Cópia descartável das fixtures em diretório temporário (testes que escrevem nunca tocam vaults reais). */
export function tempFixtures(): { dir: string; kb: string; harness: string; outside: string; cleanup: () => void } {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "akm-test-"));
  fs.cpSync(fixtures, dir, { recursive: true });
  return {
    dir, kb: path.join(dir, "kb-vault"), harness: path.join(dir, "harness-vault"), outside: path.join(dir, "outside"),
    cleanup: () => fs.rmSync(dir, { recursive: true, force: true }),
  };
}

export function fixtureEnv(kb: string, harness: string, extra: Record<string, string> = {}): Record<string, string> {
  return {
    AKM_VAULT_ROOTS: `cofre=${kb};harness=${harness}`,
    AKM_ROOT_INCLUDE: JSON.stringify({ cofre: ["AI-Agent-Ecosystem", "Skills para main agents"] }),
    AKM_KB_ROOT: "cofre",
    AKM_KB_SUBDIR: "AI-Agent-Ecosystem",
    AKM_HARNESS_ROOT: "harness",
    AKM_INDEX_TTL_MS: "0",
    AKM_LOG_LEVEL: "warn",
    AKM_RUNTIME_MANIFEST: path.join(fixtures, "runtime", "environment-manifest.json"),
    ...extra,
  };
}

export interface Conn { client: Client; transport: StdioClientTransport; stderr: () => string; close: () => Promise<void>; }

/** Sobe o servidor compilado como processo filho e conecta um cliente MCP real (SDK) via stdio. */
export async function connect(env: Record<string, string>): Promise<Conn> {
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [serverEntry],
    env: { ...getDefaultEnvironment(), ...env },
    stderr: "pipe",
  });
  let err = "";
  transport.stderr?.on("data", (d: Buffer) => { err += d.toString(); });
  const client = new Client({ name: "akm-test-client", version: "0.0.1" });
  await client.connect(transport);
  return { client, transport, stderr: () => err, close: () => client.close() };
}

export function text(res: unknown): string {
  const r = res as { content?: Array<{ type: string; text?: string }> };
  return (r.content ?? []).filter((c) => c.type === "text").map((c) => c.text ?? "").join("\n");
}

export function isError(res: unknown): boolean {
  return Boolean((res as { isError?: boolean }).isError);
}
