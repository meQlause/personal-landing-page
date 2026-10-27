import { WORK } from './constants';
import type { Point, Reactor, WorkRuntime } from './runtime';

// The physics inside each product's scene, ported from the mockup's 03-work/script.js: Simpul's thread, QSwap's pool and
// preview, and the springs that make the marked elements react to the cursor.

const { knot: KNOT, qswap: SWAP, thread: THREAD, drag: DRAG, spring: SPRING } = WORK;

// Where the Simpul thread starts: a spiral knot.
export function knotPoints(): Point[] {
  return [...Array(KNOT.points).keys()].map((index) => {
    const fraction = index / (KNOT.points - 1);
    const angle = fraction * Math.PI * KNOT.turns;
    const radius =
      (KNOT.radius + KNOT.spread * (1 - fraction)) *
      (1 + KNOT.ripple * Math.sin(fraction * KNOT.rippleFreq));
    return {
      x: KNOT.centreX + radius * Math.cos(angle) + KNOT.sway * Math.sin(fraction * KNOT.swayFreq),
      y:
        KNOT.centreY +
        radius * KNOT.squash * Math.sin(angle) +
        KNOT.fallY * Math.cos(fraction * KNOT.fallFreq),
    };
  });
}

// The cursor in the art's own coordinates, or null when the art is not laid out.
function svgPoint(runtime: WorkRuntime): DOMPoint | null {
  const matrix = runtime.art.getScreenCTM();
  return matrix
    ? new DOMPoint(runtime.pointer.cx, runtime.pointer.cy).matrixTransform(matrix.inverse())
    : null;
}

// Re-reads the route along the guide path whenever the message has moved on.
function refreshRoute(runtime: WorkRuntime): void {
  if (runtime.routeFor === runtime.thread.bead) {
    return;
  }
  runtime.routeFor = runtime.thread.bead;
  for (let index = 0; index < KNOT.points; index++) {
    const point = runtime.guide.getPointAtLength((index / (KNOT.points - 1)) * runtime.thread.bead);
    runtime.route[index * 2] = point.x;
    runtime.route[index * 2 + 1] = point.y;
  }
}

// How far a knot point has untied toward the route (0 to 1), with a lag toward the start of the thread.
function untieOf(runtime: WorkRuntime, index: number): number {
  const fraction = index / (KNOT.points - 1);
  const raw = (runtime.thread.untie - (1 - fraction) * THREAD.untieLead) / THREAD.untieSpan;
  const blend = Math.min(1, Math.max(0, raw));
  return blend * blend * (THREAD.untieBlend - 2 * blend);
}

// The cursor pushes a thread point aside, and it settles back on a spring.
function pushPoint(
  runtime: WorkRuntime,
  index: number,
  base: Point,
  step: { delta: number; cursor: DOMPoint | null },
): void {
  const { delta, cursor } = step;
  const { sway } = runtime;
  let force = 0;
  let offsetX = 0;
  let offsetY = 0;
  let dist = 1;
  if (cursor) {
    offsetX = base.x + sway.x[index] - cursor.x;
    offsetY = base.y + sway.y[index] - cursor.y;
    dist = Math.max(Math.hypot(offsetX, offsetY), 1);
    force = Math.max(0, 1 - dist / DRAG.reach) ** DRAG.reachPower;
  }
  sway.vx[index] +=
    ((offsetX / dist) * force * DRAG.pull -
      DRAG.anchor * sway.x[index] -
      DRAG.damping * sway.vx[index]) *
    delta;
  sway.vy[index] +=
    ((offsetY / dist) * force * DRAG.pull -
      DRAG.anchor * sway.y[index] -
      DRAG.damping * sway.vy[index]) *
    delta;
  sway.x[index] += sway.vx[index] * delta;
  sway.y[index] += sway.vy[index] * delta;
}

// Path data through the points, with smooth curves between them.
function curvePath(pathX: number[], pathY: number[]): string {
  const last = KNOT.points - 1;
  let path = `M${pathX[0].toFixed(1)} ${pathY[0].toFixed(1)}`;
  for (let index = 0; index < last; index++) {
    const before = Math.max(0, index - 1);
    const after = Math.min(last, index + 2);
    path += `C${(pathX[index] + (pathX[index + 1] - pathX[before]) / KNOT.curve).toFixed(1)} ${(pathY[index] + (pathY[index + 1] - pathY[before]) / KNOT.curve).toFixed(1)} ${(pathX[index + 1] - (pathX[after] - pathX[index]) / KNOT.curve).toFixed(1)} ${(pathY[index + 1] - (pathY[after] - pathY[index]) / KNOT.curve).toFixed(1)} ${pathX[index + 1].toFixed(1)} ${pathY[index + 1].toFixed(1)}`;
  }
  return path;
}

