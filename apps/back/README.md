# https://ski.vin

The alt site: Next.js (App Router), online but never listed (ADR 0005).

- Every response, pages and static assets alike, carries
  `X-Robots-Tag: noindex, nofollow, noarchive, nosnippet, noimageindex` and
  `Referrer-Policy: no-referrer` (`next.config.ts`), plus the robots meta tag (`app/layout.tsx`).
- `app/robots.ts` allows `*`, so search engines crawl and see the noindex, and blocks AI and
  scraper bots by name. Never `Disallow: /` for search engines: that leads to bare-URL listings.
- No sitemap, no `openGraph` or `twitter` metadata.

## Run

```bash
cp .env.example .env
pnpm --filter back dev        # http://localhost:3002
pnpm --filter back build
pnpm --filter back start
pnpm --filter back check      # next typegen + tsc
```

## Env

See `.env.example`. Static pages read their env when they're prerendered at build time.

| Variable | |
|---|---|
| `PUBLIC_ENV` | `production`, or `preview` (dev.ski.vin), which turns on `/_style`. |
| `SITE_NAME` | The page title. |
| `FRONT_URL` | vin.ski's origin: where the Sun and pulling past the top lead (ADRs 0017, 0019). |
| `CMS_URL` | The Strapi origin (vinski.xyz). |
| `CMS_TOKEN` | A read-only Strapi API token. Server-only. |
| `REVALIDATE_SECRET` | Shared with the Strapi webhook that calls `/api/revalidate`. |

## Content

`lib/cms.ts` reads Strapi with `"use cache"` under the `cms` tag, so pages are prerendered with
their content (the build needs the CMS running). To refresh them when content changes, add a
webhook in Strapi (Settings → Webhooks) for entry publish, unpublish, update and delete:

- URL: `https://ski.vin/api/revalidate` (and one for `https://dev.ski.vin/api/revalidate`)
- Header: `Authorization: Bearer <REVALIDATE_SECRET>`

After a webhook, the next visit still gets the cached page and triggers the refresh; the visit after
that sees the new content. Without the webhook, pages refresh hourly.

Pages are static, so what they read from the environment (`PUBLIC_ENV`, `SITE_NAME`, `FRONT_URL`, the
CMS content) is fixed at build time: build once per environment. The CMS token is read from the
environment, never written into the build, with one catch: Next's standalone output copies a local
`.env` into `.next/standalone/`. Build deployable output without a `.env` present (CI has none).

## Layout

- `app/layout.tsx`: renders `<html class="dark">`, because ski.vin is the Underground and always
  dark (ADR 0019, `docs/concept.md`). Its `<head>` script plays the reveal when arriving from vin.ski.
- `components/portal-switch.tsx`: the Sun ("Lights on"), fixed in the top-right corner. It's the way
  up to vin.ski: daylight pours in from above, led by vin.ski's blue.
- `components/crossover.tsx`: pull past the **top** of any page, like a pull-to-refresh, to go up to
  vin.ski (ADRs 0017, 0019, `@vindotski/crossover` with `edge: "top"`). A bar fills along the top.
  The browser's own pull-to-refresh is off on ski.vin.
- `app/%5Fstyle/`: `/_style`, the theme check (Next.js treats `_folders` as private, hence `%5F`).
  A 404 unless `PUBLIC_ENV=preview`.
- `components/ui/`: shadcn/ui components (`components.json`, style `radix-vega`). The theme is
  `@vindotski/theme`; `app/globals.css` sets the brand color (`--primary`, `--ring`, red) and the crossover's colors (vin.ski's white and blue).
- `app/shadcn.css`: shadcn's Tailwind helpers, vendored from `shadcn@4.22.1`, because the npm
  package is the whole CLI. Update it together with the components.

Add components with the CLI, from this folder:

```bash
pnpm dlx shadcn@4.22.1 add <component>
```
