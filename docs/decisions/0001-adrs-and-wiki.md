---
title: "Decisions are ADRs in docs/decisions, and docs/ is published as the GitHub wiki"
number: 1
status: accepted
implementation: partly-built
date: 2026-11-09
notes: "The docs and the sync script are built. The first wiki run waits for the wiki to be enabled."
---

## Context

The project starts from nothing, and it will be reused by others as a template. Decisions need to be findable, and their reasons need to stay readable after the code changes. The repository's root `README.md` is the owner's GitHub profile README, so project documentation can't live there. GitHub's wiki is a convenient place to read documentation, but it's a separate repository, edited without review.

## Decision

- **Every decision gets an architecture decision record** in `docs/decisions/NNNN-title.md`, written in the same change that makes it. Records follow the `decisions-and-docs` skill: front matter, then Context, Decision, Alternatives and Consequences. A changed decision is superseded by a new record, never rewritten.
- **`docs/` holds all project documentation**: an overview (`README.md`), `architecture.md`, `getting-started.md`, `roadmap.md` and the decisions. Each app keeps its own `README.md` describing how it works now.
- **`docs/` is the source and the wiki is a mirror.** `.github/workflows/wiki.yml` runs `scripts/sync-wiki.mjs` on every push to `main` that touches `docs/`. The script turns the folder into the wiki's flat page names:
  - `docs/README.md` becomes `Home`, and `decisions/README.md` becomes `Decisions`.
  - Every other page keeps its file name without `.md`.
  - Links to pages are rewritten to page names. Links outside `docs/` become GitHub URLs.
- **The root `README.md` is never used for project docs.**

## Alternatives

- **Writing in the wiki directly:** it has no review, no history next to the code, and no way to change docs in the same pull request as the code.
- **A third-party wiki action:** it would be one more dependency to pin and trust, for a job that takes a short script.
- **A docs site (VitePress, Starlight):** too much for now. `docs/` can still become one later.

## Consequences

- Wiki edits made in the browser are overwritten on the next sync. The wiki footer says so.
- Two files in `docs/` with the same name would collide in the wiki. The sync script refuses to run when they do.
- Someone has to enable the wiki once and create its first page, so that the `.wiki.git` repository exists.
