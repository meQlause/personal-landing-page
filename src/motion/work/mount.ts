import { need } from '../dom';
import { mountNavCharacter } from '../nav-character/mount';
import type { SectionApi } from '../types';
import { dispose, setup, wake } from './control';
import { WORK } from './constants';
import { attachInput } from './input';
import { knotPoints, paintCurve } from './scenes';
import type { Reactor, WorkRuntime } from './runtime';

// Mounts the Selected work section: the five products, their scrubbed scenes, the pinned stage and the shared nav character.
// Ported from the mockup's 03-work/script.js. React calls the returned destroy() on unmount.

const READY_FALLBACK = 800;
const CHIP_PAD = WORK.chipPad;

function createReactors(root: HTMLElement): Reactor[] {
  return [...root.querySelectorAll<SVGGraphicsElement>('.react')].map((element) => ({
    el: element,
    scene: element.closest('.scene'),
    ox: 0,
    oy: 0,
    vx: 0,
    vy: 0,
    transform: '',
  }));
}

function createRuntime(root: HTMLElement, abort: AbortController): WorkRuntime {
  const knot = knotPoints();
  const count = knot.length;
  const floats = (): Float32Array => new Float32Array(count);
  const scenes = [...root.querySelectorAll('.scene')];
  return {
    root,
    stage: need<HTMLElement>(root, '.work-stage'),
    art: need<SVGSVGElement>(root, '.work-art'),
    tabs: [...root.querySelectorAll<HTMLButtonElement>('.work-tab')],
    panels: [...root.querySelectorAll<HTMLElement>('.work-panel')],
    scenes,
    products: scenes.map((scene) => (scene as SVGElement).dataset.scene ?? ''),
    reactors: createReactors(root),
    knot,
    route: new Float32Array(count * 2),
    sway: { x: floats(), y: floats(), vx: floats(), vy: floats() },
    thread: { untie: 0, bead: 100 },
    quartz: { u: 0 },
    pointer: { cx: 0, cy: 0, inside: false },
    abort,
    navPrism: mountNavCharacter(root),
    reduced: matchMedia(WORK.reducedQuery),
    small: matchMedia(WORK.smallQuery),
    fine: matchMedia(WORK.fineQuery),
    routeFor: -1,
    motion: !matchMedia(WORK.reducedQuery).matches,
    enabled: false,
    destroyed: false,
    visible: true,
    pinned: false,
    active: -1,
    pending: null,
    scrollProgress: 0,
    frame: 0,
    last: 0,
    timelines: [],
    context: null,
    pin: null,
    themeTimer: undefined,
    pendingTimer: undefined,
    timer: undefined,
    agaroCount: need(root, '.a-nb'),
    guide: need<SVGPathElement>(root, '.s-guide'),
    threadPath: need<SVGPathElement>(root, '.s-thread'),
    carrier: need<SVGGraphicsElement>(root, '.s-carrier'),
  };
}

// The chips of the Simpul scene are as wide as their text: set once the fonts are ready.
function fitChips(root: HTMLElement): void {
  root.querySelectorAll('.chip').forEach((chip) => {
    const rect = chip.querySelector('rect');
    const text = chip.querySelector('text');
    if (rect && text) {
      rect.setAttribute('width', (text.getComputedTextLength() + CHIP_PAD).toFixed(0));
    }
  });
}

function startWhenReady(runtime: WorkRuntime): void {
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
    fitChips(runtime.root);
    setup(runtime);
  });
}

// Mounts the section on its root. Returns the section API that React calls on unmount.
export function mountWork(root: HTMLElement): SectionApi {
  const abort = new AbortController();
  const runtime = createRuntime(root, abort);
  paintCurve(runtime);
  attachInput(runtime, abort.signal);
  const visibility = new IntersectionObserver(([entry]) => {
    runtime.visible = entry.isIntersecting;
    if (runtime.visible) {
      wake(runtime);
    } else {
      cancelAnimationFrame(runtime.frame);
      runtime.frame = 0;
      runtime.last = 0;
    }
  });
  visibility.observe(runtime.stage);
  startWhenReady(runtime);
  return {
    get state() {
      return {
        motion: runtime.motion,
        active: runtime.active,
        product: runtime.products[runtime.active],
        pin: runtime.pin !== null,
      };
    },
    destroy() {
      runtime.destroyed = true;
      runtime.navPrism.destroy();
      clearTimeout(runtime.timer);
      dispose(runtime);
      abort.abort();
      visibility.disconnect();
      root.classList.remove('is-enhanced', 'is-static');
    },
  };
}
