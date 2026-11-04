import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { WorksRibbonRenderer } from './WorksRibbonRenderer'
import { interval, smooth, projectFocus } from './WorksRibbonMotion'
import './WorksSequence.css'

/** Scroll-orchestrated ribbon of project cards that resolves into a focused carousel. */
export default function WorksSequence({ progress, items, onSelect }) {
  const host = useRef(null)
  const canvas = useRef(null)
  const first = useRef(null)
  const second = useRef(null)
  const details = useRef(null)
  const detailContent = useRef(null)
  const renderer = useRef(null)
  const target = useRef(progress)
  const focused = useRef(-1)
  const active = useRef(0)
  const wake = useRef(() => {})
  const down = useRef({ x: 0, y: 0 })
  const fallbackRef = useRef(false)
  const [fallback, setFallback] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const project = items[activeIndex]

  useEffect(() => {
    const root = host.current, surface = canvas.current
    let width = root.clientWidth, height = root.clientHeight
    let frame = 0, last = 0, current = target.current, miniSpin = 0
    let running = true, visible = true
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const render = (time) => {
      frame = 0
      if (!running || !visible || document.hidden) { last = 0; return }
      const dt = last ? Math.min((time - last) / 1000, .05) : 1 / 60
      last = time
      current += (target.current - current) * (1 - Math.exp(-dt / .24))
      if (Math.abs(target.current - current) < .00001) current = target.current
      const p = motion.matches || fallbackRef.current ? Math.max(.5, target.current) : current
      if (p < .16 && !motion.matches) miniSpin += dt * .055
      renderer.current?.render(p, width, height, focused.current, miniSpin)
      const intro = Math.min(.54, p / .36 * .54)
      const moveText = motion.matches ? 0 : smooth(interval(intro, .16, .54))
      if (first.current) first.current.style.transform = `translate3d(${moveText * width * .67}px, ${-moveText * height * .13}px, 0)`
      if (second.current) second.current.style.transform = `translate3d(${-moveText * width * .67}px, ${moveText * height * .13}px, 0)`
      const focus = projectFocus(p, Math.min(8, items.length))
      if (focus.index !== active.current) { active.current = focus.index; setActiveIndex(focus.index) }
      if (details.current) {
        details.current.style.opacity = String(focus.reveal)
        details.current.style.transform = `translate3d(${(1 - focus.reveal) * 24}px, -50%, 0)`
        details.current.inert = focus.reveal < .8
        details.current.setAttribute('aria-hidden', String(focus.reveal < .8))
      }
      if (detailContent.current) {
        detailContent.current.style.opacity = String(focus.textOpacity)
        detailContent.current.style.transform = `translateY(${(1 - focus.textOpacity) * 10}px)`
      }
      if (current !== target.current || (p < .16 && !motion.matches && !fallbackRef.current)) frame = requestAnimationFrame(render)
      else last = 0
    }
    const schedule = () => { if (!frame && running && visible && !document.hidden) frame = requestAnimationFrame(render) }
    wake.current = schedule
    const fail = () => {
      if (running) { fallbackRef.current = true; setFallback(true); renderer.current?.dispose(); renderer.current = null; schedule() }
    }
    try { renderer.current = new WorksRibbonRenderer(surface, Math.min(8, items.length), schedule, fail) }
    catch { fail() }
    const resize = new ResizeObserver(() => { width = root.clientWidth; height = root.clientHeight; schedule() })
    resize.observe(root)
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) schedule() })
    observer.observe(root)
    const contextLost = (event) => { event.preventDefault(); fail() }
    surface.addEventListener('webglcontextlost', contextLost)
    motion.addEventListener('change', schedule)
    document.addEventListener('visibilitychange', schedule)
    schedule()
    return () => {
      running = false; cancelAnimationFrame(frame); renderer.current?.dispose(); renderer.current = null
      resize.disconnect(); observer.disconnect(); wake.current = () => {}
      surface.removeEventListener('webglcontextlost', contextLost)
      motion.removeEventListener('change', schedule)
      document.removeEventListener('visibilitychange', schedule)
    }
  }, [items.length])

  useLayoutEffect(() => {
    target.current = progress
    wake.current()
  }, [progress])

  return (
    <div ref={host} className={`works-sequence${fallback ? ' works-sequence-fallback' : ''}`} id="project-carousel">
      <h1 className="works-motion-title" aria-label="Our Works">
        <span ref={first}><span>OUR</span></span>
        <span ref={second}><span>WORKS</span></span>
      </h1>
      <p className="works-motion-note">Human imagination.<br />Extraordinary digital experiences.</p>
      <canvas
        ref={canvas}
        className="works-ribbon-canvas"
        aria-hidden="true"
        onPointerDown={event => { down.current = { x: event.clientX, y: event.clientY } }}
        onPointerMove={event => {
          const rect = event.currentTarget.getBoundingClientRect()
          event.currentTarget.style.cursor = (renderer.current?.pick(event.clientX - rect.left, event.clientY - rect.top) ?? -1) >= 0 ? 'pointer' : 'default'
        }}
        onClick={event => {
          if (Math.hypot(event.clientX - down.current.x, event.clientY - down.current.y) > 8) return
          const rect = event.currentTarget.getBoundingClientRect()
          const index = renderer.current?.pick(event.clientX - rect.left, event.clientY - rect.top) ?? -1
          if (index >= 0) onSelect(items[index])
        }}
      />
      {fallback && (
        <button className="works-fallback-project" onClick={() => onSelect(project)} aria-label={`View ${project.title}`}>
          <img src={project.src} alt={project.alt} />
        </button>
      )}
      <section ref={details} className="work-detail" aria-labelledby="work-detail-title" aria-hidden="true">
        <div ref={detailContent} className="work-detail-content" aria-live="polite">
          <p className="work-detail-category">{project.category}</p>
          <h2 id="work-detail-title">{project.title}</h2>
          <p className="work-detail-description">{project.description}</p>
          <button className="work-detail-link" onClick={() => onSelect(project)}>View project <span aria-hidden="true">↗</span></button>
          <p className="work-detail-count">
            <span>{String(activeIndex + 1).padStart(2, '0')}</span>
            <span className="work-detail-line" />
            <span>{String(Math.min(8, items.length)).padStart(2, '0')}</span>
          </p>
        </div>
      </section>
      <div className="works-accessible-projects" aria-label="Projects">
        {items.slice(0, 8).map((item, index) => (
          <button
            key={item.src}
            onClick={() => onSelect(item)}
            onFocus={() => { focused.current = index; wake.current() }}
            onBlur={() => { focused.current = -1; wake.current() }}
          >
            View {item.title}
          </button>
        ))}
      </div>
    </div>
  )
}
