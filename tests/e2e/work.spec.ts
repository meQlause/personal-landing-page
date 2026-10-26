import { expect, test } from '@playwright/test';
import { errorsOf, openSection, scrollPin } from '../helpers/section';

const TAB_TIMEOUT = 2000;

test('the five products switch by tab and by scroll, and the arrow keys move between tabs', async ({
  page,
}) => {
  const errors = errorsOf(page);
  await openSection(page, 'work');
  await expect(page.locator('.work-tab')).toHaveCount(5);
  await expect(page.locator('.work-panel')).toHaveCount(5);

  await page.locator('#tab-qswap').click();
  await expect(page.locator('#tab-qswap')).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#panel-qswap')).toBeVisible();

  await scrollPin(page, '.work', 0.9);
  await expect(page.locator('html')).toHaveAttribute('data-palette', 'qswap', {
    timeout: TAB_TIMEOUT,
  });

  await page.locator('#tab-simpul').focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#tab-mnemo')).toBeFocused();
  expect(errors).toEqual([]);
});

test.describe('with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('there is no pin and the tabs still switch', async ({ page }) => {
    const errors = errorsOf(page);
    await openSection(page, 'work');
    await expect(page.locator('.pin-spacer')).toHaveCount(0);
    await page.locator('#tab-treecord').click();
    await expect(page.locator('#panel-treecord')).toBeVisible();
    expect(errors).toEqual([]);
  });
});
