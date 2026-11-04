import Honeycomb from './Honeycomb'
import './WorkHero.css'

/**
 * WorkHero
 * --------
 * The "Our Works" hero, reconstructed from the Figma Make export.
 *
 * The design is a 527 × 319 frame containing the copy (left) and the
 * honeycomb (right). Both are positioned with the export's own
 * coordinates, so the composition is reproduced rather than
 * interpreted.
 *
 * Everything below this section (<OffMenuGallery /> in WorkPage.jsx)
 * is untouched. The hero occupies exactly one viewport, so the next
 * section begins after it and appears only on scroll.
 */

export default function WorkHero() {
  return (
    <section className="works-hero" aria-label="Our works">
      <div className="works-frame">
        {/* ============================================================
            LEFT — copy
            Export: title (27, 78) 231 × 175 · desc (34, 202) 205 × 67
                    button (34, 233) 88 × 20
        ============================================================ */}
        <h1 className="works-title">
          <span>Our</span>
          <span>Works</span>
        </h1>

        <p className="works-desc">
          A growing ecosystem of companies, products and initiatives
          focused on healthier people, cleaner environments and a
          better tomorrow.
        </p>

        <a className="works-btn" href="#selected-work">
          <span className="works-btn-bg" aria-hidden="true" />
          <span className="works-btn-label">Explore our work</span>
          <span className="works-btn-arrow" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
              <path
                d="M4 12h15M13 6l6 6-6 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </a>

        {/* ============================================================
            RIGHT — honeycomb ecosystem (own component)
        ============================================================ */}
        <div className="works-visual">
          <Honeycomb />
        </div>
      </div>
    </section>
  )
}
