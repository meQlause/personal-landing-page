import { gsap, ScrollTrigger } from '../gsap';
import { EDUCATION, STATES } from './constants';
import { buildDeal } from './deck';
import { buildPanel } from './panels';
import type { EducationRuntime } from './runtime';

// The Education section's control: the pin, the panel that is showing, the seals and the certificates by scroll.

const FLIPPED = EDUCATION.flipped;
const CLAMP_MIN = 0;
const CLAMP_MAX = 1;
const PIN_TARGET_AFTER_SCHOOL = EDUCATION.pick.school;
const PIN_TARGET_AFTER_CERTS = EDUCATION.pick.certificates;

const clamp = (value: number): number => Math.min(CLAMP_MAX, Math.max(CLAMP_MIN, value));

// The state through the whole section: which panel shows, its place in the scroll, and its progress through itself.
function read(
  runtime: EducationRuntime,
  progress: number,
): { index: number; scroll: number; local: number } {
  const scroll = progress * runtime.total;
  let index = 0;
  runtime.starts.forEach((start, position) => {
    if (scroll >= start) {
      index = position;
    }
  });
  const local = clamp((scroll - runtime.starts[index]) / runtime.units[index]);
  return { index, scroll, local };
}

// The night colour while pinned; before that the section keeps the paper it inherits from Experience.
function theme(runtime: EducationRuntime): void {
  const html = document.documentElement;
  const night = !runtime.enabled || runtime.pinned;
  runtime.root.classList.toggle('is-night', night);
  if (night) {
    html.dataset.palette = EDUCATION.nightPalette;
  } else if (html.dataset.palette === EDUCATION.nightPalette) {
    delete html.dataset.palette;
  }
}

// Seals, stamps and the deck by scroll: each fades and settles in over the first quarter of its panel's first state, and
// out over the end of its last, so panels hand over without a timed swap. The first seal is already there on arrival.
// How far a seal has faded in: the first is already there; the others fade in over a quarter of their first state.
function fadeIn(index: number, along: number): number {
  return index ? clamp(along / EDUCATION.seal.cross) : 1;
}

// Seals, stamps and the deck by scroll: each fades and settles in over the first quarter of its panel's first state, and out
// over the end of its last, so panels hand over without a timed swap. The first seal is already there on arrival.
function crossfade(runtime: EducationRuntime, scroll: number): void {
  const { seal, stamp } = EDUCATION;
  runtime.seals.forEach((element, index) => {
    const along = scroll - runtime.starts[index];
    const outside = along < 0 || along > STATES;
    const alpha = outside ? 0 : Math.min(fadeIn(index, along), clamp((STATES - along) / seal.end));
    gsap.set(element, {
      autoAlpha: alpha,
      scale: seal.scale + seal.grow * alpha,
      rotation: (1 - alpha) * seal.tilt,
      svgOrigin: seal.origin,
    });
    const stampEl = element.querySelector('.c-stamp');
    if (stampEl) {
      gsap.set(stampEl, {
        scale: clamp((along - stamp.from) / stamp.span),
        rotation: stamp.tilt,
        transformOrigin: '50% 50%',
      });
    }
  });
  gsap.set(runtime.deck, {
    autoAlpha: clamp((scroll - runtime.starts[runtime.certificates]) / EDUCATION.deck.fade),
  });
}

// Makes one panel the active one. Without motion the seals and the deck simply switch; with motion they cross-fade by scroll.
function activate(runtime: EducationRuntime, index: number): void {
  if (index === runtime.active) {
    return;
  }
  runtime.active = index;
  runtime.tabs.forEach((tab, position) => {
    tab.setAttribute('aria-selected', String(position === index));
    tab.tabIndex = position === index ? 0 : -1;
  });
  runtime.panels.forEach((panel, position) => {
    panel.hidden = position !== index;
  });
  const row = runtime.tabs[index].parentElement;
  if (row && row.scrollWidth > row.clientWidth) {
    row.scrollTo({
      left: runtime.tabs[index].offsetLeft - EDUCATION.tab.offset,
      behavior: runtime.enabled ? EDUCATION.smooth : 'auto',
    });
  }
  if (!runtime.enabled) {
    showStatic(runtime, index);
  }
}

// The seals and the deck, switched without motion: only the active panel's seal shows, and the deck only on certificates.
function showStatic(runtime: EducationRuntime, index: number): void {
  const run = (): void => {
    gsap.set(runtime.seals, { autoAlpha: 0 });
    if (index !== runtime.certificates) {
      gsap.set(runtime.seals[index], { autoAlpha: 1 });
    }
    gsap.set(runtime.deck, { autoAlpha: index === runtime.certificates ? 1 : 0 });
  };
  if (runtime.context) {
    runtime.context.add(run);
  } else {
    run();
  }
}

