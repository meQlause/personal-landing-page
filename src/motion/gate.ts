import { createContext } from 'react';
import { ScrollTrigger } from './gsap';

// The sections below the hero build their motion at load, behind the hero's loading surface, so the visitor's first scroll
// never pays for it. They mount one task at a time, in page order, so no single task holds the page.

type Start = () => void;

export interface MotionGate {
  // Queues a section's start. Returns a cancel for a start that has not run yet.
  readonly queue: (start: Start) => () => void;
  // Starts every queued section, in order; anything queued after runs at once.
  readonly wake: () => void;
  // Settles once every queued start has run.
  readonly ready: Promise<void>;
}

// Each section refreshes every pin on the page when it builds (it has to when it rebuilds alone). While the journey builds,
// those refreshes are skipped: the seams refresh once after the last section, and a full re-measure per section froze the
// page for half a second. The sections build on fonts.ready, so the hold lasts until then.
function holdRefresh(until: Promise<void>): void {
  const { refresh } = ScrollTrigger;
  ScrollTrigger.refresh = () => undefined;
  void until
    .then(() => document.fonts.ready)
    .then(() => {
      ScrollTrigger.refresh = refresh;
    });
}

export function createMotionGate(): MotionGate {
  const pending: Start[] = [];
  let awake = false;
  let settle: () => void = () => undefined;
  const ready = new Promise<void>((resolve) => {
    settle = resolve;
  });
  // One start per task: the browser can paint the loading surface between sections.
  const drain = (): void => {
    const next = pending.shift();
    if (next) {
      next();
      window.setTimeout(drain, 0);
    } else {
      settle();
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
    wake: () => {
      if (!awake) {
        awake = true;
        holdRefresh(ready);
        window.setTimeout(drain, 0);
      }
    },
    ready,
  };
}

// Present only on the journey: the preview page has no gate, so its single section mounts at once.
export const MotionGateContext = createContext<MotionGate | null>(null);
