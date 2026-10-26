import { pick, setup, wake } from './control';
import type { WorkRuntime } from './runtime';

// The Work section's pointer and keyboard input. Each listener is removed when the section unmounts (its AbortSignal).

const STEP_KEYS: Record<string, number> = {
  ArrowRight: 1,
  ArrowDown: 1,
  ArrowLeft: -1,
  ArrowUp: -1,
};

// The tab a key moves to, or undefined when the key does nothing here.
function keyTarget(runtime: WorkRuntime, key: string, index: number): number | undefined {
  const last = runtime.tabs.length - 1;
  if (key === 'Home') {
    return 0;
  }
  if (key === 'End') {
    return last;
  }
  return key in STEP_KEYS ? index + STEP_KEYS[key] : undefined;
}

// Arrow keys, Home and End move between the tabs and select the product they reach.
function onTabKey(runtime: WorkRuntime, event: KeyboardEvent): void {
  const index = runtime.tabs.indexOf(document.activeElement as HTMLButtonElement);
  if (index < 0) {
    return;
  }
  const next = keyTarget(runtime, event.key, index);
  if (next === undefined) {
    return;
  }
  event.preventDefault();
  const wrapped = (next + runtime.tabs.length) % runtime.tabs.length;
  runtime.tabs[wrapped].focus();
  pick(runtime, wrapped);
}

// The cursor is tracked over the stage for the springs. Touch and coarse pointers do not move the scene.
function onStageMove(runtime: WorkRuntime, event: PointerEvent): void {
  if (event.pointerType === 'touch' || !runtime.fine.matches) {
    return;
  }
  runtime.pointer.cx = event.clientX;
  runtime.pointer.cy = event.clientY;
  runtime.pointer.inside = true;
  wake(runtime);
}

// Attaches every listener of the section to the signal, so one abort removes them all.
export function attachInput(runtime: WorkRuntime, signal: AbortSignal): void {
  const { root, stage } = runtime;
  runtime.tabs.forEach((tab, index) => {
    tab.addEventListener(
      'click',
      () => {
        pick(runtime, index);
      },
      { signal },
    );
  });
  root.querySelector('.work-tabs')?.addEventListener(
    'keydown',
    (event) => {
      onTabKey(runtime, event as KeyboardEvent);
    },
    { signal },
  );
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
      runtime.pointer.inside = false;
    },
    { signal },
  );
  runtime.reduced.addEventListener(
    'change',
    () => {
      runtime.motion = !runtime.reduced.matches;
      setup(runtime);
    },
    { signal },
  );
  runtime.small.addEventListener(
    'change',
    () => {
      setup(runtime);
    },
    { signal },
  );
  document.addEventListener(
    'visibilitychange',
    () => {
      if (document.hidden) {
        cancelAnimationFrame(runtime.frame);
        runtime.frame = 0;
        runtime.last = 0;
      } else {
        wake(runtime);
      }
    },
    { signal },
  );
}
