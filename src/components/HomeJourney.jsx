import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { workProjects } from '../animations/workProjects'
import Globe from './Globe'
import './HomeJourney.css'

const TICK_COUNT = 92
const TICK_LENGTH = 22
const LONG_TICK_LENGTH = 32
const RAIL_VIEWBOX_WIDTH = 1200
const RAIL_VIEWBOX_HEIGHT = 220
const JOURNEY_ARC_STEP = 0.235
const RAIL_PATH_SAMPLES = 96
const GLOBE_SCROLL_ROTATION = Math.PI * 3.1

const clampProgress = (value) => Math.min(Math.max(value, 0), 1)

const smoothProgress = (value) => {
  const clampedValue = clampProgress(value)

  return clampedValue * clampedValue * (3 - 2 * clampedValue)
}

const getRailPoint = (ratio) => {
  const clampedRatio = clampProgress(ratio)
  const coordinateX = -80 + clampedRatio * 1360
  const coordinateY = 184 - Math.sin(Math.PI * clampedRatio) * 92

  return { coordinateX, coordinateY }
}

const railPathPoints = Array.from({ length: RAIL_PATH_SAMPLES + 1 }, (unusedValue, index) => {
  void unusedValue
  const ratio = index / RAIL_PATH_SAMPLES
  return getRailPoint(ratio)
})

