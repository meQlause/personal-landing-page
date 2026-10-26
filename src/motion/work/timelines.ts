import { gsap } from '../gsap';
import { TICKS } from './constants';
import { drawThread, setPool } from './scenes';
import type { WorkRuntime } from './runtime';

// One short timeline per product, ported from the mockup's 03-work/script.js. Each tween is a row of data at a time (`at`).

type Method = 'to' | 'from' | 'fromTo';

interface Row {
  readonly method: Method;
  readonly target: string | object;
  readonly vars: gsap.TweenVars;
  readonly from?: gsap.TweenVars;
  readonly at: number;
  readonly offset?: number;
}

const EASE = {
  power1InOut: 'power1.inOut',
  power2In: 'power2.in',
  power2InOut: 'power2.inOut',
  power2Out: 'power2.out',
  power3Out: 'power3.out',
  back2: 'back.out(2)',
  back3: 'back.out(3)',
  back15: 'back.out(1.5)',
  back16: 'back.out(1.6)',
  bounceOut: 'bounce.out',
} as const;
const GROW = { base: 0.28, span: 0.72, steps: 6 };
const TREE = {
  first: 0.25,
  step: 0.6,
  marker: 0.35,
  tick: 0.35,
  tickFade: 0.1,
  flashFrom: 0.85,
  flash: 0.25,
  ok: 0.15,
  okAt: 0.4,
  coinAt: 0.45,
  coinDuration: 0.35,
  coinStagger: 0.08,
  drop: 140,
  coinCount: 5,
  green: '#6f9a58',
  held: 3.6,
};
const MARK = { lead: 0.45 };
const CHIP = { base: 25, step: 9 };
const AGARO = { first: 210, top: 254, step: 12, count: 12, widen: 168 };
const DROP = {
  startX: 564,
  midX: 330,
  endX: 96,
  startY: 200,
  midY: 30,
  endY: 230,
  duration: 0.8,
  stagger: 0.15,
  start: 1.8,
};

function addRow(timeline: gsap.core.Timeline, row: Row): void {
  if (row.method === 'fromTo') {
    timeline.fromTo(
      row.target as gsap.TweenTarget,
      row.from ?? {},
      row.vars,
      row.at + (row.offset ?? 0),
    );
  } else if (row.method === 'from') {
    timeline.from(row.target as gsap.TweenTarget, row.vars, row.at + (row.offset ?? 0));
  } else {
    timeline.to(row.target as gsap.TweenTarget, row.vars, row.at + (row.offset ?? 0));
  }
}

// Simpul: a message is labelled, routed by a rule and delivered, while the knot unties into a route.
// Simpul: the message travels along the thread and the knot unties into the route.
function simpulTravel(runtime: WorkRuntime): Row[] {
  return [
    {
      method: 'to',
      target: runtime.thread,
      vars: { untie: 1, duration: 1.1, ease: EASE.power1InOut },
      at: 0.2,
    },
    {
      method: 'to',
      target: runtime.thread,
      vars: { bead: 220, duration: 1.1, ease: EASE.power2InOut },
      at: 0.2,
    },
    {
      method: 'fromTo',
      target: '.s-thread',
      from: { opacity: 0.45 },
      vars: { opacity: 1, duration: 0.6 },
      at: 0.5,
    },
    {
      method: 'to',
      target: '.chip .fall',
      vars: {
        y: 260,
        rotation: (index: number) => (index % 2 ? 1 : -1) * (CHIP.base + index * CHIP.step),
        autoAlpha: 0,
        stagger: { each: 0.05, from: 'random' },
        duration: 0.6,
        ease: EASE.power2In,
      },
      at: 0.25,
    },
  ];
}

