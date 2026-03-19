import type { Education } from '../../types'

interface EducationModalProps {
  edu: Education
  onClose: () => void
}

export default function EducationModal({ edu, onClose }: EducationModalProps) {
  return (
    <div className="edu-modal open" role="dialog" aria-modal="true" aria-labelledby="eduModalTitle">
      <div className="edu-modal-backdrop" onClick={onClose} />
      <div className="edu-modal-panel" style={{ '--edu-color': edu.color } as React.CSSProperties}>
        <button
          className="modal-close edu-modal-close"
          onClick={onClose}
          aria-label="Close education detail"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div
          className="edu-modal-header"
          style={{ '--edu-color': edu.color } as React.CSSProperties}
        >
          <div className="edu-doc-icon-wrap" style={{ borderColor: edu.color, color: edu.color }}>
            <img src={edu.icon} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div className="edu-modal-header-text">
            <div className="edu-modal-category-badge">
              {edu.category === 'formal' ? 'Formal Education' : 'Informal Education'}
            </div>
            <h2 className="edu-modal-title" id="eduModalTitle">
              {edu.degree}
            </h2>
            <div className="edu-modal-inst-row">
              <span className="edu-modal-institution">{edu.institution}</span>
              <span className="edu-modal-sep" aria-hidden="true">
                ·
              </span>
              <span className="edu-modal-location">{edu.location}</span>
            </div>
            <span className="edu-modal-period">{edu.period}</span>
            {edu.score && (
              <span className="edu-modal-score" style={{ color: edu.color }}>
                Score: {edu.score}
              </span>
            )}
          </div>
        </div>

        <div className="edu-modal-body">
          <div className="edu-modal-section">
            <span className="edu-modal-section-label">Overview</span>
            <p className="edu-modal-desc">{edu.description}</p>
          </div>

          <div className="edu-modal-section">
            <span className="edu-modal-section-label">Achievements &amp; Highlights</span>
            <ul className="edu-modal-achievements">
              {edu.achievements.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
