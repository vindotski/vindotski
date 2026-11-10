#!/usr/bin/env node
// A stand-in for Strapi, for CI builds: both sites read the CMS at build time,
// and CI has no Strapi. It answers the three REST endpoints the sites use with
// fixed fixtures, wrapped as Strapi does ({ data }), checks the bearer token,
// requires a `status` (published or draft), applies the `site` filter, and logs
// every request it answers. Placeholder content only: nothing here is real.
// Usage: node scripts/mock-cms.mjs [port] (default 4000; token from CMS_TOKEN)
import { createServer } from 'node:http';

const port = Number(process.argv[2] ?? 4000);
if (!Number.isInteger(port) || port <= 0) {
  console.error(`Not a port: ${process.argv[2]}`);
  process.exit(2);
}
const token = process.env.CMS_TOKEN ?? 'ci-token';

const profile = {
  name: 'Jane Doe',
  headline: 'A headline for the build check.',
  role: 'Role',
  availability: 'Available for checks.',
  bio: 'A bio for the build check.',
  location: 'Somewhere',
  avatar: { url: '/uploads/portrait.png', alternativeText: 'A portrait', width: 800, height: 1000 },
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
  site,
  order: n,
});

const projects = [project(1, 'front'), project(2, 'back'), project(3, 'both')];

const fragments = [{ documentId: 'fragment-1', title: 'Fragment 1', slug: 'fragment-1', kind: 'note' }];

/** `filters[site][$in][0]=front&…`, as the sites send it. */
const siteFilter = (query) =>
  [...query.entries()].filter(([key]) => key.startsWith('filters[site][$in]')).map(([, value]) => value);

const answer = {
  '/api/profile': () => profile,
  '/api/projects': (query) => {
    const sites = siteFilter(query);
    return sites.length ? projects.filter((p) => sites.includes(p.site)) : projects;
  },
  '/api/fragments': () => fragments,
};

const json = (response, status, body) => {
  response.writeHead(status, { 'content-type': 'application/json' });
  response.end(JSON.stringify(body));
};

const server = createServer((request, response) => {
  const { pathname, searchParams } = new URL(request.url ?? '/', 'http://localhost');
  if (pathname === '/_health') return void response.writeHead(204).end();
  console.log(`${request.method} ${request.url}`);
  if (request.headers.authorization !== `Bearer ${token}`) return json(response, 401, { error: 'unauthorized' });
  if (!(pathname in answer)) return json(response, 404, { error: 'not found' });
  const status = searchParams.get('status');
  if (status !== 'published' && status !== 'draft') {
    return json(response, 400, { error: 'status must be published or draft' });
  }
  json(response, 200, { data: answer[pathname](searchParams) });
});

server.on('error', (error) => {
  console.error(`Mock CMS: ${error.message}`);
  process.exit(1);
});
server.listen(port, () => console.log(`Mock CMS on http://localhost:${port}`));
