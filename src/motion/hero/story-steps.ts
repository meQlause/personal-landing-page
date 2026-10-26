import type { gsap } from '../gsap';
import { ROUTE } from './constants';

// The tweens of the hero's scroll story, one row each, in the mockup's order. A row is placed at `at` (an absolute time),
// at `beat` + `offset` (from the start of the journey), or `fromEnd` (before the end). `hook` names a callback the story adds.

type Method = 'to' | 'from' | 'fromTo';

export interface Step {
  readonly method: Method;
  readonly target: string | object;
  readonly vars: gsap.TweenVars;
  readonly from?: gsap.TweenVars;
  readonly at?: number;
  readonly beat?: number;
  readonly offset?: number;
  readonly fromEnd?: number;
  readonly hook?: 'closingFold';
}

// Repeated selectors, named once. Scoped to the hero by the gsap context.
const SEL = {
  back: '.plane-back',
  front: '.plane-front',
  middle: '.plane-middle',
  world: '.system-world',
  title: '.closing-title',
  folds: '.closing-folds',
  portrait: '.portrait-scene',
  progress: '.hero-progress',
  actions: '.hero-actions',
} as const;

export const EASE = {
  none: 'none',
  power1InOut: 'power1.inOut',
  power2In: 'power2.in',
  power2Out: 'power2.out',
  power2InOut: 'power2.inOut',
  power3Out: 'power3.out',
  power3InOut: 'power3.inOut',
  back2: 'back.out(2)',
  back25: 'back.out(2.5)',
  back3: 'back.out(3)',
  expoOut: 'expo.out',
  expoInOut: 'expo.inOut',
  sineInOut: 'sine.inOut',
  elastic: 'elastic.out(1,.4)',
} as const;

export const SMALL_QUERY = '(max-width:600px)';
export const END = ROUTE.journey + ROUTE.beats * ROUTE.perBeat + ROUTE.tail;
const JOURNEY_DURATION = ROUTE.beats * ROUTE.perBeat;

// A value that depends on the viewport: mobile or desktop, read when the tween starts (as the mockup's `small.matches` does).
function responsive(values: { mobile: number; desktop: number }): () => number {
  return () => (matchMedia(SMALL_QUERY).matches ? values.mobile : values.desktop);
}

const PLANE_FRONT = {
  xPercent: responsive({ mobile: 16, desktop: 30 }),
  yPercent: responsive({ mobile: 35, desktop: 28 }),
};

const CUBE = { first: 180, spacing: 40, y: 382, scale: 0.6 };

