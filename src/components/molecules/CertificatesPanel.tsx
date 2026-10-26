import {
  CERTIFICATE_TAB,
  CERTIFICATE_TOKENS,
  CERTIFICATES,
  FILTERS,
} from '../../content/education';
import { HeadlineLine } from './HeadlineLine';

interface CertificatesPanelProps {
  active: boolean;
}

// The certificates' panel: its headline, the subject filters, and the card that describes the picked certificate.
export function CertificatesPanel({ active }: CertificatesPanelProps) {
  const first = CERTIFICATES[0];
  return (
    <div
      className="c-panel is-cert"
      role="tabpanel"
      id={`cpanel-${CERTIFICATE_TAB.id}`}
      aria-labelledby={`ctab-${CERTIFICATE_TAB.id}`}
      hidden={!active}
    >
      <p className="c-period">{CERTIFICATE_TAB.period}</p>
      <h3 className="c-headline" aria-label={CERTIFICATE_TAB.label}>
        <HeadlineLine tokens={CERTIFICATE_TOKENS} />
      </h3>
      <div className="c-filters" role="group" aria-label="Show certificates by subject">
        {FILTERS.map((filter, index) => (
          <button
            key={filter.group}
            className="c-filter"
            type="button"
            aria-pressed={index === 0}
            data-group={filter.group}
          >
            {filter.label} <span>{filter.count}</span>
          </button>
        ))}
      </div>
      <div className="c-front">
        <p className="c-front-title">{first.title}</p>
        <p className="c-front-issuer">{first.issuer}</p>
        <div className="c-front-row">
          <button className="c-open" type="button">
            Open certificate
          </button>
          <p className="c-count">
            <b>1</b> of {CERTIFICATES.length}
          </p>
        </div>
      </div>
    </div>
  );
}
