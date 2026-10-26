import { gsap, ScrollTrigger } from '../gsap';
import { EXPERIENCE, LAYOUT } from './constants';
import { type Row, STOP_ROWS } from './scenes';
import { roll } from './tickers';
import type { ExperienceRuntime } from './runtime';

// The Experience section's control: the scroll pin, the stop that is showing, the ruler's position and the year.

const { play, slide, paper, smooth: SMOOTH } = EXPERIENCE;

const POWER2_OUT = 'power2.out';
const EASE_OUT_POWER3 = 'power3.out';

const clamp = (value: number): number => Math.min(1, Math.max(0, value));
const smoothstep = (value: number): number => value * value * (SMOOTH.a - SMOOTH.b * value);

// Scroll → the stop, its scene progress, and the ruler's position (2.4 = 40% of the way from stop 2 to stop 3).
function read(
  runtime: ExperienceRuntime,
  progress: number,
): { index: number; scene: number; position: number } {
  const count = runtime.tabs.length;
  const scaled = progress * count;
  const index = Math.min(count - 1, Math.floor(scaled));
  const local = scaled - index;
  const ease = index < count - 1 ? smoothstep(clamp((local - (1 - slide)) / slide)) : 0;
  return { index, scene: clamp(local / play), position: index + ease };
}

// The ruler and the year follow a fractional stop position.
export function place(runtime: ExperienceRuntime, position: number): void {
  runtime.lastPosition = position;
  const count = runtime.tabs.length;
  const gap = runtime.tabs[1].offsetLeft - runtime.tabs[0].offsetLeft;
  const index = Math.min(count - 1, Math.floor(position));
  const share = position - index;
  const next = Math.min(count - 1, index + 1);
  runtime.tape.style.transform = `translateX(${(runtime.stage.clientWidth / LAYOUT.stageHalf - position * gap).toFixed(LAYOUT.decimals)}px)`;
  roll(runtime, runtime.years[index] + (runtime.years[next] - runtime.years[index]) * share);
}

// The paper colour while pinned; before that the section keeps the dark it inherits from Work. The page scrollbar follows.
function theme(runtime: ExperienceRuntime): void {
  const html = document.documentElement;
  const onPaper = !runtime.enabled || runtime.pinned;
  runtime.root.classList.toggle('is-paper', onPaper);
  if (onPaper) {
    html.dataset.palette = paper;
  } else if (html.dataset.palette === paper) {
    delete html.dataset.palette;
  }
}

// Adds one row to a stop's timeline.
function addRow(timeline: gsap.core.Timeline, row: Row): void {
  const target = row.target as gsap.TweenTarget;
  if (row.method === 'set') {
    timeline.set(target, row.vars, row.at);
  } else if (row.method === 'fromTo') {
    timeline.fromTo(target, row.from ?? {}, row.vars, row.at);
  } else if (row.method === 'from') {
    timeline.from(target, row.vars, row.at);
  } else {
    timeline.to(target, row.vars, row.at);
  }
}

// One stop's timeline: its rows, then the headline's mark drawn as the scene lands, then a short hold on the payoff.
function buildTimeline(runtime: ExperienceRuntime, index: number): gsap.core.Timeline {
  const scene = runtime.scenes[index];
  const stop = scene.getAttribute('data-stop') ?? '';
  const timeline = gsap.timeline({ paused: true, defaults: { ease: 'power2.inOut' } });
  for (const row of STOP_ROWS[stop](scene)) {
    addRow(timeline, row);
  }
  const marks = runtime.panels[index].querySelectorAll('.x-mark-art');
  timeline.fromTo(
    marks,
    { clipPath: 'inset(-50% 100% -50% 0%)' },
    { clipPath: 'inset(-50% 0% -50% 0%)', duration: EXPERIENCE.mark.draw, ease: 'power2.inOut' },
    Math.max(0, timeline.duration() - EXPERIENCE.mark.draw),
  );
  timeline.to({}, { duration: EXPERIENCE.mark.hold });
  return timeline;
}

// Plays the old stop out and the new one in. Each stop's panel stagger is set from its copy.
function switchStop(runtime: ExperienceRuntime, previous: number, next: number): void {
  const { scenes, timelines, enabled } = runtime;
  if (previous >= 0) {
    gsap.killTweensOf(timelines[previous]);
    if (enabled) {
      gsap.to(scenes[previous], { autoAlpha: 0, y: -16, duration: 0.3, overwrite: true });
    } else {
      gsap.set(scenes[previous], { autoAlpha: 0 });
    }
  }
  if (enabled) {
    gsap.fromTo(
      scenes[next],
      { autoAlpha: 0, y: 16 },
      { autoAlpha: 1, y: 0, duration: 0.45, ease: EASE_OUT_POWER3, overwrite: true },
    );
    gsap.from(runtime.panels[next].querySelectorAll('.x-period, .x-role, .x-org, .x-chips li'), {
      y: 18,
      autoAlpha: 0,
      duration: 0.5,
      stagger: 0.05,
      ease: EASE_OUT_POWER3,
    });
    gsap.fromTo(
      runtime.panels[next].querySelectorAll('.x-char'),
      { yPercent: 60, autoAlpha: 0, filter: 'blur(6px)' },
      {
        yPercent: 0,
        autoAlpha: 1,
        filter: 'blur(0px)',
        duration: 0.55,
        stagger: 0.022,
        ease: EASE_OUT_POWER3,
        overwrite: true,
      },
    );
  } else {
    gsap.set(scenes[next], { autoAlpha: 1 });
    timelines[next].progress(1);
    place(runtime, next);
  }
}

