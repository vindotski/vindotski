---
title: "Dependencies are pinned to exact versions at least two weeks old"
number: 10
status: accepted
date: 2026-11-09
notes: "pnpm 12 has no save-exact in .npmrc: exact saves come from savePrefix: \"\" in pnpm-workspace.yaml, and minimumReleaseAge enforces the two weeks at install. Dependabot (14-day cooldown) proposes updates."
---

## Context

A fresh release can be broken or compromised (supply-chain attacks often get caught within days). Ranges (`^1.2.3`) let installs change silently.

## Decision

- **Exact versions** in every `package.json` (`save-exact=true` in `.npmrc`), along with the OpenTofu providers and the Docker base images.
- **Each version is at least two weeks old** when it's added or bumped. The `mature-dependency-pins` skill has a script that finds one.
- **CLIs run pinned** (`pnpm dlx shadcn@<version>`), never `@latest`.

## Alternatives

- **Ranges plus a lockfile:** the lockfile pins installs, but updates still pull versions released the same day.

## Consequences

- Upgrades are deliberate, with one more step.
