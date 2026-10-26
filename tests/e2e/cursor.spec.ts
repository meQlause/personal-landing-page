import { expect, test } from '@playwright/test';
import { errorsOf, openSection } from '../helpers/section';

test('the page cursor follows the pointer and changes over an action', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'mouse-driven: a touch screen has no cursor to follow');
  const errors = errorsOf(page);
  await openSection(page, 'none');
  await page.mouse.move(400, 300);
  await expect(page.locator('html')).toHaveClass(/has-ardial-cursor/);
  await expect(page.locator('.ardial-cursor')).toHaveCount(1);

  await page.evaluate(() => {
    const probe = document.createElement('button');
    probe.id = 'cursor-probe';
    probe.textContent = 'probe';
    probe.style.cssText = 'position:fixed;left:600px;top:300px;width:120px;height:40px';
    document.body.append(probe);
  });
  await page.mouse.move(640, 320);
  await expect(page.locator('html')).toHaveClass(/cursor-on-action/);
  expect(errors).toEqual([]);
});
