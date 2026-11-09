#!/usr/bin/env node
// Checks docs/ (ADR 0001): every relative link resolves, and every ADR has
// valid front matter, the four sections, and a row in the decisions index.
// Usage: node scripts/check-docs.mjs [docs-dir]
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const docs = resolve(process.argv[2] ?? 'docs');
const decisions = join(docs, 'decisions');
const problems = [];

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });

// Links, outside fenced code blocks.
for (const file of walk(docs).filter((f) => f.endsWith('.md'))) {
  const text = readFileSync(file, 'utf8').replace(/^```[\s\S]*?^```/gm, '');
  for (const [, target] of text.matchAll(/\]\(([^)\s]+)\)/g)) {
    const path = target.split('#')[0];
    if (!path || /^[a-z][a-z0-9+.-]*:/i.test(path)) continue;
    if (!existsSync(resolve(dirname(file), path))) problems.push(`${file}: broken link ${target}`);
  }
}

// ADRs.
const allowed = ['title', 'number', 'status', 'implementation', 'date', 'supersedes', 'superseded_by', 'notes'];
const required = ['title', 'number', 'status', 'date'];
const index = readFileSync(join(decisions, 'README.md'), 'utf8');
for (const name of readdirSync(decisions).filter((f) => /^\d{4}-.*\.md$/.test(f))) {
  const text = readFileSync(join(decisions, name), 'utf8');
  const front = /^---\n([\s\S]*?)\n---/.exec(text)?.[1];
  if (!front) {
    problems.push(`${name}: no front matter`);
    continue;
  }
  const fields = Object.fromEntries(
    front
      .split('\n')
      .filter((line) => /^\w/.test(line))
      .map((line) => [line.slice(0, line.indexOf(':')), line.slice(line.indexOf(':') + 1).trim()]),
  );
  for (const key of Object.keys(fields)) if (!allowed.includes(key)) problems.push(`${name}: unknown field ${key}`);
  for (const key of required) if (!(key in fields)) problems.push(`${name}: missing ${key}`);
  if (Number(fields.number) !== Number.parseInt(name, 10)) problems.push(`${name}: number ${fields.number} doesn't match the file name`);
  if (fields.status && !['accepted', 'superseded'].includes(fields.status)) problems.push(`${name}: bad status ${fields.status}`);
  if (fields.implementation && !['built', 'partly-built', 'designed'].includes(fields.implementation)) problems.push(`${name}: bad implementation ${fields.implementation}`);
  for (const heading of ['## Context', '## Decision', '## Alternatives', '## Consequences']) {
    if (!text.includes(heading)) problems.push(`${name}: missing "${heading}"`);
  }
  if (!index.includes(`(${name})`)) problems.push(`${name}: not in decisions/README.md`);
}

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log('Docs are fine.');
