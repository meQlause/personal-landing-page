import { isFinePointer, prefersReducedMotion } from '../media';

// Port of the mockup's shared/cursor.js: the page cursor outside the hero, a dot and a ring that trails it.
// The ring follows on a spring that is the same at any frame rate (the hero's own: 1 - e^(-8·dt)).
const TIMING = {
  spring: 8,
  maxStep: 0.04,
  fallbackFrame: 16,
  settle: 0.1,
  msPerSecond: 1000,
} as const;
const ACTION_SELECTOR = 'a,button,[role=tab],label,summary';
const CLASS = {
  active: 'has-ardial-cursor',
  action: 'cursor-on-action',
  pressed: 'cursor-pressed',
} as const;

interface CursorRuntime {
  readonly element: HTMLDivElement;
  readonly html: HTMLElement;
  posX: number;
  posY: number;
  ringX: number;
  ringY: number;
  isOn: boolean;
  frame: number;
  last: number;
  under: Element | null;
}

function createRuntime(): CursorRuntime {
  const element = document.createElement('div');
  element.className = 'ardial-cursor';
  element.innerHTML = '<span class="ac-ring"></span><span class="ac-core"></span>';
  element.setAttribute('aria-hidden', 'true');
  return {
    element,
    html: document.documentElement,
    posX: 0,
    posY: 0,
    ringX: 0,
    ringY: 0,
    isOn: false,
    frame: 0,
    last: 0,
    under: null,
  };
}

function hide(runtime: CursorRuntime): void {
  runtime.isOn = false;
  runtime.html.classList.remove(CLASS.active, CLASS.action, CLASS.pressed);
}

function step(runtime: CursorRuntime, time: number): void {
  const { element, posX, posY } = runtime;
  runtime.frame = 0;
  const elapsed = time - (runtime.last || time - TIMING.fallbackFrame);
  const delta = Math.min(elapsed / TIMING.msPerSecond, TIMING.maxStep);
  const ease = 1 - Math.exp(-TIMING.spring * delta);
  runtime.last = time;
  runtime.ringX += (posX - runtime.ringX) * ease;
  runtime.ringY += (posY - runtime.ringY) * ease;
  element.style.transform = `translate3d(${posX}px,${posY}px,0)`;
  element.style.setProperty('--ring-x', `${(runtime.ringX - posX).toFixed(2)}px`);
  element.style.setProperty('--ring-y', `${(runtime.ringY - posY).toFixed(2)}px`);
  const gap = Math.abs(runtime.ringX - posX) + Math.abs(runtime.ringY - posY);
  if (runtime.isOn && gap > TIMING.settle) {
    schedule(runtime);
  } else {
    runtime.last = 0;
  }
}

function schedule(runtime: CursorRuntime): void {
  runtime.frame = requestAnimationFrame((time) => {
    step(runtime, time);
  });
}

function targetOf(event: Event): Element | null {
  return event.target instanceof Element ? event.target : null;
}

// The hero keeps its own cursor (it is part of its particle physics); touch and reduced motion get none.
function standsAside(event: PointerEvent): boolean {
  const target = targetOf(event);
  return (
    event.pointerType === 'touch' ||
    !isFinePointer() ||
    prefersReducedMotion() ||
    target?.closest('.ardial-hero') != null
  );
}

function follow(runtime: CursorRuntime, event: PointerEvent): void {
  const { element, html } = runtime;
  if (!element.isConnected) {
    document.body.append(element);
  }
  if (!runtime.isOn) {
    runtime.ringX = event.clientX;
    runtime.ringY = event.clientY;
  }
  runtime.posX = event.clientX;
  runtime.posY = event.clientY;
  runtime.isOn = true;
  html.classList.add(CLASS.active);
  markTarget(runtime, targetOf(event));
  if (!runtime.frame) {
    schedule(runtime);
  }
}

function markTarget(runtime: CursorRuntime, target: Element | null): void {
  runtime.html.classList.toggle(CLASS.action, target?.closest(ACTION_SELECTOR) != null);
  if (target && target !== runtime.under) {
    // The text colour under the pointer, so the cursor always contrasts with what it sits on.
    runtime.under = target;
    runtime.element.style.color = getComputedStyle(target).color;
  }
}

// Mounts the page cursor and returns its cleanup (listeners, frame and element).
export function mountCursor(): () => void {
  const runtime = createRuntime();
  const controller = new AbortController();
  const { signal } = controller;
  window.addEventListener(
    'pointermove',
    (event) => {
      if (standsAside(event)) {
        hide(runtime);
      } else {
        follow(runtime, event);
      }
    },
    { passive: true, signal },
  );
  window.addEventListener(
    'pointerdown',
    () => {
      if (runtime.isOn) {
        runtime.html.classList.add(CLASS.pressed);
      }
    },
    { signal },
  );
  window.addEventListener(
    'pointerup',
    () => {
      runtime.html.classList.remove(CLASS.pressed);
    },
    { signal },
  );
  document.addEventListener(
    'pointerleave',
    () => {
      hide(runtime);
    },
    { signal },
  );
  window.addEventListener(
    'blur',
    () => {
      hide(runtime);
    },
    { signal },
  );
  return () => {
    controller.abort();
    cancelAnimationFrame(runtime.frame);
    runtime.element.remove();
  };
}