// Draws the thread, and moves the message along its end. `delta` is 0 when the thread is only being set, not animated.
export function drawThread(runtime: WorkRuntime, delta: number): void {
  refreshRoute(runtime);
  const cursor = delta > 0 && runtime.pointer.inside && runtime.motion ? svgPoint(runtime) : null;
  const pathX: number[] = [];
  const pathY: number[] = [];
  for (let index = 0; index < KNOT.points; index++) {
    const eased = untieOf(runtime, index);
    const base = {
      x: runtime.knot[index].x + (runtime.route[index * 2] - runtime.knot[index].x) * eased,
      y: runtime.knot[index].y + (runtime.route[index * 2 + 1] - runtime.knot[index].y) * eased,
    };
    if (delta > 0) {
      pushPoint(runtime, index, base, { delta, cursor });
    }
    pathX.push(base.x + runtime.sway.x[index]);
    pathY.push(base.y + runtime.sway.y[index]);
  }
  runtime.threadPath.setAttribute('d', curvePath(pathX, pathY));
  const last = KNOT.points - 1;
  runtime.carrier.setAttribute(
    'transform',
    `translate(${pathX[last].toFixed(1)} ${pathY[last].toFixed(1)})`,
  );
}

// QSwap: the constant product in illustrative units. The pool's reserves follow the swap's progress.
function poolOf(runtime: WorkRuntime): { reserveX: number; reserveY: number } {
  const reserveX = SWAP.base + SWAP.slope * runtime.quartz.u;
  return { reserveX, reserveY: SWAP.base / reserveX };
}

function curveX(value: number): number {
  return SWAP.originX + value * SWAP.scale;
}

function curveY(value: number): number {
  return SWAP.originY - value * SWAP.scale;
}

// Sets the pool's reserves and the dot on the curve.
export function setPool(runtime: WorkRuntime): void {
  const { reserveX, reserveY } = poolOf(runtime);
  const dotX = curveX(reserveX);
  const dotY = curveY(reserveY);
  const set = (selector: string, attribute: string, value: string): void => {
    runtime.root.querySelector(selector)?.setAttribute(attribute, value);
  };
  set('.q-lx', 'height', (SWAP.height * reserveX).toFixed(1));
  set('.q-lx', 'y', (SWAP.top - SWAP.height * reserveX).toFixed(1));
  set('.q-ly', 'height', (SWAP.height * reserveY).toFixed(1));
  set('.q-ly', 'y', (SWAP.top - SWAP.height * reserveY).toFixed(1));
  set('.q-dot', 'cx', dotX.toFixed(1));
  set('.q-dot', 'cy', dotY.toFixed(1));
  set('.q-guide', 'd', `M${dotX.toFixed(1)} ${SWAP.originY}V${dotY.toFixed(1)}H${SWAP.originX}`);
}

// Builds the QSwap curve once, from the constant product.
export function paintCurve(runtime: WorkRuntime): void {
  const commands: string[] = [];
  for (let index = 0; index < SWAP.samples; index++) {
    const value = SWAP.startX + index * SWAP.stepX;
    commands.push(
      `${index ? 'L' : 'M'}${curveX(value).toFixed(1)} ${curveY(SWAP.base / value).toFixed(1)}`,
    );
  }
  runtime.root.querySelector('.q-curve')?.setAttribute('d', commands.join(''));
}

// The sentence beside the swap: what goes in, and what comes out.
function swapReadout(value: number, now: { reserveX: number; reserveY: number }): string {
  const outY = now.reserveY - SWAP.base / value;
  const outX = now.reserveX - value;
  if (value >= now.reserveX) {
    return `${(value - now.reserveX).toFixed(2)} X in → ${outY.toFixed(2)} Y out`;
  }
  return `${(SWAP.base / value - now.reserveY).toFixed(2)} Y in → ${outX.toFixed(2)} X out`;
}

