import { HERO } from '../../../content/hero';
import { InlineSvg } from '../../atoms/InlineSvg';
import { closingFolds, headlineFolds } from '../../../assets/art';

// The two headlines and the folds that open and close them.
export function HeroTitles() {
  return (
    <>
      <InlineSvg markup={headlineFolds} />
      <h1 className="hero-title" aria-label={HERO.title.label}>
        <span className="title-line" aria-hidden="true">
          <span className="title-word">{HERO.title.first}</span>
        </span>
        <span className="title-line" aria-hidden="true">
          <span className="title-word">
            <span className="reveal-word">{HERO.title.reveal[0]}</span>{' '}
            <span className="reveal-word">{HERO.title.reveal[1]}</span>
          </span>
        </span>
      </h1>
      <h2 className="closing-title">
        <span className="depth-line">{HERO.closingTitle[0]}</span>
        <span className="depth-line">{HERO.closingTitle[1]}</span>
      </h2>
      <InlineSvg markup={closingFolds} />
    </>
  );
}
