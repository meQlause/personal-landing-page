import { useEffect } from 'react'
import { CERTIFICATIONS } from '../data/certifications'
import { useReveal } from '../hooks/useReveal'
import type { Certification } from '../types'

interface CertificationsProps {
  onOpenModal: (cert: Certification) => void
}

function CertCard({
  cert,
  index,
  onOpen,
}: {
  cert: Certification
  index: number
  onOpen: (c: Certification) => void
}) {
  const { ref, inView } = useReveal<HTMLDivElement>({ delay: index * 80 })

  return (
    <div
      ref={ref}
      className={`cert-card reveal-card${inView ? ' in-view' : ''}`}
      tabIndex={0}
      role="button"
      aria-label={`View ${cert.title} certificate`}
      onClick={() => onOpen(cert)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen(cert)
        }
      }}
    >
      <div className="cert-icon">
        <img
          src={cert.icon}
          alt={`${cert.issuer} icon`}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>
      <div className="cert-body">
        <h4 className="cert-title">{cert.title}</h4>
        <span className="cert-issuer">{cert.issuer}</span>
      </div>
      <span className="cert-view-hint">View ↗</span>
    </div>
  )
}

export default function Certifications({ onOpenModal }: CertificationsProps) {
  const header = useReveal<HTMLDivElement>()

  useEffect(() => {
    CERTIFICATIONS.forEach((cert) => {
      const img = new Image()
      img.src = cert.certificationImage
    })
  }, [])

  return (
    <section id="certifications">
      <div className="section-inner">
        <div
          ref={header.ref}
          className={`section-header reveal-up${header.inView ? ' in-view' : ''}`}
        >
          <span className="section-tag">[ 03 / CERTIFICATIONS ]</span>
          <h2 className="section-title">Credentials</h2>
          <p className="section-sub">
            Verified certifications spanning blockchain, security, mathematics, and fullstack
            development.
          </p>
        </div>

        <div className="certs-grid">
          {CERTIFICATIONS.map((cert, i) => (
            <CertCard key={cert.id} cert={cert} index={i} onOpen={onOpenModal} />
          ))}
        </div>
      </div>
    </section>
  )
}
