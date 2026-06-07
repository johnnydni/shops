/* ───────────────────────────────────────────────────────────────────
   asset-index.mjs — generates a local inventory of every asset under
   public/assets/, grouped by directory, with byte size and a
   REAL / PLACEHOLDER marker (0-byte files are placeholders that fall
   back to the inline SVG illustration at runtime).

   Output: public/assets/index.txt   (gitignored — local only)

   Run manually:
     npm run assets:index

   Run as part of dev / build:
     npm run dev      # runs once at start
     npm run build    # runs before vite build

   This file is for humans — the source of truth for what's actually
   on disk vs what `src/data/products.ts` expects to find. If a product
   in products.ts references an image path that isn't listed here, the
   PDP silently falls back to the SVG (good for placeholders, bad if
   you THOUGHT you uploaded it). The "Expected but missing" section
   at the bottom of index.txt flags those gaps.
   ─────────────────────────────────────────────────────────────────── */

import { readdir, stat, writeFile, readFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
const ASSETS_DIR = join(REPO_ROOT, 'public', 'assets');
const OUTPUT     = join(ASSETS_DIR, 'index.txt');

/* ───────── Walk public/assets recursively ───────── */
async function walk(dir, files = []) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch (e) {
    if (e.code === 'ENOENT') return files;
    throw e;
  }
  for (const entry of entries) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(p, files);
    } else if (entry.isFile()) {
      // Skip the index.txt files themselves
      if (entry.name === 'index.txt') continue;
      const s = await stat(p);
      files.push({
        absPath: p,
        relPath: relative(REPO_ROOT, p).split(sep).join('/'),
        webPath: '/' + relative(join(REPO_ROOT, 'public'), p).split(sep).join('/'),
        size: s.size,
        mtime: s.mtimeMs,
      });
    }
  }
  return files;
}

/* ───────── Group files by directory ───────── */
function groupByDir(files) {
  const groups = new Map();
  for (const f of files) {
    const segs = f.relPath.split('/');
    // public/assets/<group>[/...]/file
    // group = first segment after public/assets/
    const group = segs[2] || '(root)';
    const subGroup = segs.length > 4 ? segs[3] : '';
    const key = subGroup ? `${group}/${subGroup}` : group;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(f);
  }
  // Sort entries within each group
  for (const arr of groups.values()) {
    arr.sort((a, b) => a.relPath.localeCompare(b.relPath));
  }
  // Sort groups by key
  return new Map([...groups.entries()].sort(([a], [b]) => a.localeCompare(b)));
}

/* ───────── Format helpers ───────── */
function fmtBytes(n) {
  if (n === 0) return '       0 B';
  if (n < 1024) return `${String(n).padStart(8)} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1).padStart(7)} KB`;
  return `${(n / 1024 / 1024).toFixed(2).padStart(6)} MB`;
}
function statusFor(n) {
  return n === 0 ? 'PLACEHOLDER' : 'REAL';
}

/* ───────── Expected-but-missing detection ───────── */
/**
 * Scan src/data/products.ts for `imageSrc`, `heroImageSrc`, and
 * `imagePattern` declarations. Anything that resolves to an
 * /assets/... path but isn't on disk is flagged as missing.
 *
 * imagePattern is partially flagged — we expand placeholders against
 * the variant options listed in the same product entry.
 */
async function detectMissing(diskWebPaths) {
  const productsPath = join(REPO_ROOT, 'src', 'data', 'products.ts');
  let src;
  try {
    src = await readFile(productsPath, 'utf8');
  } catch {
    return { missing: [], productsAvailable: false };
  }
  const set = new Set(diskWebPaths);
  const expected = new Set();

  /* ───── Pass A — literal asset paths ─────
     Picks up imageSrc / heroImageSrc / posterSrc / video.src / option.image.
     SKIPS imagePattern (handled in Pass B) by excluding strings containing `{`.
  */
  const litRegex = /(imageSrc|heroImageSrc|posterSrc|src|image)\s*:\s*['"]([^'"{}]+\.(?:jpg|jpeg|png|webp|gif|mp4))['"]/g;
  let m;
  while ((m = litRegex.exec(src)) !== null) {
    const p = m[2];
    if (p.startsWith('/assets/')) expected.add(p);
  }

  /* ───── Pass B — imagePattern expansion ─────
     Line-based product+variant parser. Each top-level `id: '...'` at 4-space
     indent starts a new product. Within it, every `label: '...'` opens a
     variant group, and subsequent `valueSlug: '...'` lines (until the next
     `label:` or `id:`) populate that group's slugs.

     For each product that has an `imagePattern`, expand the pattern by
     mapping each `{placeholder}` to the variant group whose lower-cased
     label equals the placeholder name. Cartesian product over all groups
     present in the pattern.
  */
  const lines = src.split('\n');
  const products = [];
  let cur = null;
  let curVariant = null;
  for (const line of lines) {
    // Detect top-level product: 4-space indent `id:`
    const idMatch = line.match(/^\s{2,6}id:\s*['"]([^'"]+)['"]/);
    if (idMatch) {
      if (cur) products.push(cur);
      cur = { id: idMatch[1], imagePattern: '', variants: [] };
      curVariant = null;
      continue;
    }
    if (!cur) continue;
    const patMatch = line.match(/imagePattern\s*:\s*['"]([^'"]+)['"]/);
    if (patMatch) cur.imagePattern = patMatch[1];
    const labelMatch = line.match(/label\s*:\s*['"]([^'"]+)['"]/);
    if (labelMatch) {
      curVariant = { label: labelMatch[1].toLowerCase(), slugs: [] };
      cur.variants.push(curVariant);
      continue;
    }
    const slugMatch = line.match(/valueSlug\s*:\s*['"]([^'"]+)['"]/);
    if (slugMatch && curVariant) curVariant.slugs.push(slugMatch[1]);
  }
  if (cur) products.push(cur);

  for (const p of products) {
    if (!p.imagePattern) continue;
    const placeholders = [...p.imagePattern.matchAll(/\{([^}]+)\}/g)].map(x => x[1]);
    if (!placeholders.length) continue;
    // Match each placeholder to a variant group by lowercase label.
    const groups = placeholders.map(ph =>
      p.variants.find(v => v.label === ph.toLowerCase())
    );
    if (groups.some(g => !g || !g.slugs.length)) {
      // Pattern references a placeholder we couldn't resolve — record
      // the raw pattern as missing so the dev notices.
      expected.add(p.imagePattern);
      continue;
    }
    // Cartesian product
    const expand = (idx, str) => {
      if (idx === placeholders.length) { expected.add(str); return; }
      for (const slug of groups[idx].slugs) {
        expand(idx + 1, str.replace(`{${placeholders[idx]}}`, slug));
      }
    };
    expand(0, p.imagePattern);
  }

  const missing = [...expected].filter(p => !set.has(p)).sort();
  return { missing, productsAvailable: true };
}

