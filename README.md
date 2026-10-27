# ardial-portfolio

Ardial's portfolio, in React and TypeScript on Vite. The setup follows `treecord/landing-app`, limited to its linter (ESLint), knip and formatter (Prettier).

## Scripts

| Command                           | What it does                                         |
| --------------------------------- | ---------------------------------------------------- |
| `npm run dev`                     | Dev server on http://127.0.0.1:5180                  |
| `npm run build`                   | Production build into `dist/`, journey prerendered   |
| `npm run preview`                 | Serves the build on http://127.0.0.1:4180            |
| `npm run format` / `format:check` | Prettier, writing or checking                        |
| `npm run lint`                    | ESLint, with warnings treated as failures            |
| `npm run typecheck`               | `tsc --noEmit`                                       |
| `npm run knip`                    | Unused files, exports and dependencies               |
| `npm run check`                   | Prettier, ESLint, typecheck and knip, in order       |
| `npm run test:feature -- <spec>`  | One Playwright spec, desktop only, one worker        |
| `npm run test:e2e`                | Every Playwright spec, desktop and phone, one worker |
| `npm run cv`                      | Prints `cv/ardial-cv.html` to `src/assets/cv/` (PDF) |

`eslint.config.mjs` is the pspt canonical React config, copied verbatim from `landing-app`. Don't edit it here.

## Preview one section

Each section also runs alone on the preview page, with its pin in the middle of a full-screen lead and tail:

- http://127.0.0.1:5180/?section=hero
- http://127.0.0.1:5180/?section=work
- http://127.0.0.1:5180/?section=experience
- http://127.0.0.1:5180/?section=education
- http://127.0.0.1:5180/?section=contact

The home page (`/`) is the whole journey: the five sections in order, joined by the seams in `src/motion/seams/`.

## How the page loads

The build is tuned for a fast first paint (Lighthouse 100 in every category, mobile and desktop):

1. `npm run build` prerenders the journey into `dist/index.html` (`src/entry-server.tsx`, `scripts/prerender.ts`), so the page paints from its HTML and CSS before any JavaScript runs. The fonts are subset `.woff2` files, preloaded.
2. The app's script is requested once that first paint is on screen (the `load-after-paint` plugin in `vite.config.ts`), and React hydrates the prerendered HTML.
3. The loading screen is real work: while it shows, the page does not scroll and every section builds its motion, one task at a time, then the seams join them (`src/motion/gate.ts`). The hero's intro holds before its unfold until the seams report `journey:ready` (at most `ROUTE.buildLimit`), so the first scroll never waits on a build.

The dev server skips steps 1 and 2 (it renders in the browser and loads the script at once). The `?section=` preview pages have no gate: their one section starts at load.

## Tests

Playwright drives the installed Google Chrome (`channel: 'chrome'`), and starts its own dev server on port 5180 when none is running.

Run one feature while you work, because the full suite is heavy on memory:

```bash
npm run test:feature -- tests/e2e/contact.spec.ts
```

Run everything before a release:

```bash
npm run test:e2e
```

Specs that depend on the mouse or the nav character skip on the phone project, with a reason in the spec.

## CV

`cv/ardial-cv.html` is the source. `npm run cv` prints it to `src/assets/cv/Ardial-CV.pdf` (Letter, three pages), and the Download CV button in the contact section serves that file.

## Structure: atomic design

```
src/
  components/
    atoms/       smallest pieces: a button, a label, an icon
    molecules/   a few atoms working together: a nav link with its icon
    organisms/   a full part of the page: the navbar, a section
    templates/   page layouts that arrange organisms, with no real content
  pages/         a template filled with real content
  main.tsx       mounts the page
```

A level imports only from the levels below it.
