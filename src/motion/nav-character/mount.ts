import { need } from '../dom';
import { gsap } from '../gsap';
import { isFinePointer } from '../media';
import { blink, clearTalk, feedback, REST_STATE, resume, stop } from './gestures';
import { icosphere, norm, type Face } from './mesh';
import {
  render,
  svgElement,
  usable,
  type BlushView,
  type EyeView,
  type FaceView,
  type Figure,
  type Follow,
  type MouthView,
  type Mode,
  type NavCharacterRuntime,
  type NavState,
} from './render';
import { talk, topicFor } from './talk';

export interface NavCharacterApi {
  setMotion(enabled: boolean): void;
  destroy(): void;
}

// The head turns about 38 degrees toward the cursor: enough to clearly turn, never so far it turns away.
const AIM = { yaw: 0.66, pitch: 0.46, roll: 0.07 } as const;
const QUICK = { turn: 0.45, look: 0.22 } as const;
const DRAG = { threshold: 24 } as const;
const POKE = { spin: 0.9, start: 0.1 } as const;
const JITTER = { step: 37, cycle: 11, centre: 0.5, amount: 0.08 } as const;
const BLUSH_AT = { x: 0.52, y: 0.26, z: 0.82 } as const;
const MOUTH_AT = { x: 0, y: 0.3, z: 0.95 } as const;
const EYE_AT = { x: 0.31, y: 0.02, z: 0.95 } as const;
const FIRST_BLINK = 2000;
const FOLLOW_KEYS = ['rx', 'ry', 'rz', 'look', 'lookY'] as const;
const SIDES = [-1, 1] as const;

function targetOf(event: Event): Element | null {
  return event.target instanceof Element ? event.target : null;
}

function clamp(value: number): number {
  return Math.max(-1, Math.min(1, value));
}

function modeFor(target: Element): Mode {
  if (target.closest('a,button')) {
    return 'action';
  }
  return target.closest('h1,h2,h3,.title-word,.nav-role') ? 'text' : 'rest';
}

function quickFollow(state: NavState, onUpdate: () => void): Follow {
  const entries = FOLLOW_KEYS.map((key): [string, (value: number) => unknown] => [
    key,
    gsap.quickTo(state, key, {
      duration: key.startsWith('look') ? QUICK.look : QUICK.turn,
      ease: 'power3.out',
      onUpdate,
    }) as (value: number) => unknown,
  ]);
  return Object.fromEntries(entries) as Follow;
}

function buildFace(body: SVGGElement, ids: Face, index: number): FaceView {
  const element = svgElement<SVGPolygonElement>('polygon', {
    'stroke-width': '0.35',
    'stroke-linejoin': 'round',
  });
  body.append(element);
  const jitter = ((index * JITTER.step) % JITTER.cycle) / JITTER.cycle - JITTER.centre;
  return { ids, el: element, jitter: jitter * JITTER.amount, depth: 0 };
}

function buildBlush(front: SVGGElement, side: number): BlushView {
  const element = svgElement<SVGEllipseElement>('ellipse', { fill: '#ff9fb4', opacity: '0.55' });
  front.append(element);
  return { el: element, at: norm([side * BLUSH_AT.x, BLUSH_AT.y, BLUSH_AT.z]) };
}

function buildMouth(front: SVGGElement): MouthView {
  const smile = svgElement<SVGPathElement>('path', {
    fill: 'none',
    stroke: '#1b1f63',
    'stroke-width': '1.3',
    'stroke-linecap': 'round',
  });
  const open = svgElement<SVGEllipseElement>('ellipse', { fill: '#3a1f4f' });
  front.append(smile, open);
  return { smile, open, at: norm([MOUTH_AT.x, MOUTH_AT.y, MOUTH_AT.z]) };
}

