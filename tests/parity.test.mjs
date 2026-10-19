import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { missingTwins } from '../scripts/parity.mjs';

test('reports pages missing in either locale, ignores reference', () => {
  const r = mkdtempSync(join(tmpdir(), 'parity-'));
  for (const f of ['docs/a.md', 'docs/b.md', 'docs/reference/x.md', 'en/docs/a.md', 'en/docs/c.md']) {
    mkdirSync(join(r, f, '..'), { recursive: true });
    writeFileSync(join(r, f), '---\ntitle: t\n---\n');
  }
  assert.deepEqual(missingTwins(r).sort(), ['docs/b.md', 'en/docs/c.md']);
});

test('the real site has full RU/EN parity', () => {
  assert.deepEqual(missingTwins(new URL('../src/content/docs/', import.meta.url).pathname), []);
});
