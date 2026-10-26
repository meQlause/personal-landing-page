import { PORTRAIT } from './constants';

// The portrait's dots: sampled from the photograph inside the contour, placed on the plane, and drawn turning in space.
// Ported from the mockup's 01-hero/portrait.js.

interface Angle {
  x: number;
  y: number;
  z: number;
  tx: number;
  ty: number;
  tz: number;
}

interface Offset {
  readonly x: number;
  readonly y: number;
}

export interface PortraitDot {
  readonly x: number;
  readonly y: number;
  readonly z: number;
  readonly alpha: number;
  readonly seed: number;
  readonly head: boolean;
  readonly ou: number;
  readonly ov: number;
  readonly delay: number;
  ox: number;
  oy: number;
  vx: number;
  vy: number;
}

export interface Portrait {
  readonly host: HTMLElement;
  readonly canvas: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D;
  readonly anchors: NodeListOf<Element> | null;
  readonly angle: Angle;
  readonly pointer: { x: number; y: number; inside: boolean };
  readonly velocity: { x: number; y: number; t: number };
  points: PortraitDot[];
  width: number;
  height: number;
  offsetX: number;
  offsetY: number;
  active: boolean;
  progress: number;
  burst: number;
  time: number;
  calm: number;
  step: number;
}

interface Sampler {
  // The contour, rasterised once: a pixel is inside where its alpha is over half (see contourMask).
  readonly mask: Uint8ClampedArray;
  readonly pixels: Uint8ClampedArray;
}

interface Rotation {
  readonly cosY: number;
  readonly sinY: number;
  readonly cosX: number;
  readonly sinX: number;
  readonly cosZ: number;
  readonly sinZ: number;
}

interface Scene {
  readonly live: boolean;
  readonly size: number;
  readonly centre: number;
  readonly corners: number[][] | null;
  readonly scan: number;
  readonly rotation: Rotation;
}

// Dot scatter is cosmetic: it only decides where each dot starts and how it drifts.
// eslint-disable-next-line sonarjs/pseudo-random -- cosmetic scatter, not a security value
const scatter = (): number => Math.random();

const {
  size: SIZE,
  contourSize: CONTOUR_SIZE,
  bytes: BYTES,
  hash: HASH,
  centre: CENTRE,
} = PORTRAIT.sample;
// A mask pixel stands for the point at its top-left corner, as the point-in-path test it replaces did.
const PIXEL_CENTRE = 0.5;
const ALPHA = 3;
const INSIDE = 128;

function depthOf(isHead: boolean, light: number): number {
  return isHead
    ? (light - PORTRAIT.depth.headBase) * PORTRAIT.depth.headScale + PORTRAIT.depth.headLift
    : (light - PORTRAIT.depth.bodyBase) * PORTRAIT.depth.bodyScale;
}

function alphaOf(isHead: boolean, light: number): number {
  return isHead
    ? PORTRAIT.alpha.headBase + light ** PORTRAIT.alpha.headGamma * PORTRAIT.alpha.headScale
    : PORTRAIT.alpha.bodyBase + Math.sqrt(light) * PORTRAIT.alpha.bodyScale;
}

function lightOf(pixels: Uint8ClampedArray, index: number): number {
  const { red, green, blue, max } = PORTRAIT.luma;
  return (pixels[index] * red + pixels[index + 1] * green + pixels[index + 2] * blue) / max;
}

// The pixel a grid point samples: jittered by a seed that is fixed per point, so the portrait is the same on every load.
function gridPixel(gridX: number, gridY: number): { seed: number; pixelX: number; pixelY: number } {
  const { wave, wobble, jitter, half } = PORTRAIT.sample;
  const seed = ((Math.floor(gridX * HASH.a) + Math.floor(gridY * HASH.b)) % HASH.mod) / HASH.mod;
  return {
    seed,
    pixelX: Math.floor(gridX + (seed - half) * jitter),
    pixelY: Math.floor(gridY + Math.sin(seed * wave) * wobble),
  };
}

// One candidate dot on the sample grid. Null where it falls outside the subject, or in the dissolving garment.
function sampleDot(sampler: Sampler, gridX: number, gridY: number): PortraitDot | null {
  const { mask, pixels } = sampler;
  const { head, garment, hem, delay } = PORTRAIT.sample;
  const { seed, pixelX, pixelY } = gridPixel(gridX, gridY);
  const index = (pixelY * SIZE + pixelX) * BYTES;
  if (mask[index + ALPHA] < INSIDE) {
    return null;
  }
  const light = lightOf(pixels, index);
  const isHead = pixelY < head.top && pixelX > head.left && pixelX < head.right;
  if (!isHead && seed > garment.base + Math.sqrt(light) * garment.weight) {
    return null;
  }
  const fade = Math.min(1, (SIZE - pixelY) / hem);
  const spreadU = scatter();
  const spreadV = scatter();
  return {
    x: (pixelX - CENTRE.x) / SIZE,
    y: (pixelY - CENTRE.y) / SIZE,
    z: depthOf(isHead, light),
    alpha: alphaOf(isHead, light) * fade,
    seed,
    head: isHead,
    ou: spreadU,
    ov: spreadV,
    delay: delay.base + spreadU * delay.spread + scatter() * delay.jitter,
    ox: 0,
    oy: 0,
    vx: 0,
    vy: 0,
  };
}

