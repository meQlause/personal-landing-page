import type { gsap } from '../gsap';
import { EXPERIENCE } from './constants';

// The rows of each stop's scene, ported from the mockup's 04-experience/script.js. Each stop is one scrubbed timeline, so
// something becomes true in each (links light, a shift fills, events sync). A row is one tween, placed at `at`.

type Method = 'to' | 'from' | 'fromTo' | 'set';

export interface Row {
  readonly method: Method;
  readonly target: string | object | readonly object[] | null;
  readonly vars: gsap.TweenVars;
  readonly from?: gsap.TweenVars;
  readonly at: number;
}

interface Draw {
  readonly target: object | readonly object[];
  readonly duration: number;
  readonly stagger: number;
  readonly at: number;
}

interface Pop {
  readonly target: object | readonly object[];
  readonly at: number;
  readonly stagger?: number;
}

const PEACH = EXPERIENCE.peach;
const EASE_OUT = 'power2.out';
const EASE_POP = 'back.out(2.4)';
const EASE_IN_OUT = 'power2.inOut';
const COBALT = EXPERIENCE.cobalt;
const TIMING = {
  shortest: 0.08,
  quick: 0.1,
  fade: 0.12,
  rise: 0.25,
  pill: 0.3,
  tail: 0.35,
  label: 0.2,
  line: 0.15,
  step: 0.16,
  stagger: 0.06,
} as const;

function all(scene: Element, selector: string): Element[] {
  return [...scene.querySelectorAll(selector)];
}

function one(scene: Element, selector: string): Element {
  const found = scene.querySelector(selector);
  if (!found) {
    throw new Error(`Missing ${selector}`);
  }
  return found;
}

// A draw-on: the stroke goes from hidden to drawn.
function draw({ target, duration, stagger, at }: Draw): Row {
  return {
    method: 'fromTo',
    target,
    from: { strokeDashoffset: 1 },
    vars: { strokeDashoffset: 0, duration, stagger, ease: EASE_IN_OUT },
    at,
  };
}

// A pop: the element grows in from nothing, with its own back-out ease.
function pop({ target, at, stagger = 0 }: Pop): Row {
  return {
    method: 'from',
    target,
    vars: {
      scale: 0,
      autoAlpha: 0,
      transformOrigin: '50% 50%',
      duration: TIMING.pill,
      stagger,
      ease: EASE_POP,
    },
    at,
  };
}

// A number that counts up from zero, written into the element as it goes.
interface Count {
  readonly element: Element;
  readonly to: number;
  readonly at: number;
  readonly duration: number;
  readonly format: (amount: number) => string;
}

// A number that counts up from zero, written into the element as it goes.
function counter({ element, to, at, duration, format }: Count): Row {
  const counted = { amount: 0 };
  return {
    method: 'fromTo',
    target: counted,
    from: { amount: 0 },
    vars: {
      amount: to,
      duration,
      ease: EASE_OUT,
      onUpdate: () => {
        element.textContent = format(counted.amount);
      },
    },
    at,
  };
}

function networks(scene: Element): Row[] {
  return [
    draw({ target: all(scene, '.n-link'), duration: 0.6, stagger: 0.2, at: 0 }),
    {
      method: 'to',
      target: all(scene, '.n-led'),
      vars: { fill: PEACH, duration: TIMING.quick, stagger: 0.08 },
      at: 0.1,
    },
    {
      method: 'from',
      target: all(scene, '.n-arcs path'),
      vars: { autoAlpha: 0, duration: TIMING.pill, stagger: 0.15 },
      at: 0.45,
    },
    {
      method: 'to',
      target: all(scene, '.n-client'),
      vars: { fill: PEACH, duration: TIMING.fade, stagger: { each: 0.045, from: 'start' } },
      at: 0.7,
    },
    pop({ target: one(scene, '.x-pill'), at: 1.7 }),
  ];
}

// The shift fills half the 24-hour dial; the hours after it fill in peach; then what was built in them appears in step with
// a year marker moving 2020 → 2024. autoRound off: GSAP rounds px CSS values, which would snap 0.5 back to 1.
function korea(scene: Element): Row[] {
  const { shift, cards } = EXPERIENCE;
  const cardAt = [cards.first, cards.second, cards.third, cards.fourth];
  const rows: Row[] = [
    {
      method: 'fromTo',
      target: one(scene, '.k-arc'),
      from: { strokeDashoffset: 1 },
      vars: { strokeDashoffset: 0.5, autoRound: false, duration: 0.8, ease: 'none' },
      at: 0,
    },
    {
      method: 'to',
      target: all(scene, '.k-day:not(.off) rect'),
      vars: { fill: PEACH, duration: TIMING.quick, stagger: 0.1 },
      at: 0.15,
    },
    {
      method: 'fromTo',
      target: one(scene, '.k-after'),
      from: { strokeDashoffset: 1 },
      vars: { strokeDashoffset: 0.7, autoRound: false, duration: 0.45, ease: 'power1.out' },
      at: 0.85,
    },
    {
      method: 'fromTo',
      target: one(scene, '.k-now'),
      from: { attr: { cx: shift.now.from } },
      vars: { attr: { cx: shift.now.to }, duration: shift.now.duration, ease: 'none' },
      at: 1,
    },
  ];
  all(scene, '.k-card').forEach((card, index) => {
    rows.push({
      method: 'from',
      target: card,
      vars: {
        x: EXPERIENCE.card.x,
        autoAlpha: 0,
        duration: EXPERIENCE.card.duration,
        ease: 'power3.out',
      },
      at: cardAt[index],
    });
  });
  rows.push(pop({ target: one(scene, '.k-prize'), at: 2.4 }));
  return rows;
}

