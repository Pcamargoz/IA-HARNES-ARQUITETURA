import fs from "node:fs";
import path from "node:path";
import type { RootConfig } from "../server/config.js";

/** Raiz já validada: caminho real (realpath) e lista de inclusão normalizada. */
export interface ResolvedRoot {
  name: string;
  real: string;
  include: string[]; // relativos, com "/" ; vazio = raiz inteira
}

export class AccessError extends Error {
  constructor(message: string) { super(message); this.name = "AccessError"; }
}

/** Arquivos com estes nomes nunca são indexados nem servidos (possíveis credenciais). */
const BUILTIN_DENY: RegExp[] = [
  /(^|\/)\.[^/]*/,                       // qualquer segmento oculto: .obsidian, .git, .env, .mcp, .trash
  /(^|\/)node_modules(\/|$)/,
  /(chave|senha|password|passwd|secret|segredo|credencia|api[-_ ]?key|apikey)[^/]*$/i, // nome do arquivo
];

export class PathGuard {
  readonly roots: Map<string, ResolvedRoot> = new Map();
  private deny: RegExp[];

  constructor(roots: RootConfig[], extraDeny: string[] = []) {
    this.deny = [...BUILTIN_DENY, ...extraDeny.map((p) => new RegExp(p, "i"))];
    for (const r of roots) {
      let real: string;
      try {
        real = fs.realpathSync(r.path);
      } catch {
        throw new Error(`Raiz "${r.name}" não existe ou não é acessível.`);
      }
      if (!fs.statSync(real).isDirectory()) throw new Error(`Raiz "${r.name}" não é diretório.`);
      const include = (r.include ?? []).map((s) => toPosix(s).replace(/^\/+|\/+$/g, "")).filter((s) => s !== "");
      for (const inc of include) {
        if (inc.split("/").includes("..") || path.isAbsolute(inc)) throw new Error(`include inválido em "${r.name}": ${inc}`);
      }
      this.roots.set(r.name, { name: r.name, real, include });
    }
  }

  isDenied(rel: string): boolean {
    const p = toPosix(rel);
    return this.deny.some((re) => re.test(p));
  }

  /** O caminho relativo está dentro das inclusões configuradas da raiz? */
  isIncluded(root: ResolvedRoot, rel: string): boolean {
    if (root.include.length === 0) return true;
    const p = toPosix(rel);
    return root.include.some((inc) => p === inc || p.startsWith(inc + "/"));
  }

  /**
   * Valida um caminho pedido por um agente e devolve o caminho absoluto real.
   * Bloqueia: raiz desconhecida, caminho absoluto, "..", segmentos ocultos, não-.md,
   * symlinks, saída da raiz após realpath, fora do include, padrões negados e arquivos grandes.
   */
  resolve(rootName: string, relInput: string, maxBytes: number): { abs: string; rel: string; root: ResolvedRoot } {
    const root = this.roots.get(rootName);
    if (!root) throw new AccessError(`Raiz desconhecida: "${rootName}". Raízes: ${[...this.roots.keys()].join(", ")}`);
    if (typeof relInput !== "string" || relInput.trim() === "") throw new AccessError("Caminho vazio.");
    if (relInput.includes("\0")) throw new AccessError("Caminho inválido.");
    const raw = toPosix(relInput.trim());
    if (raw.startsWith("/") || /^[A-Za-z]:/.test(raw) || path.isAbsolute(relInput)) throw new AccessError("Use caminho relativo à raiz, não absoluto.");
    const segs = raw.split("/");
    if (segs.includes("..")) throw new AccessError("Caminho com '..' não é permitido.");
    const rel = path.posix.normalize(raw).replace(/^\.\//, "");
    if (!rel.toLowerCase().endsWith(".md")) throw new AccessError("Somente arquivos Markdown (.md) podem ser lidos.");
    if (this.isDenied(rel)) throw new AccessError("Caminho bloqueado pela política de segurança (oculto, node_modules ou possível credencial).");
    if (!this.isIncluded(root, rel)) throw new AccessError("Caminho fora das pastas autorizadas desta raiz.");
    const candidate = path.join(root.real, ...rel.split("/"));
    let lst: fs.Stats;
    try { lst = fs.lstatSync(candidate); } catch { throw new AccessError(`Documento não encontrado: ${rootName}:${rel}`); }
    if (lst.isSymbolicLink()) throw new AccessError("Links simbólicos não são servidos.");
    const real = fs.realpathSync(candidate);
    if (!isInside(root.real, real)) throw new AccessError("Caminho resolve para fora da raiz autorizada.");
    const st = fs.statSync(real);
    if (!st.isFile()) throw new AccessError("Não é um arquivo.");
    if (st.size > maxBytes) throw new AccessError(`Arquivo maior que o limite (${maxBytes} bytes).`);
    return { abs: real, rel, root };
  }
}

export function isInside(parent: string, child: string): boolean {
  const r = path.relative(parent, child);
  return r === "" || (!r.startsWith("..") && !path.isAbsolute(r));
}

export function toPosix(p: string): string {
  return p.split(path.sep).join("/").replace(/\\/g, "/");
}

/** Aceita "raiz:caminho/rel.md" ou (root, path) separados. */
export function splitDocId(id: string, rootHint?: string): { root?: string; rel: string } {
  const m = /^([A-Za-z0-9_-]+):(?!\/\/)(.+)$/.exec(id);
  if (m && !/^[A-Za-z]$/.test(m[1])) return { root: m[1], rel: m[2] };
  return { root: rootHint, rel: id };
}
