import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createMotionGate, MotionGateContext, WakeContext } from '../../motion/gate';
import { mountSeams } from '../../motion/seams/seams';

interface JourneyTemplateProps {
  // The opening section: its motion starts at load.
  lead: ReactNode;
  // The sections after it, in page order: their motion waits for the visitor (see motion/gate.ts).
  children: ReactNode;
}

// The whole journey: the sections in page order inside one <main>, joined by the seams once every section has built its
// pins. A child's effects run before its parent's, so the sections have queued their starts before the gate is armed.
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
    // Awake, the sections render normally again before any of them measures its pin.
    const disarm = gate.arm(() => {
      delete root.dataset.asleep;
    });
    void gate.ready.then(() => {
      if (!cancelled) {
        teardown = mountSeams(root);
      }
    });
    return () => {
      cancelled = true;
      disarm();
      teardown();
    };
  }, [gate]);
  return (
    <main id="journey" ref={ref} data-asleep="">
      <WakeContext.Provider value={gate.whenAwake}>
        {lead}
        <MotionGateContext.Provider value={gate}>{children}</MotionGateContext.Provider>
      </WakeContext.Provider>
    </main>
  );
}
