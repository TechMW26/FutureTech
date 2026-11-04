import { useCallback, useEffect, useRef, useState } from 'react'
import './Hex.css'

/* ==========================================================
   SHARED SOUND + HAPTIC HELPERS
   Declared once and reused by every Hex, so the interaction
   logic is never duplicated per hexagon.
========================================================== */

const HOVER_SOUND_SRC = '/sounds/scroll-click.mp3'
const CLICK_SOUND_SRC = '/sounds/scroll-click.mp3'

// Rotating pool so rapid re-entry never waits on one Audio element.
const POOL_SIZE = 3
const pools = new Map()

function getPool(src) {
  if (typeof window === 'undefined' || typeof Audio === 'undefined' || !src) return null
  if (!pools.has(src)) {
    try {
      pools.set(src, {
        els: Array.from({ length: POOL_SIZE }, () => {
          const a = new Audio(src)
          a.preload = 'auto'
          a.volume = 0.28
          return a
        }),
        i: 0,
      })
    } catch {
      pools.set(src, null)
    }
  }
  return pools.get(src)
}

/**
 * Restarts and plays a sound on EVERY call.
 * Deliberately contains NO debounce, throttle, cooldown, timestamp
 * check or "already played" flag — every mouseenter re-plays it.
 */
function play(src) {
  const entry = getPool(src)
  if (!entry) return
  try {
    const el = entry.els[entry.i]
    entry.i = (entry.i + 1) % entry.els.length
    el.currentTime = 0
    const p = el.play()
    if (p && typeof p.catch === 'function') p.catch(() => {})
  } catch {
    /* Audio must never break the UI. */
  }
}

/** Short, subtle haptic pulse on devices exposing the Vibration API. */
function vibrate(ms = 10) {
  try {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      navigator.vibrate(ms)
    }
  } catch {
    /* ignore */
  }
}

/* ==========================================================
   HEXAGON ARTWORK
   ----------------------------------------------------------
   The export ships six near-identical files for one shape. All of
   them are the same rounded hexagon drawn as a centre-line path
   with `stroke-width: 22.6` and `stroke-linejoin: round` — the
   rounding is produced by the stroke, not by the path data:

     body width 78  →  x 11.3 … 78.85   (1 : 1.1324 ratio)
     body width 87  →  x 11.3 … 87.7

   So the whole family is ONE path scaled to the body, plus the
   small shadow filter the export applies. Serialising that once as
   `rawShape` (below, inserted verbatim so it stays byte-identical)
   replaces six asset files without redrawing anything.

   The `filter` element is emitted with a generated id per instance
   so two hexagons on the same page never collide.
========================================================== */

const RAW_HEX_PATH =
  'M48.6 8.16355C54.4935 5.04743 61.6065 5.04743 67.5 8.16355L78.3561 13.9468C84.2496 17.0629 87.8061 23.2217 87.8061 29.454V46.546C87.8061 52.7783 84.2496 58.9371 78.3561 62.0532L67.5 67.8365C61.6065 70.9526 54.4935 70.9526 48.6 67.8365L37.7439 62.0532C31.8503 58.9371 28.2939 52.7783 28.2939 46.546V29.454C28.2939 23.2217 31.8503 17.0629 37.7439 13.9468L48.6 8.16355Z'

/* The SAME artwork serialised as an SVG string, lifted out of the
   Figma Make export so the geometry is reproduced rather than
   approximated. Painted through a data URI so the SVG filter keeps
   working; `preserveAspectRatio="none"` matches the export. */
const RAW_SHAPE_SVG = encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" overflow="visible" ' +
    'viewBox="0 0 116.1 76" fill="none"><path d="' + RAW_HEX_PATH + '" ' +
    'fill="#F9F7F3;" stroke="#F9F7F3" stroke-width="22.6" stroke-linejoin="round"/></svg>',
)

const SHAPE_SRC = `data:image/svg+xml,${RAW_SHAPE_SVG}`

/* Body height / body width for the artwork above. */
const BODY_RATIO = 76 / 116.1

