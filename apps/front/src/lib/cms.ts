/**
 * The CMS client (Strapi 5 REST at vinski.xyz). It runs while prerendering
 * only, from `+page.server.ts` files, so the token never reaches the browser
 * and isn't written into the build (src/env.ts).
 *
 * It asks Strapi for the fields the pages use and maps each response onto the
 * types below, so nothing else (timestamps, file hashes, future fields) ends up
 * in the prerendered HTML. Production reads published content; previews read
 * drafts, which include unpublished changes (ADR 0013).
 */
import { CMS_TOKEN, CMS_URL } from '$app/env/private';
import { isPreview } from '#lib/env.js';

export type Link = { label: string; url: string };

export type Media = { url: string; alternativeText: string | null; width: number; height: number };

export type Profile = {
	name: string;
	headline: string | null;
	role: string | null;
	availability: string | null;
	bio: string | null;
	location: string | null;
	/** With its URL made absolute, so components can use it as-is. */
	avatar: Media | null;
	links: Link[];
};

export type Project = {
	documentId: string;
	title: string;
	slug: string;
	summary: string | null;
	url: string | null;
	repository: string | null;
};

const status = isPreview ? 'draft' : 'published';

async function get<T>(path: string, params: Record<string, string>): Promise<T> {
	const url = new URL(path, CMS_URL);
	url.search = new URLSearchParams({ ...params, status }).toString();

	const response = await fetch(url, {
		headers: { Authorization: `Bearer ${CMS_TOKEN}` },
		signal: AbortSignal.timeout(10_000)
	});
	if (!response.ok) {
		// Fail the build rather than prerender a page without its content.
		throw new Error(`CMS ${url.pathname} answered ${response.status}`);
	}
	return ((await response.json()) as { data: T }).data;
}

/** `fields[0]=a&fields[1]=b…`, as Strapi expects. */
const fields = (prefix: string, names: string[]) =>
	Object.fromEntries(names.map((name, i) => [`${prefix}[${i}]`, name]));

const media = (raw: Media | null): Media | null =>
	raw && {
		url: new URL(raw.url, CMS_URL).href,
		alternativeText: raw.alternativeText ?? null,
		width: raw.width,
		height: raw.height
	};

export const getProfile = async (): Promise<Profile> => {
	const raw = await get<Profile>('/api/profile', {
		...fields('fields', ['name', 'headline', 'role', 'availability', 'bio', 'location']),
		...fields('populate[avatar][fields]', ['url', 'alternativeText', 'width', 'height']),
		...fields('populate[links][fields]', ['label', 'url'])
	});
	return {
		name: raw.name,
		headline: raw.headline ?? null,
		role: raw.role ?? null,
		availability: raw.availability ?? null,
		bio: raw.bio ?? null,
		location: raw.location ?? null,
		avatar: media(raw.avatar ?? null),
		links: (raw.links ?? []).map(({ label, url }) => ({ label, url }))
	};
};

/** Projects for vin.ski: those marked `front` or `both`, in their set order. */
export const getProjects = async (): Promise<Project[]> => {
	const raw = await get<Project[]>('/api/projects', {
		...fields('fields', ['title', 'slug', 'summary', 'url', 'repository']),
		'filters[site][$in][0]': 'front',
		'filters[site][$in][1]': 'both',
		sort: 'order:asc',
		'pagination[pageSize]': '100'
	});
	return raw.map((project) => ({
		documentId: project.documentId,
		title: project.title,
		slug: project.slug,
		summary: project.summary ?? null,
		url: project.url ?? null,
		repository: project.repository ?? null
	}));
};
