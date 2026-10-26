import { gsap, ScrollTrigger } from '../gsap';
import { need } from '../dom';
import { mountNavCharacter } from '../nav-character/mount';
import type { SectionApi } from '../types';
import { type Cable, drawCable, placePacket, setLink } from './cable';
import { CONTACT } from './constants';
import { type Magnet, magnetFor, onPointer, type Room, rest } from './pointer';
import { lightWords, span, splitTyped, splitWords, sweepSelection, typeChars } from './typing';

// Mounts the Contact finale: a router whose ports are the ways in, the handshake along the visitor's cable, and the email.
// Ported from the mockup's 06-contact/script.js. React calls the returned destroy() on unmount.

const SMALL_QUERY = '(max-width:600px)';
const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';
const FINE_QUERY = '(hover:hover) and (pointer:fine)';
const THEME = 'contact';
const COPIED = 'Copied';
const COPY = 'Copy';

interface Keys {
  readonly rolls: HTMLElement[];
  readonly rollIns: HTMLElement[];
  readonly alts: HTMLElement[];
  readonly pairs: Element[][];
}

interface ContactRuntime {
  readonly room: Room;
  readonly cable: Cable;
  readonly copy: HTMLElement;
  readonly copyLabel: Element;
  readonly status: HTMLElement;
  readonly sel: HTMLElement;
  readonly keys: Keys;
  readonly chars: HTMLElement[];
  readonly words: HTMLElement[];
  readonly abort: AbortController;
  readonly navPrism: ReturnType<typeof mountNavCharacter>;
  readonly reduced: MediaQueryList;
  readonly fine: MediaQueryList;
  readonly small: MediaQueryList;
  motion: boolean;
  enabled: boolean;
  pinned: boolean;
  progress: number;
  destroyed: boolean;
  pin: ScrollTrigger | null;
  context: gsap.Context | null;
  loop: gsap.core.Timeline | null;
  magnet: Magnet | null;
  follow: (() => void) | null;
  // Whether the stage is on screen, kept by an observer so the per-frame check never measures layout.
  visible: boolean;
  watch: IntersectionObserver | null;
  copied: ReturnType<typeof setTimeout> | undefined;
  timer: ReturnType<typeof setTimeout> | undefined;
}

function keysOf(root: HTMLElement): Keys {
  const rollIns = [...root.querySelectorAll<HTMLElement>('.k-key .k-roll-in')];
  const alts = [...rollIns[0].children] as HTMLElement[];
  return {
    rolls: [...root.querySelectorAll<HTMLElement>('.k-key .k-roll')],
    rollIns,
    alts,
    pairs: alts.map((_alt, index) => rollIns.map((rollIn) => rollIn.children[index])),
  };
}

function theme(runtime: ContactRuntime): void {
  const html = document.documentElement;
  if (!runtime.enabled || runtime.pinned) {
    html.dataset.palette = THEME;
  } else if (html.dataset.palette === THEME) {
    delete html.dataset.palette;
  }
}

function draw(runtime: ContactRuntime): void {
  drawCable(runtime.cable);
  placePacket(runtime.cable, runtime.progress, runtime.enabled);
}

// The loop: the key word rolls through build, ship, scale, launch and back to build. It only runs at the end of the pin.
function looping(runtime: ContactRuntime, progress: number): void {
  const loop = runtime.loop;
  if (!loop) {
    return;
  }
  const isOn = progress >= CONTACT.loop;
  runtime.room.stage.parentElement?.classList.toggle('is-looping', isOn);
  if (isOn) {
    if (!loop.isActive()) {
      loop.play();
    }
  } else if (loop.time()) {
    loop.pause(0);
  }
}

// The headline's typing, the description's lights, the selection's sweep, the link, the loop and the cable, by scroll.
function apply(runtime: ContactRuntime, progress: number): void {
  runtime.progress = progress;
  typeChars(
    runtime.room.stage.parentElement ?? runtime.room.stage,
    runtime.chars,
    span(progress, CONTACT.type.from, CONTACT.type.to),
  );
  lightWords(runtime.words, progress);
  sweepSelection(runtime.sel, progress);
  setLink(runtime.cable, progress, runtime.enabled);
  looping(runtime, progress);
  draw(runtime);
}

