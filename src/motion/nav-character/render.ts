import type { gsap } from '../gsap';
import { mix, norm, shade, SPHERE, TINT, type Face, type Mesh, type Vec } from './mesh';

// Drawing for the nav character. Everything here reads the runtime and writes SVG attributes; nothing starts an animation.

export interface NavState {
  rx: number;
  ry: number;
  rz: number;
  turn: number;
  pop: number;
  look: number;
  lookY: number;
  blink: number;
  breath: number;
  jy: number;
  sq: number;
}

export type Mode = 'rest' | 'text' | 'action';

export interface FaceView {
  readonly ids: Face;
  readonly el: SVGPolygonElement;
  readonly jitter: number;
  depth: number;
}

export interface BlushView {
  readonly el: SVGEllipseElement;
  readonly at: Vec;
}

export interface MouthView {
  readonly smile: SVGPathElement;
  readonly open: SVGEllipseElement;
  readonly at: Vec;
}

export interface EyeView {
  readonly group: SVGGElement;
  readonly white: SVGEllipseElement;
  readonly pupil: SVGEllipseElement;
  readonly glint: SVGCircleElement;
  readonly glint2: SVGCircleElement;
  readonly at: Vec;
}

export interface Figure {
  readonly body: SVGGElement;
  readonly faces: FaceView[];
  readonly blush: BlushView[];
  readonly mouth: MouthView;
  readonly eyes: EyeView[];
}

export type Follow = Record<'rx' | 'ry' | 'rz' | 'look' | 'lookY', (value: number) => unknown>;

export interface NavCharacterRuntime {
  readonly root: HTMLElement;
  readonly button: HTMLButtonElement;
  readonly bubble: HTMLSpanElement;
  readonly mesh: Mesh;
  readonly figure: Figure;
  readonly state: NavState;
  readonly follow: Follow;
  enabled: boolean;
  visible: boolean;
  dead: boolean;
  mode: Mode;
  topic: string;
  drag: { x: number; y: number } | null;
  sequence: gsap.core.Timeline | null;
  breathing: gsap.core.Tween | null;
  blinkTimer: ReturnType<typeof setTimeout> | undefined;
  talkTimers: ReturnType<typeof setTimeout>[];
  lastLine: Record<string, number>;
  lastTopic: Record<string, number>;
}

const PROJECT = {
  perspective: 160,
  centreX: 50,
  centreY: 54,
  squashX: 0.12,
  breathX: 0.012,
  squashY: 0.14,
  breathY: 0.03,
  breathLift: 0.6,
  popGrow: 0.07,
} as const;
const SURFACE = { lift: 1.01 } as const;
const RIM = { facing: 1.4, side: 0.6, up: 0.2, base: 0.4, boost: 1.5, cap: 0.8 } as const;
const BLUSH = { minDepth: 0.2, rx: 3.8, ry: 2.2 } as const;
const MOUTH = {
  minDepth: 0.3,
  excited: 0.5,
  width: 2.2,
  dip: 0.4,
  curve: 2,
  openDrop: 0.3,
  openRx: 1.6,
  openRy: 2.1,
} as const;
const EYE = {
  minDepth: 0.25,
  grow: 0.12,
  lookX: 2,
  lookY: 1.8,
  whiteRx: 5.2,
  whiteRy: 6.2,
  whiteLift: 0.3,
  pupilRx: 3.4,
  pupilRy: 3.9,
  pupilLift: 0.2,
  glintX: 1.2,
  glintY: 1.4,
  glintR: 1.25,
  glint2X: 1.1,
  glintVisible: 0.4,
} as const;
const NONE = 'none';

export function usable(runtime: NavCharacterRuntime): boolean {
  return (
    runtime.enabled &&
    runtime.visible &&
    !document.hidden &&
    !document.documentElement.classList.contains('hero-loading')
  );
}

