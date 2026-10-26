import { pick, setup } from './control';
import type { ExperienceRuntime } from './runtime';

// The Experience section's keyboard and control input. Each listener is removed when the section unmounts (its AbortSignal).

const STEP_KEYS: Record<string, number> = {
  ArrowRight: 1,
  ArrowDown: 1,
  ArrowLeft: -1,
  ArrowUp: -1,
};

// The flag a key moves to, or undefined when the key does nothing here.
function keyTarget(runtime: ExperienceRuntime, key: string, index: number): number | undefined {
  const last = runtime.tabs.length - 1;
  if (key === 'Home') {
    return 0;
  }
  if (key === 'End') {
    return last;
  }
  return key in STEP_KEYS ? index + STEP_KEYS[key] : undefined;
}

// Arrow keys, Home and End move along the ruler and select the stop they reach.
function onTapeKey(runtime: ExperienceRuntime, event: KeyboardEvent): void {
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
  runtime.tabs[wrapped].focus({ preventScroll: true });
  pick(runtime, wrapped);
}

// Attaches every listener of the section to the signal, so one abort removes them all.
export function attachInput(runtime: ExperienceRuntime, signal: AbortSignal): void {
  runtime.tabs.forEach((tab, index) => {
    tab.addEventListener(
      'click',
      () => {
        pick(runtime, index);
      },
      { signal },
    );
  });
  runtime.tape.addEventListener(
    'keydown',
    (event) => {
      onTapeKey(runtime, event);
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
}
