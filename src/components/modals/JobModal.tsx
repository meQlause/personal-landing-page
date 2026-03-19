import type { Experience } from '../../types'

interface JobModalProps {
  job: Experience
  onClose: () => void
}

export default function JobModal({ job, onClose }: JobModalProps) {
  return (
    <div id="jobModal" className="job-modal open" role="dialog" aria-modal="true" aria-labelledby="jobModalTitle">
      <div className="job-modal-backdrop" onClick={onClose} />
      <div className="job-modal-panel" style={{ '--job-color': job.color } as React.CSSProperties}>
        <button className="modal-close job-modal-close" onClick={onClose} aria-label="Close job detail">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div
          className="job-modal-header"
          style={{ '--job-color': job.color } as React.CSSProperties}
        >
          <div className="job-modal-logo">{job.logo}</div>
          <div className="job-modal-header-text">
            <div className="job-modal-type-badge">{job.type}</div>
            <h2 className="job-modal-title" id="jobModalTitle">
              {job.role}
            </h2>
            <div className="job-modal-company-row">
              <span className="job-modal-company">{job.company}</span>
              <span className="job-modal-sep" aria-hidden="true">·</span>
              <span className="job-modal-location">{job.location}</span>
            </div>
            <span className="job-modal-period">{job.period}</span>
          </div>
        </div>

        <div className="job-modal-body">
          {job.impact.length > 0 && (
            <div className="job-modal-impact">
              {job.impact.map((item) => (
                <div key={item} className="impact-metric">
                  <span className="impact-value">{item}</span>
                </div>
              ))}
            </div>
          )}

          <div className="job-modal-section">
            <span className="job-modal-section-label">Overview</span>
            <p className="job-modal-summary">{job.summary}</p>
          </div>

          <div className="job-modal-section">
            <span className="job-modal-section-label">Key Achievements</span>
            <ul className="job-modal-highlights">
              {job.highlights.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </div>

          <div className="job-modal-section">
            <span className="job-modal-section-label">Technologies Used</span>
            <div className="job-modal-stack">
              {job.stack.map((tech) => (
                <span key={tech}>{tech}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
