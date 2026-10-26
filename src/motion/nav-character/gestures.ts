import { gsap } from '../gsap';
import { render, usable, type Mode, type NavCharacterRuntime } from './render';

// The character's small motions: hop, blink, breathe and the hover feedback. Each one undoes itself when stopped.
const HOP = {
  height: 9,
  squash: 0.8,
  stretch: -0.6,
  land: 0.7,
  anticipate: 0.09,
  jump: 0.18,
  fall: 0.16,
  settle: 0.45,
} as const;
const EASE_OUT = 'power2.out';
const BLINK = { close: 0.07, open: 0.12, gapMin: 2600, gapRange: 3200 } as const;
const BREATH = { duration: 1.7 } as const;
const FEEDBACK = { duration: 0.35 } as const;
const POP_BY_MODE: Record<Mode, number> = { action: 1, text: 0.4, rest: 0 };
export const REST_STATE = {
  rx: 0.12,
  ry: -0.18,
  rz: 0,
  turn: 0,
  pop: 0,
  look: 0,
  lookY: 0,
  blink: 0,
  breath: 0,
  jy: 0,
  sq: 0,
} as const;

export function clearTalk(runtime: NavCharacterRuntime): void {
  runtime.talkTimers.forEach((timer) => {
    clearTimeout(timer);
  });
  runtime.talkTimers = [];
}

// Hop: anticipate (squash), jump (stretch), land (squash), then settle with a wobble.
export function hop(runtime: NavCharacterRuntime, height: number = HOP.height): void {
  if (!usable(runtime)) {
    return;
  }
  const { state } = runtime;
  gsap.killTweensOf(state, 'jy,sq');
  gsap
    .timeline({ onUpdate: () => render(runtime) })
    .to(state, { sq: HOP.squash, duration: HOP.anticipate, ease: EASE_OUT })
    .to(state, { jy: height, sq: HOP.stretch, duration: HOP.jump, ease: EASE_OUT })
    .to(state, { jy: 0, sq: HOP.land, duration: HOP.fall, ease: 'power2.in' })
    .to(state, { sq: 0, duration: HOP.settle, ease: 'elastic.out(1,.4)' });
}

export function blink(runtime: NavCharacterRuntime): void {
  clearTimeout(runtime.blinkTimer);
  if (runtime.dead) {
    return;
  }
  const { state } = runtime;
  if (usable(runtime)) {
    gsap
      .timeline({ onUpdate: () => render(runtime) })
      .to(state, { blink: 1, duration: BLINK.close, ease: 'power2.in' })
      .to(state, { blink: 0, duration: BLINK.open, ease: EASE_OUT });
  }
  // Cosmetic jitter between blinks, not a security value.
  // eslint-disable-next-line sonarjs/pseudo-random -- blink timing is cosmetic
  const gap = BLINK.gapMin + Math.random() * BLINK.gapRange;
  runtime.blinkTimer = setTimeout(() => {
    blink(runtime);
  }, gap);
}

function breathe(runtime: NavCharacterRuntime): void {
  runtime.breathing?.kill();
  runtime.breathing = gsap.to(runtime.state, {
    breath: 1,
    duration: BREATH.duration,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
    onUpdate: () => render(runtime),
  });
}

// Hover feedback: the character pops up a little for links and headings. Skipped while a poke is playing.
export function feedback(runtime: NavCharacterRuntime, next: Mode): void {
  if (runtime.mode === next) {
    return;
  }
  runtime.mode = next;
  if (!usable(runtime) || runtime.sequence?.isActive()) {
    return;
  }
  gsap.to(runtime.state, {
    pop: POP_BY_MODE[next],
    duration: FEEDBACK.duration,
    ease: 'back.out(3)',
    overwrite: 'auto',
    onUpdate: () => render(runtime),
  });
}

export function stop(runtime: NavCharacterRuntime): void {
  runtime.sequence?.kill();
  runtime.breathing?.kill();
  runtime.breathing = null;
  clearTalk(runtime);
  gsap.killTweensOf(runtime.state);
  gsap.set(runtime.bubble, { autoAlpha: 0 });
  runtime.topic = '';
  Object.assign(runtime.state, REST_STATE);
  runtime.mode = 'rest';
  render(runtime);
}

export function resume(runtime: NavCharacterRuntime): void {
  if (usable(runtime) && !runtime.breathing) {
    breathe(runtime);
  }
}
