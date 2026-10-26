// Every visible string of the hero, as in the mockup's 01-hero/index.html.
export const HERO = {
  label: 'Ardial, software engineer',
  brandLabel: 'Ardial, back to beginning',
  role: 'Software engineer',
  prism: { label: 'Animate the layered prism', title: 'Unfold' },
  title: { label: 'Simple on purpose.', first: 'Simple', reveal: ['on', 'purpose.'] },
  closingTitle: ['Built', 'in depth.'],
  portrait: {
    scene: 'Meet Ardial',
    label:
      'Particle portrait of Ardial. Drag to rotate; arrow keys rotate, plus and minus rotate the roll axis, Enter disperses, Escape resets.',
    alt: 'Ardial',
  },
  rail: {
    label: 'How I build',
    steps: [
      { name: 'Network', note: 'Wire the network.' },
      { name: 'Design', note: 'Shape the interface.' },
      { name: 'Develop', note: 'Build the logic.' },
      { name: 'AI', note: 'Give it a mind.' },
      { name: 'Blockchain', note: 'Anchor it on-chain.' },
      { name: 'Ship', note: 'Ship it.' },
    ],
  },
  journeyTitles: [
    'Wire the network.',
    'Shape the interface.',
    'Build the logic.',
    'Give it a mind.',
    'Anchor it on-chain.',
    'Ship it.',
  ],
  cta: { label: 'Let’s build something', href: 'mailto:contact@ardial.my.id' },
  explore: { label: 'Explore', back: 'Back', open: '+', close: '−' },
  work: { label: 'Explore my work', href: 'https://github.com/meQlause' },
  motion: { pause: 'Pause motion', enable: 'Enable motion' },
} as const;
