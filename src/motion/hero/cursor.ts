import { CURSOR } from './constants';
import type { HeroRuntime } from './runtime';

// The hero's own cursor: a dot that follows the pointer and a ring that trails it. Returns true while the ring is still moving.
export function drawCursor(runtime: HeroRuntime, follow: number): boolean {
  const { pointer, ring, cursor } = runtime;
  if (!pointer.inside) {
    return false;
  }
  ring.x += (pointer.x - ring.x) * follow;
  ring.y += (pointer.y - ring.y) * follow;
  cursor.style.transform = `translate3d(${pointer.x}px,${pointer.y}px,0)`;
  cursor.style.setProperty('--ring-x', `${ring.x - pointer.x}px`);
  cursor.style.setProperty('--ring-y', `${ring.y - pointer.y}px`);
  return Math.abs(ring.x - pointer.x) + Math.abs(ring.y - pointer.y) > CURSOR.settle;
}
