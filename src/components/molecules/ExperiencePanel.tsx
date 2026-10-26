import { Fragment } from 'react';
import { experienceMarkArt } from '../../assets/art';
import type { ExperienceStop, ExperienceToken } from '../../content/experience';
import { InlineSvg } from '../atoms/InlineSvg';
import { SplitChars } from '../atoms/SplitChars';

interface ExperiencePanelProps {
  stop: ExperienceStop;
  active: boolean;
}

// The words of a marked phrase, each split into letters, with a space between them, and the mark's drawing last.
function MarkedWords({ token, stopId }: { token: ExperienceToken; stopId: string }) {
  return (
    <span className={`x-mark ${token.markClass ?? ''}`}>
      {(token.words ?? []).map((word, index) => (
        <Fragment key={index}>
          {index > 0 ? ' ' : null}
          <SplitChars text={word} />
        </Fragment>
      ))}
      <InlineSvg markup={experienceMarkArt[stopId]} />
    </span>
  );
}

// One stop's copy: its period, its headline with the marked words, its role, organisation and chips.
export function ExperiencePanel({ stop, active }: ExperiencePanelProps) {
  return (
    <div
      className="x-panel"
      role="tabpanel"
      id={`xpanel-${stop.id}`}
      aria-labelledby={`xtab-${stop.id}`}
      data-year={stop.year}
      hidden={!active}
    >
      <p className="x-period">{stop.period}</p>
      <h3 className="x-headline" aria-label={stop.label}>
        <span aria-hidden="true">
          {stop.headline.map((token, index) => (
            <Fragment key={index}>
              {index > 0 ? ' ' : null}
              {token.kind === 'word' ? (
                <SplitChars text={token.text ?? ''} />
              ) : (
                <MarkedWords token={token} stopId={stop.id} />
              )}
            </Fragment>
          ))}
        </span>
      </h3>
      <p className="x-role">{stop.role}</p>
      <p className="x-org">{stop.org}</p>
      <ul className="x-chips">
        {stop.chips.map((chip) => (
          <li key={chip}>{chip}</li>
        ))}
      </ul>
    </div>
  );
}
