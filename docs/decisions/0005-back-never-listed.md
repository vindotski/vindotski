---
title: "ski.vin is a Next.js site that is online but never listed"
number: 5
status: accepted
implementation: designed
date: 2026-11-09
---

## Context

ski.vin is the owner's space for creative work in an underground style. It should be reachable only through the easter egg on vin.ski ([8](0008-easter-egg.md)), never through search. The domain itself can't be hidden: DNS and certificate-transparency logs are public, so crawlers will find it.

## Decision

- **Next.js (App Router), Tailwind v4 and shadcn/ui**, in `apps/back`.
- **Every response says noindex:** `next.config.ts` `headers()` sets `X-Robots-Tag: noindex, nofollow, noarchive, nosnippet, noimageindex` on `/:path*`, pages and assets alike. The root `metadata.robots` adds the meta tag.
- **Search engines may crawl,** so they can read the noindex and drop every URL. `app/robots.ts` allows `*` and blocks AI and scraper bots by name (GPTBot, ClaudeBot, CCBot, Google-Extended, Bytespider, and others).
- **Nothing advertises the site:**
  - No sitemap.
  - No Open Graph or Twitter metadata, so shared links don't show previews.
  - `Referrer-Policy: no-referrer`, so outgoing clicks don't leak the domain.
- **Optionally, at the edge,** Cloudflare's "Block AI bots" adds to robots.txt ([14](0014-cloudflare-edge.md)).

## Alternatives

- **`Disallow: /` in robots.txt:** this was the first idea, and it was rejected. A disallowed page is never fetched, so its noindex is never read. Google can then still list a bare URL it learned from a link, which is exactly the listing this decision is meant to prevent.
- **Password protection:** it truly hides the site, but the site is meant to be found by visitors who discover the easter egg.

## Consequences

- Google and Bing won't list the site. Engines that ignore noindex are out of our control.
- After launch, verify the domain in Search Console and Bing Webmaster Tools to confirm that nothing is indexed.
- These rules are easy to break by accident: adding a sitemap, OG metadata or `Disallow: /` would undo them. `AGENTS.md` lists them as hard rules.
