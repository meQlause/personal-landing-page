import { PORTRAIT } from './constants';
import { dissolveOf, drawPortrait, samplePoints, type Portrait } from './portrait-draw';

// The portrait's timing and input, ported from the mockup's 01-hero/portrait.js: it turns with the cursor and drag, flings
// its dots, and answers the keyboard.

export interface PortraitApi {
  set(progress: number, enabled: boolean): void;
  destroy(): void;
}

interface Drag {
  readonly id: number;
  readonly startX: number;
  readonly startY: number;
  readonly originX: number;
  readonly originY: number;
  moved: number;
}

// The portrait's timing and input state, on top of what the drawing reads.
interface Live extends Portrait {
  readonly source: HTMLElement | null;
  readonly abort: AbortController;
  drag: Drag | null;
  frame: number;
  last: number;
  visible: boolean;
  dead: boolean;
}

const KEY_TURNS: Record<string, (live: Live) => void> = {
  ArrowLeft: (live) => {
    live.angle.ty -= PORTRAIT.keys.yaw;
  },
  ArrowRight: (live) => {
    live.angle.ty += PORTRAIT.keys.yaw;
  },
  ArrowUp: (live) => {
    live.angle.tx -= PORTRAIT.keys.pitch;
  },
  ArrowDown: (live) => {
    live.angle.tx += PORTRAIT.keys.pitch;
  },
  '+': (live) => {
    live.angle.tz += PORTRAIT.keys.roll;
  },
  '-': (live) => {
    live.angle.tz -= PORTRAIT.keys.roll;
  },
  Enter: (live) => {
    live.burst = 1;
  },
  Escape: (live) => {
    reset(live);
  },
};

const AXES = ['x', 'y', 'z'] as const;
const TARGET_OF = { x: 'tx', y: 'ty', z: 'tz' } as const;

function clampTurn(value: number, limit: number): number {
  return Math.max(-limit, Math.min(limit, value));
}

function stopFrame(live: Live): void {
  cancelAnimationFrame(live.frame);
  live.frame = 0;
  live.last = 0;
}

function wake(live: Live): void {
  if (live.active && live.visible && !document.hidden && !live.dead && !live.frame) {
    live.frame = requestAnimationFrame((time) => {
      tick(live, time);
    });
  }
}

// Turns the head toward its target, settles the idle sway, and keeps animating while something still moves.
// The portrait only animates while it is active, on screen and the tab is visible.
function canAnimate(live: Live): boolean {
  return live.active && live.visible && !live.dead && !document.hidden;
}

// Advances the clock, the calm and the fling by one frame.
function advance(live: Live, delta: number): void {
  live.time += delta;
  live.calm += ((live.drag ? 0 : 1) - live.calm) * (1 - Math.exp(-PORTRAIT.calmRate * delta));
  live.burst *= Math.exp(-PORTRAIT.burstDecay * delta);
  live.velocity.x *= Math.exp(-PORTRAIT.flingDecay * delta);
  live.velocity.y *= Math.exp(-PORTRAIT.flingDecay * delta);
}

function tick(live: Live, time: number): void {
  live.frame = 0;
  if (!canAnimate(live)) {
    return;
  }
  const delta = Math.min(
    (time - (live.last || time - PORTRAIT.fallbackFrame)) / PORTRAIT.msPerSecond,
    PORTRAIT.maxDelta,
  );
  live.last = time;
  advance(live, delta);
  const moving = turnToward(live, delta);
  live.step = delta;
  drawPortrait(live);
  live.step = 0;
  if (moving || live.burst > PORTRAIT.burstFloor || live.progress > PORTRAIT.settledFrom) {
    wake(live);
  } else {
    live.last = 0;
  }
}

// Eases each axis toward its target. Returns true while any axis is still on its way.
function turnToward(live: Live, delta: number): boolean {
  let moving = false;
  for (const axis of AXES) {
    const target = TARGET_OF[axis];
    const ease = 1 - Math.exp(-PORTRAIT.turnRate * delta);
    live.angle[axis] += (live.angle[target] - live.angle[axis]) * ease;
    moving = moving || Math.abs(live.angle[axis] - live.angle[target]) > PORTRAIT.settle;
  }
  return moving;
}

function reset(live: Live): void {
  live.angle.tx = 0;
  live.angle.ty = 0;
  live.angle.tz = 0;
  wake(live);
}

