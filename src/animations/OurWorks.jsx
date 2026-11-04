import { useEffect, useRef, useState } from 'react'
import WorksSequence from './WorksSequence'
import IntelligenceSection from './IntelligenceSection'
import { workProjects } from './workProjects'
import { WORKS_SCROLL_SCREENS, TOTAL_SCROLL_SCREENS } from './scrollTimeline'

export default function OurWorks() {
  const [progress, setProgress] = useState(0)
  const [departure, setDeparture] = useState(0)
  const [selected, setSelected] = useState(null)
  const scrollTrack = useRef(null)
  const dialog = useRef(null)

  useEffect(() => {
    const update = () => {
      const section = scrollTrack.current
      if (!section) return
      const distance = window.innerHeight * WORKS_SCROLL_SCREENS
      const position = -section.getBoundingClientRect().top
      setProgress(Math.max(0, Math.min(1, position / distance)))
      const leaving = Math.max(0, Math.min(1, (position - distance) / window.innerHeight))
      setDeparture(leaving * leaving * (3 - 2 * leaving) * window.innerHeight)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  useEffect(() => {
    const modal = dialog.current
    if (!modal) return
    if (selected && !modal.open) modal.showModal()
    else if (!selected && modal.open) modal.close()
  }, [selected])

  return (
    <main className="home-screen" id="works">
      <section
        ref={scrollTrack}
        className="carousel-scroll"
        style={{ height: `${TOTAL_SCROLL_SCREENS * 100}svh` }}
        id="carousel-scroll"
        aria-label="Selected works and intelligence"
      >
        <div className="hero">
          <div className="carousel-scene" style={{ transform: `translate3d(0, ${-departure}px, 0)` }}>
            <WorksSequence progress={progress} items={workProjects} onSelect={setSelected} />
          </div>
          <IntelligenceSection scrollTrack={scrollTrack} />
        </div>
      </section>
      <dialog
        ref={dialog}
        className="project-dialog"
        aria-label={selected?.title || 'Project preview'}
        onClose={() => setSelected(null)}
        onClick={event => { if (event.target === event.currentTarget) setSelected(null) }}
      >
        <button className="project-close" onClick={() => setSelected(null)} aria-label="Close project">×</button>
        {selected && <><img src={selected.src} alt={selected.alt} /><h2>{selected.title}</h2></>}
      </dialog>
    </main>
  )
}