export const STORY: readonly Step[] = [
  { method: 'to', target: 'pose', vars: { open: 1, duration: 1, ease: EASE.none }, at: 0 },
  {
    method: 'to',
    target: '.hero-title',
    vars: { xPercent: -24, yPercent: -12, autoAlpha: 0, duration: 0.38 },
    at: 0.08,
  },
  {
    method: 'to',
    target: '.glass-edge',
    vars: { scale: 1.12, autoAlpha: 0, duration: 0.5 },
    at: 0.12,
  },
  {
    method: 'to',
    target: SEL.front,
    vars: { ...PLANE_FRONT, rotation: 5, duration: 0.7 },
    at: 0.16,
  },
  {
    method: 'to',
    target: SEL.middle,
    vars: {
      xPercent: responsive({ mobile: 0, desktop: -3 }),
      yPercent: 0,
      rotation: 0,
      duration: 0.7,
    },
    at: 0.16,
  },
  {
    method: 'to',
    target: SEL.back,
    vars: {
      xPercent: responsive({ mobile: -16, desktop: -35 }),
      yPercent: responsive({ mobile: -32, desktop: -28 }),
      rotation: -5,
      duration: 0.7,
    },
    at: 0.16,
  },
  {
    method: 'to',
    target: SEL.world,
    vars: {
      xPercent: responsive({ mobile: 7, desktop: 12 }),
      yPercent: responsive({ mobile: 15, desktop: 0 }),
      scale: responsive({ mobile: 0.8, desktop: 0.72 }),
      duration: 0.8,
    },
    at: 0.12,
  },
  {
    method: 'fromTo',
    target: SEL.title,
    from: { x: -35, clipPath: 'inset(0 100% 0 0)', autoAlpha: 0 },
    vars: { x: 0, clipPath: 'inset(0 0% 0 0)', autoAlpha: 1, duration: 0.38, ease: EASE.power3Out },
    at: 0.57,
  },
  {
    method: 'fromTo',
    target: '.plane-label',
    from: { opacity: 0 },
    vars: { opacity: 1, duration: 0.2 },
    at: 0.5,
  },
  {
    method: 'to',
    target: '.signal',
    vars: { left: '78%', duration: 0.38, ease: EASE.power1InOut },
    at: 0.42,
  },
  { method: 'to', target: '.headline-folds', vars: { autoAlpha: 0, duration: 0.38 }, at: 0.08 },
  {
    method: 'to',
    target: 'pose',
    vars: { cover: 1, duration: 0.55, ease: EASE.power3InOut },
    at: 1.4,
    hook: 'closingFold',
  },
  {
    method: 'fromTo',
    target: SEL.folds,
    from: { autoAlpha: 0 },
    vars: { autoAlpha: 1, duration: 0.08 },
    at: 1.4,
  },
  {
    method: 'to',
    target: SEL.folds,
    vars: { autoAlpha: 0, y: -25, duration: 0.18 },
    at: 1.95,
  },
  { method: 'to', target: SEL.title, vars: { autoAlpha: 0, duration: 0.05 }, at: 1.96 },
  { method: 'to', target: '.hero-nav', vars: { autoAlpha: 0, y: -18, duration: 0.3 }, at: 1.65 },
  { method: 'to', target: SEL.actions, vars: { autoAlpha: 0, duration: 0.2 }, at: 1.6 },
  { method: 'to', target: 'pose', vars: { travel: 1, duration: 1.9, ease: EASE.none }, at: 1.95 },
  {
    method: 'to',
    target: SEL.world,
    vars: { xPercent: responsive({ mobile: -12, desktop: -8 }), scale: 0.82, duration: 1.2 },
    at: 1.95,
  },
  {
    method: 'to',
    target: SEL.front,
    vars: { xPercent: -160, yPercent: 0, rotation: 0, duration: 0.7 },
    at: 1.95,
  },
  {
    method: 'to',
    target: SEL.middle,
    vars: { xPercent: -70, yPercent: 0, rotation: 0, duration: 0.7 },
    at: 2.35,
  },
  {
    method: 'to',
    target: SEL.back,
    vars: { xPercent: 20, yPercent: 0, rotation: 0, duration: 0.7 },
    at: 2.7,
  },
  {
    method: 'to',
    target: '.interface-art',
    vars: { scale: 1.08, transformOrigin: 'center', duration: 0.4, yoyo: true, repeat: 1 },
    at: 2.05,
  },
  {
    method: 'to',
    target: '.logic-pulse',
    vars: { attr: { cx: 510 }, duration: 0.55, ease: EASE.none },
    at: 2.5,
  },
  {
    method: 'to',
    target: SEL.front,
    vars: { autoAlpha: 0, xPercent: -250, duration: 0.45 },
    at: 2.55,
  },
  {
    method: 'to',
    target: SEL.middle,
    vars: { autoAlpha: 0, xPercent: -190, duration: 0.5 },
    at: 2.95,
  },
  {
    method: 'to',
    target: SEL.back,
    vars: { xPercent: 55, rotation: 0, scale: 0.86, duration: 0.65 },
    at: 3.15,
  },
  {
    method: 'to',
    target: '.plane-back .layer-art',
    vars: { strokeDasharray: '3 9', opacity: 0.3, duration: 0.5 },
    at: 3.3,
  },
  { method: 'to', target: SEL.back, vars: { scale: 0.78, duration: 0.65 }, at: 3.65 },
  {
    method: 'fromTo',
    target: SEL.portrait,
    from: { autoAlpha: 0 },
    vars: { autoAlpha: 1, duration: 0.12 },
    at: 3.3,
  },
  { method: 'to', target: 'pose', vars: { portrait: 1, duration: 1.65, ease: EASE.none }, at: 3.3 },
  { method: 'to', target: '.hero-nav', vars: { autoAlpha: 1, y: 0, duration: 0.4 }, at: 4.7 },
  {
    method: 'to',
    target: SEL.progress,
    vars: { scaleX: 1, duration: END, ease: EASE.none },
    at: 0,
  },
  {
    method: 'to',
    target: SEL.progress,
    vars: { autoAlpha: 0, duration: 0.25 },
    fromEnd: ROUTE.hide,
  },
  // The journey: one app is assembled phase by phase (Network, Design, Develop, AI, Blockchain, Ship).
  {
    method: 'to',
    target: '.portrait-view',
    vars: { autoAlpha: responsive({ mobile: 0.12, desktop: 1 }), duration: 0.4 },
    beat: 0,
    offset: -0.3,
  },
  {
    method: 'fromTo',
    target: '.build-journey',
    from: { autoAlpha: 0 },
    vars: { autoAlpha: 1, duration: 0.2 },
    beat: 0,
    offset: -0.15,
  },
  {
    method: 'to',
    target: 'pose',
    vars: { journey: 6, duration: JOURNEY_DURATION, ease: EASE.none },
    beat: 0,
  },
  {
    method: 'fromTo',
    target: '.j-link',
    from: { strokeDashoffset: 1 },
    vars: { strokeDashoffset: 0, stagger: 0.025, duration: 0.3 },
    beat: 0,
  },
  {
    method: 'from',
    target: '.j-node',
    vars: {
      scale: 0,
      transformOrigin: '50% 50%',
      stagger: 0.03,
      duration: 0.22,
      ease: EASE.back25,
    },
    beat: 0,
  },
  {
    method: 'to',
    target: '.j-net',
    vars: { autoAlpha: 0, scale: 0.55, svgOrigin: '240 200', duration: 0.3 },
    beat: 1,
  },
  {
    method: 'fromTo',
    target: '.j-frame-line',
    from: { strokeDashoffset: 1 },
    vars: { strokeDashoffset: 0, duration: 0.35 },
    beat: 1,
    offset: 0.05,
  },
  {
    method: 'from',
    target: '.j-frame-body',
    vars: { autoAlpha: 0, duration: 0.25 },
    beat: 1,
    offset: 0.1,
  },
  {
    method: 'from',
    target: '.j-wire > *',
    vars: { autoAlpha: 0, stagger: 0.03, duration: 0.1 },
    beat: 1,
    offset: 0.2,
  },
  {
    method: 'fromTo',
    target: '.j-select',
    from: { autoAlpha: 0 },
    vars: { autoAlpha: 1, duration: 0.05 },
    beat: 1,
    offset: 0.3,
  },
  {
    method: 'to',
    target: '.j-select',
    vars: { attr: { y: 100, height: 108 }, duration: 0.1 },
    beat: 1,
    offset: 0.4,
  },
  {
    method: 'to',
    target: '.j-select',
    vars: { attr: { y: 254, width: 82, height: 36 }, duration: 0.1 },
    beat: 1,
    offset: 0.5,
  },
  { method: 'to', target: '.j-select', vars: { autoAlpha: 0, duration: 0.05 }, beat: 2 },
  {
    method: 'from',
    target: '.j-fill > *',
    vars: {
      scale: 0.3,
      autoAlpha: 0,
      transformOrigin: '50% 50%',
      stagger: 0.04,
      duration: 0.2,
      ease: EASE.back25,
    },
    beat: 2,
  },
  { method: 'to', target: '.j-wire', vars: { autoAlpha: 0, duration: 0.15 }, beat: 2, offset: 0.2 },
  {
    method: 'from',
    target: '.j-bar',
    vars: {
      scaleY: 0,
      transformOrigin: '50% 100%',
      stagger: 0.03,
      duration: 0.18,
      ease: EASE.back2,
    },
    beat: 2,
    offset: 0.3,
  },
  { method: 'to', target: '.j-bar', vars: { autoAlpha: 0, duration: 0.1 }, beat: 3 },
  {
    method: 'from',
    target: '.j-ai-node',
    vars: {
      scale: 0,
      transformOrigin: '50% 50%',
      stagger: 0.015,
      duration: 0.12,
      ease: EASE.back3,
    },
    beat: 3,
    offset: 0.05,
  },
  {
    method: 'fromTo',
    target: '.j-ai-link',
    from: { strokeDashoffset: 1 },
    vars: { strokeDashoffset: 0, stagger: 0.006, duration: 0.12 },
    beat: 3,
    offset: 0.1,
  },
  {
    method: 'from',
    target: '.j-spark',
    vars: {
      scale: 0,
      rotation: -120,
      transformOrigin: '50% 50%',
      duration: 0.22,
      ease: EASE.back3,
    },
    beat: 3,
    offset: 0.25,
  },
  {
    method: 'from',
    target: '.j-bubble',
    vars: { scale: 0, transformOrigin: '0% 100%', duration: 0.2, ease: EASE.back2 },
    beat: 3,
    offset: 0.3,
  },
  {
    method: 'from',
    target: '.j-bubble-line',
    vars: { scaleX: 0, transformOrigin: '0% 50%', stagger: 0.06, duration: 0.12 },
    beat: 3,
    offset: 0.42,
  },
  { method: 'to', target: '.j-bubble', vars: { autoAlpha: 0, duration: 0.1 }, beat: 4 },
  {
    method: 'to',
    target: '.j-app',
    vars: { x: -80, scale: 0.8, svgOrigin: '240 200', duration: 0.3 },
    beat: 4,
  },
  {
    method: 'from',
    target: '.j-cube',
    vars: { y: '-=40', autoAlpha: 0, stagger: 0.08, duration: 0.18, ease: EASE.back2 },
    beat: 4,
    offset: 0.12,
  },
  {
    method: 'from',
    target: '.j-chain-link',
    vars: { scaleY: 0, transformOrigin: '50% 0%', stagger: 0.08, duration: 0.1 },
    beat: 4,
    offset: 0.25,
  },
  {
    method: 'fromTo',
    target: '.j-data',
    from: { autoAlpha: 0 },
    vars: { autoAlpha: 1, duration: 0.04 },
    beat: 4,
    offset: 0.15,
  },
  {
    method: 'from',
    target: '.j-hash',
    vars: {
      scale: 0,
      transformOrigin: '50% 50%',
      stagger: 0.09,
      duration: 0.08,
      ease: EASE.back3,
    },
    beat: 4,
    offset: 0.28,
  },
  { method: 'to', target: '.j-data', vars: { autoAlpha: 0, duration: 0.04 }, beat: 4, offset: 0.5 },
  { method: 'to', target: '.j-app', vars: { x: 0, scale: 1, duration: 0.3 }, beat: 5 },
  { method: 'to', target: '.j-chain-link', vars: { autoAlpha: 0, duration: 0.1 }, beat: 5 },
  {
    method: 'to',
    target: '.j-cube',
    vars: {
      x: (index: number) => CUBE.first + index * CUBE.spacing,
      y: CUBE.y,
      scale: CUBE.scale,
      transformOrigin: '50% 50%',
      stagger: 0.04,
      duration: 0.3,
    },
    beat: 5,
  },
  {
    method: 'to',
    target: '.j-net',
    vars: { autoAlpha: 1, scale: 1.1, duration: 0.3 },
    beat: 5,
    offset: 0.1,
  },
  {
    method: 'fromTo',
    target: '.j-rings',
    from: { autoAlpha: 0, scale: 0.7 },
    vars: { autoAlpha: 1, scale: 1, svgOrigin: '240 200', duration: 0.3 },
    beat: 5,
    offset: 0.15,
  },
  {
    method: 'from',
    target: '.j-live',
    vars: { scale: 0, transformOrigin: '50% 50%', duration: 0.2, ease: EASE.back3 },
    beat: 5,
    offset: 0.25,
  },
  {
    method: 'fromTo',
    target: '.journey-cta',
    from: { autoAlpha: 0, y: 12 },
    vars: { autoAlpha: 1, y: 0, duration: 0.2 },
    beat: 5,
    offset: 0.35,
  },
];
