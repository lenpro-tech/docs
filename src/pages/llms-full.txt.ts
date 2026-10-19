import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { DOCS_ORDER as ORDER } from '../docs-order.mjs';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';


export const GET: APIRoute = async () => {
  const docs = await getCollection('docs');
  const pages = ORDER.map((s) => {
    const d = docs.find((e) => e.id === `en/docs/${s}`);
    if (!d) throw new Error(`llms-full.txt: missing page en/docs/${s}`);
    return `# ${d.data.title}\n\n${(d.body ?? '').trim()}`;
  });
  // game-kit does not export ./package.json; builds run from the repo root.
  const skill = readFileSync(
    join(process.cwd(), 'node_modules/@table-games-engine/game-kit/skill/create-store-game.md'),
    'utf8',
  );
  const body = [...pages, skill.trim()].join('\n\n---\n\n');
  return new Response(body + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
