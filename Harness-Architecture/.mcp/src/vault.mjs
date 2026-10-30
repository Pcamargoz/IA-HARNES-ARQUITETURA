import fs from "node:fs";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import {
  ALLOW_GIT,
  ALLOW_WRITES,
  TEXT_EXTENSIONS,
  VAULT_ROOT,
  WRITE_ROOTS,
} from "./config.mjs";
import { invalidateIndex } from "./search.mjs";

const execFileAsync = promisify(execFile);

export function safeResolve(relativePath) {
  if (typeof relativePath !== "string" || relativePath.trim() === "") {
    throw new Error("Empty path.");
  }
  const cleaned = relativePath.replace(/\\/g, "/").replace(/^\/+/, "");
  if (cleaned.includes("\0")) throw new Error("Invalid path.");
  const resolved = path.resolve(VAULT_ROOT, cleaned);
  const root = path.resolve(VAULT_ROOT);
  const relative = path.relative(root, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error("Paths outside the vault are forbidden.");
  }
  return { absolute: resolved, relative: relative.split(path.sep).join("/") };
}

export function assertExtension(relativePath) {
  const ext = path.extname(relativePath).toLowerCase();
  if (!TEXT_EXTENSIONS.has(ext)) {
    throw new Error(`Extension not allowed: ${ext || "(none)"}`);
  }
}

export function assertWritable(relativePath) {
  if (!ALLOW_WRITES) {
    throw new Error(
      "Writes disabled. Set VAULT_ALLOW_WRITES=1 and restart the server.",
    );
  }
  const normalized = relativePath.replace(/\\/g, "/").replace(/^\/+/, "");
  const allowed = WRITE_ROOTS.some(
    (rootPath) => normalized === rootPath || normalized.startsWith(`${rootPath}/`),
  );
  if (!allowed) {
    throw new Error(
      `Path outside writable areas (${WRITE_ROOTS.join(", ")}): ${normalized}`,
    );
  }
}

export function writeNote(relativePath, content, mode = "create") {
  assertWritable(relativePath);
  const { absolute, relative } = safeResolve(relativePath);
  assertExtension(relative);

  if (typeof content !== "string") throw new Error("Content must be text.");

  const exists = fs.existsSync(absolute);
  if (mode === "create" && exists) {
    throw new Error(`File already exists: ${relative}. Use mode=replace or append.`);
  }
  if ((mode === "replace" || mode === "append") && !exists) {
    throw new Error(`File does not exist: ${relative}. Use mode=create.`);
  }

  fs.mkdirSync(path.dirname(absolute), { recursive: true });

  if (mode === "append") {
    fs.appendFileSync(absolute, content, "utf8");
  } else {
    fs.writeFileSync(absolute, content, "utf8");
  }

  invalidateIndex();
  return {
    path: relative,
    mode,
    bytes: Buffer.byteLength(content, "utf8"),
    action: exists ? "updated" : "created",
  };
}

export async function gitCommit(message, paths) {
  if (!ALLOW_GIT) {
    throw new Error("Git disabled. Set VAULT_ALLOW_GIT=1 and restart.");
  }
  if (typeof message !== "string" || message.trim().length < 3) {
    throw new Error("Commit message too short.");
  }
  if (!Array.isArray(paths) || paths.length === 0) {
    throw new Error("Provide at least one path to commit.");
  }

  const safePaths = paths.map((item) => safeResolve(item).relative);

  try {
    await execFileAsync("git", ["rev-parse", "--is-inside-work-tree"], {
      cwd: VAULT_ROOT,
    });
  } catch {
    throw new Error("The vault is not a Git repository.");
  }

  await execFileAsync("git", ["add", "--", ...safePaths], { cwd: VAULT_ROOT });
  const { stdout } = await execFileAsync(
    "git",
    ["commit", "-m", message, "--", ...safePaths],
    { cwd: VAULT_ROOT },
  );

  return { message, paths: safePaths, output: stdout.trim() };
}
