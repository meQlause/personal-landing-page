import { need } from '../dom';
import type { WhenAwake } from '../gate';
import { mountNavCharacter } from '../nav-character/mount';
import type { SectionApi } from '../types';
import { FROST, ROUTE } from './constants';
import { attachInput } from './input';
import { dispose, stopFrame, wake } from './loop';
import { resize } from './particles';
import { mountPortrait } from './portrait';
import type { HeroRuntime } from './runtime';
import { setup } from './setup';

// Mounts the hero's motion on its section. React calls the returned destroy() on unmount.

const SMALL_QUERY = '(max-width:600px)';
const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';
const FINE_QUERY = '(hover:hover) and (pointer:fine)';

function createRuntime(
  root: HTMLElement,
  abort: AbortController,
  whenAwake: WhenAwake | null,
): HeroRuntime {
  const canvas = need<HTMLCanvasElement>(root, '.window-frost');
  const base = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const baseCtx = base.getContext('2d');
  if (!ctx || !baseCtx) {
    throw new Error('The hero needs a 2D canvas');
  }
  const particleCanvas = need<HTMLCanvasElement>(root, '.hero-particles');
  const reduced = matchMedia(REDUCED_QUERY);
  return {
    root,
    stage: need<HTMLElement>(root, '.hero-stage'),
    canvas,
    ctx,
    base,
    baseCtx,
    particleCanvas,
    pc: particleCanvas.getContext('2d'),
    cursor: need(root, '.hero-cursor'),
    tilt: need(root, '.system-tilt'),
    rail: need(root, '.journey-rail'),
    railItems: [...root.querySelectorAll<HTMLElement>('.journey-rail li')],
    phaseTitles: [...root.querySelectorAll<HTMLElement>('.journey-title span')],
    pose: { open: 0, travel: 0, portrait: 0, cover: 0, journey: 0 },
    trails: [],
    particles: [],
    pointer: { x: -FROST.offscreen, y: -FROST.offscreen, inside: false },
    ring: { x: 0, y: 0 },
    spin: { x: 0, y: 0, targetX: 0, targetY: 0 },
    abort,
    portrait: mountPortrait(need<HTMLElement>(root, '.portrait-view'), need(root, '.plane-back')),
    navPrism: mountNavCharacter(root),
    reduced,
    small: matchMedia(SMALL_QUERY),
    fine: matchMedia(FINE_QUERY),
    w: 0,
    h: 0,
    motion: !reduced.matches,
    ready: false,
    destroyed: false,
    visible: true,
    frame: 0,
    lastTime: 0,
    lastPoint: null,
    phase: -1,
    particleTime: 0,
    particleIn: 0,
    context: null,
    story: null,
    whenAwake,
    cancelStory: () => undefined,
    arrival: null,
    timer: undefined,
  };
}

// Waits for the fonts (or 800 ms) so the headline measures correctly, then builds the motion.
function startWhenReady(runtime: HeroRuntime): void {
  Promise.race([
    document.fonts.ready,
    new Promise<void>((resolve) => {
      runtime.timer = setTimeout(() => {
        resolve();
      }, ROUTE.loadingFallback);
    }),
  ]).then(() => {
    clearTimeout(runtime.timer);
    if (runtime.destroyed) {
      return;
    }
    runtime.ready = true;
    setup(runtime, true);
  });
}

// The hero's section API. The observers only redraw while the hero is on screen.
function observeHero(runtime: HeroRuntime): { disconnect(): void } {
  const resizer = new ResizeObserver(() => {
    if (runtime.ready) {
      resize(runtime);
    }
  });
  resizer.observe(runtime.stage);
  const visibility = new IntersectionObserver(([entry]) => {
    runtime.visible = entry.isIntersecting;
    if (runtime.visible) {
      wake(runtime);
    } else {
      stopFrame(runtime);
    }
  });
  visibility.observe(runtime.root);
  return {
    disconnect() {
      resizer.disconnect();
      visibility.disconnect();
    },
  };
}

// Mounts the hero on its section. Returns the section API that React calls on unmount. On the journey, whenAwake defers the
// scroll story to the visitor's first input.
export function mountHero(root: HTMLElement, whenAwake: WhenAwake | null = null): SectionApi {
  const abort = new AbortController();
  const runtime = createRuntime(root, abort, whenAwake);
  attachInput(runtime, abort.signal);
  const observers = observeHero(runtime);
  startWhenReady(runtime);
  return {
    get state() {
      return {
        motion: runtime.motion,
        ready: runtime.ready,
        progress: runtime.pose.open,
        trails: runtime.trails.length,
      };
    },
    destroy() {
      runtime.destroyed = true;
      runtime.navPrism.destroy();
      runtime.portrait.destroy();
      clearTimeout(runtime.timer);
      dispose(runtime);
      abort.abort();
      observers.disconnect();
      document.documentElement.classList.remove('hero-loading');
      root.classList.remove('is-enhanced', 'is-static', 'is-open');
      need<HTMLButtonElement>(root, '.open-system').hidden = true;
      need<HTMLButtonElement>(root, '.motion-control').hidden = true;
    },
  };
}
