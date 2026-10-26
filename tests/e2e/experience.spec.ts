import { expect, test, type Page } from '@playwright/test';
import { errorsOf, openSection, scrollPin } from '../helpers/section';

const STOP_COUNT = 7;
const FLAG_TOLERANCE_PX = 6;
const TICKER_WINDOW_MS = 500;

// The horizontal centre of a box, or 0 when the element is missing.
const centreX = (box: { x: number; width: number } | null): number =>
  (box?.x ?? 0) + (box?.width ?? 0) / 2;

// The year the odometer shows: each strip's translate is minus the digit it displays.
async function shownYear(page: Page): Promise<number> {
  return page.evaluate(() => {
    const digits = [...document.querySelectorAll<HTMLElement>('.x-strip')].map((strip) => {
      const match = /translateY\((-?[\d.]+)em\)/.exec(strip.style.transform);
      return Math.round(-Number(match?.[1] ?? 0));
    });
    return Number(digits.join(''));
  });
}

test('each stop shows its panel, its year and its flag over the needle, and the page turns to paper', async ({
  page,
}) => {
  const errors = errorsOf(page);
  await openSection(page, 'experience');
  await expect(page.locator('.x-panel')).toHaveCount(STOP_COUNT);

  for (let stop = 0; stop < STOP_COUNT; stop++) {
    await scrollPin(page, '.experience', (stop + 0.5) / STOP_COUNT);
    const id = await page.locator('.x-panel:not([hidden])').getAttribute('id');
    expect(id).toBe(await page.locator('.x-panel').nth(stop).getAttribute('id'));
    expect(await shownYear(page)).toBe(
      Number(await page.locator('.x-panel').nth(stop).getAttribute('data-year')),
    );

    const flag = await page.locator('.x-stop').nth(stop).locator('.x-flag').boundingBox();
    const needle = await page.locator('.x-needle').boundingBox();
    expect(Math.abs(centreX(flag) - centreX(needle))).toBeLessThanOrEqual(FLAG_TOLERANCE_PX);
  }

  await expect(page.locator('.experience')).toHaveClass(/is-paper/);
  await expect(page.locator('html')).toHaveAttribute('data-palette', 'experience');
  expect(errors).toEqual([]);
});

test('the active ticker moves', async ({ page }) => {
  await openSection(page, 'experience');
  await scrollPin(page, '.experience', 0.5 / STOP_COUNT);
  const track = page.locator('.x-ticker.is-active .x-ticker-track');
  const before = await track.evaluate((element) => getComputedStyle(element).transform);
  await expect
    .poll(() => track.evaluate((element) => getComputedStyle(element).transform), {
      timeout: TICKER_WINDOW_MS,
    })
    .not.toBe(before);
});

test.describe('with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('there is no pin and the flags still switch', async ({ page }) => {
    const errors = errorsOf(page);
    await openSection(page, 'experience');
    await expect(page.locator('.pin-spacer')).toHaveCount(0);
    await page.locator('#xtab-polaris').click();
    await expect(page.locator('#xpanel-polaris')).toBeVisible();
    expect(errors).toEqual([]);
  });
});