// The dots of one row of the sample grid.
function dotsOnRow(sampler: Sampler, gridY: number): PortraitDot[] {
  const { step, left, right } = PORTRAIT.sample;
  const dots: PortraitDot[] = [];
  for (let gridX = left; gridX < right; gridX += step) {
    const dot = sampleDot(sampler, gridX, gridY);
    if (dot) {
      dots.push(dot);
    }
  }
  return dots;
}

// Draws onto a fresh sample-sized canvas and reads its pixels back. willReadFrequently keeps it on the CPU, so the read
// does not copy back from the GPU.
function readPixels(draw: (context: CanvasRenderingContext2D) => void): Uint8ClampedArray | null {
  const canvas = document.createElement('canvas');
  canvas.width = SIZE;
  canvas.height = SIZE;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) {
    return null;
  }
  draw(context);
  return context.getImageData(0, 0, SIZE, SIZE).data;
}

// The contour filled once at the sample size: one array lookup per dot instead of a path hit test per dot.
function contourMask(contour: Path2D): Uint8ClampedArray | null {
  const scale = SIZE / CONTOUR_SIZE;
  return readPixels((context) => {
    context.setTransform(scale, 0, 0, scale, PIXEL_CENTRE, PIXEL_CENTRE);
    context.fill(contour);
  });
}

// Samples the photograph on a grid and keeps the dots that land inside the contour.
export function samplePoints(image: HTMLImageElement, contour: Path2D): PortraitDot[] {
  const { step, top, bottom } = PORTRAIT.sample;
  const pixels = readPixels((context) => {
    context.drawImage(image, 0, 0, SIZE, SIZE);
  });
  const mask = contourMask(contour);
  if (!pixels || !mask) {
    return [];
  }
  const sampler: Sampler = { mask, pixels };
  const dots: PortraitDot[] = [];
  for (let gridY = top; gridY < bottom; gridY += step) {
    dots.push(...dotsOnRow(sampler, gridY));
  }
  return dots;
}

// The four plane anchors, in screen space, when the plane is large enough to start dots from.
function planeCorners(portrait: Portrait): number[][] | null {
  const { anchors, progress, host } = portrait;
  if (!anchors || anchors.length !== PORTRAIT.anchorCount || progress >= 1) {
    return null;
  }
  const bounds = host.getBoundingClientRect();
  const corners = [...anchors].map((anchor) => {
    const rect = anchor.getBoundingClientRect();
    return [rect.left - bounds.left, rect.top - bounds.top];
  });
  const span = Math.hypot(corners[2][0] - corners[0][0], corners[2][1] - corners[0][1]);
  return span > PORTRAIT.minSpan ? corners : null;
}

// Where a dot starts: on the plane (bilinear across its corners), or in a lane when there is no plane.
function originOf(portrait: Portrait, dot: PortraitDot, corners: number[][] | null): Offset {
  if (!corners) {
    const lane = Math.floor(dot.seed * PORTRAIT.lanes.count);
    return {
      x: portrait.width * (PORTRAIT.lanes.x + lane * PORTRAIT.lanes.xStep),
      y: portrait.height * (PORTRAIT.lanes.y + lane * PORTRAIT.lanes.yStep),
    };
  }
  const inverseU = 1 - dot.ou;
  const inverseV = 1 - dot.ov;
  const [first, second, third, fourth] = corners;
  const blend = (axis: 0 | 1): number =>
    first[axis] * inverseU * inverseV +
    second[axis] * dot.ou * inverseV +
    third[axis] * dot.ou * dot.ov +
    fourth[axis] * inverseU * dot.ov;
  return { x: blend(0), y: blend(1) };
}