// Game governance: the token waits at the closed gate; players vote a proposal through; it executes on Radix; the gate opens.
function arcane(scene: Element): Row[] {
  const { gate, token, bar, status, voting } = EXPERIENCE;
  const gateEl = one(scene, '.g-gate');
  const tokenEl = one(scene, '.g-token');
  return [
    draw({ target: one(scene, '.g-maze'), duration: 0.4, stagger: 0, at: 0 }),
    { method: 'from', target: gateEl, vars: { autoAlpha: 0, duration: gate.hidden }, at: 0.3 },
    {
      method: 'fromTo',
      target: tokenEl,
      from: { attr: { cx: token.from } },
      vars: { attr: { cx: token.to }, duration: token.duration, ease: EASE_IN_OUT },
      at: 0.3,
    },
    pop({ target: one(scene, '.g-proposal'), at: 0.55 }),
    { method: 'set', target: one(scene, '.g-passed'), vars: { autoAlpha: 0 }, at: 0 },
    {
      method: 'to',
      target: all(scene, '.g-voter circle'),
      vars: { fill: PEACH, stroke: PEACH, duration: TIMING.shortest, stagger: 0.07 },
      at: 0.8,
    },
    {
      method: 'fromTo',
      target: one(scene, '.g-bar'),
      from: { attr: { width: 0 } },
      vars: { attr: { width: bar.width }, duration: bar.duration, ease: EASE_OUT },
      at: 0.8,
    },
    {
      method: 'to',
      target: one(scene, '.g-status rect'),
      vars: { fill: status.cobalt, duration: TIMING.fade },
      at: 1.48,
    },
    {
      method: 'to',
      target: one(scene, '.g-voting'),
      vars: { autoAlpha: 0, duration: voting.fade },
      at: 1.48,
    },
    {
      method: 'to',
      target: one(scene, '.g-passed'),
      vars: { autoAlpha: 1, duration: voting.passed },
      at: 1.52,
    },
    {
      method: 'from',
      target: one(scene, '.g-exec'),
      vars: { autoAlpha: 0, x: 20, duration: TIMING.rise },
      at: 1.6,
    },
    {
      method: 'to',
      target: gateEl,
      vars: {
        rotation: gate.rotation,
        svgOrigin: gate.origin,
        duration: gate.duration,
        ease: 'back.out(2)',
      },
      at: 1.8,
    },
    {
      method: 'to',
      target: tokenEl,
      vars: { attr: { cx: token.end }, duration: token.endDuration, ease: EASE_OUT },
      at: 2,
    },
    pop({ target: one(scene, '.x-pill'), at: 2.25 }),
  ];
}

// The mentor's count: 200 dots fill in peach, and the number of students counts up beside them.
function mentor(scene: Element): Row[] {
  const { mentorTarget, mentorPlus, mentorDuration } = EXPERIENCE.count;
  return [
    {
      method: 'to',
      target: all(scene, '.m-dot'),
      vars: {
        fill: PEACH,
        stroke: PEACH,
        duration: TIMING.shortest,
        stagger: { each: 0.0075, from: 'start' },
      },
      at: 0,
    },
    counter({
      element: one(scene, '.m-count'),
      to: mentorTarget,
      at: 0,
      duration: mentorDuration,
      format: (amount) => String(Math.round(amount)) + (amount > mentorPlus ? '+' : ''),
    }),
    {
      method: 'from',
      target: one(scene, '.m-week'),
      vars: { autoAlpha: 0, duration: TIMING.pill },
      at: 1.4,
    },
  ];
}

// Each stack's bar shrinks to its share, and the figure beside it counts down.
function tekno(scene: Element): Row[] {
  const TEKNO = EXPERIENCE.tekno;
  const rows: Row[] = [];
  all(scene, '.t-row').forEach((row, index) => {
    const bar = one(row, '.t-bar') as SVGElement;
    const value = one(row, '.t-val');
    const to = Number(bar.dataset.to);
    const percent = Math.round((1 - to / TEKNO.full) * TEKNO.percent);
    const position = TEKNO.first + index * TEKNO.step;
    rows.push({
      method: 'fromTo',
      target: bar,
      from: { attr: { width: TEKNO.full } },
      vars: { attr: { width: to }, duration: TEKNO.bar, ease: 'power3.inOut' },
      at: position,
    });
    rows.push(
      counter({
        element: value,
        to: percent,
        at: position,
        duration: TEKNO.bar,
        format: (amount) => '−' + Math.round(amount) + '%',
      }),
    );
  });
  rows.push(pop({ target: one(scene, '.x-pill'), at: 1.5 }));
  return rows;
}

