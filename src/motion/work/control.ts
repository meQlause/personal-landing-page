import { gsap, ScrollTrigger } from '../gsap';
import { WORK } from './constants';
import { theme } from './palette';
import { drawThread, previewSwap, setPool, springs } from './scenes';
import type { WorkRuntime } from './runtime';
import { buildTimeline } from './timelines';

// The Work section's control: the scroll pin, the scene that is showing, the tabs, and the frame loop that moves the scene.

// How far a product has played (0 to 1) at the current scroll position. Products that are not showing hold at the end.
function scrubbed(runtime: WorkRuntime, index: number): number {
  if (!runtime.enabled) {
    return 1;
  }
  const along = (runtime.scrollProgress * WORK.scrub.segments - index) / WORK.scrub.playFor;
  return Math.min(1, Math.max(0, along));
}

export function wake(runtime: WorkRuntime): void {
  if (
    !runtime.frame &&
    runtime.motion &&
    runtime.visible &&
    !document.hidden &&
    !runtime.destroyed
  ) {
    runtime.frame = requestAnimationFrame((time) => {
      tick(runtime, time);
    });
  }
}

function tick(runtime: WorkRuntime, time: number): void {
  runtime.frame = 0;
  if (runtime.destroyed || !runtime.motion || !runtime.visible || document.hidden) {
    return;
  }
  const delta = Math.min(
    (time - (runtime.last || time - WORK.tick.fallbackFrame)) / WORK.tick.msPerSecond,
    WORK.tick.maxDelta,
  );
  runtime.last = time;
  springs(runtime, delta);
  const name = runtime.products[runtime.active];
  if (name === 'simpul') {
    drawThread(runtime, delta);
  }
  if (name === 'qswap') {
    previewSwap(runtime);
  }
  wake(runtime);
}

function syncTabs(runtime: WorkRuntime, index: number): void {
  runtime.tabs.forEach((tab, position) => {
    tab.setAttribute('aria-selected', String(position === index));
    tab.tabIndex = position === index ? 0 : -1;
  });
  // On phones the tabs scroll sideways: keep the active one in view without moving the page.
  const row = runtime.tabs[index].parentElement;
  if (row && row.scrollWidth > row.clientWidth) {
    row.scrollTo({
      left: runtime.tabs[index].offsetLeft - WORK.tabStep,
      behavior: runtime.enabled ? 'smooth' : 'auto',
    });
  }
}

// Plays the old scene out and the new one in, and starts the new product's timeline where the scroll says.
function switchScene(runtime: WorkRuntime, previous: number, next: number, play: boolean): void {
  const { scenes, timelines, enabled } = runtime;
  if (previous >= 0) {
    gsap.killTweensOf(timelines[previous]);
    if (enabled) {
      gsap.to(scenes[previous], {
        autoAlpha: 0,
        x: -WORK.tabStep,
        duration: WORK.arrival.fade,
        overwrite: true,
      });
    } else {
      gsap.set(scenes[previous], { autoAlpha: 0 });
    }
  }
  if (enabled) {
    gsap.fromTo(
      scenes[next],
      { autoAlpha: 0, x: WORK.tabStep },
      { autoAlpha: 1, x: 0, duration: 0.45, ease: 'power3.out', overwrite: true },
    );
    gsap.from(runtime.panels[next].querySelector('.work-headline'), {
      yPercent: 25,
      autoAlpha: 0,
      duration: 0.5,
      ease: 'power3.out',
    });
    timelines[next].progress(play ? scrubbed(runtime, next) : 0);
  } else {
    gsap.set(scenes[next], { autoAlpha: 1 });
    timelines[next].progress(1);
  }
}

// Makes one product the active one: its tab, panel, palette and scene.
function activate(runtime: WorkRuntime, index: number, play = true): void {
  if (index === runtime.active) {
    return;
  }
  const previous = runtime.active;
  runtime.active = index;
  syncTabs(runtime, index);
  runtime.panels.forEach((panel, position) => {
    panel.hidden = position !== index;
  });
  theme(runtime);
  // Built inside the context's own setup the context is not stored yet, so the switch then runs directly.
  const run = (): void => {
    switchScene(runtime, previous, index, play);
  };
  if (runtime.context) {
    runtime.context.add(run);
  } else {
    run();
  }
  wake(runtime);
}

// Selects a product from a tab: the page scrolls to its part of the pin, and the tab is shown straight away.
export function pick(runtime: WorkRuntime, index: number): void {
  const pin = runtime.pin;
  if (pin) {
    runtime.pending = index;
    clearTimeout(runtime.pendingTimer);
    runtime.pendingTimer = setTimeout(() => {
      runtime.pending = null;
    }, WORK.scrub.pinnedFor);
    const top =
      pin.start + ((pin.end - pin.start) * (index + WORK.scrub.lead)) / WORK.scrub.segments;
    scrollTo({ top, behavior: 'smooth' });
  }
  activate(runtime, index);
}

