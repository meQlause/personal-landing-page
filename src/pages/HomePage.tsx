import { PageCursor } from '../components/organisms/PageCursor';
import { ContactSection } from '../components/organisms/ContactSection/ContactSection';
import { EducationSection } from '../components/organisms/EducationSection/EducationSection';
import { ExperienceSection } from '../components/organisms/ExperienceSection/ExperienceSection';
import { HeroSection } from '../components/organisms/HeroSection/HeroSection';
import { WorkSection } from '../components/organisms/WorkSection/WorkSection';
import { JourneyTemplate } from '../components/templates/JourneyTemplate';

// Pages fill a template with real content; they are the only level that knows what the site says.
export function HomePage() {
  return (
    <>
      <PageCursor />
      <JourneyTemplate lead={<HeroSection />}>
        <WorkSection />
        <ExperienceSection />
        <EducationSection />
        <ContactSection />
      </JourneyTemplate>
    </>
  );
}
