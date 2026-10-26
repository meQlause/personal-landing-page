import type { gsap, ScrollTrigger } from '../gsap';
import type { NavCharacterApi } from '../nav-character/mount';

// The state the Work section's motion modules share.

export interface Point {
  x: number;
  y: number;
}

// One of the elements that react to the cursor with a damped spring.
export interface Reactor {
  readonly el: SVGGraphicsElement;
  readonly scene: Element | null;
  ox: number;
  oy: number;
  vx: number;
  vy: number;
}

// The Simpul thread: how far it has untied, and how far the message (bead) has travelled along the route.
interface Thread {
  untie: number;
  bead: number;
}

export interface WorkRuntime {
  readonly root: HTMLElement;
  readonly stage: HTMLElement;
  readonly art: SVGSVGElement;
  readonly tabs: HTMLButtonElement[];
  readonly panels: HTMLElement[];
  readonly scenes: Element[];
  readonly products: string[];
  readonly reactors: Reactor[];
  readonly knot: Point[];
  readonly route: Float32Array;
  readonly sway: { x: Float32Array; y: Float32Array; vx: Float32Array; vy: Float32Array };
  readonly thread: Thread;
  readonly quartz: { u: number };
  readonly pointer: { cx: number; cy: number; inside: boolean };
  readonly abort: AbortController;
  readonly navPrism: NavCharacterApi;
  readonly reduced: MediaQueryList;
  readonly small: MediaQueryList;
  readonly fine: MediaQueryList;
  routeFor: number;
  motion: boolean;
  enabled: boolean;
  destroyed: boolean;
  visible: boolean;
  pinned: boolean;
  active: number;
  pending: number | null;
  scrollProgress: number;
  frame: number;
  last: number;
  timelines: gsap.core.Timeline[];
  context: gsap.Context | null;
  pin: ScrollTrigger | null;
  themeTimer: ReturnType<typeof setTimeout> | undefined;
  pendingTimer: ReturnType<typeof setTimeout> | undefined;
  timer: ReturnType<typeof setTimeout> | undefined;
  agaroCount: Element;
  guide: SVGPathElement;
  threadPath: SVGPathElement;
  carrier: SVGGraphicsElement;
}