/* ───────── Render ───────── */
function render({ groups, files, missing, productsAvailable }) {
  const totalSize = files.reduce((s, f) => s + f.size, 0);
  const placeholders = files.filter(f => f.size === 0).length;
  const real = files.length - placeholders;
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

  const lines = [];
  lines.push('╔══════════════════════════════════════════════════════════════════════╗');
  lines.push('║  RITMO Padel · Local Asset Inventory                                 ║');
  lines.push('║  GENERATED — DO NOT EDIT BY HAND. Run `npm run assets:index`.        ║');
  lines.push('║  This file is gitignored — local-only reference.                     ║');
  lines.push('╚══════════════════════════════════════════════════════════════════════╝');
  lines.push('');
  lines.push(`Generated:        ${now}`);
  lines.push(`Files total:      ${files.length}`);
  lines.push(`  REAL:           ${real}`);
  lines.push(`  PLACEHOLDER:    ${placeholders}  (0-byte → SVG fallback at runtime)`);
  lines.push(`Total bytes:      ${fmtBytes(totalSize).trim()}`);
  lines.push('');
  lines.push('Web paths (for code) start with `/assets/...`');
  lines.push('Disk paths shown relative to repo root for clarity.');
  lines.push('');

  for (const [groupKey, groupFiles] of groups) {
    lines.push(`─── ${groupKey} ${'─'.repeat(Math.max(0, 60 - groupKey.length))}`);
    for (const f of groupFiles) {
      lines.push(`  ${fmtBytes(f.size)}  ${statusFor(f.size).padEnd(12)}  ${f.webPath}`);
    }
    lines.push('');
  }

  lines.push('─── Expected but missing ' + '─'.repeat(46));
  if (!productsAvailable) {
    lines.push('  (src/data/products.ts not found — skipped check)');
  } else if (missing.length === 0) {
    lines.push('  ✓ Every path referenced in products.ts exists on disk.');
  } else {
    lines.push(`  ${missing.length} path(s) referenced in products.ts but not found:`);
    lines.push('');
    for (const p of missing) {
      lines.push(`  MISSING   ${p}`);
    }
    lines.push('');
    lines.push('  ↳ These render the SVG fallback at runtime. That is fine for');
    lines.push('    intentional placeholders, but bad if you thought you uploaded.');
  }
  lines.push('');

  lines.push('─── Naming convention reference ' + '─'.repeat(38));
  lines.push('  See public/assets/products/index.txt (committed) for the');
  lines.push('  per-product naming pattern: <slug>-<farbe>.<ext> resp.');
  lines.push('  <spielstil>-<schnitt>-<farbe>.<ext> for the DNA-Tee.');
  lines.push('');
  lines.push('─── End of inventory ' + '─'.repeat(48));
  return lines.join('\n') + '\n';
}

/* ───────── Main ───────── */
async function main() {
  const files = await walk(ASSETS_DIR);
  const groups = groupByDir(files);
  const diskWebPaths = files.map(f => f.webPath);
  const { missing, productsAvailable } = await detectMissing(diskWebPaths);
  const text = render({ groups, files, missing, productsAvailable });
  await writeFile(OUTPUT, text, 'utf8');
  console.log(`✓ asset-index: wrote ${OUTPUT} (${files.length} files, ${missing.length} missing)`);
}

main().catch((e) => {
  console.error('✗ asset-index failed:', e);
  process.exit(1);
});
