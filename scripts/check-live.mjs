// Deploy guard: operator values in src/site-config.ts must be filled in.
import { readFileSync } from 'node:fs';
const src = readFileSync(new URL('../src/site-config.ts', import.meta.url), 'utf8');
const left = src.match(/REPLACE_ME\w*/g);
if (left) { console.error(`site-config.ts still has placeholders: ${left.join(', ')}`); process.exit(1); }
console.log('site-config.ts: operator values set');
