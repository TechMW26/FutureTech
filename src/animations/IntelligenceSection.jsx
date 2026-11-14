import { useEffect, useRef } from 'react';
import './IntelligenceSection.css';
import { INTELLIGENCE_START_SCREEN, INTELLIGENCE_SCROLL_SCREENS, worksHandoff } from './scrollTimeline';

const technologies = [
  ['React', 'react', '#53c8e9'], ['Python', 'python', '#3979ae'],
  ['TypeScript', 'typescript', '#3178c6'], ['Figma', 'figma', '#ed6256'],
  ['Node.js', 'nodedotjs', '#68a34f'], ['Docker', 'docker', '#2496ed'],
  ['Next.js', 'nextdotjs', '#182c38'], ['GitHub', 'github', '#263342'],
  ['Blender', 'blender', '#e78729'], ['PostgreSQL', 'postgresql', '#4169a1'],
  ['TensorFlow', 'tensorflow', '#f79a40'], ['VS Code', 'vscodium', '#328fca'],
  ['JavaScript', 'javascript', '#dcc32e'], ['Git', 'git', '#ee674b'],
  ['HTML5', 'html5', '#e76d42'], ['CSS', 'css', '#7559be'],
  ['Redis', 'redis', '#dc4b46'], ['Go', 'go', '#21b4ca'],
  ['Rust', 'rust', '#845743'], ['Linux', 'linux', '#253543'],
  ['Vercel', 'vercel', '#263342'], ['Supabase', 'supabase', '#3eb983'],
];
const bubbleLayout = [
  { tech: 0, x: .16, y: .84, size: 132 },
  { tech: 1, x: .85, y: .84, size: 140 },
  { tech: 3, x: .10, y: .61, size: 122 },
  { tech: 5, x: .91, y: .61, size: 128 },
  { tech: 8, x: .18, y: .38, size: 136 },
  { tech: 7, x: .82, y: .38, size: 124 },
  { tech: 2, x: .12, y: .15, size: 118 },
  { tech: 21, x: .88, y: .15, size: 130 },
];
const bubbles = bubbleLayout.map((slot, i) => {
  const tech = technologies[slot.tech];
  return { name: tech[0], icon: tech[1], color: tech[2],
    x: slot.x, y: slot.y, size: slot.size, phase: i * 1.78 };
});
const applications = [
  { title: 'Spatial Planning', text: 'Accelerating blue sky design by surfacing power, zoning, regulation, and community sentiment in minutes.' },
  { title: 'Entrepreneurship', text: 'Guiding founders from first hunch to first customers with a persistent thinking partner that remembers their venture and challenges their assumptions.' },
  { title: 'Fashion Design', text: 'Empowering creative exploration by surfacing real-time costs, material constraints, and production considerations within real-time visual design.' },
  { title: 'Ethics', text: 'Ensuring responsible innovation by integrating real-time compliance checks and respecting intellectual property rights throughout the commercial design process.' },
  { title: 'Art', text: 'Expanding creative possibilities by integrating real-time stylistic insights, usage rights clarity, and contextual guidance directly into generative workflows.' },
];
const clamp = (v) => Math.max(0, Math.min(1, v));
const range = (v, a, b) => clamp((v - a) / (b - a));
const smooth = (v) => v * v * (3 - 2 * v);
const windowOpacity = (p, a, b, c, d) => range(p, a, b) * (1 - range(p, c, d));
const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
function logoScale(p) {
  const t = range(p, .035, .195);
  const ease = t * t * t * (t * (t * 6 - 15) + 10);
  return Math.exp(Math.log(20) * ease);
}

function RevealLine({ text }) {
  return <span className="sequence-line">{text.trim().split(/\s+/).map((word, i) => <span className="sequence-word" key={i}>{word}{' '}</span>)}</span>;
}

export function Logo({ className = '' }) {
  return <div className={`sequence-logo ${className}`} aria-hidden="true">
    {Array.from({ length: 33 }, (_, i) => <i key={i} className="logo-slice" style={{ '--z': `${(i - 16) * .375}px` } } />)}
    <i className="logo-front" /><i className="logo-back" />
  </div>;
}

