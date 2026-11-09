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

## Color modes

There are three modes (ADR 0016): `system` leaves `<html>` without a class, so `prefers-color-scheme`
decides, and `light` or `dark` puts that class on `<html>`. The `dark:` variant and the dark tokens
follow the same rule. The dark tokens are written twice (the media block and the `.dark` block), so
keep them in sync. An app's brand override uses the same selectors.

`@vindotski/theme/color-mode` holds the logic both sites share:

| Export | |
|---|---|
| `colorModeScript(default)` | An inline `<head>` script. It applies the stored mode, or the site's default, before the first paint. |
| `getColorMode(default)` | The mode in use, for a toggle's first render. |
| `setColorMode(mode)` | Applies a mode, and stores it in `localStorage` (`color-mode`). |
| `nextColorMode(mode)` | system → light → dark → system. |

vin.ski defaults to `system`. ski.vin defaults to `dark`, and also renders `<html class="dark">`
so it's dark without JavaScript.
