import { createContext } from 'react';

// The sections below the hero wait for the visitor's first scroll, touch or key before they build their motion: at load
// only the hero is on screen, so their pins and timelines would cost the first seconds for nothing. They then mount one
// task at a time, in page order, so no single task holds the page.

type Start = () => void;

// Runs a callback when the visitor first stirs (at once if they already have). Returns a cancel.
export type WhenAwake = (callback: () => void) => () => void;

export interface MotionGate {
  // Queues a section's start. Returns a cancel for a start that has not run yet.
  readonly queue: (start: Start) => () => void;
  // Listens for the first sign of the visitor; onWake runs at that moment, before any section starts. Returns the clean-up.
  readonly arm: (onWake: () => void) => () => void;
  // For the opening section, which starts at load but leaves its scroll-only parts for the visitor's first input.
  readonly whenAwake: WhenAwake;
  // Settles once every queued start has run.
  readonly ready: Promise<void>;
}

const WAKE_EVENTS = [
  'scroll',
  'wheel',
  'touchstart',
  'pointermove',
  'pointerdown',
  'keydown',
] as const;

export function createMotionGate(): MotionGate {
  const pending: Start[] = [];
  const wakers: Start[] = [];
  let awake = false;
  let settle: () => void = () => undefined;
  const ready = new Promise<void>((resolve) => {
    settle = resolve;
  });
  // One start per task: the browser can paint and answer input between sections.
  const drain = (): void => {
    const next = pending.shift();
    if (next) {
      next();
      window.setTimeout(drain, 0);
    } else {
      settle();
    }
  };
  const wake = (onWake: () => void): void => {
    if (!awake) {
      awake = true;
      onWake();
      // The opening section first, at once, so its pin exists before any section below measures its own.
      wakers.splice(0).forEach((waker) => {
        waker();
      });
      window.setTimeout(drain, 0);
    }
  };
  return {
    queue: (start) => {
      if (awake) {
        start();
        return () => undefined;
      }
      pending.push(start);
      return () => {
        const index = pending.indexOf(start);
        if (index >= 0) {
          pending.splice(index, 1);
        }
      };
    },
    arm: (onWake) => {
      // A deep link or a restored scroll position already shows a section below the hero.
      if (window.location.hash || window.scrollY > 0) {
        wake(onWake);
        return () => undefined;
      }
      const abort = new AbortController();
      const onInput = (): void => {
        abort.abort();
        wake(onWake);
      };
      for (const type of WAKE_EVENTS) {
        window.addEventListener(type, onInput, { passive: true, signal: abort.signal });
      }
      return () => {
        abort.abort();
      };
    },
    whenAwake: (callback) => {
      if (awake) {
        callback();
        return () => undefined;
      }
      wakers.push(callback);
      return () => {
        const index = wakers.indexOf(callback);
        if (index >= 0) {
          wakers.splice(index, 1);
        }
      };
    },
    ready,
  };
}

// Present only on the journey: the preview page has no gate, so its single section mounts at once.
export const MotionGateContext = createContext<MotionGate | null>(null);
// The journey's wake signal for the opening section (absent on the preview page, where everything starts at once).
export const WakeContext = createContext<WhenAwake | null>(null);
