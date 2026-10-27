import type { gsap } from '../gsap';
import type { NavCharacterApi } from '../nav-character/mount';
import type { PortraitApi } from './portrait';

// The state the hero's motion modules share. Each field is written by one module and read by the others.

interface Pose {
  open: number;
  travel: number;
  portrait: number;
  cover: number;
  journey: number;
}

export interface Point {
  x: number;
  y: number;
  t: number;
}

export interface Dot {
  readonly ax: number;
  readonly ay: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  readonly r: number;
  readonly alpha: number;
  readonly warm: boolean;
  readonly phase: number;
  readonly speed: number;
  readonly drift: number;
}

export interface HeroRuntime {
  readonly root: HTMLElement;
  readonly stage: HTMLElement;
  readonly canvas: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D;
  readonly base: HTMLCanvasElement;
  readonly baseCtx: CanvasRenderingContext2D;
  readonly particleCanvas: HTMLCanvasElement | null;
  readonly pc: CanvasRenderingContext2D | null;
  readonly cursor: HTMLElement;
  readonly tilt: HTMLElement;
  readonly rail: HTMLElement;
  readonly railItems: HTMLElement[];
  readonly phaseTitles: HTMLElement[];
  readonly pose: Pose;
  readonly trails: Point[];
  readonly particles: Dot[];
  readonly pointer: { x: number; y: number; inside: boolean };
  readonly ring: { x: number; y: number };
  readonly spin: { x: number; y: number; targetX: number; targetY: number };
  readonly abort: AbortController;
  readonly portrait: PortraitApi;
  readonly navPrism: NavCharacterApi;
  readonly reduced: MediaQueryList;
  readonly small: MediaQueryList;
  readonly fine: MediaQueryList;
  w: number;
  h: number;
  motion: boolean;
  ready: boolean;
  // The journey below has built (always true off the journey); until then the loader holds.
  built: boolean;
  destroyed: boolean;
  visible: boolean;
  frame: number;
  lastTime: number;
  lastPoint: Point | null;
  phase: number;
  particleTime: number;
  particleIn: number;
  context: gsap.Context | null;
  story: gsap.core.Timeline | null;
  arrival: gsap.core.Timeline | null;
  timer: ReturnType<typeof setTimeout> | undefined;
}
