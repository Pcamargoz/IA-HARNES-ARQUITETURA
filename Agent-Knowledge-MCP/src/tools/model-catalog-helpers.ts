import YAML from "yaml";
import type { IndexedDoc } from "../search/indexer.js";
import { normalize } from "../search/text.js";
import { fmList, fmObj, fmText, parseTable, readRaw, termScore, terms } from "./orchestration-helpers.js";
import { runtimeDocs } from "./runtime-helpers.js";
import type { ToolContext } from "./types.js";

/**
 * Catálogo de modelos do Universal Agent Runtime (somente leitura). Fonte: notas em
 * <KB>/11-Universal-Agent-Runtime com type=model-catalog (matriz tarefa → modelo, cotas e regras
 * em bloco ```yaml) e type=model-card (uma ficha por modelo). Notas novas entram sem mudar código.
 */
export interface ModelCard {
  model_id: string;
  title: string;
  provider?: string;
  access_path: string[];
  adapter?: string;
  layer?: string;
  tier?: string;
  availability?: string;
  context_window?: string;
  cost_class?: string;
  strengths: string[];
  weaknesses: string[];
  trains_on_inputs?: string;
  opt_out_confirmed?: string;
  cofre_allowed?: string;
  local: boolean;
  verified_at?: string;
  sources: string[];
  note: string;
}

export interface ModelCatalog {
  doc?: IndexedDoc;
  cards: ModelCard[];
  matrix: Array<Record<string, string>>;
  quotas: Array<Record<string, string>>;
  rules?: Record<string, unknown>;
  rulesError?: string;
  snapshot?: { date?: string; age_days?: number; review_every_days: number; stale: boolean };
}

const LAYER_ORDER: Record<string, number> = { core: 0, local: 1, reserve: 2 };

function toCard(d: IndexedDoc): ModelCard {
  const dp = fmObj(d, "data_policy") ?? {};
  const s = (v: unknown) => (v === undefined || v === null ? undefined : String(v));
  return {
    model_id: fmText(d, "model_id") ?? d.rel.split("/").pop()!.replace(/\.md$/i, ""),
    title: d.title,
    provider: fmText(d, "provider"),
    access_path: fmList(d, "access_path"),
    adapter: fmText(d, "adapter"),
    layer: fmText(d, "layer"),
    tier: fmText(d, "tier"),
    availability: fmText(d, "availability"),
    context_window: fmText(d, "context_window"),
    cost_class: fmText(d, "cost_class"),
    strengths: fmList(d, "strengths"),
    weaknesses: fmList(d, "weaknesses"),
    trains_on_inputs: s(dp.trains_on_inputs),
    opt_out_confirmed: s(dp.opt_out_confirmed),
    cofre_allowed: fmText(d, "cofre_allowed"),
    local: d.frontmatter.local === true || fmText(d, "local") === "true",
    verified_at: fmText(d, "verified_at"),
    sources: fmList(d, "sources"),
    note: d.id,
  };
}

/** Primeiro bloco ```yaml do catálogo (regras de decisão legíveis por máquina). */
function parseRules(raw: string): { rules?: Record<string, unknown>; error?: string } {
  const m = raw.match(/```ya?ml\n([\s\S]*?)\n```/);
  if (!m) return { error: "bloco ```yaml de regras ausente" };
  try {
    const v = YAML.parse(m[1]) as unknown;
    if (!v || typeof v !== "object" || Array.isArray(v)) return { error: "bloco yaml não é um objeto" };
    return { rules: v as Record<string, unknown> };
  } catch (e) {
    return { error: `yaml inválido: ${(e as Error).message.split("\n")[0]}` };
  }
}

export function loadModelCatalog(ctx: ToolContext, now: Date = new Date()): ModelCatalog {
  const doc = runtimeDocs(ctx, "model-catalog")[0];
  const cards = runtimeDocs(ctx, "model-card").map(toCard)
    .sort((a, b) => (LAYER_ORDER[a.layer ?? ""] ?? 9) - (LAYER_ORDER[b.layer ?? ""] ?? 9) || a.model_id.localeCompare(b.model_id));
  if (!doc) return { cards, matrix: [], quotas: [] };
  const raw = readRaw(ctx, doc);
  const { rules, error } = parseRules(raw);
  const date = fmText(doc, "snapshot_date");
  const review = Number(fmText(doc, "review_every_days") ?? 30) || 30;
  const t = date ? Date.parse(`${date}T00:00:00Z`) : NaN;
  const age = Number.isFinite(t) ? Math.floor((now.getTime() - t) / 86_400_000) : undefined;
  return {
    doc, cards, rules, rulesError: error,
    matrix: parseTable(raw, "tarefa"),
    quotas: parseTable(raw, "acesso"),
    snapshot: { date, age_days: age, review_every_days: review, stale: age === undefined || age > review },
  };
}

/** Linha da matriz para uma tarefa: id/nome exato, depois contém, depois termos (id, tarefa, apelidos). */
export function findTaskRow(matrix: Array<Record<string, string>>, q: string): Record<string, string> | undefined {
  const w = normalize(q).trim();
  const keys = (r: Record<string, string>) => [r.id ?? "", r.tarefa ?? ""].map((x) => normalize(x).trim()).filter(Boolean);
  const exact = matrix.find((r) => keys(r).includes(w));
  if (exact) return exact;
  const part = matrix.find((r) => keys(r).some((k) => k.includes(w)));
  if (part) return part;
  const qt = terms(q);
  let best: { r: Record<string, string>; s: number } | undefined;
  for (const r of matrix) {
    const s = termScore(qt, `${r.id ?? ""} ${r.tarefa ?? ""} ${r.apelidos ?? ""}`).score;
    if (s > 0 && (!best || s > best.s)) best = { r, s };
  }
  return best?.r;
}

/** Fichas citadas (por model_id) nas colunas de escolha de uma linha da matriz. */
export function cardsForRow(cards: ModelCard[], row: Record<string, string>): ModelCard[] {
  const hay = normalize([row.primario, row.fallback, row.barato_local].join(" "));
  return cards.filter((c) => hay.includes(normalize(c.model_id)));
}

export function snapshotLine(c: ModelCatalog): string {
  const s = c.snapshot;
  if (!s) return "snapshot: —";
  const age = s.age_days === undefined ? "idade desconhecida" : `${s.age_days} dia(s)`;
  return `snapshot ${s.date ?? "sem data"} (${age}; revisão a cada ${s.review_every_days} dias)` +
    (s.stale ? " — VENCIDO: rankings e cotas podem ter mudado; revise o catálogo antes de usar ranking como desempate." : "");
}

export function cardLine(c: ModelCard): string {
  const cofre = c.local ? "Cofre: local" : `Cofre: ${c.cofre_allowed ?? "?"}`;
  return `- ${c.model_id} [${c.layer ?? "?"}; tier=${c.tier ?? "?"}; ${c.availability ?? "?"}] via ${c.access_path.join(", ") || "?"}` +
    ` | custo=${c.cost_class ?? "?"} | contexto=${c.context_window ?? "?"} | treina=${c.trains_on_inputs ?? "?"} | ${cofre}` +
    (c.strengths.length ? ` | forte: ${c.strengths.slice(0, 3).join("; ")}` : "") + ` (${c.note})`;
}
