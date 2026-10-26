// Writes the prerendered journey into dist/index.html, then removes the server build it came from.
// Runs after `vite build` and `vite build --ssr src/entry-server.tsx --outDir dist/server` (see `npm run build`).
import { readFile, rm, writeFile } from 'node:fs/promises';

const ROOT = '<div id="root"></div>';
const page = new URL('../dist/index.html', import.meta.url);
const serverDir = new URL('../dist/server/', import.meta.url);

const { render } = (await import(new URL('entry-server.js', serverDir).href)) as {
  render: () => string;
};
const html = await readFile(page, 'utf8');
if (!html.includes(ROOT)) {
  throw new Error(`dist/index.html has no empty ${ROOT} to fill`);
}
await writeFile(page, html.replace(ROOT, `<div id="root">${render()}</div>`));
await rm(serverDir, { recursive: true, force: true });
console.log('prerendered dist/index.html');
