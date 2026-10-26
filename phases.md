# Ardial portfolio — Development phases

**Track:** P0–P9 · **Target:** the static mockup in `../sections/` (joined in `../journey.html`), ported 1:1 into this
React + TypeScript app with atomic design · **Written for:** any agent, including small models. Every phase says exactly
what to read, what to create, how to check it, and when it is done.

**Done means:** the app at `npm run dev` looks and behaves like `../journey.html`, every section and shared piece is
typed React that this project owns, all checks pass, and **the mockup can be deleted without breaking anything**.

> **Status:** not started. Tick each exit criterion (`- [ ]` to `- [x]`) only when it is true and checked.

---

## 0. How to work (read this first, every time)

1. Read sections 0 to 6 of this file, then **only the phase you are doing**. Do phases strictly in order, P0 first.
2. Do the steps of a phase in order. After each step run the **quick checks** for the files you touched (§5.1).
3. At the end of a phase run the **phase checks** (§5.2). Never run the final checks (§5.3) before P9.
4. Tick an exit criterion only after you ran the command or test that proves it.
5. **If you are blocked** (a check fails and you cannot fix it after two honest tries, or a step is unclear):
   write `> BLOCKED: <what failed, the exact error, what you tried>` under that phase's heading and stop.
   Never work around a rule to get unblocked.
6. Hard rules, no exceptions:
   - **Never import, link or copy at runtime from outside `ardial-portfolio/`.** The mockup (`../sections/`,
     `../journey.html`, `../tmp/`, `../cv/`) is a reference you read while porting. It will be deleted after P9.
     Anything the app needs is **copied into this project** in the phase that needs it.
   - Never edit `eslint.config.mjs`, `.prettierrc.json`, `.prettierignore` or the versions in `package.json`.
   - Never add a dependency that is not listed in §1.3.
   - Never delete or change anything inside the mockup.
   - Never change a file that belongs to a later phase, and never "improve" the design. This is a faithful port.
   - No `any`, no `@ts-ignore`, no `eslint-disable` without a `-- reason`. No TODO comments, no commented-out code.

---

## 1. Decisions

### 1.1 Decided

| #   | Decision                                                                                                                                                                                                                                                                                 |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D-1 | **Faithful port.** Same look, motion, copy and behaviour as the mockup. No redesign while porting.                                                                                                                                                                                       |
| D-2 | **Same DOM, same CSS.** Each section's markup keeps the mockup's tags, class names, ids, `aria-*` and `data-*` attributes and order. Each section's CSS is copied verbatim (only `url(...)` paths change). The motion code finds elements by these class names, so they must not change. |
| D-3 | **Motion stays imperative.** Each section's script becomes a typed `mount<Section>(root): SectionApi` module that React calls from an effect and destroys on unmount (§4.4). GSAP and ScrollTrigger come from npm.                                                                       |
| D-4 | **Content is data.** Copy (headlines, roles, products, schools, certificates, ports) lives in typed files in `src/content/`. Components render it.                                                                                                                                       |
| D-5 | **Assets live in `src/assets/` and are imported**, so Vite bundles them and the site works from any path (`base: './'`). There is no `public/` folder.                                                                                                                                   |
| D-6 | **Decorative SVG art** (`aria-hidden`, no image or content inside) is copied verbatim into `src/assets/art/<section>/<name>.svg` and rendered by the `InlineSvg` atom with a `?raw` import. SVG that contains `<image>` or content is written as JSX.                                    |
| D-7 | **Tests are Playwright end-to-end specs**, one per feature, run one at a time (§5). No unit test runner.                                                                                                                                                                                 |
| D-8 | **A section can be previewed alone** at `http://127.0.0.1:5180/?section=<id>` (for development and the feature tests). `/` is the full journey.                                                                                                                                          |
| D-9 | **The CV moves into this project**: its HTML source, a print script and the generated PDF (P7).                                                                                                                                                                                          |

### 1.2 Section ids, order and mockup sources

| Order | Id           | Organism            | Mockup folder                 | Root element                    |
| ----- | ------------ | ------------------- | ----------------------------- | ------------------------------- |
| 1     | `hero`       | `HeroSection`       | `../sections/01-hero/`        | `section.ardial-hero#hero`      |
| 2     | `work`       | `WorkSection`       | `../sections/03-work/`        | `section.work#work`             |
| 3     | `experience` | `ExperienceSection` | `../sections/04-experience/`  | `section.experience#experience` |
| 4     | `education`  | `EducationSection`  | `../sections/05-credentials/` | `section.credentials#education` |
| 5     | `contact`    | `ContactSection`    | `../sections/06-contact/`     | `section.contact#contact`       |

Shared mockup pieces: `../sections/shared/` (`nav-prism.*`, `cursor.*`, `scrollbar.css`, `seams.js`).

### 1.3 Dependencies (the only ones allowed)

Added in P0, exact versions:

- `gsap` **3.15.0** (dependency). It includes ScrollTrigger: `import { ScrollTrigger } from 'gsap/ScrollTrigger'`.
- `@playwright/test` **1.64.0** (devDependency). It drives the installed Google Chrome (`channel: 'chrome'`), so no
  browser download is needed.

Already present: React 19, Vite, TypeScript, ESLint and plugins, Prettier, knip. Nothing else.

---

## 2. Folder structure

```
ardial-portfolio/
  index.html                  head: pre-paint script, title, theme colour (P0)
  phases.md                   this file
  playwright.config.ts        (P0)
  cv/ardial-cv.html           CV source (P7)
  scripts/print-cv.ts         prints the CV to src/assets/cv/Ardial-CV.pdf (P7)
  src/
    main.tsx                  mounts HomePage, or SectionPreviewPage when ?section= is set
    styles/
      global.css              fonts, body reset, imports the shared CSS below
      scrollbar.css           copied from ../sections/shared/scrollbar.css
      cursor.css              copied from ../sections/shared/cursor.css
      nav-character.css       copied from ../sections/shared/nav-prism.css
    assets/
      fonts/                  manrope-medium.ttf, manrope-bold.ttf, OFL.txt
      images/                 ardial-portrait.jpg, simpul-mark.png, education/*.webp, certificates/*.webp
      art/<section>/*.svg     decorative SVG copied verbatim (D-6)
      cv/Ardial-CV.pdf
    content/                  typed copy and data, one file per section: hero.ts, work.ts, experience.ts,
                              education.ts, contact.ts, plus nav.ts (shared nav links)
    motion/                   behaviour only, no JSX
      gsap.ts                 registers ScrollTrigger once, exports gsap and ScrollTrigger
      dom.ts                  query helpers (§4.3)
      debug.ts                exposes section APIs to tests in dev (§4.4)
      types.ts                SectionApi and shared types
      useSectionMotion.ts     the hook that mounts and destroys a section (§4.4)
      cursor/                 page cursor (P1)
      nav-character/          the low-poly nav character (P2)
      hero/ work/ experience/ education/ contact/   one folder per section (P3–P7)
      seams/                  section-to-section transitions (P8)
    components/
      atoms/                  one component per file, e.g. atoms/BrandLogo.tsx
      molecules/
      organisms/              one folder per section organism: organisms/WorkSection/WorkSection.tsx + work.css
      templates/              JourneyTemplate.tsx, SectionPreviewTemplate.tsx
    pages/                    HomePage.tsx, SectionPreviewPage.tsx
  tests/
    helpers/                  section.ts (open and scroll), page.ts (errors, contrast)
    e2e/                      one spec per feature: cursor, nav-character, hero, work, experience, education,
                              contact, journey
```

