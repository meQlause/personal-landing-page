import { expect, type Page } from '@playwright/test';

const SCROLL_SETTLE_MS = 400;
// The pre-paint script holds the loading state for 7.5 s, so the wait is longer than that.
const LOADING_LIMIT_MS = 9000;

// Opens one section alone (the preview page) or the whole journey when id is omitted, and waits until the motion runs.
export async function openSection(page: Page, id?: string): Promise<void> {
  await page.goto(id ? `/?section=${id}` : '/');
  await expect(page.locator('html')).not.toHaveClass(/hero-loading/, { timeout: LOADING_LIMIT_MS });
  if (!id) {
    await expect(page.locator('#journey')).toHaveAttribute('data-seams', 'ready');
  }
}

// Scrolls so that `fraction` (0 to 1) of a section's pin has played. Without a pin the section's top is used.
export async function scrollPin(page: Page, rootSelector: string, fraction: number): Promise<void> {
  await page.evaluate(
    ({ selector, amount }) => {
      const root = document.querySelector<HTMLElement>(selector);
      if (!root) {
        throw new Error(`Missing ${selector}`);
      }
      const spacer = root.closest<HTMLElement>('.pin-spacer') ?? root;
      const top = spacer.getBoundingClientRect().top + window.scrollY;
      const range = Math.max(0, spacer.offsetHeight - window.innerHeight);
      window.scrollTo(0, top + range * amount);
    },
    { selector: rootSelector, amount: fraction },
  );
  await page.waitForTimeout(SCROLL_SETTLE_MS);
}

// Collects uncaught page errors. Call it before the first navigation so nothing is missed.
export function errorsOf(page: Page): string[] {
  const errors: string[] = [];
  page.on('pageerror', (error) => {
    errors.push(error.message);
  });
  return errors;
}
