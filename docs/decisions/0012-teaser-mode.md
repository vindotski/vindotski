---
title: "vin.ski has a build-time teaser mode: only / is served, and every other route returns 404"
number: 12
status: accepted
implementation: built
date: 2026-11-09
notes: "Built in roadmap stage 1."
---

## Context

vin.ski may need to go live before its pages are ready, showing only a teaser while the full site is built behind it.

## Decision

- **`PUBLIC_TEASER=true`**, read through `$env/static/public`, so it's fixed at build time, which fits prerendering.
- **Every page except the home lives in the `(site)` route group.** `(site)/+layout.ts` throws `error(404)` in teaser mode, so one guard covers every present and future page.
- **`/` renders `Teaser.svelte` or `Home.svelte`.** In teaser mode, the prerender entries are only `/`, and the sitemap lists only `/`. `robots.txt` and static assets keep working.
- **The teaser is indexable** (name, headline, links) and keeps the easter egg ([8](0008-easter-egg.md)).
- **Teaser mode applies only in production.** Preview builds ignore it and serve the teaser at `/_teaser` ([13](0013-environments.md)).

## Alternatives

- **A runtime switch (an environment variable read by the server):** the pages are prerendered, so a runtime check would have nothing to gate.
- **A separate teaser app:** two sites to keep in step.

## Consequences

- Turning the teaser on or off means a rebuild and a deploy.
- New pages have to go under `(site)`, and `apps/front/AGENTS.md` says so.
