import { useRef } from 'react';
import { contactWire } from '../../../assets/art';
import { CONTACT } from '../../../content/contact';
import { SECTION_NAV } from '../../../content/nav';
import { mountContact } from '../../../motion/contact/mount';
import { useSectionMotion } from '../../../motion/useSectionMotion';
import { Icon } from '../../atoms/Icon';
import { InlineSvg } from '../../atoms/InlineSvg';
import { ContactHeadline } from '../../molecules/ContactHeadline';
import { CvButton } from '../../molecules/CvButton';
import { MailBar } from '../../molecules/MailBar';
import { RouterChassis } from '../../molecules/RouterChassis';
import { SectionNav } from '../SectionNav';
import './contact.css';

// Contact: a router front panel whose ports are the ways in. Scrolling plugs the visitor's cable into it.
export function ContactSection() {
  const ref = useRef<HTMLElement>(null);
  useSectionMotion(ref, mountContact, 'contact');
  return (
    <section ref={ref} className="contact" id="contact" aria-labelledby="contact-title">
      <div className="k-stage">
        <SectionNav prefix="k" name="Contact" nameTag="p" links={SECTION_NAV.contact} />
        <div className="k-main">
          <div className="k-pitch">
            <p className="k-kicker">
              <span className="k-pulse" aria-hidden="true" />
              {CONTACT.kicker}
            </p>
            <ContactHeadline />
            <p className="k-sub">
              {CONTACT.sub.before}
              <b className="k-hint">{CONTACT.sub.hint}</b>
              {CONTACT.sub.after}
            </p>
          </div>
          <div className="k-side">
            <div className="k-actions">
              <MailBar />
              <CvButton />
              <span className="k-status" role="status" />
            </div>
            <div className="k-you" aria-hidden="true">
              <span className="k-you-dot" />
              <span className="k-you-label">You</span>
            </div>
          </div>
        </div>
        <div className="k-router">
          <RouterChassis />
        </div>
        <InlineSvg markup={contactWire} />
        <footer className="k-bottom">
          <p className="k-copyright">© 2026</p>
          <p className="k-credit">
            {CONTACT.credit}
            <svg
              className="k-heart"
              viewBox="0 0 24 22"
              role="img"
              aria-label="love"
              focusable="false"
            >
              <path d={CONTACT.heartPath} />
            </svg>
            . Code with AI.
          </p>
          <a className="k-top" href="#hero">
            Back to top <Icon name="arrow-up" />
          </a>
        </footer>
      </div>
    </section>
  );
}
