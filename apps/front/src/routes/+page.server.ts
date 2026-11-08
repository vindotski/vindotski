import { getProfile, getProjects } from '#lib/cms.js';
import { isTeaser } from '#lib/env.js';

export const load = async () => {
	const profile = await getProfile();
	// The teaser needs only the profile.
	const projects = isTeaser ? [] : await getProjects();
	return { profile, projects };
};
