import type { gsap, ScrollTrigger } from '../gsap';
import type { NavCharacterApi } from '../nav-character/mount';

// The state the Education section's motion modules share.

interface Lean {
  readonly x: (value: number) => unknown;
  readonly y: (value: number) => unknown;
}

export interface EducationRuntime {
  readonly root: HTMLElement;
  readonly stage: HTMLElement;
  readonly tabs: HTMLButtonElement[];
  readonly panels: HTMLElement[];
  readonly seals: SVGGElement[];
  readonly turns: SVGGElement[];
  readonly deck: HTMLElement;
  readonly cards: HTMLElement[];
  readonly dialog: HTMLDialogElement;
  readonly front: HTMLElement;
  readonly filters: HTMLButtonElement[];
  readonly units: number[];
  readonly starts: number[];
  readonly total: number;
  readonly certificates: number;
  readonly abort: AbortController;
  readonly navPrism: NavCharacterApi;
  readonly reduced: MediaQueryList;
  readonly small: MediaQueryList;
  readonly fine: MediaQueryList;
  motion: boolean;
  enabled: boolean;
  destroyed: boolean;
  pinned: boolean;
  active: number;
  pending: number | null;
  picked: number;
  filter: string;
  lean: Lean | null;
  context: gsap.Context | null;
  pin: ScrollTrigger | null;
  deal: gsap.core.Timeline | null;
  marks: gsap.core.Timeline[];
  pendingTimer: ReturnType<typeof setTimeout> | undefined;
  timer: ReturnType<typeof setTimeout> | undefined;
}
