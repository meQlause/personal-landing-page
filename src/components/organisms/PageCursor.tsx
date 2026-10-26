import { useEffect } from 'react';
import { mountCursor } from '../../motion/cursor/cursor';

// Mounts the page cursor. It renders nothing itself.
export function PageCursor() {
  useEffect(() => mountCursor(), []);
  return null;
}
