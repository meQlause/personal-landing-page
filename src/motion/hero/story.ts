import { gsap } from '../gsap';
import { ROUTE } from './constants';
import { END, SMALL_QUERY, STORY, type Step } from './story-steps';
import type { HeroRuntime } from './runtime';

// The four packets that fly from the hub to the nodes, and the four cubes of the chain.
const PACKETS = [
  { x: 72, y: 86 },
  { x: 440, y: 262 },
  { x: 70, y: 318 },
];
const PACKET = { base: 0.2, step: 0.06, first: 240, firstY: 200 };
const DATA = {
  startX: 157,
  startY: 160,
  endX: 406.5,
  lift: 15.5,
  first: 92,
  step: 78,
  count: 4,
  beat: 4,
  offset: 0.18,
  gap: 0.09,
};
const CLOSE = { depth: 25, minDepth: 2, shoulder: 12, full: 100 };

// Builds the hero's scroll story from the rows in story-steps.ts, and draws the closing fold it uses.

function positionOf(step: Step): number {
  if (step.beat !== undefined) {
    return ROUTE.journey + step.beat * ROUTE.perBeat + (step.offset ?? 0);
  }
  if (step.fromEnd !== undefined) {
    return END - step.fromEnd;
  }
  return step.at ?? 0;
}

function resolveTarget(runtime: HeroRuntime, target: string | object): gsap.TweenTarget {
  return target === 'pose' ? runtime.pose : (target as gsap.TweenTarget);
}

function addStep(runtime: HeroRuntime, timeline: gsap.core.Timeline, step: Step): void {
  const position = positionOf(step);
  const target = resolveTarget(runtime, step.target);
  const vars: gsap.TweenVars =
    step.hook === 'closingFold'
      ? { ...step.vars, onUpdate: () => drawClosingFold(runtime) }
      : step.vars;
  if (step.method === 'fromTo') {
    timeline.fromTo(target, step.from ?? {}, vars, position);
  } else if (step.method === 'from') {
    timeline.from(target, vars, position);
  } else {
    timeline.to(target, vars, position);
  }
}

// The closing headline folds away into a deep edge: its depth lines are drawn from the title's measured boxes.
function drawClosingFold(runtime: HeroRuntime): void {
  const svg = runtime.root.querySelector<SVGSVGElement>('.closing-folds');
  const title = runtime.root.querySelector<HTMLElement>('.closing-title');
  if (!svg || !title) {
    return;
  }
  svg.setAttribute('viewBox', `0 0 ${runtime.w} ${runtime.h}`);
  const cover = runtime.pose.cover;
  [...title.querySelectorAll<HTMLElement>('.depth-line')].forEach((line, index) => {
    const left = title.offsetLeft + line.offsetLeft;
    const top = title.offsetTop + line.offsetTop;
    const right = left + line.offsetWidth;
    const edge = top + line.offsetHeight * (1 - cover);
    const depth = Math.sin(cover * Math.PI) * CLOSE.depth + CLOSE.minDepth;
    const group = svg.children[index];
    group
      .querySelector('.depth-face')
      ?.setAttribute(
        'd',
        `M${left} ${edge} H${right} L${right - CLOSE.shoulder} ${edge - depth} H${left + CLOSE.shoulder} Z`,
      );
    group.querySelector('.depth-edge')?.setAttribute('d', `M${left} ${edge} H${right}`);
    line.style.clipPath = `inset(0 0 ${cover * CLOSE.full}% 0)`;
  });
}

// The four packets fly from the hub to the three nodes of the network.
function addPackets(runtime: HeroRuntime, timeline: gsap.core.Timeline): void {
  const packets = runtime.root.querySelectorAll('.j-packet');
  PACKETS.forEach((point, index) => {
    timeline.fromTo(
      packets[index],
      { attr: { cx: PACKET.first, cy: PACKET.firstY }, autoAlpha: 0 },
      { attr: { cx: point.x, cy: point.y }, autoAlpha: 1, duration: 0.3, ease: 'power1.inOut' },
      ROUTE.journey + PACKET.base + index * PACKET.step,
    );
  });
}

// The data block lands in each of the four chain cubes, one after another.
function addChainData(runtime: HeroRuntime, timeline: gsap.core.Timeline): void {
  const data = runtime.root.querySelector('.j-data');
  for (let index = 0; index < DATA.count; index++) {
    timeline.fromTo(
      data,
      { attr: { x: DATA.startX, y: DATA.startY } },
      {
        attr: { x: DATA.endX, y: DATA.first + index * DATA.step - DATA.lift },
        duration: 0.1,
        ease: 'power2.in',
        immediateRender: false,
      },
      ROUTE.journey + DATA.beat * ROUTE.perBeat + DATA.offset + index * DATA.gap,
    );
  }
}

// Builds the scroll story on the runtime's gsap context. `onUpdate` runs on every scroll step.
export function buildStory(runtime: HeroRuntime, onUpdate: () => void): gsap.core.Timeline {
  const timeline = gsap.timeline({
    defaults: { ease: 'power2.inOut' },
    onUpdate,
    scrollTrigger: {
      trigger: runtime.root,
      pin: runtime.stage,
      start: 'top top',
      end: () =>
        `+=${(innerHeight * (matchMedia(SMALL_QUERY).matches ? ROUTE.heightMobile : ROUTE.heightScreens) * END) / ROUTE.heightBase}`,
      scrub: ROUTE.scrub,
      invalidateOnRefresh: true,
    },
  });
  for (const step of STORY) {
    addStep(runtime, timeline, step);
  }
  timeline.addLabel('depth', ROUTE.depth);
  addPackets(runtime, timeline);
  addChainData(runtime, timeline);
  return timeline;
}
