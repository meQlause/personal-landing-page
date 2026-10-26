import { useContext, useEffect, type RefObject } from 'react';
import { registerDebug } from './debug';
import { MotionGateContext } from './gate';
import type { MountSection, SectionApi } from './types';

// Mounts a section's motion on its root and destroys it on unmount. Inside the journey's gate the mount waits its turn;
// anywhere else it runs at once. StrictMode mounts twice in development, so destroy() has to undo everything mount() did.
export function useSectionMotion(
  ref: RefObject<HTMLElement | null>,
  mount: MountSection,
  name: string,
): void {
  const gate = useContext(MotionGateContext);
  useEffect(() => {
    const root = ref.current;
    if (!root) {
      return undefined;
    }
    let api: SectionApi | null = null;
    const start = (): void => {
      api = mount(root);
      registerDebug(name, api);
    };
    let cancel = (): void => undefined;
    if (gate) {
      cancel = gate.queue(start);
    } else {
      start();
    }
    return () => {
      cancel();
      api?.destroy();
    };
  }, [ref, mount, name, gate]);
}