const RAIL_PATH_D = railPathPoints
  .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.coordinateX.toFixed(2)} ${point.coordinateY.toFixed(2)}`)
  .join(' ')

const getRailTangent = (ratio) => {
  const clampedRatio = clampProgress(ratio)
  const tangentX = 1360
  const tangentY = -Math.cos(Math.PI * clampedRatio) * Math.PI * 92
  const length = Math.hypot(tangentX, tangentY)

  return { tangentX, tangentY, length }
}

const getRailAngle = (ratio) => {
  const { tangentX, tangentY } = getRailTangent(ratio)

  return (Math.atan2(tangentY, tangentX) * 180) / Math.PI
}

const getRailUpperNormal = (ratio) => {
  const { tangentX, tangentY, length } = getRailTangent(ratio)

  return {
    normalX: tangentY / length,
    normalY: -tangentX / length,
  }
}

const getJourneyTextPoint = (ratio) => {
  const clampedRatio = clampProgress(ratio)
  const coordinateX = -80 + ratio * 1360
  const endpointDrop = ratio < 0 ? Math.abs(ratio) * 96 : Math.max(ratio - 1, 0) * 96
  const coordinateY = 184 - Math.sin(Math.PI * clampedRatio) * 92 + endpointDrop

  return { coordinateX, coordinateY }
}

const railTicks = Array.from({ length: TICK_COUNT }, (unusedValue, index) => {
  void unusedValue
  const ratio = index / (TICK_COUNT - 1)
  const { coordinateX, coordinateY } = getRailPoint(ratio)
  const { normalX, normalY } = getRailUpperNormal(ratio)
  const tickLength = index % 5 === 0 ? LONG_TICK_LENGTH : TICK_LENGTH

  return {
    coordinateX,
    coordinateY,
    tickEndX: coordinateX + normalX * tickLength,
    tickEndY: coordinateY + normalY * tickLength,
  }
})

function useSectionProgress(sectionRef) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let animationFrame = 0

    const updateProgress = () => {
      const section = sectionRef.current
      if (!section) return

      const { top, height } = section.getBoundingClientRect()
      const scrollRange = Math.max(height - window.innerHeight, 1)
      setProgress(clampProgress(-top / scrollRange))
    }

    const scheduleUpdate = () => {
      if (animationFrame) return
      animationFrame = window.requestAnimationFrame(() => {
        animationFrame = 0
        updateProgress()
      })
    }

    updateProgress()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)

    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
    }
  }, [sectionRef])

  return progress
}

export default function HomeJourney() {
  const sectionRef = useRef(null)
  const progress = useSectionProgress(sectionRef)
  const lastProjectIndex = workProjects.length - 1
  const trackPosition = progress * lastProjectIndex
  const activeIndex = Math.round(trackPosition)
  const beadPoint = getRailPoint(progress)
  const finalCardStartProgress = 1 - 0.5 / Math.max(lastProjectIndex, 1)
  const bottomFadeOpacity = smoothProgress(
    (progress - finalCardStartProgress) / (1 - finalCardStartProgress),
  )
  const globePhi = progress * GLOBE_SCROLL_ROTATION - 2.2

  return (
    <section
      ref={sectionRef}
      className="home-journey"
      aria-labelledby="home-journey-title"
      style={{ '--journey-bottom-fade-opacity': bottomFadeOpacity }}
    >
      <div className="home-journey__sticky">
        <div className="home-journey__header">
          <p className="home-journey__eyebrow">Selected projects</p>
          <h2 id="home-journey-title" className="home-journey__title"><span>Our journey</span> so far</h2>
        </div>

        <div className="home-journey__stage">
          <div className="home-journey__globe" aria-hidden="true">
            <Globe phi={globePhi} />
          </div>
          <svg className="home-journey__rail" viewBox="0 0 1200 220" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            <path className="home-journey__rail-path home-journey__rail-path--ghost" d={RAIL_PATH_D} />
            <path className="home-journey__rail-path" d={RAIL_PATH_D} />
            <g className="home-journey__rail-ticks">
              {railTicks.map((tick, index) => (
                <line
                  key={index}
                  x1={tick.coordinateX}
                  y1={tick.coordinateY}
                  x2={tick.tickEndX}
                  y2={tick.tickEndY}
                />
              ))}
            </g>
            <g className="home-journey__rail-checkpoints">
              {workProjects.map((project, index) => {
                const ratio = index / Math.max(lastProjectIndex, 1)
                const point = getRailPoint(ratio)
                const isActive = index === activeIndex

                return (
                  <circle
                    key={project.id}
                    className={`home-journey__rail-checkpoint${isActive ? ' is-active' : ''}`}
                    cx={point.coordinateX}
                    cy={point.coordinateY}
                    r={isActive ? 7 : 5}
                  />
                )
              })}
            </g>
            <g
              className="home-journey__rail-bead"
              style={{
                transform: `translate(${beadPoint.coordinateX}px, ${beadPoint.coordinateY}px) rotate(${getRailAngle(progress)}deg)`,
              }}
            >
              <image
                href="/images/satellite-bead.webp"
                x="-22"
                y="-22"
                width="44"
                height="44"
                preserveAspectRatio="xMidYMid meet"
              />
            </g>
          </svg>

          <div className="home-journey__cards" role="list" aria-label="MW Futuretech projects">
            {workProjects.map((project, index) => {
              const offset = index - trackPosition
              const distance = Math.abs(offset)
              const isActive = index === activeIndex
              const arcPoint = getJourneyTextPoint(0.5 + offset * JOURNEY_ARC_STEP)
              const scale = Math.max(0.64, 1 - distance * 0.13)
              const opacity = Math.max(0.16, 1 - distance * 0.44)

              return (
                <article
                  key={project.id}
                  role="listitem"
                  className={`home-journey__card${isActive ? ' is-active' : ''}`}
                  aria-label={project.title}
                  aria-current={isActive ? 'step' : undefined}
                  style={{
                    left: `${(arcPoint.coordinateX / RAIL_VIEWBOX_WIDTH) * 100}%`,
                    top: `${(arcPoint.coordinateY / RAIL_VIEWBOX_HEIGHT) * 100}%`,
                    zIndex: Math.round(20 - distance * 4),
                    opacity,
                    transform: `translate3d(-50%, calc(-100% - var(--journey-text-lift)), 0) scale(${scale})`,
                  }}
                >
                  <img className="home-journey__image" src={project.src} alt="" loading="lazy" decoding="async" />
                  <span className="home-journey__kicker">{project.category.split(' · ')[0]}</span>
                  <strong>
                    <Link className="home-journey__link" to={project.path} tabIndex={isActive ? undefined : -1}>
                      {project.title}
                    </Link>
                  </strong>
                  <span className="home-journey__body">{project.summary}</span>
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
