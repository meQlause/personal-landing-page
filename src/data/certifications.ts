import type { Certification } from '../types'

// Icons
import baktiilhamIcon from '../assets/credentials/baktiilham.webp'
import hackerrankIcon from '../assets/credentials/hackerrank.webp'
import hariseninIcon from '../assets/credentials/harisenin.webp'
import radixIcon from '../assets/credentials/radix.webp'
import udemyIcon from '../assets/credentials/udemy.webp'

// Certificates
import certFSD from '../assets/credentials/certificates/FSD.webp'
import certAlgebra from '../assets/credentials/certificates/algebra.webp'
import certCSharp from '../assets/credentials/certificates/csharp.webp'
import certEthicalHacking from '../assets/credentials/certificates/ethicalhacking.webp'
import certGeometry from '../assets/credentials/certificates/geometry.webp'
import certHTMLCSS from '../assets/credentials/certificates/htmlcss.webp'
import certLinearAlgebra from '../assets/credentials/certificates/linearalgebra.webp'
import certMathFundamental from '../assets/credentials/certificates/mathfundamental.webp'
import certMikrotik from '../assets/credentials/certificates/mikrotik.webp'
import certProblemSolving from '../assets/credentials/certificates/problemsolving.webp'
import certRedTeaming from '../assets/credentials/certificates/redteaming.webp'
import certScrypto from '../assets/credentials/certificates/scrypto101.webp'

export const CERTIFICATIONS: Certification[] = [
  {
    id: 0,
    icon: udemyIcon,
    title: 'Ethical Hacking and Penetration Testing (EHPT+)',
    issuer: 'Udemy — Ocsaly',
    skills: [
      'Penetration Testing',
      'Reconnaissance',
      'Exploitation',
      'Nmap',
      'Metasploit',
      'OWASP',
      'Reporting',
      'Red Teaming',
    ],
    color: '#ff4d00',
    certificationImage: certEthicalHacking,
  },
  {
    id: 1,
    icon: udemyIcon,
    title: 'Red Teaming — Exploit Development with Assembly and C (MSAC+)',
    issuer: 'Udemy — Ocsaly',
    skills: [
      'Assembly',
      'C',
      'Shellcode',
      'Buffer Overflow',
      'Memory Exploitation',
      'Reverse Engineering',
      'Exploit Dev',
    ],
    color: '#b8ff57',
    certificationImage: certRedTeaming,
  },
  {
    id: 2,
    icon: hariseninIcon,
    title: 'Full-Stack Developer Bootcamp',
    issuer: 'Harisenin.com',
    skills: [
      'React',
      'TypeScript',
      'Node.js',
      'NestJS',
      'PostgreSQL',
      'REST APIs',
      'Docker',
      'Git',
    ],
    color: '#00d4ff',
    certificationImage: certFSD,
  },
  {
    id: 3,
    icon: radixIcon,
    title: 'Scrypto 101 — Radix Smart Contracts',
    issuer: 'Radix DLT',
    skills: [
      'Scrypto',
      'Rust',
      'Radix Engine',
      'Blueprints',
      'DeFi',
      'Smart Contracts',
      'Asset-Oriented Programming',
    ],
    color: '#ff4d00',
    certificationImage: certScrypto,
  },
  {
    id: 4,
    icon: udemyIcon,
    title: 'C# .NET with MS SQL — Complete Beginner to Master 2025',
    issuer: 'Udemy — Dominic Tripodi',
    skills: [
      'C#',
      '.NET',
      'MS SQL',
      'Entity Framework',
      'LINQ',
      'ASP.NET',
      'OOP',
      'Database Design',
    ],
    color: '#9b59b6',
    certificationImage: certCSharp,
  },
  {
    id: 5,
    icon: udemyIcon,
    title: 'Become an Algebra Master',
    issuer: 'Udemy — Krista King',
    skills: [
      'Algebra',
      'Linear Equations',
      'Quadratic Equations',
      'Functions',
      'Polynomials',
      'Complex Numbers',
    ],
    color: '#b8ff57',
    certificationImage: certAlgebra,
  },
  {
    id: 6,
    icon: udemyIcon,
    title: 'Become a Linear Algebra Master',
    issuer: 'Udemy — Krista King',
    skills: [
      'Linear Algebra',
      'Matrices',
      'Vectors',
      'Eigenvalues',
      'Determinants',
      'Vector Spaces',
      'Transformations',
    ],
    color: '#00d4ff',
    certificationImage: certLinearAlgebra,
  },
  {
    id: 7,
    icon: baktiilhamIcon,
    title: 'MikroTik MTCNA — Network Associate',
    issuer: 'MikroTik / SMK Bakti Ilham',
    skills: [
      'MikroTik',
      'RouterOS',
      'DHCP',
      'Firewall',
      'Routing',
      'Wireless',
      'PPPoE',
      'Bandwidth Management',
    ],
    color: '#f39c12',
    certificationImage: certMikrotik,
  },
  {
    id: 8,
    icon: hackerrankIcon,
    title: 'Problem Solving (Basic)',
    issuer: 'HackerRank',
    skills: [
      'Algorithms',
      'Data Structures',
      'Problem Solving',
      'Python',
      'Competitive Programming',
    ],
    color: '#b8ff57',
    certificationImage: certProblemSolving,
  },
  {
    id: 9,
    icon: udemyIcon,
    title: 'Geometry Masterclass',
    issuer: 'Udemy — Krista King',
    skills: ['Geometry', 'Trigonometry', 'Spatial Reasoning', 'Proofs', 'Transformations'],
    color: '#9b59b6',
    certificationImage: certGeometry,
  },
  {
    id: 10,
    icon: hariseninIcon,
    title: 'Advanced HTML5 & CSS3',
    issuer: 'Harisenin.com',
    skills: ['HTML5', 'CSS3', 'Flexbox', 'Grid', 'SASS', 'Responsive Design', 'Web Accessibility'],
    color: '#00d4ff',
    certificationImage: certHTMLCSS,
  },
  {
    id: 11,
    icon: udemyIcon,
    title: 'Fundamentals of Mathematics',
    issuer: 'Udemy — Krista King',
    skills: ['Arithmetic', 'Logic', 'Problem Solving', 'Number Theory'],
    color: '#b8ff57',
    certificationImage: certMathFundamental,
  },
]
