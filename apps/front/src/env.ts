import { defineEnvVars } from '@sveltejs/kit/env';

/** A value that must be one of `options`. */
const oneOf =
	<T extends string>(name: string, options: readonly T[]) =>
	(value: string | undefined): T => {
		if (!options.includes(value as T)) {
			throw new Error(`${name} must be one of ${options.join(', ')} (got "${value ?? ''}")`);
		}
		return value as T;
	};

/** An absolute http(s) URL, without a trailing slash. */
const url = (name: string) => (value: string | undefined) => {
	try {
		const parsed = new URL(value ?? '');
		if (!parsed.protocol.startsWith('http')) throw new Error();
		return parsed.href.replace(/\/$/, '');
	} catch {
		throw new Error(`${name} must be an absolute http(s) URL (got "${value ?? ''}")`);
	}
};

const required = (name: string) => (value: string | undefined) => {
	if (!value) throw new Error(`${name} must be set`);
	return value;
};

/*
 * The PUBLIC_* variables are static: read at build time and baked into the
 * prerendered pages, so changing one means a rebuild. The CMS_* variables are
 * dynamic: read from the environment while prerendering, never written into
 * the build, so the token can't leak through a build artifact.
 */
export const variables = defineEnvVars({
	PUBLIC_ENV: {
		public: true,
		static: true,
		description: '`production` (indexable, no underscore routes) or `preview` (noindex, `/_style` and `/_teaser`).',
		schema: oneOf('PUBLIC_ENV', ['production', 'preview'] as const)
	},
	PUBLIC_SITE_URL: {
		public: true,
		static: true,
		description: 'The public origin, e.g. https://vin.ski. Canonical URLs, the sitemap and OG tags use it.',
		schema: url('PUBLIC_SITE_URL')
	},
	PUBLIC_TEASER: {
		public: true,
		static: true,
		description: '`true`: only `/` (the teaser) is served, every other page is a 404. Ignored on previews.',
		schema: (value) => {
			if (value === undefined || value === '' || value === 'false') return false;
			if (value === 'true') return true;
			throw new Error(`PUBLIC_TEASER must be true or false (got "${value}")`);
		}
	},
	PUBLIC_ALT_URL: {
		public: true,
		static: true,
		description:
			'The easter egg target: the alt site (ADR 0008). Baked in encoded, never as a plain string; Wordmark.svelte decodes it after the trigger.',
		// Reversed char codes, each XOR 23: no readable URL in the bundle or the HTML.
		schema: (value) => [...url('PUBLIC_ALT_URL')(value)].reverse().map((char) => char.charCodeAt(0) ^ 23)
	},
	PUBLIC_SITE_NAME: {
		public: true,
		static: true,
		description: 'The site name, used in titles and `og:site_name`.',
		schema: required('PUBLIC_SITE_NAME')
	},

	// The CMS, read while prerendering only: never inlined, never in the browser.
	// Which content it reads follows PUBLIC_ENV (src/lib/cms.ts): published in
	// production, drafts on previews.
	CMS_URL: {
		description: 'The Strapi origin, e.g. https://vinski.xyz.',
		schema: url('CMS_URL')
	},
	CMS_TOKEN: {
		description: 'A read-only Strapi API token for this site (the preview token on previews).',
		schema: required('CMS_TOKEN')
	}
});
