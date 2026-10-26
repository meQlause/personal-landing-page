import { useCallback, useContext, useRef } from 'react';
import { HERO } from '../../../content/hero';
import { WakeContext } from '../../../motion/gate';
import { mountHero } from '../../../motion/hero/mount';
import { useSectionMotion } from '../../../motion/useSectionMotion';
import { Icon } from '../../atoms/Icon';
import { InlineSvg } from '../../atoms/InlineSvg';
import { HeroNav } from './HeroNav';
import { HeroPortrait } from './HeroPortrait';
import { HeroTitles } from './HeroTitles';
import './hero.css';
import { infraArt, interfaceArt, logicArt } from '../../../assets/art';

// The opening section: the layered system, the portrait and the headlines, with the scroll story pinned to it.
export function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const whenAwake = useContext(WakeContext);
  const mount = useCallback((root: HTMLElement) => mountHero(root, whenAwake), [whenAwake]);
  useSectionMotion(ref, mount, 'hero');
  return (
    <section ref={ref} className="ardial-hero" id="hero" aria-label={HERO.label}>
      <div className="hero-stage">
        <div className="loading-surface" aria-hidden="true">
          <span className="loading-seam" />
        </div>
        <HeroNav />
        <div className="system-world" aria-hidden="true">
          <div className="system-tilt">
            <div className="system-plane plane-back">
              <i className="plane-anchor" />
              <i className="plane-anchor" />
              <i className="plane-anchor" />
              <i className="plane-anchor" />
              <span className="plane-label">Infrastructure</span>
              <InlineSvg markup={infraArt} />
            </div>
            <div className="system-plane plane-middle">
              <span className="plane-label">Logic</span>
              <InlineSvg markup={logicArt} />
              <div className="signal" />
            </div>
            <div className="system-plane plane-front">
              <span className="plane-label">Interface</span>
              <InlineSvg markup={interfaceArt} />
            </div>
          </div>
        </div>
        <canvas className="window-frost" aria-hidden="true" />
        <canvas className="hero-particles" aria-hidden="true" />
        <div className="hero-cursor" aria-hidden="true">
          <span className="cursor-ring" />
          <span className="cursor-core" />
        </div>
        <div className="glass-edge" aria-hidden="true" />
        <HeroTitles />
        <HeroPortrait />
        <div className="hero-actions">
          <button className="open-system" type="button" aria-expanded="false" hidden>
            <span className="button-label">{HERO.explore.label}</span>
            <span className="button-symbol" aria-hidden="true">
              {HERO.explore.open}
            </span>
          </button>
          <a className="work-link" href={HERO.work.href} target="_blank" rel="noopener noreferrer">
            {HERO.work.label} <Icon name="arrow-up-right" />
          </a>
        </div>
        <footer className="hero-bottom">
          <span className="scroll-cue">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 4v16m-6-6 6 6 6-6" />
            </svg>
          </span>
          <button
            className="motion-control"
            aria-label={HERO.motion.pause}
            title={HERO.motion.pause}
            type="button"
            hidden
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path className="motion-icon" d="M8 5v14M16 5v14" />
            </svg>
          </button>
        </footer>
        <div className="hero-progress" aria-hidden="true" />
      </div>
    </section>
  );
}
