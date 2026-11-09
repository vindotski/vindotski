# @vindotski/crossover

This is the way between the Surface and the Underground (ADRs 0017 and 0019, `docs/concept.md`). vin.ski goes **down** to ski.vin, and ski.vin comes **up** to vin.ski, by a switch or by pulling past an edge of the page. It's framework-free, and each site wraps it in small components:

| | vin.ski (`apps/front`) | ski.vin (`apps/back`) |
|---|---|---|
| Switch | `PortalSwitch.svelte`: Moon, "Lights out" | `components/portal-switch.tsx`: Sun, "Lights on" |
| Pull | `Crossover.svelte`: past the **bottom** | `components/crossover.tsx`: past the **top** |
| Direction | down | up |

## How it works

1. **Pull.** At the pulled edge (the bottom: `scrollY + innerHeight >= scrollHeight - 2`; the top: `scrollY <= 1`), `attachCrossover` turns input into progress from 0 to 1:
   - **Wheel:** about 900px of delta pushing past the edge. The pull arms after a pause of at least 150ms between wheel events, or once the page has rested at the edge for 350ms. A trackpad's momentum that runs into the edge doesn't count, but scrolling and pushing on in the same gesture does.
   - **Touch:** about 180px of drag that starts at the edge: up at the bottom, down at the top.
   - **Keyboard:** a quarter per separate press of ↓, PageDown or Space at the bottom, or ↑, PageUp or Home at the top. Auto-repeat from a held key doesn't count, and neither do presses in form fields or buttons.

   With no input for 400ms, or on scrolling away from the edge, it drops to 0, and the bar eases back in CSS. A page restored from the back-forward cache (the Back button after crossing) starts over. `attachCrossover` sets `data-crossover-edge` on `<html>`. For `top`, that also turns off the browser's own pull-to-refresh (`overscroll-behavior-y: none`).
2. **Flood.** At 1, or on a switch click, `crossTo(url, { direction })` adds a full-screen `.crossover-flood` in `--crossover-color`, the destination's background, led by a 3px line in `--crossover-accent`, its primary. Going down, it rises from below. Going up, it drops from above. After 450ms, the browser goes to `url#crossover-down` or `url#crossover-up`.
3. **Reveal.** On the other site, `arriveScript` (inline in `<head>`) reads the hash and removes it, then adds `crossover-arrive-down` or `crossover-arrive-up` to `<html>`. `crossover.css` covers the first paint in that site's own `--background` (the color that just flooded in) and slides the cover on in the direction of travel, its moving edge lined in `--primary`, while the page rises (down) or settles (up) into place.

Under `prefers-reduced-motion`, there's no flood, reveal or bar transition. Crossing navigates straight away.

## API

| Export | |
|---|---|
| `attachCrossover({ getUrl, edge?, onProgress?, onCross? })` | Starts listening and returns `detach`. `edge` is `bottom` (the default) or `top`. `getUrl` is called only when the pull completes. `onCross` defaults to `crossTo` in the edge's direction (bottom → down, top → up). |
| `crossTo(url, { direction? })` | The flood, `down` (the default) or `up`, then navigation. |
| `arriveScript` | The inline `<head>` script for the reveal. |
| `crossover.css` | The flood, the reveals, `.crossover-bar` (driven by `--crossover-progress`, on the pulled edge) and `.crossover-label` (`data-show`). |

Each app imports `@vindotski/crossover/crossover.css` after the theme, and sets `--crossover-color` and `--crossover-accent` to the other site's background and primary.
