# Roadmap

The order things are built in. Each step is one change that leaves every check green, ends in a *Check*, and is ticked in the change that builds it (with its decision's number).

## 1. Foundation

**Goal:** both sites run locally with the same look, read content from a local Strapi, and follow their indexing rules.

**Done when:** on both `/_style` pages, the components are identical apart from the primary color. A profile published in Strapi shows up on both sites. The front build is indexable, and back sends noindex.

0. [x] **Docs and decisions** (1): `docs/`, ADRs 1–15, and the wiki sync. *Check:* every link resolves, and a dry run of the sync produces Home, Decisions and the ADR pages.
1. [ ] **Agent setup** (11): `AGENTS.md`, `CLAUDE.md`, the app `AGENTS.md` files, and the vendored skills in `skills-lock.json`. *Check:* a fresh agent session lists the skills and the rules. (Built and merged; that check hasn't been run yet.)
2. [x] **Workspace** (2, 10): `pnpm-workspace.yaml`, root scripts, `.nvmrc`, `save-exact`. *Check:* `pnpm install` succeeds on a clean clone.
3. [x] **Theme** (7): `packages/theme/theme.css` holds the chosen preset. *Check:* the same style is confirmed in both shadcn builders.
4. [x] **front scaffold** (4, 13): SvelteKit with `adapter-node`, prerendering, `PUBLIC_ENV`, `Seo.svelte`, the sitemap, robots, and the `(preview)` routes. *Check:* `pnpm --filter front build` prerenders the site with a canonical URL, JSON-LD and a sitemap, and `/_style` returns 404 in production.
5. [x] **back scaffold** (5, 13): Next.js with the robots headers, metadata and robots.txt, and `/_style` only in preview. *Check:* `curl -I` on a page and on an asset shows `X-Robots-Tag`, `/sitemap.xml` returns 404, and there are no `og:` tags.
6. [x] **Strapi** (6): `apps/cms` with Postgres and the `profile`, `project` and `fragment` types. *Check:* a fresh database starts, and the content types appear in the admin.
7. [x] **CMS clients** (6): both sites read Strapi through `CMS_URL`, `CMS_TOKEN` and `CMS_STATUS`. *Check:* a published profile shows up on both sites, and a draft only on preview builds.
8. [x] **Teaser mode** (12): the `(site)` group and the guard. *Check:* a production teaser build serves only `/`, and a preview build serves the full site plus `/_teaser`.
9. [x] **Easter egg** (8): `Wordmark.svelte`. *Check:* the trigger flips the wordmark and the link works, and `grep -r ski.vin` finds nothing in the front build output.

**Also done in this stage:**
- [x] **Teaser in the spirit of the old vin.ski** (16): Geist and Geist Mono, the profile's `role` and `availability`, an eyebrow with the wordmark, link buttons, the portrait and a ticker. Both sites have a color-mode toggle: vin.ski defaults to the system and stays blue, and ski.vin defaults to dark and is red.

- [x] **Pull past the end to cross** (17): `@vindotski/crossover` on both sites, with a color flood out and a reveal in. The public role is now Creative Technologist on both.

**Decisions to make:** the final brand colors and any further design (with the designer). Optional `.mcp.json` servers (Svelte, shadcn, Next.js devtools).

**Not in this stage:** Docker images, servers, DNS and deploys.

## 2. Deploy

**Goal:** `main` and `dev` deploy themselves to one VPS behind Cloudflare.

**Done when:** vin.ski, ski.vin, vinski.xyz, dev.vin.ski and dev.ski.vin all serve over HTTPS from the server. The previews ask for a password, and a push to `dev` updates the previews.

1. [ ] **Bootstrap** (9): `infra/bootstrap` turns any Debian or Ubuntu VPS into a Docker host. *Check:* a fresh VPS passes the bootstrap, and Docker runs under the deploy user.
2. [ ] **Stack** (9, 13): `infra/stack` with Compose and Caddy, including basic auth on `dev.*`. *Check:* `docker compose up` locally serves all five hosts.
3. [ ] **Images and deploy workflow** (9, 13): per-branch images and a deploy over SSH. *Check:* a push to `dev` updates only the previews.
4. [ ] **Hetzner module** (9, 15). *Check:* `tofu apply` creates a server that bootstraps itself.
5. [ ] **Cloudflare module** (14, 15): zones, DNS, the tunnel, cache rules and settings. *Check:* the first apply's `plan` shows only creates, and every host resolves through the tunnel.
6. [ ] **Infra CI** (15): plan on pull requests, manual apply. *Check:* a pull request that touches `infra/` shows a plan.
7. [ ] **Backups and the restore check** (9). *Check:* a restore into a fresh database succeeds.

**Decisions to make:** the registry (Docker Hub or GHCR), backup retention, and whether Strapi uploads go to R2.
