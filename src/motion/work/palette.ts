import { WORK } from './constants';
import type { WorkRuntime } from './runtime';

// Each product wears its own palette while the section is pinned; before that the page stays in the hero's cobalt.
// The page scrollbar follows the same palette (see shared/scrollbar.css). The write is debounced, and it only happens while
// no later section has claimed the palette: a jump past Work must not leave QSwap's colours on a later section.

function isOurs(runtime: WorkRuntime, html: HTMLElement): boolean {
  const current = html.dataset.palette;
  return !current || runtime.products.includes(current);
}

function applyTheme(runtime: WorkRuntime, next: string | null): void {
  const html = document.documentElement;
  const ours = isOurs(runtime, html);
  if (next) {
    runtime.root.dataset.product = next;
    if (ours) {
      html.dataset.palette = next;
    }
  } else {
    delete runtime.root.dataset.product;
    if (ours) {
      delete html.dataset.palette;
    }
  }
}

// Sets the palette for the active product, or clears it while the section is not pinned.
export function theme(runtime: WorkRuntime): void {
  clearTimeout(runtime.themeTimer);
  const next = runtime.enabled && !runtime.pinned ? null : runtime.products[runtime.active];
  const apply = (): void => {
    applyTheme(runtime, next);
  };
  if (runtime.enabled && runtime.root.dataset.product) {
    runtime.themeTimer = setTimeout(apply, WORK.scrub.debounce);
  } else {
    apply();
  }
}
