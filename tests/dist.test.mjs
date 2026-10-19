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

test('reference pages are generated', () => {
  assert.match(read('docs/reference/game-json/index.html'), /<code[^>]*>slug<\/code>/);
  assert.match(read('docs/reference/cli/index.html'), /create &lt;slug&gt;/);
  assert.ok(has('docs/reference/api/readme/index.html') && has('docs/reference/api/game-kit/dist/functions/runcheck/index.html'));
});

const EN_TITLES = ['Quickstart', 'Building with an LLM', 'Game anatomy', 'Publishing', 'FAQ'];

test('llms.txt follows llmstxt.org and links every docs page in both locales', () => {
  const t = read('llms.txt');
  assert.match(t, /^# Logigra\n\n> /);
  for (const s of ['quickstart', 'llm', 'anatomy', 'publishing', 'faq']) {
    assert.match(t, new RegExp(`https://logigra\\.ru/docs/${s}/`));
    assert.match(t, new RegExp(`https://logigra\\.ru/en/docs/${s}/`));
  }
  assert.match(t, /https:\/\/logigra\.ru\/llms-full\.txt/);
});

test('llms-full.txt holds every EN page and the skill', () => {
  const t = read('llms-full.txt');
  const [pages] = t.split('# Skill: create-store-game');
  for (const title of EN_TITLES) assert.match(pages, new RegExp(`^# ${title}$`, 'm'), title);
  assert.match(t, /^# Skill: create-store-game$/m);
  assert.match(t, /check: OK/);
  assert.doesNotMatch(pages, /[А-Яа-яЁё]{4,}/, 'EN only');
});
