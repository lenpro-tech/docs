import { test } from 'node:test';
import assert from 'node:assert/strict';
import { schemaToMarkdown } from '../scripts/schema-md.mjs';

const schema = {
  title: 'T',
  definitions: { localized: { oneOf: [{ type: 'string' }, { type: 'object' }] } },
  required: ['slug', 'name'],
  properties: {
    slug: { type: 'string', pattern: '^[a-z]+$' },
    name: { $ref: '#/definitions/localized' },
    listed: { type: 'boolean' },
    kind: { enum: ['iframe'] },
    players: { type: 'object', properties: { min: { type: 'integer', minimum: 2 } } },
  },
};

test('one row per top-level field with required flag, type and constraints', () => {
  const md = schemaToMarkdown(schema);
  assert.match(md, /^title: game\.json$/m);
  assert.match(md, /\| `slug` \| yes \| string \| pattern `\^\[a-z\]\+\$` \|/);
  assert.match(md, /\| `name` \| yes \| string or \{ locale: string \} \|/);
  assert.match(md, /\| `listed` \| no \| boolean \|/);
  assert.match(md, /\| `kind` \| no \| `"iframe"` \|/);
  assert.match(md, /\| `players\.min` \| no \| integer \| minimum 2 \|/);
});

test('pipes inside patterns are escaped', () => {
  const md = schemaToMarkdown({ properties: { a: { type: 'string', pattern: 'x|y' } } });
  assert.match(md, /pattern `x\\\|y`/);
});
