// The seven stops of Experience, in the order of the ruler. Copy as in the mockup's 04-experience/index.html.
export interface ExperienceToken {
  readonly kind: 'word' | 'mark';
  readonly text?: string;
  readonly markClass?: string;
  readonly words?: readonly string[];
}

export interface ExperienceStop {
  readonly id: string;
  readonly year: number;
  readonly years: string;
  readonly name: string;
  readonly period: string;
  readonly label: string;
  readonly headline: readonly ExperienceToken[];
  readonly role: string;
  readonly org: string;
  readonly chips: readonly string[];
  readonly tickers: readonly string[];
}

export const STOPS: readonly ExperienceStop[] = [
  {
    id: 'networks',
    year: 2017,
    years: '2017–19',
    name: 'Networks',
    period: '2017 — 2019',
    label: 'Networks first.',
    role: 'IT Support → Network Engineer',
    org: 'Universitas Padjadjaran · Indosat · Java Digital Nusantara',
    chips: ['50+ enterprise clients', '3 telecom towers', '100% issues resolved'],
    tickers: [
      'MikroTik',
      'PPPoE',
      'Firewall policies',
      'DHCP',
      'DNS',
      'Subnetting',
      'Antenna alignment',
      'OSI layers 1–4',
    ],
    headline: [
      { kind: 'word', text: 'Networks' },
      { kind: 'mark', markClass: 'mark-sweep', words: ['first.'] },
    ],
  },
  {
    id: 'korea',
    year: 2020,
    years: '2020–25',
    name: 'South Korea',
    period: '2020 — 2025',
    label: 'Twelve-hour shifts. Still building.',
    role: 'Machine Operator',
    org: '(Ju) Boyoung · South Korea',
    chips: ['12 h × 6 days a week', 'Courses: Udemy, Coursera, Radix', 'Freelance on Radix'],
    tickers: [
      'Udemy',
      'Coursera',
      'HTML & CSS',
      'Linear algebra',
      'Scrypto',
      'Radix',
      'Freelance blockchain',
      'Game governance',
    ],
    headline: [
      { kind: 'word', text: 'Twelve-hour' },
      { kind: 'word', text: 'shifts.' },
      { kind: 'mark', markClass: 'mark-marker', words: ['Still', 'building.'] },
    ],
  },
  {
    id: 'arcane',
    year: 2023,
    years: '2023–24',
    name: 'ArcaneLabyrinth',
    period: '2023 — 2024',
    label: 'Players set the rules.',
    role: 'Fullstack Blockchain Engineer',
    org: 'PT. Gilang Maju Jaya · ArcaneLabyrinth',
    chips: ['Game governance on Radix', '100% of the backend', '$5,000 Radix grant'],
    tickers: ['Game governance', 'Proposals', 'Voting', 'Scrypto', 'Radix', 'NestJS', 'Next.js'],
    headline: [
      { kind: 'word', text: 'Players' },
      { kind: 'word', text: 'set' },
      { kind: 'mark', markClass: 'mark-ring', words: ['the', 'rules.'] },
    ],
  },
  {
    id: 'mentor',
    year: 2025,
    years: '2025–now',
    name: 'Mentoring',
    period: '2025 — now',
    label: '200+ students.',
    role: 'Fullstack Developer Mentor Assistant',
    org: 'PT. Karya Kaya Bahagia',
    chips: ['8 months', '10–20 active each week', 'Curriculum review'],
    tickers: [
      'HTML & CSS',
      'Node.js',
      'Express',
      'REST APIs',
      'ERD modelling',
      'Layered architecture',
      'Code review',
    ],
    headline: [
      { kind: 'mark', markClass: 'mark-marker', words: ['200+'] },
      { kind: 'word', text: 'students.' },
    ],
  },
  {
    id: 'tekno',
    year: 2025,
    years: '2025–26',
    name: 'Tekno Agri Karya',
    period: '2025 — 2026',
    label: 'Faster, smaller, cheaper.',
    role: 'Full-Stack & Blockchain Engineer',
    org: 'PT. Tekno Agri Karya',
    chips: ['−50% client processing', '−90% storage', '−80% compute'],
    tickers: [
      'Go',
      'TypeScript',
      'Rust',
      'WebAssembly',
      'ECIES',
      'Decentralized identity',
      'ERC-4337',
    ],
    headline: [
      { kind: 'word', text: 'Faster,' },
      { kind: 'word', text: 'smaller,' },
      { kind: 'mark', markClass: 'mark-bracket', words: ['cheaper.'] },
    ],
  },
  {
    id: 'polaris',
    year: 2026,
    years: '2026–now',
    name: 'Polaris Web',
    period: '2026 — now',
    label: 'I defined how we build.',
    role: 'Software Developer',
    org: 'PT. Polaris Web',
    chips: ['Defined the pipeline', 'Followed by the entire division', 'Spec · TDD · AI'],
    tickers: [
      'Spec-driven development',
      'TDD',
      'AI pipelines',
      'Automated deployment',
      'Security checks',
      'Payment orchestration',
      'Identity provider',
      'CRM',
    ],
    headline: [
      { kind: 'word', text: 'I' },
      { kind: 'word', text: 'defined' },
      { kind: 'mark', markClass: 'mark-sweep', words: ['how', 'we', 'build.'] },
    ],
  },
  {
    id: 'ivet',
    year: 2026,
    years: '2026–now',
    name: 'IVET',
    period: '2026 — now',
    label: 'A campus, rebuilt.',
    role: 'Full-stack Engineer · part-time',
    org: 'Universitas IVET Semarang',
    chips: ['Siveta, end to end', 'KRS & LMS', 'CI/CD'],
    tickers: ['KRS', 'LMS', 'Database design', 'System architecture', 'UI/UX', 'CI/CD'],
    headline: [
      { kind: 'word', text: 'A' },
      { kind: 'word', text: 'campus,' },
      { kind: 'mark', markClass: 'mark-bracket', words: ['rebuilt.'] },
    ],
  },
];
