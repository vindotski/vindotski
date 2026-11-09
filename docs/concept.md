# Concept: Surface and Underground

vin.ski and ski.vin are one place on two levels ([decision 19](decisions/0019-surface-underground.md)). The names mirror each other, and so do the sites.

| | **vin.ski: the Surface** | **ski.vin: the Underground** |
|---|---|---|
| Light | Daylight. Always light. | Lights off. Always dark. |
| For | Recruiters, clients, search. Whoever needs the short version. | Whoever keeps going. |
| Holds | Finished work: what was shipped, for whom, and why it mattered. | Everything unpolished: process and experiments, fragments and notes, art, music and photos, projects that didn't make the cut. |
| Tone | Clean, airy, plain copy. Few words, confident. | Dense, raw, mono-heavy. Fragments, dates and tags. Things left as they are. |
| Search engines | Indexed, with SEO. | Never listed ([5](decisions/0005-back-never-listed.md)). |
| Brand color | Blue | Red |

Both use the same type (Geist, Geist Mono), components and tokens ([7](decisions/0007-shared-theme.md), [16](decisions/0016-geist-and-color-modes.md)). What differs is the light, the density and what's on the page.

## Moving between them

You go **down** to the Underground and **up** to the Surface:

| | From vin.ski (down) | From ski.vin (up) |
|---|---|---|
| The switch | The moon in the corner: "Lights out". | The sun in the corner: "Lights on". |
| The gesture | Keep scrolling past the **bottom**. | Keep pulling past the **top**, like pull-to-refresh. |
| The transition | Darkness rises from below, led by a red line. | Light pours in from above, led by a blue line. |
| Also | The wordmark, clicked three times. | |

There's no light/dark toggle: on these sites, the switch *is* the way between them. A visitor's own dark-mode setting never sends them anywhere, and vin.ski stays light even when it's set.

## Content

- **Surface:** the profile, selected projects (`project`, `site` = `front` or `both`), and the professional story.
- **Underground:** `fragment`s, each with a `kind`: `process`, `note`, `art`, `music`, `photo` or `project`. Some `project`s are shown on both levels, told differently.

How each kind looks in the Underground (galleries, players, long notes) is still to design. See the [roadmap](roadmap.md).