**Import direction:** `pages` → `templates` → `organisms` → `molecules` → `atoms`. Anything may import from
`content/`, `motion/`, `assets/` and `styles/`. A level never imports from a level above it.

---

## 3. Naming and file rules

- Components: PascalCase file and export, one component per file, named export (`export function BrandLogo`).
- Motion modules: camelCase files (`work/mount.ts`, `work/scenes.ts`), named exports.
- Content: camelCase files exporting typed `const`s, with the type declared in the same file
  (`export interface Product {...}`, `export const PRODUCTS: readonly Product[] = [...]`).
- CSS: one file per section organism, next to it (`organisms/WorkSection/work.css`), imported by the organism.
- Every file stays under 500 lines (lint `max-lines`). If a mockup script would exceed it, split it as its phase says.

---

## 4. Porting rules

### 4.1 Markup (HTML to JSX)

Copy the mockup's markup for the section, then convert:

| HTML                                                                                                                                   | JSX                                                                                                         |
| -------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `class=`                                                                                                                               | `className=`                                                                                                |
| `for=`                                                                                                                                 | `htmlFor=`                                                                                                  |
| `tabindex="-1"`                                                                                                                        | `tabIndex={-1}`                                                                                             |
| `stroke-width`, `stroke-linecap`, `fill-opacity`, `text-anchor`, `font-size`, `clip-path`, `stop-color` (any kebab-case SVG attribute) | camelCase: `strokeWidth`, `strokeLinecap`, `fillOpacity`, `textAnchor`, `fontSize`, `clipPath`, `stopColor` |
| `xlink:href`                                                                                                                           | `href`                                                                                                      |
| `style="--i:3;--tilt:2deg"`                                                                                                            | `style={{ '--i': 3, '--tilt': '2deg' } as React.CSSProperties}`                                             |
| `aria-*`, `data-*`, `role`                                                                                                             | unchanged                                                                                                   |
| `<img ...>`, `<path ...>`                                                                                                              | self-closed: `<img ... />`                                                                                  |
| `&nbsp;` `&amp;` `&#8217;`                                                                                                             | the character itself (` `, `&`, `’`) or `{' '}`                                                             |
| `hidden` (attribute)                                                                                                                   | `hidden`                                                                                                    |
| inline `<script>`                                                                                                                      | never in JSX. Pre-paint scripts go in `index.html` (P0)                                                     |

Repeated blocks (tabs, panels, cards, ports) are rendered by mapping over `src/content/` data, and must produce **the
same DOM** as the mockup: same tags, classes, ids, attributes and order.

**DOM parity check (temporary, nothing committed):** with the mockup served on port 4173 (§5.4) and the app on 5180,
the class list of a section must match:

```bash
node -e "const {chromium}=require('@playwright/test');(async()=>{const b=await chromium.launch({channel:'chrome'});const p=await b.newPage();const L=async(u,s)=>{await p.goto(u);await p.waitForTimeout(1500);return p.evaluate(s=>[...document.querySelector(s).querySelectorAll('[class]')].map(e=>e.tagName+'.'+e.getAttribute('class')).join('\n'),s)};const a=await L(process.argv[1],process.argv[3]),c=await L(process.argv[2],process.argv[3]);console.log(a===c?'DOM PARITY OK':'DOM DIFFERS');if(a!==c){const A=a.split('\n'),C=c.split('\n');for(let i=0;i<Math.max(A.length,C.length);i++)if(A[i]!==C[i]){console.log('first difference at',i,'\nmockup:',A[i],'\napp:   ',C[i]);break}}await b.close()})()" "<mockup url>" "<app url>" "<root selector>"
```

Run it **before** the section's motion is mounted (it reads the DOM after 1.5 s; classes that motion adds later, such as
`is-active`, may differ and are fine). Differences in static markup must be fixed.

### 4.2 CSS

1. Copy the section's `style.css` verbatim into `organisms/<Section>/<section>.css`.
2. Delete the `@font-face` rules from it (the fonts are declared once in `styles/global.css`).
3. Delete the mockup-only preview rules: any rule starting with `body.<x>-preview` or `.<x>-preview` (for example
   `body.cred-preview{...}`, `.cred-preview .cred-lead{...}`). The preview template replaces them (P1).
4. Change every `url(...)` that points at a mockup asset to a relative path into `src/assets/`
   (for example `url('../../../assets/fonts/manrope-bold.ttf')`). Vite rewrites and hashes them.
5. Run `npx prettier --write <file>`. Change nothing else.

### 4.3 TypeScript helpers (`src/motion/dom.ts`, created in P1)

```ts
export function need<T extends Element>(root: ParentNode, selector: string): T; // throws Error(`Missing ${selector}`)
export function query<T extends Element>(root: ParentNode, selector: string): T | null;
export function queryAll<T extends Element>(root: ParentNode, selector: string): T[];
```

Use `need` for elements the section cannot work without, `query` for optional ones. Never use `!` (non-null
assertion) on a `querySelector` result.

### 4.4 Motion modules and the React bridge

Every mockup script is an IIFE with `function mount(root) { ... return api; }` and a global such as
`window.ArdialWork`. Port it like this:

1. **Types** (`src/motion/types.ts`, P1):
   ```ts
   export interface SectionApi {
     destroy(): void;
     readonly state?: Readonly<Record<string, unknown>>;
   }
   export type MountSection = (root: HTMLElement) => SectionApi;
   ```
2. **Module:** `src/motion/<section>/mount.ts` exports `mount<Section>: MountSection`. Remove the IIFE, the
   `instances` WeakMap, the `window.Ardial*` globals and the self-mount line at the bottom. Replace `window.gsap` and
   `window.ScrollTrigger` with `import { gsap, ScrollTrigger } from '../gsap'`. Replace
   `window.ArdialNavPrism?.mount(root)` with an import from `../nav-character/mount`.
3. **Split the closure.** The mockup functions share variables inside `mount`. Move that shared state into one typed
   object (`interface WorkRuntime { root: HTMLElement; tabs: HTMLButtonElement[]; active: number; ... }`), create it
   in `mount`, and turn each inner function into a module-level function that takes it:
   `function activate(runtime: WorkRuntime, index: number): void`. Each phase names the files to split into.
