import pictImg from '../assets/pict.webp'
import { ABOUT_BIO, SKILL_GROUPS } from '../data/about'
import { useReveal } from '../hooks/useReveal'

export default function About() {
  const left = useReveal<HTMLDivElement>()
  const right = useReveal<HTMLDivElement>()
  const phone = useReveal<HTMLDivElement>()

  return (
    <section id="about">
      <div className="section-inner about-inner">
        <div ref={left.ref} className={`about-left reveal-left${left.inView ? ' in-view' : ''}`}>
          <span className="section-tag">[ 05 / ABOUT ]</span>
          <h2 className="section-title">Who I Am</h2>

          <div
            ref={phone.ref}
            className={`about-phone reveal-phone${phone.inView ? ' in-view' : ''}`}
          >
            <div className="about-avatar">
              <div className="avatar-placeholder">
                <img src={pictImg} alt="Ardial" className="avatar-image" />
                <div className="avatar-ring" />
                <div className="avatar-ring avatar-ring--2" />
              </div>
            </div>
          </div>

          {ABOUT_BIO.map((para, i) => (
            <p key={i} className="about-text">
              {para}
            </p>
          ))}

          <div className="about-skills">
            {SKILL_GROUPS.map((group) => (
              <div key={group.label} className="skill-group">
                <span className="skill-group-label">{group.label}</span>
                <div className="skill-pills">
                  {group.skills.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          ref={right.ref}
          className={`about-right reveal-right${right.inView ? ' in-view' : ''}`}
        >
          <div className="about-avatar">
            <div className="avatar-placeholder">
              <img src={pictImg} alt="Ardial" className="avatar-image" />
              <div className="avatar-ring" />
              <div className="avatar-ring avatar-ring--2" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
