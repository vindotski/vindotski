# Releasing

Every change goes by pull request into `dev`, the default branch, which deploys the previews (dev.vin.ski, dev.ski.vin). A release moves `main`, which deploys production, **fast-forward** to `dev` ([decision 18](decisions/0018-release-by-fast-forward.md)).

## Release

When the previews look right:

```bash
git fetch origin
git log --oneline origin/main..origin/dev   # what's being released
git push origin origin/dev:main             # refused unless it's a fast-forward
```

Never add `--force`. If the push is refused, `main` has a commit that isn't on `dev`, so find out why before doing anything else.

## What happens on the push

- The [wiki](../.github/workflows/wiki.yml) syncs from `docs/`. The wiki has to exist first (create one page in the Wiki tab).
- Production deploys (designed, not built yet: roadmap stage 2).

## Rules

- Pull requests always target `dev`, merged with a merge commit.
- Nothing is committed to `main` directly. A ruleset blocks force pushes and deletion.
- Agents release only when asked.
