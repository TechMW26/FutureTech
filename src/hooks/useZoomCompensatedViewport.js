import { useEffect, useState } from 'react'

/**
 * Desktop zoom compensation only applies to real desktop viewports. Phones and
 * tablets report a physical `outerWidth` unrelated to the CSS viewport, and
 * compensating for it collapsed the root font size (~6px) and pushed every
 * component onto its desktop layout. Below this width the viewport is used
 * verbatim.
 */
export const COMPENSATION_MIN_VIEWPORT_WIDTH = 1024

export function shouldCompensateForZoom() {
  if (typeof window === 'undefined') return false
  if (window.innerWidth <= COMPENSATION_MIN_VIEWPORT_WIDTH) return false
  if (window.matchMedia?.('(pointer: coarse)').matches) return false
  return true
}

function getViewportSnapshot() {
  if (typeof window === 'undefined') {
    return { width: 0, height: 0, zoomFactor: 1 }
  }

  const visualViewportScale = window.visualViewport?.scale
  let zoomFactor = 1

  if (
    visualViewportScale &&
    Number.isFinite(visualViewportScale) &&
    visualViewportScale > 0 &&
    visualViewportScale !== 1
  ) {
    zoomFactor = visualViewportScale
  } else {
    const outerWidth = window.outerWidth
    const innerWidth = window.innerWidth
    const ratio = outerWidth && innerWidth ? outerWidth / innerWidth : 1

    // `outerWidth` reports the physical window size, which on phones and
    // tablets is completely unrelated to the CSS viewport (a 1920-wide window
    // rendering a 390px page). Treating that as browser zoom shrank the root
    // font to ~6px on mobile, so the ratio heuristic is only trusted on
    // genuine desktop viewports.
    const isSmallViewport =
      innerWidth <= COMPENSATION_MIN_VIEWPORT_WIDTH ||
      (window.matchMedia?.('(pointer: coarse)').matches ?? false)

    if (!isSmallViewport && Number.isFinite(ratio) && ratio > 0 && !(ratio > 0.9 && ratio < 1.1)) {
      zoomFactor = ratio
    }
  }

  return {
    width: Math.round(window.innerWidth * zoomFactor),
    height: Math.round(window.innerHeight * zoomFactor),
    zoomFactor,
  }
}

export function getBrowserZoomFactor() {
  return getViewportSnapshot().zoomFactor
}

export function getZoomCompensatedViewportWidth() {
  return getViewportSnapshot().width
}

export function getZoomCompensatedViewportHeight() {
  return getViewportSnapshot().height
}

export function useZoomCompensatedViewport() {
  const [viewport, setViewport] = useState(getViewportSnapshot)

  useEffect(() => {
    const updateViewport = () => {
      setViewport(getViewportSnapshot())
    }

    const visualViewport = window.visualViewport

    updateViewport()

    window.addEventListener('resize', updateViewport)
    window.addEventListener('orientationchange', updateViewport)
    visualViewport?.addEventListener('resize', updateViewport)

    return () => {
      window.removeEventListener('resize', updateViewport)
      window.removeEventListener('orientationchange', updateViewport)
      visualViewport?.removeEventListener('resize', updateViewport)
    }
  }, [])

  return viewport
}

export function useCompensatedMinWidth(minWidth) {
  const { width } = useZoomCompensatedViewport()
  return width >= minWidth
}
