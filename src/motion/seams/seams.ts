import { gsap, ScrollTrigger } from '../gsap';

// The hand-offs between neighbouring sections on the journey. In the one-screen gap between two pins both stages are
// held fixed full-screen by a class, and only clips and filters are scrubbed, so nothing lags the page.
// Ported from the mockup's shared/seams.js.

type Kind = 'sweep' | 'dive' | 'curtain';

interface Seam {
  readonly from: string;
  readonly fromStage: string;
  readonly fromBg: string;
  readonly to: string;
  readonly toStage: string;
  readonly toBg: string;
  readonly kind: Kind;
}

interface Pair {
  readonly seam: Seam;
  readonly outgoing: HTMLElement;
  readonly outgoingStage: HTMLElement;
  readonly incoming: HTMLElement;
  readonly incomingStage: HTMLElement;
}

const SEAMS: readonly Seam[] = [
  // Work recedes into a dimmed card on near-black while Experience's paper is drawn across from left to right.
  {
    from: '.work',
    fromStage: '.work-stage',
    fromBg: 'var(--bg)',
    to: '.experience',
    toStage: '.x-stage',
    toBg: 'var(--xbg)',
    kind: 'sweep',
  },
  // Experience blurs and dims as Education's night opens as a growing circle from the ruler's needle.
  {
    from: '.experience',
    fromStage: '.x-stage',
    fromBg: 'var(--xbg)',
    to: '.credentials',
    toStage: '.c-stage',
    toBg: 'var(--cbg)',
    kind: 'dive',
  },
  // The finale rises as a curtain with rounded shoulders over Education, which dims and sinks back into the night.
  {
    from: '.credentials',
    fromStage: '.c-stage',
    fromBg: 'var(--cbg)',
    to: '.contact',
    toStage: '.k-stage',
    toBg: 'var(--kbg)',
    kind: 'curtain',
  },
];

export const JOURNEY_READY = 'journey:ready';
const HELD_CLASS = 'seam-held';
// !important beats the offset a finished pin leaves inline on its stage.
const HELD_STYLE = `.${HELD_CLASS}{position:fixed!important;top:0!important;left:0!important;right:0;transform:none!important;z-index:1}`;
const BACKDROP = '#0b0c10';
const FONT_WAIT_MS = 800;
const SETTLE_MS = 60;
const START = 0;
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
const UNCLIPPED = 'inset(0% 0% 0% 0%)';

// The clips and filters each kind scrubs over its gap. The incoming stage opens, the outgoing one recedes.
const MOTION: Record<Kind, (pair: Pair, timeline: gsap.core.Timeline) => void> = {
  sweep: ({ incomingStage, outgoingStage }, timeline) => {
    timeline
      .fromTo(
        incomingStage,
        { clipPath: 'inset(0% 100% 0% 0%)' },
        { clipPath: UNCLIPPED, ease: 'power2.inOut' },
        START,
      )
      .fromTo(
        outgoingStage,
        { clipPath: 'inset(0% 0% 0% 0% round 0px)', filter: 'brightness(1)' },
        {
          clipPath: 'inset(6% 5% 6% 5% round 28px)',
          filter: 'brightness(.45)',
          ease: 'power1.in',
        },
        START,
      );
  },
  dive: ({ incomingStage, outgoingStage }, timeline) => {
    timeline
      .fromTo(
        incomingStage,
        { clipPath: 'circle(0% at 50% 84%)' },
        { clipPath: 'circle(150% at 50% 84%)', ease: 'power2.in' },
        START,
      )
      // The clip keeps the blur inside the stage: it spilled into the scrollbar's gutter beside the incoming stage.
      .fromTo(
        outgoingStage,
        { filter: 'blur(0px) brightness(1)', clipPath: UNCLIPPED },
        { filter: 'blur(8px) brightness(.7)', clipPath: UNCLIPPED, ease: 'power1.in' },
        START,
      );
  },
  curtain: ({ incomingStage, outgoingStage }, timeline) => {
    timeline
      .fromTo(
        incomingStage,
        { clipPath: 'inset(100% 0% 0% 0% round 64px 64px 0px 0px)' },
        {
          clipPath: 'inset(0% 0% 0% 0% round 0px 0px 0px 0px)',
          ease: 'power2.inOut',
        },
        START,
      )
      .fromTo(
        outgoingStage,
        { clipPath: 'inset(0% 0% 0% 0% round 0px)', filter: 'brightness(1)' },
        {
          clipPath: 'inset(4% 3% 0% 3% round 24px 24px 0px 0px)',
          filter: 'brightness(.4)',
          ease: 'power1.in',
        },
        START,
      );
  },
};

