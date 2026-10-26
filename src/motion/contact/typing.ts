import { CONTACT } from './constants';

// The headline typed in by scroll, the description lit word by word, and the sweep across the key word.
// Ported from the mockup's 06-contact/script.js.

export const clamp = (value: number): number => Math.min(1, Math.max(0, value));

// How far a scroll range has been covered (0 to 1).
export function span(progress: number, from: number, to: number): number {
  return clamp((progress - from) / (to - from));
}

// Splits every typed element into one span per character, so each letter can be shown or hidden.
export function splitTyped(root: HTMLElement): HTMLElement[] {
  return [...root.querySelectorAll<HTMLElement>('.k-type')].flatMap((element) => {
    const text = element.dataset.text ?? '';
    element.textContent = '';
    return [...text].map((character) => {
      const span = document.createElement('span');
      span.className = 'k-ch';
      span.textContent = character;
      element.appendChild(span);
      return span;
    });
  });
}

// Shows the first part of the characters by scroll: a caret sits after the last one shown, and waits before the first.
export function typeChars(root: HTMLElement, chars: HTMLElement[], amount: number): void {
  const shown = Math.round(clamp(amount) * chars.length);
  chars.forEach((character, index) => {
    character.classList.toggle('is-hidden', index >= shown);
    character.classList.toggle('is-caret', index === shown - 1);
  });
  chars[0].classList.toggle('is-caret-0', shown === 0);
  root.classList.toggle('is-typed', shown === chars.length);
}

// Splits the description's text into words, keeping the spaces as text so it wraps exactly as written.
// A second mount (StrictMode) finds the words already split, so it collects them instead of wrapping them again.
export function splitWords(sub: Element): HTMLElement[] {
  const words: HTMLElement[] = [];
  const split = (node: Node): void => {
    for (const child of [...node.childNodes]) {
      if (child instanceof HTMLElement && child.classList.contains('k-w')) {
        words.push(child);
      } else if (child.nodeType !== Node.TEXT_NODE) {
        split(child);
      } else {
        child.replaceWith(...wordsOf(child.textContent ?? '', words));
      }
    }
  };
  split(sub);
  return words;
}

function wordsOf(text: string, words: HTMLElement[]): Node[] {
  return text.split(/(\s+)/).map((part) => {
    if (!part.trim()) {
      return document.createTextNode(part);
    }
    const word = document.createElement('span');
    word.className = 'k-w';
    word.textContent = part;
    words.push(word);
    return word;
  });
}

// Lights the words that the scroll has reached.
export function lightWords(words: HTMLElement[], progress: number): void {
  const lit = Math.round(span(progress, CONTACT.words.from, CONTACT.words.to) * words.length);
  words.forEach((word, index) => {
    word.classList.toggle('is-lit', index < lit);
  });
}

// The peach selection sweeps across the key word, eased: quick, then a soft landing.
export function sweepSelection(selection: HTMLElement, progress: number): void {
  const along = span(progress, CONTACT.select.from, CONTACT.select.to);
  selection.style.setProperty(
    '--sel',
    (1 - (1 - along) ** CONTACT.selectionEase).toFixed(CONTACT.decimals + 2),
  );
}
