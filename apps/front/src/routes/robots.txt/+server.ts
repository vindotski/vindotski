import { PUBLIC_SITE_URL } from '$app/env/public';
import { isPreview } from '#lib/env.js';

// Endpoints don't inherit the layout's `prerender`, so it's set here too.
export const prerender = true;

// Production: everything may be crawled. Previews: nothing (they sit behind auth anyway).
export const GET = () =>
	new Response(
		isPreview
			? 'User-agent: *\nDisallow: /\n'
			: `User-agent: *\nAllow: /\n\nSitemap: ${PUBLIC_SITE_URL}/sitemap.xml\n`,
		{ headers: { 'Content-Type': 'text/plain' } }
	);
