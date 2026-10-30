import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..", "..");

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    if (entry.name === "node_modules") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else if (entry.name.endsWith(".md")) acc.push(full);
  }
  return acc;
}

const notes = walk(root);
const index = new Map();
for (const file of notes) {
  const rel = path.relative(root, file).split(path.sep).join("/");
  index.set(rel.replace(/\.md$/, "").toLowerCase(), rel);
  index.set(path.basename(file, ".md").toLowerCase(), rel);
}

const broken = [];
for (const file of notes) {
  const rel = path.relative(root, file).split(path.sep).join("/");
  const body = fs.readFileSync(file, "utf8").replace(/`[^`]*`/g, "");
  for (const match of body.matchAll(/\[\[([^\]|#]+)(?:[#|][^\]]*)?\]\]/g)) {
    const raw = match[1].trim().replace(/\\+$/, "");
    const isEmbed = body[match.index - 1] === "!";
    if (isEmbed || /\.[a-z0-9]{2,5}$/i.test(raw)) {
      if (!fs.existsSync(path.join(root, raw))) {
        broken.push({ from: rel, target: raw });
      }
      continue;
    }
    const target = raw.toLowerCase();
    if (!index.has(target)) broken.push({ from: rel, target: raw });
  }
}

if (broken.length) {
  console.log(`FAIL ${broken.length} broken link(s):`);
  for (const item of broken) console.log(`- ${item.from} -> [[${item.target}]]`);
  process.exit(1);
}

console.log(`PASS ${notes.length} notes, all internal links resolve.`);
