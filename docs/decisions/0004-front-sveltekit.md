---
title: "vin.ski is a prerendered SvelteKit site, built for search"
number: 4
status: accepted
implementation: built
date: 2026-11-09
notes: "Built in roadmap stage 1 (adapter-node, prerendering, Seo.svelte, sitemap, robots)."
---

## Context

vin.ski is the professional site: the one linked from LinkedIn and found by recruiters and Google. It has to load fast and be fully readable by crawlers. A designer will work on it, so the code has to stay plain: markup and tokens, without clever abstractions.

## Decision

- **SvelteKit 2 with Svelte 5, Tailwind v4 and shadcn-svelte**, in `apps/front`.
- **Every page is prerendered** (`export const prerender = true` in the root layout), served by `adapter-node` in Docker ([9](0009-one-vps-compose.md)). Content comes from Strapi at build time ([6](0006-strapi.md)).
- **SEO basics:**
  - `Seo.svelte` sets the title, description, a canonical URL from `PUBLIC_SITE_URL`, and Open Graph and Twitter tags.
  - JSON-LD `Person` with `sameAs` links.
  - Prerendered `sitemap.xml` and `robots.txt` routes.
- **Indexing follows `PUBLIC_ENV`:** only `production` builds are indexable ([13](0013-environments.md)).

## Alternatives

- **Next.js for both sites:** one framework, but the owner wants SvelteKit's simpler components for the designer-facing site, and the alt site is where Next.js is explored.
- **`adapter-static` behind Caddy:** it would work too. `adapter-node` was chosen to leave room for server routes later without changing the deploy.

## Consequences

- Publishing content means a rebuild. A Strapi webhook triggers it ([13](0013-environments.md)).
- Every new route has to stay prerenderable. Server-only features need a decision first.
