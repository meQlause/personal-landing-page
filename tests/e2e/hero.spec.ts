import { expect, test } from '@playwright/test';
import { errorsOf, openSection, scrollPin } from '../helpers/section';

test('the hero loads, reacts to the pointer and survives its pin', async ({ page, isMobile }) => {
  test.skip(isMobile, 'pointer-driven: touch screens get no hero cursor');
  const errors = errorsOf(page);
  await openSection(page, 'hero');
  await expect(page.locator('h1.hero-title')).toBeVisible();
  const particles = await page.locator('canvas.hero-particles').boundingBox();
  expect(particles?.width).toBeGreaterThan(0);
  expect(particles?.height).toBeGreaterThan(0);

  await page.mouse.move(400, 300, { steps: 5 });
  await expect(page.locator('.ardial-hero')).toHaveClass(/has-cursor/);

  await scrollPin(page, '.ardial-hero', 1);
  await scrollPin(page, '.ardial-hero', 0);
  await expect(page.locator('h1.hero-title')).toBeVisible();
  expect(errors).toEqual([]);
});

test.describe('with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('there is no pin and the title is visible', async ({ page }) => {
    const errors = errorsOf(page);
    await openSection(page, 'hero');
    await expect(page.locator('h1.hero-title')).toBeVisible();
    await expect(page.locator('.ardial-hero .hero-stage')).not.toHaveClass(/pin/);
    await expect(page.locator('.pin-spacer')).toHaveCount(0);
    expect(errors).toEqual([]);
  });
});
