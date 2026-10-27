import { gsap } from '../gsap';
import { EASE } from './story-steps';
import type { HeroRuntime } from './runtime';

// The intro: the wordmark is held at the centre of the stage, the headline unfolds from two folds, and the wordmark travels
// back to its place in the navbar. Ported from the mockup's 01-hero/script.js (the `intro` branch of `setup`).

const FOLD = {
  maxDepth: 36,
  depthRatio: 0.24,
  depthPlus: 2,
  maxShoulder: 20,
  shoulderRatio: 0.045,
  returnRatio: 1.65,
  clip: { top: 10, side: 5, trail: 25, full: 100 },
  measure: { inset: 5, grow: 10 },
};
const LOGO = { min: 220, max: 380, ratio: 0.27 };
const LABEL = { unfold: 'unfold', headline: 'headline' };
const ARRIVAL = { seam: 0.3, hold: 2.35, unfold: 2.4 };

interface Box {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

// One headline fold: its measured box, the SVG parts that draw it, the word it uncovers, and how far it has unfolded.
export interface Fold {
  readonly box: Box;
  readonly group: Element;
  readonly face: Element;
  readonly ret: Element;
  readonly edge: Element;
  readonly word: HTMLElement;
  progress: number;
}

function drawFold(fold: Fold): void {
  const { box } = fold;
  const left = box.x;
  const right = left + box.width;
  const swing = Math.sin(Math.PI * fold.progress);
  const edge = box.y + box.height * fold.progress;
  const depth = swing * Math.min(FOLD.maxDepth, box.height * FOLD.depthRatio) + FOLD.depthPlus;
  const shoulder = swing * Math.min(FOLD.maxShoulder, box.width * FOLD.shoulderRatio);
  const lower = edge + depth;
  const deepest = edge + depth * FOLD.returnRatio;
  fold.face.setAttribute(
    'd',
    `M${left} ${edge} L${right} ${edge} L${right - shoulder} ${lower} L${left + shoulder} ${lower} Z`,
  );
  fold.ret.setAttribute(
    'd',
    `M${left + shoulder} ${lower} L${right - shoulder} ${lower} L${right} ${deepest} L${left} ${deepest} Z`,
  );
  fold.edge.setAttribute('d', `M${left} ${edge} H${right}`);
  // One value owns both the physical opening edge and the text it uncovers.
  const cover = (1 - fold.progress) * FOLD.clip.full - fold.progress * FOLD.clip.trail;
  fold.word.style.clipPath = `inset(-${FOLD.clip.top}% -${FOLD.clip.side}% ${cover}% -${FOLD.clip.side}%)`;
}

// Measures the two headline words and their folds, in the stage's own coordinates.
export function measureFolds(runtime: HeroRuntime): Fold[] {
  const stageBounds = runtime.stage.getBoundingClientRect();
  const words = [...runtime.root.querySelectorAll<HTMLElement>('.title-word')];
  const groups = [...runtime.root.querySelectorAll('.headline-fold')];
  return words.map((word, index) => {
    const bounds = word.getBoundingClientRect();
    const group = groups[index];
    return {
      box: {
        x: bounds.left - stageBounds.left - FOLD.measure.inset,
        y: bounds.top - stageBounds.top,
        width: bounds.width + FOLD.measure.grow,
        height: bounds.height,
      },
      group,
      face: group.querySelector('.fold-face') as Element,
      ret: group.querySelector('.fold-return') as Element,
      edge: group.querySelector('.fold-edge') as Element,
      word,
      progress: 0,
    };
  });
}

// Holds the wordmark at the stage's centre (its size is set from the stage), then sets the folds closed.
function holdWordmark(runtime: HeroRuntime, logo: SVGSVGElement): void {
  const logoBounds = logo.getBoundingClientRect();
  const stageBounds = runtime.stage.getBoundingClientRect();
  const homeWidth = logoBounds.width;
  const centreX = stageBounds.left + runtime.w / 2 - (logoBounds.left + homeWidth / 2);
  const centreY = stageBounds.top + runtime.h / 2 - (logoBounds.top + logoBounds.height / 2);
  const scale = Math.max(LOGO.min, Math.min(runtime.w * LOGO.ratio, LOGO.max)) / homeWidth;
  gsap.set(logo, { x: centreX, y: centreY, scale, transformOrigin: '50% 50%' });
}

// Builds the arrival timeline. `folds` must come from measureFolds, after the wordmark has been held.
export function buildArrival(
  runtime: HeroRuntime,
  logo: SVGSVGElement,
  folds: Fold[],
  onComplete: () => void,
): gsap.core.Timeline {
  holdWordmark(runtime, logo);
  runtime.root
    .querySelector('.headline-folds')
    ?.setAttribute('viewBox', `0 0 ${runtime.w} ${runtime.h}`);
  folds.forEach((fold) => {
    gsap.set(fold.word, { clipPath: 'inset(0 0 100% 0)' });
    drawFold(fold);
  });
  const [first, second] = folds;
  const redraw = (fold: Fold) => () => {
    drawFold(fold);
  };
  const timeline = gsap.timeline({ defaults: { ease: EASE.expoInOut }, onComplete });
  timeline
    .from('.loading-word', { opacity: 0, duration: 0.65, ease: EASE.power3Out }, 0)
    .fromTo(
      '.loading-seam',
      { scaleX: 0 },
      { scaleX: 1, duration: 0.8, ease: EASE.power3InOut },
      ARRIVAL.seam,
    )
    // The loader is real work: the unfold waits here until the journey below has built, and never when it already has.
    .call(
      () => {
        if (!runtime.built) {
          timeline.pause();
        }
      },
      [],
      ARRIVAL.hold,
    )
    .addLabel(LABEL.unfold, ARRIVAL.unfold)
    .call(
      () => {
        runtime.root.classList.add('wordmark-travelling');
      },
      [],
      LABEL.unfold,
    )
    .to(logo, { x: 0, y: 0, scale: 1, duration: 1.35, ease: EASE.power3InOut }, LABEL.unfold)
    .from(
      '.hero-nav nav, .nav-role, .nav-prism',
      { autoAlpha: 0, y: 8, duration: 0.55, ease: EASE.power2Out },
      `${LABEL.unfold}+=1.15`,
    )
    .to('.loading-seam', { scaleX: 6, opacity: 0, duration: 0.8 }, LABEL.unfold)
    .to('.loading-surface', { opacity: 0, duration: 0.85 }, `${LABEL.unfold}+=0.18`)
    .from(
      '.glass-edge',
      { scaleX: 0.06, scaleY: 0.002, opacity: 0.4, duration: 1.2 },
      `${LABEL.unfold}+=0.12`,
    )
    .from(
      '.system-world',
      { y: 55, scale: 0.93, duration: 1.3, ease: EASE.expoOut },
      `${LABEL.unfold}+=0.3`,
    )
    .addLabel(LABEL.headline, `${LABEL.unfold}+=1.35`)
    .fromTo('.headline-folds', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.1 }, LABEL.headline)
    .fromTo(
      first.group,
      { scaleX: 0.04 },
      { scaleX: 1, duration: 0.28, transformOrigin: '50% 50%', ease: EASE.power3Out },
      LABEL.headline,
    )
    .to(
      first,
      { progress: 1, duration: 0.7, ease: EASE.power3InOut, onUpdate: redraw(first) },
      `${LABEL.headline}+=0.14`,
    )
    .fromTo(
      second.group,
      { autoAlpha: 0, scaleX: 0.04 },
      { autoAlpha: 1, scaleX: 1, duration: 0.28, transformOrigin: '50% 50%', ease: EASE.power3Out },
      `${LABEL.headline}+=0.64`,
    )
    .to(
      second,
      { progress: 1, duration: 0.76, ease: EASE.power3InOut, onUpdate: redraw(second) },
      `${LABEL.headline}+=0.72`,
    )
    .from(
      '.reveal-word',
      { y: 5, stagger: 0.09, duration: 0.3, ease: EASE.power2Out },
      `${LABEL.headline}+=0.95`,
    )
    .to(first.group, { opacity: 0.08, duration: 0.35 }, `${LABEL.headline}+=0.85`)
    .to(second.group, { opacity: 0.08, duration: 0.35 }, `${LABEL.headline}+=1.46`)
    .from(
      '.hero-actions, .hero-bottom',
      { opacity: 0, y: 10, duration: 0.6, ease: EASE.power2Out },
      `${LABEL.headline}+=1.3`,
    );
  return timeline;
}