// The two sections of a seam and their stages, when both are on the page and really are neighbours.
function pairOf(root: HTMLElement, seam: Seam): Pair | null {
  const outgoing = root.querySelector<HTMLElement>(seam.from);
  const incoming = root.querySelector<HTMLElement>(seam.to);
  if (!outgoing || !incoming || outgoing.nextElementSibling !== incoming) {
    return null;
  }
  const outgoingStage = outgoing.querySelector<HTMLElement>(seam.fromStage);
  const incomingStage = incoming.querySelector<HTMLElement>(seam.toStage);
  if (!outgoingStage || !incomingStage) {
    return null;
  }
  return { seam, outgoing, outgoingStage, incoming, incomingStage };
}

// The gap runs from the end of the outgoing section's pin to the start of the incoming section's pin.
function pinOf(element: HTMLElement): ScrollTrigger | undefined {
  return ScrollTrigger.getAll().find((trigger) => trigger.pin && trigger.trigger === element);
}

// One live seam: the trigger of its hold, and the hold that a reset never strips while another seam still holds a stage.
interface Live {
  readonly trigger: ScrollTrigger;
  readonly timeline: gsap.core.Timeline;
  readonly hold: () => void;
}

type Reset = () => void;

// Builds one seam: a scrubbed timeline over its gap that holds both stages while it plays.
function buildSeam(pair: Pair, live: Live[], resets: Reset[]): gsap.core.Timeline {
  const { seam, outgoing, outgoingStage, incoming, incomingStage } = pair;
  const clearBackdrop = (): void => {
    gsap.set([outgoing, incoming], { clearProps: 'backgroundColor' });
  };
  const reset: Reset = () => {
    outgoingStage.classList.remove(HELD_CLASS);
    incomingStage.classList.remove(HELD_CLASS);
    clearBackdrop();
    gsap.set([outgoingStage, incomingStage], { clearProps: 'clipPath,filter,backgroundColor' });
  };
  // Each held stage carries its section's live palette, so nothing else shows around a receding card. The sections behind
  // take the backdrop only inside the gap: held early, it showed through the scrollbar's gutter beside a pinned stage.
  const hold = (): void => {
    outgoingStage.style.backgroundColor = seam.fromBg;
    incomingStage.style.backgroundColor = seam.toBg;
    if (timeline.scrollTrigger?.isActive) {
      const backdrop = seam.kind === 'dive' ? getComputedStyle(outgoing).backgroundColor : BACKDROP;
      outgoing.style.backgroundColor = backdrop;
      incoming.style.backgroundColor = backdrop;
    }
    outgoingStage.classList.add(HELD_CLASS);
    incomingStage.classList.add(HELD_CLASS);
    // A reset cleared the clips, and a scrub that has not moved does not redraw them: before the gap that left the
    // incoming stage held open over the outgoing one.
    timeline.render(timeline.time(), true, true);
  };
  const timeline = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: incoming,
      start: () => pinOf(outgoing)?.end ?? START,
      end: () => pinOf(incoming)?.start ?? START,
      scrub: true,
      invalidateOnRefresh: true,
      refreshPriority: -10,
      onToggle: (self) => {
        if (!self.isActive) {
          clearBackdrop();
        }
        live.forEach((entry) => {
          if (entry.trigger.isActive) {
            entry.hold();
          }
        });
      },
    },
  });
  MOTION[seam.kind](pair, timeline);
  // The stages are held from a screen before the gap to a screen after it, but never outside the two pins, where each
  // stage is fixed at the top anyway: before the gap the incoming stage is held clipped shut, after it the incoming stage
  // covers the outgoing one. A scroll that runs ahead of the script (a phone's flick, a trackpad) so reaches the gap with
  // both stages already in place. Held only from the gap's edge, the next section slid in unclipped until the hold landed.
  const holding = ScrollTrigger.create({
    trigger: incoming,
    start: () => {
      const pin = pinOf(outgoing);
      return Math.max(pin?.start ?? START, (pin?.end ?? START) - innerHeight);
    },
    end: () => {
      const pin = pinOf(incoming);
      return Math.min(pin?.end ?? START, (pin?.start ?? START) + innerHeight);
    },
    invalidateOnRefresh: true,
    refreshPriority: -10,
    onToggle: (self) => {
      if (!self.isActive) {
        reset();
      }
      live.forEach((entry) => {
        if (entry.trigger.isActive) {
          entry.hold();
        }
      });
    },
  });
  live.push({ trigger: holding, timeline, hold });
  resets.push(reset);
  return timeline;
}

