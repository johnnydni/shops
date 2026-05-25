/* ───────────────────────────────────────────────────────────────────
   Post-build: copy dist/index.html → dist/404.html so GitHub Pages
   serves the SPA for any path (deep links, /produkt/xyz, etc).
   ─────────────────────────────────────────────────────────────────── */
import { copyFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const src = resolve('dist/index.html');
const dst = resolve('dist/404.html');

try {
  await copyFile(src, dst);
  console.log('✓ postbuild: dist/index.html → dist/404.html');
} catch (e) {
  console.error('✗ postbuild failed:', e.message);
  process.exit(1);
}
