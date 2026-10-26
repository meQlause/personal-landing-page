import type { CSSProperties } from 'react';
import type { ExperienceStop } from '../../content/experience';

interface ExperienceRulerProps {
  stops: readonly ExperienceStop[];
}

// One ticker: its list twice over, so the motion can loop it without a gap.
function Ticker({ stop }: { stop: ExperienceStop }) {
  const items = stop.tickers.map((item) => <i key={item}>{item}</i>);
  return (
    <div className="x-ticker" data-stop={stop.id} aria-hidden="true">
      <div className="x-ticker-track">
        <span>{items}</span>
        <span>{items}</span>
      </div>
    </div>
  );
}

// The ruler: seven flags on a tape, the needle over the active one, and a ticker for each stop.
export function ExperienceRuler({ stops }: ExperienceRulerProps) {
  return (
    <div className="x-ruler">
      <div className="x-tape" role="tablist" aria-labelledby="exp-title">
        {stops.map((stop, index) => (
          <button
            key={stop.id}
            className="x-stop"
            role="tab"
            id={`xtab-${stop.id}`}
            aria-controls={`xpanel-${stop.id}`}
            aria-selected={index === 0}
            tabIndex={index === 0 ? undefined : -1}
            style={{ '--i': index } as CSSProperties}
          >
            <span className="x-flag" aria-hidden="true" />
            <span className="x-years">{stop.years}</span>
            <span className="x-name">{stop.name}</span>
          </button>
        ))}
      </div>
      <span className="x-needle" aria-hidden="true" />
      {stops.map((stop) => (
        <Ticker key={stop.id} stop={stop} />
      ))}
    </div>
  );
}
