import { need } from '../dom';
import { mountNavCharacter } from '../nav-character/mount';
import type { SectionApi } from '../types';
import { EDUCATION } from './constants';
import { describe } from './deck';
import { dispose, setup } from './control';
import { attachInput } from './input';
import type { EducationRuntime } from './runtime';
import { unitsOf } from './panels';

// Mounts the Education section: three schools, then twelve certificates on a board, each with its own pinned states.
// Ported from the mockup's 05-credentials/script.js. React calls the returned destroy() on unmount.

const READY_FALLBACK = EDUCATION.ticker.fallback;
const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';
const SMALL_QUERY = '(max-width:600px)';
const FINE_QUERY = '(hover:hover) and (pointer:fine)';

function createRuntime(root: HTMLElement, abort: AbortController): EducationRuntime {
  const tabs = [...root.querySelectorAll<HTMLButtonElement>('.c-tab')];
  const panels = [...root.querySelectorAll<HTMLElement>('.c-panel')];
  const certificates = tabs.length - 1;
  const units = unitsOf(panels.length, certificates);
  const starts = units.map((_units, index) =>
    units.slice(0, index).reduce((sum, value) => sum + value, 0),
  );
  const total = starts[certificates] + units[certificates];
  const reduced = matchMedia(REDUCED_QUERY);
  return {
    root,
    stage: need<HTMLElement>(root, '.c-stage'),
    tabs,
    panels,
    seals: [...root.querySelectorAll<SVGGElement>('.c-seal')],
    turns: [...root.querySelectorAll<SVGGElement>('.c-turn')],
    deck: need<HTMLElement>(root, '.c-deck'),
    cards: [...root.querySelectorAll<HTMLElement>('.c-card')],
    dialog: need<HTMLDialogElement>(root, '.c-dialog'),
    front: need<HTMLElement>(root, '.c-front'),
    filters: [...root.querySelectorAll<HTMLButtonElement>('.c-filter')],
    units,
    starts,
    total,
    certificates,
    abort,
    navPrism: mountNavCharacter(root),
    reduced,
    small: matchMedia(SMALL_QUERY),
    fine: matchMedia(FINE_QUERY),
    motion: !reduced.matches,
    enabled: false,
    destroyed: false,
    pinned: false,
    active: -1,
    pending: null,
    picked: 0,
    filter: '',
    lean: null,
    context: null,
    pin: null,
    deal: null,
    marks: [],
    pendingTimer: undefined,
    timer: undefined,
  };
}

// Waits for the fonts (or 800 ms) so the copy measures correctly, then builds the motion.
function startWhenReady(runtime: EducationRuntime): void {
  Promise.race([
    document.fonts.ready,
    new Promise<void>((resolve) => {
      runtime.timer = setTimeout(() => {
        resolve();
      }, READY_FALLBACK);
    }),
  ]).then(() => {
    clearTimeout(runtime.timer);
    if (!runtime.destroyed) {
      setup(runtime);
    }
  });
}

// Mounts the section on its root. Returns the section API that React calls on unmount.
export function mountEducation(root: HTMLElement): SectionApi {
  const abort = new AbortController();
  const runtime = createRuntime(root, abort);
  attachInput(runtime, abort.signal);
  describe(runtime, runtime.picked);
  startWhenReady(runtime);
  return {
    get state() {
      return {
        motion: runtime.motion,
        active: runtime.active,
        night: runtime.root.classList.contains('is-night'),
        pin: runtime.pin !== null,
        picked: runtime.picked,
        filter: runtime.filter,
      };
    },
    destroy() {
      runtime.destroyed = true;
      runtime.navPrism.destroy();
      clearTimeout(runtime.timer);
      if (runtime.dialog.open) {
        runtime.dialog.close();
      }
      dispose(runtime);
      abort.abort();
      root.classList.remove('is-enhanced', 'is-static');
    },
  };
}
