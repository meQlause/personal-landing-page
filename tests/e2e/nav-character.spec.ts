import { expect, test, type Page } from '@playwright/test';
import { errorsOf, openSection } from '../helpers/section';

// The character's visible faces (their outline points) and the average x of its two pupils.
async function characterPose(page: Page): Promise<{ points: string[]; pupilX: number }> {
  return page.evaluate(() => {
    const polygons = [...document.querySelectorAll<SVGPolygonElement>('.nav-prism polygon')];
    const visible = polygons.filter((polygon) => polygon.style.display !== 'none');
    const pupils = [
      ...document.querySelectorAll<SVGEllipseElement>('.nav-prism ellipse[fill="#141857"]'),
    ];
    const pupilX =
      pupils.reduce((sum, pupil) => sum + Number(pupil.getAttribute('cx')), 0) / pupils.length;
    return { points: visible.map((polygon) => polygon.getAttribute('points') ?? ''), pupilX };
  });
}

test('the nav character draws, turns toward the cursor and raises no page errors', async ({
  page,
  isMobile,
}) => {
  test.skip(
    isMobile,
    'mouse-driven: the character turns toward a cursor, and a touch screen has none',
  );
  const errors = errorsOf(page);
  await openSection(page, 'work');
  // The pre-paint script holds a loading state for 7.5 s; the character only moves once it is released.
  await expect(page.locator('html')).not.toHaveClass(/hero-loading/, { timeout: 9000 });
  await expect(page.locator('.nav-prism polygon').first()).toBeAttached();
  expect((await characterPose(page)).points.length).toBeGreaterThan(0);

  await page.mouse.move(200, 400, { steps: 10 });
  const before = await characterPose(page);

  await page.mouse.move(1100, 700, { steps: 30 });
  await expect
    .poll(async () => (await characterPose(page)).pupilX - before.pupilX)
    .toBeGreaterThanOrEqual(2);
  expect((await characterPose(page)).points).not.toEqual(before.points);
  expect(errors).toEqual([]);
});
