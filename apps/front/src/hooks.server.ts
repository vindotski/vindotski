import { error } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit/hooks';
import { isPreview, isTeaser } from '#lib/env.js';

// Route-group guards, before any load runs, so a request for a switched-off
// page never reaches the CMS:
// - teaser mode (ADR 0012): `(site)` pages are a 404;
// - outside previews (ADR 0013): `(preview)` pages (`/_style`, `/_teaser`) are a 404.
// The groups' `+layout.ts` files keep those pages out of the prerender too.
export const handle: Handle = ({ event, resolve }) => {
	const route = event.route.id ?? '';
	if (isTeaser && route.startsWith('/(site)')) error(404, 'Not found');
	if (!isPreview && route.startsWith('/(preview)')) error(404, 'Not found');
	return resolve(event);
};
