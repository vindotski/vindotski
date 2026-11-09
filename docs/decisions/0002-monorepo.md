---
title: "One pnpm monorepo: apps/front, apps/back, apps/cms and packages/*"
number: 2
status: accepted
implementation: built
date: 2026-11-09
notes: "Workspace built in roadmap stage 1. Strapi runs under pnpm without node-linker=hoisted."
---

## Context

There are two websites and a CMS that feeds both. The sites share a look (see [7](0007-shared-theme.md)), and the whole thing is one person's project, deployed together.

## Decision

- **One repository, `vindotski/vindotski`, as a pnpm workspace** (`pnpm-workspace.yaml`: `apps/*`, `packages/*`).
  - `apps/front`: the main site, vin.ski ([4](0004-front-sveltekit.md)).
  - `apps/back`: the alt site, ski.vin ([5](0005-back-never-listed.md)).
  - `apps/cms`: Strapi, vinski.xyz ([6](0006-strapi.md)).
  - `packages/theme`: the shared design tokens.
- **Plain pnpm scripts** (`pnpm -r`, `pnpm --filter <app>`). No Turborepo or Nx until builds are slow enough to need caching.
- **The root `README.md` stays the GitHub profile README.** Project docs live in `docs/` ([1](0001-adrs-and-wiki.md)).

## Alternatives

- **One repository per app:** the shared theme would need publishing, and a change that touches two apps would need two pull requests.
- **Turborepo:** useful later, but it adds nothing yet with three apps.

## Consequences

- One lockfile. Dependency updates touch every app at once.
- Strapi is known to be fussy under pnpm's isolated `node_modules`. `apps/cms` may need `node-linker=hoisted` in its own `.npmrc`.