// Simpul: the label, the rule and the route are each written in, and the check comes last.
function simpulLabels(runtime: WorkRuntime): Row[] {
  return [
    {
      method: 'to',
      target: '.s-bubble',
      vars: { scale: 0, transformOrigin: '50% 100%', duration: 0.3, ease: EASE.power2In },
      at: 1.3,
    },
    {
      method: 'fromTo',
      target: '.s-label .s-link',
      from: { strokeDashoffset: 1 },
      vars: { strokeDashoffset: 0, duration: 0.15 },
      at: 1.3,
    },
    { method: 'from', target: '.s-label', vars: { autoAlpha: 0, y: 10, duration: 0.25 }, at: 1.35 },
    {
      method: 'from',
      target: '.s-spark',
      vars: {
        scale: 0,
        rotation: -120,
        transformOrigin: '50% 50%',
        duration: 0.3,
        ease: EASE.back3,
      },
      at: 1.5,
    },
    { method: 'to', target: runtime.thread, vars: { bead: 340, duration: 0.45 }, at: 1.75 },
    {
      method: 'fromTo',
      target: '.s-rule .s-link',
      from: { strokeDashoffset: 1 },
      vars: { strokeDashoffset: 0, duration: 0.15 },
      at: 2.2,
    },
    { method: 'from', target: '.s-rule', vars: { autoAlpha: 0, y: 10, duration: 0.2 }, at: 2.25 },
    {
      method: 'fromTo',
      target: '.s-match',
      from: { autoAlpha: 0 },
      vars: { autoAlpha: 1, duration: 0.15 },
      at: 2.45,
    },
    { method: 'to', target: '.s-rule > text', vars: { autoAlpha: 0, duration: 0.15 }, at: 2.45 },
    { method: 'to', target: runtime.thread, vars: { bead: 460, duration: 0.45 }, at: 2.6 },
    {
      method: 'fromTo',
      target: '.s-route .s-link',
      from: { strokeDashoffset: 1 },
      vars: { strokeDashoffset: 0, duration: 0.15 },
      at: 3.05,
    },
    { method: 'from', target: '.s-route', vars: { autoAlpha: 0, y: 10, duration: 0.2 }, at: 3.1 },
    {
      method: 'fromTo',
      target: '.s-siti',
      from: { autoAlpha: 0 },
      vars: { autoAlpha: 1, duration: 0.2 },
      at: 3.4,
    },
    { method: 'to', target: '.s-rina', vars: { autoAlpha: 0, duration: 0.15 }, at: 3.4 },
    { method: 'to', target: runtime.thread, vars: { bead: 528, duration: 0.4 }, at: 3.6 },
    {
      method: 'from',
      target: '.s-notice',
      vars: { y: -20, autoAlpha: 0, duration: 0.3, ease: EASE.power3Out },
      at: 4,
    },
    {
      method: 'from',
      target: '.s-check',
      vars: { scale: 0, transformOrigin: '50% 50%', duration: 0.2, ease: EASE.back3 },
      at: 4.3,
    },
  ];
}

function simpulRows(runtime: WorkRuntime): Row[] {
  return [...simpulTravel(runtime), ...simpulLabels(runtime)];
}

// Treecord: six check-ins, each one growing the tree, with the coins landing after it.
function treecordRows(runtime: WorkRuntime): Row[] {
  const ticks = [...runtime.root.querySelectorAll('.t-ticks circle')];
  const coins = [...runtime.root.querySelectorAll('.t-coin')];
  const rows: Row[] = [];
  TICKS.forEach((markerX, index) => {
    const start = TREE.first + index * TREE.step;
    const grow = GROW.base + (GROW.span * (index + 1)) / GROW.steps;
    const coinTargets = index < TREE.coinCount ? coins[index] : coins.slice(TREE.coinCount);
    rows.push(
      {
        method: 'to',
        target: '.t-marker',
        vars: { attr: { cx: markerX }, duration: TREE.marker },
        at: start,
      },
      {
        method: 'to',
        target: ticks[index],
        vars: { fill: TREE.green, stroke: TREE.green, duration: TREE.tickFade },
        at: start,
        offset: TREE.tick,
      },
      {
        method: 'fromTo',
        target: '.t-flash',
        from: { opacity: TREE.flashFrom },
        vars: { opacity: 0, duration: TREE.flash, immediateRender: false },
        at: start,
        offset: TREE.tick,
      },
      {
        method: 'fromTo',
        target: '.t-ok',
        from: { scale: 0 },
        vars: {
          scale: 1,
          transformOrigin: '50% 50%',
          duration: TREE.ok,
          ease: EASE.back3,
          immediateRender: index === 0,
        },
        at: start,
        offset: TREE.okAt,
      },
      {
        method: 'to',
        target: '.t-tree .grow',
        vars: { scale: grow, duration: TREE.marker, ease: EASE.back15 },
        at: start,
        offset: TREE.tick,
      },
      {
        method: 'from',
        target: coinTargets,
        vars: {
          y: -TREE.drop,
          autoAlpha: 0,
          duration: TREE.coinDuration,
          stagger: TREE.coinStagger,
          ease: EASE.bounceOut,
        },
        at: start,
        offset: TREE.coinAt,
      },
    );
  });
  rows.push({
    method: 'from',
    target: '.t-held',
    vars: { autoAlpha: 0, y: 8, duration: 0.25 },
    at: TREE.held,
  });
  return rows;
}

