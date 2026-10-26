import { need } from '../dom';
import { FROST, ROUTE, TILT } from './constants';
import { drawCursor } from './cursor';
import { finishIntro, stopFrame, wake } from './loop';
import type { HeroRuntime, Point } from './runtime';
import { open, setup } from './setup';

// The hero's pointer, keyboard and control input. Each listener is removed when the section unmounts (its AbortSignal).

const FIELD_SELECTOR = 'input,textarea,select,[contenteditable]';
const SCROLL_NEAR_TOP = 1;
const EDGE_SLACK = 1;
const ESCAPE = 'Escape';
const HALF = 0.5;
const HAS_CURSOR = 'has-cursor';
const CURSOR_ACTION = 'cursor-action';
const CURSOR_DOWN = 'cursor-down';
const LINK_SELECTOR = 'a,button';

function targetOf(event: Event): Element | null {
  return event.target instanceof Element ? event.target : null;
}

function isLoading(): boolean {
  return document.documentElement.classList.contains('hero-loading');
}

// The hero's own cursor: a dot that follows the pointer over the stage, and the cursor's ring.
function hoverCursor(runtime: HeroRuntime, event: PointerEvent): void {
  const { stage, root, pointer, ring } = runtime;
  const bounds = stage.getBoundingClientRect();
  pointer.x = event.clientX - bounds.left;
  pointer.y = event.clientY - bounds.top;
  if (!pointer.inside) {
    ring.x = pointer.x;
    ring.y = pointer.y;
  }
  pointer.inside = true;
  root.classList.add(HAS_CURSOR);
  root.classList.toggle(CURSOR_ACTION, Boolean(targetOf(event)?.closest(LINK_SELECTOR)));
  drawCursor(runtime, 0);
  wake(runtime);
}

// The system tilts toward the pointer, and the cursor leaves a trail behind it.
function tiltAndTrail(runtime: HeroRuntime, event: PointerEvent): void {
  const { stage, spin } = runtime;
  const bounds = stage.getBoundingClientRect();
  const posX = event.clientX - bounds.left;
  const posY = event.clientY - bounds.top;
  spin.targetX = (posX / runtime.w - HALF) * TILT.pointerX;
  spin.targetY = (HALF - posY / runtime.h) * TILT.pointerY;
  if (targetOf(event)?.closest('a,button,header,footer')) {
    runtime.lastPoint = null;
    return;
  }
  trail(runtime, { x: posX, y: posY, t: performance.now() });
  wake(runtime);
}

// Adds a point to the cursor's trail, starts a new trail after a pause, and keeps the trail short.
function trail(runtime: HeroRuntime, point: Point): void {
  const { trails } = runtime;
  const last = runtime.lastPoint;
  if (!last || point.t - last.t > FROST.trailGap) {
    trails.length = 0;
  }
  if (!last || Math.hypot(point.x - last.x, point.y - last.y) > FROST.trailSpacing) {
    trails.push(point);
    runtime.lastPoint = point;
  }
  while (
    trails.length > FROST.trailMinPoints &&
    (trails.length > FROST.trailMax || point.t - trails[0].t > FROST.trailLifetime)
  ) {
    trails.shift();
  }
}

// The pointer is live when the motion runs, the story is built, it is not touch and the intro has finished.
function isLivePointer(runtime: HeroRuntime, event: PointerEvent): boolean {
  return runtime.motion && runtime.story !== null && event.pointerType !== 'touch' && !isLoading();
}

function onStageMove(runtime: HeroRuntime, event: PointerEvent): void {
  if (isLivePointer(runtime, event) && runtime.fine.matches) {
    hoverCursor(runtime, event);
  }
  if (isLivePointer(runtime, event) && runtime.pose.open <= ROUTE.pointerLimit) {
    tiltAndTrail(runtime, event);
  }
}

function onStageLeave(runtime: HeroRuntime): void {
  runtime.pointer.inside = false;
  runtime.root.classList.remove(HAS_CURSOR, CURSOR_ACTION, CURSOR_DOWN);
  runtime.lastPoint = null;
  runtime.spin.targetX = 0;
  runtime.spin.targetY = 0;
  wake(runtime);
}

// Escape, with the hero on screen and nothing being typed into, ends the intro and returns to the top of the story.
// True when the hero fills the screen and the key is an Escape that is not typed into a field.
function isEscapeOnHero(runtime: HeroRuntime, event: KeyboardEvent): boolean {
  const bounds = runtime.stage.getBoundingClientRect();
  const onScreen = bounds.top <= SCROLL_NEAR_TOP && bounds.bottom >= innerHeight - EDGE_SLACK;
  const typing = targetOf(event)?.closest(FIELD_SELECTOR);
  return event.key === ESCAPE && !event.defaultPrevented && !typing && onScreen;
}

