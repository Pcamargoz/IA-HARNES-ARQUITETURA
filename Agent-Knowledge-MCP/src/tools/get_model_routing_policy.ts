import { z } from "zod";
import { normalize } from "../search/text.js";
import { readDocument } from "./helpers.js";
import { cardLine, cardsForRow, findTaskRow, loadModelCatalog, snapshotLine, type ModelCatalog } from "./model-catalog-helpers.js";
import { parseTable, readRaw } from "./orchestration-helpers.js";
import { runtimeDocs } from "./runtime-helpers.js";
import { defineTool, ToolInputError } from "./types.js";

const Candidate = z.object({
  name: z.string().max(80),
  cost_per_attempt: z.number().min(0).describe("custo de UMA tentativa (USD, tokens ou unidade de cota — use a mesma unidade em todos)"),
  success_rate: z.number().gt(0).max(1).describe("probabilidade de sucesso por tentativa (0–1), de histórico ou estimativa"),
  rework_cost: z.number().min(0).optional().describe("custo extra quando a tentativa falha (revisão, correção), mesma unidade"),
  max_attempts: z.number().int().min(1).max(10).optional(),
});

/** Custo esperado até o 1º sucesso, com teto de tentativas (distribuição geométrica truncada). */
export function expectedCost(c: z.infer<typeof Candidate>) {
  const p = c.success_rate; const q = 1 - p; const n = c.max_attempts ?? 3; const rw = c.rework_cost ?? 0;
  const pSuccess = 1 - q ** n;                         // chance de terminar em até n tentativas
  const expAttempts = (1 - q ** n) / p;                // E[tentativas] com teto n
  const expFailures = expAttempts - pSuccess;          // tentativas que falharam
  const cost = expAttempts * c.cost_per_attempt + expFailures * rw;
  return { name: c.name, expected_attempts: +expAttempts.toFixed(3), p_success_within_cap: +pSuccess.toFixed(3),
    expected_cost: +cost.toFixed(6), cost_per_success: +(cost / pSuccess).toFixed(6) };
}

function hardRules(cat: ModelCatalog): Array<Record<string, unknown>> {
  const r = cat.rules?.hard_rules;
  return Array.isArray(r) ? (r as Array<Record<string, unknown>>) : [];
}

function requireCatalog(cat: ModelCatalog): void {
  if (!cat.doc) throw new ToolInputError("Catálogo de modelos (type=model-catalog) não encontrado em 11-Universal-Agent-Runtime.");
}

