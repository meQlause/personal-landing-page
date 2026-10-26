import { expect, test, type Page } from '@playwright/test';
import { errorsOf, openSection, scrollPin } from '../helpers/section';

const EMAIL = 'contact@ardial.my.id';
const CONNECTED = 'Connected. Pick a way in.';
const LOOP_WINDOW_MS = 3000;
const ALIGN_TOLERANCE_PX = 3;
// The cable enters the uplink plug 4 px below its top edge, as the mockup draws it.
const PLUG_LIFT_PX = 4;
const TYPED = '.k-ch:not(.is-hidden)';
const PIN_STAGES: [number, string][] = [
  [0.36, 'SYN'],
  [0.52, 'SYN-ACK'],
  [0.68, 'ACK'],
];
const POINTER_STOPS = [
  { horizontal: 300, vertical: 200 },
  { horizontal: 900, vertical: 500 },
  { horizontal: 640, vertical: 650 },
];

interface Box {
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly height: number;
}

interface Ends {
  readonly start: [number, number];
  readonly end: [number, number];
  readonly you: [number, number];
  readonly plug: [number, number];
}

const centre = (box: Box): [number, number] => [box.left + box.width / 2, box.top + box.height / 2];

// The cable's two ends in client pixels, the centre of the "You" dot, and the point the cable enters the plug.
async function cableEnds(page: Page): Promise<Ends> {
  const boxes = await page.evaluate(() => {
    const boxOf = (selector: string): Box => {
      const element = document.querySelector(selector);
      const rect = element ? element.getBoundingClientRect() : new DOMRect();
      return { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
    };
    return {
      wire: boxOf('.k-wire'),
      you: boxOf('.k-you-dot'),
      plug: boxOf('.k-uplink .k-plug'),
      path: document.querySelector('.k-cable')?.getAttribute('d') ?? '',
    };
  });
  const numbers = (boxes.path.match(/-?[\d.]+/g) ?? []).map(Number);
  const last = numbers.length - 1;
  return {
    start: [boxes.wire.left + numbers[0], boxes.wire.top + numbers[1]],
    end: [boxes.wire.left + numbers[last - 1], boxes.wire.top + numbers[last]],
    you: centre(boxes.you),
    plug: [centre(boxes.plug)[0], boxes.plug.top + PLUG_LIFT_PX],
  };
}

function expectAligned(ends: Ends): void {
  expect(Math.abs(ends.start[0] - ends.you[0])).toBeLessThanOrEqual(ALIGN_TOLERANCE_PX);
  expect(Math.abs(ends.start[1] - ends.you[1])).toBeLessThanOrEqual(ALIGN_TOLERANCE_PX);
  expect(Math.abs(ends.end[0] - ends.plug[0])).toBeLessThanOrEqual(ALIGN_TOLERANCE_PX);
  expect(Math.abs(ends.end[1] - ends.plug[1])).toBeLessThanOrEqual(ALIGN_TOLERANCE_PX);
}

// The width the key word's selection block shows right now (it changes as the word loops).
function selectionWidth(page: Page): Promise<string> {
  return page
    .locator('.k-sel .k-roll')
    .first()
    .evaluate((element) => (element as HTMLElement).style.width);
}

test('the headline types in and the handshake packets fly in order', async ({ page }) => {
  const errors = errorsOf(page);
  await openSection(page, 'contact');

  await scrollPin(page, '.contact', 0.01);
  await expect(page.locator(TYPED)).toHaveCount(0);
  await scrollPin(page, '.contact', 0.15);
  await expect(page.locator(TYPED).first()).toBeAttached();

  for (const [fraction, label] of PIN_STAGES) {
    await scrollPin(page, '.contact', fraction);
    await expect(page.locator('.k-packet text')).toHaveText(label);
  }
  expect(errors).toEqual([]);
});

test('the ports come up, the status reads connected and the key word keeps looping', async ({
  page,
}) => {
  const errors = errorsOf(page);
  await openSection(page, 'contact');

  await scrollPin(page, '.contact', 1);
  await expect(page.locator('.k-port.is-up')).toHaveCount(4);
  await expect(page.locator('.k-state-text')).toHaveText(CONNECTED);
  await expect(page.locator('.k-key .k-roll')).toHaveCount(2);
  const shown = await selectionWidth(page);
  await expect.poll(() => selectionWidth(page), { timeout: LOOP_WINDOW_MS }).not.toBe(shown);
  await expect(page.locator('.k-headline .k-sel')).toBeAttached();
  expect(errors).toEqual([]);
});

test('the cable stays on the You dot and the plug while the pointer moves', async ({ page }) => {
  const errors = errorsOf(page);
  await openSection(page, 'contact');
  await scrollPin(page, '.contact', 1);

  for (const stop of POINTER_STOPS) {
    await page.mouse.move(stop.horizontal, stop.vertical, { steps: 6 });
    expectAligned(await cableEnds(page));
  }
  expect(errors).toEqual([]);
});

test('copy writes the address and the CV downloads as a PDF', async ({ context, page }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  const errors = errorsOf(page);
  await openSection(page, 'contact');

  await page.locator('.k-copy').click();
  await expect(page.locator('.k-copy-label')).toHaveText('Copied');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(EMAIL);

  const downloadPromise = page.waitForEvent('download');
  await page.locator('.k-cv').click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('Ardial-CV.pdf');
  const chunks: Buffer[] = [];
  for await (const chunk of await download.createReadStream()) {
    chunks.push(Buffer.from(chunk));
  }
  expect(Buffer.concat(chunks).subarray(0, 5).toString()).toBe('%PDF-');
  expect(errors).toEqual([]);
});

test.describe('with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('there is no pin and the panel shows linked and typed', async ({ page }) => {
    const errors = errorsOf(page);
    await openSection(page, 'contact');
    await expect(page.locator('.pin-spacer')).toHaveCount(0);
    await expect(page.locator(TYPED).first()).toBeAttached();
    await expect(page.locator('.k-port.is-up')).toHaveCount(4);
    expect(errors).toEqual([]);
  });
});
