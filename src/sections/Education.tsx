import { useReveal } from '../hooks/useReveal'
import { EDUCATION } from '../data/education'
import type { Education } from '../types'

interface EducationProps {
  onOpenModal: (edu: Education) => void
}

function EduCard({
  edu,
  index,
  onOpen,
}: {
  edu: Education
  index: number
  onOpen: (e: Education) => void
}) {
  const { ref, inView } = useReveal<HTMLDivElement>({ delay: index * 100 })

  return (
    <div
      ref={ref}
      className={`edu-card reveal-card${inView ? ' in-view' : ''}`}
      tabIndex={0}
      role="button"
      aria-label={`View ${edu.institution} details`}
      onClick={() => onOpen(edu)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen(edu)
        }
      }}
      style={{ '--edu-color': edu.color } as React.CSSProperties}
    >
      <div className="edu-card-icon" style={{ color: edu.color, borderColor: edu.color }}>
        {edu.icon}
      </div>
      <div className="edu-card-content">
        <div className="edu-card-meta">
          <span
            className="edu-card-category"
            style={{ color: edu.color, borderColor: `${edu.color}33` }}
          >
            {edu.category === 'formal' ? 'Formal' : 'Informal'}
          </span>
          <span className="edu-card-period">{edu.period}</span>
        </div>
        <h4 className="edu-card-degree">{edu.degree}</h4>
        <span className="edu-card-institution">{edu.institution}</span>
        {edu.score && (
          <span className="edu-card-score" style={{ color: edu.color }}>
            Score: {edu.score}
          </span>
        )}
      </div>
      <span className="edu-view-hint">View Details ↗</span>
    </div>
  )
}

export default function Education({ onOpenModal }: EducationProps) {
  const header = useReveal<HTMLDivElement>()

  const formal = EDUCATION.filter((e) => e.category === 'formal')
  const informal = EDUCATION.filter((e) => e.category === 'informal')

  return (
    <section id="education">
      <div className="section-inner">
        <div ref={header.ref} className={`section-header reveal-up${header.inView ? ' in-view' : ''}`}>
          <span className="section-tag">[ 04 / EDUCATION ]</span>
          <h2 className="section-title">Background</h2>
          <p className="section-sub">
            A blend of formal academic study and intensive self-directed learning.
          </p>
        </div>

        <div className="edu-columns">
          <div className="edu-column">
            <span className="edu-column-label">Formal Education</span>
            <div className="edu-list">
              {formal.map((edu, i) => (
                <EduCard key={edu.id} edu={edu} index={i} onOpen={onOpenModal} />
              ))}
            </div>
          </div>

          <div className="edu-column">
            <span className="edu-column-label">Informal Education</span>
            <div className="edu-list">
              {informal.map((edu, i) => (
                <EduCard key={edu.id} edu={edu} index={i + formal.length} onOpen={onOpenModal} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
