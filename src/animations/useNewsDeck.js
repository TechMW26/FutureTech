import { useLayoutEffect, useRef, useState } from 'react'
import { newsBatchPose } from './NewsDeckMotion'

/** Stacks news batches into a scroll-driven deck that peels one page at a time. */
export default function useNewsDeck(itemCount, resetKey) {
  const surface = useRef(null)
  const batches = useRef([])
  const navigation = useRef(null)
  const [pageSize, setPageSize] = useState(3)
  const [activePage, setActivePage] = useState(0)
  const active = useRef(0)
  const pageCount = Math.ceil(itemCount / pageSize)
  const jump = useRef(() => {})

  useLayoutEffect(() => {
    const query = window.matchMedia('(max-width: 760px)')
    const update = () => setPageSize(query.matches ? 1 : 3)
    update(); query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  useLayoutEffect(() => {
    const surfaceNode = surface.current
    if (!surfaceNode?.parentElement) return
    const host = surfaceNode.parentElement
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0, last = 0, current = 0, target = 0
    let distance = 600, stickyTop = 90, stageHeight = 560, enabled = false
    const groups = batches.current.slice(0, pageCount)
    active.current = 0

    const resetGroups = () => groups.forEach(group => {
      if (!group) return
      group.removeAttribute('style'); group.inert = false
      group.removeAttribute('aria-hidden'); group.classList.remove('is-behind')
    })
    const apply = () => {
      if (!enabled) return
      const front = Math.min(pageCount - 1, Math.max(0, Math.floor(current + .52)))
      groups.forEach((group, index) => {
        if (!group) return
        const pose = newsBatchPose(current, index, stageHeight)
        group.style.transform = `translate3d(0, ${pose.y}px, ${pose.z}px) scale(${pose.scale})`
        group.style.opacity = String(pose.opacity)
        group.style.zIndex = String(index + 1)
        group.style.setProperty('--batch-blur', `${pose.blur}px`)
        group.style.pointerEvents = front === index ? 'auto' : 'none'
        group.inert = front !== index
        group.setAttribute('aria-hidden', String(front !== index))
        group.classList.toggle('is-behind', index < front)
      })
      if (active.current !== front) { active.current = front; setActivePage(front) }
    }
    const animate = (now) => {
      frame = 0
      const dt = last ? Math.min((now - last) / 1000, .05) : 1 / 60
      last = now
      current += (target - current) * (1 - Math.exp(-dt / .12))
      if (Math.abs(current - target) < .0001) current = target
      apply()
      if (current !== target) frame = requestAnimationFrame(animate)
      else last = 0
    }
    const wake = () => { if (!frame && enabled) frame = requestAnimationFrame(animate) }
    const measure = () => {
      if (!enabled) return
      target = Math.max(0, Math.min(pageCount - 1, (stickyTop - host.getBoundingClientRect().top) / distance))
      wake()
    }
    const resize = () => {
      const viewport = window.innerHeight
      const cardHeight = Math.max(400, Math.min(570, viewport - 160))
      stageHeight = cardHeight + 60
      stickyTop = Math.max(82, Math.min(125, (viewport - stageHeight) / 2))
      distance = Math.max(420, viewport * .9)
      enabled = !motion.matches && pageCount > 1 && viewport >= stageHeight + stickyTop + 8
      host.classList.toggle('is-stacked', enabled)
      host.style.setProperty('--deck-card-height', `${cardHeight}px`)
      host.style.setProperty('--deck-stage-height', `${stageHeight}px`)
      host.style.setProperty('--deck-top', `${stickyTop}px`)
      if (enabled) {
        host.style.height = `${stageHeight + (pageCount - 1) * distance}px`
        groups.slice(1).forEach(group => group?.querySelectorAll('[data-news-reveal]').forEach(card => card.classList.add('is-visible')))
        target = Math.max(0, Math.min(pageCount - 1, (stickyTop - host.getBoundingClientRect().top) / distance))
        current = target; apply()
      } else {
        cancelAnimationFrame(frame); frame = 0; last = 0
        host.style.height = ''; resetGroups()
      }
    }
    jump.current = page => {
      if (!enabled) return
      const top = host.getBoundingClientRect().top + window.scrollY - stickyTop + Math.max(0, Math.min(pageCount - 1, page)) * distance
      window.scrollTo({ top, behavior: 'smooth' })
    }
    resize()
    window.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', resize)
    motion.addEventListener('change', resize)
    return () => {
      cancelAnimationFrame(frame); resetGroups()
      host.classList.remove('is-stacked'); host.style.height = ''; jump.current = () => {}
      window.removeEventListener('scroll', measure); window.removeEventListener('resize', resize); motion.removeEventListener('change', resize)
    }
  }, [itemCount, pageCount, pageSize, resetKey])

    const setBatch = (index) => (node) => { batches.current[index] = node }

  return {
    stage: surface,
    setBatch,
    navigation,
    pageSize,
    pageCount,
    activePage,
    goToPage: (page) => jump.current(page),
  }
}
