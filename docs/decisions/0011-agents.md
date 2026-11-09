---
title: "Agents work from AGENTS.md and vendored, pinned skills"
number: 11
status: accepted
implementation: built
date: 2026-11-09
notes: "AGENTS.md files and 12 vendored skills. Not yet checked in a fresh agent session."
---

## Context

Most of the work is done with coding agents (Claude Code, and others). They need the same rules a human contributor would get, in a form every agent reads, and skills that don't change under them.

## Decision

- **`AGENTS.md` at the root** (the cross-agent convention) holds:
  - The repo map and the commands.
  - The hard rules: no edits to the root README, nothing hardcoded, ski.vin's robots rules, no ski.vin link in vin.ski's HTML, vin.ski stays prerenderable, pinned dependencies.
  - The workflow: read the decisions and roadmap first, an ADR for every decision, READMEs updated in the same change, small Conventional Commits made only after the owner's OK.
- **`CLAUDE.md` contains only `@AGENTS.md`**, so Claude Code reads the same file.
- **Each app has its own `AGENTS.md`** with app-specific rules.
- **Skills are vendored in `.claude/skills/`**, with `skills-lock.json` recording each one's source, path, commit, license and patches (Spotcraft's pattern). The first set:
  - The owner's own: `decisions-and-docs`, `mature-dependency-pins`, `build-journal`.
  - A local `commit-message`.
  - Svelte's official skills, `shadcn-svelte`, shadcn's official skill, `vercel-react-best-practices`, `web-design-guidelines`, `pnpm` and `vite`.
- **Strapi has no skill yet:** there's no official one, and the community ones are unreviewed. Its rules live in `apps/cms/AGENTS.md`.

## Alternatives

- **Installing skills globally, or at `@latest`:** contributors would get different, changing instructions.

## Consequences

- Updating a skill is a deliberate change to the lock file.
- Patches to upstream skills (such as pinned CLI commands) are listed in the lock file, so they survive updates.