// Each word of the key word is measured, and the loop swipes sideways between them, paper and ink copies together.
function buildLoop(runtime: ContactRuntime): gsap.core.Timeline {
  const { keys } = runtime;
  const emSize = parseFloat(getComputedStyle(keys.rollIns[0]).fontSize);
  const widths = keys.alts.map((alt) => alt.offsetWidth);
  const widest = Math.max(...widths);
  const away = (index: number): number => (CONTACT.swipeClear * widest) / widths[index];
  gsap.set(keys.rolls, { width: `${widths[0] / emSize}em` });
  keys.pairs.forEach((pair, index) => {
    gsap.set(pair, { xPercent: index ? away(index) : 0 });
  });
  const loop = gsap.timeline({
    paused: true,
    repeat: -1,
    defaults: { duration: CONTACT.loopDuration, ease: 'power3.inOut' },
  });
  for (let index = 1; index < keys.alts.length; index++) {
    const label = `swap${index}`;
    loop
      .addLabel(label, `+=${CONTACT.wordsPeriod}`)
      .to(keys.pairs[index - 1], { xPercent: -away(index - 1) }, label)
      .fromTo(
        keys.pairs[index],
        { xPercent: away(index) },
        { xPercent: 0, immediateRender: false },
        label,
      )
      .to(keys.rolls, { width: `${widths[index] / emSize}em` }, label);
  }
  return loop;
}

function createPin(runtime: ContactRuntime): ScrollTrigger {
  return ScrollTrigger.create({
    trigger: runtime.room.stage.parentElement ?? runtime.room.stage,
    pin: runtime.room.stage,
    start: 'top top',
    end: () => `+=${innerHeight * CONTACT.pin.height}`,
    invalidateOnRefresh: true,
    refreshPriority: CONTACT.pin.refresh,
    onUpdate: (self) => {
      const pinnedNow = self.progress > 0;
      if (runtime.pinned !== pinnedNow) {
        runtime.pinned = pinnedNow;
        theme(runtime);
      }
      apply(runtime, self.progress);
    },
    onRefresh: (self) => {
      apply(runtime, self.progress);
    },
  });
}

// The cable is redrawn every frame while the stage is on screen: the pointer moves both of its ends, not only scroll.
function startFollow(runtime: ContactRuntime): void {
  runtime.watch = new IntersectionObserver(([entry]) => {
    runtime.visible = entry.isIntersecting;
  });
  runtime.watch.observe(runtime.room.stage);
  runtime.follow = () => {
    if (runtime.visible) {
      draw(runtime);
    }
  };
  gsap.ticker.add(runtime.follow);
}

// Puts the room back to rest: the light, the pinned visuals and the typed letters.
function clearVisuals(runtime: ContactRuntime): void {
  runtime.room.stage.parentElement?.classList.remove(
    'is-looping',
    'is-typed',
    'is-linked',
    'is-sending',
  );
  runtime.sel.style.removeProperty('--sel');
  runtime.words.forEach((word) => {
    word.classList.remove('is-lit');
  });
  runtime.chars.forEach((character) => {
    character.classList.remove('is-hidden', 'is-caret', 'is-caret-0');
  });
  runtime.cable.ports.forEach((port) => {
    port.classList.remove('is-up');
  });
}

function dispose(runtime: ContactRuntime): void {
  if (runtime.follow) {
    gsap.ticker.remove(runtime.follow);
  }
  runtime.watch?.disconnect();
  runtime.watch = null;
  runtime.visible = false;
  runtime.context?.revert();
  runtime.context = null;
  runtime.pin = null;
  runtime.loop = null;
  runtime.magnet = null;
  runtime.follow = null;
  runtime.pinned = false;
  clearVisuals(runtime);
  if (document.documentElement.dataset.palette === THEME) {
    delete document.documentElement.dataset.palette;
  }
}

function setup(runtime: ContactRuntime): void {
  dispose(runtime);
  runtime.enabled = runtime.motion;
  runtime.navPrism.setMotion(runtime.enabled);
  const section = runtime.room.stage.parentElement;
  section?.classList.toggle('is-enhanced', runtime.enabled);
  section?.classList.toggle('is-static', !runtime.enabled);
  if (!runtime.enabled) {
    apply(runtime, 1);
    theme(runtime);
    return;
  }
  runtime.context = gsap.context(() => {
    runtime.loop = buildLoop(runtime);
    runtime.pin = createPin(runtime);
    startFollow(runtime);
    if (runtime.fine.matches) {
      runtime.magnet = magnetFor(runtime.room);
    }
  }, runtime.room.stage.parentElement ?? runtime.room.stage);
  apply(runtime, 0);
  theme(runtime);
  ScrollTrigger.refresh();
}

