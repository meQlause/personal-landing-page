import { expect, test, type Page } from '@playwright/test';
import { errorsOf, openSection, scrollPin } from '../helpers/section';

const SECTION_ROOTS = ['.ardial-hero', '.work', '.experience', '.credentials', '.contact'];
const SEAMS = [
  {
    from: '.work',
    fromStage: '.work-stage',
    to: '.experience',
    toStage: '.x-stage',
    shape: 'inset(',
  },
  {
    from: '.experience',
    fromStage: '.x-stage',
    to: '.credentials',
    toStage: '.c-stage',
    shape: 'circle(',
  },
  {
    from: '.credentials',
    fromStage: '.c-stage',
    to: '.contact',
    toStage: '.k-stage',
    shape: 'inset(',
  },
];
const GAP_FRACTIONS = [0.25, 0.5, 0.75];
const INTO_PIN_FRACTION = 0.1;
const PIN_TOLERANCE_PX = 1;

// Scrolls to a fraction of the gap between two pins: from the end of the outgoing pin to the start of the incoming one.
async function scrollGap(page: Page, from: string, to: string, fraction: number): Promise<void> {
  await page.evaluate(
    ({ from, to, amount }) => {
      const spacerOf = (selector: string): HTMLElement => {
        const root = document.querySelector<HTMLElement>(selector);
        if (!root) {
          throw new Error(`Missing ${selector}`);
        }
        return root.closest<HTMLElement>('.pin-spacer') ?? root;
      };
      const outgoing = spacerOf(from);
      const incoming = spacerOf(to);
      const start =
        outgoing.getBoundingClientRect().top +
        window.scrollY +
        outgoing.offsetHeight -
        window.innerHeight;
      const end = incoming.getBoundingClientRect().top + window.scrollY;
      window.scrollTo(0, start + (end - start) * amount);
    },
    { from, to, amount: fraction },
  );
  // Two frames: the scrub is applied on the ticker, so the seam has drawn once both have passed.
  await page.evaluate(
    () =>
      new Promise<void>((done) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            done();
          });
        });
      }),
  );
}

// Whether both stages of a seam are held fixed, and the start of the incoming stage's clip-path.
async function stagesOf(
  page: Page,
  seam: (typeof SEAMS)[number],
): Promise<{ outgoingFixed: boolean; incomingFixed: boolean; clipShape: string }> {
  return page.evaluate(
    ({ outgoing, incoming, shapeLength }) => {
      const outgoingStage = document.querySelector<HTMLElement>(outgoing);
      const incomingStage = document.querySelector<HTMLElement>(incoming);
      return {
        outgoingFixed: outgoingStage ? getComputedStyle(outgoingStage).position === 'fixed' : false,
        incomingFixed: incomingStage ? getComputedStyle(incomingStage).position === 'fixed' : false,
        clipShape: incomingStage
          ? getComputedStyle(incomingStage).clipPath.slice(0, shapeLength)
          : '',
      };
    },
    {
      outgoing: seam.fromStage,
      incoming: seam.toStage,
      shapeLength: seam.shape.length,
    },
  );
}

test('the five sections are pinned one after another with no overlap', async ({ page }) => {
  const errors = errorsOf(page);
  await openSection(page);

  const boxes = await page.evaluate((roots) => {
    return roots.map((selector) => {
      const root = document.querySelector<HTMLElement>(selector);
      const box = (root?.closest<HTMLElement>('.pin-spacer') ?? root)?.getBoundingClientRect();
      return { top: (box?.top ?? 0) + window.scrollY, bottom: (box?.bottom ?? 0) + window.scrollY };
    });
  }, SECTION_ROOTS);
  expect(boxes).toHaveLength(SECTION_ROOTS.length);
  for (let index = 1; index < boxes.length; index++) {
    expect(boxes[index].top).toBeGreaterThanOrEqual(boxes[index - 1].bottom - PIN_TOLERANCE_PX);
  }
  expect(errors).toEqual([]);
});

for (const seam of SEAMS) {
  test(`the seam from ${seam.from} to ${seam.to} holds both stages and draws ${seam.shape} across the gap`, async ({
    page,
  }) => {
    const errors = errorsOf(page);
    await openSection(page);

    for (const fraction of GAP_FRACTIONS) {
      await scrollGap(page, seam.from, seam.to, fraction);
      // The scrub draws on the ticker, so the stages are polled until the seam has rendered at this point.
      await expect
        .poll(() => stagesOf(page, seam))
        .toEqual({ outgoingFixed: true, incomingFixed: true, clipShape: seam.shape });
    }

    await scrollPin(page, seam.to, INTO_PIN_FRACTION);
    const after = await page.evaluate((stage) => {
      const incoming = document.querySelector<HTMLElement>(stage);
      return {
        leftover: document.querySelectorAll('.seam-held').length,
        inline: incoming?.getAttribute('style') ?? '',
        top: incoming?.getBoundingClientRect().top ?? NaN,
      };
    }, seam.toStage);
    expect(after.leftover).toBe(0);
    expect(after.inline).not.toMatch(/clip-path/);
    expect(Math.abs(after.top)).toBeLessThanOrEqual(PIN_TOLERANCE_PX);
    expect(errors).toEqual([]);
  });
}

test('a jump from the top to education leaves the education palette on the page', async ({
  page,
}) => {
  const errors = errorsOf(page);
  await openSection(page);
  await scrollPin(page, '.credentials', INTO_PIN_FRACTION);
  await expect(page.locator('html')).toHaveAttribute('data-palette', 'credentials');
  expect(errors).toEqual([]);
});
