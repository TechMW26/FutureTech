import { useEffect, useRef, useState } from 'react'
import WorksSequence from './WorksSequence'
import IntelligenceSection from './IntelligenceSection'
import { workProjects } from './workProjects'
import { WORKS_SCROLL_SCREENS, TOTAL_SCROLL_SCREENS, worksHandoff } from './scrollTimeline'

export default function OurWorks() {
  const [progress, setProgress] = useState(0)
  const [handoff, setHandoff] = useState(0)
  const scrollTrack = useRef(null)
  const stage = useRef(null)

  useEffect(() => {
    const update = () => {
      const section = scrollTrack.current
      const viewportHeight = stage.current?.clientHeight
      if (!section || !viewportHeight) return
      const distance = viewportHeight * WORKS_SCROLL_SCREENS
      const position = -section.getBoundingClientRect().top
      setProgress(Math.max(0, Math.min(1, position / distance)))
      setHandoff(worksHandoff(position, viewportHeight))
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <main className="home-screen" id="works">
      <section
        ref={scrollTrack}
        className="carousel-scroll"
        style={{ height: `${TOTAL_SCROLL_SCREENS * 100}svh` }}
        id="carousel-scroll"
        aria-label="Selected works and intelligence"
      >
        <div className="hero" ref={stage}>
          <div
            className="carousel-scene"
            inert={handoff >= .5}
            style={{
              opacity: (1 - handoff) ** 3,
              visibility: handoff === 1 ? 'hidden' : undefined,
            }}
          >
            <WorksSequence progress={progress} items={workProjects} />
          </div>
          <IntelligenceSection scrollTrack={scrollTrack} />
        </div>
      </section>
    </main>
  )
}
