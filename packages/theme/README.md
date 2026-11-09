# @vindotski/theme

The shared look of vin.ski (`apps/front`) and ski.vin (`apps/back`): shadcn tokens, dark mode,
the `@theme inline` mapping, radius, font and base layer, in one `theme.css` (ADRs 0007 and 0016).

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

Dark mode follows the system setting (`prefers-color-scheme`), or is forced by a `dark` class on an
ancestor: the `dark:` variant matches either, and the dark tokens are defined for both (keep the media
block and the `.dark` block in sync). vin.ski follows the system; ski.vin puts `class="dark"` on
`<html>`, so it's always dark. There's no toggle and no JavaScript.
