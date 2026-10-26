// eslint-disable-next-line import/no-unresolved -- the plugin is exports-only ESM, which eslint-plugin-import's node resolver cannot read
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';

// Preloads the built web fonts, so they arrive before the first layout and the text is laid out once, not twice.
function preloadFonts(): Plugin {
  return {
    name: 'preload-fonts',
    transformIndexHtml: {
      order: 'post',
      handler: (_html, context) =>
        Object.keys(context.bundle ?? {})
          .filter((file) => file.endsWith('.woff2'))
          .map((file) => ({
            tag: 'link',
            attrs: {
              rel: 'preload',
              href: `./${file}`,
              as: 'font',
              type: 'font/woff2',
              crossorigin: '',
            },
            injectTo: 'head' as const,
          })),
    },
  };
}

const ENTRY_SCRIPT = /<script type="module" crossorigin src="([^"]+)"><\/script>/;

// The built page is prerendered, so it paints from its HTML, CSS and fonts alone. The app's script is requested once that
// first paint is on screen (the loading surface covers the hero until the script starts its intro), so it never competes
// with it; a timer is the fallback where the paint timing is not reported.
const LOADER = (src: string): string =>
  `<script>(()=>{let done=false;const go=()=>{if(done)return;done=true;const s=document.createElement('script');s.type='module';s.src=${JSON.stringify(src)};document.head.append(s)};try{new PerformanceObserver((list,observer)=>{if(list.getEntriesByName('first-contentful-paint').length){observer.disconnect();go()}}).observe({type:'paint',buffered:true})}catch{}setTimeout(go,3000)})()</script>`;

function loadAfterPaint(): Plugin {
  return {
    name: 'load-after-paint',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler: (html) => html.replace(ENTRY_SCRIPT, (_tag, src: string) => LOADER(src)),
    },
  };
}

export default defineConfig({
  // relative asset URLs: the built site works from any path
  base: './',
  // unknown paths answer 404 instead of the page, so /robots.txt-style requests never get HTML
  appType: 'mpa',
  plugins: [react(), preloadFonts(), loadAfterPaint()],
  experimental: {
    // The prerendered HTML sits in dist/index.html, so its asset URLs are relative to it, like the client's
    renderBuiltUrl: (file, { ssr }) => (ssr ? `./${file}` : { relative: true }),
  },
});
