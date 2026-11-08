# Decisions

Architecture decision records: one file per decision, numbered in order. A decision that changes is superseded by a newer record, never rewritten. The old record's front matter points to the new one.

Each record has front matter (`title`, `number`, `status`, `implementation`, `date`, and optionally `supersedes`, `superseded_by` and `notes`), then four sections: Context, Decision, Alternatives and Consequences.

| # | Decision | Status |
| --- | --- | --- |
| [1](0001-adrs-and-wiki.md) | Decisions are ADRs in `docs/decisions`, and `docs/` is published as the GitHub wiki | Partly built |
| [2](0002-monorepo.md) | One pnpm monorepo: `apps/front`, `apps/back`, `apps/cms` and `packages/*` | Designed |
| [3](0003-nothing-hardcoded.md) | Nothing is hardcoded: domains, URLs and tokens come from the environment | Principle |
| [4](0004-front-sveltekit.md) | vin.ski is a prerendered SvelteKit site, built for search | Designed |
| [5](0005-back-never-listed.md) | ski.vin is a Next.js site that is online but never listed | Designed |
| [6](0006-strapi.md) | Strapi 5 with Postgres at vinski.xyz serves content to both sites over REST | Designed |
| [7](0007-shared-theme.md) | Both sites share one shadcn preset through `packages/theme`; only `--primary` and `--ring` differ | Designed |
| [8](0008-easter-egg.md) | vin.ski hides an easter egg: its wordmark flips to ski.vin, and the link exists only after the trigger | Designed |
| [9](0009-one-vps-compose.md) | One VPS runs everything in Docker Compose; any VPS works, with Hetzner preferred through OpenTofu | Designed |
| [10](0010-pinned-dependencies.md) | Dependencies are pinned to exact versions at least two weeks old | Principle |
| [11](0011-agents.md) | Agents work from `AGENTS.md` and vendored, pinned skills | Designed |
| [12](0012-teaser-mode.md) | vin.ski has a build-time teaser mode: only `/` is served | Designed |
| [13](0013-environments.md) | Two environments from two branches: `main` deploys production, `dev` deploys previews | Designed |
| [14](0014-cloudflare-edge.md) | Cloudflare sits in front, optionally: a Tunnel, and edge caching tuned per app | Designed |
| [15](0015-infrastructure-as-code.md) | All Hetzner and Cloudflare configuration is OpenTofu, with encrypted state in R2 | Designed |
