#!/usr/bin/env node
// Mirrors docs/ into a GitHub wiki checkout (see docs/decisions/0001-adrs-and-wiki.md).
// The wiki has one flat namespace of pages, so this script:
//   - names pages: docs/README.md → Home, <dir>/README.md → <Dir>, other.md → other
//   - rewrites links: to docs pages → page names; to other repo files → GitHub URLs
//   - refuses to run when two files would become the same page
// Usage: node scripts/sync-wiki.mjs <docs-dir> <wiki-dir> <repo-url> [branch]
import { readdirSync, readFileSync, writeFileSync, rmSync, statSync, mkdirSync } from 'node:fs';
import { join, relative, dirname, basename, resolve, posix } from 'node:path';

const [docsArg, wikiArg, repoUrl, branch = 'main'] = process.argv.slice(2);
if (!docsArg || !wikiArg || !repoUrl) {
  console.error('Usage: node scripts/sync-wiki.mjs <docs-dir> <wiki-dir> <repo-url> [branch]');
  process.exit(2);
}
const docsDir = resolve(docsArg);
const wikiDir = resolve(wikiArg);
const repoRoot = dirname(docsDir);

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });

const toPosix = (p) => p.split('\\').join('/');

// The wiki page name for a markdown file inside docs/.
const pageName = (file) => {
  const rel = toPosix(relative(docsDir, file));
  if (rel === 'README.md') return 'Home';
  const base = basename(rel, '.md');
  if (base === 'README') {
    const dir = basename(dirname(rel));
    return dir.charAt(0).toUpperCase() + dir.slice(1);
  }
  return base;
};

const files = walk(docsDir).filter((f) => f.endsWith('.md'));
const pages = new Map();
for (const file of files) {
  const name = pageName(file);
  if (pages.has(name)) {
    console.error(`Two files would become the wiki page "${name}": ${pages.get(name)} and ${file}`);
    process.exit(1);
  }
  pages.set(name, file);
}

const rewriteLink = (target, fromFile) => {
  if (/^([a-z][a-z0-9+.-]*:|#|\/)/i.test(target)) return target; // URLs, anchors, absolute paths
  const [path, hash = ''] = target.split('#');
  const anchor = hash ? `#${hash}` : '';
  const abs = resolve(dirname(fromFile), path);
  const insideDocs = !relative(docsDir, abs).startsWith('..');
  if (insideDocs && abs.endsWith('.md') && files.includes(abs)) return pageName(abs) + anchor;
  const repoPath = toPosix(relative(repoRoot, abs));
  let kind = 'blob';
  try { if (statSync(abs).isDirectory()) kind = 'tree'; } catch { /* missing: still link to blob */ }
  return `${repoUrl}/${kind}/${branch}/${posix.normalize(repoPath)}${anchor}`;
};

// Inline links and images: [text](target) and ![alt](target), with an optional "title".
const linkPattern = /(!?\[[^\]]*\]\()([^)\s]+)((?:\s+"[^"]*")?\))/g;

// Clear the old pages, but keep .git and anything that isn't markdown.
mkdirSync(wikiDir, { recursive: true });
for (const name of readdirSync(wikiDir)) {
  if (name.endsWith('.md')) rmSync(join(wikiDir, name));
}

for (const [name, file] of pages) {
  // Odd segments are fenced code blocks, which are left as they are.
  const body = readFileSync(file, 'utf8')
    .split(/(^```[\s\S]*?^```)/m)
    .map((part, i) =>
      i % 2 ? part : part.replace(linkPattern, (_, open, target, close) => open + rewriteLink(target, file) + close),
    )
    .join('');
  writeFileSync(join(wikiDir, `${name}.md`), body);
}
console.log(`Wrote ${pages.size} wiki pages to ${wikiDir}`);