function buildEye(front: SVGGElement, side: number): EyeView {
  const group = svgElement<SVGGElement>('g');
  const white = svgElement<SVGEllipseElement>('ellipse', { fill: '#fbfaff' });
  const pupil = svgElement<SVGEllipseElement>('ellipse', { fill: '#141857' });
  const glint = svgElement<SVGCircleElement>('circle', { fill: '#fff' });
  const glint2 = svgElement<SVGCircleElement>('circle', {
    fill: '#fff',
    opacity: '0.8',
    r: '0.55',
  });
  group.append(white, pupil, glint, glint2);
  front.append(group);
  return {
    group,
    white,
    pupil,
    glint,
    glint2,
    at: norm([side * EYE_AT.x, EYE_AT.y, EYE_AT.z]),
  };
}

// Builds the head's SVG parts in the order the mockup draws them: body faces, then blush, mouth and eyes on the front.
function buildFigure(svg: SVGSVGElement, faces: Face[]): Figure {
  svg.replaceChildren();
  const body = svgElement<SVGGElement>('g');
  const front = svgElement<SVGGElement>('g');
  svg.append(body, front);
  const figureFaces = faces.map((ids, index) => buildFace(body, ids, index));
  const blush = SIDES.map((side) => buildBlush(front, side));
  const mouth = buildMouth(front);
  const eyes = SIDES.map((side) => buildEye(front, side));
  return { body, faces: figureFaces, blush, mouth, eyes };
}

function createRuntime(root: HTMLElement, button: HTMLButtonElement): NavCharacterRuntime {
  const mesh = icosphere();
  const bubble = document.createElement('span');
  bubble.className = 'nav-prism-bubble';
  bubble.setAttribute('aria-hidden', 'true');
  button.after(bubble);
  const state: NavState = { ...REST_STATE };
  const runtime: NavCharacterRuntime = {
    root,
    button,
    bubble,
    mesh,
    figure: buildFigure(need<SVGSVGElement>(button, 'svg'), mesh.faces),
    state,
    follow: quickFollow(state, () => {
      render(runtime);
    }),
    enabled: false,
    visible: true,
    dead: false,
    mode: 'rest',
    topic: '',
    drag: null,
    sequence: null,
    breathing: null,
    blinkTimer: undefined,
    talkTimers: [],
    lastLine: {},
    lastTopic: {},
  };
  return runtime;
}

// Turns the head toward the cursor, anywhere on the page, so its eyes and head always follow.
function aim(runtime: NavCharacterRuntime, event: PointerEvent): void {
  const box = runtime.button.getBoundingClientRect();
  const aimX = clamp((event.clientX - (box.left + box.width / 2)) / (window.innerWidth / 2));
  const aimY = clamp((event.clientY - (box.top + box.height / 2)) / (window.innerHeight / 2));
  const { follow } = runtime;
  follow.ry(aimX * AIM.yaw);
  follow.rx(-aimY * AIM.pitch);
  follow.rz(-aimX * AIM.roll);
  follow.look(aimX);
  follow.lookY(aimY);
}

function onPointerMove(runtime: NavCharacterRuntime, event: PointerEvent): void {
  if (!usable(runtime) || !isFinePointer() || event.pointerType === 'touch') {
    return;
  }
  aim(runtime, event);
  const target = targetOf(event);
  // Hover reactions (pop, speech bubble) only for what is inside its own section.
  if (!target || !runtime.root.contains(target)) {
    feedback(runtime, 'rest');
    return;
  }
  feedback(runtime, modeFor(target));
  const next = topicFor(runtime, event);
  if (next) {
    talk(runtime, next);
  }
}

function onLeave(runtime: NavCharacterRuntime): void {
  if (!usable(runtime)) {
    return;
  }
  const { follow } = runtime;
  follow.rx(REST_STATE.rx);
  follow.ry(REST_STATE.ry);
  follow.rz(REST_STATE.rz);
  follow.look(REST_STATE.look);
  follow.lookY(REST_STATE.lookY);
  feedback(runtime, 'rest');
}

// It notices when the visitor clicks a link or button (not its own button).
function onRootClick(runtime: NavCharacterRuntime, event: MouseEvent): void {
  const target = targetOf(event);
  if (target && !target.closest('.nav-prism') && target.closest('a,button')) {
    talk(runtime, 'clicked', { react: true });
  }
}

