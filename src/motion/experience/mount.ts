import { need } from '../dom';
import { mountNavCharacter } from '../nav-character/mount';
import type { SectionApi } from '../types';
import { dispose, place, setup } from './control';
import { attachInput } from './input';
import type { ExperienceRuntime } from './runtime';
import { fillTickers } from './tickers';

// Mounts the Experience section: seven stops on one pinned stage, the year odometer and the ruler.
// Ported from the mockup's 04-experience/script.js. React calls the returned destroy() on unmount.

const READY_FALLBACK = 800;
const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';
const SMALL_QUERY = '(max-width:600px)';

function createRuntime(root: HTMLElement, abort: AbortController): ExperienceRuntime {
  const panels = [...root.querySelectorAll<HTMLElement>('.x-panel')];
  return {
    root,
    stage: need<HTMLElement>(root, '.x-stage'),
    tape: need<HTMLElement>(root, '.x-tape'),
    tabs: [...root.querySelectorAll<HTMLButtonElement>('.x-stop')],
    tickers: [...root.querySelectorAll<HTMLElement>('.x-ticker')],
    panels,
    scenes: [...root.querySelectorAll('.x-scene')],
    strips: [...root.querySelectorAll<HTMLElement>('.x-strip')],
    years: panels.map((panel) => Number(panel.dataset.year)),
    abort,
    navPrism: mountNavCharacter(root),
    reduced: matchMedia(REDUCED_QUERY),
    small: matchMedia(SMALL_QUERY),
    motion: !matchMedia(REDUCED_QUERY).matches,
    enabled: false,
    destroyed: false,
    pinned: false,
    active: -1,
    pending: null,
    lastPosition: 0,
    context: null,
    pin: null,
    timelines: [],
    pendingTimer: undefined,
    timer: undefined,
  };
}

// Waits for the fonts (or 800 ms) so the copy measures correctly, then fills the tickers and builds the motion.
function startWhenReady(runtime: ExperienceRuntime): void {
  Promise.race([
    document.fonts.ready,
    new Promise<void>((resolve) => {
      runtime.timer = setTimeout(() => {
        resolve();
      }, READY_FALLBACK);
    }),
  ]).then(() => {
    clearTimeout(runtime.timer);
    if (runtime.destroyed) {
      return;
    }
    fillTickers(runtime);
    setup(runtime);
  });
}

// Mounts the section on its root. Returns the section API that React calls on unmount.
export function mountExperience(root: HTMLElement): SectionApi {
  const abort = new AbortController();
  const runtime = createRuntime(root, abort);
  attachInput(runtime, abort.signal);
  const resizer = new ResizeObserver(() => {
    place(runtime, runtime.lastPosition);
    fillTickers(runtime);
  });
  resizer.observe(runtime.stage);
  startWhenReady(runtime);
  return {
    get state() {
      return {
        motion: runtime.motion,
        active: runtime.active,
        paper: runtime.root.classList.contains('is-paper'),
        pin: runtime.pin !== null,
      };
    },
    destroy() {
      runtime.destroyed = true;
      runtime.navPrism.destroy();
      clearTimeout(runtime.timer);
      dispose(runtime);
      abort.abort();
      resizer.disconnect();
      root.classList.remove('is-enhanced', 'is-static');
    },
  };
}
