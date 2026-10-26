import { useRef } from 'react';
import { educationArt } from '../../../assets/art';
import { CERTIFICATES, SCHOOLS } from '../../../content/education';
import { SECTION_NAV } from '../../../content/nav';
import { CERTIFICATE_IMAGES, SCHOOL_BACKGROUNDS } from '../../../assets/images';
import { mountEducation } from '../../../motion/education/mount';
import { useSectionMotion } from '../../../motion/useSectionMotion';
import { InlineSvg } from '../../atoms/InlineSvg';
import { CertificateCard } from '../../molecules/CertificateCard';
import { CertificatesPanel } from '../../molecules/CertificatesPanel';
import { SchoolPanel } from '../../molecules/SchoolPanel';
import { SectionNav } from '../SectionNav';
import './education.css';

// The art refers to each school's background by its place in the mockup; the built file is the imported image.
const ART_REFERENCE = 'assets/';

function artWithBackgrounds(): string {
  return Object.entries(SCHOOL_BACKGROUNDS).reduce(
    (markup, [name, url]) => markup.replace(`${ART_REFERENCE}${name}`, url),
    educationArt,
  );
}

// Education: three schools, then twelve certificates on a board. Scrolling walks through them; the tabs jump to one.
export function EducationSection() {
  const ref = useRef<HTMLElement>(null);
  useSectionMotion(ref, mountEducation, 'education');
  const tabs = [
    ...SCHOOLS.map((school) => ({ id: school.id, label: school.tab })),
    { id: 'certs', label: 'Certificates' },
  ];
  return (
    <section ref={ref} className="credentials" id="education" aria-labelledby="cred-title">
      <div className="c-stage">
        <SectionNav
          prefix="c"
          name="Education"
          titleId="cred-title"
          nameTag="h2"
          links={SECTION_NAV.education}
        />
        <div className="c-tabs" role="tablist" aria-labelledby="cred-title">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              className="c-tab"
              role="tab"
              id={`ctab-${tab.id}`}
              aria-controls={`cpanel-${tab.id}`}
              aria-selected={index === 0}
              tabIndex={index === 0 ? undefined : -1}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {SCHOOLS.map((school, index) => (
          <SchoolPanel key={school.id} school={school} active={index === 0} />
        ))}
        <CertificatesPanel active={false} />
        <InlineSvg markup={artWithBackgrounds()} />
        <div className="c-deck" role="group" aria-label="Certificates">
          {CERTIFICATES.map((certificate) => (
            <CertificateCard
              key={certificate.index}
              certificate={certificate}
              src={CERTIFICATE_IMAGES[certificate.image]}
            />
          ))}
        </div>
        <p className="c-hint" aria-hidden="true">
          Scroll
        </p>
        <dialog className="c-dialog" aria-labelledby="c-dialog-title">
          <form method="dialog">
            <button className="c-close" aria-label="Close certificate">
              ×
            </button>
          </form>
          <img className="c-dialog-img" alt="" />
          <div className="c-dialog-meta">
            <h4 id="c-dialog-title">{CERTIFICATES[0].title}</h4>
            <p className="c-dialog-issuer" />
            <ul className="c-dialog-skills" />
          </div>
        </dialog>
      </div>
    </section>
  );
}
