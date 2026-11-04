import { useEffect, useRef, useState } from 'react'
import NewsJournal from './NewsJournal'
import './NewsEvents.css'

/**
 * Sticky hero where the human/robot handshake plays once, then scrubs on scroll.
 *
 * Smoothness notes:
 * - Scrubbing draws pre-decoded bitmaps (ImageBitmaps), never `getImageData`,
 *   so no frame pays the cost of a GPU→CPU canvas readback.
 * - Scrubbing waits until every frame is decoded, so the first scroll can't
 *   play a partly-loaded sequence.
 * - During playback the clip is drawn straight to the canvas at video frame
 *   rate (no per-frame pixel pass).
 */
export default function NewsEvents() {
  const video = useRef(null)
  const track = useRef(null)
  const canvas = useRef(null)
  const [ready, setReady] = useState(false)
  const [scrubReady, setScrubReady] = useState(false)

  useEffect(() => {
    const media = video.current, surface = canvas.current
    const ctx = surface.getContext('2d', { alpha: true })
    if (!ctx) return
    // The fingertips reach their closest point at this frame in the supplied clip.
    const contactTime = 3.65
    // The supplied frame sequence and the clip itself both end on blank frames,
    // so scrubbing stops on the last frame that still shows the hands.
    const LAST_HANDS_FRAME = '048'
    let phase = 'approach'
    let holdScroll = 0
    let scrollProgress = 0
    let disposed = false
    let scrollFrames = []
    let lastScrollFrame = -1
    let scrubPending = false
    // Decode the departure once; scrolling only draws already decoded bitmaps.
    // The supplied frames already carry an alpha channel with the studio white
    // removed, so no per-frame pixel work is needed at all.
    const prepareFrames = async () => {
      const response = await fetch('/videos/hands-frames/manifest.json')
      const { count } = await response.json()
      const decoded = await Promise.all(Array.from({ length: count }, async (_, index) => {
        const name = String(index).padStart(3, '0')
        if (name > LAST_HANDS_FRAME) return null
        const frame = await fetch('/videos/hands-frames/' + name + '.png')
        return createImageBitmap(await frame.blob())
      }))
      const usable = decoded.filter(Boolean)
      if (disposed) usable.forEach(image => image.close())
      else {
        scrollFrames = usable
        setScrubReady(true)
        // If the reader already scrolled while the frames were decoding, paint now.
        if (scrubPending && lastScrollFrame !== 0) paintScrollFrame(0)
      }
    }
    prepareFrames().catch(() => {})
    const paintScrollFrame = (index) => {
      const image = scrollFrames[index]
      if (!image || index === lastScrollFrame) return
      lastScrollFrame = index
      ctx.clearRect(0, 0, surface.width, surface.height)
      ctx.drawImage(image, 0, 0, surface.width, surface.height)
      setReady(true)
    }
    let frame = 0
    const start = () => {
      media.currentTime = 1.5
      media.play().catch(() => {
        media.currentTime = contactTime
        phase = 'hold'
        holdScroll = window.scrollY
      })
    }
    const updateScroll = () => {
      if (phase === 'approach') return
      const distance = window.scrollY - holdScroll
      if (phase === 'hold' && distance <= 0) return
      phase = 'scroll'
      const available = Math.max(window.innerHeight * .5,
        (track.current?.getBoundingClientRect().bottom ?? window.innerHeight * 2) + window.scrollY - window.innerHeight - holdScroll)
      scrollProgress = Math.max(0, Math.min(1, distance / available))
      scrubPending = true
    }
    media.addEventListener('loadedmetadata', start)
    window.addEventListener('scroll', updateScroll, { passive: true })
    window.addEventListener('resize', updateScroll)
    if (media.readyState >= 1) start()
    let lastTime = -1
    const draw = () => {
      // Never let the clip run into its blank tail, even before the pause lands.
      if (phase === 'approach' && media.currentTime >= contactTime) {
        media.pause()
        media.currentTime = contactTime
        phase = 'hold'
        holdScroll = window.scrollY
      }
      if (phase !== 'approach') {
        if (scrollFrames.length) paintScrollFrame(Math.round(scrollProgress * (scrollFrames.length - 1)))
      } else if (!media.seeking && media.readyState >= 2 && media.currentTime !== lastTime) {
        lastTime = media.currentTime
        ctx.clearRect(0, 0, surface.width, surface.height)
        ctx.drawImage(media, 0, 0, surface.width, surface.height)
        setReady(true)
      }
      frame = requestAnimationFrame(draw)
    }
    frame = requestAnimationFrame(draw)
    return () => {
      disposed = true
      scrollFrames.forEach(image => image.close())
      cancelAnimationFrame(frame)
      media.pause()
      media.removeEventListener('loadedmetadata', start)
      window.removeEventListener('scroll', updateScroll)
      window.removeEventListener('resize', updateScroll)
    }
  }, [])

  return (
    <div className="news-page">
      <div ref={track} className="news-hero-track">
        <section className={`news-hero${ready ? ' is-ready' : ''}${scrubReady ? ' is-scrub-ready' : ''}`} aria-labelledby="news-title">
          <video ref={video} className="news-video" src="/videos/human-robot-hands.mp4" poster="/images/hands-poster.jpg" muted playsInline preload="auto" aria-hidden="true" />
          <div className="news-type">
            <h1 id="news-title">Human ideas.<br /><span>Extraordinary</span><br /><em>connections.</em></h1>
            <p className="news-tagline">The future is a conversation.</p>
          </div>
          <canvas ref={canvas} className="news-hands" width={1280} height={720} aria-hidden="true" />
        </section>
      </div>
      <NewsJournal />
    </div>
  )
}
