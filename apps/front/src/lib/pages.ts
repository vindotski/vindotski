import { isTeaser } from '#lib/env.js';

/**
 * The site's public pages, derived from the route files so new pages are
 * picked up by themselves. Route groups are dropped from the path; dynamic
 * routes (`[slug]`) and the preview-only `(preview)` group are left out.
 * In teaser mode it's only `/`.
 */
const routes = Object.keys(import.meta.glob('/src/routes/**/+page.svelte'));

export const pages: string[] = isTeaser
	? ['/']
	: routes
	.filter((file) => !file.includes('/(preview)/') && !file.includes('['))
	.map(
		(file) =>
			file
				.replace(/^\/src\/routes/, '')
				.replace(/\/\+page\.svelte$/, '')
				.replace(/\/\([^)]+\)/g, '') || '/'
	)
	.sort();
