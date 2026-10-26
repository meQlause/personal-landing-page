import type { School } from '../../content/education';
import { HeadlineLine } from './HeadlineLine';

interface SchoolPanelProps {
  school: School;
  active: boolean;
}

// One school: its period, its headline, the degree, the institution and the stamps of what was earned there.
export function SchoolPanel({ school, active }: SchoolPanelProps) {
  return (
    <div
      className="c-panel"
      role="tabpanel"
      id={`cpanel-${school.id}`}
      aria-labelledby={`ctab-${school.id}`}
      hidden={!active}
    >
      <p className="c-period">{school.period}</p>
      <h3 className="c-headline" aria-label={school.label}>
        <HeadlineLine tokens={school.tokens} />
      </h3>
      <p className="c-degree">{school.degree}</p>
      <p className="c-inst">{school.inst}</p>
      <ul className="c-stamps">
        {(school.stamps ?? []).map((stamp) => (
          <li key={stamp}>{stamp}</li>
        ))}
      </ul>
    </div>
  );
}
