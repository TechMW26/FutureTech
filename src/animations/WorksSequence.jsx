import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { WorksRibbonRenderer } from './WorksRibbonRenderer'
import { interval, smooth, projectFocus } from './WorksRibbonMotion'
import { MAX_PROJECTS } from './workProjects'
import MicroSlats from '../components/MicroSlats'
import './WorksSequence.css'

const MAX_CARDS = MAX_PROJECTS

/** Scroll-orchestrated ribbon of project cards that resolves into a focused carousel. */
export default function WorksSequence({ progress, items }) {
  const navigate = useNavigate()
  const cards = Math.min(MAX_CARDS, items.length)
  const host = useRef(null)
  const canvas = useRef(null)
  const title = useRef(null)
  const details = useRef(null)
  const projectFrame = useRef(null)
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
  const project = items[activeIndex] ?? items[0]

  useEffect(() => {
    const root = host.current, surface = canvas.current
    if (!root || !surface) return
    let width = root.clientWidth, height = root.clientHeight
    let focusFrame = null
    let frame = 0, last = 0, current = target.current, miniSpin = 0
    let running = true, visible = true, retry = 0
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const measure = () => {
      width = root.clientWidth || window.innerWidth
      height = root.clientHeight || window.innerHeight
      // Round to device pixels so sub-pixel container sizes cannot break scissor math.
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = Math.max(1, Math.round(width * dpr) / dpr)
      height = Math.max(1, Math.round(height * dpr) / dpr)
      const frameBounds = projectFrame.current.getBoundingClientRect()
      const rootBounds = root.getBoundingClientRect()
      focusFrame = frameBounds.width ? {
        x: frameBounds.left - rootBounds.left + frameBounds.width / 2,
        y: frameBounds.top - rootBounds.top + frameBounds.height / 2,
        width: frameBounds.width,
        height: frameBounds.height,
      } : null
    }
    measure()
    const render = (time) => {
      frame = 0
      if (!running || !visible || document.hidden) { last = 0; return }
      const dt = last ? Math.min((time - last) / 1000, .05) : 1 / 60
      last = time
      // Reduced motion keeps the full scroll sequence but snaps the ribbon to the
      // scroll position instead of easing behind it.
      const ease = motion.matches ? 1 : 1 - Math.exp(-dt / .24)
      current += (target.current - current) * ease
      if (Math.abs(target.current - current) < .00001) current = target.current
      const p = current
      if (!motion.matches && p < .16) miniSpin += dt * .055
      renderer.current?.render(p, width, height, focused.current, miniSpin, focusFrame)
      const intro = Math.min(.54, p / .36 * .54)
      const titleExit = smooth(interval(intro, .16, .54))
      title.current?.style.setProperty('--works-title-exit', String(titleExit))
      const focus = projectFocus(p, Math.min(MAX_CARDS, items.length))
      const detailReveal = focusFrame ? smooth(interval(p, .46, .50)) : focus.reveal
      if (focus.index !== active.current) { active.current = focus.index; setActiveIndex(focus.index) }
      if (details.current) {
        details.current.style.opacity = String(detailReveal)
        details.current.style.setProperty('--work-detail-offset', `${(1 - detailReveal) * 24}px`)
        details.current.inert = detailReveal < .8
        details.current.setAttribute('aria-hidden', String(detailReveal < .8))
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
    // Some browsers report a lost GPU context or a transient WebGL failure at
    // first paint. Retry a couple of times before switching to the static
    // fallback so a brief hiccup does not permanently remove the carousel.
    let mine = null
    const create = () => {
      try {
        mine = new WorksRibbonRenderer(surface, Math.min(MAX_CARDS, items.length), items.map(item => item.src), schedule, fail)
        renderer.current = mine
      } catch {
        mine = null
        if (retry++ < 2) setTimeout(() => { if (running && !mine) create() }, 350)
        else fail()
      }
    }
    create()
    const resize = new ResizeObserver(() => { measure(); schedule() })
    resize.observe(root)
    resize.observe(projectFrame.current)
    resize.observe(detailContent.current)
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) schedule() })
    observer.observe(root)
    const contextLost = (event) => { event.preventDefault(); fail() }
    surface.addEventListener('webglcontextlost', contextLost)
    motion.addEventListener('change', schedule)
    document.addEventListener('visibilitychange', schedule)
    window.addEventListener('orientationchange', schedule)
    schedule()
    return () => {
      running = false; cancelAnimationFrame(frame); mine?.dispose(); mine = null
      if (renderer.current === mine) renderer.current = null
      resize.disconnect(); observer.disconnect(); wake.current = () => {}
      surface.removeEventListener('webglcontextlost', contextLost)
      motion.removeEventListener('change', schedule)
      document.removeEventListener('visibilitychange', schedule)
      window.removeEventListener('orientationchange', schedule)
    }
  }, [items])

  useLayoutEffect(() => {
    target.current = progress
    wake.current()
  }, [progress])

  return (
    <div ref={host} className={`works-sequence${fallback ? ' works-sequence-fallback' : ''}`} id="project-carousel">
      {progress < 0.15 && (
        <div
          className="works-sequence__background"
          style={{ opacity: 1 - progress / 0.15 }}
          aria-hidden="true"
        >
          <MicroSlats color="#242424" glintColor="#ffffff" backgroundColor="transparent" />
        </div>
      )}
      <h1 ref={title} className="works-motion-title">
        <span><span>Products That</span></span>
        {' '}
        <span><span>Make a Difference</span></span>
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
          if (index >= 0 && items[index]) navigate(items[index].path)
        }}
      />
      {fallback && (
        <div className="works-fallback-project" role="group" aria-label="Project previews">
          {items.slice(0, cards).map(item => (
            <Link key={item.id} to={item.path} aria-label={`View ${item.title}`}>
              <img src={item.src} alt={item.alt} />
              <span>{item.title}</span>
            </Link>
          ))}
        </div>
      )}
      <section ref={details} className="work-detail" aria-labelledby="work-detail-title" aria-hidden="true">
        <div ref={projectFrame} className="work-detail-frame" aria-hidden="true" />
        <div ref={detailContent} className="work-detail-content" aria-live="polite">
          <p className="work-detail-category">{project.category}</p>
          <h2 id="work-detail-title">{project.title}</h2>
          <p className="work-detail-description">
            <span className="work-detail-full-description">{project.description}</span>
            <span className="work-detail-summary">{project.summary}</span>
          </p>
          <Link className="work-detail-link" to={project.path}>View project <span aria-hidden="true">↗</span></Link>
          <p className="work-detail-count">
            <span>{String(activeIndex + 1).padStart(2, '0')}</span>
            <span className="work-detail-line" />
            <span>{String(cards).padStart(2, '0')}</span>
          </p>
        </div>
      </section>
      {!fallback && <nav className="works-accessible-projects" aria-label="Projects">
        {items.slice(0, cards).map((item, index) => (
          <Link
            key={item.id}
            to={item.path}
            onFocus={() => { focused.current = index; wake.current() }}
            onBlur={() => { focused.current = -1; wake.current() }}
          >
            View {item.title}
          </Link>
        ))}
      </nav>}
    </div>
  )
}