function startDrag(runtime: NavCharacterRuntime, event: PointerEvent): void {
  const onPortrait = targetOf(event)?.closest('.portrait-view.portrait-interactive') != null;
  runtime.drag = onPortrait ? { x: event.clientX, y: event.clientY } : null;
}

function endDrag(runtime: NavCharacterRuntime, event: PointerEvent): void {
  const { drag } = runtime;
  if (drag && Math.hypot(event.clientX - drag.x, event.clientY - drag.y) > DRAG.threshold) {
    talk(runtime, 'dragged', { react: true });
  }
  runtime.drag = null;
}

// Clicking the character spins it once.
function poke(runtime: NavCharacterRuntime): void {
  runtime.sequence?.kill();
  if (!usable(runtime)) {
    runtime.button.classList.toggle('prism-selected');
    return;
  }
  const { state } = runtime;
  state.turn %= Math.PI * 2;
  talk(runtime, 'poked', { react: true });
  runtime.sequence = gsap
    .timeline({ onUpdate: () => render(runtime) })
    .to(state, { turn: Math.PI * 2, duration: POKE.spin, ease: 'power3.inOut' }, POKE.start)
    .set(state, { turn: 0 });
}

function attach(runtime: NavCharacterRuntime, signal: AbortSignal): void {
  const { root, button } = runtime;
  document.addEventListener(
    'pointermove',
    (event) => {
      onPointerMove(runtime, event);
    },
    { signal },
  );
  document.documentElement.addEventListener(
    'pointerleave',
    () => {
      onLeave(runtime);
    },
    { signal },
  );
  root.addEventListener(
    'click',
    (event) => {
      onRootClick(runtime, event);
    },
    { signal },
  );
  root.addEventListener(
    'pointerdown',
    (event) => {
      startDrag(runtime, event);
    },
    { signal },
  );
  window.addEventListener(
    'pointerup',
    (event) => {
      endDrag(runtime, event);
    },
    { signal },
  );
  button.addEventListener(
    'focus',
    () => {
      feedback(runtime, 'action');
    },
    { signal },
  );
  button.addEventListener(
    'blur',
    () => {
      feedback(runtime, 'rest');
    },
    { signal },
  );
  button.addEventListener(
    'click',
    () => {
      poke(runtime);
    },
    { signal },
  );
  document.addEventListener(
    'visibilitychange',
    () => {
      if (document.hidden) {
        stop(runtime);
      } else {
        resume(runtime);
      }
    },
    { signal },
  );
}

// Mounts the nav character on a section's nav. The character looks at the cursor anywhere on the page.
export function mountNavCharacter(root: HTMLElement): NavCharacterApi {
  const button = root.querySelector<HTMLButtonElement>('.nav-prism');
  if (!button) {
    return { setMotion: () => undefined, destroy: () => undefined };
  }
  const runtime = createRuntime(root, button);
  const controller = new AbortController();
  attach(runtime, controller.signal);
  const observer = new IntersectionObserver(([entry]) => {
    runtime.visible = entry.isIntersecting;
    if (runtime.visible) {
      resume(runtime);
    } else {
      stop(runtime);
    }
  });
  observer.observe(button);
  // Breathing starts once loading has finished (the hero removes the loading class).
  const loading = new MutationObserver(() => {
    resume(runtime);
  });
  loading.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  gsap.set(runtime.bubble, { autoAlpha: 0 });
  render(runtime);
  runtime.blinkTimer = setTimeout(() => {
    blink(runtime);
  }, FIRST_BLINK);
  return {
    setMotion(enabled: boolean): void {
      runtime.enabled = enabled;
      if (enabled) {
        resume(runtime);
      } else {
        stop(runtime);
      }
    },
    destroy(): void {
      runtime.dead = true;
      clearTimeout(runtime.blinkTimer);
      clearTalk(runtime);
      runtime.sequence?.kill();
      runtime.breathing?.kill();
      gsap.killTweensOf([runtime.state, runtime.bubble]);
      controller.abort();
      observer.disconnect();
      loading.disconnect();
      runtime.bubble.remove();
    },
  };
}