export function svgElement<T extends SVGElement>(
  tag: string,
  attributes: Record<string, string> = {},
): T {
  const element = document.createElementNS('http://www.w3.org/2000/svg', tag) as T;
  for (const [name, value] of Object.entries(attributes)) {
    element.setAttribute(name, value);
  }
  return element;
}

// Rotates a point by the head's pitch, roll and yaw (yaw includes the spin when the character is poked).
function rotate(point: Vec, state: NavState): Vec {
  const [across, up, depth] = point;
  const yaw = state.ry + state.turn;
  const cosYaw = Math.cos(yaw);
  const sinYaw = Math.sin(yaw);
  const cosX = Math.cos(state.rx);
  const sinX = Math.sin(state.rx);
  const cosZ = Math.cos(state.rz);
  const sinZ = Math.sin(state.rz);
  const xYaw = across * cosYaw + depth * sinYaw;
  const zYaw = -across * sinYaw + depth * cosYaw;
  const yPitch = up * cosX - zYaw * sinX;
  const zPitch = up * sinX + zYaw * cosX;
  return [xYaw * cosZ - yPitch * sinZ, xYaw * sinZ + yPitch * cosZ, zPitch];
}

// Perspective projection with breathing, squash and stretch, and the hop, around the character's centre.
function project(point: Vec, scale: number, state: NavState): Vec {
  const [across, up, depth] = point;
  const zoom = (PROJECT.perspective / (PROJECT.perspective - depth)) * scale;
  const squashX = 1 + state.sq * PROJECT.squashX + state.breath * PROJECT.breathX;
  const squashY = 1 - state.sq * PROJECT.squashY + state.breath * PROJECT.breathY;
  return [
    PROJECT.centreX + across * zoom * squashX,
    PROJECT.centreY + up * zoom * squashY - state.jy - state.breath * PROJECT.breathLift,
  ];
}

function fixed(value: number): string {
  return value.toFixed(2);
}

function setAttributes(element: Element, attributes: Record<string, number | string>): void {
  for (const [name, value] of Object.entries(attributes)) {
    element.setAttribute(name, typeof value === 'number' ? fixed(value) : value);
  }
}

function minus(first: Vec, second: Vec): Vec {
  return first.map((value, index) => value - second[index]);
}

function cross(first: Vec, second: Vec): Vec {
  return [
    first[1] * second[2] - first[2] * second[1],
    first[2] * second[0] - first[0] * second[2],
    first[0] * second[1] - first[1] * second[0],
  ];
}

function colourFace(face: FaceView, normal: Vec): void {
  const rim =
    Math.max(0, 1 - normal[2] * RIM.facing) *
    Math.max(0, normal[0] * RIM.side - normal[1] * RIM.up + RIM.base);
  const colour = `rgb(${mix(shade(normal, face.jitter), TINT.rim, Math.min(RIM.cap, rim * RIM.boost))})`;
  face.el.setAttribute('fill', colour);
  face.el.setAttribute('stroke', colour);
}

// Draws the front-facing faces, back to front, and hides the rest.
function drawFaces(runtime: NavCharacterRuntime, points: Vec[], scale: number): void {
  const shown: FaceView[] = [];
  for (const face of runtime.figure.faces) {
    const corners = face.ids.map((index) => points[index]);
    const normal = norm(cross(minus(corners[1], corners[0]), minus(corners[2], corners[0])));
    if (normal[2] < 0) {
      face.el.style.display = NONE;
      continue;
    }
    colourFace(face, normal);
    face.el.style.display = '';
    face.el.setAttribute(
      'points',
      corners.map((point) => project(point, scale, runtime.state).map(fixed).join(',')).join(' '),
    );
    face.depth = corners.reduce((sum, point) => sum + point[2], 0) / corners.length;
    shown.push(face);
  }
  shown
    .sort((first, second) => first.depth - second.depth)
    .forEach((face) => {
      runtime.figure.body.append(face.el);
    });
}

