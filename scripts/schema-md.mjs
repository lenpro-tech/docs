const esc = (s) => String(s).replace(/\|/g, '\\|');

function typeOf(p) {
  if (p.$ref === '#/definitions/localized') return 'string or { locale: string }';
  if (p.enum) return p.enum.map((v) => `\`${JSON.stringify(v)}\``).join(', ');
  if (p.type === 'array') return `array of ${p.items ? typeOf(p.items) : 'any'}`;
  return p.type ?? 'any';
}

function constraints(p) {
  const c = [];
  if (p.pattern) c.push(`pattern \`${esc(p.pattern)}\``);
  if (p.minimum !== undefined) c.push(`minimum ${p.minimum}`);
  if (p.minItems !== undefined) c.push(`at least ${p.minItems} item(s)`);
  if (p.minLength !== undefined) c.push(`min length ${p.minLength}`);
  return c.join('; ');
}

function rows(props, required, prefix) {
  return Object.entries(props).filter(([k]) => k !== '$schema').flatMap(([k, p]) => {
    const name = prefix + k;
    const row = `| \`${name}\` | ${required.includes(k) ? 'yes' : 'no'} | ${typeOf(p)} | ${constraints(p)} |`;
    const nested = p.type === 'object' && p.properties ? rows(p.properties, p.required ?? [], `${name}.`) : [];
    const items = p.type === 'array' && p.items?.properties ? rows(p.items.properties, p.items.required ?? [], `${name}[].`) : [];
    return [row, ...nested, ...items];
  });
}

// Starlight renders the frontmatter title as the page H1.
export function schemaToMarkdown(schema) {
  return [
    '---', 'title: game.json', 'description: Every field of a store game\'s game.json.', '---', '',
    'Generated from `@table-games-engine/game-kit/schema/game.schema.json`.', '',
    '| Field | Required | Type | Constraints |', '|---|---|---|---|',
    ...rows(schema.properties ?? {}, schema.required ?? [], ''), '',
  ].join('\n');
}
