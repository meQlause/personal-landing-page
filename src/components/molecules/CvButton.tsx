import { cvPdfUrl } from '../../assets/cv';
import { CONTACT } from '../../content/contact';
import { Icon } from '../atoms/Icon';

// The CV, as a download. The PDF is built from cv/ardial-cv.html and imported, so it ships with the site.
export function CvButton() {
  return (
    <a className="k-cv" href={cvPdfUrl} download="Ardial-CV.pdf">
      <span className="k-cv-icon" aria-hidden="true">
        <Icon name="download" />
      </span>
      <span className="k-cv-text">
        Download CV
        <small>{CONTACT.cv.label}</small>
      </span>
    </a>
  );
}
