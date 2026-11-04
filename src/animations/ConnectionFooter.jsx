import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { CONNECTION_FRAME_COUNT, connectionMotion, coverFrame } from './ConnectionFooterMotion'
import './ConnectionFooter.css'

/** Cinematic closing footer: a scroll-sequenced film that resolves into an invitation. */
export default function ConnectionFooter({ connectHref = '/lets-talk' }) {
  const track = useRef(null)
  const stage = useRef(null)
  const canvas = useRef(null)
  const invitation = useRef(null)

  useLayoutEffect(() => {
    const host = track.current, panel = stage.current, surface = canvas.current, copy = invitation.current
    const context = surface.getContext('2d', { alpha: false })
    if (!context || !('IntersectionObserver' in window) || !('ResizeObserver' in window)) return
    host.classList.add('is-sequenced')
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frames = [], disposed = false, loading = false, visible = false, failed = false
    let frame = 0, width = panel.clientWidth, height = panel.clientHeight, progress = 0
    let previousPosition = -1
    // The invitation only starts revealing once every frame is decoded, so it can
    // never fade in over a half-loaded sequence.
    let revealed = false
    const paint = () => {
      frame = 0
      if (disposed) return
      const state = connectionMotion(progress, motion.matches || failed)
      const invite = revealed ? state.invitation : 0
      host.style.setProperty('--connection-reveal', String(invite))
      copy.inert = invite < .75
      copy.setAttribute('aria-hidden', String(invite < .75))
      const position = state.first + state.blend
      if (!frames.length || position === previousPosition) return
      previousPosition = position
      const first = frames[state.first], second = frames[state.second]
      const rect = coverFrame(first.width, first.height, width, height)
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      const pixelWidth = Math.round(width * dpr), pixelHeight = Math.round(height * dpr)
      if (surface.width !== pixelWidth || surface.height !== pixelHeight) { surface.width = pixelWidth; surface.height = pixelHeight }
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      context.globalAlpha = 1; context.fillStyle = '#101214'; context.fillRect(0, 0, width, height)
      context.imageSmoothingEnabled = true; context.imageSmoothingQuality = 'high'
      context.drawImage(first, rect.x, rect.y, rect.width, rect.height)
      if (state.blend > .001 && second !== first) { context.globalAlpha = state.blend; context.drawImage(second, rect.x, rect.y, rect.width, rect.height) }
      context.globalAlpha = 1
      host.classList.add('has-frames')
    }
    const wake = () => { if (!frame && !disposed) frame = requestAnimationFrame(paint) }
    const measure = () => {
      const distance = Math.max(1, host.offsetHeight - window.innerHeight)
      progress = Math.max(0, Math.min(1, -host.getBoundingClientRect().top / distance))
      if (visible || motion.matches) wake()
    }
    const resize = () => {
      width = panel.clientWidth; height = panel.clientHeight
      // Keep the sequence and the reveal inside the available travel.
      host.style.height = motion.matches || failed ? `${height}px` : `${height + Math.max(height * .4, window.innerHeight * .6)}px`
      previousPosition = -1; measure(); wake()
    }
    const load = async () => {
      if (loading || disposed) return
      loading = true
      const results = await Promise.allSettled(Array.from({ length: CONNECTION_FRAME_COUNT }, async (_, index) => {
        const response = await fetch(`/images/connection-footer/frame-${String(index).padStart(2, '0')}.jpg`)
        if (!response.ok) throw new Error('Footer frame unavailable')
        return createImageBitmap(await response.blob())
      }))
      const loaded = results.flatMap(result => result.status === 'fulfilled' ? [result.value] : [])
      if (disposed || loaded.length !== CONNECTION_FRAME_COUNT) {
        loaded.forEach(image => image.close())
        if (!disposed) { failed = true; host.classList.remove('is-sequenced'); copy.inert = false; copy.removeAttribute('aria-hidden'); resize() }
        return
      }
      frames = loaded; previousPosition = -1; revealed = true; measure(); wake()
    }
    const preload = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { void load(); preload.disconnect() }
    }, { rootMargin: '1200px 0px' })
    preload.observe(host)
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) { void load(); measure() } })
    observer.observe(host)
    const size = new ResizeObserver(resize); size.observe(panel)
    window.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', resize)
    motion.addEventListener('change', resize)
    resize()
    return () => {
      disposed = true; cancelAnimationFrame(frame); frames.forEach(image => image.close())
      preload.disconnect(); observer.disconnect(); size.disconnect()
      window.removeEventListener('scroll', measure); window.removeEventListener('resize', resize); motion.removeEventListener('change', resize)
    }
  }, [])

  return (
    <footer ref={track} className="connection-footer" aria-label="Connect with MW Futuretech">
      <div ref={stage} className="connection-stage">
        <img className="connection-poster" src="/images/connection-footer/frame-00.jpg" alt="A cinematic black-and-white group of people in suits" loading="lazy" />
        <canvas ref={canvas} className="connection-film" aria-hidden="true" />
        <div className="connection-shade" aria-hidden="true" />
        <div className="connection-top">
          <Link to="/" aria-label="MW Futuretech home"><img src="/futuretech-logo.svg" alt="" /><span>MW Futuretech</span></Link>
        </div>
        <div ref={invitation} className="connection-invitation">
          <p>A LITTLE HELLO. A NEW POSSIBILITY.</p>
          <h2>Good things start<br />with a <em>hello.</em></h2>
          <Link className="connection-link" to={connectHref}><span>Let’s connect</span><span className="connection-arrow" aria-hidden="true">↗</span></Link>
        </div>
        <div className="connection-bottom">
          <span>Human imagination. Future possibilities.</span>
          <Link to={connectHref}>Start a conversation <span aria-hidden="true">↗</span></Link>
        </div>
      </div>
    </footer>
  )
}
