# @vindotski/crossover

Pull past the end of either site to cross to the other (ADR 0017). It's framework-free, and each site wraps it in a small component: `apps/front/src/lib/components/Crossover.svelte` and `apps/back/components/crossover.tsx`.

## How it works

1. **Pull.** At the end of the page (`scrollY + innerHeight >= scrollHeight - 2`), `attachCrossover` turns input into progress from 0 to 1:
   - **Wheel:** about 900px of downward delta. The pull arms after a pause of at least 150ms between wheel events, or once the page has rested at the end for 350ms. A trackpad's momentum that runs into the bottom doesn't count, but scrolling down and pushing on in the same gesture does.
   - **Touch:** about 180px of upward drag that starts at the end.
   - **Keyboard:** ↓, PageDown or Space, a quarter each (ignored in form fields and buttons).

   With no input for 400ms, or on scrolling away from the end, it drops to 0, and the bar eases down in CSS. A page restored from the back-forward cache (the Back button after crossing) starts over.
2. **Flood.** At 1, `crossTo(url)` adds a full-screen `.crossover-flood` in `--crossover-color`, the other site's primary. It rises for 450ms, then the browser goes to `url#crossover`.
3. **Reveal.** On the other site, `arriveScript` (inline in `<head>`) sees `#crossover`, removes it from the URL, and adds `crossover-arrive` to `<html>`. `crossover.css` then covers the first paint in that site's `--primary`, the same color that just flooded in, and slides it away while the page rises into place.

Under `prefers-reduced-motion`, there's no flood, reveal or bar transition. Crossing navigates straight away.

## API

| Export | |
|---|---|
| `attachCrossover({ getUrl, onProgress?, onCross? })` | Starts listening and returns `detach`. `getUrl` is called only when the pull completes. `onCross` defaults to `crossTo`. |
| `crossTo(url)` | The flood, then navigation to `url#crossover`. |
| `arriveScript` | The inline `<head>` script for the reveal. |
| `crossover.css` | The flood, the reveal, `.crossover-bar` (driven by `--crossover-progress`) and `.crossover-label` (`data-show`). |

Each app imports `@vindotski/crossover/crossover.css` after the theme, and sets `--crossover-color` to the other site's primary.
