import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

export const read = (p) => readFileSync(new URL(`../dist/${p}`, import.meta.url), 'utf8');
const has = (p) => existsSync(new URL(`../dist/${p}`, import.meta.url));

test('RU home at root, EN home under /en/', () => {
  assert.match(read('index.html'), /<html[^>]*lang="ru"/);
  assert.match(read('index.html'), /Идея → игра с игроками/);
  assert.match(read('en/index.html'), /<html[^>]*lang="en"/);
  assert.match(read('en/index.html'), /Idea → a game people play/);
});

test('no internal platform name in the built site', () => {
  for (const p of ['index.html', 'en/index.html']) {
    assert.doesNotMatch(read(p).replace(/github\.com\/lenpro-tech\/[a-z-]+/g, ''), /lenpro/i, p);
  }
});

test('build output exists', () => assert.ok(has('index.html')));
