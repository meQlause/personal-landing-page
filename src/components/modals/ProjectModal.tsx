import type { Project } from '../../types'

interface ProjectModalProps {
  project: Project
  onClose: () => void
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  return (
    <div id="projectModal" className="modal open" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-panel">
        <button className="modal-close" onClick={onClose} aria-label="Close project detail">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="modal-video-wrap">
          <video controls loop muted playsInline className="modal-video">
            <source src={project.video} type="video/mp4" />
          </video>
        </div>

        <div className="modal-body">
          <div className="modal-top-meta">
            <span className="modal-year">{project.year}</span>
            <span className="modal-role">{project.role}</span>
          </div>
          <h2 id="modalTitle" className="modal-title">
            {project.title}
          </h2>
          <p className="modal-desc">{project.desc}</p>

          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer" className="modal-link">
              ⌥ View on GitHub →
            </a>
          )}

          <div className="modal-stack-label">Tech Stack</div>
          <div className="modal-stack">
            {project.stack.map((tech) => (
              <span key={tech}>{tech}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
