import { useReveal } from '../hooks/useReveal'
import { CONTACT_LINKS } from '../data/about'

export default function Contact() {
  const header = useReveal<HTMLDivElement>()
  const grid = useReveal<HTMLDivElement>({ delay: 200 })

  return (
    <section id="contact">
      <div className="section-inner">
        <div ref={header.ref} className={`section-header reveal-up${header.inView ? ' in-view' : ''}`}>
          <span className="section-tag">[ 06 / CONTACT ]</span>
          <h2 className="section-title contact-title">
            Let&apos;s Build
            <br />
            <span className="title-outline">Something.</span>
          </h2>
          <p className="section-sub">
            Open to full-time roles, contracts, and high-signal collaborations.
          </p>
        </div>

        <div ref={grid.ref} className={`contact-grid reveal-up${grid.inView ? ' in-view' : ''}`}>
          {CONTACT_LINKS.map(({ icon, label, value, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="contact-card"
            >
              <span className="contact-icon">{icon}</span>
              <span className="contact-label">{label}</span>
              <span className="contact-value">{value}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
