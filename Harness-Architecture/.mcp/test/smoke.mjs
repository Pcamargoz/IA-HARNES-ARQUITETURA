import path from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const serverEntry = path.join(here, "..", "src", "index.mjs");
const vaultRoot = path.resolve(here, "..", "..");

const checks = [];
function check(name, condition, detail = "") {
  checks.push({ name, ok: Boolean(condition), detail });
  console.log(`${condition ? "PASS" : "FAIL"} ${name}${detail ? ` — ${detail}` : ""}`);
}

const transport = new StdioClientTransport({
  command: process.execPath,
  args: [serverEntry],
  env: {
    ...process.env,
    VAULT_ROOT: vaultRoot,
    VAULT_ALLOW_WRITES: "0",
    VAULT_ALLOW_GIT: "0",
  },
});

const client = new Client({ name: "hermes-smoke", version: "0.1.0" });

try {
  await client.connect(transport);

  const tools = await client.listTools();
  const names = tools.tools.map((tool) => tool.name).sort();
  check("lists 13 tools", names.length === 13, names.join(", "));

  const index = await client.callTool({ name: "vault_index", arguments: {} });
  check(
    "vault_index returns contract",
    index.content?.[0]?.text?.includes("Global Operating Contract"),
  );

  const search = await client.callTool({
    name: "vault_search",
    arguments: { query: "code review", limit: 5 },
  });
  const searchText = search.content?.[0]?.text ?? "";
  check(
    "search finds code-review",
    searchText.includes("Process/code-review.md"),
    searchText.slice(0, 120),
  );

  const read = await client.callTool({
    name: "vault_read",
    arguments: { path: "Process/workflow.md", heading: "Stages and gates" },
  });
  const readText = read.content?.[0]?.text ?? "";
  check(
    "read by heading",
    readText.includes("Stages and gates") && readText.includes("Specify"),
  );

  const links = await client.callTool({
    name: "vault_links",
    arguments: { path: "HOME.md" },
  });
  const linksText = links.content?.[0]?.text ?? "";
  check("HOME links", linksText.includes("backlinks"), linksText.slice(0, 100));

  const json = (result) => JSON.parse(result.content?.[0]?.text ?? "{}");

  const lean = json(await client.callTool({
    name: "vault_index",
    arguments: { include_contract: false },
  }));
  check("vault_index can skip the contract", lean.contract === null && lean.notes > 0);

  const outline = json(await client.callTool({
    name: "vault_outline",
    arguments: { path: "Process/workflow.md" },
  }));
  check(
    "outline lists headings with sizes",
    outline.headings?.some((item) => item.heading === "Stages and gates" && item.chars > 0),
  );
  check("outline parses list tags", outline.meta?.tags?.includes("hermes"), JSON.stringify(outline.meta?.tags));

  const query = json(await client.callTool({
    name: "vault_query",
    arguments: { type: "catalog", tag: "mcp" },
  }));
  check(
    "query filters by type and tag",
    query.notes?.some((item) => item.path === "Optimization/mcp-catalog.md") &&
      query.notes.every((item) => item.type === "catalog"),
    `${query.count} match(es)`,
  );

  const recent = json(await client.callTool({ name: "vault_recent", arguments: { limit: 3 } }));
  check("recent returns notes", recent.notes?.length === 3);

  const health = json(await client.callTool({ name: "vault_health", arguments: {} }));
  check(
    "vault is healthy",
    health.ok === true,
    JSON.stringify(health.summary),
  );

  const metrics = json(await client.callTool({ name: "vault_metrics", arguments: {} }));
  check(
    "metrics parses the execution log",
    typeof metrics.tasks === "number" && metrics.source === "Metrics/execution-log.md",
    `${metrics.tasks} task(s)`,
  );

  const exact = json(await client.callTool({
    name: "vault_read",
    arguments: { path: "Metrics/execution-log.md", heading: "Log" },
  }));
  check("exact heading wins over substring", exact.heading === "Log");

  const retrieve = json(await client.callTool({
    name: "vault_retrieve",
    arguments: { query: "design patterns" },
  }));
  check(
    "retrieve returns capped chunks of design-patterns",
    retrieve.chunks?.some((item) => item.path === "Process/design-patterns.md") &&
      retrieve.chunks.length <= 3 &&
      retrieve.chunks.every((item) => item.chars <= 1500),
    retrieve.chunks?.map((item) => item.citation).join(", "),
  );

  const write = await client.callTool({
    name: "vault_write",
    arguments: { path: "Inbox/teste.md", content: "# teste", mode: "create" },
  });
  check(
    "write blocked by default",
    write.isError === true && String(write.content?.[0]?.text).includes("Writes disabled"),
  );

  const traversal = await client.callTool({
    name: "vault_read",
    arguments: { path: "../../../../etc/passwd" },
  });
  check("path traversal blocked", traversal.isError === true);
} catch (error) {
  check("runs without exception", false, error.message);
} finally {
  await client.close();
}

const failed = checks.filter((item) => !item.ok);
console.log(`\n${checks.length - failed.length}/${checks.length} checks passed.`);
process.exit(failed.length ? 1 : 0);
