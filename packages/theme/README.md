# @vindotski/theme

The shared look of vin.ski (`apps/front`) and ski.vin (`apps/back`): shadcn tokens, dark mode,
the `@theme inline` mapping, radius, font and base layer, in one `theme.css` (ADR 0007).

It's the shadcn preset `b6RdvRWulu`: style `vega`, base color neutral, no radius, Space Grotesk,
lucide icons. The preset decodes to the same config in both the shadcn-svelte and shadcn/ui CLIs.

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

Dark mode follows the system setting (`prefers-color-scheme`), with no toggle and no JavaScript.
