import { PUBLIC_ENV } from '$app/env/public';

/** `true` on preview builds (dev.vin.ski): noindex everywhere, preview-only routes on. */
export const isPreview = PUBLIC_ENV === 'preview';
