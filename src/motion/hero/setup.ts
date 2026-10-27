import { gsap } from '../gsap';
import { need } from '../dom';
import { buildArrival, measureFolds } from './arrival';
import { ROUTE } from './constants';
import { dispose, finishIntro, releaseLoading, TEXT, update } from './loop';
import { resize } from './particles';
import type { HeroRuntime } from './runtime';

const OPEN_SELECTOR = '.open-system';
import { buildStory } from './story';

// Builds the hero's motion for the current viewport and motion setting, and the actions that drive it.

function setControls(runtime: HeroRuntime, enabled: boolean): void {
  const { root } = runtime;
  runtime.navPrism.setMotion(enabled);
  root.classList.toggle('is-enhanced', enabled);
  root.classList.toggle('is-static', !enabled);
  root.classList.remove('is-open');
  need<HTMLButtonElement>(root, OPEN_SELECTOR).hidden = !enabled;
  const control = need<HTMLButtonElement>(root, '.motion-control');
  control.hidden = false;
  const label = enabled ? TEXT.pause : TEXT.enable;
  control.setAttribute('aria-label', label);
  control.title = label;
  need(root, '.motion-icon').setAttribute('d', enabled ? TEXT.play : TEXT.still);
  need(root, '.closing-title').setAttribute('aria-hidden', 'true');
}

// Motion off: the hero shows its end state and nothing moves.
function setupStatic(runtime: HeroRuntime): void {
  const { root } = runtime;
  setControls(runtime, false);
  runtime.portrait.set(1, false);
  need(root, '.portrait-scene').setAttribute('aria-hidden', 'false');
  resize(runtime);
  releaseLoading();
  need(root, OPEN_SELECTOR).setAttribute('aria-expanded', 'false');
}

// Runs the intro (when the page is loaded at the top) and then leaves the loading state.
function startIntro(runtime: HeroRuntime): void {
  const logo = need<SVGSVGElement>(runtime.root, '.loading-word');
  const folds = measureFolds(runtime);
  runtime.arrival = buildArrival(runtime, logo, folds, () => {
    runtime.root.classList.remove('wordmark-travelling');
    releaseLoading();
  });
}

// The scroll story and its pin, built at load: the visitor's first scroll must already land on the pinned stage, or the
// page scrolls natively while the pin is still being built and the hero slides away.
function addStory(runtime: HeroRuntime): void {
  runtime.story = buildStory(runtime, () => {
    update(runtime);
  });
  update(runtime);
}

function setupMotion(runtime: HeroRuntime, intro: boolean): void {
  setControls(runtime, true);
  resize(runtime);
  const playIntro = intro && window.scrollY < ROUTE.introLimit;
  runtime.context = gsap.context(() => {
    addStory(runtime);
    if (playIntro) {
      startIntro(runtime);
    }
  }, runtime.root);
  // Outside the context: its revert would otherwise take the page's scroll normalizer with it (motion/gsap.ts).
  if (!playIntro) {
    releaseLoading();
  }
  update(runtime);
}

// Builds the motion for the current viewport. With the motion off the hero is static and shows its end state.
export function setup(runtime: HeroRuntime, intro = false): void {
  dispose(runtime);
  if (runtime.motion) {
    setupMotion(runtime, intro);
  } else {
    setupStatic(runtime);
  }
}

// The explore action: opens the system, or scrolls to the point where it opens.
export function open(runtime: HeroRuntime): void {
  const { story, pose } = runtime;
  if (!story) {
    return;
  }
  finishIntro(runtime);
  const trigger = story.scrollTrigger;
  if (!trigger) {
    return;
  }
  const depthAt = story.labels.depth / story.duration();
  const top =
    pose.open > ROUTE.openFrom
      ? trigger.start
      : trigger.start + (trigger.end - trigger.start) * depthAt;
  scrollTo({ top, behavior: 'smooth' });
}
