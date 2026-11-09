import { PUBLIC_ALT_URL } from '$app/env/public';

/**
 * The alt site's URL (ADRs 0008 and 0017). It's baked in encoded (reversed,
 * XOR'd char codes) and only decoded here, in the browser, when it's needed,
 * so the prerendered HTML never contains it.
 */
export const altUrl = () =>
	PUBLIC_ALT_URL.map((code) => String.fromCharCode(code ^ 23))
		.reverse()
		.join('');
