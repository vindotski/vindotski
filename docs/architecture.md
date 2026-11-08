# Architecture

Everything described here is designed but not built yet. The [roadmap](roadmap.md) tracks what's done.

## Apps (designed, not built yet)

```
apps/
  front/   SvelteKit 2 + Svelte 5 → vin.ski    prerendered, indexable
  back/    Next.js (App Router)   → ski.vin    online, never listed
  cms/     Strapi 5 + Postgres    → vinski.xyz admin /admin, API /api
packages/
  theme/   @vindotski/theme: shadcn tokens shared by both sites
infra/
  hetzner/ cloudflare/ bootstrap/ stack/
```

- **One look:** both sites use Tailwind v4 and shadcn (shadcn-svelte for front, shadcn/ui for back). They import the same `packages/theme/theme.css` and override only `--primary` and `--ring` ([7](decisions/0007-shared-theme.md)).
- **front:** every page is prerendered, with a canonical URL, Open Graph tags, JSON-LD and a sitemap ([4](decisions/0004-front-sveltekit.md)). `PUBLIC_TEASER=true` reduces it to a teaser at `/` ([12](decisions/0012-teaser-mode.md)).
- **back:** every response carries `X-Robots-Tag: noindex`. It has no sitemap and no link previews, and its robots.txt blocks AI bots ([5](decisions/0005-back-never-listed.md)).
- **The easter egg:** the wordmark on vin.ski flips to ski.vin. The link is created only in the browser, after the trigger ([8](decisions/0008-easter-egg.md)).

## Content (designed, not built yet)

```
Strapi (vinski.xyz) ──REST──▶ front  at build time    (rebuild on publish)
                    ──REST──▶ back   ISR + revalidate (webhook)
```

Content types: `profile` (single), `project` (with `site`: front, back or both) and `fragment` (the alt site). Production reads published entries, and preview reads drafts ([6](decisions/0006-strapi.md)).

## Environments (designed, not built yet)

| Branch | front | back | `PUBLIC_ENV` |
| --- | --- | --- | --- |
| `main` | vin.ski | ski.vin | `production` |
| `dev` | dev.vin.ski | dev.ski.vin | `preview` (basic auth, noindex, `/_style`, `/_teaser`) |

Feature branches go into `dev`, and `dev` goes into `main` ([13](decisions/0013-environments.md)).

## Hosting (designed, not built yet)

One VPS runs Docker Compose: postgres, cms, front, front-dev, back, back-dev, caddy, and optionally cloudflared ([9](decisions/0009-one-vps-compose.md)). Cloudflare sits in front through a Tunnel and caches each app at the edge ([14](decisions/0014-cloudflare-edge.md)). Hetzner and Cloudflare are configured with OpenTofu ([15](decisions/0015-infrastructure-as-code.md)).

## Configuration

Nothing is hardcoded ([3](decisions/0003-nothing-hardcoded.md)). Each app documents its variables in its own README and `.env.example`.