// Copies the address to the clipboard and says so for a moment; where the clipboard is blocked it shows the address instead.
async function copyAddress(runtime: ContactRuntime): Promise<void> {
  clearTimeout(runtime.copied);
  const address = runtime.copy.dataset.copy ?? '';
  try {
    await navigator.clipboard.writeText(address);
    runtime.copyLabel.textContent = COPIED;
    runtime.status.textContent = 'Email address copied.';
  } catch {
    runtime.status.textContent = `Copy is blocked here. The address is ${address}.`;
  }
  runtime.copied = setTimeout(() => {
    runtime.copyLabel.textContent = COPY;
    runtime.status.textContent = '';
  }, CONTACT.copy.feedback);
}

function createRuntime(root: HTMLElement, abort: AbortController): ContactRuntime {
  const stage = need<HTMLElement>(root, '.k-stage');
  const room: Room = {
    stage,
    you: need<HTMLElement>(root, '.k-you'),
    chassis: need<HTMLElement>(root, '.k-chassis'),
    email: need<HTMLElement>(root, '.k-email'),
  };
  const cable: Cable = {
    stage,
    wire: need<SVGSVGElement>(root, '.k-wire'),
    cable: need<SVGPathElement>(root, '.k-cable'),
    packet: need<SVGGElement>(root, '.k-packet'),
    packetText: need<SVGTextElement>(root, '.k-packet text'),
    youDot: need<HTMLElement>(root, '.k-you-dot'),
    uplink: need<HTMLElement>(root, '.k-uplink .k-plug'),
    ports: [...root.querySelectorAll<HTMLElement>('.k-port')],
    stateText: need<HTMLElement>(root, '.k-state-text'),
    root,
  };
  const reduced = matchMedia(REDUCED_QUERY);
  return {
    room,
    cable,
    copy: need<HTMLElement>(root, '.k-copy'),
    copyLabel: need(root, '.k-copy-label'),
    status: need<HTMLElement>(root, '.k-status'),
    sel: need<HTMLElement>(root, '.k-sel'),
    keys: keysOf(root),
    chars: splitTyped(root),
    words: splitWords(need(root, '.k-sub')),
    abort,
    navPrism: mountNavCharacter(root),
    reduced,
    fine: matchMedia(FINE_QUERY),
    small: matchMedia(SMALL_QUERY),
    motion: !reduced.matches,
    enabled: false,
    pinned: false,
    progress: 0,
    destroyed: false,
    pin: null,
    context: null,
    loop: null,
    magnet: null,
    follow: null,
    visible: false,
    watch: null,
    copied: undefined,
    timer: undefined,
  };
}

// Waits for the fonts (or 800 ms) so the cable measures correctly, then builds the motion.
function startWhenReady(runtime: ContactRuntime): void {
  Promise.race([
    document.fonts.ready,
    new Promise<void>((resolve) => {
      runtime.timer = setTimeout(() => {
        resolve();
      }, CONTACT.fallback);
    }),
  ]).then(() => {
    clearTimeout(runtime.timer);
    if (!runtime.destroyed) {
      setup(runtime);
    }
  });
}

// Mounts the contact section on its root. Returns the section API that React calls on unmount.
export function mountContact(root: HTMLElement): SectionApi {
  const abort = new AbortController();
  const runtime = createRuntime(root, abort);
  const { stage } = runtime.room;
  stage.addEventListener(
    'pointermove',
    (event) => {
      if (runtime.magnet && event.pointerType !== 'touch') {
        onPointer(runtime.room, runtime.magnet, event);
      }
    },
    { signal: abort.signal },
  );
  stage.addEventListener(
    'pointerleave',
    () => {
      if (runtime.magnet) {
        rest(runtime.room, runtime.magnet);
      }
    },
    { signal: abort.signal },
  );
  runtime.copy.addEventListener(
    'click',
    () => {
      void copyAddress(runtime);
    },
    { signal: abort.signal },
  );
  window.addEventListener(
    'resize',
    () => {
      if (!runtime.enabled) {
        draw(runtime);
      }
    },
    { signal: abort.signal },
  );
  runtime.reduced.addEventListener(
    'change',
    () => {
      runtime.motion = !runtime.reduced.matches;
      setup(runtime);
    },
    { signal: abort.signal },
  );
  startWhenReady(runtime);
  return {
    get state() {
      return { motion: runtime.motion, pin: runtime.pin !== null, progress: runtime.progress };
    },
    destroy() {
      runtime.destroyed = true;
      runtime.navPrism.destroy();
      clearTimeout(runtime.timer);
      clearTimeout(runtime.copied);
      dispose(runtime);
      abort.abort();
      root.classList.remove('is-enhanced', 'is-static');
    },
  };
}
