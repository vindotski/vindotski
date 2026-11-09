---
title: "Geist and Geist Mono replace Space Grotesk; vin.ski follows the system color mode, ski.vin is always dark"
number: 16
status: accepted
implementation: built
date: 2026-11-09
supersedes: [7]
notes: "Replaces only ADR 7's font. The shared preset and per-site brand colors stay."
---

## Context

The theme came from shadcn preset `b6RdvRWulu`, whose font is Space Grotesk ([7](0007-shared-theme.md)). The owner's earlier site used Geist and Geist Mono with square corners and a monochrome base, and he wants the new sites to carry that feel. The two sites also need different color modes: vin.ski is the professional site, so it should respect the visitor's setting. ski.vin is the underground one, and it should always be dark. Dark mode was a media query only, so a site couldn't opt out of it.

## Decision

- **Fonts:** `@fontsource-variable/geist` for `font-sans` and `font-heading`, and `@fontsource-variable/geist-mono` for `font-mono` (small labels, eyebrows, the teaser ticker). Both are imported once in `packages/theme/theme.css`, so both sites change together.
- **The `dark:` variant matches either the system setting or a `dark` class on an ancestor:** `@custom-variant dark { @media (prefers-color-scheme: dark) { @slot } &:where(.dark, .dark *) { @slot } }`. The dark tokens are defined twice, in the media block and in a `.dark` block, and the two are kept in sync.
- **vin.ski follows the system** (no class).
- **ski.vin is always dark:** `<html class="dark">` in `apps/back/app/layout.tsx`. Its brand override has a `.dark` block too.
- **Brand colors:** vin.ski keeps blue. ski.vin changes from lime to red (`oklch(0.637 0.237 25.331)`).

## Alternatives

- **Keep Space Grotesk:** it's the preset as published, but it doesn't match the look the owner wants.
- **Force dark on ski.vin by overriding the tokens in its own CSS:** it would work, but every shadcn `dark:` class would still follow the system and fight the tokens.
- **A color-mode toggle:** it needs JavaScript and stored state, for something neither site needs.

## Consequences

- The dark token block exists twice in `theme.css`. A change to one has to be made in the other.
- Any element with `class="dark"` turns dark, so a section can go dark on a light page if the designer wants that.
- A red primary sits close to the destructive color on ski.vin. Its `/_style` page is where to check that they stay distinguishable.
