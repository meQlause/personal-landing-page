import { FROST, PARTICLE } from './constants';
import type { Dot, HeroRuntime } from './runtime';

// The window's frosted surface (with its trail and reveal) and the particle field, ported from the mockup's 01-hero/script.js.

interface Lcg {
  readonly multiplier: number;
  readonly modulus: number;
}

interface Frame {
  readonly delta: number;
  readonly fade: number;
}

interface Offset {
  readonly x: number;
  readonly y: number;
}

function nextSeed(seed: number, lcg: Lcg): number {
  return (seed * lcg.multiplier) % lcg.modulus;
}

export function resize(runtime: HeroRuntime): void {
  const bounds = runtime.stage.getBoundingClientRect();
  runtime.w = Math.round(bounds.width);
  runtime.h = Math.round(bounds.height);
  // A capped backing resolution keeps the full-stage material inexpensive.
  const scale = Math.min(devicePixelRatio, FROST.maxScale);
  sizeCanvases(runtime, scale);
  paintBase(runtime);
  seedParticles(runtime);
  runtime.trails.length = 0;
  runtime.lastPoint = null;
  drawParticles(runtime, 0);
  draw(runtime, performance.now());
}

function sizeCanvases(runtime: HeroRuntime, scale: number): void {
  const { canvas, ctx, base, baseCtx, particleCanvas, pc: layer } = runtime;
  canvas.width = Math.round(runtime.w * scale);
  canvas.height = Math.round(runtime.h * scale);
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  base.width = canvas.width;
  base.height = canvas.height;
  baseCtx.setTransform(scale, 0, 0, scale, 0, 0);
  if (particleCanvas && layer) {
    particleCanvas.width = canvas.width;
    particleCanvas.height = canvas.height;
    layer.setTransform(scale, 0, 0, scale, 0, 0);
  }
}

// The frost's colour, then its grain.
function paintBase(runtime: HeroRuntime): void {
  const { baseCtx, w, h } = runtime;
  const { gradient } = FROST;
  const fill = baseCtx.createLinearGradient(0, 0, w, h);
  fill.addColorStop(0, gradient.from);
  fill.addColorStop(gradient.mid, gradient.middle);
  fill.addColorStop(1, gradient.to);
  baseCtx.fillStyle = fill;
  baseCtx.fillRect(0, 0, w, h);
  paintGrain(runtime);
}

// A very fine grain, generated once per resize.
function paintGrain(runtime: HeroRuntime): void {
  const { baseCtx, w, h } = runtime;
  const { grain } = FROST;
  let seed: number = grain.seed;
  const specks = (w * h) / grain.density;
  for (let index = 0; index < specks; index++) {
    seed = nextSeed(seed, grain);
    const posX = seed % w;
    seed = nextSeed(seed, grain);
    baseCtx.fillStyle = index % 2 ? grain.light : grain.dark;
    baseCtx.fillRect(posX, seed % h, 1, 1);
  }
}

// The particle field: a fixed random layout, so the same screen always gets the same particles.
function seedParticles(runtime: HeroRuntime): void {
  const { w, h, particles } = runtime;
  particles.length = 0;
  let randomSeed: number = PARTICLE.seed;
  const random = (): number => {
    randomSeed = nextSeed(randomSeed, PARTICLE);
    return randomSeed / PARTICLE.modulus;
  };
  const count = Math.min(
    PARTICLE.countMax,
    Math.max(PARTICLE.countMin, Math.round((w * h) / PARTICLE.areaDivisor)),
  );
  for (let index = 0; index < count; index++) {
    const posX = w * (PARTICLE.x.min + random() * PARTICLE.x.span);
    const posY = h * (PARTICLE.y.min + random() * PARTICLE.y.span);
    particles.push({
      ax: posX,
      ay: posY,
      x: posX,
      y: posY,
      vx: 0,
      vy: 0,
      r: PARTICLE.radius.min + random() * PARTICLE.radius.span,
      alpha: PARTICLE.alpha.min + random() * PARTICLE.alpha.span,
      warm: index % PARTICLE.warmEvery === 0,
      phase: random() * Math.PI * 2,
      speed: PARTICLE.speed.min + random() * PARTICLE.speed.span,
      drift: PARTICLE.drift.min + random() * PARTICLE.drift.span,
    });
  }
}

