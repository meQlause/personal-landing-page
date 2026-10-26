import type { CSSProperties } from 'react';
import type { Certificate } from '../../content/education';

interface CertificateCardProps {
  certificate: Certificate;
  src: string;
}

// One certificate on the board. Its data attributes carry the copy that the motion describes and the dialog shows.
export function CertificateCard({ certificate, src }: CertificateCardProps) {
  return (
    <button
      className="c-card"
      type="button"
      style={{ '--i': certificate.index, '--tilt': `${certificate.tilt}deg` } as CSSProperties}
      aria-label={certificate.label}
      data-title={certificate.title}
      data-issuer={certificate.issuer}
      data-group={certificate.group}
      data-skills={certificate.skills.join('|')}
    >
      <span className="c-face">
        <img src={src} alt="" loading="lazy" decoding="async" />
      </span>
    </button>
  );
}