// Picks a panel from a tab: the page scrolls to the end of that panel's first state (settled and drawn).
export function pick(runtime: EducationRuntime, index: number): void {
  const pin = runtime.pin;
  if (pin) {
    runtime.pending = index;
    clearTimeout(runtime.pendingTimer);
    runtime.pendingTimer = setTimeout(() => {
      runtime.pending = null;
    }, EDUCATION.pick.debounce);
    const lead = index === runtime.certificates ? PIN_TARGET_AFTER_CERTS : PIN_TARGET_AFTER_SCHOOL;
    const top =
      pin.start + ((pin.end - pin.start) * (runtime.starts[index] + lead)) / runtime.total;
    scrollTo({ top, behavior: 'smooth' });
  }
  activate(runtime, index);
}

// Scroll position → the panel, the turning of the seals, the landing of the deck, and the progress of the panel.
function onScroll(runtime: EducationRuntime, progress: number): void {
  const pinnedNow = progress > 0;
  if (runtime.pinned !== pinnedNow) {
    runtime.pinned = pinnedNow;
    theme(runtime);
  }
  const reading = read(runtime, progress);
  runtime.turns.forEach((turn) => {
    turn.setAttribute(
      'transform',
      `rotate(${(reading.scroll * EDUCATION.spin).toFixed(2)} 300 270)`,
    );
  });
  if (runtime.pending === null || reading.index === runtime.pending) {
    runtime.pending = null;
    activate(runtime, reading.index);
  }
  runtime.deal?.progress(
    clamp((reading.scroll - runtime.starts[runtime.certificates]) / EDUCATION.hold.to),
  );
  runtime.marks[reading.index]?.progress(
    Math.max(reading.local, reading.index === 0 ? FLIPPED / STATES : 0),
  );
  crossfade(runtime, reading.scroll);
}

function createPin(runtime: EducationRuntime): ScrollTrigger {
  const pinHeight = runtime.small.matches
    ? EDUCATION.pin.heightMobile
    : EDUCATION.pin.heightDesktop;
  return ScrollTrigger.create({
    trigger: runtime.root,
    pin: runtime.stage,
    start: 'top top',
    end: () => `+=${innerHeight * runtime.total * pinHeight}`,
    invalidateOnRefresh: true,
    refreshPriority: EDUCATION.pin.refresh,
    onUpdate: (self) => {
      onScroll(runtime, self.progress);
    },
  });
}

// Undoes everything the section set up, so setup() can run again with a new viewport or motion setting.
export function dispose(runtime: EducationRuntime): void {
  runtime.context?.revert();
  runtime.marks = [];
  runtime.context = null;
  runtime.pin = null;
  runtime.deal = null;
  runtime.lean = null;
  runtime.active = -1;
  runtime.pending = null;
  runtime.pinned = false;
  clearTimeout(runtime.pendingTimer);
  runtime.root.classList.remove('is-night');
  if (document.documentElement.dataset.palette === EDUCATION.nightPalette) {
    delete document.documentElement.dataset.palette;
  }
}

// Builds the section's motion for the current viewport and motion setting.
export function setup(runtime: EducationRuntime): void {
  dispose(runtime);
  runtime.enabled = runtime.motion;
  runtime.navPrism.setMotion(runtime.enabled);
  runtime.root.classList.toggle('is-enhanced', runtime.enabled);
  runtime.root.classList.toggle('is-static', !runtime.enabled);
  runtime.context = gsap.context(() => {
    runtime.deal = runtime.enabled ? buildDeal(runtime) : null;
    runtime.marks = runtime.enabled
      ? runtime.panels.map((_panel, index) => buildPanel(runtime, index))
      : [];
    runtime.marks[0]?.progress(FLIPPED / STATES);
    gsap.set(runtime.seals, { autoAlpha: 0 });
    gsap.set(runtime.deck, { autoAlpha: 0 });
    if (runtime.enabled) {
      attachLean(runtime);
      runtime.pin = createPin(runtime);
    }
  }, runtime.root);
  activate(runtime, 0);
  theme(runtime);
  if (runtime.enabled) {
    crossfade(runtime, 0);
    runtime.deal?.progress(0);
    ScrollTrigger.refresh();
  }
}

// The board leans a few degrees toward the pointer, on fine pointers only.
function attachLean(runtime: EducationRuntime): void {
  if (!runtime.fine.matches) {
    return;
  }
  gsap.set(runtime.deck, { transformPerspective: EDUCATION.deck.perspective });
  runtime.lean = {
    x: gsap.quickTo(runtime.deck, 'rotationY', {
      duration: EDUCATION.deck.lean.duration,
      ease: EDUCATION.deck.lean.ease,
    }),
    y: gsap.quickTo(runtime.deck, 'rotationX', {
      duration: EDUCATION.deck.lean.duration,
      ease: EDUCATION.deck.lean.ease,
    }),
  };
}
