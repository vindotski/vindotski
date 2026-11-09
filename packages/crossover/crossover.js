// Pull past the end of a page to cross to the other site (ADR 0017).
// Framework-free: each site wraps it in a small component.

const HASH = '#crossover';
const ARRIVE_CLASS = 'crossover-arrive';

const WHEEL_DISTANCE = 900; // px of armed wheel delta for a full pull
const TOUCH_DISTANCE = 180; // px of upward drag for a full pull
const KEY_STEP = 0.25; // per separate ↓ / PageDown / Space press at the end (not auto-repeat)
const ARM_GAP_MS = 150; // a pause this long between wheel events arms the pull...
const SETTLE_MS = 350; // ...and so does resting at the end this long, mid-stream
const IDLE_MS = 400; // no input this long resets the pull (the bar eases back in CSS)
const FLOOD_MS = 450;

const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

const atEnd = () => {
  const root = document.scrollingElement ?? document.documentElement;
  return window.scrollY + window.innerHeight >= root.scrollHeight - 2;
};

/**
 * Listens for a pull past the end of the page.
 * @param {{
 *   getUrl: () => string,
 *   onProgress?: (progress: number) => void,
 *   onCross?: (url: string) => void,
 * }} options
 * @returns {() => void} detach
 */
export function attachCrossover({ getUrl, onProgress = () => {}, onCross = crossTo }) {
  let progress = 0;
  let crossed = false;
  let armed = false;
  let lastWheel = 0;
  /** When the page last arrived at the end, or null while it's not there. */
  let endSince = atEnd() ? performance.now() - SETTLE_MS : null;

  const trackEnd = (now = performance.now()) => {
    if (!atEnd()) endSince = null;
    else endSince ??= now;
    return endSince !== null;
  };
  let idleTimer = 0;
  /** @type {number | null} */
  let touchStartY = null;

  const set = (value) => {
    progress = Math.max(0, Math.min(1, value));
    onProgress(progress);
    if (progress >= 1 && !crossed) {
      crossed = true;
      onCross(getUrl());
    }
  };

  // The value drops to 0 at once; crossover.css eases the bar back down.
  const easeBack = () => {
    clearTimeout(idleTimer);
    if (!crossed) set(0);
  };

  const touched = () => {
    clearTimeout(idleTimer);
    idleTimer = window.setTimeout(easeBack, IDLE_MS);
  };

  /** @param {WheelEvent} event */
  const onWheel = (event) => {
    const now = performance.now();
    const gap = now - lastWheel;
    lastWheel = now;
    if (crossed) return;
    if (!trackEnd(now) || event.deltaY <= 0) {
      armed = false;
      if (progress > 0) easeBack();
      return;
    }
    // Momentum from a scroll that just hit the end arrives as a steady stream,
    // so it doesn't count at first. The pull arms after a pause between wheel
    // events, or once the page has rested at the end for a moment; a trackpad
    // that scrolls down and keeps pushing never pauses.
    if (!armed) {
      if (gap < ARM_GAP_MS && now - /** @type {number} */ (endSince) < SETTLE_MS) return;
      armed = true;
    }
    const delta = event.deltaMode === 1 ? event.deltaY * 16 : event.deltaMode === 2 ? event.deltaY * innerHeight : event.deltaY;
    touched();
    set(progress + delta / WHEEL_DISTANCE);
  };

  /** @param {TouchEvent} event */
  const onTouchStart = (event) => {
    touchStartY = trackEnd() && !crossed ? event.touches[0].clientY : null;
  };

  /** @param {TouchEvent} event */
  const onTouchMove = (event) => {
    if (touchStartY === null || crossed) return;
    set((touchStartY - event.touches[0].clientY) / TOUCH_DISTANCE);
  };

  const onTouchEnd = () => {
    if (touchStartY === null || crossed) return;
    touchStartY = null;
    easeBack();
  };

  /** @param {KeyboardEvent} event */
  const onKey = (event) => {
    // A held key auto-repeats: someone holding ↓ to scroll down would be carried
    // off as soon as they reach the end. Only separate presses count.
    if (crossed || event.repeat || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
    if (!['ArrowDown', 'PageDown', ' '].includes(event.key)) return;
    const target = /** @type {HTMLElement | null} */ (event.target);
    if (target?.closest('input, textarea, select, button, [contenteditable]')) return;
    if (!trackEnd()) return;
    touched();
    set(progress + KEY_STEP);
  };

  const onScroll = () => {
    if (trackEnd()) return;
    armed = false;
    if (!crossed && progress > 0) easeBack();
  };

  // Coming back with the browser's Back button can restore this page from the
  // back-forward cache mid-flood, with the pull spent: start over.
  /** @param {PageTransitionEvent} event */
  const onPageShow = (event) => {
    if (!event.persisted) return;
    for (const flood of document.querySelectorAll('.crossover-flood')) flood.remove();
    crossed = false;
    armed = false;
    endSince = atEnd() ? performance.now() - SETTLE_MS : null;
    set(0);
  };

  window.addEventListener('wheel', onWheel, { passive: true });
  window.addEventListener('touchstart', onTouchStart, { passive: true });
  window.addEventListener('touchmove', onTouchMove, { passive: true });
  window.addEventListener('touchend', onTouchEnd, { passive: true });
  window.addEventListener('touchcancel', onTouchEnd, { passive: true });
  window.addEventListener('keydown', onKey);
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('pageshow', onPageShow);

  return () => {
    clearTimeout(idleTimer);
    window.removeEventListener('wheel', onWheel);
    window.removeEventListener('touchstart', onTouchStart);
    window.removeEventListener('touchmove', onTouchMove);
    window.removeEventListener('touchend', onTouchEnd);
    window.removeEventListener('touchcancel', onTouchEnd);
    window.removeEventListener('keydown', onKey);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('pageshow', onPageShow);
  };
}

/**
 * Floods the screen in `--crossover-color`, then goes to `url`, marked so the
 * other site plays its reveal.
 * @param {string} url
 */
export function crossTo(url) {
  const target = url.replace(/#.*$/, '') + HASH;
  if (reducedMotion()) {
    location.assign(target);
    return;
  }
  const flood = document.createElement('div');
  flood.className = 'crossover-flood';
  flood.setAttribute('aria-hidden', 'true');
  document.body.append(flood);
  flood.getBoundingClientRect(); // start from the hidden position
  flood.classList.add('crossover-flood-in');
  window.setTimeout(() => location.assign(target), FLOOD_MS);
}

/**
 * An inline script for <head>: on arrival from the other site, covers the
 * first paint in this site's primary (crossover.css) and removes the hash.
 */
export const arriveScript = `(function(){if(location.hash!==${JSON.stringify(HASH)})return;var r=document.documentElement;r.classList.add(${JSON.stringify(ARRIVE_CLASS)});history.replaceState(null,"",location.pathname+location.search);setTimeout(function(){r.classList.remove(${JSON.stringify(ARRIVE_CLASS)})},1000)})()`;
