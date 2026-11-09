---
title: "vin.ski hides an easter egg: its wordmark flips to ski.vin, and the link exists only after the trigger"
number: 8
status: accepted
implementation: built
date: 2026-11-09
superseded_by: [17]
notes: "Built in roadmap stage 1. The front build output contains no ski.vin URL. Since ADR 17, scrolling past the end also leads to ski.vin, so the egg is no longer hidden behind the triple-click alone."
---

## Context

The two domains mirror each other (vin.ski, ski.vin). The alt site should be discoverable only by people who play with the main site, never by crawlers ([5](0005-back-never-listed.md)).

## Decision

- **`Wordmark.svelte` in `apps/front`** flips "vin.ski" to "ski.vin" on a hidden trigger (such as a triple-click, or typing `ski`) and then links there.
- **The URL never appears in the HTML.** It's put together client-side from `PUBLIC_ALT_URL` only after the trigger fires, and split or reversed so it isn't a plain string in the bundle either. The link has `rel="nofollow noreferrer"`.
- **A `console.log` hint for curious developers**, without the URL.
- **It all lives in one component**, so the designer can restyle the wordmark without breaking the egg.

## Alternatives

- **A visible but subtle link:** crawlers would follow it.
- **Konami code:** familiar, but it doesn't use the mirrored domains.

## Consequences

- A test (or a `grep` of the build output) has to confirm that no ski.vin URL ends up in the prerendered HTML.
