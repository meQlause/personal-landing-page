import type { SkillGroup } from '../types'

export const ABOUT_BIO: string[] = [
  "I'm a software engineer with diverse experience across different domains, from networking and systems programming to blockchain and fullstack web development. As AI grows rapidly, it fuels my ability to learn even faster and be more productive.",
  'I adapt quickly to new challenges and environments, maintain an easy-going communication style that supports smooth teamwork, and create thorough documentation for every project to ensure others can clearly understand and build upon my work.',
  "Whether it's compiling Rust to WASM for zero-knowledge proof systems, architecting decentralized identity smart contracts, or building full-stack web platforms. I thrive at the intersection of low-level systems thinking and high-level product craft.",
]

export const ABOUT_TAGLINE = 'Code as architecture. Design as intent.'

export const SKILL_GROUPS: SkillGroup[] = [
  {
    label: 'Languages',
    skills: ['Rust', 'TypeScript', 'Golang', 'Solidity', 'Python', 'C#', 'JavaScript', 'PHP'],
  },
  {
    label: 'Frameworks & Runtimes',
    skills: ['React', 'Next.js', 'NestJS', 'Node.js', 'Laravel', 'Scrypto'],
  },
  {
    label: 'Blockchain & Web3',
    skills: ['ERC-4337', 'ERC-735/734', 'ZK Circuits', 'WASM', 'Radix', 'Ethereum', 'ECIES'],
  },
  {
    label: 'Infrastructure & DevOps',
    skills: ['Docker', 'Kubernetes', 'AWS', 'Azure DevOps', 'CI/CD', 'Linux', 'Git'],
  },
  {
    label: 'Databases',
    skills: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis'],
  },
]

export const HERO_STATS = [
  { number: '2+', label: 'Years Exp.' },
  { number: '5+', label: 'Projects' },
  { number: '8+', label: 'Certs' },
]

export const CONTACT_LINKS = [
  {
    icon: '✉',
    label: 'Email',
    value: 'contact@ardial.my.id',
    href: 'mailto:contact@ardial.my.id',
  },
  {
    icon: 'in',
    label: 'LinkedIn',
    value: '/in/ardial',
    href: 'https://linkedin.com/in/ardial/',
  },
  {
    icon: '⌥',
    label: 'GitHub',
    value: '@meQlause',
    href: 'https://github.com/meQlause',
  },
  {
    icon: '↗',
    label: 'Website',
    value: 'ardial.my.id',
    href: 'https://ardial.my.id',
  },
]
