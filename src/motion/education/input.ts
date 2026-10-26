import { pick, setup } from './control';
import { describe, open } from './deck';
import type { EducationRuntime } from './runtime';

// The Education section's pointer, keyboard and control input. Each listener is removed when the section unmounts.

const TILT = { x: 8, y: 6 } as const;
const HALF = 0.5;
const STEP_KEYS: Record<string, number> = {
  ArrowRight: 1,
  ArrowDown: 1,
  ArrowLeft: -1,
  ArrowUp: -1,
};

// The tab a key moves to, or undefined when the key does nothing here.
function keyTarget(runtime: EducationRuntime, key: string, index: number): number | undefined {
  if (key === 'Home') {
    return 0;
  }
  if (key === 'End') {
    return runtime.certificates;
  }
  return key in STEP_KEYS ? index + STEP_KEYS[key] : undefined;
}

// Arrow keys, Home and End move along the tabs and select the panel they reach.
function onTabKey(runtime: EducationRuntime, event: KeyboardEvent): void {
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

// The board leans toward the pointer: the offset from its centre, in degrees.
function onDeckMove(runtime: EducationRuntime, event: PointerEvent): void {
  if (!runtime.lean) {
    return;
  }
  const bounds = runtime.deck.getBoundingClientRect();
  runtime.lean.x(((event.clientX - bounds.left) / bounds.width - HALF) * TILT.x);
  runtime.lean.y(-((event.clientY - bounds.top) / bounds.height - HALF) * TILT.y);
}

// A subject filter: its cards come forward, the rest dim, and the first of them is described.
function applyFilter(runtime: EducationRuntime, button: HTMLButtonElement): void {
  runtime.filter = button.dataset.group ?? '';
  runtime.filters.forEach((other) => {
    other.setAttribute('aria-pressed', String(other === button));
  });
  runtime.cards.forEach((card) => {
    card.classList.toggle('is-dim', runtime.filter !== '' && card.dataset.group !== runtime.filter);
  });
  runtime.picked = Math.max(
    0,
    runtime.cards.findIndex(
      (card) => runtime.filter === '' || card.dataset.group === runtime.filter,
    ),
  );
  describe(runtime, runtime.picked);
}

function attachCards(runtime: EducationRuntime, signal: AbortSignal): void {
  runtime.cards.forEach((card, index) => {
    card.addEventListener(
      'click',
      () => {
        open(runtime, card);
      },
      { signal },
    );
    card.addEventListener(
      'pointerenter',
      () => {
        describe(runtime, index);
      },
      { signal },
    );
    card.addEventListener(
      'focus',
      () => {
        describe(runtime, index);
      },
      { signal },
    );
  });
}

function attachControls(runtime: EducationRuntime, signal: AbortSignal): void {
  runtime.tabs.forEach((tab, index) => {
    tab.addEventListener(
      'click',
      () => {
        pick(runtime, index);
      },
      { signal },
    );
  });
  runtime.root.querySelector('.c-tabs')?.addEventListener(
    'keydown',
    (event) => {
      onTabKey(runtime, event as KeyboardEvent);
    },
    { signal },
  );
  runtime.deck.addEventListener(
    'pointerleave',
    () => {
      describe(runtime, runtime.picked);
      runtime.lean?.x(0);
      runtime.lean?.y(0);
    },
    { signal },
  );
  runtime.deck.addEventListener(
    'pointermove',
    (event) => {
      onDeckMove(runtime, event);
    },
    { signal },
  );
  runtime.filters.forEach((filter) => {
    filter.addEventListener(
      'click',
      () => {
        applyFilter(runtime, filter);
      },
      { signal },
    );
  });
  runtime.root.querySelector('.c-open')?.addEventListener(
    'click',
    () => {
      open(runtime, runtime.cards[Number(runtime.front.dataset.card) || 0]);
    },
    { signal },
  );
  runtime.dialog.addEventListener(
    'click',
    (event) => {
      if (event.target === runtime.dialog) {
        runtime.dialog.close();
      }
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

// Attaches every listener of the section to the signal, so one abort removes them all.
export function attachInput(runtime: EducationRuntime, signal: AbortSignal): void {
  attachCards(runtime, signal);
  attachControls(runtime, signal);
}
