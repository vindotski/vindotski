// The color mode both sites share (ADR 0016): `system`, `light` or `dark`.
// `system` leaves <html> without a class, so `prefers-color-scheme` decides;
// `light` and `dark` put that class on <html>, which theme.css honors.
// The visitor's choice is kept in localStorage, per site.

export const COLOR_MODES = /** @type {const} */ (['system', 'light', 'dark']);

const KEY = 'color-mode';

/** @param {string | null | undefined} mode */
const isMode = (mode) => COLOR_MODES.includes(/** @type {any} */ (mode));

/** @param {'system' | 'light' | 'dark'} mode */
function apply(mode) {
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  if (mode !== 'system') root.classList.add(mode);
  root.dataset.colorMode = mode;
}

/**
 * The mode in use: the stored choice, else the site's default.
 * @param {'system' | 'light' | 'dark'} fallback
 * @returns {'system' | 'light' | 'dark'}
 */
export function getColorMode(fallback) {
  const fromHtml = document.documentElement.dataset.colorMode;
  if (isMode(fromHtml)) return /** @type {any} */ (fromHtml);
  return fallback;
}

/** @param {'system' | 'light' | 'dark'} mode */
export function setColorMode(mode) {
  apply(mode);
  try {
    localStorage.setItem(KEY, mode);
  } catch {
    // Private windows and blocked storage: the choice lasts for this page only.
  }
}

/** The mode after this one, for a cycling toggle. @param {'system' | 'light' | 'dark'} mode */
export const nextColorMode = (mode) => COLOR_MODES[(COLOR_MODES.indexOf(mode) + 1) % COLOR_MODES.length];

/**
 * An inline script for <head>: applies the stored mode (or the site's default)
 * before the first paint, so there's no flash of the wrong colors.
 * @param {'system' | 'light' | 'dark'} fallback
 */
export const colorModeScript = (fallback) =>
  `(function(){var m=${JSON.stringify(fallback)};try{var s=localStorage.getItem(${JSON.stringify(KEY)});if(s==="system"||s==="light"||s==="dark")m=s}catch(e){}var r=document.documentElement;r.classList.remove("light","dark");if(m!=="system")r.classList.add(m);r.dataset.colorMode=m})()`;
