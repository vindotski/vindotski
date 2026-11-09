---
title: "dev is the default branch; changes go by pull request into dev, and a release fast-forwards main to dev"
number: 18
status: accepted
implementation: built
date: 2026-11-09
supersedes: [13]
notes: "Replaces only ADR 13's promotion step (\"dev goes into main by pull request\"). Its environments, hosts and flags stand."
---

## Context

ADR [13](0013-environments.md) set up two environments: `dev` deploys the previews (dev.vin.ski, dev.ski.vin), and `main` deploys production. It promoted `dev` to `main` by pull request. A merge from `dev` into `main` would add commits that exist only on `main`, so the two branches would drift apart, and every release would carry noise. GitHub's merge, squash and rebase buttons all create new commits; none of them can fast-forward.

## Decision

- **`dev` is the repository's default branch.** Pull requests target it by default, and that's where work is reviewed.
- **Every change goes by pull request into `dev`,** merged with a merge commit, so its small commits are kept.
- **A release fast-forwards `main` to `dev`** with a push, not a pull request:

  ```
  git fetch origin
  git log --oneline origin/main..origin/dev   # what's being released
  git push origin origin/dev:main             # refused unless it's a fast-forward
  ```

  `main` is therefore always exactly a commit that has already been on `dev`, and has been previewed there.
- **Nothing is committed to `main` directly.** A ruleset on `main` blocks force pushes and deletion. It doesn't require pull requests, because a fast-forward push couldn't satisfy that.
- **Agents never release on their own.** The push to `main` happens only when the owner asks.

## Alternatives

- **A pull request from `dev` into `main` (ADR 13 as written):** it gives a review screen, but it adds a merge commit on `main` every time, so `main` stops being a commit that was previewed.
- **Rebase-merging the release pull request:** it rewrites the commits, so `main` gets new SHAs that never ran on the preview.
- **Trunk-based, with `main` only:** previews would need per-pull-request environments, which is too much for one server.

## Consequences

- Releases happen from a terminal (or an agent, when asked), not from GitHub's merge button.
- The GitHub profile README is read from the default branch, which is now `dev`. The root `README.md` is the same on both branches.
- Workflows that act on production, such as the wiki sync and the Stage 2 deploy, trigger on pushes to `main`. Preview deploys trigger on pushes to `dev`.
