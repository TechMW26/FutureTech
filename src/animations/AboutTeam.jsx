import { useState } from 'react'
import { TEAM } from '../data/team'
import './AboutTeam.css'

// Cards read the site's canonical roster so both About presentations stay in sync.
const members = TEAM.map((member) => ({
  name: member.name,
  role: member.role,
  phrase: member.quote.replace(/^"|"$/g, ''),
  copy: member.bio,
  tags: member.skills,
  img: member.img,
}))

export default function AboutTeam() {
  const [active, setActive] = useState(null)
  function tilt(event) {
    if (event.pointerType !== 'mouse' || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width
    const y = (event.clientY - rect.top) / rect.height
    event.currentTarget.style.setProperty('--team-x', `${(x - .5) * 3}deg`)
    event.currentTarget.style.setProperty('--team-y', `${(.5 - y) * 2}deg`)
    event.currentTarget.style.setProperty('--team-light', `${x * 100}%`)
  }
  return (
    <section className="people-gallery" aria-labelledby="people-gallery-title">
      <header className="people-gallery-heading" data-about-reveal>
        <span className="about-kicker">THE MINDS BEHIND THE MOMENTUM</span>
        <h2 id="people-gallery-title">Good people.<br /><span>Extraordinary possibilities.</span></h2>
        <p>Different perspectives. A shared curiosity.</p>
      </header>
      <div className="people-gallery-rail" onMouseLeave={() => setActive(null)}>
        {members.map((member, index) => (
          <button
            key={member.name}
            className={`people-gallery-card${active === index ? ' is-active' : ''}`}
            type="button"
            aria-expanded={active === index}
            aria-controls={`team-detail-${index}`}
            onMouseEnter={() => setActive(index)}
            onFocus={() => setActive(index)}
            onBlur={() => setActive(null)}
            onClick={() => setActive(active === index ? null : index)}
            onPointerMove={tilt}
            onPointerLeave={event => {
              event.currentTarget.style.setProperty('--team-x', '0deg')
              event.currentTarget.style.setProperty('--team-y', '0deg')
            }}
          >
            <span className="team-card-photo" aria-hidden="true"><img src={member.img} alt="" width="420" height="630" decoding="async" /></span>
            <span className="team-card-gloss" aria-hidden="true" />
            <span className="team-card-top">
              <span>MW / {String(index + 1).padStart(2, '0')}</span>
              <span className="team-card-symbol" aria-hidden="true">
                <svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="18" /><ellipse cx="24" cy="24" rx="9" ry="18" /><path d="M6 24h36M10 13c8 6 20 6 28 0M10 35c8-6 20-6 28 0" /></svg>
              </span>
            </span>
            <span className="team-card-bottom">
              <span className="team-card-role">{member.role}</span>
              <span className="team-card-name">{member.name}</span>
              <span className="team-card-rule" />
              <span className="team-card-detail" id={`team-detail-${index}`}>
                <span className="team-card-phrase">{member.phrase}</span>
                <span className="team-card-copy">{member.copy}</span>
                <span className="team-card-tags">{member.tags.map(tag => <span key={tag}>{tag}</span>)}</span>
              </span>
            </span>
            <span className="team-card-toggle" aria-hidden="true">{active === index ? '−' : '+'}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