function styleTrail(runtime: HeroRuntime, fade: number): void {
  const { ctx, w } = runtime;
  ctx.globalAlpha = fade * fade;
  ctx.strokeStyle = '#000';
  ctx.lineWidth = Math.max(
    FROST.trailMinWidth,
    Math.min(FROST.trailMaxWidth, w * FROST.trailWidth),
  );
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.shadowColor = '#000';
  ctx.shadowBlur = FROST.trailBlur;
}

// Strokes the trail through the midpoints of its points, so it reads as one curve.
function curveTrail(runtime: HeroRuntime): void {
  const { ctx, trails } = runtime;
  const last = trails[trails.length - 1];
  ctx.beginPath();
  ctx.moveTo(trails[0].x, trails[0].y);
  for (let index = 1; index < trails.length - 1; index++) {
    const from = trails[index];
    const to = trails[index + 1];
    ctx.quadraticCurveTo(from.x, from.y, (from.x + to.x) / 2, (from.y + to.y) / 2);
  }
  ctx.lineTo(last.x, last.y);
  ctx.stroke();
}

// The cursor's trail is one continuous stroke, which avoids the scalloped edges of overlapping circles.
function drawTrail(runtime: HeroRuntime, time: number): void {
  const { trails } = runtime;
  const last = trails[trails.length - 1];
  const age = last ? time - last.t : FROST.trailAgeIdle;
  if (age > FROST.trailLife) {
    trails.length = 0;
  }
  if (!trails.length) {
    return;
  }
  const fade = 1 - Math.min(1, Math.max(0, (age - FROST.trailFadeStart) / FROST.trailFadeSpan));
  runtime.ctx.save();
  styleTrail(runtime, fade);
  curveTrail(runtime);
  runtime.ctx.restore();
}

// The circle of clear glass that opens as the hero is explored.
function drawReveal(runtime: HeroRuntime): void {
  const { ctx, w, h, pose } = runtime;
  const radius = Math.hypot(w, h) * pose.open;
  const centreX = w * FROST.revealX;
  const centreY = h * FROST.revealY;
  const reveal = ctx.createRadialGradient(
    centreX,
    centreY,
    radius * FROST.revealInner,
    centreX,
    centreY,
    radius,
  );
  reveal.addColorStop(0, 'rgba(0,0,0,1)');
  reveal.addColorStop(FROST.revealMid, 'rgba(0,0,0,.95)');
  reveal.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = reveal;
  ctx.beginPath();
  ctx.arc(centreX, centreY, radius, 0, Math.PI * 2);
  ctx.fill();
}

export function draw(runtime: HeroRuntime, time: number): void {
  const { ctx, base, w, h, pose, canvas } = runtime;
  ctx.clearRect(0, 0, w, h);
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1;
  ctx.drawImage(base, 0, 0, w, h);
  ctx.globalCompositeOperation = 'destination-out';
  drawTrail(runtime, time);
  if (pose.open > 0) {
    drawReveal(runtime);
  }
  ctx.globalCompositeOperation = 'source-over';
  canvas.style.opacity = String(1 - Math.max(0, (pose.open - FROST.fadeFrom) / FROST.fadeSpan));
}

// Where a particle drifts to this frame.
function driftOf(runtime: HeroRuntime, dot: Dot): Offset {
  const { motion, particleTime } = runtime;
  const sway = motion ? Math.sin(particleTime * dot.speed + dot.phase) * dot.drift : 0;
  const bob = motion
    ? Math.cos(particleTime * dot.speed * PARTICLE.yRate + dot.phase) * dot.drift * PARTICLE.yDrift
    : 0;
  return { x: dot.ax + sway, y: dot.ay + bob };
}

// How far a particle has arrived (0 to 1) on its way in.
function arriveOf(runtime: HeroRuntime, dot: Dot): number {
  const progress =
    runtime.particleIn * PARTICLE.k - (dot.phase / (Math.PI * 2)) * PARTICLE.phaseWeight;
  const eased = Math.min(1, Math.max(0, progress));
  return eased * eased * (PARTICLE.smooth.a - PARTICLE.smooth.b * eased);
}