function onPointerDown(live: Live, event: PointerEvent): void {
  if (!live.active || live.progress < PORTRAIT.dragFrom) {
    return;
  }
  live.drag = {
    id: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    originX: live.angle.ty,
    originY: live.angle.tx,
    moved: 0,
  };
  live.host.setPointerCapture(event.pointerId);
}

// The pointer's speed flings the dots. Dragging turns the head.
function onPointerMove(live: Live, event: PointerEvent): void {
  const bounds = live.host.getBoundingClientRect();
  const posX = event.clientX - bounds.left;
  const posY = event.clientY - bounds.top;
  trackFling(live, event, posX, posY);
  live.pointer.inside = live.active && event.pointerType !== 'touch';
  wake(live);
  if (live.drag && live.drag.id === event.pointerId) {
    turnFromDrag(live, event);
  }
  wake(live);
}

// Dragging turns the head: yaw and pitch follow the drag, and holding Shift also rolls it.
function turnFromDrag(live: Live, event: PointerEvent): void {
  const drag = live.drag;
  if (!drag) {
    return;
  }
  const dragX = event.clientX - drag.startX;
  const dragY = event.clientY - drag.startY;
  drag.moved = Math.hypot(dragX, dragY);
  live.angle.ty = clampTurn(drag.originX + dragX * PORTRAIT.drag.yaw, PORTRAIT.limit.yaw);
  live.angle.tx = clampTurn(drag.originY - dragY * PORTRAIT.drag.pitch, PORTRAIT.limit.pitch);
  if (event.shiftKey) {
    live.angle.tz = clampTurn(dragX * PORTRAIT.drag.roll, PORTRAIT.limit.roll);
  }
}

// The speed of the pointer, measured over a short window, becomes the fling.
function trackFling(live: Live, event: PointerEvent, posX: number, posY: number): void {
  const gap = (event.timeStamp - live.velocity.t) / PORTRAIT.msPerSecond;
  if (live.pointer.inside && gap > 0 && gap < PORTRAIT.flingWindow) {
    const span = Math.max(gap, PORTRAIT.minGap);
    live.velocity.x = clampTurn((posX - live.pointer.x) / span, PORTRAIT.flingLimit);
    live.velocity.y = clampTurn((posY - live.pointer.y) / span, PORTRAIT.flingLimit);
  }
  live.velocity.t = event.timeStamp;
  live.pointer.x = posX;
  live.pointer.y = posY;
}

// A short press with no drag is a tap, which makes the dots scatter.
function release(live: Live, event: PointerEvent): void {
  if (!live.drag || live.drag.id !== event.pointerId) {
    return;
  }
  if (live.drag.moved < PORTRAIT.tapDistance) {
    live.burst = 1;
    wake(live);
  }
  if (live.host.hasPointerCapture(event.pointerId)) {
    live.host.releasePointerCapture(event.pointerId);
  }
  live.drag = null;
}

function onKeyDown(live: Live, event: KeyboardEvent): void {
  const turn = KEY_TURNS[event.key];
  if (!live.active || !turn) {
    return;
  }
  event.preventDefault();
  event.stopPropagation();
  turn(live);
  live.angle.tx = clampTurn(live.angle.tx, PORTRAIT.limit.pitch);
  live.angle.ty = clampTurn(live.angle.ty, PORTRAIT.limit.yaw);
  live.angle.tz = clampTurn(live.angle.tz, PORTRAIT.limit.roll);
  wake(live);
}

function attachPointer(live: Live): void {
  const { host, abort } = live;
  const { signal } = abort;
  host.addEventListener(
    'pointerdown',
    (event) => {
      onPointerDown(live, event);
    },
    { signal },
  );
  host.addEventListener(
    'pointerleave',
    () => {
      live.pointer.inside = false;
    },
    { signal },
  );
  host.addEventListener(
    'pointermove',
    (event) => {
      onPointerMove(live, event);
    },
    { signal },
  );
  host.addEventListener(
    'pointerup',
    (event) => {
      release(live, event);
    },
    { signal },
  );
  host.addEventListener(
    'pointercancel',
    () => {
      live.drag = null;
    },
    { signal },
  );
  host.addEventListener(
    'lostpointercapture',
    () => {
      live.drag = null;
    },
    { signal },
  );
}

function attachKeyboard(live: Live): void {
  const { signal } = live.abort;
  live.host.addEventListener(
    'keydown',
    (event) => {
      onKeyDown(live, event);
    },
    { signal },
  );
  document.addEventListener(
    'visibilitychange',
    () => {
      if (document.hidden) {
        stopFrame(live);
      } else {
        wake(live);
      }
    },
    { signal },
  );
}

