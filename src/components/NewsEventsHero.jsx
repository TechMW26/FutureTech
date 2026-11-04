import card1 from '../assets/1.png'
import card2 from '../assets/2.png'
import card3 from '../assets/3.png'
import card4 from '../assets/4.png'
import card5 from '../assets/5.png'
import orbImg from '../assets/orb mw.png'
import standImg from '../assets/stand.png'
import domeImg from '../assets/Component 5.png'
import './NewsEventsHero.css'

/**
 * Five floating news/event cards plus the central MW orb + stand.
 * All artwork is supplied as pre-rendered PNGs — nothing here is
 * recreated with CSS, SVG or canvas. The cards are positioned inside
 * a fixed 1600x960 design canvas (see NewsEventsHero.css) so the
 * composition matches the reference exactly, then scaled as a whole
 * for narrower viewports.
 */
const CARDS = [
  { id: 1, src: card1, alt: 'MW Futuretech showcases next-gen AI solutions at Expo 2025' },
  { id: 2, src: card2, alt: 'MW Futuretech hosts Global Innovation Summit 2025' },
  { id: 3, src: card3, alt: 'Global tech leaders discuss a sustainable future at Summit' },
  // Reference order: event banner sits at middle-right, product launch below it.
  { id: 4, src: card5, alt: 'Future Tech Summit 2025 event' },
  { id: 5, src: card4, alt: 'MW Futuretech unveils a breakthrough AI platform' },
]

export default function NewsEventsHero() {
  return (
    <section className="news-events-hero">
      <div className="news-events-hero__visual">
        <div className="news-events-hero__stage">
          {CARDS.map((card) => (
            <img
              key={card.id}
              src={card.src}
              alt={card.alt}
              className={`news-events-hero__card news-events-hero__card--${card.id}`}
              draggable="false"
              loading="eager"
              decoding="async"
            />
          ))}

          <img
            src={standImg}
            alt=""
            aria-hidden="true"
            className="news-events-hero__stand"
            draggable="false"
            loading="eager"
            decoding="async"
          />
          <img
            src={orbImg}
            alt="MW Futuretech emblem"
            className="news-events-hero__orb"
            draggable="false"
            loading="eager"
            decoding="async"
          />

          {/* Foreground dome — covers the lower portion of the stand and
              carries the "News & Events" heading baked into the artwork. */}
          <img
            src={domeImg}
            alt=""
            aria-hidden="true"
            className="news-events-hero__dome"
            draggable="false"
            loading="eager"
            decoding="async"
          />
        </div>
      </div>

      {/* Visually hidden: the heading text lives in the dome artwork above,
          but screen readers still need it as real, searchable content. */}
      <h1 className="news-events-hero__sr-title">News &amp; Events</h1>
      <p className="news-events-hero__sr-subtitle">
        Stay informed with the latest from MW Futuretech — insights,
        announcements, and industry events.
      </p>
    </section>
  )
}
