// ── Project ──────────────────────────────────────────────────
export interface Project {
  id: number
  title: string
  short: string
  desc: string
  tag: string
  year: string
  role: string
  stack: string[]
  video: string
  github?: string
  live?: string
}

// ── Experience ───────────────────────────────────────────────
export interface Experience {
  role: string
  company: string
  period: string
  type: 'Full-time' | 'Part-time' | 'Freelance' | 'Internship' | 'G2G' | 'On-site'
  location: string
  logo: string
  color: string
  summary: string
  highlights: string[]
  stack: string[]
  impact: string[]
}

// ── Education ────────────────────────────────────────────────
export type EducationCategory = 'formal' | 'informal'

export interface Education {
  id: number
  category: EducationCategory
  institution: string
  degree: string
  period: string
  location: string
  score?: string
  description: string
  achievements: string[]
  icon: string
  color: string
}

// ── Certification ────────────────────────────────────────────
export interface Certification {
  id: number
  icon: string
  title: string
  issuer: string
  skills: string[]
  color: string
  certificationImage: string
}

// ── Skill Group ──────────────────────────────────────────────
export interface SkillGroup {
  label: string
  skills: string[]
}

// ── Modal State ──────────────────────────────────────────────
export type ModalType = 'project' | 'job' | 'cert' | 'education' | null

export interface ModalState {
  type: ModalType
  data: Project | Experience | Certification | Education | null
}