// Mnemo: a question finds the notes that match it, the answer cites them, and a date becomes an event.
function mnemoRows(runtime: WorkRuntime): Row[] {
  const notes = [...runtime.root.querySelectorAll('.m-note .mv')];
  const related = [notes[0], notes[3]];
  return [
    {
      method: 'from',
      target: '.m-ask',
      vars: {
        scale: 0.6,
        autoAlpha: 0,
        transformOrigin: '100% 50%',
        duration: 0.3,
        ease: EASE.back2,
      },
      at: 0.1,
    },
    {
      method: 'to',
      target: [notes[1], notes[2], notes[4]],
      vars: { opacity: 0.3, duration: 0.4 },
      at: 0.7,
    },
    {
      method: 'to',
      target: related,
      vars: { scale: 1.06, transformOrigin: '50% 50%', duration: 0.4, ease: EASE.back2 },
      at: 0.7,
    },
    {
      method: 'to',
      target: '.m-line.hit',
      vars: { fill: '#c9773a', opacity: 1, stagger: 0.1, duration: 0.3 },
      at: 1.1,
    },
    {
      method: 'from',
      target: '.m-answer',
      vars: { y: 20, autoAlpha: 0, duration: 0.35, ease: EASE.power3Out },
      at: 1.6,
    },
    {
      method: 'from',
      target: '.m-chip',
      vars: { scale: 0, transformOrigin: '50% 50%', stagger: 0.1, duration: 0.2, ease: EASE.back3 },
      at: 1.95,
    },
    {
      method: 'fromTo',
      target: '.m-cite',
      from: { strokeDashoffset: 1 },
      vars: { strokeDashoffset: 0, stagger: 0.12, duration: 0.45 },
      at: 2.1,
    },
    {
      method: 'from',
      target: '.m-event',
      vars: { y: 20, autoAlpha: 0, duration: 0.35, ease: EASE.back16 },
      at: 2.7,
    },
  ];
}

// QSwap: a token enters the pool, one reserve rises and the other falls, and the other token comes out.
function qswapRows(runtime: WorkRuntime): Row[] {
  return [
    { method: 'from', target: '.q-k', vars: { autoAlpha: 0, duration: 0.3 }, at: 0.1 },
    { method: 'from', target: '.q-in', vars: { y: -40, autoAlpha: 0, duration: 0.3 }, at: 0.1 },
    {
      method: 'to',
      target: '.q-in',
      vars: { y: 220, duration: 0.45, ease: EASE.power2In },
      at: 0.5,
    },
    {
      method: 'to',
      target: '.q-in',
      vars: { autoAlpha: 0, scale: 0.4, transformOrigin: '50% 50%', duration: 0.15 },
      at: 0.95,
    },
    {
      method: 'to',
      target: runtime.quartz,
      vars: { u: 1, duration: 0.9, ease: EASE.power2InOut, onUpdate: () => setPool(runtime) },
      at: 0.95,
    },
    {
      method: 'from',
      target: '.q-out',
      vars: { autoAlpha: 0, scale: 0.4, transformOrigin: '50% 50%', duration: 0.2 },
      at: 1.6,
    },
    {
      method: 'to',
      target: '.q-out',
      vars: { x: 112, y: 40, duration: 0.5, ease: EASE.power2Out },
      at: 1.75,
    },
    { method: 'from', target: '.q-you', vars: { autoAlpha: 0, duration: 0.2 }, at: 2.15 },
  ];
}

