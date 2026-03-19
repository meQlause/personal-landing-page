import { HERO_STATS } from '../data/about'
import { useReveal } from '../hooks/useReveal'

export default function Hero() {
  // const badge = useReveal<HTMLDivElement>({ delay: 0 })
  const name = useReveal<HTMLDivElement>({ delay: 100 })
  const title = useReveal<HTMLDivElement>({ delay: 200 })
  const desc = useReveal<HTMLParagraphElement>({ delay: 300 })
  const ctas = useReveal<HTMLDivElement>({ delay: 400 })
  const stats = useReveal<HTMLDivElement>({ delay: 500 })

  return (
    <section id="hero">
      <div className="hero-grid" aria-hidden="true" />

      <div className="hero-inner">
        {/* <div ref={badge.ref} className={`status-badge reveal-up${badge.inView ? ' in-view' : ''}`}>
          <span className="status-dot" />
          <span className="status-text">Available for new opportunities</span>
        </div> */}

        <div ref={name.ref} className={`hero-name-wrap reveal-up${name.inView ? ' in-view' : ''}`}>
          <h1 className="hero-name">
            <span className="name-line glitch" data-text="ARDIAL">
              ARDIAL
            </span>
          </h1>
        </div>

        <div
          ref={title.ref}
          className={`hero-title-wrap reveal-up${title.inView ? ' in-view' : ''}`}
        >
          <p className="hero-title">
            <span className="title-prefix">▸</span>
            Software &amp; Fullstack Engineer
          </p>
        </div>

        <p ref={desc.ref} className={`hero-desc reveal-up${desc.inView ? ' in-view' : ''}`}>
          Building systems that scale.
          <br />
          Crafting interfaces that speak.
          <br />
          <span className="desc-accent">Code as architecture. Design as intent.</span>
        </p>

        <div ref={ctas.ref} className={`hero-ctas reveal-up${ctas.inView ? ' in-view' : ''}`}>
          <a href="#contact" className="btn btn-primary">
            <span>Contact Me</span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <a href="#projects" className="btn btn-ghost">
            View Projects
          </a>
        </div>

        <div
          ref={stats.ref}
          className={`hero-stats reveal-up${stats.inView ? ' in-view' : ''}`}
        >
          {HERO_STATS.map((stat, _) => (
            <span key={stat.label}>
              <div className="stat">
                <span className="stat-number">{stat.number}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
              <div className="stat-divider" aria-hidden="true" />
            </span>
          ))}
        </div>
      </div>

      <div className="scroll-indicator" aria-label="Scroll down">
        <span className="scroll-line" />
        <span className="scroll-label">SCROLL</span>
      </div>
    </section>
  )
}
