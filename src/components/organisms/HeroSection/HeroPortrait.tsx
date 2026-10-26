import { HERO } from '../../../content/hero';
import portraitImage from '../../../assets/images/ardial-portrait.jpg';
import { Icon } from '../../atoms/Icon';
import { InlineSvg } from '../../atoms/InlineSvg';
import { journeyArt } from '../../../assets/art';

// The portrait that forms from the Infrastructure plane, and the "how I build" journey that follows it.
export function HeroPortrait() {
  return (
    <div className="portrait-scene" aria-label={HERO.portrait.scene}>
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- the portrait takes arrow keys by design, as in the mockup */}
      <div className="portrait-view" tabIndex={0} role="img" aria-label={HERO.portrait.label}>
        <img className="portrait-fallback" src={portraitImage} alt={HERO.portrait.alt} />
        <canvas className="portrait-canvas" aria-hidden="true" />
      </div>
      <div className="build-journey">
        <ol className="journey-rail" aria-label={HERO.rail.label}>
          {HERO.rail.steps.map((step) => (
            <li key={step.name}>
              <b>{step.name}</b>
              <span className="visually-hidden">{`: ${step.note}`}</span>
            </li>
          ))}
        </ol>
        <InlineSvg markup={journeyArt} />
        <p className="journey-title" aria-hidden="true">
          {HERO.journeyTitles.map((title) => (
            <span key={title}>{title}</span>
          ))}
        </p>
        <a className="journey-cta" href={HERO.cta.href}>
          {HERO.cta.label} <Icon name="arrow-up-right" />
        </a>
      </div>
    </div>
  );
}
