import { PUBLIC_SITE_URL } from '$app/env/public';
import { pages } from '#lib/pages.js';

// Endpoints don't inherit the layout's `prerender`, so it's set here too.
export const prerender = true;

export const GET = () => {
	const urls = pages
		.map((path) => `  <url><loc>${new URL(path, PUBLIC_SITE_URL).href}</loc></url>`)
		.join('\n');

	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`,
		{ headers: { 'Content-Type': 'application/xml' } }
	);
};
