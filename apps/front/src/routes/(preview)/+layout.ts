import { isPreview } from '#lib/env.js';

// Preview-only pages (`/_style`, `/_teaser`). Production builds don't
// prerender them, and src/hooks.server.ts answers them with a 404.
export const prerender = isPreview;
