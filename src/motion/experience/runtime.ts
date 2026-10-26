import type { gsap, ScrollTrigger } from '../gsap';
import type { NavCharacterApi } from '../nav-character/mount';

// The state the Experience section's motion modules share.

export interface ExperienceRuntime {
  readonly root: HTMLElement;
  readonly stage: HTMLElement;
  readonly tape: HTMLElement;
  readonly tabs: HTMLButtonElement[];
  readonly tickers: HTMLElement[];
  readonly panels: HTMLElement[];
  readonly scenes: Element[];
  readonly strips: HTMLElement[];
  readonly years: number[];
  readonly abort: AbortController;
  readonly navPrism: NavCharacterApi;
  readonly reduced: MediaQueryList;
  readonly small: MediaQueryList;
  motion: boolean;
  enabled: boolean;
  destroyed: boolean;
  pinned: boolean;
  active: number;
  pending: number | null;
  lastPosition: number;
  context: gsap.Context | null;
  pin: ScrollTrigger | null;
  timelines: gsap.core.Timeline[];
  pendingTimer: ReturnType<typeof setTimeout> | undefined;
  timer: ReturnType<typeof setTimeout> | undefined;
}
