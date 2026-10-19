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
  assert.ok(has('docs/reference/api/readme/index.html') && read('docs/reference/api/game-kit/dist/index.html').includes('runCheck'));
});

const EN_TITLES = ['Quickstart', 'Building with an LLM', 'Game anatomy', 'Publishing', 'FAQ']; // DOCS_ORDER order

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

test('schools landing: RU only, hero, form, consent link', () => {
  const t = read('schools/index.html');
  assert.match(t, /<html[^>]*lang="ru"/);
  assert.match(t, /Научите программировать, работать с ИИ и делать игры — за один проект/);
  assert.match(t, /<iframe[^>]+src="https:\/\/forms\.yandex\.ru\//);
  assert.match(t, /href="\/privacy\/"/);
  assert.ok(!has('en/schools/index.html'));
});

test('home pages: waitlist form, consent link, docs and schools CTAs', () => {
  for (const [p, docs, anchor] of [
    ['index.html', '/docs/quickstart/', 'id="магазин-открывается-скоро"'],
    ['en/index.html', '/en/docs/quickstart/', 'id="the-store-opens-soon"'],
  ]) {
    const t = read(p);
    assert.match(t, /<iframe[^>]+src="https:\/\/forms\.yandex\.ru\//, p);
    assert.match(t, /href="\/privacy\/"/, p);
    assert.match(t, new RegExp(`href="${docs}"`), p);
    assert.ok(t.includes(anchor), `${p} ${anchor}`);
  }
  assert.match(read('index.html'), /href="\/schools\/"/);
  assert.match(read('index.html'), /Магазин открывается скоро/);
  assert.match(read('en/index.html'), /The store opens soon/);
});

test('privacy page exists; nothing links to the unreleased store', () => {
  assert.match(read('privacy/index.html'), /персональных данных/);
  for (const p of ['index.html', 'en/index.html', 'schools/index.html']) {
    assert.doesNotMatch(read(p), /play\.logigra\.ru/, p);
  }
});

import { readdirSync } from 'node:fs';
import { DOCS_ORDER } from '../src/docs-order.mjs';

const walkDist = (d = new URL('../dist/', import.meta.url)) => readdirSync(d, { withFileTypes: true })
  .flatMap((e) => (e.isDirectory() ? walkDist(new URL(`${e.name}/`, d)) : [new URL(e.name, d)]));

test('no internal platform name anywhere in the built site or LLM files', () => {
  const files = walkDist().filter((u) => /\.(html|txt)$/.test(u.pathname) && !u.pathname.includes('/reference/api/'));
  for (const u of files) {
    const t = readFileSync(u, 'utf8').replace(/https:\/\/github\.com\/lenpro-tech\/[a-z-]+/g, '');
    assert.doesNotMatch(t, /lenpro/i, u.pathname);
  }
});

test('every docs page is listed in DOCS_ORDER (so it reaches llms.txt / llms-full.txt)', () => {
  for (const dir of ['../src/content/docs/docs/', '../src/content/docs/en/docs/']) {
    const pages = readdirSync(new URL(dir, import.meta.url)).filter((f) => /\.mdx?$/.test(f)).map((f) => f.replace(/\.mdx?$/, ''));
    assert.deepEqual([...pages].sort(), [...DOCS_ORDER].sort(), dir);
  }
});

test('privacy: names Yandex as processor, no blanket no-cookies claim, separate consent page, footer link', () => {
  const p = read('privacy/index.html');
  assert.match(p, /ООО «Яндекс»/);
  assert.doesNotMatch(p, /не использует cookies и системы аналитики/);
  assert.match(p, /меньше 14 лет/);
  assert.match(read('consent/index.html'), /Согласие на обработку персональных данных/);
  for (const pg of ['index.html', 'en/index.html', 'schools/index.html', 'docs/quickstart/index.html']) {
    assert.match(read(pg), /class="lg-footer"><a href="\/privacy\/"/, pg);
  }
});

test('no claims about things that do not exist yet', () => {
  assert.doesNotMatch(read('docs/faq/index.html'), /программа для старшей школы описана/);
  assert.doesNotMatch(read('schools/index.html'), /данные хранятся в РФ/);
  assert.doesNotMatch(read('docs/publishing/index.html'), /еженедельным релизом/);
  assert.doesNotMatch(read('en/docs/publishing/index.html'), /weekly release/);
});