// The cursor pushes a particle away from it, and the particle rises while it has not yet arrived.
function targetOf(runtime: HeroRuntime, drift: Offset, arrive: number): Offset & { force: number } {
  const { pointer, motion } = runtime;
  const deltaX = drift.x - pointer.x;
  const deltaY = drift.y - pointer.y;
  const dist = Math.hypot(deltaX, deltaY);
  const force = pointer.inside && motion ? Math.max(0, 1 - dist / PARTICLE.reach) : 0;
  const unit = Math.max(dist, 1);
  return {
    x: drift.x + (deltaX / unit) * force * PARTICLE.push,
    y: drift.y + (deltaY / unit) * force * PARTICLE.push + (1 - arrive) * PARTICLE.rise,
    force,
  };
}

// A damped spring from the particle to its target.
function settle(dot: Dot, target: Offset, delta: number): void {
  dot.vx += ((target.x - dot.x) * PARTICLE.spring - dot.vx * PARTICLE.damping) * delta;
  dot.vy += ((target.y - dot.y) * PARTICLE.spring - dot.vy * PARTICLE.damping) * delta;
  dot.x += dot.vx * delta;
  dot.y += dot.vy * delta;
}

function paintDot(layer: CanvasRenderingContext2D, dot: Dot, fade: number, arrive: number): void {
  layer.globalAlpha = dot.alpha * fade * arrive;
  layer.fillStyle = dot.warm ? PARTICLE.warm : PARTICLE.cool;
  layer.beginPath();
  layer.arc(
    dot.x,
    dot.y,
    dot.r * (PARTICLE.radiusBase + PARTICLE.radiusArrive * arrive),
    0,
    Math.PI * 2,
  );
  layer.fill();
}

// The line from a pushed particle back to where it drifts.
function paintLink(layer: CanvasRenderingContext2D, dot: Dot, drift: Offset, alpha: number): void {
  layer.globalAlpha = alpha;
  layer.strokeStyle = PARTICLE.cool;
  layer.lineWidth = PARTICLE.lineWidth;
  layer.beginPath();
  layer.moveTo(dot.x, dot.y);
  layer.lineTo(drift.x, drift.y);
  layer.stroke();
}

function drawParticle(runtime: HeroRuntime, dot: Dot, frame: Frame): void {
  const layer = runtime.pc;
  if (!layer) {
    return;
  }
  const drift = driftOf(runtime, dot);
  const arrive = arriveOf(runtime, dot);
  const target = targetOf(runtime, drift, arrive);
  if (frame.delta) {
    settle(dot, target, frame.delta);
  }
  paintDot(layer, dot, frame.fade, arrive);
  if (target.force > PARTICLE.forceFloor) {
    paintLink(layer, dot, drift, target.force * PARTICLE.lineAlpha * frame.fade);
  }
}

// The clock runs while the portrait is not yet in full view, and the particles arrive once loading has finished.
function advanceClock(runtime: HeroRuntime, fade: number, delta: number): void {
  if (runtime.motion && fade > 0) {
    runtime.particleTime += delta;
  }
  if (!runtime.motion) {
    runtime.particleIn = 1;
  } else if (!document.documentElement.classList.contains('hero-loading')) {
    runtime.particleIn = Math.min(1, runtime.particleIn + delta / PARTICLE.inSeconds);
  }
}

// Draws the particle field. Returns true while the field is still reacting, so the frame loop keeps going.
export function drawParticles(runtime: HeroRuntime, delta: number): boolean {
  const { pc: layer, pose, w, h } = runtime;
  if (!layer) {
    return false;
  }
  layer.clearRect(0, 0, w, h);
  const fade = Math.max(
    1 - Math.min(1, pose.open * PARTICLE.fadeOpen),
    pose.portrait * PARTICLE.fadePortrait,
  );
  advanceClock(runtime, fade, delta);
  for (const dot of runtime.particles) {
    drawParticle(runtime, dot, { delta, fade });
  }
  layer.globalAlpha = 1;
  return fade > 0 && runtime.motion;
}
