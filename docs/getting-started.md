# Getting started

## Running locally

You need Node and pnpm (versions in `.nvmrc` and `package.json`) and Docker for the local Postgres. Each app's README has its details.

```bash
pnpm install
pnpm --filter cms db:up    # local Postgres in Docker
pnpm --filter cms dev      # Strapi on localhost:3000/admin
pnpm --filter front dev    # vin.ski on localhost:3001
pnpm --filter back dev     # ski.vin on localhost:3002
```

Each app reads its settings from `.env`. Copy its `.env.example` to begin. The sites need an API token from Strapi (Settings → API Tokens) in `CMS_TOKEN`, and the front build fails without one.

## Checks

These run on every pull request into `dev`, and on `dev` itself (`.github/workflows/ci.yml`):

| Job | What it checks |
| --- | --- |
| Docs | `node scripts/check-docs.mjs`: every link in `docs/` resolves, and every ADR has valid front matter, its four sections and an index row. Plus a dry run of the wiki sync. |
| Type check | `pnpm check` in every app. |
| Build the sites | Both production builds against `scripts/mock-cms.mjs`, a stand-in for Strapi with placeholder content. vin.ski: no alt-site URL in the build, `<html class="light">`, a canonical URL and a sitemap; the teaser build has only `/`. ski.vin: `X-Robots-Tag` on every response, no sitemap or Open Graph tags, `<html class="dark">`. |

To run the docs check yourself, use `node scripts/check-docs.mjs`. To build against the mock instead of Strapi, run `node scripts/mock-cms.mjs 4000`, and set `CMS_URL=http://localhost:4000` and `CMS_TOKEN=ci-token`.

## Using this as a template

- Replace the domains, tokens and names in the `.env` files and `terraform.tfvars`. None of them appear in the code ([3](decisions/0003-nothing-hardcoded.md)).
- Leave the root `README.md` alone, or replace it with your own: on the owner's repository, it's the GitHub profile README.
- The code is yours to reuse under the AGPL, version 3 only. The content about Ivan Vinski isn't: replace the profile, the portrait, the wordmarks and the CMS content with your own ([NOTICE](../NOTICE), [20](decisions/0020-license.md)).

## One-time setup (designed, not built yet)

1. Buy the domains, and enable the GitHub wiki (create one page, so that the wiki repository exists).
2. Create the API tokens (Hetzner, plus a scoped Cloudflare token) and the R2 bucket that holds the OpenTofu state.
3. If a domain is already a zone in your Cloudflare account, put any records you want to keep (such as mail) into `infra/cloudflare` first, then delete the zone. The first apply creates it again ([15](decisions/0015-infrastructure-as-code.md)).
4. Set the `name_servers` output at your registrar.
