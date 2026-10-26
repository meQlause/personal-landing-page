import { expect, test, type Page } from '@playwright/test';
import { contrastRatio } from '../helpers/page';
import { errorsOf, openSection, scrollPin } from '../helpers/section';

const SCHOOL_COUNT = 3;
const CERTIFICATE_COUNT = 12;
const MATHEMATICS_CARDS = 4;
const DIALOG_TITLE = 'Become an Algebra Master';
const TOTAL_STATES = 10.5;
const SCHOOL_STATES = 3;
const EDGE = 0.01;
const CONTRAST_MIN = 4.5;

// The scroll fraction at which a school's stretch starts, and the fraction just before it ends.
const startOf = (school: number): number => (SCHOOL_STATES * school) / TOTAL_STATES;
const endOf = (school: number): number => (SCHOOL_STATES * (school + 1) - EDGE) / TOTAL_STATES;

// The alternate of the key word that sits in its window (the one nearest the window's left edge).
async function visibleAlternate(page: Page, panel: string): Promise<string> {
  return page.evaluate((id) => {
    const panelEl = document.getElementById(id) as HTMLElement;
    const roll = panelEl.querySelector('.c-key .c-roll')?.getBoundingClientRect();
    const alternates = [
      ...panelEl.querySelectorAll<HTMLElement>('.c-key .c-roll-in')[0].children,
    ] as HTMLElement[];
    let best = alternates[0];
    let bestGap = Infinity;
    for (const alternate of alternates) {
      const gap = Math.abs(alternate.getBoundingClientRect().left - (roll?.left ?? 0));
      if (gap < bestGap) {
        bestGap = gap;
        best = alternate;
      }
    }
    return best.textContent ?? '';
  }, panel);
}

async function selection(page: Page, panel: string): Promise<number> {
  return page.evaluate(
    (id) =>
      Number(
        getComputedStyle(document.querySelector(`#${id} .c-sel`) as Element).getPropertyValue(
          '--sel',
        ),
      ),
    panel,
  );
}

test('the key words swipe through their alternates on each school', async ({ page }) => {
  const errors = errorsOf(page);
  await openSection(page, 'education');
  await expect(page.locator('.c-panel')).toHaveCount(SCHOOL_COUNT + 1);

  for (let school = 0; school < SCHOOL_COUNT; school++) {
    const id = ['cpanel-smk', 'cpanel-rise', 'cpanel-ut'][school];
    await scrollPin(page, '.credentials', startOf(school));
    expect(await selection(page, id)).toBeCloseTo(0, 1);
    await scrollPin(page, '.credentials', endOf(school));
    expect(await selection(page, id)).toBeCloseTo(1, 1);
    expect((await visibleAlternate(page, id)).length).toBeGreaterThan(0);
  }
  expect(errors).toEqual([]);
});

test('the certificates land, filter and open', async ({ page }) => {
  const errors = errorsOf(page);
  await openSection(page, 'education');
  await scrollPin(page, '.credentials', 1);
  await expect(page.locator('.c-card')).toHaveCount(CERTIFICATE_COUNT);
  await expect(page.locator('.c-card img').first()).toHaveJSProperty('complete', true);

  await page.locator('.c-filter[data-group="Mathematics"]').click();
  await expect(page.locator('.c-card.is-dim')).toHaveCount(CERTIFICATE_COUNT - MATHEMATICS_CARDS);
  await expect(page.locator('.c-front-title')).toContainText(DIALOG_TITLE);

  await page.locator('.c-open').click();
  await expect(page.locator('.c-dialog h4')).toHaveText(DIALOG_TITLE);
  await expect(page.locator('.c-dialog img')).toHaveAttribute('src', /.+/);
  await page.keyboard.press('Escape');
  await expect(page.locator('.c-dialog')).not.toHaveAttribute('open', '');
  expect(errors).toEqual([]);
});

test('the night text keeps a contrast of at least 4.5 on the schools', async ({ page }) => {
  await openSection(page, 'education');
  await scrollPin(page, '.credentials', startOf(0));
  const colours = await page.evaluate(() => {
    const background = getComputedStyle(
      document.querySelector('.credentials') as Element,
    ).backgroundColor;
    const pick = (selector: string): string =>
      getComputedStyle(document.querySelector(selector) as Element).color;
    return {
      background,
      period: pick('#cpanel-smk .c-period'),
      headline: pick('#cpanel-smk .c-headline'),
      degree: pick('#cpanel-smk .c-degree'),
      stamp: pick('#cpanel-smk .c-stamps li'),
    };
  });
  for (const key of ['period', 'headline', 'degree', 'stamp'] as const) {
    expect(contrastRatio(colours[key], colours.background)).toBeGreaterThanOrEqual(CONTRAST_MIN);
  }
});

test.describe('with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('there is no pin and all twelve cards are placed', async ({ page }) => {
    const errors = errorsOf(page);
    await openSection(page, 'education');
    await expect(page.locator('.pin-spacer')).toHaveCount(0);
    await expect(page.locator('.c-card')).toHaveCount(CERTIFICATE_COUNT);
    expect(errors).toEqual([]);
  });
});
