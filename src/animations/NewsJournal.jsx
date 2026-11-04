import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { filterJournal, journalStories } from './NewsJournalData'
import './NewsJournal.css'
import useNewsDeck from './useNewsDeck'
import { groupNews } from './NewsDeckMotion'

const FILTERS = ['All', 'News', 'Events']

function StoryCover({ story }) {
  return story.image
    ? <img className="organisation-cover-image" src={story.image} alt={story.imageAlt} loading="lazy" />
    : (
      <div className="organisation-event-cover" role="img" aria-label={story.imageAlt}>
        <div className="organisation-event-brand"><img src="/futuretech-logo.svg" alt="" /><span>MW FUTURETECH</span></div>
        <span className="organisation-event-word">
          {(story.coverTitle || 'OPEN\nHOUSE.').split('\n').map(line => <span key={line}>{line}</span>)}
        </span>
        <div className="organisation-event-bottom">
          <span>DESIGN + TECHNOLOGY</span>
          <span>{story.dateLabel.toUpperCase()}</span>
        </div>
      </div>
    )
}

export default function NewsJournal() {
  const [filter, setFilter] = useState('All')
  const [selected, setSelected] = useState(null)
  const root = useRef(null)
  const dialog = useRef(null)
  const opener = useRef(null)
  const stories = filterJournal(filter)
  const newsDeck = useNewsDeck(stories.length, filter)
  const { stage, setBatch, pageSize } = newsDeck
  const storyGroups = groupNews(stories, pageSize)

  useLayoutEffect(() => {
    const host = root.current
    if (!host || !('IntersectionObserver' in window)) return
    const elements = host.querySelectorAll('[data-news-reveal]')
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (motion.matches) { elements.forEach(element => element.classList.add('is-visible')); return }
    host.classList.add('has-reveal')
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target) }
    }), { threshold: .1 })
    elements.forEach(element => observer.observe(element))
    const reduce = () => { if (motion.matches) { elements.forEach(element => element.classList.add('is-visible')); observer.disconnect() } }
    motion.addEventListener('change', reduce)
    return () => { observer.disconnect(); motion.removeEventListener('change', reduce) }
  }, [filter, pageSize])

  useEffect(() => {
    const modal = dialog.current
    if (!modal) return
    if (selected && !modal.open) modal.showModal()
    else if (!selected && modal.open) modal.close()
    if (selected) modal.scrollTop = 0
  }, [selected])

  const moveGlass = (event) => {
    if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const card = event.currentTarget
    const rect = card.getBoundingClientRect()
    const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width))
    const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height))
    card.style.setProperty('--card-rx', ((.5 - y) * 4).toFixed(2) + 'deg')
    card.style.setProperty('--card-ry', ((x - .5) * 5).toFixed(2) + 'deg')
    card.style.setProperty('--glass-x', (x * 100).toFixed(1) + '%')
    card.style.setProperty('--glass-y', (y * 100).toFixed(1) + '%')
  }
  const resetGlass = (event) => {
    event.currentTarget.style.setProperty('--card-rx', '0deg')
    event.currentTarget.style.setProperty('--card-ry', '0deg')
    event.currentTarget.style.setProperty('--glass-x', '50%')
    event.currentTarget.style.setProperty('--glass-y', '0%')
  }

  const close = () => { dialog.current?.close(); setSelected(null); opener.current?.focus() }

  return (
    <section ref={root} className="organisation-news" id="news-journal" aria-labelledby="organisation-news-title">
      <div className="organisation-news-inner">
        <header className="organisation-news-heading" data-news-reveal>
          <p className="organisation-eyebrow">MW FUTURETECH</p>
          <h2 id="organisation-news-title">
            <span className="organisation-heading-word"><span>News</span></span>{' '}
            <span className="organisation-heading-word"><span>&amp;</span></span>{' '}
            <span className="organisation-heading-word"><span>Events</span></span>
          </h2>
          <p className="organisation-news-intro">The latest updates, milestones and upcoming events<br className="organisation-desktop-break" /> from our organisation.</p>
        </header>
        <div className="organisation-news-filters" role="group" aria-label="Filter organisation news and events" data-news-reveal>
          {FILTERS.map(category => (
            <button key={category} type="button" aria-pressed={filter === category} onClick={() => setFilter(category)}>
              {category === 'All' ? 'All updates' : category}
              <span>{category === 'All' ? journalStories.length : filterJournal(category).length}</span>
            </button>
          ))}
        </div>
        <p className="organisation-result-count" role="status">{stories.length} {stories.length === 1 ? 'update' : 'updates'}</p>
        <div className="organisation-news-deck">
          <div ref={stage} className="organisation-deck-stage">
            {storyGroups.map((group, groupIndex) => (
              <div
                key={filter + '-' + groupIndex}
                ref={setBatch(groupIndex)}
                className="organisation-news-grid organisation-news-batch"
                role="group"
                aria-label={`Updates ${groupIndex * pageSize + 1} to ${Math.min((groupIndex + 1) * pageSize, stories.length)}`}
              >
                {group.map((story, index) => (
                  <article
                    key={story.id}
                    className="organisation-news-card"
                    data-news-reveal
                    onPointerMove={moveGlass}
                    onPointerLeave={resetGlass}
                    style={{ '--news-delay': `${index * 160}ms`, '--news-entry-turn': `${(index - 1) * 4}deg` }}
                  >
                    <div className="organisation-card-surface">
                      <div className="organisation-news-cover">
                        <StoryCover story={story} />
                        <span className={`organisation-news-badge${story.category === 'Events' ? ' is-event' : ''}`}>{story.label}</span>
                      </div>
                      <div className="organisation-news-copy">
                        <time dateTime={story.date}>{story.dateLabel}</time>
                        <h3 id={`organisation-${story.id}`}>{story.title}</h3>
                        <p>{story.summary}</p>
                        <span className="organisation-read-label" aria-hidden="true">
                          {story.category === 'Events' ? 'View event' : 'Read update'}<span>↗</span>
                        </span>
                      </div>
                      <button
                        className="organisation-card-link"
                        aria-labelledby={`organisation-${story.id}`}
                        aria-haspopup="dialog"
                        onClick={event => { opener.current = event.currentTarget; setSelected(story) }}
                      />
                    </div>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <dialog
        ref={dialog}
        className="organisation-news-dialog"
        aria-labelledby="organisation-story-title"
        onClose={() => { setSelected(null); opener.current?.focus() }}
        onClick={event => { if (event.target === event.currentTarget) close() }}
      >
        <button className="organisation-dialog-close" onClick={close} aria-label="Close article">×</button>
        {selected && (
          <>
            <div className="organisation-dialog-cover"><StoryCover story={selected} /></div>
            <div className="organisation-dialog-copy">
              <p className="organisation-dialog-category">{selected.label} · <time dateTime={selected.date}>{selected.dateLabel}</time></p>
              <h2 id="organisation-story-title">{selected.title}</h2>
              {selected.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
              <a href={selected.link}>{selected.action}<span aria-hidden="true">↗</span></a>
              <small>Sample content for MW Futuretech.</small>
            </div>
          </>
        )}
      </dialog>
    </section>
  )
}
