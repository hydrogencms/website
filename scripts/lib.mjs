import { readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// The docs are served under /docs: Starlight's slugs are the paths below src/content/docs.
export const outDir = path.join(root, 'src/content/docs/docs');
// The hydrogen repository's docs/ (a sibling checkout by default; CI checks it out and sets HYDROGEN_DOCS).
export const docsDir = path.resolve(root, process.env.HYDROGEN_DOCS ?? '../hydrogencms/docs');
// The site's base path ('' at a domain root, '/website' on GitHub Pages without a custom domain).
export const base = (process.env.SITE_BASE ?? '').replace(/\/+$/, '');

// slugs of the generated pages, without the docs/ prefix
export function allPages() {
  if (!existsSync(outDir)) return [];
  const out = [];
  const walk = (d, pre) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      if (e.isDirectory()) walk(path.join(d, e.name), pre + e.name + '/');
      else if (e.name.endsWith('.md')) out.push(pre + e.name.slice(0, -3));
    }
  };
  walk(outDir, '');
  return out;
}
