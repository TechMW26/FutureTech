import { createRoot } from 'react-dom/client';
import { useEffect, useRef, useState } from 'react';
import type { CircularCarouselItem } from './CircularCarousel';
import WorksSequence from './WorksSequence';
import './index.css';
import IntelligenceSection from './IntelligenceSection';
import NewsEvents from './NewsEvents';
import LetsTalk from './LetsTalk';
import SiteHeader from './SiteHeader';
import ConnectionFooter from './ConnectionFooter';
import About from './About';
import { workProjects } from './workProjects';
import { WORKS_SCROLL_SCREENS, TOTAL_SCROLL_SCREENS } from './scrollTimeline';

function App() {
  const [progress, setProgress] = useState(0);
  const [departure, setDeparture] = useState(0);
  const scrollTrack = useRef<HTMLElement>(null);
  const [selected, setSelected] = useState<CircularCarouselItem | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    document.title = 'Our Works — MW Futuretech';
  }, []);
  useEffect(() => {
    if (selected) dialog.current?.showModal();
    else dialog.current?.close();
  }, [selected]);
  useEffect(() => {
    const update = () => {
      const section = scrollTrack.current;
      if (!section) return;
      const distance = window.innerHeight * WORKS_SCROLL_SCREENS;
      const position = -section.getBoundingClientRect().top;
      setProgress(Math.max(0, Math.min(1, position / distance)));
      const leaving = Math.max(0, Math.min(1, (position - distance) / window.innerHeight));
      setDeparture(leaving * leaving * (3 - 2 * leaving) * window.innerHeight);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);
  return (
    <main className="home-screen" id="works">
      <div style={{ opacity: progress > 0.99 ? 0 : 1, pointerEvents: progress > 0.99 ? 'none' : undefined }}><SiteHeader /></div>
      <section ref={scrollTrack} className="carousel-scroll" style={{ height: `${TOTAL_SCROLL_SCREENS * 100}svh` }} id="carousel-scroll" aria-label="Selected works and intelligence">
        <div className="hero">
          <div className="carousel-scene" style={{ transform: `translate3d(0, ${-departure}px, 0)` }}>
            <WorksSequence progress={progress} items={workProjects} onSelect={setSelected} />
          </div>
          <IntelligenceSection scrollTrack={scrollTrack} />
        </div>
      </section>
      <dialog ref={dialog} className="project-dialog" aria-label={selected?.title || 'Project preview'} onClose={() => setSelected(null)} onClick={event => { if (event.target === event.currentTarget) setSelected(null); }}>
        <button className="project-close" onClick={() => setSelected(null)} aria-label="Close project">×</button>
        {selected && <><img src={selected.src} alt={selected.alt} /><h2>{selected.title}</h2></>}
      </dialog>
    </main>
  );
}

const page = window.location.pathname.replace(/\/$/, '');
createRoot(document.getElementById('root')!).render(<>{page === '/lets-talk' ? <LetsTalk /> : page === '/news-events' ? <NewsEvents /> : page === '/about' || page.startsWith('/about/') ? <About /> : <App />}{page !== '/lets-talk' && <ConnectionFooter />}</>);