4. **Keep behaviour identical:** same numbers, same easing, same timings, same order of operations. Only names,
   types and file boundaries change. The numbers move into named constant objects (§4.5).
5. **React bridge** (`src/motion/useSectionMotion.ts`, P1):
   ```ts
   export function useSectionMotion(
     ref: RefObject<HTMLElement | null>,
     mount: MountSection,
     name: string,
   ): void;
   // useEffect: if ref.current, api = mount(ref.current); registerDebug(name, api); cleanup: api.destroy()
   ```
   Each section organism does `const ref = useRef<HTMLElement>(null); useSectionMotion(ref, mountWork, 'work');` and
   puts `ref` on its `<section>`. React StrictMode mounts, destroys and mounts again in development, so `destroy()`
   must undo everything `mount` did (listeners, timelines, ScrollTriggers, timers, classes on `<html>`).
6. **Debug handle** (`src/motion/debug.ts`, P1): in development only, `window.__ardial[name] = api`, so tests can read
   `state`. Declare it with `declare global { interface Window { __ardial?: Record<string, SectionApi> } }`.

### 4.5 Lint survival guide

The ESLint config is strict and `--max-warnings=0` turns warnings into failures. The mockup scripts break most of
these rules, so the port has to fix them. The patterns:

| Rule                                                                                              | Fails on                                                                                                    | Write instead                                                                                                                                |
| ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `id-length` (min 3; `id`, `db`, `to`, `up`, `fn` allowed; object properties are exempt)           | `g`, `ST`, `$`, `$$`, `k`, `i`, `e`, `t`, `x`, `y`, `r`, `p` as variables, parameters or destructured names | `gsap`, `ScrollTrigger`, `need`, `queryAll`, `index`, `event`, `progress`, `posX`, `posY`, `rect`. `{ x: 1 }` as a property is fine          |
| `no-magic-numbers` (only -1, 0, 1, 2 allowed; numbers inside object literals are **not** checked) | `width * 0.84`, `setTimeout(fn, 320)`, `if (n > 12)`                                                        | `const LAYOUT = { needleY: 0.84 } as const;` then `width * LAYOUT.needleY`. GSAP vars like `{ duration: 0.35 }` are object literals and fine |
| `complexity` 8, `sonarjs/cognitive-complexity` 10, `max-depth` 2                                  | long functions with nested `if`/loops                                                                       | early `return`s and small helper functions                                                                                                   |
| `max-statements` 15, `max-lines-per-function` 100                                                 | big `mount`/`setup` functions, big components                                                               | split into helpers or sub-components                                                                                                         |
| `max-params` 4                                                                                    | `draw(tl, sel, at, d, stagger)`                                                                             | one options object: `draw(tl, { selector, at, duration, stagger })`                                                                          |
| `react/jsx-max-depth` 5                                                                           | deep JSX trees                                                                                              | extract molecules and atoms                                                                                                                  |
| `sonarjs/no-nested-conditional`                                                                   | `a ? b : c ? d : e`                                                                                         | a small function with `if` / early returns                                                                                                   |
| `sonarjs/no-duplicate-string` (3+)                                                                | the same string literal three times                                                                         | a named `const`                                                                                                                              |
| `curly` all                                                                                       | `if (x) return;`                                                                                            | `if (x) { return; }`                                                                                                                         |
| `no-else-return`                                                                                  | `else` after `return`                                                                                       | drop the `else`                                                                                                                              |
| `sonarjs/no-commented-code`, `sonarjs/todo-tag`                                                   | commented code, `TODO`                                                                                      | delete it                                                                                                                                    |
| eslint comments                                                                                   | `// eslint-disable-line`                                                                                    | `// eslint-disable-next-line <rule> -- <reason>` (rare; only for real tool limits)                                                           |
| `jsx-a11y/*`                                                                                      | click handlers on `div`, images without `alt`                                                               | real `button`/`a` elements (the mockup already uses them), `alt` (decorative: `alt=""`)                                                      |
| `import/no-unresolved`                                                                            | a package path the resolver cannot read                                                                     | if `gsap/ScrollTrigger` triggers it, use the pattern already in `vite.config.ts`                                                             |

