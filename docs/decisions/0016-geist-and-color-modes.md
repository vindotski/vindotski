---
title: "Geist and Geist Mono replace Space Grotesk; both sites have a color-mode toggle, vin.ski defaults to the system and ski.vin to dark"
number: 16
status: accepted
implementation: built
date: 2026-11-09
supersedes: [7]
notes: "Replaces only ADR 7's font. The shared preset and per-site brand colors stay."
---

## Context

The theme came from shadcn preset `b6RdvRWulu`, whose font is Space Grotesk ([7](0007-shared-theme.md)). The owner's earlier site used Geist and Geist Mono with square corners and a monochrome base, and he wants the new sites to carry that feel.

The two sites also need different defaults for their color mode. vin.ski is the professional site, so it starts with the visitor's system setting. ski.vin is the underground one, so it starts dark. On both, visitors can change it. Dark mode was a media query only, so it couldn't express a default or a visitor's choice.

## Decision

- **Fonts:** `@fontsource-variable/geist` for `font-sans` and `font-heading`, and `@fontsource-variable/geist-mono` for `font-mono` (small labels, eyebrows, the teaser ticker). Both are imported once in `packages/theme/theme.css`, so both sites change together.
- **Three modes: `system`, `light` and `dark`.**
  - `system` leaves `<html>` without a class, so `prefers-color-scheme` decides.
  - `light` and `dark` put that class on `<html>`.
  - The `dark:` variant, and the dark tokens, apply under a `dark` class, or under the system's dark preference when there's no `light` class.
- **`packages/theme/color-mode.js` is shared by both sites:**
  - `colorModeScript(default)` is an inline `<head>` script that applies the stored mode before the first paint, so there's no flash of the wrong colors.
  - `getColorMode`, `setColorMode` and `nextColorMode` serve the toggles.
  - The choice is kept in `localStorage` (`color-mode`). Each site has its own origin, so each keeps its own choice.
- **Toggles:** each site has a small icon button that cycles system → light → dark: `ColorModeToggle.svelte` on vin.ski (in the header and the teaser's corner), and `components/color-mode-toggle.tsx` on ski.vin (fixed in the top-right corner).
- **Defaults:**
  - vin.ski: `system`.
  - ski.vin: `dark`. Its `<html>` is rendered with `class="dark"`, so it's dark without JavaScript too.
- **Brand colors:** vin.ski keeps blue. ski.vin changes from lime to red (`oklch(0.637 0.237 25.331)`), the same in every mode.

## Alternatives

- **Keep Space Grotesk:** it's the preset as published, but it doesn't match the look the owner wants.
- **No toggle (ski.vin always dark, vin.ski always the system):** this was the first version of this decision. The owner wanted defaults, not fixed modes.
- **A cookie instead of localStorage:** the server could then render the right class, but the sites are prerendered, and the head script gets the same result without a flash.
- **`next-themes` / `mode-watcher`:** one library per framework, for about 30 lines of shared code.

## Consequences

- The dark token block exists twice in `theme.css`, once in the system-dark media query and once for the `dark` class, and the two must stay in sync. Each site's brand override follows the same selectors.
- Each page has a small inline script in `<head>`. A future Content Security Policy has to allow it, through a hash or a nonce.
- ski.vin's `<html>` uses `suppressHydrationWarning`, because the head script can change its class before React hydrates.
- A red primary sits close to the destructive color on ski.vin. Its `/_style` page is where to check that they stay distinguishable.
