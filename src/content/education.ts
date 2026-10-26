// Education: the three schools and the twelve certificates, in the order of the mockup. Copy as in the mockup's 05-credentials/index.html.

interface EducationWord {
  readonly kind: 'word';
  readonly text: string;
}

interface EducationKey {
  readonly kind: 'key';
  readonly alternates: readonly string[];
}

export type EducationToken = EducationWord | EducationKey;

const REPEATED_ISSUER = 'Udemy · Krista King';

export interface School {
  readonly id: string;
  readonly tab: string;
  readonly period: string;
  readonly label: string;
  readonly tokens: readonly EducationToken[];
  readonly degree?: string;
  readonly inst?: string;
  readonly stamps?: readonly string[];
}

export interface Certificate {
  readonly index: number;
  readonly tilt: number;
  readonly label: string;
  readonly title: string;
  readonly issuer: string;
  readonly group: string;
  readonly skills: readonly string[];
  readonly image: string;
}

export interface Filter {
  readonly group: string;
  readonly label: string;
  readonly count: number;
}

export const SCHOOLS: readonly School[] = [
  {
    id: 'smk',
    tab: 'Bakti Ilham',
    period: '2015 — 2018',
    label: 'Where the networks began.',
    tokens: [
      { kind: 'word', text: 'Where' },
      { kind: 'word', text: 'the' },
      { kind: 'key', alternates: ['networks', 'routers', 'teaching'] },
      { kind: 'word', text: 'began.' },
    ],
    degree: 'Computer Networking',
    inst: 'SMK Bakti Ilham · Bandung',
    stamps: [
      'Ujikom 98/100',
      '5th · West Java MikroTik Olympiad',
      'Student Council Leader',
      'Taught MikroTik MTCNA',
    ],
  },
  {
    id: 'rise',
    tab: 'Harisenin',
    period: '2025',
    label: 'Perfect score.',
    tokens: [
      { kind: 'word', text: 'Perfect' },
      { kind: 'key', alternates: ['score', 'record', 'finish'] },
      { kind: 'word', text: '.' },
    ],
    degree: 'Full-Stack Developer Bootcamp',
    inst: 'Harisenin.com · Remote',
    stamps: ['Perfect technical score', 'Fastest graduation in the cohort', 'Promoted to mentor'],
  },
  {
    id: 'ut',
    tab: 'Mathematics',
    period: '2026',
    label: 'Always learning.',
    tokens: [
      { kind: 'word', text: 'Always' },
      { kind: 'key', alternates: ['learning', 'building', 'proving'] },
      { kind: 'word', text: '.' },
    ],
    degree: 'Bachelor of Mathematics',
    inst: 'Universitas Terbuka · Remote',
    stamps: [
      'Cryptography & computation',
      'Linear & discrete mathematics',
      'Maths behind the systems',
    ],
  },
];

export const CERTIFICATE_TAB = {
  id: 'certs',
  tab: 'Certificates',
  period: 'Certificates',
  label: 'Twelve certificates.',
};
export const CERTIFICATE_TOKENS: readonly EducationToken[] = [
  { kind: 'key', alternates: ['Twelve'] },
  { kind: 'word', text: 'certificates.' },
];

export const FILTERS: readonly Filter[] = [
  { group: '', label: 'All', count: 12 },
  { group: 'Security', label: 'Security', count: 2 },
  { group: 'Building', label: 'Building', count: 3 },
  { group: 'Blockchain', label: 'Blockchain', count: 1 },
  { group: 'Networks', label: 'Networks', count: 1 },
  { group: 'Mathematics', label: 'Mathematics', count: 4 },
  { group: 'Algorithms', label: 'Algorithms', count: 1 },
];