Comments that explain **why** stay (port the mockup's explanatory comments). Comments that restate code go.

---

## 5. Test strategy (memory-safe)

Running every check and every browser test after every change is slow and can run the machine out of memory. So
checks are **scoped to what you just touched** until P9.

### 5.1 Quick checks: after every step, only the files you touched

```bash
npx prettier --write <files>
npm run lint:files -- <files>
```

### 5.2 Phase checks: once, at the end of a phase

```bash
npm run typecheck                                        # whole project, but light
npm run test:feature -- tests/e2e/<feature>.spec.ts      # ONLY this phase's spec, desktop only
```

`test:feature` runs Playwright with **one worker, the desktop project only, the line reporter**. It starts its own
dev server and stops it when done.

### 5.3 Final checks: P9 only

```bash
npm run check        # prettier --check, eslint, tsc, knip on everything
npm run test:e2e     # every spec, desktop and phone
npm run build
```

### 5.4 Memory rules

- **Never run more than one Playwright command at a time**, and never two terminals running tests.
- **Never run `npm run check`, `npm run knip`, `npm run test:e2e` or `npm run build` before P9.** knip will also
  report half-ported code as unused mid-port; that is expected and fixed in P9.
- Do not leave `npm run dev` running while a test runs. The test starts and stops its own server (if one is already
  on port 5180 it reuses it).
- A spec opens **one page at a time** and closes it (`await page.close()`) before opening another. Use the helpers in
  `tests/helpers/`.
- To view the mockup for comparison, serve it from the folder that contains `ardial-portfolio/` and stop it after:
  `cd .. && python -m http.server 4173 --bind 127.0.0.1` → `http://127.0.0.1:4173/sections/03-work/`. This is the
  only way the mockup is ever used, and it is never referenced from code or tests.

---

## 6. Phase map

| Phase | Builds                                                               | Feature spec            | Depends on |
| ----- | -------------------------------------------------------------------- | ----------------------- | ---------- |
| P0    | Dependencies, Playwright, assets, global CSS, `index.html`, skeleton | none (typecheck only)   | —          |
| P1    | Motion core, atoms, preview page and template, page cursor           | `cursor.spec.ts`        | P0         |
| P2    | Nav character and the shared section nav                             | `nav-character.spec.ts` | P1         |
| P3    | Hero                                                                 | `hero.spec.ts`          | P2         |
| P4    | Selected work                                                        | `work.spec.ts`          | P2         |
| P5    | Experience                                                           | `experience.spec.ts`    | P2         |
| P6    | Education                                                            | `education.spec.ts`     | P2         |
| P7    | Contact and the CV                                                   | `contact.spec.ts`       | P2         |
| P8    | The journey page: all sections in order, seams                       | `journey.spec.ts`       | P3–P7      |
| P9    | Final checks, cleanup, mockup independence                           | everything              | P8         |

---

## Phase P0 — Dependencies, assets and skeleton

**Goal.** Everything later phases need exists: GSAP, Playwright, the assets copied into `src/assets/`, global CSS,
the pre-paint script and the test scripts.

**Read (mockup):** `../journey.html` (line with the pre-paint `<script>`), `../sections/shared/scrollbar.css`,
`../sections/shared/cursor.css`, `../sections/shared/nav-prism.css`, `../sections/01-hero/style.css` (only its
`@font-face` rules).

**Steps**

1. `npm install --save-exact gsap@3.15.0` and `npm install --save-dev --save-exact @playwright/test@1.64.0`.
2. Add scripts to `package.json` (keep the existing ones):
   ```json
   "test:feature": "playwright test --project=desktop --workers=1 --reporter=line",
   "test:e2e": "playwright test --workers=1 --reporter=line"
   ```
3. Create `playwright.config.ts`:
   - `testDir: 'tests/e2e'`, `fullyParallel: false`, `workers: 1`, `retries: 0`, `timeout: 90_000`.
   - `use: { baseURL: 'http://127.0.0.1:5180', channel: 'chrome', headless: true }`.
   - `projects`: `desktop` with `viewport: { width: 1280, height: 800 }`; `phone` with
     `viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true`.
   - `webServer: { command: 'npm run dev', url: 'http://127.0.0.1:5180', reuseExistingServer: true, timeout: 60_000 }`.
4. `tsconfig.json`: set `"include": ["src", "tests", "scripts", "vite.config.ts", "playwright.config.ts"]`.
5. `knip.json`: set `"project": ["src/**/*.{ts,tsx}", "tests/**/*.ts", "scripts/**/*.ts"]` (knip is only run in P9).
6. Copy assets (create the folders):
   - `../sections/01-hero/assets/manrope-medium.ttf`, `manrope-bold.ttf`, `OFL.txt` → `src/assets/fonts/`
   - `../sections/01-hero/assets/ardial-portrait.jpg` → `src/assets/images/`
   - `../sections/03-work/assets/simpul-mark.png` → `src/assets/images/`
   - `../sections/05-credentials/assets/backgrounds-baktiilham.webp`, `backgrounds-harisenin.webp`,
     `backgrounds-ut.webp` → `src/assets/images/education/`
   - all 12 files in `../sections/05-credentials/assets/certificates/` → `src/assets/images/certificates/`
   - `../sections/06-contact/assets/Ardial-CV.pdf` → `src/assets/cv/`
   - Do **not** copy `credentials-*.webp` (unused) or `nav-prism.svg` (replaced by the character in P2).
7. Create `src/styles/`:
   - `scrollbar.css`, `cursor.css`, `nav-character.css`: verbatim copies of the three shared CSS files.
   - `global.css`: the two `@font-face` rules for Manrope (500 and 700, `font-display: swap`) pointing at
     `../assets/fonts/...`; `body { margin: 0; background: #353bc8; }`; then
     `@import './scrollbar.css'; @import './cursor.css'; @import './nav-character.css';` (imports go at the top).
   - Import `./styles/global.css` in `src/main.tsx`.
8. `index.html`: add in `<head>`, in this order: `<meta name="theme-color" content="#353bc8">`, then the pre-paint
   script copied **verbatim** from `../journey.html` (the one that sets `history.scrollRestoration` and the
   `hero-loading` class with its 7.5 s fallback). Keep `<title>Ardial — Portfolio</title>`. Do not add a font
   `<link rel="preload">`: the fonts live in `src/assets/` and Vite gives them hashed names.
9. Create the empty folders from §2 with a `.gitkeep` in each that has no file yet: `src/content`, `src/motion`,
   `src/assets/art`, `tests/helpers`, `tests/e2e`, `scripts`, `cv`.

**Phase checks:** `npm run typecheck` · `npx prettier --check src index.html playwright.config.ts` ·
`npm run lint:files -- playwright.config.ts src/main.tsx`

**Exit criteria**

- [x] `gsap` 3.15.0 and `@playwright/test` 1.64.0 are installed at those exact versions, nothing else was added
- [x] `playwright.config.ts` has the `desktop` and `phone` projects, one worker, `channel: 'chrome'` and the dev server
- [x] All assets in step 6 exist under `src/assets/`, and nothing in `src/` refers to a path outside the project
- [x] `index.html` has the pre-paint script, and `npm run dev` serves the page with the Manrope font loaded (check
      `document.fonts.check('700 16px Manrope')` is `true` in the browser console)
- [x] `npm run typecheck` passes

---

## Phase P1 — Motion core, atoms, preview page, page cursor

**Goal.** The shared building blocks every section uses, a way to preview one section alone, and the page cursor.

**Read (mockup):** `../sections/shared/cursor.js`, `../sections/05-credentials/index.html` (the `.cred-lead` spacer
and the brand logo SVG inside `a.c-brand`), the arrow icons used in the section navs.

**Create**

| File                                                  | What                                                                                                                                                                                  |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/motion/gsap.ts`                                  | `gsap.registerPlugin(ScrollTrigger)` once; re-export `gsap` and `ScrollTrigger`                                                                                                       |
| `src/motion/dom.ts`                                   | `need`, `query`, `queryAll` (§4.3)                                                                                                                                                    |
| `src/motion/types.ts`                                 | `SectionApi`, `MountSection` (§4.4)                                                                                                                                                   |
| `src/motion/debug.ts`                                 | `registerDebug(name, api)`, development only (§4.4)                                                                                                                                   |
| `src/motion/useSectionMotion.ts`                      | the React bridge (§4.4)                                                                                                                                                               |
| `src/motion/media.ts`                                 | `prefersReducedMotion(): boolean` and `isFinePointer(): boolean` (the two `matchMedia` queries the mockup repeats)                                                                    |
| `src/motion/cursor/cursor.ts`                         | port of `cursor.js`: `mountCursor(): () => void` (returns its own cleanup)                                                                                                            |
| `src/components/atoms/BrandLogo.tsx`                  | the "Ardial." wordmark SVG from the section navs, props `{ dotClassName: string }` (each section passes its own dot class, e.g. `c-dot`)                                              |
| `src/components/atoms/Icon.tsx`                       | `Icon` with `name: 'arrow-up-right' \| 'arrow-up' \| 'download' \| 'copy'`, the exact paths from the mockup                                                                           |
| `src/components/atoms/InlineSvg.tsx`                  | renders a `?raw` SVG string: `<span className="svg-host" aria-hidden="true" dangerouslySetInnerHTML={{ __html: markup }} />` with `.svg-host{display:contents}` in `global.css` (D-6) |
| `src/components/organisms/PageCursor.tsx`             | calls `mountCursor` in an effect, renders nothing                                                                                                                                     |
| `src/components/templates/SectionPreviewTemplate.tsx` | a `<main>` with a `100svh` lead spacer (`<div aria-hidden="true" style={{ height: '100svh' }} />`) above `children`, and the same spacer below                                        |
| `src/pages/SectionPreviewPage.tsx`                    | reads `?section=`; renders the matching organism inside the preview template. Until a section exists, render `<p>Section not ported yet</p>`                                          |
| `src/pages/HomePage.tsx`                              | renders `PageCursor` (the journey is added in P8)                                                                                                                                     |
| `tests/helpers/section.ts`                            | `openSection(page, id)`, `scrollPin(page, rootSelector, fraction)`, `errorsOf(page)`                                                                                                  |
| `tests/helpers/page.ts`                               | `contrastRatio(fg, bg)` (accepts `rgb()` and `color(srgb ...)`, see `../tmp/browser-check/cred-shot.cjs` `lum`)                                                                       |
| `tests/e2e/cursor.spec.ts`                            | the cursor spec below                                                                                                                                                                 |

**Steps**

1. Create the motion core files in the order of the table, quick-checking each.
2. Port `cursor.js` into `motion/cursor/cursor.ts` (§4.4, §4.5). It still stands aside over `.ardial-hero`. Keep the
   spring `1 - Math.exp(-8 * dt)` (put `8` in a constant object).
3. Create the atoms, `PageCursor`, the template and the two pages. `main.tsx` renders `SectionPreviewPage` when
   `new URLSearchParams(location.search).has('section')`, otherwise `HomePage`, inside `StrictMode`.
4. Write the helpers and `cursor.spec.ts`.

**Feature spec `cursor.spec.ts`** (desktop): on `/?section=none`, moving the mouse to (400, 300) adds
`has-ardial-cursor` to `<html>` and a `.ardial-cursor` element exists; moving onto a `<button>` or link adds
`cursor-on-action`; there are no page errors.

**Exit criteria**

- [x] `npm run test:feature -- tests/e2e/cursor.spec.ts` passes
- [x] `useSectionMotion` calls `destroy()` on unmount (read the code; StrictMode exercises it in every later spec)
- [x] `npm run typecheck` passes

---

## Phase P2 — Nav character and the section nav

**Goal.** The low-poly nav character and the nav header every section shares.

**Read (mockup):** `../sections/shared/nav-prism.js` (164 lines), `../sections/shared/nav-prism.css`, and the
`<header class="...-nav">` of `../sections/03-work/index.html`, `04-experience`, `05-credentials`, `06-contact`.

**Create**

| File                                              | What                                                                                                                                                                                                                                                                                                       |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/motion/nav-character/mesh.ts`                | `icosphere()`, `norm()`, `shade()`, `mix()` and the colour constants                                                                                                                                                                                                                                       |
| `src/motion/nav-character/render.ts`              | `rotate()`, `project()`, `render()` (takes the runtime object)                                                                                                                                                                                                                                             |
| `src/motion/nav-character/talk.ts`                | `LINES`, `pick()`, `talk()`, `show()`, `hide()`, `clearTalk()`, `topicFor()`                                                                                                                                                                                                                               |
| `src/motion/nav-character/mount.ts`               | `mountNavCharacter(root): { setMotion(on: boolean): void; destroy(): void }`: the rest (state, `hop`, `blink`, `breathe`, listeners, `stop`, `resume`)                                                                                                                                                     |
| `src/components/molecules/NavCharacterButton.tsx` | `<button className="nav-prism" type="button" aria-label="Spin the little character" title="Spin"><span className="nav-prism-art" aria-hidden="true"><svg viewBox="0 0 100 100" /></span></button>`                                                                                                         |
| `src/components/molecules/NavLinks.tsx`           | the `<nav aria-label="Main navigation">` with links from `content/nav.ts`                                                                                                                                                                                                                                  |
| `src/content/nav.ts`                              | the nav links per section exactly as in the mockup headers (`Work` → `#work`; `Contact` → `mailto:...` with the arrow icon; Contact's own nav has `Work` and `Top`)                                                                                                                                        |
| `src/components/organisms/SectionNav.tsx`         | props `{ prefix: 'work' \| 'x' \| 'c' \| 'k'; name: string; titleId?: string; nameTag: 'h2' \| 'p'; links: ... }`; renders `header.${prefix}-nav` > `a.${prefix}-brand` (`BrandLogo`) + the name element `.${prefix}-section-name` + `NavCharacterButton` + `NavLinks`, the same DOM as the mockup headers |
| `tests/e2e/nav-character.spec.ts`                 | below                                                                                                                                                                                                                                                                                                      |

The hero's header is different (`hero-nav`, `nav-role`) and is built in P3.

**Steps**

1. Port `nav-prism.js` into the four motion files (§4.4 step 3: one `NavCharacterRuntime` object holds `state`,
   `faces`, `eyes`, `mouth`, `blush`, `bubble` and the flags). Keep every number and easing.
2. It listens to `document` `pointermove` (follows the cursor anywhere) and reacts with talk only for targets inside
   its own section, exactly as the mockup does.
3. Create the molecules, `nav.ts` and `SectionNav`. Temporarily render a `SectionNav` with `prefix="work"` in
   `SectionPreviewPage` for `?section=nav` and mount the character on it in an effect (remove this temporary case in
   P4 when the Work section uses it).

**Feature spec `nav-character.spec.ts`** (desktop, `/?section=nav`): the button has polygons after 1.5 s; moving the
mouse from (200, 400) to (1100, 700) changes the visible faces' `points` and moves the pupils (the average `cx` of the
`ellipse[fill="#141857"]` grows by at least 2); no page errors.

**Exit criteria**

- [x] `npm run test:feature -- tests/e2e/nav-character.spec.ts` passes
- [x] On a 390 px wide window the character is `display: none` (CSS from `nav-character.css`)
- [x] No motion file is over 500 lines and `npm run lint:files -- src/motion/nav-character src/components` passes
- [x] `npm run typecheck` passes

---

## Phase P3 — Hero

**Goal.** The hero section, with its loading sequence, portrait, particles, cursor, folded headlines and story
timeline.

**Read (mockup):** `../sections/01-hero/index.html` (the `<section class="ardial-hero">`), `style.css`, `script.js`
(275 lines), `portrait.js` (105 lines), `IMPLEMENTATION.md`.

**Create**

| File                                                                                                           | What                                                                                                               |
| -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `src/content/hero.ts`                                                                                          | every visible string of the hero: role, titles, build-journey labels, actions                                      |
| `src/assets/art/hero/headline-folds.svg`, `closing-folds.svg`, plus any other `aria-hidden` SVG without images | verbatim copies of those `<svg>` blocks (D-6)                                                                      |
| `src/components/organisms/HeroSection/HeroSection.tsx` + `hero.css`                                            | the section, same DOM as the mockup (§4.1)                                                                         |
| `src/components/organisms/HeroSection/HeroNav.tsx`                                                             | `header.hero-nav` (brand, `span.nav-role`, `NavCharacterButton`, nav)                                              |
| `src/components/organisms/HeroSection/HeroPortrait.tsx`                                                        | `div.portrait-scene` with `div.portrait-view` (the `<img>` imports `ardial-portrait.jpg`) and `div.build-journey`  |
| `src/components/organisms/HeroSection/HeroTitles.tsx`                                                          | `h1.hero-title`, `h2.closing-title` and their fold SVGs                                                            |
| `src/motion/hero/constants.ts`                                                                                 | every number from `script.js` and `portrait.js`, in named objects                                                  |
| `src/motion/hero/portrait.ts`                                                                                  | port of `portrait.js` (`resize`, `planeQuad`, `draw`, `tick`, `wake`, `reset`, `release`), exports `mountPortrait` |
| `src/motion/hero/particles.ts`                                                                                 | `resize`, `draw`, `drawParticles` from `script.js`                                                                 |
| `src/motion/hero/cursor.ts`                                                                                    | `drawCursor` (the hero's own cursor)                                                                               |
| `src/motion/hero/story.ts`                                                                                     | `setPhase`, `finishIntro`, `open` and the scroll timeline built in `setup`                                         |
| `src/motion/hero/mount.ts`                                                                                     | `mountHero`: runtime object, `tick`, `wake`, `update`, `dispose`, `setup`, listeners                               |
| `tests/e2e/hero.spec.ts`                                                                                       | below                                                                                                              |

**Steps**

1. Content, art files, then the organism and sub-components with **no motion**. Check DOM parity (§4.1) against
   `http://127.0.0.1:4173/sections/01-hero/` with selector `.ardial-hero`.
2. Copy the CSS (§4.2) into `hero.css`.
3. Port `portrait.js`, then `script.js` into the modules above (§4.4). The hero mounts the nav character the same
   way the mockup does (`mountNavCharacter(root)`, then `setMotion(enabled)` in `setup`).
4. Wire `useSectionMotion(ref, mountHero, 'hero')` in `HeroSection`. Add the `hero` case to `SectionPreviewPage`
   (the hero is first on the page, so render it without the lead spacer).

**Feature spec `hero.spec.ts`** (desktop, `/?section=hero`): within 9 s the `hero-loading` class is gone from
`<html>`; `h1.hero-title` is visible; the particle `canvas.hero-particles` has a non-zero width and height; moving
the mouse over the stage shows the hero's own cursor (`.ardial-hero.has-cursor`); scrolling to the end of the hero's
pin and back to the top raises no page error and `h1.hero-title` is visible again; with `reducedMotion: 'reduce'`
there is no hero pin and the title is visible; no page errors.

**Exit criteria**

- [x] DOM parity OK for `.ardial-hero` (§4.1, static markup)
- [x] `npm run test:feature -- tests/e2e/hero.spec.ts` passes
- [x] Side by side with the mockup at the top and in the middle of the hero (§5.4), it looks the same
- [x] `npm run typecheck` passes

---

## Phase P4 — Selected work

**Goal.** The Work section: the product picker, the five product scenes, per-product palettes and headline marks.

**Read (mockup):** `../sections/03-work/index.html`, `style.css`, `script.js` (219 lines), `IMPLEMENTATION.md`.

**Create**

| File                                                                                                                                                                                                                                                                                                                           | What                                                                                                                                                                                                            |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/content/work.ts`                                                                                                                                                                                                                                                                                                          | `PRODUCTS`: id (`simpul`, `mnemo`, `treecord`, `agaro`, `qswap`, in this order), tab label, headline (with the marked word), kind line, the visually hidden description, the link (`href`, label)               |
| `src/assets/art/work/work-art.svg`                                                                                                                                                                                                                                                                                             | the `svg.work-art` scene, verbatim, **except** the Simpul logo `<image>`: if the scene contains `<image href="assets/simpul-mark.png">`, write `svg.work-art` as JSX instead and import `simpul-mark.png` (D-6) |
| `src/components/molecules/WorkTabs.tsx`                                                                                                                                                                                                                                                                                        | `div.work-tabs` with the five `button.work-tab`                                                                                                                                                                 |
| `src/components/molecules/WorkPanel.tsx`                                                                                                                                                                                                                                                                                       | one `div.work-panel`                                                                                                                                                                                            |
| `src/components/organisms/WorkSection/WorkSection.tsx` + `work.css`                                                                                                                                                                                                                                                            | `SectionNav prefix="work" name="Selected work" nameTag="h2" titleId="work-title"`, tabs, panels, art                                                                                                            |
| `src/motion/work/constants.ts`, `scenes.ts` (`svgPoint`, `drawThread`, `qset`, `qPreview`, `springs`), `palette.ts` (`theme` with the 320 ms debounce and the "only write the page palette if no later section claimed it" rule), `mount.ts` (`mountWork`: `tick`, `wake`, `scrubbed`, `activate`, `dispose`, `setup`, `pick`) | the port of `script.js`                                                                                                                                                                                         |
| `tests/e2e/work.spec.ts`                                                                                                                                                                                                                                                                                                       | below                                                                                                                                                                                                           |

**Steps:** same pattern as P3 (content, markup, DOM parity on `.work`, CSS, motion, wire, preview case). Remove the
temporary `?section=nav` case from P2 and point `nav-character.spec.ts` at `?section=work` instead.

**Feature spec `work.spec.ts`** (desktop, `/?section=work`): five tabs and five panels; clicking the QSwap tab makes
its panel the visible one and sets `aria-selected="true"` on it; scrolling to the last fifth of the pin selects QSwap
and `<html data-palette>` becomes `qswap` within 2 s; arrow keys move between tabs; with `reducedMotion: 'reduce'`
there is no pin and the tabs still switch; no page errors.

**Exit criteria**

- [x] DOM parity OK for `.work`
- [x] `npm run test:feature -- tests/e2e/work.spec.ts` passes, and `nav-character.spec.ts` passes on `?section=work`
- [x] Side by side with the mockup for each product, it looks the same
- [x] `npm run typecheck` passes

---

## Phase P5 — Experience

**Goal.** The Experience timeline: seven stops, year odometer, ruler with needle, scenes, headline character reveal and
marks, looping tool tickers.

**Read (mockup):** `../sections/04-experience/index.html` (41 kB, generated), `style.css`, `script.js` (157 lines),
`IMPLEMENTATION.md`.

**Create**

| File                                                                                                                                                                                                                                                       | What                                                                                                                                                                                                                                                                       |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/content/experience.ts`                                                                                                                                                                                                                                | `STOPS` in order: `networks`, `korea`, `arcane`, `mentor`, `tekno`, `polaris`, `ivet`. Each: period, year, headline (as words, with the marked word and its mark type), role, org, chips, ticker items. Copy the text exactly from the mockup panels and `.x-ticker` lists |
| `src/assets/art/experience/x-art.svg`                                                                                                                                                                                                                      | `svg.x-art` verbatim (it has no images)                                                                                                                                                                                                                                    |
| `src/components/atoms/SplitChars.tsx`                                                                                                                                                                                                                      | renders a word as `span.x-word` > `span.x-char` per character, the same DOM the mockup's generator wrote (check the mockup markup for the exact classes, including `x-mark` and its art)                                                                                   |
| `src/components/molecules/ExperiencePanel.tsx`                                                                                                                                                                                                             | one `div.x-panel`                                                                                                                                                                                                                                                          |
| `src/components/molecules/ExperienceRuler.tsx`                                                                                                                                                                                                             | `div.x-ruler` with `div.x-tape`, `span.x-needle`, `div.x-ticker`                                                                                                                                                                                                           |
| `src/components/molecules/YearRoll.tsx`                                                                                                                                                                                                                    | `div.x-year-roll` with its `span.x-digit`s                                                                                                                                                                                                                                 |
| `src/components/organisms/ExperienceSection/ExperienceSection.tsx` + `experience.css`                                                                                                                                                                      | `SectionNav prefix="x" name="Experience" nameTag="h2" titleId="exp-title"`, year roll, seven panels, art, ruler                                                                                                                                                            |
| `src/motion/experience/constants.ts` (`PLAY`, `SLIDE` and all other numbers), `scenes.ts` (`draw`, `pop`, `count`, `place`), `tickers.ts` (`fillTickers`, `roll`), `mount.ts` (`mountExperience`: `read`, `theme`, `activate`, `dispose`, `setup`, `pick`) | the port of `script.js`; keep `autoRound: false` where the mockup has it                                                                                                                                                                                                   |
| `tests/e2e/experience.spec.ts`                                                                                                                                                                                                                             | below                                                                                                                                                                                                                                                                      |

**Steps:** same pattern as P3. DOM parity on `.experience`.

**Feature spec `experience.spec.ts`** (desktop, `/?section=experience`): seven panels; scrolling to the middle of stop
`i` (`i` from 0 to 6) makes panel `i` the visible one and the year roll show that stop's year; the flag above the
needle is within 6 px of the needle's centre; the section is `is-paper` and `<html data-palette>` is `experience`
while pinned; the active stop's ticker moves (its transform changes over 500 ms); with `reducedMotion: 'reduce'` there
is no pin; no page errors.

**Exit criteria**

- [x] DOM parity OK for `.experience`
- [x] `npm run test:feature -- tests/e2e/experience.spec.ts` passes
- [x] Side by side with the mockup for the first, middle and last stop, it looks the same
- [x] `npm run typecheck` passes

---

## Phase P6 — Education

**Goal.** Education: three schools with seals, selected key words that swipe sideways, and the free-to-explore
certificate board with filters and a dialog.

**Read (mockup):** `../sections/05-credentials/index.html`, `style.css`, `script.js` (156 lines), `IMPLEMENTATION.md`.

**Create**

| File                                                                                                                                                                                                                                                                                                | What                                                                                                                                                                                                                                                                                                                                                                |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/content/education.ts`                                                                                                                                                                                                                                                                          | `SCHOOLS` (`smk`, `rise`, `ut`: tab label, period, headline words, key word and its alternates, degree, institution, stamps, score, seal ring text, emblem image import), `CERTIFICATES` (12, in mockup order: image import, title, issuer, group, skills, tilt), `GROUPS` order for the filters. Copy every value from the mockup's markup and `data-*` attributes |
| `src/components/molecules/SelectedWord.tsx`                                                                                                                                                                                                                                                         | the key word: `span.c-word.c-key` > `span.c-roll` > `span.c-roll-in` > `span.c-alt`… plus the `span.c-sel` copy, exactly as the mockup                                                                                                                                                                                                                              |
| `src/components/molecules/SchoolPanel.tsx`, `CertificatesPanel.tsx` (filters, front details, open button, count), `CertificateCard.tsx`, `SchoolSeal.tsx` (one `g.c-seal` in JSX: it contains an `<image>`)                                                                                         | the panels and parts                                                                                                                                                                                                                                                                                                                                                |
| `src/components/organisms/EducationSection/EducationSection.tsx` + `education.css`                                                                                                                                                                                                                  | `SectionNav prefix="c" name="Education" nameTag="h2" titleId="cred-title"`, tabs, four panels, `svg.c-art` (JSX, with `SchoolSeal`s), `div.c-deck`, `p.c-hint`, `dialog.c-dialog`                                                                                                                                                                                   |
| `src/motion/education/constants.ts` (`STATES`, `FLIPPED` and all other numbers), `panels.ts` (`buildPanel`), `deal.ts` (`buildDeal`), `board.ts` (`describe`, filters, the board lean), `mount.ts` (`mountEducation`: `read`, `theme`, `activate`, `crossfade`, `dispose`, `setup`, `pick`, `open`) | the port of `script.js`. Keep: timelines built with the panel briefly shown, tilt and dim on `.c-face`                                                                                                                                                                                                                                                              |
| `tests/e2e/education.spec.ts`                                                                                                                                                                                                                                                                       | below                                                                                                                                                                                                                                                                                                                                                               |

**Steps:** same pattern as P3. DOM parity on `.credentials`.

**Feature spec `education.spec.ts`** (desktop, `/?section=education`): for each school, at the start of its stretch
the selection `--sel` is 0 and the first word is in the window; at its end `--sel` is 1 and the last alternate
(`teaching`, `finish`, `proving`) is in the window; at the certificates the 12 cards land and load; clicking the
Mathematics filter dims 8 cards and shows "Become an Algebra Master"; "Open certificate" opens the dialog with that
title and an image, and Escape closes it; contrast of the headline, period, degree and stamps against the night
background is at least 4.5; with `reducedMotion: 'reduce'` there is no pin and all 12 cards are placed; no page
errors.

**Exit criteria**

- [x] DOM parity OK for `.credentials`
- [x] `npm run test:feature -- tests/e2e/education.spec.ts` passes
- [x] Side by side with the mockup for each school and the certificates, it looks the same
- [x] `npm run typecheck` passes

---

## Phase P7 — Contact and the CV

**Goal.** The contact finale (router panel, handshake, selected key word, CV download) and the CV source with its
print script.

**Read (mockup):** `../sections/06-contact/index.html`, `style.css`, `script.js` (139 lines), `IMPLEMENTATION.md`,
`../cv/ardial-cv.html`, `../tmp/browser-check/cv-print.cjs`.

**Create**

| File                                                                                                                                                                                                                                                                                                                                                                         | What                                                                                                                                                                             |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/content/contact.ts`                                                                                                                                                                                                                                                                                                                                                     | email, the four ports (name, handle, href, external or not), the description, the key word alternates (`build`, `ship`, `scale`, `launch`, `build`), the credit line             |
| `src/components/molecules/RouterPort.tsx`                                                                                                                                                                                                                                                                                                                                    | one `a.k-port` with socket, LED, jack, plug, name, handle                                                                                                                        |
| `src/components/molecules/MailBar.tsx`, `CvButton.tsx` (imports `assets/cv/Ardial-CV.pdf`, `download="Ardial-CV.pdf"`), `ContactHeadline.tsx` (typed headline with the selected key word)                                                                                                                                                                                    | the parts                                                                                                                                                                        |
| `src/components/organisms/ContactSection/ContactSection.tsx` + `contact.css`                                                                                                                                                                                                                                                                                                 | `SectionNav prefix="k" name="Contact" nameTag="p"` (no `titleId`; the headline is `h2#contact-title`), main, side, router, `svg.k-wire` (JSX: it is drawn by script), bottom bar |
| `src/motion/contact/constants.ts` (`TYPE`, `WORDS`, `SELECT`, `LOOP`, `PACKETS`, `LINK`, `PORTS` and the rest), `typing.ts` (`type`, the word lighting), `cable.ts` (`draw`, `link`), `pointer.ts` (`onPointer`, `rest`), `mount.ts` (`mountContact`: `apply`, `looping`, `theme`, `dispose`, `setup`, copy, the per-frame redraw while `ScrollTrigger.isInViewport(stage)`) | the port of `script.js`                                                                                                                                                          |
| `cv/ardial-cv.html`                                                                                                                                                                                                                                                                                                                                                          | verbatim copy of `../cv/ardial-cv.html`                                                                                                                                          |
| `scripts/print-cv.ts`                                                                                                                                                                                                                                                                                                                                                        | port of `cv-print.cjs`: prints `cv/ardial-cv.html` to `src/assets/cv/Ardial-CV.pdf` with `chromium` from `@playwright/test` (`channel: 'chrome'`, `preferCSSPageSize`)           |
| `tests/e2e/contact.spec.ts`                                                                                                                                                                                                                                                                                                                                                  | below                                                                                                                                                                            |

**Steps:** same pattern as P3, DOM parity on `.contact`. Then add `"cv": "node scripts/print-cv.ts"` to the scripts,
run `npm run cv`, and confirm the PDF still has 3 pages.

**Feature spec `contact.spec.ts`** (desktop, `/?section=contact`): at 1% of the pin the headline is untyped and the
caret waits; at 15% it is partly typed; at 36%, 52% and 68% the packet in flight is `SYN`, `SYN-ACK`, `ACK`; at the
end the four ports are up, the status reads "Connected. Pick a way in." and the key word loop rolls on from `build`
within 3 s; the cable's ends stay within 3 px of the "You" dot and the uplink plug, also after moving the mouse to
three positions; the Copy button writes `contact@ardial.my.id` to the clipboard (grant `clipboard-read` and
`clipboard-write`); the CV link downloads a file starting with `%PDF-`; with `reducedMotion: 'reduce'` there is no pin
and the panel is shown linked and typed; no page errors.

**Exit criteria**

- [x] DOM parity OK for `.contact`
- [x] `npm run test:feature -- tests/e2e/contact.spec.ts` passes
- [x] `npm run cv` regenerates a 3-page `src/assets/cv/Ardial-CV.pdf`
- [x] Side by side with the mockup at the start, the handshake and the end, it looks the same
- [x] `npm run typecheck` passes

---

## Phase P8 — The journey: all sections and the seams

**Goal.** `/` shows the whole journey (hero, work, experience, education, contact) with the transitions between
sections, exactly like `../journey.html`.

**Read (mockup):** `../journey.html`, `../sections/shared/seams.js` (54 lines), `../sections/README.md` (the seams
paragraph).

**Create**

| File                                           | What                                                                                                                                                                                                                        |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/components/templates/JourneyTemplate.tsx` | renders its section children in order inside `<main id="journey">`, then mounts the seams in an effect **after** the sections (children's effects run first; the seams wait for fonts and 60 ms, as the mockup does)        |
| `src/motion/seams/seams.ts`                    | port of `seams.js`: the `SEAMS` table (sweep, dive, curtain), the held-stage class style, `reset`, `enter`, `pinOf`, the shared `live` list; returns a cleanup that removes the injected style and every seam ScrollTrigger |
| `src/pages/HomePage.tsx`                       | `PageCursor` + `JourneyTemplate` with `HeroSection`, `WorkSection`, `ExperienceSection`, `EducationSection`, `ContactSection`                                                                                               |
| `tests/e2e/journey.spec.ts`                    | below                                                                                                                                                                                                                       |

**Feature spec `journey.spec.ts`** (desktop, `/`): five pinned stages in page order with no overlap; for each of the
three seams, at 25%, 50% and 75% of the gap both stages are `position: fixed` at the top and the incoming stage's
`clip-path` starts with the right shape (`inset` for the sweep and curtain, `circle` for the dive); past each gap no
seam inline style is left and the incoming stage is pinned at 0; jumping from the top straight to education leaves
`<html data-palette>` as `credentials`; no page errors.

**Exit criteria**

- [x] `npm run test:feature -- tests/e2e/journey.spec.ts` passes
- [x] Scrolling `/` from top to bottom matches `../journey.html` by eye at each seam
- [x] `npm run typecheck` passes

---

## Phase P9 — Final checks, cleanup, mockup independence

**Goal.** Everything passes at once, nothing depends on the mockup, and the project is ready for the mockup to be
deleted.

**Steps**

1. Delete every `.gitkeep` in a folder that now has files.
2. `npm run check`. Fix every failure (knip will name unused exports and files from the port; remove them or use them,
   do not silence knip).
3. `npm run test:e2e` (every spec, desktop and phone). On the phone project, fix only real failures; tests that are
   desktop-only by nature (mouse movement, nav character) must `test.skip` on the phone project with a reason.
4. `npm run build`, then `npm run preview` and open `http://127.0.0.1:4180`: the journey works from the build.
5. **Mockup independence:** this search must print nothing:
   ```bash
   grep -rn -e "\.\./sections" -e "journey\.html" -e "browser-check" -e "\.\./cv/" -e "\.\./tmp/" src tests scripts cv index.html vite.config.ts playwright.config.ts
   ```
6. Update `README.md`: how to run, preview a section, the test commands (feature and full), and `npm run cv`.

**Exit criteria**

- [x] `npm run check` passes with no warning and knip reports nothing
- [x] `npm run test:e2e` passes on desktop and phone
- [x] `npm run build` succeeds and the preview works
- [x] The independence search prints nothing
- [x] The README is updated
- [x] **Ready:** the mockup (`../sections/`, `../journey.html`, `../tmp/`, `../cv/`) can be deleted. Do not delete it
      yourself; report that P9 is complete and let Ardial delete it.
