import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const ORDER = ['quickstart', 'llm', 'anatomy', 'publishing', 'faq'];
const SITE = 'https://logigra.ru';

export const GET: APIRoute = async () => {
  const docs = await getCollection('docs');
  const pick = (prefix: string) =>
    ORDER.map((s) => {
      const d = docs.find((e) => e.id === `${prefix}docs/${s}`);
      if (!d) throw new Error(`llms.txt: missing page ${prefix}docs/${s}`);
      return `- [${d.data.title}](${SITE}/${d.id}/): ${d.data.description ?? ''}`;
    });
  const body = [
    '# Logigra', '',
    '> Logigra is a store of turn-based multiplayer games that authors build with their own LLM on the open game-kit (`@table-games-engine/game-kit`). The server is authoritative; game clients run sandboxed.', '',
    `Full English docs in one file: ${SITE}/llms-full.txt`, '',
    '## Docs (English)', ...pick('en/'), '',
    '## Документация (русский)', ...pick(''), '',
    '## Reference',
    `- [game.json](${SITE}/docs/reference/game-json/)`,
    `- [game-kit CLI](${SITE}/docs/reference/cli/)`,
    `- [API](${SITE}/docs/reference/api/readme/)`, '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
