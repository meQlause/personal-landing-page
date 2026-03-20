import { AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import LoadingScreen from './components/LoadingScreen'
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

// Import video path for preloading
import lifetimeArtVideo from './assets/projects/lifetimeart.mp4'

export default function App() {
  const { modal, openModal, closeModal } = useModal()
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const preloadVideo = async () => {
      try {
        const response = await fetch(lifetimeArtVideo)
        if (!response.ok) throw new Error('Failed to fetch video')

        const contentLength = response.headers.get('content-length')
        const total = contentLength ? parseInt(contentLength, 10) : 0

        if (!response.body) throw new Error('No response body')

        const reader = response.body.getReader()
        let loaded = 0

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          loaded += value.byteLength
          if (total > 0) {
            setProgress((loaded / total) * 100)
          }
        }

        // Finalize loading
        setProgress(100)
        setTimeout(() => setLoading(false), 500)
      } catch (error) {
        console.error('Preloading failed:', error)
        setLoading(false)
      }
    }

    preloadVideo()
  }, [])

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <LoadingScreen key="loader" progress={progress} />
      ) : (
        <div key="content">
          {/* Atmospheric overlays */}
          <div className="noise-overlay" aria-hidden="true" />
          <div className="scanlines" aria-hidden="true" />

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
        </div>
      )}
    </AnimatePresence>
  )
}
