import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));

function boolEnv(name, fallback = false) {
  const raw = process.env[name];
  if (raw === undefined || raw === "") return fallback;
  return /^(1|true|yes|on)$/i.test(raw.trim());
}

function intEnv(name, fallback) {
  const raw = Number.parseInt(process.env[name] ?? "", 10);
  return Number.isFinite(raw) && raw > 0 ? raw : fallback;
}

export const VAULT_ROOT = path.resolve(
  process.env.VAULT_ROOT && process.env.VAULT_ROOT.trim() !== ""
    ? process.env.VAULT_ROOT
    : path.join(here, "..", ".."),
);

export const ALLOW_WRITES = boolEnv("VAULT_ALLOW_WRITES", false);
export const ALLOW_GIT = boolEnv("VAULT_ALLOW_GIT", false);

export const WRITE_ROOTS = (process.env.VAULT_WRITE_ROOTS ?? "Inbox")
  .split(",")
  .map((item) => item.trim())
  .filter(Boolean);

export const MAX_READ_CHARS = intEnv("VAULT_MAX_READ_CHARS", 20000);

// How long the index is trusted before checking the disk for changes. 0 = always check.
const ttl = Number.parseInt(process.env.VAULT_INDEX_TTL_MS ?? "", 10);
export const INDEX_TTL_MS = Number.isFinite(ttl) && ttl >= 0 ? ttl : 3000;

// Days without an `updated` bump before vault_health flags a note as stale.
export const STALE_DAYS = intEnv("VAULT_STALE_DAYS", 90);

export const IGNORED_DIRS = new Set([
  ".git",
  ".obsidian",
  ".trash",
  "node_modules",
  ".mcp",
  ".vercel",
  ".idea",
  ".vscode",
]);

export const TEXT_EXTENSIONS = new Set([
  ".md",
  ".txt",
  ".yaml",
  ".yml",
  ".json",
  ".canvas",
]);

export const NOTE_EXTENSIONS = new Set([".md"]);
