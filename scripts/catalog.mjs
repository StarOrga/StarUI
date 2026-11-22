// Renders catalog/catalog.json into docs/CATALOG.md and validates every entry.
// `npm run catalog` (writes) · `npm run catalog -- --check` (fails when the
// Markdown is stale or an entry is invalid). No external dependencies.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const cat = JSON.parse(readFileSync(join(root, 'catalog', 'catalog.json'), 'utf8'));
const errors = [];
const ids = new Set();
for (const e of cat.entries) {
  if (ids.has(e.id)) errors.push(`duplicate id ${e.id}`);
  ids.add(e.id);
  if (!cat.layers[e.layer]) errors.push(`${e.id}: unknown layer ${e.layer}`);
  if (!cat.statuses[e.status]) errors.push(`${e.id}: unknown status ${e.status}`);
  if (!e.id.startsWith(e.layer + '.')) errors.push(`${e.id}: id must start with its layer "${e.layer}."`);
  for (const s of e.usedIn || []) if (!cat.surfaces[s]) errors.push(`${e.id}: unknown surface ${s}`);
  if (e.home && !cat.surfaces[e.home]) errors.push(`${e.id}: unknown home ${e.home}`);
  if (e.status === 'stable' && !e.home) {
    for (const f of e.source.split(',').map((s) => s.trim())) {
      const p = f.replace(/\/$/, '');
      if (!existsSync(join(root, p))) errors.push(`${e.id}: source ${f} not found`);
    }
  }
}

const L = ['# StarUI catalog', '', '_Generated from `catalog/catalog.json` by `npm run catalog`. Edit the JSON, not this file._', '', 'Rules: [DESIGN-RULES.md](DESIGN-RULES.md).', ''];
const count = (s) => cat.entries.filter((e) => e.status === s).length;
L.push(`${cat.entries.length} entries · ${count('stable')} stable · ${count('experimental')} experimental · ${count('deprecated')} deprecated`, '');
for (const [layer, desc] of Object.entries(cat.layers)) {
  const rows = cat.entries.filter((e) => e.layer === layer);
  L.push(`## ${layer}`, '', desc, '', '| Id | Building block | Status | Format | Source | Used in | Notes |', '|---|---|---|---|---|---|---|');
  for (const e of rows) {
    const status = e.status === 'experimental' ? `**experimental**${e.home ? ` (home: ${e.home})` : ''}` : e.status;
    L.push(`| \`${e.id}\` | ${e.name} | ${status} | ${e.format.join(' + ')} | \`${e.source}\` | ${(e.usedIn || []).join(', ') || '—'} | ${(e.notes || '').replace(/\|/g, '\\|')} |`);
  }
  L.push('');
}
const md = L.join('\n') + '\n';
const out = join(root, 'docs', 'CATALOG.md');
if (errors.length) { console.error('catalog: invalid\n- ' + errors.join('\n- ')); process.exit(1); }
if (process.argv.includes('--check')) {
  if (!existsSync(out) || readFileSync(out, 'utf8') !== md) { console.error('catalog: docs/CATALOG.md is stale — run npm run catalog'); process.exit(1); }
  console.log(`catalog: ok (${cat.entries.length} entries)`);
} else {
  writeFileSync(out, md);
  console.log(`catalog: wrote docs/CATALOG.md (${cat.entries.length} entries)`);
}
