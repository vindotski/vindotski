# AGENTS.md

Ivan Vinski's personal sites, in one pnpm monorepo. Docs live in `docs/` (published as the GitHub wiki).

## Repo map

| Path | What | Domain |
|---|---|---|
| `apps/front` | Main site, SvelteKit, prerendered and SEO-first. A designer works here. | vin.ski |
| `apps/back` | Alt site, Next.js App Router. Online but never listed. | ski.vin |
| `apps/cms` | Strapi 5 + Postgres, the content source for both sites. | vinski.xyz |
| `packages/theme` | Shared shadcn tokens and fonts; each site overrides only its brand color. | |
| `packages/crossover` | The way between the sites: portal switches and pulling past an edge. | |
| `docs/` | Concept, architecture, roadmap, ADRs (`docs/decisions`), releasing. | wiki |
| `scripts/` | `check-docs.mjs` (docs check), `mock-cms.mjs` (CMS stand-in for CI), `sync-wiki.mjs`. | |
| `.github/` | CI (`ci.yml`), the wiki sync (`wiki.yml`), Dependabot. | |
| `.claude/` | Vendored, pinned agent skills (sources in `skills-lock.json`); `launch.json` for previews. | |

Each app has its own `AGENTS.md` with app-specific rules. Read it before working there.

## Commands

```bash
pnpm install
pnpm --filter <front|back|cms> dev
pnpm --filter <front|back|cms> build
pnpm --filter <front|back|cms> check
```

## Hard rules

Each rule's details live in the app's `AGENTS.md` and the ADR it cites.

- **Never edit the root `README.md`.** It is Ivan's GitHub profile README, not project docs.
- **Surface / Underground (ADR 19, `docs/concept.md`):** vin.ski is always light, and ski.vin always dark;
  the Moon and Sun switches are the portals. Keep new work true to the concept.
- **Nothing is hardcoded.** Domains, URLs and tokens come from env; each app keeps a `.env.example`.
- **ski.vin stays unlisted** (ADR 5, `apps/back/AGENTS.md`).
- **vin.ski never contains the alt site's name in its build** (ADRs 5, 8, `apps/front/AGENTS.md`).
- **vin.ski stays prerenderable** (ADRs 4, 12, `apps/front/AGENTS.md`).
- **Secrets stay out of builds:** CMS tokens are read from the environment at build or run time,
  never inlined. CI checks both builds for the token.
- **Pin dependencies** exactly, at versions at least two weeks old (ADR 10, `mature-dependency-pins` skill).
- **Branches (ADR 18):** pull requests always target `dev`. A release fast-forwards `main` to `dev`
  (`docs/releasing.md`), and only when Ivan asks. Never commit to `main`, never force-push it.

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
