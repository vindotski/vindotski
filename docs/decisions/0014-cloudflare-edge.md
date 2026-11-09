---
title: "Cloudflare sits in front, optionally: a Tunnel means no open web ports, and edge caching is tuned per app"
number: 14
status: accepted
implementation: designed
date: 2026-11-09
notes: "Built in roadmap stage 2."
---

## Context

The domains already use Cloudflare's nameservers. Cloudflare can hide the server, cache the prerendered site close to visitors and filter traffic. The template should still work without it.

## Decision

- **`EDGE=cloudflare|none`** in the stack environment ([9](0009-one-vps-compose.md)):
  - `none`: Caddy terminates TLS itself, and ports 80 and 443 are open.
  - `cloudflare`: `cloudflared` runs in Compose, and Caddy serves plain HTTP inside. The server's firewall opens no web ports, and its IP stays hidden.
- **Caching:**
  - vin.ski: HTML is cached at the edge (long edge TTL, short browser TTL), and `/_app/immutable/*` is cached for a year. Each deploy purges the cache.
  - ski.vin: `/_next/static/*` is cached for a year, and HTML follows the app's own `Cache-Control`.
  - vinski.xyz: `/admin*` and `/api*` bypass the cache, and `/uploads/*` is cached.
- **Zone settings:**
  - On: HTTP/3, Brotli, Early Hints, Always Use HTTPS, TLS 1.2 minimum, tiered cache, and the free managed WAF rules.
  - Off: Rocket Loader, which breaks hydration.
  - Bot Fight Mode stays off on vin.ski, so verified crawlers are never challenged. "Block AI bots" is on for ski.vin.
- **Optional:** Cloudflare Web Analytics (no cookies), and R2 for Strapi uploads and database dumps.

## Alternatives

- **Cloudflare as DNS only:** no caching, and the server's IP is exposed.
- **A static host (Pages) for vin.ski:** it would split the hosting, and the preview environment would need its own setup.

## Consequences

- With the tunnel, Cloudflare is in the request path: if it's down, the sites are down.
- Every deploy has to purge the cache, or the old HTML is served until the TTL runs out.
