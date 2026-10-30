import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { LogLevel, parseLevel } from "./logger.js";

export interface RootConfig {
  /** Nome curto usado nas respostas (ex.: "cofre"). */
  name: string;
  /** Caminho absoluto da raiz autorizada (vem do ambiente/config, nunca do código). */
  path: string;
  /** Subcaminhos relativos indexados. Vazio/ausente = raiz inteira. */
  include?: string[];
}

export interface AkmConfig {
  roots: RootConfig[];
  kbRoot: string;
  kbSubdir: string;
  harnessRoot: string;
  defaultResults: number;
  maxResults: number;
  snippetChars: number;
  maxDocChars: number;
  maxFileBytes: number;
  indexTtlMs: number;
  denyPatterns: string[];
  logLevel: LogLevel;
  /** Manifest de ambiente gerado por `npm run detect-env` (fora dos vaults). */
  runtimeManifest: string;
}

/** Raiz do pacote (dist/src/server/config.js → ../../..). */
const PACKAGE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
export const DEFAULT_RUNTIME_MANIFEST = path.join(PACKAGE_ROOT, "runtime-output", "environment-manifest.json");

const DEFAULTS: Omit<AkmConfig, "roots" | "kbRoot" | "harnessRoot" | "runtimeManifest"> = {
  kbSubdir: "AI-Agent-Ecosystem",
  defaultResults: 5,
  maxResults: 20,
  snippetChars: 220,
  maxDocChars: 6000,
  maxFileBytes: 1_000_000,
  indexTtlMs: 2000,
  denyPatterns: [],
  logLevel: "info",
};

function int(v: string | undefined, fallback: number, min: number, max: number): number {
  if (v === undefined || v.trim() === "") return fallback;
  const n = Number.parseInt(v, 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

function expandHome(p: string): string {
  if (p === "~") return os.homedir();
  if (p.startsWith("~/")) return path.join(os.homedir(), p.slice(2));
  return p;
}

/** Lê "nome=caminho;nome2=caminho2". */
export function parseRootsEnv(v: string): RootConfig[] {
  return v.split(";").map((s) => s.trim()).filter(Boolean).map((pair, i) => {
    const eq = pair.indexOf("=");
    if (eq <= 0) return { name: `root${i + 1}`, path: expandHome(pair) };
    return { name: pair.slice(0, eq).trim(), path: expandHome(pair.slice(eq + 1).trim()) };
  });
}

/**
 * Precedência: padrões < arquivo JSON (AKM_CONFIG) < variáveis de ambiente AKM_*.
 */
export function loadConfig(env: NodeJS.ProcessEnv = process.env): AkmConfig {
  let file: Partial<AkmConfig> = {};
  if (env.AKM_CONFIG) {
    const raw = fs.readFileSync(expandHome(env.AKM_CONFIG), "utf8");
    file = JSON.parse(raw) as Partial<AkmConfig>;
  }
  let roots: RootConfig[] = (file.roots ?? []).map((r) => ({ ...r, path: expandHome(r.path) }));
  if (env.AKM_VAULT_ROOTS) roots = parseRootsEnv(env.AKM_VAULT_ROOTS);
  if (env.AKM_ROOT_INCLUDE) {
    const inc = JSON.parse(env.AKM_ROOT_INCLUDE) as Record<string, string[]>;
    roots = roots.map((r) => (inc[r.name] ? { ...r, include: inc[r.name] } : r));
  }
  if (roots.length === 0) {
    throw new Error("Nenhuma raiz configurada. Defina AKM_VAULT_ROOTS (nome=caminho;...) ou AKM_CONFIG.");
  }
  const names = new Set<string>();
  for (const r of roots) {
    if (!/^[A-Za-z0-9_-]+$/.test(r.name)) throw new Error(`Nome de raiz inválido: "${r.name}" (use letras, números, _ ou -).`);
    if (names.has(r.name)) throw new Error(`Nome de raiz duplicado: ${r.name}`);
    names.add(r.name);
    if (!path.isAbsolute(r.path)) throw new Error(`A raiz "${r.name}" precisa de caminho absoluto.`);
  }
  const extraDeny = env.AKM_DENY_PATTERNS ? env.AKM_DENY_PATTERNS.split(";").map((s) => s.trim()).filter(Boolean) : [];
  return {
    roots,
    kbRoot: env.AKM_KB_ROOT ?? file.kbRoot ?? roots[0].name,
    kbSubdir: (env.AKM_KB_SUBDIR ?? file.kbSubdir ?? DEFAULTS.kbSubdir).replace(/^\/+|\/+$/g, ""),
    harnessRoot: env.AKM_HARNESS_ROOT ?? file.harnessRoot ?? "harness",
    defaultResults: int(env.AKM_DEFAULT_RESULTS, file.defaultResults ?? DEFAULTS.defaultResults, 1, 50),
    maxResults: int(env.AKM_MAX_RESULTS, file.maxResults ?? DEFAULTS.maxResults, 1, 100),
    snippetChars: int(env.AKM_SNIPPET_CHARS, file.snippetChars ?? DEFAULTS.snippetChars, 60, 2000),
    maxDocChars: int(env.AKM_MAX_DOC_CHARS, file.maxDocChars ?? DEFAULTS.maxDocChars, 500, 100_000),
    maxFileBytes: int(env.AKM_MAX_FILE_BYTES, file.maxFileBytes ?? DEFAULTS.maxFileBytes, 1_000, 20_000_000),
    indexTtlMs: int(env.AKM_INDEX_TTL_MS, file.indexTtlMs ?? DEFAULTS.indexTtlMs, 0, 3_600_000),
    denyPatterns: [...(file.denyPatterns ?? []), ...extraDeny],
    logLevel: parseLevel(env.AKM_LOG_LEVEL ?? file.logLevel, DEFAULTS.logLevel),
    runtimeManifest: expandHome(env.AKM_RUNTIME_MANIFEST ?? file.runtimeManifest ?? DEFAULT_RUNTIME_MANIFEST),
  };
}