// Each dot is a damped spring: the cursor repels and swirls it, and cursor speed flings it.
function springDot(portrait: Portrait, dot: PortraitDot, screen: Offset, live: boolean): void {
  const { pointer, velocity, step } = portrait;
  const { reach, swirl, swirlSide, fling, anchor, damping } = PORTRAIT.spring;
  const deltaX = screen.x - pointer.x;
  const deltaY = screen.y - pointer.y;
  const dist = Math.max(Math.hypot(deltaX, deltaY), 1);
  const near = live && pointer.inside ? Math.max(0, 1 - dist / reach) : 0;
  const falloff = near * near;
  dot.vx +=
    (((deltaX * swirl - deltaY * swirlSide) / dist) * falloff +
      velocity.x * falloff * fling -
      anchor * dot.ox -
      damping * dot.vx) *
    step;
  dot.vy +=
    (((deltaY * swirl + deltaX * swirlSide) / dist) * falloff +
      velocity.y * falloff * fling -
      anchor * dot.oy -
      damping * dot.vy) *
    step;
  dot.ox += dot.vx * step;
  dot.oy += dot.vy * step;
}

// The scene for this frame: the size, the turn of the head, and the plane.
function sceneOf(portrait: Portrait): Scene {
  const { angle, time, calm, width, height, progress } = portrait;
  const mobile = width < PORTRAIT.mobileWidth;
  const yaw = angle.y + calm * Math.sin(time * PORTRAIT.idle.yawRate) * PORTRAIT.idle.yaw;
  const pitch = angle.x + calm * Math.sin(time * PORTRAIT.idle.pitchRate) * PORTRAIT.idle.pitch;
  return {
    live: portrait.active && progress > PORTRAIT.liveFrom,
    size: Math.min(
      width * (mobile ? PORTRAIT.mobileScale : PORTRAIT.scale),
      height * PORTRAIT.heightScale,
    ),
    centre: width * (mobile ? PORTRAIT.centreMobile : PORTRAIT.centreDesktop),
    corners: planeCorners(portrait),
    scan: ((time * PORTRAIT.scan.rate) % PORTRAIT.scan.wrap) - PORTRAIT.scan.offset,
    rotation: {
      cosY: Math.cos(yaw),
      sinY: Math.sin(yaw),
      cosX: Math.cos(pitch),
      sinX: Math.sin(pitch),
      cosZ: Math.cos(angle.z),
      sinZ: Math.sin(angle.z),
    },
  };
}

// The dot's position in space, turned by the head and projected to the screen.
// The dot's position in space, turned by the head and projected to the screen.
function projectDot(portrait: Portrait, dot: PortraitDot, scene: Scene, band: number): Offset {
  const { burst, height } = portrait;
  const { rotation: rot, size, centre } = scene;
  const { wave } = PORTRAIT;
  const offsetX = dot.x + Math.cos(dot.seed * wave.x) * burst * wave.burst;
  const offsetY = dot.y + Math.sin(dot.seed * wave.y) * burst * wave.burst;
  const offsetZ =
    dot.z + Math.sin(dot.seed * wave.z) * burst * wave.depth + band * PORTRAIT.scan.lift;
  const yawX = offsetX * rot.cosY + offsetZ * rot.sinY;
  const yawZ = -offsetX * rot.sinY + offsetZ * rot.cosY;
  const pitchY = offsetY * rot.cosX - yawZ * rot.sinX;
  const pitchZ = offsetY * rot.sinX + yawZ * rot.cosX;
  const rollX = yawX * rot.cosZ - pitchY * rot.sinZ;
  const rollY = yawX * rot.sinZ + pitchY * rot.cosZ;
  const perspective = 1 / (1 - pitchZ * PORTRAIT.perspective);
  return {
    x: centre + rollX * size * perspective,
    y: height * PORTRAIT.centreY + rollY * size * perspective,
  };
}

// The dot on its way from the plane to the face: a flight with an arc, plus the idle float while it is live.
// How far a dot has travelled from the plane toward the face (0 to 1), after its own delay.
function progressOf(portrait: Portrait, dot: PortraitDot): number {
  return Math.max(0, Math.min(1, (portrait.progress - dot.delay) / (1 - dot.delay)));
}

// The dot on its way from the plane to the face: a flight with an arc, plus the idle float while it is live.
function flightOf(portrait: Portrait, dot: PortraitDot, scene: Scene, screen: Offset): Offset {
  const { time, height } = portrait;
  const progressOfDot = progressOf(portrait, dot);
  const eased =
    progressOfDot * progressOfDot * (PORTRAIT.smooth.a - PORTRAIT.smooth.b * progressOfDot);
  const origin = originOf(portrait, dot, scene.corners);
  const flight = 1 - eased;
  const arc =
    Math.sin(progressOfDot * Math.PI) *
    Math.sin(dot.seed * PORTRAIT.arc.wave) *
    height *
    PORTRAIT.arc.height;
  let posX = screen.x * eased + origin.x * flight;
  let posY = screen.y * eased + origin.y * flight + arc;
  if (scene.live) {
    posX +=
      Math.sin(time * PORTRAIT.float.rateX + dot.seed * PORTRAIT.float.phaseX) *
      PORTRAIT.float.amount;
    posY +=
      Math.cos(time * PORTRAIT.float.rateY + dot.seed * PORTRAIT.float.phaseY) *
      PORTRAIT.float.amount;
  }
  return { x: posX, y: posY };
}

