import { error } from '@sveltejs/kit';
import { isPreview } from '#lib/env.js';

// Preview-only pages (`/_style`, `/_teaser`). Production builds don't
// prerender them, and the server answers them with a 404.
export const prerender = isPreview;

export const load = () => {
	if (!isPreview) error(404, 'Not found');
};