// Agaro-Vote: a voter commits tokens, the option gains a count, and the rewards stream back.
function agaroRows(runtime: WorkRuntime): Row[] {
  const coins = [...runtime.root.querySelectorAll('.a-coin.go')];
  const count = { v: AGARO.count };
  const rows: Row[] = [
    {
      method: 'to',
      target: coins,
      vars: {
        x: 250,
        y: (index: number) => AGARO.first - (AGARO.top - AGARO.step * index),
        duration: 0.5,
        stagger: 0.08,
        ease: EASE.power2InOut,
      },
      at: 0.2,
    },
    { method: 'to', target: '.a-hl', vars: { opacity: 1, duration: 0.15 }, at: 0.55 },
    {
      method: 'to',
      target: coins,
      vars: { autoAlpha: 0, scale: 0.3, transformOrigin: '50% 50%', duration: 0.15, stagger: 0.05 },
      at: 0.75,
    },
    {
      method: 'to',
      target: '.a-bb',
      vars: { attr: { width: AGARO.widen }, duration: 0.35, ease: EASE.back16 },
      at: 0.85,
    },
    {
      method: 'fromTo',
      target: count,
      from: { v: AGARO.count },
      vars: {
        v: AGARO.count + 1,
        duration: 0.01,
        onUpdate: () => {
          runtime.agaroCount.textContent = String(Math.round(count.v));
        },
      },
      at: 0.9,
    },
    {
      method: 'from',
      target: '.a-new',
      vars: { x: -30, autoAlpha: 0, duration: 0.35, ease: EASE.back16 },
      at: 1.25,
    },
    { method: 'from', target: '.a-stream', vars: { autoAlpha: 0, duration: 0.2 }, at: 1.7 },
  ];
  return rows;
}

// Each reward drop follows a quadratic curve back to the voter, fading in and out as it goes.
function addDrops(runtime: WorkRuntime, timeline: gsap.core.Timeline): void {
  [...runtime.root.querySelectorAll<SVGCircleElement>('.a-drops circle')].forEach(
    (circle, index) => {
      const progress = { t: 0 };
      timeline.fromTo(
        progress,
        { t: 0 },
        {
          t: 1,
          duration: DROP.duration,
          ease: EASE.power1InOut,
          onUpdate: () => {
            const along = progress.t;
            const remaining = 1 - along;
            circle.setAttribute(
              'cx',
              (
                remaining * remaining * DROP.startX +
                2 * remaining * along * DROP.midX +
                along * along * DROP.endX
              ).toFixed(1),
            );
            circle.setAttribute(
              'cy',
              (
                remaining * remaining * DROP.startY +
                2 * remaining * along * DROP.midY +
                along * along * DROP.endY
              ).toFixed(1),
            );
            circle.style.opacity = Math.sin(Math.PI * along).toFixed(2);
          },
        },
        DROP.start + index * DROP.stagger,
      );
    },
  );
}

// The rows of each product, in the order the mockup builds them.
const ROWS: Record<string, (runtime: WorkRuntime) => Row[]> = {
  simpul: (runtime) => simpulRows(runtime),
  treecord: (runtime) => treecordRows(runtime),
  mnemo: (runtime) => mnemoRows(runtime),
  qswap: (runtime) => qswapRows(runtime),
  agaro: (runtime) => agaroRows(runtime),
};

// Prepares one product's start state, as the mockup does when it builds the timeline.
function prepare(runtime: WorkRuntime, name: string): void {
  if (name === 'simpul') {
    Object.assign(runtime.thread, { untie: 0, bead: 100 });
  } else if (name === 'treecord') {
    gsap.set('.t-tree .grow', { scale: GROW.base, transformOrigin: '50% 100%' });
  } else if (name === 'qswap') {
    runtime.quartz.u = 0;
    setPool(runtime);
  } else {
    runtime.agaroCount.textContent = String(AGARO.count);
  }
}

// Builds one product's timeline. It starts paused and is driven by the scroll.
export function buildTimeline(runtime: WorkRuntime, name: string): gsap.core.Timeline {
  prepare(runtime, name);
  const timeline = gsap.timeline({ paused: true, defaults: { ease: EASE.power2InOut } });
  const rows = ROWS[name](runtime);
  if (name === 'simpul') {
    timeline.eventCallback('onUpdate', () => {
      drawThread(runtime, 0);
    });
  }
  for (const row of rows) {
    addRow(timeline, row);
  }
  if (name === 'agaro') {
    addDrops(runtime, timeline);
  }
  timeline.fromTo(
    runtime.root.querySelectorAll(`#panel-${name} .mark-art`),
    { clipPath: 'inset(-50% 100% -50% 0%)' },
    { clipPath: 'inset(-50% 0% -50% 0%)', duration: 0.6, ease: EASE.power2InOut },
    Math.max(0, timeline.duration() - MARK.lead),
  );
  return timeline;
}