export const getModelRoutingPolicy = defineTool({
  name: "get_model_routing_policy",
  title: "Política de roteamento de modelos",
  description:
    "Lê a política do Model Router (type=routing-policy em 11-Universal-Agent-Runtime): fatores, tiers por complexidade, escalonamento. " +
    "'complexity' devolve a linha do tier (trivial|simples|moderada|complexa|critica). 'section' lê uma seção. " +
    "'compare' calcula o custo esperado por SUCESSO de candidatos (custo/tentativa, taxa de sucesso, retrabalho): mostra quando o modelo barato sai mais caro. " +
    "Catálogo de modelos (type=model-catalog + fichas type=model-card): 'task' devolve a linha da matriz tarefa → primário/fallback/barato-local " +
    "com as fichas citadas e as regras duras (dados do Cofre, cota); 'view' = catalog (fichas; filtros 'local', 'layer' core|local|reserve), " +
    "matrix, rules (regras de decisão + cotas por acesso) ou all. Rankings são fotografia datada (ver snapshot). " +
    "O cálculo é determinístico sobre os valores informados; não é medição. Somente leitura.",
  inputSchema: {
    complexity: z.string().max(30).optional(),
    section: z.string().max(120).optional(),
    compare: z.array(Candidate).min(1).max(8).optional(),
    task: z.string().max(80).optional().describe("tipo de tarefa (id ou nome da matriz, ex.: codigo-java-spring, revisao, dados-sensiveis)"),
    view: z.enum(["policy", "catalog", "matrix", "rules", "all"]).optional(),
    local: z.boolean().optional().describe("com view=catalog: só modelos locais (true) ou só remotos (false)"),
    layer: z.string().max(20).optional().describe("com view=catalog: core | local | reserve"),
    format: z.enum(["text", "json"]).optional(),
  },
  handler(ctx, a) {
    const view = a.view ?? (a.task ? "task" : "policy");
    const cat = loadModelCatalog(ctx);

    if (view !== "policy") {
      requireCatalog(cat);
      const src = cat.doc!.id;
      const json = a.format === "json";
      if (view === "task" || (a.task && view === "matrix")) {
        const row = findTaskRow(cat.matrix, a.task ?? "");
        if (!row) throw new ToolInputError(`Tarefa "${a.task}" não encontrada na matriz. Opções: ${cat.matrix.map((r) => r.id || r.tarefa).join(", ")}`);
        const models = cardsForRow(cat.cards, row);
        const rules = hardRules(cat);
        const fallback = cat.rules?.quota_fallback ?? null;
        if (json) return JSON.stringify({ source: src, snapshot: cat.snapshot, task: row, models, hard_rules: rules, quota_fallback: fallback });
        const out = [`Matriz de modelos — ${src}`, snapshotLine(cat), "", `Tarefa: ${row.tarefa} (${row.id ?? "-"})`];
        for (const [k, v] of Object.entries(row)) if (!["tarefa", "id", "apelidos"].includes(k)) out.push(`- ${k}: ${v}`);
        out.push("", "Fichas citadas:", ...(models.length ? models.map(cardLine) : ["- (nenhuma ficha casou com os model_id da linha)"]));
        if (rules.length) out.push("", "Regras duras:", ...rules.map((r) => `- ${String(r.id ?? "?")}: ${String(r.rule ?? "")}`));
        if (Array.isArray(fallback)) out.push("", `Cota esgotada → ${fallback.map(String).join(" → ")}`);
        return out.join("\n");
      }
      if (view === "catalog") {
        let sel = cat.cards;
        if (a.local !== undefined) sel = sel.filter((c) => c.local === a.local);
        if (a.layer) { const l = normalize(a.layer).trim(); sel = sel.filter((c) => normalize(c.layer ?? "") === l); }
        if (json) return JSON.stringify({ source: src, snapshot: cat.snapshot, total: cat.cards.length, models: sel });
        return [`${sel.length} de ${cat.cards.length} ficha(s) de modelo — ${src}`, snapshotLine(cat), "", ...sel.map(cardLine)].join("\n");
      }
      if (view === "matrix") {
        if (json) return JSON.stringify({ source: src, snapshot: cat.snapshot, matrix: cat.matrix });
        const out = [`Matriz tarefa → modelo (${cat.matrix.length} tarefas) — ${src}`, snapshotLine(cat), ""];
        for (const r of cat.matrix) out.push(`- ${r.id ?? r.tarefa}: primário=${r.primario} | fallback=${r.fallback} | barato/local=${r.barato_local} | dados até=${r.dados_max ?? "?"}`);
        return out.join("\n");
      }
      if (view === "rules") {
        if (json) return JSON.stringify({ source: src, snapshot: cat.snapshot, rules: cat.rules ?? null, rules_error: cat.rulesError, quotas: cat.quotas });
        if (!cat.rules) throw new ToolInputError(`Regras do catálogo ilegíveis: ${cat.rulesError}`);
        const out = [`Regras de decisão de modelo — ${src}`, snapshotLine(cat)];
        const order = cat.rules.evaluation_order;
        if (Array.isArray(order)) out.push("", `Ordem de avaliação: ${order.map(String).join(" → ")}`);
        out.push("", "Regras duras:", ...hardRules(cat).map((r) => `- ${String(r.id ?? "?")}: ${String(r.rule ?? "")}`));
        const fb = cat.rules.quota_fallback;
        if (Array.isArray(fb)) out.push("", `Cota esgotada → ${fb.map(String).join(" → ")}`);
        if (cat.quotas.length) {
          out.push("", "Cotas por acesso:");
          for (const q of cat.quotas) out.push(`- ${q.acesso}: ${q.limite ?? "?"} | ao esgotar: ${q.ao_esgotar ?? "?"}`);
        }
        return out.join("\n");
      }
      // all
      if (json) return JSON.stringify({ source: src, snapshot: cat.snapshot, models: cat.cards, matrix: cat.matrix, rules: cat.rules ?? null, quotas: cat.quotas });
      return [`Catálogo completo — ${src}`, snapshotLine(cat), "", `${cat.cards.length} fichas:`, ...cat.cards.map(cardLine), "",
        `${cat.matrix.length} tarefas na matriz: ${cat.matrix.map((r) => r.id ?? r.tarefa).join(", ")}`,
        `Regras duras: ${hardRules(cat).map((r) => String(r.id)).join(", ") || "—"}`].join("\n");
    }

    const d = runtimeDocs(ctx, "routing-policy")[0];
    if (!d) throw new ToolInputError("Política de roteamento (type=routing-policy) não encontrada em 11-Universal-Agent-Runtime.");
    const raw = readRaw(ctx, d);
    const tiers = parseTable(raw, "complexidade");
    const factors = parseTable(raw, "fator");
    let tier: Record<string, string> | undefined;
    if (a.complexity) {
      const w = normalize(a.complexity).trim();
      tier = tiers.find((r) => normalize(r.complexidade ?? "") === w) ?? tiers.find((r) => normalize(r.complexidade ?? "").includes(w));
      if (!tier) throw new ToolInputError(`Complexidade "${a.complexity}" não encontrada. Opções: ${tiers.map((r) => r.complexidade).join(", ")}`);
    }
    const cmp = a.compare?.map(expectedCost).sort((x, y) => x.cost_per_success - y.cost_per_success);
    const catInfo = cat.doc ? { source: cat.doc.id, models: cat.cards.length, tasks: cat.matrix.length, snapshot: cat.snapshot } : null;
    if (a.format === "json") return JSON.stringify({ source: d.id, tier: tier ?? null, tiers: a.complexity ? undefined : tiers, factors, compare: cmp ?? null, model_catalog: catInfo });
    if (a.section) {
      const s = normalize(a.section).trim();
      const h = d.headings.find((x) => normalize(x.text).includes(s));
      if (!h) throw new ToolInputError(`Seção "${a.section}" não existe. Seções: ${d.headings.filter((x) => x.level >= 2).map((x) => x.text).join("; ")}`);
      return readDocument(ctx, d.root, d.rel, { heading: h.text });
    }
    const out = [`Política de roteamento — ${d.id} [${d.status ?? "?"}]`];
    if (tier) out.push("", "Tier escolhido:", ...Object.entries(tier).map(([k, v]) => `- ${k}: ${v}`));
    else if (!cmp) {
      out.push("", `${factors.length} fatores: ${factors.map((f) => f.fator).join("; ")}`, "", "Tiers:");
      for (const t of tiers) out.push(`- ${t.complexidade}: ${Object.entries(t).filter(([k]) => k !== "complexidade").map(([k, v]) => `${k}=${v}`).join(" | ")}`);
      out.push("", `Seções: ${d.headings.filter((x) => x.level === 2).map((x) => x.text).join("; ")}`);
    }
    if (cmp) {
      out.push("", "Custo esperado por sucesso (estimativa sobre os valores informados; menor primeiro):");
      for (const c of cmp) out.push(`- ${c.name}: E[tentativas]=${c.expected_attempts}, P(sucesso no teto)=${c.p_success_within_cap}, E[custo]=${c.expected_cost}, custo/sucesso=${c.cost_per_success}`);
    }
    if (catInfo) out.push("", `Catálogo de modelos: ${catInfo.models} fichas, ${catInfo.tasks} tarefas (${snapshotLine(cat)}). Use task=… ou view=catalog|matrix|rules.`);
    return out.join("\n");
  },
});