// Makes one stop the active one: its tab, panel, ticker and scene.
function activate(runtime: ExperienceRuntime, index: number): void {
  if (index === runtime.active) {
    return;
  }
  const previous = runtime.active;
  runtime.active = index;
  runtime.tabs.forEach((tab, position) => {
    tab.setAttribute('aria-selected', String(position === index));
    tab.tabIndex = position === index ? 0 : -1;
  });
  runtime.panels.forEach((panel, position) => {
    panel.hidden = position !== index;
  });
  runtime.tickers.forEach((ticker, position) => {
    ticker.classList.toggle('is-active', position === index);
  });
  const run = (): void => {
    switchStop(runtime, previous, index);
  };
  // Built inside the context's own setup the context is not stored yet, so the switch then runs directly.
  if (runtime.context) {
    runtime.context.add(run);
  } else {
    run();
  }
}

// Picks a flag: the page scrolls to that stop with its scene already played, before the ruler moves on.
export function pick(runtime: ExperienceRuntime, index: number): void {
  const pin = runtime.pin;
  if (pin) {
    runtime.pending = index;
    clearTimeout(runtime.pendingTimer);
    runtime.pendingTimer = setTimeout(() => {
      runtime.pending = null;
    }, EXPERIENCE.pick.debounce);
    const top =
      pin.start +
      ((pin.end - pin.start) * (index + play + EXPERIENCE.pick.lead)) / runtime.tabs.length;
    scrollTo({ top, behavior: 'smooth' });
  }
  activate(runtime, index);
  if (!pin) {
    place(runtime, index);
  }
}

// Scroll position → the stop that shows, its scene progress and the ruler.
function onScroll(runtime: ExperienceRuntime, progress: number): void {
  const pinnedNow = progress > 0;
  if (runtime.pinned !== pinnedNow) {
    runtime.pinned = pinnedNow;
    theme(runtime);
  }
  const reading = read(runtime, progress);
  place(runtime, reading.position);
  if (runtime.pending === null || reading.index === runtime.pending) {
    runtime.pending = null;
    activate(runtime, reading.index);
  }
  gsap.to(runtime.timelines[runtime.active], {
    progress: runtime.active === reading.index ? reading.scene : 1,
    duration: 0.35,
    ease: POWER2_OUT,
    overwrite: true,
  });
}

function createPin(runtime: ExperienceRuntime): ScrollTrigger {
  return ScrollTrigger.create({
    trigger: runtime.root,
    pin: runtime.stage,
    start: 'top top',
    end: () =>
      `+=${innerHeight * (runtime.small.matches ? EXPERIENCE.pin.heightMobile : EXPERIENCE.pin.heightDesktop)}`,
    invalidateOnRefresh: true,
    refreshPriority: EXPERIENCE.pin.refresh,
    onUpdate: (self) => {
      onScroll(runtime, self.progress);
    },
  });
}

// Undoes everything the section set up, so setup() can run again with a new viewport or motion setting.
export function dispose(runtime: ExperienceRuntime): void {
  runtime.context?.revert();
  runtime.context = null;
  runtime.pin = null;
  runtime.timelines = [];
  runtime.active = -1;
  runtime.pending = null;
  runtime.pinned = false;
  clearTimeout(runtime.pendingTimer);
  runtime.root.classList.remove('is-paper');
  if (document.documentElement.dataset.palette === paper) {
    delete document.documentElement.dataset.palette;
  }
}

// Builds the section's motion for the current viewport and motion setting.
export function setup(runtime: ExperienceRuntime): void {
  dispose(runtime);
  runtime.enabled = runtime.motion;
  runtime.navPrism.setMotion(runtime.enabled);
  runtime.root.classList.toggle('is-enhanced', runtime.enabled);
  runtime.root.classList.toggle('is-static', !runtime.enabled);
  runtime.context = gsap.context(() => {
    runtime.timelines = runtime.scenes.map((_scene, index) => buildTimeline(runtime, index));
    gsap.set(runtime.scenes, { autoAlpha: 0 });
    if (runtime.enabled) {
      runtime.pin = createPin(runtime);
    }
  }, runtime.root);
  activate(runtime, 0);
  place(runtime, 0);
  theme(runtime);
  if (runtime.enabled) {
    ScrollTrigger.refresh();
  } else {
    runtime.timelines[0].progress(1);
  }
}