// One dot as it is painted this frame: where it is, how far it has arrived, how strongly it is lit and how hot it runs.
interface Paint {
  readonly dot: PortraitDot;
  readonly x: number;
  readonly y: number;
  readonly progress: number;
  readonly band: number;
  readonly heat: number;
}

function radiusOf(scene: Scene, paint: Paint): number {
  const { radius } = PORTRAIT;
  const size = Math.max(radius.min, Math.min(radius.max, scene.size / radius.divisor));
  const swell = 1 + paint.band * PORTRAIT.scan.swell + paint.heat * PORTRAIT.scan.swell;
  return size * (radius.base + paint.dot.seed * radius.seed) * swell;
}

function paintPoint(portrait: Portrait, scene: Scene, paint: Paint): void {
  const { ctx, time } = portrait;
  const { dot } = paint;
  const twinkle = scene.live
    ? PORTRAIT.twinkle.base +
      PORTRAIT.twinkle.amount *
        Math.sin(time * PORTRAIT.twinkle.rate + dot.seed * PORTRAIT.twinkle.phase)
    : 1;
  ctx.globalAlpha =
    Math.min(
      1,
      dot.alpha * twinkle + paint.band * PORTRAIT.scan.glow + paint.heat * PORTRAIT.heatGlow,
    ) * Math.min(1, paint.progress * PORTRAIT.fadeIn);
  ctx.beginPath();
  ctx.arc(paint.x, paint.y, radiusOf(scene, paint), 0, Math.PI * 2);
  ctx.fill();
}

// Draws every dot that has started to arrive. Dots that are moving fast glow warm.
// Places one dot for this frame: where it is, how far it has arrived and how hot it runs. Null while it has not started.
function placeDot(portrait: Portrait, scene: Scene, dot: PortraitDot): Paint | null {
  const progressOfDot = progressOf(portrait, dot);
  if (progressOfDot <= 0) {
    return null;
  }
  const band = scene.live ? Math.exp(-((dot.y - scene.scan) ** 2) * PORTRAIT.scan.sharpness) : 0;
  const placed = flightOf(portrait, dot, scene, projectDot(portrait, dot, scene, band));
  if (portrait.step) {
    springDot(portrait, dot, placed, scene.live);
  }
  const heat = Math.min(1, Math.hypot(dot.vx, dot.vy) / PORTRAIT.heatMax);
  return { dot, x: placed.x + dot.ox, y: placed.y + dot.oy, progress: progressOfDot, band, heat };
}

// Paints one dot, and collects the hot ones for the warm glow.
function paintOne(portrait: Portrait, scene: Scene, paint: Paint, hot: number[]): void {
  paintPoint(portrait, scene, paint);
  if (paint.heat > PORTRAIT.heatFloor) {
    hot.push(paint.x, paint.y, radiusOf(scene, paint), paint.heat);
  }
}

// Draws every dot that has started to arrive. Dots that are moving fast glow warm.
function paintDots(portrait: Portrait, scene: Scene): void {
  portrait.ctx.fillStyle = PORTRAIT.colour.dot;
  const hot: number[] = [];
  for (const dot of portrait.points) {
    const paint = placeDot(portrait, scene, dot);
    if (paint) {
      paintOne(portrait, scene, paint, hot);
    }
  }
  paintHot(portrait.ctx, hot);
}

// The fast dots get a warm glow on top, four numbers each: x, y, radius and heat.
function paintHot(ctx: CanvasRenderingContext2D, hot: number[]): void {
  ctx.fillStyle = PORTRAIT.colour.hot;
  for (let index = 0; index < hot.length; index += PORTRAIT.hotStride) {
    ctx.globalAlpha = hot[index + PORTRAIT.hotHeat] * PORTRAIT.hotAlpha;
    ctx.beginPath();
    ctx.arc(hot[index], hot[index + 1], hot[index + 2], 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

// Draws one frame of the portrait.
export function drawPortrait(portrait: Portrait): void {
  const { ctx, canvas, points, progress } = portrait;
  ctx.clearRect(-portrait.offsetX, -portrait.offsetY, canvas.width, canvas.height);
  if (!points.length || progress <= 0) {
    return;
  }
  paintDots(portrait, sceneOf(portrait));
}

// The mask edge midpoint follows the furthest dot that has left the plane.
export function dissolveOf(progress: number): number {
  const { start, span, edge, lift } = PORTRAIT.dissolve;
  return Math.max(0, Math.min(1, ((progress - start) / span + lift) / edge));
}
