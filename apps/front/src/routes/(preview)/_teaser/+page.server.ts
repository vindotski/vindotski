import { getProfile } from '#lib/cms.js';

export const load = async () => ({ profile: await getProfile() });
