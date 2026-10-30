// Remove padrões típicos de credenciais de qualquer texto devolvido aos agentes.
const RULES: Array<[RegExp, string | ((...a: string[]) => string)]> = [
  [/\bsk-(?:ant-|proj-)?[A-Za-z0-9_-]{16,}/g, "[REDACTED]"],
  [/\bgh[pousr]_[A-Za-z0-9]{20,}/g, "[REDACTED]"],
  [/\bgithub_pat_[A-Za-z0-9_]{20,}/g, "[REDACTED]"],
  [/\bxox[abprs]-[A-Za-z0-9-]{10,}/g, "[REDACTED]"],
  [/\bAKIA[0-9A-Z]{16}\b/g, "[REDACTED]"],
  [/\bAIza[0-9A-Za-z_-]{30,}/g, "[REDACTED]"],
  [/(Bearer\s+)[A-Za-z0-9._~+/=-]{16,}/g, (_m, p1) => `${p1}[REDACTED]`],
  [/((?:api[_-]?key|access[_-]?token|auth[_-]?token|secret|senha|password|passwd|client[_-]?secret)\s*[:=]\s*["']?)(?!\[REDACTED\])(?!\$\{)[^\s"'`,;]{8,}/gi,
    (_m, p1) => `${p1}[REDACTED]`],
];

export function redact(text: string): string {
  let out = text;
  for (const [re, rep] of RULES) out = out.replace(re, rep as never);
  return out;
}
