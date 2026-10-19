import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { schemaToMarkdown } from './schema-md.mjs';

// game-kit does not export ./package.json; builds run from the repo root.
const kit = join(process.cwd(), 'node_modules/@table-games-engine/game-kit');
const out = new URL('../src/content/docs/docs/reference/', import.meta.url);
mkdirSync(out, { recursive: true });

const schema = JSON.parse(readFileSync(join(kit, 'schema/game.schema.json'), 'utf8'));
writeFileSync(new URL('game-json.md', out), schemaToMarkdown(schema));

// game-kit prints its usage when run without a command; per-command --help does not exist.
let usage;
try { usage = execFileSync(process.execPath, [join(kit, 'dist/cli.js')], { encoding: 'utf8', stdio: 'pipe' }); }
catch (e) { usage = `${e.stdout ?? ''}${e.stderr ?? ''}`; }
if (!usage.includes('create <slug>')) throw new Error(`unexpected game-kit usage output:\n${usage}`);
const version = JSON.parse(readFileSync(join(kit, 'package.json'), 'utf8')).version;
writeFileSync(new URL('cli.md', out), [
  '---', 'title: game-kit CLI', 'description: Commands of the game-kit CLI.', '---', '',
  `Usage of \`game-kit\` ${version} (\`npx game-kit\`):`, '', '```text', usage.trim(), '```', '',
].join('\n'));
