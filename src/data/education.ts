import type { Education } from '../types'

// Icons
import baktiilhamIcon from '../assets/backgrounds/baktiilham.webp'
import hariseninIcon from '../assets/backgrounds/harisenin.webp'
import utIcon from '../assets/backgrounds/ut.webp'

export const EDUCATION: Education[] = [
  {
    id: 0,
    category: 'formal',
    institution: 'Open University (Universitas Terbuka)',
    degree: 'Bachelor of Mathematics',
    period: '2026 — Present',
    location: 'Remote, Indonesia',
    description:
      'Currently pursuing a Bachelor of Mathematics degree with a strong focus on computational logic, cryptography, and software development. The mathematics foundation directly reinforces work in zero-knowledge proofs, cryptographic systems, and algorithm design.',
    achievements: [
      'First-year student with a focus on applied mathematics relevant to cryptography and computation',
      'Strong interest in linear algebra, discrete mathematics, and probability theory as applied to software systems',
    ],
    icon: utIcon,
    color: '#b8ff57',
  },
  {
    id: 1,
    category: 'formal',
    institution: 'SMK Bakti Ilham',
    degree: 'Computer Networking — Vocational High School',
    period: 'Jun 2015 — Jun 2018',
    location: 'Bandung, Indonesia',
    score: '91/100',
    description:
      'Vocational high school specializing in Computer Networking. Graduated with a score of 91/100, and achieved exceptional results in the Ujikom (Uji Kompetensi) practical exam covering Network Configuration, Server Administration, and related areas.',
    achievements: [
      'Served as Student Council Leader throughout the academic year',
      'Achieved 98/100 on Ujikom (Uji Kompetensi) — covering Network Configuration, Server Administration',
      'Placed 5th in West Java at the MikroTik Olympiad for vocational high schools (SMK)',
      'Promoted to teach MikroTik MTCNA (introduction level) to fellow students',
    ],
    icon: baktiilhamIcon,
    color: '#00d4ff',
  },
  {
    id: 2,
    category: 'informal',
    institution: 'Harisenin.com',
    degree: 'Full Stack Developer Bootcamp',
    period: 'Jun 2025 — Jul 2025',
    location: 'Remote, Indonesia',
    score: '4.00',
    description:
      'Intensive full-stack developer bootcamp covering modern frontend and backend development. Completed with a perfect technical score and the fastest graduation time in the cohort, which led to being promoted as an Assistant Mentor.',
    achievements: [
      'Completed the full-stack bootcamp with a perfect technical score',
      'Graduated in the fastest time of the cohort',
      'Promoted as an Assistant Mentor — helping students complete frontend and backend missions',
    ],
    icon: hariseninIcon,
    color: '#ff4d00',
  },
]
