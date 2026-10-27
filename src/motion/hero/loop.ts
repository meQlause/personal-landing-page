import { need } from '../dom';
import { CURSOR, ROUTE, TILT } from './constants';
import { drawCursor } from './cursor';
import { draw, drawParticles } from './particles';
import type { HeroRuntime } from './runtime';

// The hero's frame loop, the update that runs on every scroll step, and the teardown of its motion.

export const TEXT = {
  pause: 'Pause motion',
  enable: 'Enable motion',
  play: 'M8 5v14M16 5v14',
  still: 'M8 5l11 7-11 7Z',
  explore: 'Explore',
  back: 'Back',
  open: '+',
  close: '−',
};

export function wake(runtime: HeroRuntime): void {
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

export function stopFrame(runtime: HeroRuntime): void {
  cancelAnimationFrame(runtime.frame);
  runtime.frame = 0;
  runtime.lastTime = 0;
}

// The tilt follows the pointer on a spring. Returns the time step, which is capped so a stalled tab cannot jump.
function stepTime(runtime: HeroRuntime, time: number): number {
  const delta = Math.min(
    (time - (runtime.lastTime || time - TILT.fallbackFrame)) / TILT.msPerSecond,
    TILT.maxDelta,
  );
  runtime.lastTime = time;
  return delta;
}

function spinTilt(runtime: HeroRuntime, delta: number): void {
  const follow = 1 - Math.exp(-TILT.spring * delta);
  const { spin } = runtime;
  spin.x += (spin.targetX - spin.x) * follow;
  spin.y += (spin.targetY - spin.y) * follow;
  runtime.tilt.style.transform = `rotateX(${TILT.base.x + spin.y}deg) rotateY(${TILT.base.y + spin.x}deg) rotateZ(${TILT.base.z}deg)`;
}

function isTilting(runtime: HeroRuntime): boolean {
  const { spin } = runtime;
  return Math.abs(spin.targetX - spin.x) + Math.abs(spin.targetY - spin.y) > TILT.settle;
}

// Keeps the loop running while anything still moves: particles, the cursor, the trail or the tilt.
function keepRunning(runtime: HeroRuntime, reactive: boolean, cursorMoving: boolean): boolean {
  return reactive || cursorMoving || runtime.trails.length > 0 || isTilting(runtime);
}

function tick(runtime: HeroRuntime, time: number): void {
  runtime.frame = 0;
  if (runtime.destroyed || !runtime.motion || !runtime.visible || document.hidden) {
    return;
  }
  const delta = stepTime(runtime, time);
  spinTilt(runtime, delta);
  draw(runtime, time);
  const reactive = drawParticles(runtime, delta);
  const cursorMoving = drawCursor(runtime, 1 - Math.exp(-CURSOR.ringSpeed * delta));
  if (keepRunning(runtime, reactive, cursorMoving)) {
    wake(runtime);
  } else {
    runtime.lastTime = 0;
  }
}

function setPhase(runtime: HeroRuntime, next: number): void {
  if (next === runtime.phase) {
    return;
  }
  runtime.phase = next;
  runtime.railItems.forEach((item, index) => {
    item.classList.toggle('is-active', index === next);
    item.classList.toggle('is-done', index < next);
  });
  runtime.phaseTitles.forEach((title, index) => {
    title.classList.toggle('is-active', index === next);
  });
  runtime.root.classList.toggle('is-live', next === ROUTE.phaseLast);
}

// The portrait and the closing title follow the scroll position.
function syncPortrait(runtime: HeroRuntime): void {
  const { pose, root } = runtime;
  runtime.portrait.set(pose.portrait, runtime.motion);
  root.classList.toggle('is-portrait', pose.portrait > ROUTE.portraitFrom);
  need(root, '.portrait-scene').setAttribute(
    'aria-hidden',
    String(pose.portrait < ROUTE.portraitIdle),
  );
  need(root, '.closing-title').setAttribute(
    'aria-hidden',
    String(pose.open <= ROUTE.openFrom || pose.cover > ROUTE.portraitFrom),
  );
}

// The explore button reads "Explore" or "Back" according to whether the system is open.
function syncOpen(runtime: HeroRuntime, opened: boolean): void {
  const { root } = runtime;
  root.classList.toggle('is-open', opened);
  need(root, '.open-system').setAttribute('aria-expanded', String(opened));
  need(root, '.button-label').textContent = opened ? TEXT.back : TEXT.explore;
  need(root, '.button-symbol').textContent = opened ? TEXT.close : TEXT.open;
}

function dispatchHandoff(runtime: HeroRuntime): void {
  runtime.root.dispatchEvent(
    new CustomEvent('hero:handoff', {
      bubbles: true,
      detail: {
        material: 'layered-system',
        progress: runtime.pose.open,
        ready: runtime.pose.open > ROUTE.handoffReady,
      },
    }),
  );
}

// Everything the story shows, read back from the timeline's progress each time it moves.
export function update(runtime: HeroRuntime): void {
  const { pose } = runtime;
  syncPortrait(runtime);
  draw(runtime, performance.now());
  drawParticles(runtime, 0);
  if (pose.open < ROUTE.openBlend) {
    wake(runtime);
  }
  syncOpen(runtime, pose.open > ROUTE.openFrom);
  runtime.rail.style.setProperty(
    '--journey',
    Math.min(1, pose.journey / ROUTE.railSpan).toFixed(ROUTE.railDecimals),
  );
  setPhase(
    runtime,
    pose.journey > ROUTE.phaseFrom ? Math.min(ROUTE.phaseLast, Math.floor(pose.journey)) : -1,
  );
  dispatchHandoff(runtime);
}

// Ends the intro early: the wordmark completes its travel and the loading state is released. Never while the journey is
// still building behind the loading surface.
export function finishIntro(runtime: HeroRuntime): void {
  if (!runtime.built) {
    return;
  }
  runtime.arrival?.progress(1);
  runtime.root.classList.remove('wordmark-travelling');
  document.documentElement.classList.remove('hero-loading');
}

function resetPose(runtime: HeroRuntime): void {
  const { pose } = runtime;
  pose.open = 0;
  pose.travel = 0;
  pose.portrait = 0;
  pose.cover = 0;
  pose.journey = 0;
}

function resetSpin(runtime: HeroRuntime): void {
  const { spin } = runtime;
  spin.x = 0;
  spin.y = 0;
  spin.targetX = 0;
  spin.targetY = 0;
}

// Removes the hover state the cursor and the wordmark leave behind.
function clearHover(runtime: HeroRuntime): void {
  runtime.root.classList.remove(
    'has-cursor',
    'cursor-action',
    'cursor-down',
    'wordmark-travelling',
  );
  runtime.pointer.inside = false;
}

// Undoes everything the motion set up, so setup() can run again with a new viewport or motion setting.
// Drops the built motion: everything the context recorded.
function dropMotion(runtime: HeroRuntime): void {
  runtime.context?.revert();
  runtime.context = null;
  runtime.story = null;
  runtime.arrival = null;
}

export function dispose(runtime: HeroRuntime): void {
  const { root } = runtime;
  clearHover(runtime);
  stopFrame(runtime);
  dropMotion(runtime);
  runtime.trails.length = 0;
  resetPose(runtime);
  setPhase(runtime, -1);
  runtime.rail.style.removeProperty('--journey');
  runtime.portrait.set(0, false);
  root.classList.remove('is-portrait');
  resetSpin(runtime);
  runtime.tilt.style.removeProperty('transform');
}
