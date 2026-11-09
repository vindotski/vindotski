---
title: "Both sites share one shadcn preset through packages/theme; only --primary and --ring differ"
number: 7
status: accepted
implementation: built
date: 2026-11-09
superseded_by: [16]
notes: "Preset b6RdvRWulu (vega, neutral, no radius), the same in both CLIs. Its font, Space Grotesk, is replaced by Geist and Geist Mono in ADR 16; the rest stands."
---

## Context

vin.ski (SvelteKit) and ski.vin (Next.js) must look exactly the same, apart from their brand color. The designer works on vin.ski, so their token choices have to carry over to ski.vin automatically. shadcn copies component source into each project, and its Svelte and React versions are separate projects (shadcn-svelte and shadcn/ui) that use the same CSS-variable names.

## Decision

- **One shadcn style and preset** for both CLIs. Before it's picked, confirm that the same style, base color, radius and font exist in both the shadcn/ui and shadcn-svelte builders. Spotcraft already uses a shadcn-svelte preset with the `vega` style, so the newer styles exist there.
- **`packages/theme` (`@vindotski/theme`) owns the tokens:** `theme.css` holds the `:root` and `.dark` variables, the `@theme inline` mapping, `--radius`, the font and the base layer.
- **Each app imports it and overrides only `--primary` and `--ring`:**
  `@import "tailwindcss"; @import "@vindotski/theme/theme.css";`, then its own `:root { --primary: …; --ring: … }`.
- **`--accent` is not the brand color.** In shadcn, it's the subtle hover background, and it stays shared.
- **Components aren't shared** across frameworks. Each app adds the same components with its own CLI.

## Alternatives

- **One preset, but the alt site free to drift** (its own fonts and radius): rejected. The two sites are meant to look like one person's work.
- **A cross-framework component library:** a large project for two small sites.

## Consequences

- The designer's changes to `packages/theme` restyle ski.vin too. Letting the two diverge would take a new ADR.
- After adding or updating a component in one app, add the same one in the other, and compare them on the preview-only `/_style` pages ([13](0013-environments.md)).