// The image of each certificate is imported from assets/images, under the same file name.
export const CERTIFICATES: readonly Certificate[] = [
  {
    index: 0,
    tilt: -2.4,
    label: 'Open certificate: Ethical Hacking and Penetration Testing (EHPT+), Udemy · Ocsaly',
    title: 'Ethical Hacking and Penetration Testing (EHPT+)',
    issuer: 'Udemy · Ocsaly',
    group: 'Security',
    skills: [
      'Penetration testing',
      'Reconnaissance',
      'Exploitation',
      'Nmap',
      'Metasploit',
      'OWASP',
    ],
    image: 'ethicalhacking.webp',
  },
  {
    index: 1,
    tilt: 1.6,
    label:
      'Open certificate: Red Teaming: Exploit Development with Assembly and C (MSAC+), Udemy · Ocsaly',
    title: 'Red Teaming: Exploit Development with Assembly and C (MSAC+)',
    issuer: 'Udemy · Ocsaly',
    group: 'Security',
    skills: ['Assembly', 'C', 'Shellcode', 'Buffer overflow', 'Reverse engineering'],
    image: 'redteaming.webp',
  },
  {
    index: 2,
    tilt: -1.1,
    label: 'Open certificate: Full-Stack Developer Bootcamp, Harisenin.com',
    title: 'Full-Stack Developer Bootcamp',
    issuer: 'Harisenin.com',
    group: 'Building',
    skills: ['React', 'TypeScript', 'Node.js', 'NestJS', 'PostgreSQL', 'Docker'],
    image: 'FSD.webp',
  },
  {
    index: 3,
    tilt: 2.2,
    label: 'Open certificate: C# .NET with MS SQL, Udemy · Dominic Tripodi',
    title: 'C# .NET with MS SQL',
    issuer: 'Udemy · Dominic Tripodi',
    group: 'Building',
    skills: ['C#', '.NET', 'MS SQL', 'Entity Framework', 'LINQ'],
    image: 'Csharp.webp',
  },
  {
    index: 4,
    tilt: 1.3,
    label:
      'Open certificate: Build Responsive Real-World Websites with HTML and CSS, Udemy · Jonas Schmedtmann',
    title: 'Build Responsive Real-World Websites with HTML and CSS',
    issuer: 'Udemy · Jonas Schmedtmann',
    group: 'Building',
    skills: ['HTML5', 'CSS3', 'Flexbox', 'Grid', 'Responsive design'],
    image: 'htmlcss.webp',
  },
  {
    index: 5,
    tilt: -2.0,
    label: 'Open certificate: Scrypto 101: Radix Smart Contracts, Radix',
    title: 'Scrypto 101: Radix Smart Contracts',
    issuer: 'Radix',
    group: 'Blockchain',
    skills: ['Scrypto', 'Rust', 'Radix Engine', 'Blueprints', 'DeFi'],
    image: 'scrypto101.webp',
  },
  {
    index: 6,
    tilt: 2.6,
    label: 'Open certificate: MikroTik MTCNA: Network Associate, MikroTik · SMK Bakti Ilham',
    title: 'MikroTik MTCNA: Network Associate',
    issuer: 'MikroTik · SMK Bakti Ilham',
    group: 'Networks',
    skills: ['RouterOS', 'DHCP', 'Firewall', 'Routing', 'PPPoE'],
    image: 'mikrotik.webp',
  },
  {
    index: 7,
    tilt: -1.5,
    label: 'Open certificate: Become an Algebra Master, Udemy · Krista King',
    title: 'Become an Algebra Master',
    issuer: REPEATED_ISSUER,
    group: 'Mathematics',
    skills: ['Algebra', 'Functions', 'Polynomials', 'Complex numbers'],
    image: 'algebra.webp',
  },
  {
    index: 8,
    tilt: 1.0,
    label: 'Open certificate: Become a Linear Algebra Master, Udemy · Krista King',
    title: 'Become a Linear Algebra Master',
    issuer: REPEATED_ISSUER,
    group: 'Mathematics',
    skills: ['Matrices', 'Vectors', 'Eigenvalues', 'Vector spaces'],
    image: 'linearalgebra.webp',
  },
  {
    index: 9,
    tilt: -2.6,
    label: 'Open certificate: Become a Geometry Master, Udemy · Krista King',
    title: 'Become a Geometry Master',
    issuer: REPEATED_ISSUER,
    group: 'Mathematics',
    skills: ['Geometry', 'Trigonometry', 'Proofs'],
    image: 'geometry.webp',
  },
  {
    index: 10,
    tilt: 1.9,
    label: 'Open certificate: Master the Fundamentals of Math, Udemy · Krista King',
    title: 'Master the Fundamentals of Math',
    issuer: REPEATED_ISSUER,
    group: 'Mathematics',
    skills: ['Arithmetic', 'Logic', 'Number theory'],
    image: 'mathfundamental.webp',
  },
  {
    index: 11,
    tilt: -0.8,
    label: 'Open certificate: Problem Solving (Basic), HackerRank',
    title: 'Problem Solving (Basic)',
    issuer: 'HackerRank',
    group: 'Algorithms',
    skills: ['Algorithms', 'Data structures', 'Python'],
    image: 'problemsolving.webp',
  },
];