// A scrubbed tween reads its start values (computed styles, transforms) the first time the scroll reaches it, in the middle of
// the visitor's gesture. Each scroll timeline is rendered to its end and back once here, behind the loading surface, so they
// are read now. Events are suppressed, so nothing reacts to the round trip.
function warm(): void {
  ScrollTrigger.getAll().forEach((trigger) => {
    const animation = trigger.animation;
    if (animation) {
      const progress = animation.progress();
      animation.progress(1, true).progress(progress, true);
    }
  });
}

// Mounts every seam on the journey. Returns the cleanup, which removes the style and every seam's trigger.
function build(root: HTMLElement): () => void {
  const style = document.createElement('style');
  style.textContent = HELD_STYLE;
  document.head.append(style);
  const live: Live[] = [];
  const resets: Reset[] = [];
  const timelines = SEAMS.map((seam) => pairOf(root, seam))
    .filter((pair) => pair !== null)
    .map((pair) => buildSeam(pair, live, resets));
  // Measure every trigger with the stages back in their natural state.
  const refreshInit = (): void => {
    resets.forEach((reset) => {
      reset();
    });
  };
  // A refresh can clear a stage the active seam holds, and a scrub that has not moved does not redraw it, so it is redrawn here.
  const refreshed = (): void => {
    live.forEach((entry) => {
      if (entry.trigger.isActive) {
        entry.hold();
      }
    });
  };
  ScrollTrigger.addEventListener('refreshInit', refreshInit);
  ScrollTrigger.addEventListener('refresh', refreshed);
  ScrollTrigger.refresh();
  warm();
  // Marks the journey as joined, for anything that has to wait for the seams (the hero's loader and the e2e specs do).
  root.dataset.seams = 'ready';
  root.dispatchEvent(new Event(JOURNEY_READY));
  return () => {
    delete root.dataset.seams;
    ScrollTrigger.removeEventListener('refreshInit', refreshInit);
    ScrollTrigger.removeEventListener('refresh', refreshed);
    live.forEach((entry) => {
      entry.trigger.kill();
    });
    timelines.forEach((timeline) => {
      timeline.scrollTrigger?.kill();
      timeline.kill();
    });
    resets.forEach((reset) => {
      reset();
    });
    style.remove();
  };
}

// Mounts the seams once the sections have built their pins (they wait for fonts, bounded). Returns the cleanup.
export function mountSeams(root: HTMLElement): () => void {
  if (window.matchMedia(REDUCED_MOTION).matches) {
    return () => undefined;
  }
  let cancelled = false;
  let settle = 0;
  let teardown = (): void => undefined;
  const fonts = Promise.race([
    document.fonts.ready,
    new Promise<void>((done) => {
      window.setTimeout(done, FONT_WAIT_MS);
    }),
  ]);
  void fonts.then(() => {
    settle = window.setTimeout(() => {
      if (!cancelled) {
        teardown = build(root);
      }
    }, SETTLE_MS);
  });
  return () => {
    cancelled = true;
    window.clearTimeout(settle);
    teardown();
    teardown = () => undefined;
  };
}
