export function prefersReducedMotion(): boolean {
  return matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function isFinePointer(): boolean {
  return matchMedia('(hover:hover) and (pointer:fine)').matches;
}
