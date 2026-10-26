// The CV PDF, built by scripts/print-cv.ts from cv/ardial-cv.html. Imported as a URL so Vite bundles and hashes it.
// The lint resolver cannot read the ?url suffix, so the import is kept here, under a paired disable.
/* eslint-disable import/no-unresolved -- Vite resolves the ?url suffix; eslint's resolver cannot read it */
import cvPdfUrl from './Ardial-CV.pdf?url';
/* eslint-enable import/no-unresolved */

export { cvPdfUrl };