// Scroll position → the segment that is showing, the tab's fill, and the scrub of the active product.
function onScroll(runtime: WorkRuntime, progress: number): void {
  runtime.scrollProgress = progress;
  const pinnedNow = progress > 0;
  if (runtime.pinned !== pinnedNow) {
    runtime.pinned = pinnedNow;
    theme(runtime);
  }
  const position = runtime.scrollProgress * WORK.scrub.segments;
  const index = Math.min(WORK.scrub.segments - 1, Math.floor(position));
  runtime.tabs[index].style.setProperty(
    '--seg',
    Math.min(1, position - index).toFixed(WORK.fillDecimals),
  );
  if (runtime.pending === null || index === runtime.pending) {
    runtime.pending = null;
    activate(runtime, index);
  }
  gsap.to(runtime.timelines[runtime.active], {
    progress: scrubbed(runtime, runtime.active),
    duration: WORK.scrub.tween,
    ease: 'power2.out',
    overwrite: true,
  });
}

function createPin(runtime: WorkRuntime): ScrollTrigger {
  return ScrollTrigger.create({
    trigger: runtime.root,
    pin: runtime.stage,
    start: 'top top',
    end: () =>
      `+=${innerHeight * (runtime.small.matches ? WORK.pin.heightMobile : WORK.pin.heightDesktop)}`,
    invalidateOnRefresh: true,
    refreshPriority: WORK.pin.refresh,
    onUpdate: (self) => {
      onScroll(runtime, self.progress);
    },
  });
}

// The chat noise drops in from above while the hero leaves, so the Simpul knot is already falling into place.
function arrival(runtime: WorkRuntime): void {
  const config = WORK.arrival;
  gsap
    .timeline({
      scrollTrigger: {
        trigger: runtime.root,
        start: 'top bottom',
        end: 'top top',
        scrub: config.scrub,
        refreshPriority: WORK.pin.refresh,
      },
    })
    .from(
      '.chip',
      {
        y: `-=${config.lift}`,
        rotation: `+=${config.spin}`,
        stagger: config.stagger,
        ease: config.ease,
      },
      0,
    )
    .from('.s-carrier', { autoAlpha: 0, duration: config.duration }, config.carrierAt);
}

function build(runtime: WorkRuntime): void {
  runtime.timelines = runtime.products.map((name) => buildTimeline(runtime, name));
  gsap.set(runtime.scenes, { autoAlpha: 0 });
  if (!runtime.enabled) {
    return;
  }
  arrival(runtime);
  runtime.pin = createPin(runtime);
}

// Undoes everything the section set up, so setup() can run again with a new viewport or motion setting.
export function dispose(runtime: WorkRuntime): void {
  cancelAnimationFrame(runtime.frame);
  runtime.frame = 0;
  runtime.context?.revert();
  runtime.context = null;
  runtime.pin = null;
  runtime.timelines = [];
  runtime.scrollProgress = 0;
  runtime.pinned = false;
  clearTimeout(runtime.themeTimer);
  delete runtime.root.dataset.product;
  delete document.documentElement.dataset.palette;
  runtime.active = -1;
  runtime.pending = null;
  clearTimeout(runtime.pendingTimer);
  resetScene(runtime);
}

// Puts the scene's own state back to the start: the thread, the pool, the springs and the drops.
function resetScene(runtime: WorkRuntime): void {
  runtime.thread.untie = 0;
  runtime.thread.bead = 100;
  runtime.routeFor = -1;
  runtime.quartz.u = 0;
  setPool(runtime);
  runtime.agaroCount.textContent = String(WORK.count);
  const { sway } = runtime;
  for (const values of [sway.x, sway.y, sway.vx, sway.vy]) {
    values.fill(0);
  }
  resetReactors(runtime);
  runtime.root.querySelectorAll<SVGElement>('.a-drops circle').forEach((circle) => {
    circle.style.opacity = '0';
  });
}

function resetReactors(runtime: WorkRuntime): void {
  for (const reactor of runtime.reactors) {
    reactor.ox = 0;
    reactor.oy = 0;
    reactor.vx = 0;
    reactor.vy = 0;
    reactor.transform = '';
    reactor.el.removeAttribute('transform');
  }
}

// Builds the section's motion for the current viewport and motion setting.
export function setup(runtime: WorkRuntime): void {
  dispose(runtime);
  runtime.enabled = runtime.motion;
  runtime.navPrism.setMotion(runtime.enabled);
  runtime.root.classList.toggle('is-enhanced', runtime.enabled);
  runtime.root.classList.toggle('is-static', !runtime.enabled);
  runtime.context = gsap.context(() => {
    build(runtime);
  }, runtime.root);
  activate(runtime, 0, false);
  if (!runtime.enabled) {
    runtime.timelines[0].progress(1);
  }
  drawThread(runtime, 0);
  if (runtime.enabled) {
    ScrollTrigger.refresh();
    wake(runtime);
  }
}
