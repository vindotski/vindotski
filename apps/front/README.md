# https://vin.ski

The main site: SvelteKit, fully prerendered and built for search (ADR 0004). It's served by
`adapter-node`, so every page is static HTML and only unknown paths reach the server (as 404s).

## Run

```bash
cp .env.example .env
pnpm --filter front dev       # http://localhost:3001
pnpm --filter front build     # prerenders into build/
pnpm --filter front start     # serves build/ on $PORT (default 3001)
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
| `PUBLIC_ALT_URL` | The alt site: the easter egg's and the crossover's target (ADRs 0008, 0017). Baked in encoded (reversed, XOR'd char codes), never as a plain string. |
| `PUBLIC_SITE_NAME` | The site name, in titles and `og:site_name`. |
| `CMS_URL` | The Strapi origin (vinski.xyz). Read at build time only. |
| `CMS_TOKEN` | A read-only Strapi API token. Never reaches the browser. |

The build reads the CMS, so it needs the CMS running, and it fails rather than prerender a page
without its content. Content changes reach the site with the next build.

## Layout

- `src/routes/+layout.ts`: `prerender = true` for the whole site.
- `src/routes/+page.svelte`: the home, `Home.svelte` or `Teaser.svelte` depending on teaser mode.
- `src/routes/(site)/`: **every other page goes here.** Its `+layout.ts` (and `src/hooks.server.ts`
  at runtime) turns the whole group into 404s in teaser mode.
- `src/routes/(preview)/`: `/_style` (theme check) and `/_teaser`. A 404 unless `PUBLIC_ENV=preview`.
- `src/routes/sitemap.xml`: generated from the route files (`src/lib/pages.ts`). `src/routes/robots.txt`:
  allows everything in production, disallows everything on previews.
- `src/lib/components/SiteHeader.svelte`: the header with the wordmark and the portal switch, rendered by `Home.svelte` and
  `src/routes/(site)/+layout.svelte`. The teaser has no header; it places the wordmark in its eyebrow.
- `src/lib/components/Teaser.svelte`: the teaser. A full-height hero from the Strapi profile: a mono
  eyebrow (wordmark · `role`), the `headline`, the `availability` line, a button per link (`mailto:`
  ones solid, the rest outlined), the `avatar` (grayscale on phones, color from `md`), and a
  "Coming soon" ticker in the brand color that stops under `prefers-reduced-motion`. The portal switch
  sits in its corner.
- `src/lib/components/PortalSwitch.svelte`: the Moon ("Lights out"), in the header and on the
  teaser. vin.ski is the Surface and always light (`<html class="light">` in `src/app.html`, ADR 0019),
  and the switch is the way down to the alt site, whose darkness rises
  from below. The URL is decoded only on click.
- `src/lib/components/Wordmark.svelte`: the site's hostname. Click it three times
  and it flips to the alt site's name and links there (`rel="nofollow noreferrer"`). The URL is
  decoded in the browser only after the trigger, so the HTML never contains it: after a build,
  `grep -r <alt hostname> build/` finds nothing. A `class` prop lets a page restyle it.
- `src/lib/components/Crossover.svelte`: pull past the **bottom** of any page to go down to the alt
  site (ADRs 0017, 0019, `@vindotski/crossover`). A bar fills along the bottom in the alt site's red,
  with a label, then its darkness rises. The root layout renders it once, and its `<head>` script plays the reveal
  when arriving from the alt site.
- `src/lib/alt-url.ts`: decodes `PUBLIC_ALT_URL` in the browser, for the wordmark, the portal switch and the crossover.
- `src/lib/components/LinkIcon.svelte`: an icon per profile link (mail for `mailto:`, the GitHub and
  LinkedIn marks), from `@lucide/svelte` and inline SVG.
- `src/lib/cms.ts`: the CMS client, used from `+page.server.ts` files (build time). It's server-only,
  so `getProfile` returns the avatar URL already absolute for components to use.
- `src/lib/components/Seo.svelte`: title, description, canonical, Open Graph and JSON-LD. One per page.
- `src/lib/components/ui/`: shadcn-svelte components (`components.json`). The theme is
  `@vindotski/theme`; `src/routes/layout.css` sets only the brand color (`--primary`, `--ring`) and the crossover's
  colors (`--crossover-color`, `--crossover-accent`).

Add components with the CLI, from this folder:

```bash
pnpm dlx shadcn-svelte@1.7.1 add <component>
```
