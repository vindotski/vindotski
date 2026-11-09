#!/usr/bin/env node
// A stand-in for Strapi, for CI builds: both sites read the CMS at build time,
// and CI has no Strapi. It answers the three REST endpoints the sites use with
// fixed fixtures, wrapped as Strapi does ({ data }), and checks the bearer
// token. Placeholder content only: nothing here is real.
// Usage: node scripts/mock-cms.mjs [port] (default 3000; token from CMS_TOKEN)
import { createServer } from 'node:http';

const port = Number(process.argv[2] ?? 3000);
const token = process.env.CMS_TOKEN ?? 'ci-token';

const profile = {
  name: 'Jane Doe',
  headline: 'A headline for the build check.',
  role: 'Role',
  availability: 'Available for checks.',
  bio: 'A bio for the build check.',
  location: 'Somewhere',
  avatar: null,
  links: [
    { label: 'Email', url: 'mailto:jane@example.com' },
    { label: 'GitHub', url: 'https://github.com/example' },
  ],
};

const project = (n, site) => ({
  documentId: `project-${n}`,
  title: `Project ${n}`,
  slug: `project-${n}`,
  summary: `Summary ${n}.`,
  url: null,
  repository: null,
  cover: null,
  site,
  order: n,
});

const fixtures = {
  '/api/profile': profile,
  '/api/projects': [project(1, 'front'), project(2, 'back'), project(3, 'both')],
  '/api/fragments': [
    { documentId: 'fragment-1', title: 'Fragment 1', slug: 'fragment-1', kind: 'note', media: null },
  ],
};

createServer((request, response) => {
  const { pathname } = new URL(request.url ?? '/', 'http://localhost');
  if (pathname === '/_health') return void response.writeHead(204).end();
  if (request.headers.authorization !== `Bearer ${token}`) {
    return void response.writeHead(401, { 'content-type': 'application/json' }).end('{"error":"unauthorized"}');
  }
  if (!(pathname in fixtures)) {
    return void response.writeHead(404, { 'content-type': 'application/json' }).end('{"error":"not found"}');
  }
  response.writeHead(200, { 'content-type': 'application/json' });
  response.end(JSON.stringify({ data: fixtures[pathname] }));
}).listen(port, () => console.log(`Mock CMS on http://localhost:${port}`));
