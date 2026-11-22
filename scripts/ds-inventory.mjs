#!/usr/bin/env node
// StarUI design-system inventory — "alles erfassen von überall".
//
// Scans one or more consumer surfaces (Verse Companion Web, the Data Uploader,
// the desktop app, …) and lists every place where they deviate from StarUI:
//
//   brand        logo / mark / app-icon files: identical to StarUI, diverged, or local-only
//   copies       CSS files that share a name with a StarUI lib/ or shell/ file (vendored copies)
//   radius       border-radius values outside the StarUI scale (0 / 2 / 4 / 8 / pill)
//   fontFloor    font sizes below the 13 px floor
//   colors       raw hex colour literals (not via a token)
//   buttons      button class families per surface (one family per surface is the target)
//   ds-new       `ds-new: <reason>` pragmas — the experimental register
//
// Read-only: it never changes a consumer. Output is JSON plus a Markdown report.
//
// Usage:
//   node scripts/ds-inventory.mjs \
//     --surface web=../verse-companion-web/src \
//     --surface uploader=../verse-companion-web/data-uploader/src \
//     --surface app=../verse-companion-app/modules \
//     [--brand web=../verse-companion-web/public] [--out docs/inventory/latest]
//
// `--brand <surface>=<dir>` adds extra folders that are scanned for brand files
// only (public/ asset folders sit outside src/). No external dependencies.
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join, relative, basename, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// ── config ────────────────────────────────────────────────────────────────
const RADIUS_SCALE = new Set(['0', '0px', '2px', '4px', '8px', '999px', '9999px', '50%', 'inherit', 'initial', 'unset']);
const FONT_FLOOR_PX = 13;
const CODE_EXT = new Set(['.css', '.scss', '.ts', '.html', '.js', '.mjs']);
const STYLE_EXT = new Set(['.css', '.scss']);
const BRAND_EXT = new Set(['.svg', '.png', '.ico']);
const SKIP_DIRS = new Set(['node_modules', 'dist', 'build', '.git', '.angular', 'coverage', 'out', 'release', '.cache', 'test-results', 'playwright-report']);
const BRAND_NAME = /(logo|mark|app-icon|brand)/i;
const BUTTON_CLASS = /class(?:Name)?\s*=\s*["'`][^"'`]*?\b((?:scc-)?btn[\w-]*|button[\w-]*|sc-action[\w-]*)/g;
const SC_ACTION_ATTR = /\bscAction(?:=["']?(\w+))?/g;
const PRAGMA_OK = /(color-literal-ok:|ds-new:|ds-ok:)/;
const DS_NEW = /ds-new:\s*([^*\n]+?)(?:\*\/|-->|$)/;

// ── args ──────────────────────────────────────────────────────────────────
function parseArgs(argv) {
  const out = { surfaces: [], brand: [], out: join(root, 'docs', 'inventory', 'latest') };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => argv[++i];
    if (a === '--surface' || a === '--brand') {
      const [name, dir] = next().split('=');
      (a === '--surface' ? out.surfaces : out.brand).push({ name, dir: resolve(dir) });
    } else if (a === '--out') out.out = resolve(next());
    else if (a === '--help' || a === '-h') { console.log(readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n').slice(1, 26).join('\n')); process.exit(0); }
  }
  if (!out.surfaces.length) { console.error('ds-inventory: at least one --surface name=dir is required (see --help)'); process.exit(2); }
  return out;
}

// ── helpers ───────────────────────────────────────────────────────────────
function* walk(dir) {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const p = join(dir, name);
    let st; try { st = statSync(p); } catch { continue; }
    if (st.isDirectory()) yield* walk(p);
    else yield p;
  }
}
const sha = (p) => createHash('sha256').update(readFileSync(p)).digest('hex');
const normCss = (s) => s.replace(/\r\n/g, '\n');
const inc = (obj, k, n = 1) => { obj[k] = (obj[k] || 0) + n; };

// StarUI reference: brand assets and lib/shell CSS by basename.
function starRefs() {
  const brand = new Map(); // basename -> [{path, hash}]
  for (const d of ['assets/brand', 'assets/logos', 'assets/icons']) {
    for (const p of walk(join(root, d))) {
      if (!BRAND_EXT.has(extname(p))) continue;
      const b = basename(p);
      if (!brand.has(b)) brand.set(b, []);
      brand.get(b).push({ path: relative(root, p), hash: sha(p) });
    }
  }
  const brandHashes = new Map();
  for (const [b, list] of brand) for (const e of list) brandHashes.set(e.hash, e.path);
  const css = new Map();
  for (const d of ['lib', 'shell']) for (const p of walk(join(root, d))) {
    if (extname(p) === '.css') css.set(basename(p), { path: relative(root, p), text: normCss(readFileSync(p, 'utf8')) });
  }
  return { brand, brandHashes, css };
}

// ── scan ──────────────────────────────────────────────────────────────────
function scanSurface(surface, refs, brandDirs) {
  const r = {
    surface: surface.name, dir: surface.dir, files: 0,
    brand: [], copies: [], radius: { values: {}, offScale: [] }, fontFloor: [], colors: { total: 0, byFile: {} },
    buttons: {}, dsNew: [],
  };
  const seenBrand = new Set();
  const brandFile = (p) => {
    if (seenBrand.has(p)) return; seenBrand.add(p);
    const b = basename(p);
    if (!BRAND_EXT.has(extname(p)) || !(BRAND_NAME.test(b) || refs.brand.has(b))) return;
    const h = sha(p);
    const match = refs.brandHashes.get(h);
    const sameName = refs.brand.get(b);
    let state = 'local-only';
    if (match) state = 'identical';
    else if (sameName) state = 'diverged';
    r.brand.push({ file: relative(surface.dir, p), state, starui: match || (sameName && sameName[0].path) || null, root: surface.dir });
  };

  for (const p of walk(surface.dir)) {
    const ext = extname(p);
    if (BRAND_EXT.has(ext)) { brandFile(p); continue; }
    if (!CODE_EXT.has(ext)) continue;
    if (/\.spec\.ts$|\.test\.(ts|js|mjs)$/.test(p)) continue;
    r.files++;
    const rel = relative(surface.dir, p);
    let text; try { text = readFileSync(p, 'utf8'); } catch { continue; }

    // vendored copies of StarUI CSS
    if (ext === '.css' && refs.css.has(basename(p))) {
      const ref = refs.css.get(basename(p));
      r.copies.push({ file: rel, starui: ref.path, state: normCss(text) === ref.text ? 'identical' : /GENERATED by/.test(text.slice(0, 400)) ? 'generated' : 'diverged' });
    }

    const lines = text.split('\n');
    const isStyle = STYLE_EXT.has(ext) || /styles?\s*:/.test(text);
    lines.forEach((line, i) => {
      const ln = i + 1;
      const pragma = DS_NEW.exec(line);
      if (pragma) r.dsNew.push({ file: rel, line: ln, reason: pragma[1].trim() });
      const ok = PRAGMA_OK.test(line) || (i > 0 && PRAGMA_OK.test(lines[i - 1]));

      if (isStyle) {
        const rad = /border(?:-[a-z-]+)?-radius\s*:\s*([^;}{]+)/.exec(line);
        if (rad) {
          for (const v of rad[1].trim().split(/\s+/)) {
            if (v.startsWith('var(') || v.startsWith('calc(') || v === '!important') { inc(r.radius.values, 'token'); continue; }
            inc(r.radius.values, v);
            if (!RADIUS_SCALE.has(v) && !ok) r.radius.offScale.push({ file: rel, line: ln, value: v });
          }
        }
        const fs = /font-size\s*:\s*([\d.]+)(px|rem)\b/.exec(line);
        if (fs) {
          const px = fs[2] === 'rem' ? parseFloat(fs[1]) * 16 : parseFloat(fs[1]);
          if (px < FONT_FLOOR_PX && !ok) r.fontFloor.push({ file: rel, line: ln, px });
        }
      }
      if (!ok && !/^\s*(\/\/|\*|\/\*)/.test(line)) {
        const hex = line.match(/#[0-9a-fA-F]{3,8}\b(?![\w-])/g);
        if (hex && (isStyle || /color|background|fill|stroke|border|style/i.test(line))) {
          const n = hex.filter((h) => [4, 5, 7, 9].includes(h.length)).length;
          if (n) { r.colors.total += n; inc(r.colors.byFile, rel, n); }
        }
      }
    });

    if (ext === '.html' || ext === '.ts') {
      for (const m of text.matchAll(BUTTON_CLASS)) inc(r.buttons, m[1].replace(/--.*$/, ''));
      for (const m of text.matchAll(SC_ACTION_ATTR)) inc(r.buttons, `scAction${m[1] ? '=' + m[1] : ''}`);
    }
  }
  for (const d of brandDirs) for (const p of walk(d)) if (BRAND_EXT.has(extname(p))) {
    const before = r.brand.length; brandFile(p);
    if (r.brand.length > before) r.brand[r.brand.length - 1].file = relative(surface.dir, p);
  }
  return r;
}

// ── report ────────────────────────────────────────────────────────────────
function topFiles(byFile, n = 8) {
  return Object.entries(byFile).sort((a, b) => b[1] - a[1]).slice(0, n);
}
function groupCount(list, key) {
  const m = {}; for (const e of list) inc(m, e[key]); return Object.entries(m).sort((a, b) => b[1] - a[1]);
}
function markdown(results, when) {
  const L = [];
  L.push(`# StarUI inventory — ${when}`, '');
  L.push('Generated by `node scripts/ds-inventory.mjs`. Read-only scan; nothing in the consumers was changed.', '');
  L.push('Every row is a deviation from StarUI. A deviation is not automatically wrong: it is either a candidate for', 'StarUI (mark it `ds-new: <reason>` → experimental), a planned alignment, or a deliberate local look', '(mark it `ds-ok: <reason>`). Rules: `docs/DESIGN-RULES.md`.', '');
  L.push('## Summary', '');
  L.push('| Surface | Files | Brand (identical / diverged / local) | StarUI CSS copies (identical / generated / diverged) | Radius off-scale | Font < 13px | Hex literals | Button families | `ds-new` |');
  L.push('|---|---|---|---|---|---|---|---|---|');
  for (const r of results) {
    const b = (s) => r.brand.filter((e) => e.state === s).length;
    const c = (s) => r.copies.filter((e) => e.state === s).length;
    L.push(`| ${r.surface} | ${r.files} | ${b('identical')} / ${b('diverged')} / ${b('local-only')} | ${c('identical')} / ${c('generated')} / ${c('diverged')} | ${r.radius.offScale.length} | ${r.fontFloor.length} | ${r.colors.total} | ${Object.keys(r.buttons).length} | ${r.dsNew.length} |`);
  }
  L.push('');
  for (const r of results) {
    L.push(`## ${r.surface}`, '', `Scanned \`${r.dir.split('/').slice(-2).join('/')}\`.`, '');
    if (r.brand.length) {
      L.push('### Brand files', '', '| File | State | StarUI counterpart |', '|---|---|---|');
      for (const e of r.brand) L.push(`| \`${e.file}\` | ${e.state} | ${e.starui ? '`' + e.starui + '`' : '—'} |`);
      L.push('');
    }
    if (r.copies.length) {
      L.push('### Copies of StarUI CSS', '', '| File | StarUI source | State |', '|---|---|---|');
      for (const e of r.copies) L.push(`| \`${e.file}\` | \`${e.starui}\` | ${e.state} |`);
      L.push('');
    }
    const radVals = Object.entries(r.radius.values).sort((a, b) => b[1] - a[1]);
    L.push('### Radius', '', `Values in use (${radVals.length} distinct): ` + radVals.map(([v, n]) => `\`${v}\`×${n}`).join(', '), '');
    if (r.radius.offScale.length) {
      L.push('Off-scale by file (top):', '');
      for (const [f, n] of groupCount(r.radius.offScale, 'file').slice(0, 8)) L.push(`- \`${f}\` — ${n}`);
      L.push('');
    }
    if (r.fontFloor.length) {
      L.push('### Font sizes below 13px', '', 'By size: ' + groupCount(r.fontFloor, 'px').map(([v, n]) => `${v}px×${n}`).join(', '), '', 'Top files:', '');
      for (const [f, n] of groupCount(r.fontFloor, 'file').slice(0, 8)) L.push(`- \`${f}\` — ${n}`);
      L.push('');
    }
    if (r.colors.total) {
      L.push('### Raw hex colours', '', `${r.colors.total} literals outside tokens. Top files:`, '');
      for (const [f, n] of topFiles(r.colors.byFile)) L.push(`- \`${f}\` — ${n}`);
      L.push('');
    }
    const btn = Object.entries(r.buttons).sort((a, b) => b[1] - a[1]);
    if (btn.length) L.push('### Button classes', '', btn.slice(0, 20).map(([v, n]) => `\`${v}\`×${n}`).join(', '), '');
    L.push('### Experimental register (`ds-new`)', '');
    if (r.dsNew.length) for (const e of r.dsNew) L.push(`- \`${e.file}:${e.line}\` — ${e.reason}`);
    else L.push('_None yet._');
    L.push('');
  }
  return L.join('\n');
}

// ── main ──────────────────────────────────────────────────────────────────
const args = parseArgs(process.argv.slice(2));
const refs = starRefs();
const results = args.surfaces.map((s) => scanSurface(s, refs, args.brand.filter((b) => b.name === s.name).map((b) => b.dir)));
const when = new Date().toISOString().slice(0, 10);
mkdirSync(args.out, { recursive: true });
const json = results.map(({ dir, ...r }) => ({ ...r, brand: r.brand.map(({ root: _r, ...e }) => e) }));
writeFileSync(join(args.out, 'inventory.json'), JSON.stringify({ generated: when, fontFloorPx: FONT_FLOOR_PX, radiusScale: [...RADIUS_SCALE], surfaces: json }, null, 2) + '\n');
writeFileSync(join(args.out, 'INVENTORY.md'), markdown(results, when) + '\n');
for (const r of results) {
  console.log(`${r.surface.padEnd(10)} files=${r.files} brand=${r.brand.length} copies=${r.copies.length} radiusOff=${r.radius.offScale.length} font<13=${r.fontFloor.length} hex=${r.colors.total} buttonFamilies=${Object.keys(r.buttons).length} dsNew=${r.dsNew.length}`);
}
console.log(`ds-inventory: wrote ${relative(process.cwd(), args.out)}/INVENTORY.md + inventory.json`);
