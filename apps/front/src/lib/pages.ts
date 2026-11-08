/**
 * The site's public pages, derived from the route files so new pages are
 * picked up by themselves. Route groups are dropped from the path; dynamic
 * routes (`[slug]`) and the preview-only `(preview)` group are left out.
 */
const routes = Object.keys(import.meta.glob('/src/routes/**/+page.svelte'));

export const pages: string[] = routes
	.filter((file) => !file.includes('/(preview)/') && !file.includes('['))
	.map(
		(file) =>
			file
				.replace(/^\/src\/routes/, '')
				.replace(/\/\+page\.svelte$/, '')
				.replace(/\/\([^)]+\)/g, '') || '/'
	)
	.sort();
