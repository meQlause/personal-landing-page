import type { Certification } from '../../types'

interface CertModalProps {
  cert: Certification
  onClose: () => void
}

export default function CertModal({ cert, onClose }: CertModalProps) {
  return (
    <div id="certModal" className="cert-modal open" role="dialog" aria-modal="true" aria-labelledby="certModalTitle">
      <div className="cert-modal-backdrop" onClick={onClose} />
      <div className="cert-modal-panel">
        <button className="modal-close cert-modal-close" onClick={onClose} aria-label="Close certificate">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="cert-doc" style={{ '--cert-color': cert.color } as React.CSSProperties}>
          <div className="cert-corner cert-corner--tl" aria-hidden="true" />
          <div className="cert-corner cert-corner--tr" aria-hidden="true" />
          <div className="cert-corner cert-corner--bl" aria-hidden="true" />
          <div className="cert-corner cert-corner--br" aria-hidden="true" />

          <div className="cert-doc-topbar">
            <span className="cert-doc-issued-label">CERTIFICATE OF ACHIEVEMENT</span>
            <span className="cert-doc-id">ID: {cert.credentialId}</span>
          </div>

          <div className="cert-doc-header">
            <div
              className="cert-doc-icon-wrap"
              style={{ borderColor: cert.color }}
            >
              <span className="cert-doc-icon">{cert.icon}</span>
            </div>
            <div className="cert-doc-issuer-wrap">
              <span className="cert-doc-issued-by">Issued by</span>
              <span className="cert-doc-issuer">{cert.issuer}</span>
            </div>
          </div>

          <div className="cert-doc-title-wrap">
            <p className="cert-doc-presented">This certifies that</p>
            <h2 className="cert-doc-name">Ardial</h2>
            <p className="cert-doc-has-completed">has successfully completed</p>
            <h3 className="cert-doc-title" id="certModalTitle">
              {cert.title}
            </h3>
          </div>

          <p className="cert-doc-desc">{cert.desc}</p>

          <div className="cert-doc-meta">
            <div className="cert-doc-meta-item">
              <span className="cert-doc-meta-label">Year Issued</span>
              <span className="cert-doc-meta-value">{cert.year}</span>
            </div>
            <div className="cert-doc-meta-divider" aria-hidden="true" />
            <div className="cert-doc-meta-item">
              <span className="cert-doc-meta-label">Valid Until</span>
              <span className="cert-doc-meta-value">{cert.expires}</span>
            </div>
            <div className="cert-doc-meta-divider" aria-hidden="true" />
            <div className="cert-doc-meta-item">
              <span className="cert-doc-meta-label">Credential ID</span>
              <span className="cert-doc-meta-value cert-doc-meta-mono">{cert.credentialId}</span>
            </div>
          </div>

          <div className="cert-doc-skills-section">
            <span className="cert-doc-skills-label">SKILLS &amp; DOMAINS COVERED</span>
            <div className="cert-doc-skills">
              {cert.skills.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>
          </div>

          <div className="cert-doc-seal" aria-hidden="true">
            <div className="seal-ring seal-ring--1" />
            <div className="seal-ring seal-ring--2" />
            <div className="seal-ring seal-ring--3" />
            <span className="seal-text">{cert.badge}</span>
          </div>

          <div className="cert-doc-footer">
            <div className="cert-doc-sig">
              <span className="cert-doc-sig-line" />
              <span className="cert-doc-sig-name">Ardial</span>
              <span className="cert-doc-sig-role">Certificate Holder</span>
            </div>
            <div className="cert-doc-verified">
              <span className="cert-verified-dot" />
              <span>Verified Achievement</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
