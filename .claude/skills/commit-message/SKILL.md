---
name: commit-message
description: Propose a Conventional Commits message for the current changes in vindotski, and commit it once the user says OK. Use when a step is finished and verified, or when the user asks for a commit message or a commit.
---

# Commit message

You propose the message; the user decides. Commit only after the user's explicit OK for that
commit, and never `git push`, `git tag` or amend a pushed commit unless they ask.

## Steps

1. Read the change: `git status` and `git diff` (plus `git diff --staged` if anything is staged). Base the message on the diff, not on memory.
2. Keep commits small: one logical change each. If the changes mix unrelated work, say so and propose how to split them into separate commits.
3. Output each proposed message in one fenced code block. Nothing else goes in the block.
4. Wait for the user's OK. Then stage only the files that belong to that commit (by path, not `git add -A`) and commit with the agreed message, adding the `Co-Authored-By` line below.

## Format

```
<type>(<scope>)<!>: <summary>

<body>

<footer>
```

- **Summary:** imperative and lower case, with no trailing period, **at most 50 characters**
  including the type and scope (72 is the hard limit). Count before suggesting.
- **Body (optional):** explains *why*, plus anything non-obvious. Wrap at 72 characters. Skip it for trivial changes.
- **Breaking changes:** add `!` after the scope, and a `BREAKING CHANGE: <what and how to migrate>` footer.
- **Attribution:** a `Co-Authored-By:` trailer for the agent is allowed and goes last, after a blank line. Use the one your harness gives you; no other AI attribution lines.

## Types

`feat`, `fix`, `refactor`, `perf`, `style` (formatting only), `test`, `docs`, `build` (toolchain, dependencies), `ci`, `chore` (repo housekeeping), `revert`.

## Scopes

Optional, but use one when it fits:

| Scope | Covers |
|---|---|
| `front` | `apps/front`: vin.ski (SvelteKit) |
| `back` | `apps/back`: ski.vin (Next.js) |
| `cms` | `apps/cms`: Strapi on vinski.xyz |
| `theme` | `packages/theme`: shared shadcn tokens |
| `crossover` | `packages/crossover`: the portal switches and the pull between the sites |
| `docs` | `docs/`, ADRs |
| `deps` | dependency changes |
| `ci` | GitHub workflows |
| `infra` | deploy, compose, OpenTofu |
| `ai` | `AGENTS.md`, `CLAUDE.md`, `.claude/`, skills, `skills-lock.json` |
| `repo` | license, root config, repo metadata |

Leave the scope out for repo-wide changes.

## Example

```
feat(theme): add shared shadcn tokens package

Both sites import @vindotski/theme, so the preset lives in one place
and only --primary and --ring differ per app.

Co-Authored-By: <agent name> <noreply@example.com>
```
