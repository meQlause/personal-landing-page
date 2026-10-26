// Every number of the Education section's motion, named. Ported from the mockup's 05-credentials/script.js; values are unchanged.

const EASE_OUT_3 = 'power3.out';

// Per school: the first word, then two swipes. The certificates take half that: they land, then hold.
export const STATES = 3;
export const CERT_STATES = 1.5;

export const EDUCATION = {
  flipped: 0.2,
  word: { from: -100, perspective: 700, duration: 0.2, stagger: 0.1, ease: EASE_OUT_3 },
  rest: { from: 16, at: 0.1, duration: 0.2, stagger: 0.03, ease: EASE_OUT_3 },
  sweep: { at: 0.3, duration: 0.25, ease: 'power2.out' },
  swipe: { duration: 0.35, ease: 'power3.inOut', clear: 112 },
  lift: { at: -0.22, distance: 18, duration: 0.2, stagger: 0.01, ease: 'power2.in' },
  deal: {
    column: 4,
    lift: 140,
    step: 18,
    rise: 5,
    sway: 6,
    spread: 7,
    turn: 0.82,
    duration: 0.5,
    stagger: 0.05,
    ease: EASE_OUT_3,
  },
  hold: { to: 0.9 },
  pin: { heightDesktop: 0.34, heightMobile: 0.3, refresh: -3 },
  pick: { debounce: 1600, school: 0.8, certificates: 1.1 },
  seal: { cross: 0.25, end: 0.2, scale: 0.88, grow: 0.12, tilt: -12, origin: '300 270' },
  stamp: { from: 0.1, span: 0.2, tilt: -6 },
  deck: { fade: 0.25, perspective: 1300, lean: { duration: 0.8, ease: EASE_OUT_3, x: 8, y: 6 } },
  spin: 13,
  tab: { offset: 24 },
  smooth: 'smooth',
  dialogClose: 'dialog',
  nightPalette: 'credentials',
  ticker: { fallback: 800 },
} as const;
