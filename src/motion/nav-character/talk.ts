import { gsap } from '../gsap';
import { clearTalk, hop } from './gestures';
import { render, usable, type NavCharacterRuntime } from './render';

// The speech bubble. It thinks out loud about what the cursor is over, then reacts when the visitor acts.
// Hints are [thinking, suggestion]; reactions answer something the visitor just did.
const LINES = {
  link: [
    ['Hmm…', 'Try clicking it'],
    ['Ooh…', 'Go on, click it'],
    ['Ahha!', 'That one’s clickable'],
    ['Hmm, what’s this?', 'Click and see'],
  ],
  drag: [
    ['Hmm…', 'Go on, drag me'],
    ['Ahha!', 'You can spin me'],
    ['Ooh…', 'Grab and drag!'],
  ],
  scroll: [
    ['Hmmm…', 'Keep scrolling'],
    ['Psst…', 'There’s more below'],
    ['Ahha!', 'Scroll down'],
  ],
  self: [['Hi!'], ['Oh, hello!'], ['Hehe, hi'], ['That’s me!']],
  clicked: [['Woah, that’s cool!'], ['Ooh, nice!'], ['Yesss!'], ['Ahha, there it goes']],
  dragged: [['Wheee!'], ['Woah!'], ['Again! Again!']],
  poked: [['Wheee!'], ['Hehe, that tickles'], ['Again!'], ['Woah!']],
} as const;

export type Kind = keyof typeof LINES;
const EASE_BACK = 'back.out(3)';

const TALK = {
  repeatGap: 6000,
  neverTalked: -100000,
  reactBounce: 11,
  thinkBounce: 5,
  suggestDelay: 750,
  hideAfterPair: 3200,
  hideAfterSingle: 2200,
  popIn: 0.2,
  popOut: 0.5,
  popDelay: 0.6,
  bubbleIn: 0.45,
  bubbleOut: 0.22,
  suggestPulse: 0.3,
} as const;
const TITLE = { scrollLimit: 40 } as const;

// Picks a line at random, never the same one twice in a row for the same kind.
function pick(runtime: NavCharacterRuntime, kind: Kind): readonly string[] {
  const pool: readonly (readonly string[])[] = LINES[kind];
  // A random line is cosmetic, not a security value.
  // eslint-disable-next-line sonarjs/pseudo-random -- picking a line is cosmetic
  let index = Math.floor(Math.random() * pool.length);
  if (pool.length > 1 && index === runtime.lastLine[kind]) {
    index = (index + 1) % pool.length;
  }
  runtime.lastLine[kind] = index;
  return pool[index];
}

function show(runtime: NavCharacterRuntime, text: string, bounce: number): void {
  runtime.bubble.textContent = text;
  gsap.fromTo(
    runtime.bubble,
    { autoAlpha: 0, y: -6, scale: 0.6 },
    { autoAlpha: 1, y: 0, scale: 1, duration: TALK.bubbleIn, ease: EASE_BACK, overwrite: true },
  );
  if (bounce) {
    hop(runtime, bounce);
  }
}

function hide(runtime: NavCharacterRuntime): void {
  runtime.topic = '';
  gsap.to(runtime.bubble, { autoAlpha: 0, y: -4, duration: TALK.bubbleOut, overwrite: true });
}

function mayTalk(runtime: NavCharacterRuntime, kind: Kind): boolean {
  if (kind === runtime.topic) {
    return false;
  }
  const last = runtime.lastTopic[kind] ?? TALK.neverTalked;
  return performance.now() - last >= TALK.repeatGap;
}

// The character's own pop when it reacts to something the visitor did.
function popUp(runtime: NavCharacterRuntime): void {
  gsap.to(runtime.state, {
    pop: 1,
    duration: TALK.popIn,
    ease: EASE_BACK,
    onUpdate: () => render(runtime),
    onComplete: () => {
      gsap.to(runtime.state, {
        pop: 0,
        duration: TALK.popOut,
        delay: TALK.popDelay,
        onUpdate: () => render(runtime),
      });
    },
  });
}

export interface TalkOptions {
  react?: boolean;
}

// Speaks a suggestion a moment after the thought, then hides the bubble. A lone thought hides sooner.
function afterThought(runtime: NavCharacterRuntime, then?: string): void {
  if (then) {
    runtime.talkTimers.push(
      setTimeout(() => {
        runtime.bubble.textContent = then;
        gsap.fromTo(
          runtime.bubble,
          { scale: 0.9 },
          { scale: 1, duration: TALK.suggestPulse, ease: EASE_BACK },
        );
      }, TALK.suggestDelay),
    );
  }
  runtime.talkTimers.push(
    setTimeout(
      () => {
        hide(runtime);
      },
      then ? TALK.hideAfterPair : TALK.hideAfterSingle,
    ),
  );
}

export function talk(runtime: NavCharacterRuntime, kind: Kind, options: TalkOptions = {}): void {
  if (!usable(runtime) || (!options.react && !mayTalk(runtime, kind))) {
    return;
  }
  clearTalk(runtime);
  runtime.topic = kind;
  runtime.lastTopic[kind] = performance.now();
  const [first, then] = pick(runtime, kind);
  show(runtime, first, options.react ? TALK.reactBounce : TALK.thinkBounce);
  if (options.react) {
    popUp(runtime);
  }
  afterThought(runtime, then);
}

function inTitle(runtime: NavCharacterRuntime, event: PointerEvent): boolean {
  const rect = runtime.root.querySelector('.hero-title')?.getBoundingClientRect();
  return Boolean(
    rect &&
    window.scrollY < TITLE.scrollLimit &&
    event.clientX >= rect.left &&
    event.clientX <= rect.right &&
    event.clientY >= rect.top &&
    event.clientY <= rect.bottom,
  );
}

// What the pointer is over, as a kind of speech. The headline ignores the pointer (clicks fall through to the stage),
// so its box is tested instead.
export function topicFor(runtime: NavCharacterRuntime, event: PointerEvent): Kind | '' {
  const target = event.target instanceof Element ? event.target : null;
  if (!target) {
    return '';
  }
  if (target.closest('.nav-prism')) {
    return 'self';
  }
  if (target.closest('.portrait-view.portrait-interactive')) {
    return 'drag';
  }
  if (target.closest('a,button')) {
    return 'link';
  }
  return inTitle(runtime, event) ? 'scroll' : '';
}
