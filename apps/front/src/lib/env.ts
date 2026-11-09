import { PUBLIC_ENV, PUBLIC_TEASER } from '$app/env/public';

/** `true` on preview builds (dev.vin.ski): noindex everywhere, preview-only routes on. */
export const isPreview = PUBLIC_ENV === 'preview';

/**
 * Teaser mode (ADR 0012): `/` shows the teaser and every page under `(site)`
 * is a 404. Previews always show the full site; the teaser is at `/_teaser`.
 */
export const isTeaser = PUBLIC_TEASER && !isPreview;
