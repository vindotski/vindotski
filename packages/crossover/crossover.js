// Pull past the edge of a page to cross to the other site (ADRs 0017, 0019).
// The light site pulls past the bottom to go down; the dark one pulls past the
// top to come up. Framework-free: each site wraps it in a small component.
// (No hostnames in comments here: this file is bundled into the light site,
// whose build must never contain the other site's name.)

const HASH_PREFIX = '#crossover-';

const WHEEL_DISTANCE = 900; // px of armed wheel delta for a full pull
const TOUCH_DISTANCE = 180; // px of drag for a full pull
const KEY_STEP = 0.25; // per separate key press at the edge (not auto-repeat)
const ARM_GAP_MS = 150; // a pause this long between wheel events arms the pull...
const SETTLE_MS = 350; // ...and so does resting at the edge this long, mid-stream
const IDLE_MS = 400; // no input this long resets the pull (the bar eases back in CSS)
const FLOOD_MS = 450;

/** @typedef {'bottom' | 'top'} Edge */
/** @typedef {'down' | 'up'} Direction */

const KEYS = {
  bottom: ['ArrowDown', 'PageDown', ' '],
  top: ['ArrowUp', 'PageUp', 'Home'],
};

const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/** @param {Edge} edge */
const atEdge = (edge) => {
  if (edge === 'top') return window.scrollY <= 1;
  const root = document.scrollingElement ?? document.documentElement;
  return window.scrollY + window.innerHeight >= root.scrollHeight - 2;
};

/**
 * Listens for a pull past one edge of the page.
 * @param {{
 *   getUrl: () => string,
 *   edge?: Edge,
 *   onProgress?: (progress: number) => void,
 *   onCross?: (url: string) => void,
 * }} options
 * @returns {() => void} detach
 */
export function attachCrossover({ getUrl, edge = 'bottom', onProgress = () => {}, onCross }) {
  const direction = edge === 'bottom' ? 'down' : 'up';
  const cross = onCross ?? ((url) => crossTo(url, { direction }));
  // Positive when the visitor pushes past this edge.
  const sign = edge === 'bottom' ? 1 : -1;
  const root = document.documentElement;
  root.dataset.crossoverEdge = edge;

  let progress = 0;
  let crossed = false;
  let armed = false;
  let lastWheel = 0;
  let idleTimer = 0;
  /** When the page last arrived at the edge, or null while it's not there. */
  let edgeSince = atEdge(edge) ? performance.now() - SETTLE_MS : null;
  /** @type {number | null} */
  let touchStartY = null;

  const trackEdge = (now = performance.now()) => {
    if (!atEdge(edge)) edgeSince = null;
    else edgeSince ??= now;
    return edgeSince !== null;
  };

  /** @param {number} value */
  const set = (value) => {
    progress = Math.max(0, Math.min(1, value));
    onProgress(progress);
    if (progress >= 1 && !crossed) {
      crossed = true;
      cross(getUrl());
    }
  };

  // The value drops to 0 at once; crossover.css eases the bar back.
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
    // A trackpad pinch arrives as wheel events with ctrlKey: that's zooming.
    if (crossed || event.ctrlKey) return;
    const push = event.deltaY * sign;
    if (!trackEdge(now) || push <= 0) {
      armed = false;
      if (progress > 0) easeBack();
      return;
    }
    // Momentum from a scroll that just hit the edge arrives as a steady stream,
    // so it doesn't count at first. The pull arms after a pause between wheel
    // events, or once the page has rested at the edge for a moment; a trackpad
    // that scrolls and keeps pushing never pauses.
    if (!armed) {
      if (gap < ARM_GAP_MS && now - /** @type {number} */ (edgeSince) < SETTLE_MS) return;
      armed = true;
    }
    const scale = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1;
    touched();
    set(progress + (push * scale) / WHEEL_DISTANCE);
  };

  /** @param {TouchEvent} event */
  const onTouchStart = (event) => {
    // One finger only: two are a pinch or a zoom.
    touchStartY = trackEdge() && !crossed && event.touches.length === 1 ? event.touches[0].clientY : null;
  };

  /** @param {TouchEvent} event */
  const onTouchMove = (event) => {
    if (touchStartY === null || crossed) return;
    if (event.touches.length !== 1) {
      touchStartY = null;
      easeBack();
      return;
    }
    // Past the bottom, the finger moves up; past the top, it moves down.
    set(((touchStartY - event.touches[0].clientY) * sign) / TOUCH_DISTANCE);
  };

  const onTouchEnd = () => {
    if (touchStartY === null || crossed) return;
    touchStartY = null;
    easeBack();
  };

  /** @param {KeyboardEvent} event */
  const onKey = (event) => {
    // A held key auto-repeats: someone holding ↓ to scroll would be carried off
    // as soon as they reach the edge. Only separate presses count.
    // Shift+Space scrolls up, so it never pulls down.
    if (crossed || event.repeat || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (!KEYS[edge].includes(event.key)) return;
    const target = /** @type {HTMLElement | null} */ (event.target);
    if (target?.closest('input, textarea, select, button, [contenteditable]')) return;
    if (!trackEdge()) return;
    touched();
    set(progress + KEY_STEP);
  };

  const onScroll = () => {
    if (trackEdge()) return;
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
    edgeSince = atEdge(edge) ? performance.now() - SETTLE_MS : null;
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
    delete root.dataset.crossoverEdge;
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
 * Floods the screen in `--crossover-color` (led by a line in
 * `--crossover-accent`), rising from below to go down or dropping from above to
 * go up, then goes to `url`, marked so the other site plays its reveal.
 * @param {string} url
 * @param {{ direction?: Direction }} [options]
 */
export function crossTo(url, { direction = 'down' } = {}) {
  // One crossing at a time: a double click floods once.
  if (document.querySelector('.crossover-flood')) return;
  const target = url.replace(/#.*$/, '') + HASH_PREFIX + direction;
  if (reducedMotion()) {
    location.assign(target);
    return;
  }
  const flood = document.createElement('div');
  flood.className = 'crossover-flood';
  flood.dataset.direction = direction;
  flood.setAttribute('aria-hidden', 'true');
  document.body.append(flood);
  // Coming back with the Back button can restore this page from the
  // back-forward cache with the flood still on it: remove it then.
  window.addEventListener(
    'pageshow',
    (event) => {
      if (event.persisted) flood.remove();
    },
    { once: true },
  );
  flood.getBoundingClientRect(); // start from the hidden position
  flood.classList.add('crossover-flood-in');
  window.setTimeout(() => location.assign(target), FLOOD_MS);
}

/**
 * An inline script for <head>: on arrival from the other site, covers the first
 * paint in this site's background (crossover.css), slides it away in the
 * direction of travel, and removes the hash.
 */
export const arriveScript = `(function(){var m=/^${HASH_PREFIX}(down|up)$/.exec(location.hash);if(!m)return;var r=document.documentElement,c="crossover-arrive-"+m[1];r.classList.add(c);history.replaceState(null,"",location.pathname+location.search);setTimeout(function(){r.classList.remove(c)},1000)})()`;
