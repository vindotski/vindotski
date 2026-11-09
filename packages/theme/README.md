# @vindotski/theme

The shared look of vin.ski (`apps/front`) and ski.vin (`apps/back`): shadcn tokens, dark mode,
the `@theme inline` mapping, radius, font and base layer, in one `theme.css` (ADRs 0007, 0016 and 0019).

It's the shadcn preset `b6RdvRWulu`: style `vega`, base color neutral, no radius, lucide icons. The
preset decodes to the same config in both the shadcn-svelte and shadcn/ui CLIs. Its Space Grotesk is
replaced by **Geist** (`font-sans`, `font-heading`) and **Geist Mono** (`font-mono`), from
`@fontsource-variable/geist` and `@fontsource-variable/geist-mono`.

## Use

In an app's global CSS, after Tailwind and the framework's shadcn helpers:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn-svelte/tailwind.css"; /* front; back uses "shadcn/tailwind.css" */
@import "@vindotski/theme/theme.css";

:root {
  --primary: …;
  --primary-foreground: …;
  --ring: …;
}
```

Only the brand color (`--primary`, its foreground and `--ring`) differs per app. Components
can't be shared across Svelte and React, so each app keeps its own copies; only the tokens live here.

## Color modes

A `light` or `dark` class on `<html>` fixes the mode. With neither, the system's
`prefers-color-scheme` decides. The `dark:` variant and the dark tokens follow the same rule. The
dark tokens are written twice (the media block and the `.dark` block), so keep them in sync.

vin.ski renders `<html class="light">`, and ski.vin `<html class="dark">`: the Surface is always
light and the Underground always dark (ADR 0019). There's no toggle. A template user who wants the
system's mode leaves the class out.
