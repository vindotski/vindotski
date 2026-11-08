/**
 * The CMS client (Strapi 5 REST at vinski.xyz). It runs at build time only,
 * from `+page.server.ts` / `+layout.server.ts`, so the token never reaches the
 * browser. CMS_STATUS picks published content (production) or drafts (previews).
 */
import { CMS_STATUS, CMS_TOKEN, CMS_URL } from '$app/env/private';

export type Link = { label: string; url: string };

export type Media = { url: string; alternativeText: string | null; width: number; height: number };

export type Profile = {
	name: string;
	headline: string | null;
	bio: string | null;
	location: string | null;
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
	cover: Media | null;
	site: 'front' | 'back' | 'both';
	order: number;
};

async function get<T>(path: string, params: Record<string, string> = {}): Promise<T> {
	const url = new URL(path, CMS_URL);
	url.search = new URLSearchParams({ ...params, status: CMS_STATUS }).toString();

	const response = await fetch(url, { headers: { Authorization: `Bearer ${CMS_TOKEN}` } });
	if (!response.ok) {
		// Fail the build rather than prerender a page without its content.
		throw new Error(`CMS ${url.pathname} answered ${response.status}`);
	}
	return ((await response.json()) as { data: T }).data;
}

/** Media URLs from Strapi are relative to the CMS. */
export const mediaUrl = (media: Media) => new URL(media.url, CMS_URL).href;

export const getProfile = () => get<Profile>('/api/profile', { populate: '*' });

/** Projects for vin.ski: those marked `front` or `both`, in their set order. */
export const getProjects = () =>
	get<Project[]>('/api/projects', {
		'filters[site][$in][0]': 'front',
		'filters[site][$in][1]': 'both',
		sort: 'order:asc',
		populate: 'cover',
		'pagination[pageSize]': '100'
	});
