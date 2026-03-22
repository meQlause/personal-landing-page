import type { Certification } from '../../types'

interface CertModalProps {
  cert: Certification
  onClose: () => void
}

export default function CertModal({ cert, onClose }: CertModalProps) {
  return (
    <div
      id="certModal"
      className="cert-modal open"
      role="dialog"
      aria-modal="true"
      aria-labelledby="certModalTitle"
    >
      <div className="cert-modal-backdrop" onClick={onClose} />
      <div className="cert-modal-panel">
        <button
          className="modal-close cert-modal-close"
          onClick={onClose}
          aria-label="Close certificate"
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

        <div className="cert-doc" style={{ '--cert-color': cert.color } as React.CSSProperties}>
          <div className="cert-doc-topbar">
            <span className="cert-doc-issued-label">CERTIFICATE OF ACHIEVEMENT</span>
          </div>

          <div className="cert-doc-header">
            <div className="cert-doc-icon-wrap" style={{ borderColor: cert.color }}>
              <img
                src={cert.icon}
                alt={cert.issuer}
                className="cert-doc-icon-img"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
            <div className="cert-doc-issuer-wrap">
              <span className="cert-doc-issued-by">Issued by</span>
              <span className="cert-doc-issuer">{cert.issuer}</span>
            </div>
          </div>

          {cert.certificationImage && (
            <div className="cert-image-preview">
              <img
                src={cert.certificationImage}
                alt={`${cert.title} full certificate`}
                className="cert-full-image"
              />
            </div>
          )}

          <div className="cert-doc-skills-section">
            <span className="cert-doc-skills-label">SKILLS &amp; DOMAINS COVERED</span>
            <div className="cert-doc-skills">
              {cert.skills.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>
          </div>

          <div className="cert-doc-footer">
            <div className="cert-doc-sig">
              <span className="cert-doc-sig-line" />
              <span className="cert-doc-sig-name">Ardial</span>
              <span className="cert-doc-sig-role">Certificate Holder</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
