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
