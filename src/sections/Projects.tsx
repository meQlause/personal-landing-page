import { useReveal } from '../hooks/useReveal'
import { PROJECTS } from '../data/projects'
import type { Project } from '../types'

interface ProjectsProps {
  onOpenModal: (project: Project) => void
}

function ProjectCard({
  project,
  index,
  onOpen,
}: {
  project: Project
  index: number
  onOpen: (p: Project) => void
}) {
  const { ref, inView } = useReveal<HTMLElement>({ delay: index * 80 })

  return (
    <article
      ref={ref}
      className={`project-card reveal-card${inView ? ' in-view' : ''}`}
      tabIndex={0}
      role="button"
      aria-label={`View project: ${project.title}`}
      onClick={() => onOpen(project)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen(project)
        }
      }}
    >
      <div className="card-video-wrap">
        <video autoPlay muted loop playsInline className="card-video">
          <source src={project.video} type="video/mp4" />
        </video>
        <div className="card-video-overlay" />
      </div>
      <div className="card-content">
        <div className="card-meta">
          {project.tag && <span className="card-tag">{project.tag}</span>}
          {project.year && <span className="card-year">{project.year}</span>}
        </div>
        <h3 className="card-title">{project.title}</h3>
        <p className="card-desc">{project.short}</p>
        <span className="card-cta">
          View Project <span className="arrow">→</span>
        </span>
      </div>
      <div className="card-border-anim" aria-hidden="true" />
    </article>
  )
}

export default function Projects({ onOpenModal }: ProjectsProps) {
  const header = useReveal<HTMLDivElement>()

  return (
    <section id="projects">
      <div className="section-inner">
        <div ref={header.ref} className={`section-header reveal-up${header.inView ? ' in-view' : ''}`}>
          <span className="section-tag">[ 01 / PROJECTS ]</span>
          <h2 className="section-title">Selected Work</h2>
          <p className="section-sub">
            A curated set of builds — from blockchain infrastructure to production-grade web systems.
          </p>
        </div>

        <div className="projects-grid">
          {PROJECTS.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              onOpen={onOpenModal}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
