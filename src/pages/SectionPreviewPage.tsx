import { ContactSection } from '../components/organisms/ContactSection/ContactSection';
import { EducationSection } from '../components/organisms/EducationSection/EducationSection';
import { ExperienceSection } from '../components/organisms/ExperienceSection/ExperienceSection';
import { HeroSection } from '../components/organisms/HeroSection/HeroSection';
import { PageCursor } from '../components/organisms/PageCursor';
import { WorkSection } from '../components/organisms/WorkSection/WorkSection';
import { SectionPreviewTemplate } from '../components/templates/SectionPreviewTemplate';

// Previews one section alone at /?section=<id>. Each section is added here as it is ported (P5 to P7).
export function SectionPreviewPage() {
  const section = new URLSearchParams(location.search).get('section');
  if (section === 'hero') {
    return (
      <>
        <PageCursor />
        <main>
          <HeroSection />
        </main>
      </>
    );
  }
  if (section === 'contact') {
    return (
      <>
        <PageCursor />
        <main>
          <ContactSection />
        </main>
      </>
    );
  }
  if (section === 'education') {
    return (
      <>
        <PageCursor />
        <main>
          <EducationSection />
        </main>
      </>
    );
  }
  if (section === 'experience') {
    return (
      <>
        <PageCursor />
        <main>
          <ExperienceSection />
        </main>
      </>
    );
  }
  if (section === 'work') {
    return (
      <>
        <PageCursor />
        <main>
          <WorkSection />
        </main>
      </>
    );
  }
  return (
    <>
      <PageCursor />
      <SectionPreviewTemplate>
        <p>Section not ported yet</p>
      </SectionPreviewTemplate>
    </>
  );
}
