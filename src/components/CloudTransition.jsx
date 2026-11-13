import { useEffect, useRef } from 'react'
import './CloudTransition.css'

/**
 * Scroll-synchronised white cloud wipe that hides the boundary between the home
 * hero and the fly-through section beneath it. Opacity is derived purely from
 * scroll position, so it runs the same forwards and backwards.
 */
export default function CloudTransition() {
  const overlay = useRef(null)

  useEffect(() => {
    const clouds = overlay.current
    const hero = document.querySelector('.hero-section')
    if (!clouds || !hero) return
    let ticking = false

    const update = () => {
      const rect = hero.getBoundingClientRect()
      const travel = rect.height || window.innerHeight
      // 0 while the hero still fills the viewport, 1 once it has scrolled away.
      const progress = Math.max(0, Math.min(1, -rect.top / travel))
      // sin() peaks at the midpoint of the hand-off and falls back to 0 at both
      // ends, so the boundary is fully hidden exactly where the two sections meet.
      clouds.style.opacity = (Math.sin(progress * Math.PI) * 0.98).toFixed(4)
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return <div className="cloud-transition" ref={overlay} aria-hidden="true" />
}
