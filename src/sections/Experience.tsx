import { useEffect } from 'react'
import { useReveal } from '../hooks/useReveal'
import { EXPERIENCES } from '../data/experience'
import type { Experience } from '../types'

interface ExperienceProps {
  onOpenModal: (job: Experience) => void
}

function TimelineItem({
  job,
  index,
  isLast,
  onOpen,
}: {
  job: Experience
  index: number
  isLast: boolean
  onOpen: (j: Experience) => void
}) {
  const { ref, inView } = useReveal<HTMLDivElement>({ delay: index * 100 })

  return (
    <div
      ref={ref}
      className={`timeline-item reveal-left${inView ? ' in-view' : ''}`}
      tabIndex={0}
      role="button"
      aria-label={`View ${job.company} details`}
      onClick={() => onOpen(job)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen(job)
        }
      }}
    >
      <div className="timeline-marker">
        <span className="marker-dot" />
        {!isLast && <span className="marker-line" />}
      </div>
      <div className="timeline-content">
        <div className="timeline-header">
          <div>
            <h3 className="timeline-role">{job.role}</h3>
            <span className="timeline-company">◈ {job.company}</span>
          </div>
          <div className="timeline-meta">
            <span className="timeline-period">{job.period}</span>
            <span className="timeline-type">{job.type}</span>
          </div>
        </div>
        <p className="timeline-desc">{job.summary}</p>
        <div className="timeline-tags">
          {job.stack.slice(0, 5).map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </div>
        <span className="job-view-hint">View Details ↗</span>
      </div>
    </div>
  )
}

export default function Experience({ onOpenModal }: ExperienceProps) {
  const header = useReveal<HTMLDivElement>()

  useEffect(() => {
    EXPERIENCES.forEach((job) => {
      const img = new Image()
      img.src = job.logo
    })
  }, [])

  return (
    <section id="experience">
      <div className="section-inner">
        <div ref={header.ref} className={`section-header reveal-up${header.inView ? ' in-view' : ''}`}>
          <span className="section-tag">[ 02 / EXPERIENCE ]</span>
          <h2 className="section-title">Work History</h2>
        </div>

        <div className="timeline">
          {EXPERIENCES.map((job, i) => (
            <TimelineItem
              key={`${job.company}-${i}`}
              job={job}
              index={i}
              isLast={i === EXPERIENCES.length - 1}
              onOpen={onOpenModal}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
