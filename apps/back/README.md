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
pnpm --filter back dev        # http://localhost:3000
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
| `CMS_URL` | The Strapi origin (vinski.xyz). |
| `CMS_TOKEN` | A read-only Strapi API token. Server-only. |
| `CMS_STATUS` | `published` (production) or `draft` (previews: unpublished changes too). |
| `REVALIDATE_SECRET` | Shared with the Strapi webhook that calls `/api/revalidate`. |

## Content

`lib/cms.ts` reads Strapi with `"use cache"` under the `cms` tag, so pages are prerendered with
their content (the build needs the CMS running). To refresh them when content changes, add a
webhook in Strapi (Settings → Webhooks) for entry create, update, delete, publish and unpublish:

- URL: `https://ski.vin/api/revalidate` (and one for `https://dev.ski.vin/api/revalidate`)
- Header: `Authorization: Bearer <REVALIDATE_SECRET>`

Pages refresh on their next visit; without the webhook they refresh hourly.

## Layout

- `app/%5Fstyle/`: `/_style`, the theme check (Next.js treats `_folders` as private, hence `%5F`).
  A 404 unless `PUBLIC_ENV=preview`.
- `components/ui/`: shadcn/ui components (`components.json`, style `radix-vega`). The theme is
  `@vindotski/theme`; `app/globals.css` only sets the brand color (`--primary`, `--ring`).
- `app/shadcn.css`: shadcn's Tailwind helpers, vendored from `shadcn@4.22.1`, because the npm
  package is the whole CLI. Update it together with the components.

Add components with the CLI, from this folder:

```bash
pnpm dlx shadcn@4.22.1 add <component>
```