// Keeps the canvas on the scene and redraws when the host resizes.
function resizePortrait(live: Live): void {
  const { host, canvas, ctx } = live;
  const bounds = host.getBoundingClientRect();
  const sceneBounds = (host.parentElement ?? host).getBoundingClientRect();
  const dpr = Math.min(devicePixelRatio, PORTRAIT.maxDpr);
  live.width = bounds.width;
  live.height = bounds.height;
  live.offsetX = bounds.left - sceneBounds.left;
  live.offsetY = bounds.top - sceneBounds.top;
  Object.assign(canvas.style, {
    left: `${-live.offsetX}px`,
    top: `${-live.offsetY}px`,
    width: `${sceneBounds.width}px`,
    height: `${sceneBounds.height}px`,
  });
  canvas.width = Math.round(sceneBounds.width * dpr);
  canvas.height = Math.round(sceneBounds.height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, live.offsetX * dpr, live.offsetY * dpr);
  drawPortrait(live);
}

function observe(live: Live): { resize: ResizeObserver; visibility: IntersectionObserver } {
  const resizer = new ResizeObserver(() => {
    resizePortrait(live);
  });
  resizer.observe(live.host);
  const visibility = new IntersectionObserver(([entry]) => {
    live.visible = entry.isIntersecting;
    if (live.visible) {
      wake(live);
    } else {
      stopFrame(live);
    }
  });
  visibility.observe(live.host);
  return { resize: resizer, visibility };
}

// Sets the portrait's progress and whether it takes input. Called from the hero's scroll story.
function setPortrait(live: Live, progress: number, enabled: boolean): void {
  live.progress = progress;
  live.source?.style.setProperty(
    '--dissolve',
    enabled ? dissolveOf(progress).toFixed(PORTRAIT.decimals) : '0',
  );
  live.active = enabled && progress > 0;
  const interactive = progress > PORTRAIT.interactiveFrom;
  live.host.classList.toggle('portrait-interactive', live.active && interactive);
  live.host.tabIndex = interactive ? 0 : -1;
  if (!live.active) {
    stopFrame(live);
  }
  drawPortrait(live);
  wake(live);
}

// Mounts the portrait on its host. `source` is the Infrastructure plane the dots start from.
export function mountPortrait(host: HTMLElement, source: HTMLElement | null): PortraitApi {
  const canvas = host.querySelector('canvas');
  const fallback = host.querySelector('img');
  const ctx = canvas?.getContext('2d');
  if (!canvas || !fallback || !ctx) {
    return { set: () => undefined, destroy: () => undefined };
  }
  const live: Live = {
    host,
    canvas,
    ctx,
    source,
    anchors: source ? source.querySelectorAll('.plane-anchor') : null,
    abort: new AbortController(),
    angle: { x: 0, y: 0, z: 0, tx: 0, ty: 0, tz: 0 },
    pointer: { x: -PORTRAIT.offscreen, y: -PORTRAIT.offscreen, inside: false },
    velocity: { x: 0, y: 0, t: 0 },
    points: [],
    width: 0,
    height: 0,
    offsetX: 0,
    offsetY: 0,
    active: false,
    progress: 0,
    burst: 0,
    drag: null,
    time: 0,
    calm: 0,
    step: 0,
    frame: 0,
    last: 0,
    visible: true,
    dead: false,
  };
  attachPointer(live);
  attachKeyboard(live);
  const observers = observe(live);
  const image = new Image();
  // Decoded off the main thread first, so sampling does not decode the photograph in the middle of a task.
  const sample = (): void => {
    if (live.dead) {
      return;
    }
    live.points = samplePoints(image, new Path2D(PORTRAIT.contour));
    host.classList.add('portrait-ready');
    fallback.hidden = true;
    resizePortrait(live);
    wake(live);
  };
  image.onload = () => {
    image.decode().then(sample, sample);
  };
  image.onerror = () => {
    if (!live.dead) {
      host.classList.add('portrait-error');
      fallback.hidden = true;
    }
  };
  image.src = fallback.src;
  return {
    set(progress, enabled) {
      setPortrait(live, progress, enabled);
    },
    destroy() {
      live.dead = true;
      cancelAnimationFrame(live.frame);
      live.abort.abort();
      observers.resize.disconnect();
      observers.visibility.disconnect();
      image.onload = null;
      image.onerror = null;
      live.points = [];
    },
  };
}
