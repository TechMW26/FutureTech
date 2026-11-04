import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { DIRECTOR_PROFILES } from '../data/directors'
import avirajCardImage from '../assets/image 35.png'
import shakeelCardImage from '../assets/image 36.png'
import './DirectorsSection.css'

const sectionReveal = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1] },
}

const cardReveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.64, ease: [0.22, 1, 0.36, 1] },
}

const AVIRAJ = DIRECTOR_PROFILES['aviraj-sharma']
const SHAKEEL = DIRECTOR_PROFILES['shakeel-jamadar']

export default function DirectorsSection() {
  return (
    <section className="directors-section">
      <div className="directors-section__inner">
        <motion.div
          className="directors-section__hero"
          {...sectionReveal}
        >
          <div  
            className="directors-section__hero-bg"
            aria-hidden="true"
          >
            OUR
            <br />
            DIRECTOR'S
          </div>

          <div className="directors-section__hero-content">
            <div className="directors-section__hero-line hero-line-1">
              Our
            </div>

            <div className="directors-section__hero-line hero-line-2">
              Visionary
            </div>

            <div className="directors-section__hero-line hero-line-3">
              Directors
            </div>
          </div>
        </motion.div>

        <div className="directors-section__grid">
          {/* Aviraj Sharma — the image is already a complete card design */}
          <motion.div className="directors-card-image" {...cardReveal}>
            <Link to={`/director/${AVIRAJ.slug}`} className="directors-card-image__link">
              <img
                src={avirajCardImage}
                alt="Aviraj Sharma"
                className="directors-card-image__img"
                loading="lazy"
                decoding="async"
              />
            </Link>
          </motion.div>

          {/* Shakeel Jamadar — the image is already a complete card design */}
          <motion.div className="directors-card-image" {...cardReveal}>
            <Link to={`/director/${SHAKEEL.slug}`} className="directors-card-image__link">
              <img
                src={shakeelCardImage}
                alt="Shakeel Jamadar"
                className="directors-card-image__img"
                loading="lazy"
                decoding="async"
              />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
