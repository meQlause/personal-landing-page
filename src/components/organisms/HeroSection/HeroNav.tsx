import { HERO } from '../../../content/hero';
import { HERO_NAV } from '../../../content/nav';
import { InlineSvg } from '../../atoms/InlineSvg';
import { NavLinks } from '../../molecules/NavLinks';
import { wordmarkSvg, prismSvg } from '../../../assets/art';

// The hero's own header. Its layered prism becomes the nav character once the motion mounts.
export function HeroNav() {
  return (
    <header className="hero-nav">
      <a className="hero-brand" href="#hero" aria-label={HERO.brandLabel}>
        <InlineSvg markup={wordmarkSvg} />
      </a>
      <span className="nav-role">{HERO.role}</span>
      <button
        className="nav-prism"
        type="button"
        aria-label={HERO.prism.label}
        title={HERO.prism.title}
      >
        <span className="nav-prism-art" aria-hidden="true">
          <InlineSvg markup={prismSvg} />
        </span>
      </button>
      <NavLinks links={HERO_NAV} />
    </header>
  );
}
