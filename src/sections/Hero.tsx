import { useEffect, useState } from 'react'
import { HERO_STATS } from '../data/about'
import { useReveal } from '../hooks/useReveal'

export default function Hero() {
  const name = useReveal<HTMLDivElement>({ delay: 100 })
  const title = useReveal<HTMLDivElement>({ delay: 200 })
  const desc = useReveal<HTMLParagraphElement>({ delay: 300 })
  const ctas = useReveal<HTMLDivElement>({ delay: 400 })
  const stats = useReveal<HTMLDivElement>({ delay: 500 })

  const [activeIndex, setActiveIndex] = useState(0)
  const phrases = [
    'Building systems that scale.',
    'Crafting interfaces that speak.',
    'Architecting Distributed Systems.',
    'Specializing in Blockchain & Web3.',
    'Turning Complex Logic into Simple Code.',
    'Code as architecture. Design as intent.',
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % phrases.length)
    }, 1500)
    return () => clearInterval(interval)
  }, [phrases.length])

  return (
    <section id="hero">
      <div className="hero-grid" aria-hidden="true" />

      <div className="hero-inner">
        <div ref={name.ref} className={`hero-name-wrap reveal-up${name.inView ? ' in-view' : ''}`}>
          <h1 className="hero-name">
            <span className="glitch" data-text="ARDIAL">
              ARDIAL
            </span>
          </h1>
        </div>

        <div
          ref={title.ref}
          className={`hero-title-wrap reveal-up${title.inView ? ' in-view' : ''}`}
        >
          <div className="hero-title">
            <span className="title-prefix">▸</span>
            <span className="typing-text">Software &amp; Fullstack Engineer</span>
          </div>
        </div>

        <div
          ref={desc.ref}
          className={`hero-desc-container reveal-up${desc.inView ? ' in-view' : ''}`}
        >
          <div
            className="hero-desc-ticker"
            style={{ transform: `translateY(-${activeIndex * 1.4}rem)` }}
          >
            {phrases.map((phrase, i) => (
              <p key={i} className="ticker-item">
                {phrase}
              </p>
            ))}
          </div>
        </div>

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

        <div ref={stats.ref} className={`hero-stats reveal-up${stats.inView ? ' in-view' : ''}`}>
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
        <div className="mouse-wheel-wrap">
          <div className="mouse-wheel-dot" />
        </div>
        <span className="scroll-label">EXPLORE</span>
      </div>
    </section>
  )
}
