// Every number of the Contact section's motion, named. Ported from the mockup's 06-contact/script.js; values are unchanged.

// The pin's choreography, as fractions of its scroll.
export const CONTACT = {
  type: { from: 0.02, to: 0.26 },
  words: { from: 0.26, to: 0.46 },
  select: { from: 0.46, to: 0.56 },
  loop: 0.97,
  link: 0.76,
  // The packets of the handshake: label, the share of the scroll where it travels, and its direction along the cable.
  packets: [
    { label: 'SYN', from: 0.3, to: 0.43, direction: 1 },
    { label: 'SYN-ACK', from: 0.46, to: 0.59, direction: -1 },
    { label: 'ACK', from: 0.62, to: 0.74, direction: 1 },
  ],
  ports: { first: 0.79, second: 0.82, third: 0.85, fourth: 0.88 },
  pin: { height: 1.6, refresh: -4 },
  wordsPeriod: 1.8,
  loopDuration: 0.6,
  swipeClear: 112,
  sweep: { ease: 'power2.out' },
  selectionEase: 2,
  packet: { offsetX: 38, offsetY: 12 },
  cable: { dropMin: 60, sag: 0.7, rise: 0.75, plugLift: 4 },
  magnet: {
    limit: 70,
    reach: 0.18,
    tiltX: 6,
    tiltY: 7,
    tiltCentreY: 0.7,
    mailX: 0.12,
    mailY: 0.3,
    centre: 0.5,
    duration: 0.8,
    slowDuration: 0.5,
    tiltDuration: 1,
    perspective: 1400,
  },
  copy: { feedback: 2200 },
  fallback: 800,
  decimals: 1,
  headlineZoom: 0,
} as const;
