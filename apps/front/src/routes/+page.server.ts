import { getProfile, getProjects } from '#lib/cms.js';

export const load = async () => {
	const [profile, projects] = await Promise.all([getProfile(), getProjects()]);
	return { profile, projects };
};
