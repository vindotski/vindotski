# https://vin.ski

The main site: SvelteKit, fully prerendered and built for search (ADR 0004). It's served by
`adapter-node`, so every page is static HTML and only unknown paths reach the server (as 404s).

## Run

```bash
cp .env.example .env
pnpm --filter front dev       # http://localhost:5173
pnpm --filter front build     # prerenders into build/
pnpm --filter front start     # serves build/ on $PORT (default 3000)
pnpm --filter front check     # svelte-check
```

## Env

All variables are read at build time (`src/env.ts`) and baked into the pages, so changing one
means a rebuild. See `.env.example`.

| Variable | |
|---|---|
| `PUBLIC_ENV` | `production`: indexable, no underscore routes. `preview`: noindex everywhere, robots.txt `Disallow: /`, and the preview-only `/_style` and `/_teaser` pages. |
| `PUBLIC_SITE_URL` | The public origin. Canonical URLs, the sitemap and OG tags use it. |
| `PUBLIC_TEASER` | `true`: teaser mode (ADR 0012). Only `/` (the teaser) is served; every other page is a 404 and the sitemap lists only `/`. Ignored on previews, which always show the full site and the teaser at `/_teaser`. |
| `PUBLIC_SITE_NAME` | The site name, in titles and `og:site_name`. |
| `CMS_URL` | The Strapi origin (vinski.xyz). Read at build time only. |
| `CMS_TOKEN` | A read-only Strapi API token. Never reaches the browser. |
| `CMS_STATUS` | `published` (production) or `draft` (previews: unpublished changes too). |

The build reads the CMS, so it needs the CMS running, and it fails rather than prerender a page
without its content. Content changes reach the site with the next build.

## Layout

- `src/routes/+layout.ts`: `prerender = true` for the whole site.
- `src/routes/+page.svelte`: the home, `Home.svelte` or `Teaser.svelte` depending on teaser mode.
- `src/routes/(site)/`: **every other page goes here.** Its `+layout.ts` (and `src/hooks.server.ts`
  at runtime) turns the whole group into 404s in teaser mode.
- `src/routes/(preview)/`: `/_style` (theme check) and `/_teaser`. A 404 unless `PUBLIC_ENV=preview`.
- `src/routes/sitemap.xml`, `src/routes/robots.txt`: generated from the route files (`src/lib/pages.ts`).
- `src/lib/cms.ts`: the CMS client, used from `+page.server.ts` files (build time).
- `src/lib/components/Seo.svelte`: title, description, canonical, Open Graph and JSON-LD. One per page.
- `src/lib/components/ui/`: shadcn-svelte components (`components.json`). The theme is
  `@vindotski/theme`; `src/routes/layout.css` only sets the brand color (`--primary`, `--ring`).

Add components with the CLI, from this folder:

```bash
pnpm dlx shadcn-svelte@1.7.1 add <component>
```
