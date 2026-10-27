import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createMotionGate, MotionGateContext } from '../../motion/gate';
import { mountSeams } from '../../motion/seams/seams';

interface JourneyTemplateProps {
  // The opening section: its motion starts at load.
  lead: ReactNode;
  // The sections after it, in page order: their motion builds behind the hero's loading surface (see motion/gate.ts).
  children: ReactNode;
}

// The whole journey: the sections in page order inside one <main>, joined by the seams once every section has built its
// pins. A child's effects run before its parent's, so the sections have queued their starts before the gate wakes.
export function JourneyTemplate({ lead, children }: JourneyTemplateProps) {
  const ref = useRef<HTMLElement>(null);
  const [gate] = useState(createMotionGate);
  useEffect(() => {
    const root = ref.current;
    if (!root) {
      return undefined;
    }
    let cancelled = false;
    let teardown = (): void => undefined;
    // The sections render normally again before any of them measures its pin.
    delete root.dataset.asleep;
    gate.wake();
    void gate.ready.then(() => {
      if (!cancelled) {
        teardown = mountSeams(root);
      }
    });
    return () => {
      cancelled = true;
      teardown();
    };
  }, [gate]);
  return (
    <main id="journey" ref={ref} data-asleep="">
      {lead}
      <MotionGateContext.Provider value={gate}>{children}</MotionGateContext.Provider>
    </main>
  );
}
