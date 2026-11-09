#!/usr/bin/env node
// Checks the repo's Markdown (ADR 0001):
// - every relative link resolves, heading anchors included (`file.md#heading`, `#heading`);
// - every ADR has valid front matter, the four sections, a unique number and a
//   row in the decisions index, and `supersedes` / `superseded_by` point at each other.
// It covers every tracked .md file except the vendored skills and the root
// README.md (the GitHub profile).
// Usage: node scripts/check-docs.mjs
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';

const root = resolve(execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim());
const files = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '*.md'], { cwd: root, encoding: 'utf8' })
  .split('\n')
  .filter((file) => file && file !== 'README.md' && !file.startsWith('.claude/skills/'))
  .map((file) => join(root, file));

const problems = [];
const report = (file, message) => problems.push(`${relative(root, file)}: ${message}`);

/** Text with fenced code blocks (``` or ~~~, indented too) and inline code removed. */
const prose = (text) =>
  text
    .replace(/^[ \t]*(`{3,}|~{3,})[^\n]*\n[\s\S]*?^[ \t]*\1[ \t]*$/gm, '')
    .replace(/`[^`\n]*`/g, '');

/** GitHub's anchor for a heading: lower case, punctuation dropped, spaces to hyphens. */
const slug = (heading) =>
  heading
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[`*_~]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s/g, '-');

const anchorCache = new Map();
const anchorsOf = (file) => {
  if (!anchorCache.has(file)) {
    const seen = new Map();
    const anchors = new Set();
    for (const [, heading] of prose(readFileSync(file, 'utf8')).matchAll(/^#{1,6}\s+(.+?)\s*#*$/gm)) {
      const base = slug(heading);
      const count = seen.get(base) ?? 0;
      seen.set(base, count + 1);
      anchors.add(count ? `${base}-${count}` : base);
    }
    anchorCache.set(file, anchors);
  }
  return anchorCache.get(file);
};

// Links: [text](target), [text](<target>), [text](target "title").
for (const file of files) {
  const text = prose(readFileSync(file, 'utf8'));
  for (const [, raw] of text.matchAll(/\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)/g)) {
    if (/^[a-z][a-z0-9+.-]*:/i.test(raw)) continue; // https:, mailto:, …
    const [path, anchor] = raw.split('#');
    const target = path ? resolve(dirname(file), decodeURIComponent(path)) : file;
    if (!existsSync(target)) {
      report(file, `broken link ${raw}`);
      continue;
    }
    if (anchor && target.endsWith('.md') && statSync(target).isFile() && !anchorsOf(target).has(decodeURIComponent(anchor))) {
      report(file, `no heading for ${raw}`);
    }
  }
}

// ADRs.
const decisions = join(root, 'docs', 'decisions');
const allowed = ['title', 'number', 'status', 'implementation', 'date', 'supersedes', 'superseded_by', 'notes'];
const required = ['title', 'number', 'status', 'date'];
const index = readFileSync(join(decisions, 'README.md'), 'utf8');
const list = (value) => (value ? [...value.matchAll(/\d+/g)].map(([n]) => Number(n)) : []);
const adrs = new Map();

for (const file of files.filter((f) => dirname(f) === decisions && /\/\d{4}-[^/]+\.md$/.test(f))) {
  const name = file.slice(decisions.length + 1);
  const text = readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  const front = /^---\n([\s\S]*?)\n---/.exec(text)?.[1];
  if (!front) {
    report(file, 'no front matter');
    continue;
  }
  const fields = Object.fromEntries(
    front
      .split('\n')
      .filter((line) => /^\w/.test(line))
      .map((line) => [line.slice(0, line.indexOf(':')), line.slice(line.indexOf(':') + 1).trim()]),
  );
  for (const key of Object.keys(fields)) if (!allowed.includes(key)) report(file, `unknown field ${key}`);
  for (const key of required) if (!(key in fields)) report(file, `missing ${key}`);
  const number = Number(fields.number);
  if (number !== Number.parseInt(name, 10)) report(file, `number ${fields.number} doesn't match the file name`);
  if (adrs.has(number)) report(file, `number ${number} is also used by ${adrs.get(number).name}`);
  if (fields.status && !['accepted', 'superseded'].includes(fields.status)) report(file, `bad status ${fields.status}`);
  if (fields.implementation && !['built', 'partly-built', 'designed'].includes(fields.implementation)) {
    report(file, `bad implementation ${fields.implementation}`);
  }
  for (const section of ['Context', 'Decision', 'Alternatives', 'Consequences']) {
    if (!new RegExp(`^## ${section}$`, 'm').test(text)) report(file, `missing "## ${section}"`);
  }
  if (!index.includes(`(${name})`)) report(file, 'not in decisions/README.md');
  adrs.set(number, { file, name, supersedes: list(fields.supersedes), supersededBy: list(fields.superseded_by) });
}

// `supersedes` and `superseded_by` must point at each other.
for (const [number, adr] of adrs) {
  for (const other of adr.supersedes) {
    if (!adrs.get(other)?.supersededBy.includes(number)) report(adr.file, `supersedes ${other}, which doesn't list ${number} in superseded_by`);
  }
  for (const other of adr.supersededBy) {
    if (!adrs.get(other)?.supersedes.includes(number)) report(adr.file, `superseded_by ${other}, which doesn't list ${number} in supersedes`);
  }
}

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log(`Docs are fine: ${files.length} files, ${adrs.size} decisions.`);
