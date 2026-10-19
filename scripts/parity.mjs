import { readdirSync } from 'node:fs';
import { join, relative } from 'node:path';

const walk = (d) => readdirSync(d, { withFileTypes: true })
  .flatMap((e) => (e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]));

export function missingTwins(root) {
  const all = walk(root).map((f) => relative(root, f)).filter((f) => /\.mdx?$/.test(f));
  const isDoc = (f) => !f.includes('reference/') && !/(^|\/)index\.mdx?$/.test(f);
  const ru = new Set(all.filter((f) => !f.startsWith('en/') && isDoc(f)));
  const en = new Set(all.filter((f) => f.startsWith('en/') && isDoc(f)).map((f) => f.slice(3)));
  return [...[...ru].filter((f) => !en.has(f)), ...[...en].filter((f) => !ru.has(f)).map((f) => `en/${f}`)];
}
