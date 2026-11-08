import { error } from '@sveltejs/kit';
import { isTeaser } from '#lib/env.js';

// Every page except the home lives in this group, so this one guard turns
// them all off in teaser mode: they aren't prerendered, and they're 404s.
export const prerender = !isTeaser;

export const load = () => {
	if (isTeaser) error(404, 'Not found');
};