// Whether the pointer is over the curve's area, where a swap preview is drawn.
function overCurve(point: DOMPoint): boolean {
  const { left, right, top, bottom } = WORK.preview;
  return point.x >= left && point.x <= right && point.y >= top && point.y <= bottom;
}

function hidePreview(runtime: WorkRuntime): void {
  const ghost = runtime.root.querySelector<SVGElement>('.q-ghost');
  const read = runtime.root.querySelector('.q-read');
  if (ghost) {
    ghost.style.opacity = '0';
  }
  if (read) {
    read.textContent = '';
  }
}

// QSwap preview: the cursor over the curve shows what a swap of that size does to the pool (the same x · y = k).
export function previewSwap(runtime: WorkRuntime): void {
  const point = runtime.pointer.inside && runtime.motion ? svgPoint(runtime) : null;
  const ghost = runtime.root.querySelector<SVGElement>('.q-ghost');
  const read = runtime.root.querySelector('.q-read');
  if (!point || !overCurve(point) || !ghost || !read) {
    hidePreview(runtime);
    return;
  }
  const value = Math.min(SWAP.maxX, Math.max(SWAP.minX, (point.x - SWAP.originX) / SWAP.scale));
  ghost.setAttribute('cx', curveX(value).toFixed(1));
  ghost.setAttribute('cy', curveY(SWAP.base / value).toFixed(1));
  ghost.style.opacity = '1';
  read.textContent = swapReadout(value, poolOf(runtime));
}

// Every reacting element in the active scene moves toward the cursor on a damped spring, and turns with its speed.
export function springs(runtime: WorkRuntime, delta: number): void {
  const scene = runtime.scenes[runtime.active];
  const active = runtime.reactors.filter((reactor) => reactor.scene === scene);
  // No pointer and nothing moving (always, on a touch screen): no box is read and nothing is written.
  if (!isPulling(runtime) && active.every(isAtRest)) {
    return;
  }
  const bounds = runtime.art.getBoundingClientRect();
  const unit =
    Math.min(bounds.width / WORK.viewBox.width, bounds.height / WORK.viewBox.height) || 1;
  // Every box is read before any transform is written: a write between two reads forced a layout per reactor.
  if (delta > 0) {
    active.forEach((reactor) => {
      stepReactor(runtime, reactor, delta);
    });
  }
  // An unchanged transform is not written again, so a resting scene leaves the layout clean for the scroll.
  for (const reactor of active) {
    const transform = `translate(${(reactor.ox / unit).toFixed(1)} ${(reactor.oy / unit).toFixed(1)}) rotate(${(reactor.vx * SPRING.rotation).toFixed(2)})`;
    if (transform !== reactor.transform) {
      reactor.transform = transform;
      reactor.el.setAttribute('transform', transform);
    }
  }
}

function isPulling(runtime: WorkRuntime): boolean {
  return runtime.pointer.inside && runtime.motion;
}

function isAtRest(reactor: Reactor): boolean {
  return (
    Math.abs(reactor.ox) + Math.abs(reactor.oy) + Math.abs(reactor.vx) + Math.abs(reactor.vy) <
    SPRING.rest
  );
}

function stepReactor(runtime: WorkRuntime, reactor: Reactor, delta: number): void {
  // The pointer's pull: the reactor's box is only read while a pointer is there to pull it.
  let offsetX = 0;
  let offsetY = 0;
  let dist = 1;
  let force = 0;
  if (isPulling(runtime)) {
    const bounds = reactor.el.getBoundingClientRect();
    offsetX = bounds.left + bounds.width / 2 - runtime.pointer.cx;
    offsetY = bounds.top + bounds.height / 2 - runtime.pointer.cy;
    dist = Math.max(Math.hypot(offsetX, offsetY), 1);
    force = Math.max(0, 1 - dist / SPRING.reach) ** SPRING.power;
  }
  reactor.vx +=
    ((offsetX / dist) * force * SPRING.pull -
      SPRING.anchor * reactor.ox -
      SPRING.damping * reactor.vx) *
    delta;
  reactor.vy +=
    ((offsetY / dist) * force * SPRING.pull -
      SPRING.anchor * reactor.oy -
      SPRING.damping * reactor.vy) *
    delta;
  reactor.ox += reactor.vx * delta;
  reactor.oy += reactor.vy * delta;
}
