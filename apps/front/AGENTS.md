# apps/front: vin.ski

SvelteKit, prerendered, SEO-first. Read for LinkedIn, recruiters and Google. A designer works here too,
so the code has to read like markup.

## Svelte

- Svelte 5 runes only: `$state`, `$derived`, `$effect` (rarely), `$props`, snippets and `{@render}`.
  No `export let`, `$:`, stores for local state, `<slot>` or `on:event`.
- Use the `svelte-code-writer` and `svelte-core-bestpractices` skills; run the autofixer on every
  component you write.
- UI comes from shadcn-svelte (`shadcn-svelte` skill) with the shared tokens from `@vindotski/theme`.
  This app overrides only `--primary`/`--ring`.

## Designer-friendly code

- Markup and Tailwind classes using the theme tokens (`bg-background`, `text-primary`, ...). No raw hex
  colours or one-off pixel values when a token exists.
- One component per file, named for what it shows (`ProjectCard.svelte`), with plain props.
- No clever abstractions: no generic wrappers, config-driven rendering or class-building helpers
  beyond `cn()`. Repetition in markup is fine.
- Content comes from the CMS client (`src/lib/cms.ts`) at build time, not inline in components.

## Routes

- The root layout sets `prerender = true`. Every route must prerender: no server-only runtime data,
  no `+page.server.ts` that needs a request.
- `/` is the only page outside a group. It renders the teaser or the home, by `PUBLIC_TEASER`.
- **New pages go under `src/routes/(site)/`.** Its layout returns 404 in teaser mode, which covers
  every current and future page.
- `src/routes/(preview)/` holds the preview-only pages (`/_style`, `/_teaser`); `src/hooks.server.ts`
  answers them with a 404 unless `PUBLIC_ENV=preview`, before any load runs.
- Env is read through `$app/env/public` (`PUBLIC_ENV`, `PUBLIC_SITE_URL`, `PUBLIC_TEASER`,
  `PUBLIC_ALT_URL`) and, in `src/lib/cms.ts` only, `$app/env/private` (`CMS_URL`, `CMS_TOKEN`: dynamic,
  never inlined into the build). Never hardcode a domain.

## Never link to ski.vin in the HTML

The built HTML must not contain the alt site's URL. `src/lib/alt-url.ts` decodes it client-side from
`PUBLIC_ALT_URL`, only when the easter egg (`Wordmark.svelte`) or the pull-past-the-end crossover
(`Crossover.svelte`, ADR 0017) needs it, never as a plain string in the bundle. Links are
`rel="nofollow noreferrer"`. Don't write the alt hostname in this app's source, comments included:
source maps carry comments into `build/`. Say "the alt site". Check with `grep -r ski.vin build/`
after a build.

## SEO checklist (every page)

- [ ] Unique `<title>` and meta description, through `Seo.svelte`.
- [ ] Canonical URL built from `PUBLIC_SITE_URL`.
- [ ] OG and Twitter tags (title, description, image).
- [ ] One `<h1>`, headings in order, semantic landmarks (`header`, `main`, `nav`, `footer`).
- [ ] Images have `alt`, explicit `width`/`height`, and lazy loading below the fold.
- [ ] The page is in `sitemap.xml` (unless teaser mode) and prerenders without errors.
- [ ] JSON-LD where it fits (`Person` on the home page).
- [ ] Preview builds (`PUBLIC_ENV=preview`) are noindex everywhere.
- [ ] Review with the `web-design-guidelines` skill before calling a page done.
