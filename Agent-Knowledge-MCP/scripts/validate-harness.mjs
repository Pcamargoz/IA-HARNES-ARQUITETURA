#!/usr/bin/env node
// Reads only approved Harness notes and canonical KB agent specs; never starts an agent.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { parse } from 'yaml';

const harness = path.join(os.homedir(), 'Downloads/Harness-Architecture');
const registry = path.join(os.homedir(), 'Downloads/Cofre do Pedro/AI-Agent-Ecosystem/10-Multi-Agent-Orchestration/01-Agent-Registry/Agents');
const errors = [];
const fm = (file) => {
  const raw = fs.readFileSync(file, 'utf8');
  const block = raw.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!block) throw new Error('frontmatter missing');
  return { raw, metadata: parse(block[1]) };
};
const check = (test, message) => { if (!test) errors.push(message); };
const names = new Set();
const counts = {};
for (const file of fs.readdirSync(registry).filter(n => n.endsWith('.md')).sort()) {
  try {
    const { raw, metadata: m } = fm(path.join(registry, file));
    const required = ['name', 'role', 'description', 'tier', 'tools', 'evidence', 'budget'];
    for (const field of required) check(m[field] !== undefined, `${file}: missing ${field}`);
    check(m.type === 'agent-spec', `${file}: type must be agent-spec`);
    check(['implemented', 'planned', 'conceptual'].includes(m.status), `${file}: invalid status`);
    check(typeof m.name === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(m.name), `${file}: invalid name`);
    check(!names.has(m.name), `${file}: duplicate name`); names.add(m.name);
    check(['tier0', 'small', 'balanced', 'frontier'].includes(m.tier), `${file}: tier must be an alias`);
    check(Array.isArray(m.tools) && m.tools.length > 0, `${file}: explicit tools required`);
    check(typeof m.evidence === 'string' && m.evidence.trim().length > 0, `${file}: evidence required`);
    for (const key of ['max_turns', 'max_retries', 'timeout_min']) {
      const value = m.budget?.[key];
      check(Number.isInteger(value) && (key === 'max_retries' ? value >= 0 : value > 0), `${file}: invalid budget.${key}`);
    }
    if (m.role === 'verifier') {
      check(!m.tools?.some(t => ['Write', 'Edit', 'MultiEdit'].includes(t)), `${file}: verifier has write tool`);
      check(['Write', 'Edit'].every(t => m.disallowed_tools?.includes(t)), `${file}: verifier must explicitly disallow Write/Edit`);
    }
    const body = raw.replace(/^---[\s\S]*?\n---\r?\n/, '');
    check(Buffer.byteLength(body) <= 8192, `${file}: body exceeds 8 KiB`);
    counts[m.status] = (counts[m.status] ?? 0) + 1;
  } catch (error) { errors.push(`${file}: ${error.message}`); }
}
const notes = ['Governance/knowledge-integration.md', 'HARNESS/HARNESS MAIN/orchestrator-prompt.md',
  'Agents/registry.md', 'Security/runtime-policy.md', 'Metrics/baseline.md'];
for (const relative of notes) {
  try {
    const { metadata: m, raw } = fm(path.join(harness, relative));
    for (const field of ['title', 'type', 'status', 'updated', 'tags']) check(m[field] !== undefined, `${relative}: missing ${field}`);
    if (relative.endsWith('orchestrator-prompt.md')) check(raw.split('\n').length <= 150, 'orchestrator prompt exceeds 150 lines');
  } catch (error) { errors.push(`${relative}: ${error.message}`); }
}
// Validate internal links only in the integration's own notes, not unrelated projects.
for (const relative of notes) {
  const file = path.join(harness, relative);
  if (!fs.existsSync(file)) continue;
  for (const match of fs.readFileSync(file, 'utf8').matchAll(/\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|[^\]]*)?\]\]/g)) {
    const link = match[1];
    check(fs.existsSync(path.join(harness, link + '.md')), `${relative}: unresolved internal link ${link}`);
  }
}
const settingsPath = path.join(harness, '.claude/settings.json');
try {
  const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
  for (const name of ['PreToolUse', 'PostToolUse', 'PostToolUseFailure', 'SubagentStop']) {
    check(settings.hooks?.[name]?.length > 0, `missing hook ${name}`);
    for (const group of settings.hooks?.[name] ?? []) for (const hook of group.hooks ?? []) {
      check(hook.type === 'command' && hook.timeout === 5, `${name}: bounded command hook required`);
    }
  }
} catch (error) { errors.push(`settings: ${error.message}`); }
console.log(JSON.stringify({ registry: 'canonical KB', agents: names.size, counts, notes_checked: notes.length,
  errors, status: errors.length ? 'failed' : 'passed', agents_executed: 0 }, null, 2));
process.exitCode = errors.length ? 1 : 0;
