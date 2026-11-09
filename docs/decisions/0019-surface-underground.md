---
title: "vin.ski is the light Surface and ski.vin the dark Underground; the light switch is the portal between them"
number: 19
status: accepted
implementation: built
date: 2026-11-09
supersedes: [16, 17]
notes: "Replaces ADR 16's color-mode toggle (its fonts stay) and the direction of ADR 17 (its mechanics stay)."
---

## Context

The two sites had their mechanics (a shared theme, a color-mode toggle with different defaults, a pull past the end of either site), but no shared idea of what they are to each other. The owner wants one creative vision for the pair. The domains mirror each other, and the apps are named `front` and `back`.

## Decision

- **The concept is Surface and Underground** ([docs/concept.md](../concept.md)):
  - **vin.ski is the Surface:** always light, with finished work, polished and indexed.
  - **ski.vin is the Underground:** always dark. It holds process and experiments, fragments and notes, art, music and photos, and unpolished projects.
- **Fixed modes:** vin.ski renders `<html class="light">` and ski.vin `<html class="dark">`. The theme's class-or-system rule stays, so a template user can still follow the system. The color-mode toggle and `@vindotski/theme/color-mode` are removed.
- **The light switch is the portal:** a Moon ("Lights out") on vin.ski crosses down to ski.vin, and a Sun ("Lights on") on ski.vin crosses up to vin.ski. They sit where the toggle was.
- **Gestures follow the direction:** pull past the **bottom** of vin.ski to go down, and past the **top** of ski.vin to come up (`@vindotski/crossover`, `edge: 'top'`). On ski.vin, `overscroll-behavior-y: none` stops the browser's own pull-to-refresh from reloading the page.
- **Transitions are light:**
  - The flood is the destination's background, led by a thin line in the destination's primary.
  - Going down, darkness rises from below. Going up, light drops in from above.
  - The arriving page is covered in its own background, and the cover slides away in the same direction.
- **Content:** `fragment` gets a `kind` (`process`, `note`, `art`, `music`, `photo`, `project`).

## Alternatives

- **Stage / Backstage, A-side / B-side, Day / Night:** each was considered. Surface and Underground was chosen because it gives the pair a direction (down and up), matches the original "underground" brief, and maps onto light and dark.
- **A real light/dark toggle plus a separate portal:** two controls that look alike and do different things.
- **Pulling past the bottom on both sites (ADR 17 as built):** symmetric, but it has no direction. Coming *up* by pulling down at the top is the gesture people already know from pull-to-refresh.
- **Following the system's color scheme on vin.ski:** it respects the visitor's preference, but light is vin.ski's identity. The owner chose identity.

## Consequences

- vin.ski ignores a visitor's dark-mode preference, and ski.vin ignores a light one.
- On ski.vin, the top of the page is a gesture surface: the browser's own pull-to-refresh is off there.
- A Moon or Sun icon reads as a theme toggle at first glance, and clicking it takes the visitor to another site. That's the surprise this is meant to have.
- Each site sets `--crossover-color` and `--crossover-accent` to the other site's background and primary. A change to either one is made in two places.
