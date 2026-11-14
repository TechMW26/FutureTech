export const WORKS_SCROLL_SCREENS = 12
export const WORKS_HANDOFF_SCREENS = .48
export const INTELLIGENCE_START_SCREEN = WORKS_SCROLL_SCREENS + WORKS_HANDOFF_SCREENS
export const INTELLIGENCE_SCROLL_SCREENS = 12.95
export const TOTAL_SCROLL_SCREENS = INTELLIGENCE_START_SCREEN + INTELLIGENCE_SCROLL_SCREENS + 1

export function worksHandoff(position, viewportHeight) {
  const progress = Math.max(0, Math.min(1, (position / viewportHeight - WORKS_SCROLL_SCREENS) / WORKS_HANDOFF_SCREENS))
  return progress * progress * (3 - 2 * progress)
}
