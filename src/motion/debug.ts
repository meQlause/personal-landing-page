import type { SectionApi } from './types';

declare global {
  interface Window {
    __ardial?: Record<string, SectionApi>;
  }
}

// Development only: lets the Playwright specs read a section's state. Nothing is exposed in a production build.
export function registerDebug(name: string, api: SectionApi): void {
  if (!import.meta.env.DEV) {
    return;
  }
  window.__ardial ??= {};
  window.__ardial[name] = api;
}
