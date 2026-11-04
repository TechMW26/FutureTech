export const CONNECTION_FRAME_COUNT = 16
const clamp = (value) => Math.max(0, Math.min(1, value))
const smooth = (value) => { const t = clamp(value); return t * t * t * (t * (t * 6 - 15) + 10) }

export function connectionMotion(progress, reduced = false) {
  const p = clamp(progress)
  const position = reduced ? CONNECTION_FRAME_COUNT - 1 : clamp(p / .78) * (CONNECTION_FRAME_COUNT - 1)
  return {
    first: Math.floor(position), second: Math.min(CONNECTION_FRAME_COUNT - 1, Math.floor(position) + 1),
    blend: position - Math.floor(position),
    invitation: reduced ? 1 : smooth((p - .72) / .25),
  }
}

export function coverFrame(sourceWidth, sourceHeight, width, height) {
  const mobile = width < 700
  const zoneHeight = mobile ? Math.min(height * .55, width / 1.6) : height
  const zoneTop = mobile ? height - zoneHeight - 45 : 0
  // Cover each axis and centre the crop, matching `object-fit: cover` on the
  // poster so the switch to canvas is seamless and the frame fills the stage.
  const scale = Math.max(width / sourceWidth, zoneHeight / sourceHeight)
  return { x: (width - sourceWidth * scale) / 2, y: zoneTop + (zoneHeight - sourceHeight * scale) / 2, width: sourceWidth * scale, height: sourceHeight * scale }
}
