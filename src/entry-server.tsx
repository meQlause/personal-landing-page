import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { HomePage } from './pages/HomePage';

// Renders the journey to HTML at build time (scripts/prerender.ts), so the page paints before its JavaScript has run.
export function render(): string {
  return renderToString(
    <StrictMode>
      <HomePage />
    </StrictMode>,
  );
}
