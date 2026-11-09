---
title: "Scrolling past the end of either site carries you to the other, with a color flood"
number: 17
status: accepted
implementation: built
date: 2026-11-09
supersedes: [8]
notes: "Replaces only ADR 8's \"hidden behind the triple-click\". The wordmark trigger stays, and the URL is still never in vin.ski's HTML."
---

## Context

vin.ski and ski.vin mirror each other, and the owner wants moving between them to feel like one place folding into the other: keep scrolling past the end, like pull-to-refresh, and you're carried across. Until now, ski.vin was reachable only through the triple-click on vin.ski's wordmark ([8](0008-easter-egg.md)). A browser's native page transition can't span two origins.

## Decision

- **Pulling past the end crosses, in both directions, for everyone.** The wordmark's triple-click stays as a second way in.
- **`packages/crossover` (`@vindotski/crossover`), shared and framework-free:**
  - `attachCrossover` turns wheel, touch and keyboard input at the end of the page into progress from 0 to 1.
    - **Wheel:** the pull arms after a pause of at least 150ms between wheel events at the end, or once the page has rested at the end for 350ms. A trackpad's momentum that runs into the bottom doesn't cross by accident, and a scroll that reaches the end and pushes on still can.
    - **Touch:** dragging up from the end.
    - **Keyboard:** ↓, PageDown or Space at the end, a quarter per separate press. Auto-repeat from a held key doesn't count.
    - Progress eases back to 0 when the pull stops.
  - `crossTo` floods the screen in the destination's brand color (`--crossover-color`) and then navigates with `#crossover`.
  - `arriveScript`, inline in `<head>`, sees `#crossover`, removes it from the URL, and lets `crossover.css` cover the first paint in the arriving site's own primary and slide it away. The two halves meet in the same color.
- **A thin progress bar** at the bottom fills in the destination's color. It shows "keep going", then the destination's hostname.
- **Unchanged:** vin.ski's prerendered HTML never contains the ski.vin URL. It's decoded in the browser, only when the label or the crossing needs it.
- **Reduced motion:** no flood or reveal animation. The page navigates straight away.

## Alternatives

- **Unlocking the pull only after the triple-click:** it would keep ski.vin hidden. The owner preferred that anyone who keeps scrolling finds it.
- **Pulling only from ski.vin back to vin.ski:** half the idea.
- **A glitch cut, or a slide-through:** the color flood was chosen, because it uses the one thing that differs between the sites, their brand color.
- **A cross-document View Transition:** browsers only allow it within one origin.

## Consequences

- ski.vin is now one long scroll away for any visitor to vin.ski. It stays unlisted by search engines ([5](0005-back-never-listed.md)), but it's no longer secret to people.
- Both sites carry a second small inline `<head>` script. A future Content Security Policy has to allow both.
- Each site sets `--crossover-color` to the other's primary, so changing a brand color means updating it in two places.
