// Logger mínimo: escreve SEMPRE em stderr (stdout é o canal do protocolo MCP via stdio).
export type LogLevel = "error" | "warn" | "info" | "debug";
const ORDER: Record<LogLevel, number> = { error: 0, warn: 1, info: 2, debug: 3 };

export class Logger {
  constructor(private level: LogLevel = "info") {}
  setLevel(level: LogLevel): void { this.level = level; }
  private write(level: LogLevel, msg: string, extra?: unknown): void {
    if (ORDER[level] > ORDER[this.level]) return;
    const line = `[akm] ${new Date().toISOString()} ${level.toUpperCase()} ${msg}` +
      (extra === undefined ? "" : " " + safeJson(extra));
    process.stderr.write(line + "\n");
  }
  error(msg: string, extra?: unknown): void { this.write("error", msg, extra); }
  warn(msg: string, extra?: unknown): void { this.write("warn", msg, extra); }
  info(msg: string, extra?: unknown): void { this.write("info", msg, extra); }
  debug(msg: string, extra?: unknown): void { this.write("debug", msg, extra); }
}

function safeJson(v: unknown): string {
  try { return JSON.stringify(v); } catch { return String(v); }
}

export function parseLevel(v: string | undefined, fallback: LogLevel = "info"): LogLevel {
  const s = (v ?? "").toLowerCase();
  return (s === "error" || s === "warn" || s === "info" || s === "debug") ? s : fallback;
}
