---
name: mature-dependency-pins
description: Add and update dependencies safely. Pin exact versions (no ^ or ~) that have been published for at least two weeks, so a compromised or broken release has time to be caught and pulled before it reaches you. Includes a script that finds the newest such version on npm, and how to do the same for Docker image tags and GitHub Actions. Use this whenever adding, upgrading or pinning a dependency (npm, pnpm, yarn, bun), choosing a Docker base image or an Action version, reviewing a lockfile change, or when the user mentions supply-chain safety, a malicious package incident, or "latest" versions.
---

# Mature dependency pins

Most supply-chain attacks on npm (a hijacked maintainer account, a malicious patch release) are found and unpublished within days. Broken releases get a quick fix just as fast. Waiting two weeks before taking a release lets everyone else find out first, and pinning exactly means nothing newer slips in by itself.

## The rules

1. **Pin exact versions:** `"zod": "4.1.12"`, not `^4.1.12`. The lockfile pins transitive dependencies; exact pins make direct ones explicit in review. (Ranges are fine for `@types/*` and tooling if you prefer, but be consistent.)
2. **Take the newest release that's at least 14 days old.** Prefer a version already in the lockfile when a package is used in several places, so one version is shared.
3. **Stable releases only.** No `-beta`, `-rc` or `-next` unless you mean to.
4. **Check the "latest" tag isn't misleading.** A package's `latest` dist-tag can point at an old or odd version (one RPC library's `latest` was a two-year-old 2.0.0 while 1.x was current). Look at the versions and their dates, not the tag.
5. **Peers move together:** pin a client and its server, or a framework and its adapters, to the same version.
6. **Write down why** when you pin something older on purpose (a breaking change, a known bug), in a comment or the ADR.

## Finding the version

```bash
node scripts/mature-version.mjs react @codemirror/view zod --days 14
```

```
react             19.3.1     2026-10-14
@codemirror/view  6.43.15    2026-10-19
zod               4.6.7      2026-10-12
```

When the newest release is too recent, it says so: `(newest: 6.44.0, 2026-10-30, too recent)`.

It reads the registry's publish times, skips pre-releases and deprecated versions, and exits 1 if a package has nothing old enough. It respects `npm_config_registry`. Then install exactly: `pnpm add -E react@19.3.1` (or `npm install -E`, or `yarn add -E`).

By hand: `npm view <package> time --json` lists every version's publish time.

## Docker images

- **Pin a specific tag,** never `latest`: `postgres:17-alpine` → `postgres:17.6-alpine`, `caddy:2` → `caddy:2.10.2`.
- **Check its age** on the registry page (Docker Hub's tags list shows when each was pushed), or with `docker manifest inspect` plus the registry's API.
- **For the strongest pin,** add the digest: `caddy:2.10.2@sha256:…`. The image can't change under you, but you have to update the digest yourself.
- **Base images** (`node:22-slim`): a major-version tag is a reasonable trade-off, since it gets security fixes. Rebuild regularly.

## GitHub Actions

- **Third-party actions:** pin to a full commit SHA, with the version in a comment: `uses: some/action@8f4b7f8…  # v2.3.1`. A tag can be moved to malicious code; a SHA can't.
- **GitHub's own `actions/*`:** major tags (`@v4`) are a common, accepted trade-off.
- **Check a release's date** on its GitHub releases page before adopting it.
- Dependabot or Renovate can keep SHAs up to date, with a minimum release age (Renovate's `minimumReleaseAge: "14 days"`).

## Tooling that enforces it

- **pnpm 10.16+:** `minimumReleaseAge` (in minutes) in `pnpm-workspace.yaml` refuses to install anything younger: `minimumReleaseAge: 20160` is 14 days.
- **Renovate:** `minimumReleaseAge` and `rangeStrategy: "pin"`.
- **npm and yarn:** no built-in equivalent yet. Use the script, and review lockfile diffs.
