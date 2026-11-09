---
title: "Two environments from two branches: main deploys production, dev deploys previews at dev.vin.ski and dev.ski.vin"
number: 13
status: accepted
implementation: partly-built
date: 2026-11-09
notes: "PUBLIC_ENV and the preview-only routes are built. Branches, hosts, basic auth and deploys come with stage 2."
---

## Context

The designer and the owner need to see changes on real URLs before they reach production, and the previews must not be public or indexed.

## Decision

- **Flow:** a feature branch goes by pull request into `dev`, which deploys the previews. `dev` then goes by pull request into `main`, which deploys production. `main` is protected.
- **Hosts:** production is vin.ski and ski.vin. Previews are dev.vin.ski and dev.ski.vin.
- **One flag, `PUBLIC_ENV=production|preview`, on both sites:**
  - `production`: indexable (front only), teaser mode allowed ([12](0012-teaser-mode.md)), and the underscore routes return 404.
  - `preview`: noindex everywhere, robots.txt `Disallow: /`, teaser mode off, and the preview-only routes `/_teaser` (front) and `/_style` (both) available.
- **Builds:** CI builds images per branch, tagged `<branch>-<sha>`. Front bakes its environment in at build time.
- **Content:** one Strapi serves both environments. Production reads published content, and preview reads drafts with a separate token. Strapi's admin Preview points at the preview hosts.
- **Protection:** Caddy puts basic auth on `dev.*`, with one shared user whose password hash comes from the environment.

## Alternatives

- **`next.vin.ski` and `next.ski.vin`:** rejected, because "next" reads like Next.js on ski.vin, which is the Next.js app.
- **Cloudflare Access:** a login per person, more setup than one shared password for two people.
- **A second, staging Strapi:** drafts already cover previews.

## Consequences

- The server runs two copies of each site.
- `/_style` and `/_teaser` must never be reachable in production.
