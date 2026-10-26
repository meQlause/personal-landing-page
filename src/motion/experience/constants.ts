// Every number of the Experience section's motion, named. Ported from the mockup's 04-experience/script.js; values are unchanged.

export const EXPERIENCE = {
  // Each stop plays over the first 75% of its share of the pin; the ruler slides over the last 22%.
  play: 0.75,
  slide: 0.22,
  peach: '#ffceb0',
  paper: 'experience',
  cobalt: '#353bc8',
  smooth: { a: 3, b: 2 },
  odometer: { base: 10, units: { thousands: 1000, hundreds: 100, tens: 10, ones: 1 } },
  ticker: { speed: 60, decimals: 2 },
  pin: { heightDesktop: 6.5, heightMobile: 5.5, refresh: -2 },
  pick: { debounce: 1600, lead: -0.02 },
  pickKeys: { home: 0 },
  count: { mentorTarget: 200, mentorPlus: 199, mentorDuration: 1.5 },
  tekno: { full: 420, percent: 100, first: 0.2, step: 0.3, bar: 0.7 },
  shift: {
    arcAt: 0,
    arcEnd: 0.5,
    arcDuration: 0.8,
    arcAfterEnd: 0.7,
    arcAfterDuration: 0.45,
    now: { from: 340, to: 556, duration: 1.2 },
  },
  cards: { first: 1.6, second: 1.7, third: 1.9, fourth: 2.2 },
  gate: { hidden: 0.15, rotation: -90, origin: '260 178', duration: 0.3 },
  token: { from: 30, to: 236, end: 300, duration: 0.4, endDuration: 0.3 },
  bar: { width: 158, duration: 0.65 },
  status: { cobalt: '#353bc8' },
  voting: { fade: 0.08, passed: 0.1 },
  polaris: {
    lift: 14,
    first: 195,
    second: 320,
    third: 445,
    fourth: 570,
    tokenDuration: 0.16,
    testFill: 0.1,
    shield: 0.3,
    okDuration: 0.2,
  },
  ivet: { window: 0.35, rows: 0.3, pipe: 0.5, runner: { from: 430, to: 582, duration: 0.6 } },
  mark: { draw: 0.5, hold: 0.35, clipLeft: '-50%', clipRight: '-50%' },
  card: { x: 24, duration: 0.3 },
} as const;

export const LAYOUT = {
  stageHalf: 2,
  decimals: 1,
  strip: 0.001,
};
