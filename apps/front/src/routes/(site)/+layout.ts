import { isTeaser } from '#lib/env.js';

// Every page except the home lives in this group. In teaser mode none of them
// are prerendered, and src/hooks.server.ts answers them with a 404.
export const prerender = !isTeaser;
