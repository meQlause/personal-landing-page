import { useNavbar } from '../hooks/useNavbar'

const NAV_LINKS = [
  { href: '#projects', label: 'Projects', num: '01' },
  { href: '#experience', label: 'Experience', num: '02' },
  { href: '#certifications', label: 'Certs', num: '03' },
  { href: '#education', label: 'Education', num: '04' },
  { href: '#about', label: 'About', num: '05' },
]

export default function Navbar() {
  const { scrolled, mobileOpen, toggleMobile, closeMobile } = useNavbar()

  return (
    <nav id="navbar" className={scrolled ? 'scrolled' : ''}>
      <div className="nav-inner">
        <a href="#hero" className="nav-logo">
          <span className="logo-bracket">[</span>ARD<span className="logo-accent">IAL</span>
          <span className="logo-bracket">]</span>
        </a>

        <ul className="nav-links">
          {NAV_LINKS.map(({ href, label, num }) => (
            <li key={href}>
              <a href={href} data-label={num}>
                {label}
              </a>
            </li>
          ))}
          <li>
            <a href="#contact" className="nav-cta">
              Contact
            </a>
          </li>
        </ul>

        <button
          className={`hamburger${mobileOpen ? ' open' : ''}`}
          onClick={toggleMobile}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div className={`mobile-menu${mobileOpen ? ' open' : ''}`}>
        <ul>
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <a href={href} className="mobile-link" onClick={closeMobile}>
                {label}
              </a>
            </li>
          ))}
          <li>
            <a href="#contact" className="mobile-link" onClick={closeMobile}>
              Contact
            </a>
          </li>
        </ul>
      </div>
    </nav>
  )
}