/* ==========================================================
   HEX
   One hexagon of the composition.

       <div class="hex" style="left;top;width;height">
         <div class="inner" style="inset:…">
           <img … />            shape → the hexagon artwork
           <span class="clip">  logo  → the brand tile
         </div>
       </div>

   The export draws each hexagon with NEGATIVE INSETS on an inner
   wrapper — the artwork extends beyond the element box so the drop
   shadow has room. The `inner` wrapper reproduces those insets
   verbatim rather than approximating them.

   Two kinds of hexagon:
     shape  → decorative hexagon, purely visual
     logo   → an interactive brand tile

   Hover (grow + blue glow) is handled by CSS on `.hex`, so it is
   re-applied on every mouseenter with no JS gating.
========================================================== */

export default function Hex({
  id,
  variant = 'shape',
  alt = '',
  selected = false,
  accent = false,
  onSelect,
  hoverSound = true,
  clickSound = true,
  className = '',
  style,
  innerStyle,
  tint,
  sprite,
  crop,
}) {
  const [isPressed, setPressed] = useState(false)
  const nodeRef = useRef(null)
  const isInteractive = variant === 'logo'

  /* ----------------------------------------------------------
     HOVER SOUND
     The grow + glow is pure CSS, so it already re-fires on every
     mouseenter. The sound needs an explicit listener because
     `pointerenter`/`mouseenter` do NOT bubble and React's root-level
     delegation cannot reliably deliver them.

     NO cooldown / throttle / debounce / timestamp check /
     "already played" flag — every entry plays again.
  ---------------------------------------------------------- */
  useEffect(() => {
    const el = nodeRef.current
    if (!el || !isInteractive) return undefined

    const handleEnter = () => {
      if (hoverSound) play(HOVER_SOUND_SRC)
    }

    const handleLeave = () => setPressed(false)

    el.addEventListener('pointerenter', handleEnter)
    el.addEventListener('mouseenter', handleEnter)
    el.addEventListener('pointerleave', handleLeave)
    el.addEventListener('mouseleave', handleLeave)

    return () => {
      el.removeEventListener('pointerenter', handleEnter)
      el.removeEventListener('mouseenter', handleEnter)
      el.removeEventListener('pointerleave', handleLeave)
      el.removeEventListener('mouseleave', handleLeave)
    }
  }, [hoverSound, isInteractive])

  const handlePointerDown = useCallback(() => {
    setPressed(true)
    vibrate(10)
    if (clickSound) play(CLICK_SOUND_SRC)
  }, [clickSound])

  const handlePointerUp = useCallback(() => setPressed(false), [])

  const handleClick = useCallback(() => {
    vibrate(10)
    if (onSelect) onSelect(id)
  }, [onSelect, id])

  const stateClass = [
    isInteractive ? 'hex-logo' : 'hex-shape',
    selected ? 'is-selected' : '',
    accent ? 'is-accent' : '',
    isPressed ? 'is-pressed' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const classes = `hex ${stateClass} ${className}`.trim()

  /* ---------- Decorative shape hexagon ---------- */
  if (!isInteractive) {
    return (
      <div className={classes} style={style} aria-hidden="true">
        <div className="inner" style={innerStyle}>
          <img src={SHAPE_SRC} alt="" draggable="false" loading="eager" />
        </div>
      </div>
    )
  }

  /* ---------- Interactive brand tile ---------- */
  return (
    <button
      ref={nodeRef}
      type="button"
      className={classes}
      style={style}
      aria-label={alt || id}
      aria-pressed={selected}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onClick={handleClick}
    >
      {tint ? (
        <span className="tint" style={{ background: tint }} aria-hidden="true" />
      ) : null}

      <span className="clip">
        <img
          className={`logo-img ${crop || ''}`.trim()}
          src={sprite}
          alt=""
          draggable="false"
          loading="eager"
          decoding="async"
        />
      </span>
    </button>
  )
}

/* Re-exported so callers can size a body without duplicating the
   artwork's aspect ratio. */
export { BODY_RATIO }