// The pipeline Ardial defined: a build token moves stage to stage, each stage doing its job as it passes.
function polaris(scene: Element): Row[] {
  const token = one(scene, '.q-token');
  const pipe = EXPERIENCE.polaris;
  const move = ({ cx, at }: { cx: number; at: number }): Row => ({
    method: 'to',
    target: token,
    vars: { attr: { cx }, duration: TIMING.step, ease: EASE_IN_OUT },
    at,
  });
  return [
    {
      method: 'from',
      target: all(scene, '.q-stage'),
      vars: { y: pipe.lift, autoAlpha: 0, duration: TIMING.rise, stagger: TIMING.stagger },
      at: 0,
    },
    {
      method: 'from',
      target: all(scene, '.q-line'),
      vars: {
        scaleX: 0,
        transformOrigin: '0% 50%',
        duration: TIMING.line,
        stagger: TIMING.stagger,
      },
      at: 0.25,
    },
    {
      method: 'from',
      target: all(scene, '.q-tick'),
      vars: { autoAlpha: 0, duration: TIMING.shortest, stagger: 0.08 },
      at: 0.4,
    },
    move({ cx: pipe.first, at: 0.65 }),
    // Tests first: written failing (peach), then passing (cobalt): red → green.
    {
      method: 'from',
      target: all(scene, '.q-test'),
      vars: { scale: 0, transformOrigin: '50% 50%', duration: TIMING.fade, stagger: 0.03 },
      at: 0.7,
    },
    {
      method: 'to',
      target: all(scene, '.q-test'),
      vars: { fill: COBALT, duration: pipe.testFill, stagger: 0.04 },
      at: 1.05,
    },
    move({ cx: pipe.second, at: 1.35 }),
    pop({ target: one(scene, '.q-spark'), at: 1.42 }),
    {
      method: 'from',
      target: all(scene, '.q-gen'),
      vars: { scaleX: 0, transformOrigin: '0% 50%', duration: TIMING.label, stagger: 0.08 },
      at: 1.5,
    },
    move({ cx: pipe.third, at: 1.8 }),
    draw({ target: one(scene, '.q-shield'), duration: pipe.shield, stagger: 0, at: 1.85 }),
    {
      method: 'from',
      target: one(scene, '.q-shield-ok'),
      vars: {
        autoAlpha: 0,
        scale: 0.4,
        transformOrigin: '50% 50%',
        duration: pipe.okDuration,
        ease: 'back.out(3)',
      },
      at: 2.1,
    },
    move({ cx: pipe.fourth, at: 2.25 }),
    pop({ target: one(scene, '.q-live'), at: 2.4 }),
    pop({ target: one(scene, '.x-pill'), at: 2.6 }),
    pop({ target: one(scene, '.q-pill-2'), at: 2.72 }),
    // The payoff: the pipeline Ardial defined becomes the whole division's way of working.
    {
      method: 'to',
      target: all(scene, '.q-team circle'),
      vars: { fill: COBALT, stroke: COBALT, duration: TIMING.quick, stagger: 0.08 },
      at: 2.9,
    },
    {
      method: 'from',
      target: one(scene, '.q-division-cap'),
      vars: { autoAlpha: 0, x: -10, duration: TIMING.pill },
      at: 3.05,
    },
  ];
}

function ivet(scene: Element): Row[] {
  const config = EXPERIENCE.ivet;
  return [
    {
      method: 'from',
      target: one(scene, '.i-window'),
      vars: { y: 20, autoAlpha: 0, duration: config.window },
      at: 0,
    },
    pop({ target: all(scene, '.i-mod'), at: 0.3, stagger: 0.15 }),
    {
      method: 'from',
      target: all(scene, '.i-rows rect'),
      vars: { scaleX: 0, transformOrigin: '0% 50%', duration: config.rows, stagger: 0.1 },
      at: 0.6,
    },
    draw({ target: one(scene, '.i-pipe'), duration: config.pipe, stagger: 0, at: 0.9 }),
    {
      method: 'fromTo',
      target: one(scene, '.i-runner'),
      from: { attr: { cx: config.runner.from } },
      vars: { attr: { cx: config.runner.to }, duration: config.runner.duration, ease: 'none' },
      at: 0.9,
    },
    {
      method: 'to',
      target: all(scene, '.i-stage circle'),
      vars: { fill: PEACH, duration: TIMING.quick, stagger: 0.2 },
      at: 1,
    },
    pop({ target: one(scene, '.x-pill'), at: 1.6 }),
  ];
}

// The rows of each stop, keyed by the stop's id (the `data-stop` of its scene).
export const STOP_ROWS: Record<string, (scene: Element) => Row[]> = {
  networks,
  korea,
  arcane,
  mentor,
  tekno,
  polaris,
  ivet,
};
