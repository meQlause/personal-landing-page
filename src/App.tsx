import DevelopmentHeader from './components/DevelopmentHeader'
import Navbar from './components/Navbar'
import About from './sections/About'
import Certifications from './sections/Certifications'
import Contact from './sections/Contact'
import Education from './sections/Education'
import Experience from './sections/Experience'
import Hero from './sections/Hero'
import Projects from './sections/Projects'

import CertModal from './components/modals/CertModal'
import EducationModal from './components/modals/EducationModal'
import JobModal from './components/modals/JobModal'
import ProjectModal from './components/modals/ProjectModal'

import { useModal } from './hooks/useModal'
import type {
  Certification,
  Education as EducationType,
  Experience as ExperienceType,
  Project,
} from './types'

export default function App() {
  const { modal, openModal, closeModal } = useModal()

  return (
    <>
      {/* Atmospheric overlays */}
      <div className="noise-overlay" aria-hidden="true" />
      <div className="scanlines" aria-hidden="true" />

      <DevelopmentHeader />
      <Navbar />

      <main>
        <Hero />
        <Projects onOpenModal={(p: Project) => openModal('project', p)} />
        <Experience onOpenModal={(j: ExperienceType) => openModal('job', j)} />
        <Certifications onOpenModal={(c: Certification) => openModal('cert', c)} />
        <Education onOpenModal={(e: EducationType) => openModal('education', e)} />
        <About />
        <Contact />
      </main>

      <footer id="footer">
        <div className="footer-inner">
          <span className="footer-logo">[ARDIAL]</span>
          <span className="footer-copy">
            © {new Date().getFullYear()} Ardial. Designed &amp; built with intent.
          </span>
          <span className="footer-tech">React · TypeScript · Vite · Bun</span>
        </div>
      </footer>

      {/* Modals */}
      {modal.type === 'project' && modal.data && (
        <ProjectModal project={modal.data as Project} onClose={closeModal} />
      )}
      {modal.type === 'job' && modal.data && (
        <JobModal job={modal.data as ExperienceType} onClose={closeModal} />
      )}
      {modal.type === 'cert' && modal.data && (
        <CertModal cert={modal.data as Certification} onClose={closeModal} />
      )}
      {modal.type === 'education' && modal.data && (
        <EducationModal edu={modal.data as EducationType} onClose={closeModal} />
      )}
    </>
  )
}
