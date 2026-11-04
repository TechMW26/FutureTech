import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import './DirectorExperience.css'
import DirectorOrbits from './DirectorOrbits'

export default function DirectorExperience({ embedded = false }) {
  const track = useRef(null)
  useEffect(() => {
    const host = track.current
    if (!host) return
    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0, x = 0, y = 0
    const draw = () => {
      frame = 0
      const rect = host.getBoundingClientRect()
      const progress = reduced.matches ? 0 : Math.max(0, Math.min(1, -rect.top / Math.max(1, host.offsetHeight - innerHeight)))
      const shift = Math.max(0, Math.min(1, (progress - .12) / .7))
      const eased = shift * shift * (3 - 2 * shift)
      const mobile = innerWidth <= 700
      host.style.setProperty('--director-group-x', `${mobile ? 0 : eased * -37}vw`)
      host.style.setProperty('--director-group-y', `${mobile ? eased * 100 : Math.sin(eased * Math.PI) * -12}px`)
      host.style.setProperty('--director-group-scale', String(mobile ? 1 - eased * .28 : 1))
      host.style.setProperty('--director-orbit-rotation', `${progress * 22}deg`)
      host.style.setProperty('--director-group-tilt', `${reduced.matches ? 0 : x * 1.5 + y * .5}deg`)
      host.style.setProperty('--director-intro-opacity', String(1 - Math.min(1, shift * 3)))
      host.style.setProperty('--director-bio-opacity', String(Math.max(0, Math.min(1, (shift - .45) / .5))))
      host.style.setProperty('--director-bio-lift', `${(1 - eased) * 65}px`)
      const bio = host.querySelector('.director-biography')
      if (bio) bio.inert = !reduced.matches && shift < .6
      const intro = host.querySelector('.director-experience-note')
      if (intro) intro.inert = !reduced.matches && shift > .34
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(draw) }
    const move = (event) => {
      if (event.pointerType !== 'mouse') return
      const rect = host.getBoundingClientRect()
      x = (event.clientX - rect.left) / rect.width - .5
      y = event.clientY / innerHeight - .5
      schedule()
    }
    const reset = () => { x = y = 0; schedule() }
    host.addEventListener('pointermove', move)
    host.addEventListener('pointerleave', reset)
    addEventListener('scroll', schedule, { passive: true })
    addEventListener('resize', schedule)
    reduced.addEventListener('change', schedule)
    draw()
    return () => {
      cancelAnimationFrame(frame)
      host.removeEventListener('pointermove', move); host.removeEventListener('pointerleave', reset)
      removeEventListener('scroll', schedule); removeEventListener('resize', schedule)
      reduced.removeEventListener('change', schedule)
    }
  }, [])

  return (
    <section ref={track} className={`director-experience${embedded ? ' director-experience--embedded' : ''}`} aria-labelledby="director-experience-name">
      <div className="director-experience-stage">
        <div className="director-experience-top">
          <Link to="/about#directors">{embedded ? 'MW FUTURETECH' : '← All directors'}</Link>
          <span>THE PEOPLE BEHIND THE PERSPECTIVE</span>
        </div>
        <div className="director-experience-heading">
          <span className="director-role">DIRECTOR / MW FUTURETECH</span>
          {embedded
            ? <h2 id="director-experience-name">Aviraj<br /><span>Sharma.</span></h2>
            : <h1 id="director-experience-name">Aviraj<br /><span>Sharma.</span></h1>}
        </div>
        <div className="director-orbit-group">
          <DirectorOrbits />
          <div className="director-experience-photo">
            <img src="/images/about/aviraj-cutout.png" alt="Aviraj Sharma, Director of MW Futuretech" width="1081" height="1455" loading={embedded ? 'lazy' : 'eager'} fetchPriority={embedded ? 'auto' : 'high'} />
          </div>
          <DirectorOrbits front />
        </div>
        <div className="director-experience-note">
          <span className="director-note-rule" />
          <p>People at the centre.<br />Possibility ahead.</p>
          <Link to="/lets-talk">Let’s connect <span aria-hidden="true">↗</span></Link>
        </div>
        <article className="director-biography">
          <span className="director-role">ABOUT AVIRAJ / DIRECTOR</span>
          <h2>A human perspective.<br /><span>A forward vision.</span></h2>
          <p>Aviraj Sharma is a director at MW Futuretech. At the heart of the organisation’s vision are people, ideas, technology and impact.</p>
          <p>Building a brighter tomorrow starts with the conversations we have today.</p>
          <Link className="about-text-link" to="/lets-talk">Start a conversation <span aria-hidden="true">↗</span></Link>
        </article>
        <div className="director-experience-bottom"><span>HUMAN IMAGINATION. FORWARD VISION.</span><span>MW / 01</span></div>
      </div>
    </section>
  )
}