// A point on the face (blush, mouth, eyes) as it sits after the head turned, and how far it faces the viewer.
function surface(
  runtime: NavCharacterRuntime,
  spot: Vec,
  scale: number,
): { point: Vec; depth: number } {
  const rotated = rotate(
    spot.map((value) => value * SPHERE.radius * SURFACE.lift),
    runtime.state,
  );
  return {
    point: project(rotated, scale, runtime.state),
    depth: rotated[2] / SPHERE.radius,
  };
}

function drawBlush(runtime: NavCharacterRuntime, scale: number): void {
  for (const blush of runtime.figure.blush) {
    const { point, depth } = surface(runtime, blush.at, scale);
    blush.el.style.display = depth > BLUSH.minDepth ? '' : NONE;
    setAttributes(blush.el, {
      cx: point[0],
      cy: point[1],
      rx: BLUSH.rx * depth,
      ry: BLUSH.ry * depth,
    });
  }
}

function drawMouth(runtime: NavCharacterRuntime, scale: number): void {
  const { mouth } = runtime.figure;
  const { state } = runtime;
  const { point, depth } = surface(runtime, mouth.at, scale);
  const excited = state.pop > MOUTH.excited;
  const facing = depth > MOUTH.minDepth;
  mouth.smile.style.display = facing && !excited ? '' : NONE;
  mouth.open.style.display = facing && excited ? '' : NONE;
  const left = point[0] - MOUTH.width * depth;
  const right = point[0] + MOUTH.width * depth;
  mouth.smile.setAttribute(
    'd',
    `M${fixed(left)} ${fixed(point[1] - MOUTH.dip)}Q${fixed(point[0])} ${fixed(point[1] + MOUTH.curve)} ${fixed(right)} ${fixed(point[1] - MOUTH.dip)}`,
  );
  setAttributes(mouth.open, {
    cx: point[0],
    cy: point[1] + MOUTH.openDrop,
    rx: MOUTH.openRx * depth,
    ry: MOUTH.openRy * state.pop,
  });
}

function drawEye(runtime: NavCharacterRuntime, eye: EyeView, scale: number): void {
  const { point, depth } = surface(runtime, eye.at, scale);
  const shown = depth > EYE.minDepth;
  eye.group.style.display = shown ? '' : NONE;
  if (shown) {
    drawEyeball(eye, point, depth, runtime.state);
  }
}

function drawEyeball(eye: EyeView, point: Vec, depth: number, state: NavState): void {
  const open = 1 - state.blink;
  const big = 1 + state.pop * EYE.grow;
  const pupilX = point[0] + state.look * EYE.lookX;
  const pupilY = point[1] + state.lookY * EYE.lookY;
  setAttributes(eye.white, {
    cx: point[0],
    cy: point[1],
    rx: EYE.whiteRx * depth * big,
    ry: EYE.whiteRy * open * big + EYE.whiteLift,
  });
  setAttributes(eye.pupil, {
    cx: pupilX,
    cy: pupilY,
    rx: EYE.pupilRx * depth * big,
    ry: EYE.pupilRy * open * big + EYE.pupilLift,
  });
  setAttributes(eye.glint, {
    cx: pupilX - EYE.glintX,
    cy: pupilY - EYE.glintY * open,
    r: EYE.glintR * big,
  });
  setAttributes(eye.glint2, { cx: pupilX + EYE.glint2X, cy: pupilY + open });
  const glintShown = open > EYE.glintVisible ? '' : NONE;
  eye.glint.style.display = glintShown;
  eye.glint2.style.display = glintShown;
}

// Redraws the whole character for the current state. Called on every frame that something moves.
export function render(runtime: NavCharacterRuntime): void {
  if (runtime.dead) {
    return;
  }
  const scale = 1 + runtime.state.pop * PROJECT.popGrow;
  const points = runtime.mesh.vertices.map((point) => rotate(point, runtime.state));
  drawFaces(runtime, points, scale);
  drawBlush(runtime, scale);
  drawMouth(runtime, scale);
  for (const eye of runtime.figure.eyes) {
    drawEye(runtime, eye, scale);
  }
}
