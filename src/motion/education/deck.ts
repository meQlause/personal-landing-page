import { gsap } from '../gsap';
import { EDUCATION } from './constants';
import type { EducationRuntime } from './runtime';

// The certificates' board: they land from below, the card beside it is described, and the dialog opens a card.
// Ported from the mockup's 05-credentials/script.js.

const LANDING = EDUCATION.deal;

// The landing: each card drops onto the board from below, a little turned, and settles (its pinned tilt is CSS).
export function buildDeal(runtime: EducationRuntime): gsap.core.Timeline {
  const timeline = gsap.timeline({ paused: true });
  runtime.cards.forEach((card, index) => {
    const turn = (index % 2 ? 1 : -1) * (LANDING.sway + ((index * LANDING.rise) % LANDING.spread));
    timeline.fromTo(
      card,
      {
        y: LANDING.lift + (index % LANDING.column) * LANDING.step,
        rotation: turn,
        scale: LANDING.turn,
        autoAlpha: 0,
      },
      { y: 0, rotation: 0, scale: 1, autoAlpha: 1, duration: LANDING.duration, ease: LANDING.ease },
      index * LANDING.stagger,
    );
  });
  return timeline;
}

// The card described beside the board: the picked one, or the one under the pointer.
// The title, the issuer and the number of the card beside the board, then the card is outlined and its text brought forward.
function writeCard(runtime: EducationRuntime, card: HTMLElement, index: number): void {
  const { front } = runtime;
  const title = front.querySelector('.c-front-title');
  const issuer = front.querySelector('.c-front-issuer');
  const count = front.querySelector('.c-count b');
  if (title) {
    title.textContent = card.dataset.title ?? '';
  }
  if (issuer) {
    issuer.textContent = card.dataset.issuer ?? '';
  }
  if (count) {
    count.textContent = String(index + 1);
  }
}

// The card described beside the board: the picked one, or the one under the pointer.
export function describe(runtime: EducationRuntime, index: number): void {
  writeCard(runtime, runtime.cards[index], index);
  const { front } = runtime;
  front.dataset.card = String(index);
  runtime.cards.forEach((other, position) => {
    other.classList.toggle('is-picked', position === index);
  });
  front.classList.remove('is-swapping');
  front.getBoundingClientRect();
  front.classList.add('is-swapping');
}

// Writes a text into the dialog's element for the selector, if the element is there.
function setText(root: ParentNode, selector: string, text: string): void {
  const element = root.querySelector(selector);
  if (element) {
    element.textContent = text;
  }
}

// Fills the dialog with the card's image, title, issuer and skills.
function fillDialog(runtime: EducationRuntime, card: HTMLElement): void {
  const { dialog } = runtime;
  const image = dialog.querySelector<HTMLImageElement>('.c-dialog-img');
  const cardImage = card.querySelector('img');
  if (image && cardImage) {
    image.src = cardImage.src;
    image.alt = card.dataset.title ?? '';
  }
  setText(dialog, 'h4', card.dataset.title ?? '');
  setText(dialog, '.c-dialog-issuer', card.dataset.issuer ?? '');
  const skills = dialog.querySelector('.c-dialog-skills');
  if (skills) {
    skills.replaceChildren(...(card.dataset.skills ?? '').split('|').map(skillItem));
  }
}

function skillItem(skill: string): HTMLLIElement {
  return Object.assign(document.createElement('li'), { textContent: skill });
}

// Opens one certificate in the dialog, with the image and skills that the card carries.
export function open(runtime: EducationRuntime, card: HTMLElement): void {
  fillDialog(runtime, card);
  runtime.dialog.showModal();
}

// Opens one certificate in the dialog, with the image and skills that the card carries.
