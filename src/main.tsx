import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import './styles/global.css';
import { HomePage } from './pages/HomePage';
import { SectionPreviewPage } from './pages/SectionPreviewPage';

const host = document.getElementById('root');
const isPreview = new URLSearchParams(location.search).has('section');
if (host) {
  // The built page carries the journey prerendered (scripts/prerender.ts): React adopts that HTML instead of building it.
  if (!isPreview && host.firstElementChild) {
    hydrateRoot(
      host,
      <StrictMode>
        <HomePage />
      </StrictMode>,
    );
  } else {
    host.replaceChildren();
    createRoot(host).render(
      <StrictMode>{isPreview ? <SectionPreviewPage /> : <HomePage />}</StrictMode>,
    );
  }
}