function onEscape(runtime: HeroRuntime, event: KeyboardEvent): void {
  if (!isEscapeOnHero(runtime, event)) {
    return;
  }
  finishIntro(runtime);
  if (runtime.story && runtime.pose.open > ROUTE.escapeOpen) {
    scrollTo({
      top: runtime.story.scrollTrigger?.start ?? 0,
      behavior: runtime.motion ? 'smooth' : 'instant',
    });
  }
}

function attachStage(runtime: HeroRuntime, signal: AbortSignal): void {
  const { stage, root } = runtime;
  stage.addEventListener(
    'pointermove',
    (event) => {
      onStageMove(runtime, event);
    },
    { passive: true, signal },
  );
  stage.addEventListener(
    'pointerleave',
    () => {
      onStageLeave(runtime);
    },
    { signal },
  );
  stage.addEventListener(
    'pointerdown',
    () => {
      root.classList.add(CURSOR_DOWN);
    },
    { signal },
  );
  stage.addEventListener(
    'pointercancel',
    () => {
      root.classList.remove(CURSOR_DOWN);
    },
    { signal },
  );
  stage.addEventListener(
    'wheel',
    () => {
      finishIntro(runtime);
    },
    { passive: true, signal },
  );
  stage.addEventListener(
    'touchstart',
    () => {
      finishIntro(runtime);
    },
    { passive: true, signal },
  );
  stage.addEventListener(
    'click',
    (event) => {
      const target = targetOf(event);
      if (!target?.closest('a,button,.portrait-scene')) {
        open(runtime);
      }
    },
    { signal },
  );
}

// The motion control pauses or resumes the motion and keeps the view where it is.
function toggleMotion(runtime: HeroRuntime): void {
  const top = runtime.root.getBoundingClientRect().top + scrollY;
  runtime.motion = !runtime.motion;
  setup(runtime);
  scrollTo({ top, behavior: 'instant' });
}

function attachControls(runtime: HeroRuntime, signal: AbortSignal): void {
  const { root } = runtime;
  window.addEventListener(
    'pointerup',
    () => {
      root.classList.remove(CURSOR_DOWN);
    },
    { signal },
  );
  runtime.fine.addEventListener(
    'change',
    () => {
      runtime.pointer.inside = false;
      root.classList.remove(HAS_CURSOR);
      wake(runtime);
    },
    { signal },
  );
  root.addEventListener(
    'focusin',
    () => {
      if (runtime.arrival?.isActive()) {
        finishIntro(runtime);
      }
    },
    { signal },
  );
  need(root, '.open-system').addEventListener(
    'click',
    () => {
      open(runtime);
    },
    { signal },
  );
  need(root, '.motion-control').addEventListener(
    'click',
    () => {
      toggleMotion(runtime);
    },
    { signal },
  );
  need(root, '.hero-brand').addEventListener(
    'click',
    (event) => {
      event.preventDefault();
      const top = root.getBoundingClientRect().top + scrollY;
      scrollTo({ top, behavior: runtime.motion ? 'smooth' : 'instant' });
    },
    { signal },
  );
}

function attachDocument(runtime: HeroRuntime, signal: AbortSignal): void {
  document.addEventListener(
    'keydown',
    (event) => {
      onEscape(runtime, event);
    },
    { signal },
  );
  document.addEventListener(
    'visibilitychange',
    () => {
      if (document.hidden) {
        runtime.pointer.inside = false;
        runtime.root.classList.remove(HAS_CURSOR, CURSOR_ACTION, CURSOR_DOWN);
        stopFrame(runtime);
      } else {
        wake(runtime);
      }
    },
    { signal },
  );
  runtime.reduced.addEventListener(
    'change',
    () => {
      runtime.motion = !runtime.reduced.matches;
      if (runtime.ready) {
        setup(runtime);
      }
    },
    { signal },
  );
  runtime.small.addEventListener(
    'change',
    () => {
      if (runtime.ready) {
        setup(runtime);
      }
    },
    { signal },
  );
}

// Attaches every listener of the hero to the signal, so one abort removes them all.
export function attachInput(runtime: HeroRuntime, signal: AbortSignal): void {
  attachStage(runtime, signal);
  attachControls(runtime, signal);
  attachDocument(runtime, signal);
}
