import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Registered once for the whole app; every section imports gsap from here.
gsap.registerPlugin(ScrollTrigger);

// On a touch screen the browser scrolls on its own thread, ahead of the script, so a flick moved the page before a pin
// or a seam's hold was applied: the next section slid up unclipped for a few frames. Scrolling on the script's thread
// keeps them in step. Called once the loader releases the page, because this scrolling ignores the loader's lock.
export function normalizeTouchScroll(): void {
  if (ScrollTrigger.isTouch === 1 && !ScrollTrigger.normalizeScroll()) {
    ScrollTrigger.normalizeScroll({ allowNestedScroll: true });
  }
}

export { gsap, ScrollTrigger };
