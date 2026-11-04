import { useEffect, useRef } from 'react';
import SiteHeader from './SiteHeader';
import './About.css';
import DirectorExperience from './DirectorExperience';
import MetalRibbon from './MetalRibbon';
import AboutTeam from './AboutTeam';

const clamp = (n: number) => Math.max(0, Math.min(1, n));

function DirectorPortrait({ shakeel = false }: { shakeel?: boolean }) {
  const track = useRef<HTMLElement>(null);
  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    function draw() {
      frame = 0;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const progress = media.matches ? 0 : clamp(-rect.top / Math.max(1, element.offsetHeight - innerHeight));
      const eased = progress * progress * (3 - 2 * progress);
      element.style.setProperty('--portrait-scale', String(1 + eased * (innerWidth < 700 ? .42 : .85)));
      element.style.setProperty('--side-shift', `${eased * (innerWidth < 700 ? 30 : 140)}px`);
      element.style.setProperty('--side-opacity', String(1 - eased * .8));
      element.style.setProperty('--portrait-radius', `${180 - eased * 155}px`);
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(draw); };
    draw();
    addEventListener('scroll', schedule, { passive: true });
    addEventListener('resize', schedule);
    media.addEventListener('change', schedule);
    return () => { cancelAnimationFrame(frame); removeEventListener('scroll', schedule); removeEventListener('resize', schedule); media.removeEventListener('change', schedule); };
  }, []);
  return <section ref={track} className={`director-story ${shakeel ? 'director-story--card' : ''}`} id={shakeel ? 'shakeel-jamadar' : 'aviraj-sharma'} aria-labelledby="director-name">
    <div className="director-sticky">
      <div className="director-side director-side--left"><span className="about-kicker">THE PEOPLE BEHIND THE VISION</span><h2>People.<br />Purpose.<br /><em>Possibility.</em></h2></div>
      <div className="director-portrait"><img src={shakeel ? '/images/about/shakeel-card.png' : '/images/about/aviraj-sharma.jpeg'} alt={shakeel ? 'Shakeel Jamadar, Director' : 'Aviraj Sharma, Director of MW Futuretech'} width={shakeel ? 884 : 1081} height={shakeel ? 1316 : 1455} loading="lazy" /></div>
      <div className="director-side director-side--right"><span className="about-kicker">DIRECTOR / MW FUTURETECH</span><h3 id="director-name">{shakeel ? <>Shakeel<br />Jamadar</> : <>Aviraj<br />Sharma</>}</h3><p>People, ideas, technology and impact. Building a brighter tomorrow, together.</p><a className="about-text-link" href="/lets-talk">Start a conversation <span>↗</span></a></div>
      <div className="director-signature" aria-hidden="true">{shakeel ? 'SHAKEEL JAMADAR' : 'AVIRAJ SHARMA'}<span>VISIONARY DIRECTOR</span></div>
    </div>
  </section>;
}

export default function About() {
  const root = useRef<HTMLElement>(null);
  const path = window.location.pathname.replace(/\/$/, '');
  const profile = path === '/about/aviraj-sharma' || path === '/about/shakeel-jamadar';
  const shakeel = path.endsWith('shakeel-jamadar');
  useEffect(() => {
    document.title = `${profile ? shakeel ? 'Shakeel Jamadar' : 'Aviraj Sharma' : 'About us'} — MW Futuretech`;
    const elements = root.current?.querySelectorAll<HTMLElement>('[data-about-reveal]');
    if (!elements || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: .12 });
    elements.forEach(element => { element.classList.add('will-reveal'); observer.observe(element); });
    return () => observer.disconnect();
  }, [profile, shakeel]);

  useEffect(() => {
    const host = root.current?.querySelector<HTMLElement>('.about-opening-track');
    const backdrop = root.current?.querySelector<HTMLElement>('.about-continuous');
    if (!host || !backdrop) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    const draw = () => {
      frame = 0;
      const p = reduced.matches ? 0 : clamp(-host.getBoundingClientRect().top / Math.max(1, host.offsetHeight - innerHeight));
      backdrop.style.setProperty('--spread', `${p * 95}px`);
      backdrop.style.setProperty('--orbit-turn', `${p * 12}deg`);
      backdrop.style.setProperty('--orbit-grow', String(1 + p * .16));
      host.style.setProperty('--copy-lift', `${p * -35}px`);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(draw); };
    draw(); addEventListener('scroll', schedule, { passive: true }); addEventListener('resize', schedule); reduced.addEventListener('change', schedule);
    return () => { cancelAnimationFrame(frame); removeEventListener('scroll', schedule); removeEventListener('resize', schedule); reduced.removeEventListener('change', schedule); };
  }, []);

  return <main className="about-page" ref={root}>
    <SiteHeader about />
    {profile ? !shakeel ? <DirectorExperience /> : <><div className="director-back"><a href="/about#directors">← All directors</a><h1>{shakeel ? 'Shakeel Jamadar' : 'Aviraj Sharma'}</h1></div><DirectorPortrait shakeel={shakeel} /></> : <>
      <div className="about-continuous">
        <div className="about-shared-backdrop" aria-hidden="true"><div className="about-orbit-scene"><MetalRibbon /><div className="about-orbit-hairline" /><div className="about-silk about-silk--one" /><div className="about-silk about-silk--two" /></div></div>
      <section className="about-opening-track"><div className="about-opening" aria-labelledby="about-title">
        <div className="about-opening-copy"><p className="about-kicker">MW FUTURETECH / WHO WE ARE</p><h1 id="about-title"><span>Human at heart.</span><span>Future in mind.</span></h1><p className="about-intro">We bring people, design and technology together<br className="desktop-break" /> to turn what’s next into something real.</p><a className="about-round-link" href="#directors" aria-label="Meet the people behind MW Futuretech">↓</a></div>
      </div></section>

      <section className="about-directors" id="directors" aria-label="Our directors">
        <div className="about-director-cards">
          <a href="/about/shakeel-jamadar" data-about-reveal aria-label="Visit Shakeel Jamadar’s director profile"><img src="/images/about/shakeel-card.png" alt="Shakeel Jamadar — Director. People, ideas, technology, impact. Visit page." width="884" height="1316" loading="lazy" /><span className="director-card-caption">Shakeel Jamadar <span>View profile ↗</span></span></a>
          <a href="/about/aviraj-sharma" data-about-reveal aria-label="Visit Aviraj Sharma’s director profile"><img src="/images/about/aviraj-card.png" alt="Aviraj Sharma — Director. People, ideas, technology, impact. Visit page." width="884" height="1316" loading="lazy" /><span className="director-card-caption">Aviraj Sharma <span>View profile ↗</span></span></a>
        </div>
      </section>
      <AboutTeam />
      </div>
    </>}
    <section className="about-outro" data-about-reveal><span className="about-kicker">THE NEXT CHAPTER</span><h2>Let’s shape it.<br /><span>Together.</span></h2><a className="about-text-link" href="/lets-talk">Let’s talk <span>↗</span></a></section>
  </main>;
}
