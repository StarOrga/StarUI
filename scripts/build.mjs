// StarUI bundle builder — concatenates the framework-agnostic CSS layer into
// dist/star-ui.css for plain-HTML consumers (e.g. the SCC installer) that cannot
// resolve bare package specifiers. Build-capable consumers (Angular apps) import
// the individual files from lib/ directly. No external dependencies on purpose.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// Order matters: design-tokens first (its @import of web fonts must lead the
// bundle, and every other layer references its custom properties).
const LIB_ORDER = [
  'design-tokens',
  'cursor-tokens',
  'control-states',
  'forms',
  'settings-block',
  'window-surface',
  'status',
  'tooltips',
  'app-scrollbars',
  'logo-animations',
];

let out = '/* @starorga/star-ui — generated bundle. Do not edit; edit lib/*.css. */\n';
for (const name of LIB_ORDER) {
  out += `\n/* ===== ${name}.css ===== */\n`;
  out += readFileSync(join(root, 'lib', `${name}.css`), 'utf8');
  out += '\n';
}

mkdirSync(join(root, 'dist'), { recursive: true });
writeFileSync(join(root, 'dist', 'star-ui.css'), out);
console.log(`StarUI: wrote dist/star-ui.css (${out.length} bytes, ${LIB_ORDER.length} layers)`);
