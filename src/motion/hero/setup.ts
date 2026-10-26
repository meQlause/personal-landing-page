import { gsap, ScrollTrigger } from '../gsap';
import { need } from '../dom';
import { buildArrival, measureFolds } from './arrival';
import { ROUTE } from './constants';
import { dispose, finishIntro, TEXT, update } from './loop';
import { resize } from './particles';
import type { HeroRuntime } from './runtime';

const OPEN_SELECTOR = '.open-system';
const LOADING_CLASS = 'hero-loading';
// Set once the story is built; until then the hero's CSS holds the story's opening state.
const STORY_CLASS = 'has-story';
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
  document.documentElement.classList.remove(LOADING_CLASS);
  need(root, OPEN_SELECTOR).setAttribute('aria-expanded', 'false');
}

// Runs the intro (when the page is loaded at the top) and then leaves the loading state.
function startIntro(runtime: HeroRuntime): void {
  const logo = need<SVGSVGElement>(runtime.root, '.loading-word');
  const folds = measureFolds(runtime);
  runtime.arrival = buildArrival(runtime, logo, folds, () => {
    runtime.root.classList.remove('wordmark-travelling');
    document.documentElement.classList.remove(LOADING_CLASS);
  });
}

// The scroll story and its pin. On the journey they wait for the visitor's first input, because at load only the intro
// plays; built later they join the hero's context, and every pin is measured again in page order.
function addStory(runtime: HeroRuntime): void {
  const build = (): void => {
    runtime.story = buildStory(runtime, () => {
      update(runtime);
    });
    runtime.root.classList.add(STORY_CLASS);
    update(runtime);
  };
  const { whenAwake } = runtime;
  if (!whenAwake) {
    build();
    return;
  }
  runtime.cancelStory = whenAwake(() => {
    if (runtime.context) {
      runtime.context.add(build);
    } else {
      build();
    }
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
  });
}

function setupMotion(runtime: HeroRuntime, intro: boolean): void {
  setControls(runtime, true);
  resize(runtime);
  runtime.context = gsap.context(() => {
    addStory(runtime);
    if (intro && window.scrollY < ROUTE.introLimit) {
      startIntro(runtime);
    } else {
      document.documentElement.classList.remove(LOADING_CLASS);
    }
  }, runtime.root);
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
