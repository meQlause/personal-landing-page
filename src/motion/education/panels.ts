import { gsap } from '../gsap';
import { CERT_STATES, EDUCATION, STATES } from './constants';
import type { EducationRuntime } from './runtime';

// One panel's scroll timeline, ported from the mockup's 05-credentials/script.js. State 0: the words flip in like index cards,
// the rest of the panel rises, then the selection sweeps across the key word. Each later state: the key word swipes sideways
// to its next alternate (the paper and ink copies together) while the box eases to the new width. A school panel ends by
// lifting away, so the next one takes over without a jump. Each state ends in a hold, so it is finished before the next begins.

const CLEAR = EDUCATION.swipe.clear;
const WORD_FADE = {
  duration: EDUCATION.word.duration,
  stagger: EDUCATION.word.stagger,
  ease: EDUCATION.word.ease,
};

// The key word: its alternates in pairs (paper copy, ink copy), each pair pushed out of the window except the first.
function keyWord(panel: HTMLElement): {
  readonly sel: Element;
  readonly rolls: HTMLElement[];
  readonly pairs: Element[][];
  readonly em: number;
  readonly widths: number[];
} | null {
  const key = panel.querySelector('.c-key');
  if (!key) {
    return null;
  }
  const sel = key.querySelector('.c-sel') as Element;
  const rolls = [...key.querySelectorAll<HTMLElement>('.c-roll')];
  const ins = rolls.map((roll) => roll.firstElementChild as HTMLElement);
  const pairs = [...ins[0].children].map((_alternate, index) =>
    ins.map((roll) => roll.children[index]),
  );
  const emSize = parseFloat(getComputedStyle(ins[0]).fontSize);
  const widths = pairs.map(([alternate]) => (alternate as HTMLElement).offsetWidth);
  return { sel, rolls, pairs, em: emSize, widths: widths };
}

// The distance an alternate must move to clear the window: the widest alternate, scaled to its own width.
function awayOf(widths: number[], index: number): number {
  return (CLEAR * Math.max(...widths)) / widths[index];
}

function addKeyRows(
  timeline: gsap.core.Timeline,
  key: NonNullable<ReturnType<typeof keyWord>>,
): void {
  const { sel, rolls, pairs, em, widths } = key;
  gsap.set(rolls, { width: `${widths[0] / em}em` });
  pairs.forEach((pair, index) => {
    gsap.set(pair, { xPercent: index ? awayOf(widths, index) : 0 });
  });
  timeline.fromTo(
    sel,
    { '--sel': 0 },
    { '--sel': 1, duration: EDUCATION.sweep.duration, ease: EDUCATION.sweep.ease },
    EDUCATION.sweep.at,
  );
  for (let index = 1; index < pairs.length && index < STATES; index++) {
    timeline
      .to(
        pairs[index - 1],
        {
          xPercent: -awayOf(widths, index - 1),
          duration: EDUCATION.swipe.duration,
          ease: EDUCATION.swipe.ease,
        },
        index,
      )
      .fromTo(
        pairs[index],
        { xPercent: awayOf(widths, index) },
        {
          xPercent: 0,
          duration: EDUCATION.swipe.duration,
          ease: EDUCATION.swipe.ease,
          immediateRender: false,
        },
        index,
      )
      .to(
        rolls,
        {
          width: `${widths[index] / em}em`,
          duration: EDUCATION.swipe.duration,
          ease: EDUCATION.swipe.ease,
        },
        index,
      );
  }
}

// Builds one panel's timeline, padded to its length so its progress maps one-to-one onto its scroll.
export function buildPanel(runtime: EducationRuntime, index: number): gsap.core.Timeline {
  const panel = runtime.panels[index];
  // Built with the panel briefly shown: GSAP reads a hidden element's transform by moving it out of the DOM, which drops the
  // space between words onto the wrong side. Widths need it shown too.
  const wasHidden = panel.hidden;
  panel.hidden = false;
  const timeline = gsap.timeline({ paused: true });
  const words = panel.querySelectorAll('.c-word');
  const rest = panel.querySelectorAll('.c-period, .c-degree, .c-inst, .c-stamps li, .c-caption');
  timeline
    .fromTo(
      words,
      {
        rotationY: EDUCATION.word.from,
        transformPerspective: EDUCATION.word.perspective,
        transformOrigin: '0% 50%',
        autoAlpha: 0,
      },
      { rotationY: 0, autoAlpha: 1, ...WORD_FADE, stagger: EDUCATION.word.stagger / words.length },
      0,
    )
    .fromTo(
      rest,
      { y: EDUCATION.rest.from, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: EDUCATION.rest.duration,
        stagger: EDUCATION.rest.stagger,
        ease: EDUCATION.rest.ease,
      },
      EDUCATION.rest.at,
    );
  const key = keyWord(panel);
  if (key) {
    addKeyRows(timeline, key);
  }
  if (index !== runtime.certificates) {
    timeline.to(
      [...words, ...rest],
      {
        y: -EDUCATION.lift.distance,
        autoAlpha: 0,
        duration: EDUCATION.lift.duration,
        stagger: EDUCATION.lift.stagger,
        ease: EDUCATION.lift.ease,
      },
      runtime.units[index] + EDUCATION.lift.at,
    );
  }
  panel.hidden = wasHidden;
  return timeline.set({}, {}, runtime.units[index]);
}

// The length of each panel in states: three per school, one and a half for the certificates (they land, then hold).
export function unitsOf(panelCount: number, certificates: number): number[] {
  return Array.from({ length: panelCount }, (_unused, index) =>
    index === certificates ? CERT_STATES : STATES,
  );
}
