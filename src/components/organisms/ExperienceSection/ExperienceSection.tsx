import { useRef } from 'react';
import { experienceArt } from '../../../assets/art';
import { SECTION_NAV } from '../../../content/nav';
import { STOPS } from '../../../content/experience';
import { mountExperience } from '../../../motion/experience/mount';
import { useSectionMotion } from '../../../motion/useSectionMotion';
import { InlineSvg } from '../../atoms/InlineSvg';
import { ExperiencePanel } from '../../molecules/ExperiencePanel';
import { ExperienceRuler } from '../../molecules/ExperienceRuler';
import { YearRoll } from '../../molecules/YearRoll';
import { SectionNav } from '../SectionNav';
import './experience.css';

// Experience: seven stops on one pinned stage. Scrolling plays each stop's scene; the ruler slides to the next flag.
export function ExperienceSection() {
  const ref = useRef<HTMLElement>(null);
  useSectionMotion(ref, mountExperience, 'experience');
  return (
    <section ref={ref} className="experience" id="experience" aria-labelledby="exp-title">
      <div className="x-stage">
        <SectionNav
          prefix="x"
          name="Experience"
          titleId="exp-title"
          nameTag="h2"
          links={SECTION_NAV.experience}
        />
        <YearRoll />
        {STOPS.map((stop, index) => (
          <ExperiencePanel key={stop.id} stop={stop} active={index === 0} />
        ))}
        <InlineSvg markup={experienceArt} />
        <ExperienceRuler stops={STOPS} />
      </div>
    </section>
  );
}