export default function IntelligenceSection({ scrollTrack }) {
  const section = useRef(null);
  const panel = useRef(null);
  const bubbleRefs = useRef([]);
  const pointer = useRef({ x: -1000, y: -1000, active: false });
  const bodies = useRef(bubbles.map(() => ({ x: 0, y: 0, vx: 0, vy: 0, radius: 35 })));
  const kick = (i) => { bodies.current[i].vy = -280; bodies.current[i].vx += (i % 2 ? 1 : -1) * 90; };

  useEffect(() => {
    const host = section.current;
    const surface = panel.current;
    if (!host || !surface) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reduced = motion.matches;
    let visible = false;
    let frame = 0;
    let last = 0;
    let progress = 0;
    let target = 0;
    const released = new Set();
    let width = 0, height = 0;
    const appElements = Array.from(surface.querySelectorAll('.sequence-applications article'));
    const introLines = Array.from(surface.querySelectorAll('.intelligence-intro .sequence-line'));
    const statementLines = Array.from(surface.querySelectorAll('.intelligence-statement .sequence-line'));
    const revealLine = (line, amount) => {
      const words = Array.from(line.querySelectorAll('.sequence-word'));
      line.style.opacity = '1';
      line.style.transform = 'none';
      line.style.clipPath = 'none';
      words.forEach((word, i) => {
        const fill = smooth(range(amount, i / Math.max(1, words.length), (i + 1.7) / Math.max(1, words.length)));
        word.style.opacity = String(.035 + fill * .965);
        word.style.filter = `blur(${(1 - fill) * 1.2}px)`;
        word.style.transform = `translateY(${(1 - fill) * 3}px)`;
      });
    };
    const measure = () => {
      const track = scrollTrack?.current;
      if (!track) return;
      width = surface.clientWidth; height = surface.clientHeight;
      if (!height) return;
      const position = -track.getBoundingClientRect().top;
      const entrance = worksHandoff(position, height);
      host.style.setProperty('--scene-opacity', String(1 - (1 - entrance) ** 2));
      host.style.visibility = entrance > 0 ? 'visible' : 'hidden';
      host.style.pointerEvents = entrance > .99 ? 'auto' : 'none';
      host.inert = entrance <= .99;
      // Give the opening rotation and zoom twice the scroll distance, preserving the reading pace.
      const scroll = clamp((position / height - INTELLIGENCE_START_SCREEN) / INTELLIGENCE_SCROLL_SCREENS) * 1.295;
      const sequence = scroll <= .45 ? scroll / 2 : scroll - .225;
      target = sequence <= .49 ? sequence : sequence <= .635
        ? .49 + (sequence - .49) * (.075 / .145)
        : sequence - .07;
    };
    const animate = (now) => {
      frame = 0;
      if (!visible) return;
      const dt = Math.min(.032, (now - (last || now - 16)) / 1000);
      last = now;
      progress = reduced ? target : progress + (target - progress) * (1 - Math.exp(-dt * 14));
      const p = progress;
      const s = surface.style;
      const gutter = smooth(range(p, .15, .225)) * (window.innerWidth < 760 ? 10 : 20);
      s.setProperty('--panel-gutter', `${gutter}px`);
      s.setProperty('--panel-radius', `${smooth(range(p, .15, .225)) * Math.min(100, Math.max(38, width * .052))}px`);
      s.setProperty('--logo-reveal', '1');
      s.setProperty('--logo-rise', `${(1 - smooth(range(p, 0, .02))) * 24}px`);
      width = surface.clientWidth;
      height = surface.clientHeight;
      const opening = 1 - smooth(range(p, .18, .225));
      const panelIn = smooth(range(p, .115, .205));
      const atmosphere = smooth(range(p, .29, .4));
      const warm = smooth(range(p, .61, .815));
      const dark = smooth(range(p, .5, .57));
      const top = mix(mix([137, 181, 206], [139, 151, 199], atmosphere), [15, 79, 106], dark);
      const bottom = mix(mix([137, 181, 206], [139, 151, 199], atmosphere), [228, 172, 117], warm);
      s.setProperty('--sky', `rgb(${top.join(',')})`);
      s.setProperty('--sand', `rgb(${bottom.join(',')})`);
      s.setProperty('--panel-in', String(panelIn));
      s.setProperty('--opening-opacity', String(opening));
      const scale = logoScale(p);
      const baseSize = window.innerWidth <= 760 ? 145 : Math.min(205, Math.max(120, window.innerWidth * .12));
      s.setProperty('--logo-scale', String(scale));
      // Repaint the vector at its displayed size instead of magnifying a cached mask texture.
      s.setProperty('--logo-size', `${baseSize * scale}px`);
      s.setProperty('--logo-depth-scale', String(scale));
      s.setProperty('--logo-perspective', `${2400 * scale}px`);
      const facing = smooth(range(p, 0, .035));
      s.setProperty('--logo-turn', `${146 * (1 - facing) + 360 * facing}deg`);
      s.setProperty('--logo-tilt', `${12 * (1 - facing)}deg`);
      s.setProperty('--logo-roll', `${-8 * (1 - facing)}deg`);
      // These surfaces are fully occluded when front-facing; skip their oversized raster textures.
      s.setProperty('--logo-sides', facing >= .99999 ? 'hidden' : 'visible');
      s.setProperty('--ring-opacity', String(windowOpacity(p, .17, .22, .32, .37)));
      s.setProperty('--ring-scale', String(1 + smooth(range(p, .25, .35)) * .25));
      s.setProperty('--intro-opacity', String(windowOpacity(p, .215, .235, .32, .37)));
      s.setProperty('--intro-y', `${-range(p, .29, .38) * 20}px`);
      s.setProperty('--statement-opacity', String(windowOpacity(p, .365, .41, .455, .48)));
      introLines.forEach((line, i) => {
        revealLine(line, range(p, .218 + i * .022, .248 + i * .022) * 1.15);
      });
      statementLines.forEach((line, i) => {
        revealLine(line, range(p, .37 + i * .03, .407 + i * .03) * 1.15);
      });
      s.setProperty('--badge-opacity', String(windowOpacity(p, .48, .492, .845, .87)));
      // Gentle acceleration and deceleration over the extended enlargement interval.
      const grow = range(p, .49, .565);
      const swell = grow * grow * grow * (grow * (grow * 6 - 15) + 10);
      const settle = smooth(range(p, .565, .573));
      s.setProperty('--badge-scale', String(1 + swell * 2 - settle * 2));
      // Dock before any application text enters and hold this position throughout the reading passage.
      s.setProperty('--badge-y', `${-smooth(range(p, .575, .602)) * height * .36}px`);
      s.setProperty('--applications-opacity', String(windowOpacity(p, .605, .62, .825, .855)));
      appElements.forEach((article, i) => {
        const travel = range(p, .622, .842) * 4.9;
        const distance = i - travel;
        const y = .52 + distance * .46;
        const opacity = y < -.12 || y > 1.12 ? 0 : .14 + .86 * (1 - smooth(clamp(Math.abs(distance))));
        article.style.opacity = String(opacity);
        article.style.visibility = opacity > .001 ? 'visible' : 'hidden';
        article.style.transform = `translate(-50%, calc(-50% + ${(y - .51) * height}px))`;
        article.inert = opacity < .8;
        article.querySelectorAll('.sequence-line').forEach((line, j) => {
          const start = .597 + i * (.22 / 4.9) + j * .006;
          revealLine(line, range(p, start, start + .007) * 1.15);
        });
      });
      const bubbleOpacity = p >= .86 ? 1 : p >= .35 ? 1 - smooth(range(p, .465, .48)) : 0;
      s.setProperty('--bubble-opacity', String(bubbleOpacity));
      s.setProperty('--progress', String(p));
      s.setProperty('--cursor-opacity', String(p > .86 && pointer.current.active ? 1 : 0));
      s.setProperty('--cursor-x', `${pointer.current.x}px`);
      s.setProperty('--cursor-y', `${pointer.current.y}px`);
      const falling = p > .86;
      if (!falling) released.clear();
      const sizeScale = Math.min(1, width / 1250, height / 800);
      const bodiesNow = bodies.current;
      bubbles.forEach((bubble, i) => {
        const body = bodiesNow[i];
        const size = Math.max(52, bubble.size * sizeScale);
        body.radius = size / 2;
        if (!falling) {
          const flow = smooth(range(p, .525, .58));
          // Keep the reading column empty. Only the later playground fills the panel.
          const side = i % 2 ? 1 : -1;
          const edgeX = side < 0 ? .075 : .925;
          const x = width < 700 ? (side < 0 ? .10 : .90) : bubble.x;
          const y = bubble.y;
          const entry = range(p, .355 + i * .0048, .425 + i * .0048);
          const descent = smooth(entry);
          const startY = -size * (1.5 + (i % 3) * .8);
          body.x = width * (x + (edgeX - x) * flow) + (reduced ? 0 : Math.sin(now / 4000 + bubble.phase) * 4);
          body.y = startY + (height * y - startY) * descent + flow * height * 1.4;
          // Each side enters as an evenly spaced cascade; following bubbles cannot stack on the preceding one.
          if (i >= 2) {
            const preceding = bodiesNow[i - 2];
            const gap = Math.max(20, width * .022);
            body.y = Math.min(body.y, preceding.y - preceding.radius - body.radius - gap);
          }
          // During the reading passage only a few bubbles drift down the outer edges.
          if (p > .585) {
            const pass = range(p, .586 + i * .031, .67 + i * .031);
            body.x = width * edgeX;
            body.y = i < 6 ? -size * 2 + pass * (height + size * 4) : -size * 4;
          }
          body.vx = Math.sin(bubble.phase) * 18;
          body.vy = 30;
        } else {
          const releaseAt = .86 + i * .003;
          if (p < releaseAt) {
            body.x = width * (.09 + i / (bubbles.length - 1) * .82);
            body.y = -size * (2 + i % 3);
            return;
          }
          if (!released.has(i)) {
            body.x = width * (.09 + i / (bubbles.length - 1) * .82);
            body.y = -size * (1.5 + i % 3);
            body.vx = Math.sin(bubble.phase) * 22;
            body.vy = 24;
            released.add(i);
          }
          body.vy += 170 * dt;
          body.vx *= Math.pow(.985, dt * 60);
          if (pointer.current.active) {
            const dx = body.x - pointer.current.x, dy = body.y - pointer.current.y;
            const distance = Math.hypot(dx, dy);
            if (distance < body.radius + 80 && distance > 0) {
              const strength = (1 - distance / (body.radius + 80)) * 2100 * dt;
              body.vx += dx / distance * strength;
              body.vy += dy / distance * strength - 18;
            }
          }
          body.x += body.vx * dt; body.y += body.vy * dt;
          if (body.x < body.radius) { body.x = body.radius; body.vx = Math.abs(body.vx) * .78; }
          if (body.x > width - body.radius) { body.x = width - body.radius; body.vx = -Math.abs(body.vx) * .78; }
          if (body.y > height - body.radius - 5) { body.y = height - body.radius - 5; body.vy = -Math.abs(body.vy) * .24; if (Math.abs(body.vy) < 18) body.vy = 0; }
        }
      });
      if (falling) {
        for (let repeat = 0; repeat < 3; repeat++) {
          for (let i = 0; i < bodiesNow.length; i++) for (let j = i + 1; j < bodiesNow.length; j++) {
            const a = bodiesNow[i], b = bodiesNow[j];
            if (!released.has(i) || !released.has(j) || a.y < 0 || b.y < 0) continue;
            const dx = b.x - a.x, dy = b.y - a.y;
            const distance = Math.hypot(dx, dy), min = a.radius + b.radius + 14;
            if (distance >= min || distance < .01) continue;
            const nx = dx / distance, ny = dy / distance, overlap = (min - distance) / 2;
            a.x -= nx * overlap; a.y -= ny * overlap; b.x += nx * overlap; b.y += ny * overlap;
            const velocity = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
            if (velocity < 0) { const impulse = -velocity * .78; a.vx -= impulse * nx; a.vy -= impulse * ny; b.vx += impulse * nx; b.vy += impulse * ny; }
          }
        }
      }
      bubbles.forEach((bubble, i) => {
        const el = bubbleRefs.current[i], b = bodiesNow[i];
        if (!el) return;
        if (falling) {
          b.x = Math.max(b.radius, Math.min(width - b.radius, b.x));
          b.y = Math.min(height - b.radius - 5, b.y);
        }
        const size = b.radius * 2;
        el.style.width = `${size}px`; el.style.height = `${size}px`;
        el.style.transform = `translate3d(${b.x - b.radius}px,${b.y - b.radius}px,0) rotate(${falling ? b.vx * .025 : Math.sin(now / 3000 + bubble.phase) * 6}deg)`;
        const visibleOpacity = b.y + b.radius > 0 && b.y - b.radius < height ? bubbleOpacity : 0;
        el.style.opacity = String(visibleOpacity);
        el.style.visibility = visibleOpacity > .001 ? 'visible' : 'hidden';
        el.disabled = !falling || visibleOpacity < .8;
      });
      frame = requestAnimationFrame(animate);
    };
    const start = () => { if (!frame && visible) { last = 0; frame = requestAnimationFrame(animate); } };
    const onScroll = () => { measure(); start(); };
    const onMotion = () => { reduced = motion.matches; host.classList.toggle('sequence-reduced', reduced); start(); };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) { measure(); start(); } }, { rootMargin: '100px' });
    observer.observe(host);
    onMotion(); measure(); progress = target;
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    motion.addEventListener('change', onMotion);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); motion.removeEventListener('change', onMotion); };
  }, [scrollTrack]);

  return <section ref={section} className="intelligence-scroll" id="intelligence" aria-label="Intelligence, applications and technology">
    <div className="intelligence-sticky">
      <div ref={panel} className="intelligence-panel" onPointerMove={event => {
        const rect = event.currentTarget.getBoundingClientRect();
        pointer.current = { x: event.clientX - rect.left, y: event.clientY - rect.top, active: true };
      }} onPointerLeave={() => { pointer.current.active = false; }}>
        <div className="sequence-background" />
        <div className="sequence-opening">
          <div className="logo-perspective"><Logo /></div>
          <p>Thoughtful technology. Extraordinary possibilities.<br />Intelligence that brings your next idea to life.</p>
        </div>
        <div className="intelligence-orbit" aria-hidden="true"><span /><span /><span /></div>
        <p className="intelligence-intro">{['Futuretech is the Intelligence Layer', 'that optimizes processes, reduces costs', 'and fuels creativity.'].map(line => <RevealLine text={line} key={line} />)}</p>
        <h2 className="intelligence-statement">{['Bespoke AI and human ingenuity come', 'together to radically transform your business'].map(line => <RevealLine text={line} key={line} />)}</h2>
        <div className="sequence-brand-bubble" aria-hidden="true"><img src="/futuretechlogo.png" alt="" /></div>
        <div className="sequence-applications" aria-label="Applications">
          {applications.map(app => <article key={app.title}><h3>{app.title}</h3><p>{app.text.match(/.{1,38}(?:\s|$)|\S+$/g)?.map((line, i) => <RevealLine text={line} key={i} />)}</p><span className="application-divider" aria-hidden="true" /></article>)}
        </div>
        <div className="technology-bubbles" aria-label="Interactive technology bubbles">
          {bubbles.map((bubble, i) => <button key={i} ref={el => { bubbleRefs.current[i] = el; }} className="technology-bubble" style={{ '--brand': bubble.color, '--static-x': `${bubble.x * 100}%`, '--static-y': `${bubble.y * 100}%` } } aria-label={`Bounce ${bubble.name} bubble`} title={bubble.name} onClick={() => kick(i)}>
            <span className="technology-icon" style={{ maskImage: `url(/icons/${bubble.icon}.svg)`, WebkitMaskImage: `url(/icons/${bubble.icon}.svg)` }} />
            <span className="bubble-label">{bubble.name}</span>
          </button>)}
        </div>
        <div className="sequence-pointer" aria-hidden="true"><span>+</span></div>
        <div className="intelligence-progress" aria-hidden="true"><span /></div>
      </div>
    </div>
  </section>;
}
