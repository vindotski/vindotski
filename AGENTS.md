# AGENTS.md

Ivan Vinski's personal sites, in one pnpm monorepo. Docs live in `docs/` (published as the GitHub wiki).

## Repo map

| Path | What | Domain |
|---|---|---|
| `apps/front` | Main site, SvelteKit, prerendered and SEO-first. A designer works here. | vin.ski |
| `apps/back` | Alt site, Next.js App Router. Online but never listed. | ski.vin |
| `apps/cms` | Strapi 5 + Postgres, the content source for both sites. | vinski.xyz |
| `packages/theme` | Shared shadcn tokens; each site only overrides `--primary`/`--ring`. | |
| `docs/` | Architecture, roadmap, ADRs (`docs/decisions`). | wiki |
| `.claude/skills/` | Vendored, pinned agent skills; sources in `skills-lock.json`. | |

Each app has its own `AGENTS.md` with app-specific rules. Read it before working there.

## Commands

```bash
pnpm install
pnpm --filter <front|back|cms> dev
pnpm --filter <front|back|cms> build
pnpm --filter <front|back|cms> check
```

## Hard rules

- **Never edit the root `README.md`.** It is Ivan's GitHub profile README, not project docs.
- **Surface / Underground (ADR 19, `docs/concept.md`):** vin.ski is always light, and ski.vin always dark.
  There's no color-mode toggle: the Moon and Sun switches are the portals between the sites. Keep new
  work true to the concept (finished work up top, the unpolished below).
- **Nothing is hardcoded.** Domains, URLs and tokens come from env; each app keeps a `.env.example`.
- **ski.vin stays unlisted:** the noindex `X-Robots-Tag` header and robots meta on every response,
  no sitemap, no OG/Twitter metadata. robots.txt blocks AI bots only, never `Disallow: /` for search engines.
- **vin.ski never contains a ski.vin link in its HTML.** The easter egg builds the link client-side.
- **vin.ski stays prerenderable.** Teaser mode is a build-time flag; new pages go under `src/routes/(site)/`.
- **Pin dependencies** exactly, at versions at least two weeks old (`mature-dependency-pins` skill).
- **Environments:** `main` deploys production; `dev` (the default branch) deploys dev.vin.ski and dev.ski.vin.
- **Branches (ADR 18):** pull requests always target `dev`. A release fast-forwards `main` to `dev`
  (`git push origin origin/dev:main`, see `docs/releasing.md`), and only when Ivan asks. Never commit
  to `main` directly, and never force-push it.

## Workflow

1. Read `docs/decisions` and `docs/roadmap.md` before proposing anything; don't contradict an accepted ADR silently.
2. Every decision gets an ADR (`decisions-and-docs` skill), in the same change as the code it shapes.
3. Update the affected READMEs (`apps/*/README.md`, `docs/`) in the same change as the code.
4. Keep CI green (`.github/workflows/ci.yml`; `node scripts/check-docs.mjs` for docs). A rule that can be
   checked in a build belongs in CI as an assertion.
5. Small Conventional Commits (`commit-message` skill). Propose the message; commit only after Ivan's OK,
   with a `Co-Authored-By` line. Never push without being asked.

## Skills

Vendored in `.claude/skills/` and pinned in `skills-lock.json` (source, path, commit, license, patches).
To add or update one: copy it at a pinned commit, patch any `allowed-tools` or commands that run an
unpinned (`@latest`) CLI, and record it in the lock file in the same commit.
