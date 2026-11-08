import { error } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit/hooks';
import { isTeaser } from '#lib/env.js';

// Teaser mode: `(site)` pages are a 404 before any of their loads run, so a
// request for one never reaches the CMS. `(site)/+layout.ts` does the same at
// build time.
export const handle: Handle = ({ event, resolve }) => {
	if (isTeaser && event.route.id?.startsWith('/(site)')) error(404, 'Not found');
	return resolve(event);
};
