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
 * Every variable is static: it's read at build time and baked into the
 * prerendered pages, so changing one means a rebuild.
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
	PUBLIC_SITE_NAME: {
		public: true,
		static: true,
		description: 'The site name, used in titles and `og:site_name`.',
		schema: required('PUBLIC_SITE_NAME')
	},

	// The CMS (vinski.xyz), read at build time only: these never reach the browser.
	CMS_URL: {
		static: true,
		description: 'The Strapi origin, e.g. https://vinski.xyz.',
		schema: url('CMS_URL')
	},
	CMS_TOKEN: {
		static: true,
		description: 'A read-only Strapi API token for this site.',
		schema: required('CMS_TOKEN')
	},
	CMS_STATUS: {
		static: true,
		description: '`published` (production) or `draft` (previews, which include unpublished changes).',
		schema: oneOf('CMS_STATUS', ['published', 'draft'] as const)
	}
});
