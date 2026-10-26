// Prints cv/ardial-cv.html to src/assets/cv/Ardial-CV.pdf: Letter, with live links. Run with `npm run cv`.
import { chromium } from '@playwright/test';
import { fileURLToPath } from 'node:url';

const projectRoot = new URL('../', import.meta.url);
const source = new URL('cv/ardial-cv.html', projectRoot);
const target = fileURLToPath(new URL('src/assets/cv/Ardial-CV.pdf', projectRoot));

async function printCv(): Promise<void> {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage();
    await page.goto(source.href);
    await page.evaluate(() => document.fonts.ready);
    await page.pdf({ path: target, preferCSSPageSize: true, printBackground: true });
    console.log(`wrote ${target}`);
  } finally {
    await browser.close();
  }
}

await printCv();
