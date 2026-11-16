// Animated Beam adapted from Magic UI by Dillion Verma.
// Copyright (c) Magic UI. MIT: https://github.com/magicuidesign/magicui/blob/main/LICENSE.md
// Scroll-driven React adaptation preserving the original page behavior.
import { useEffect, useId, useRef } from 'react';
import { BrainCircuit, CalendarRange, ChartNoAxesCombined, ShieldCheck, UsersRound, WalletCards } from 'lucide-react';
import { Link } from 'react-router-dom';
import { workProjects } from '../../animations/workProjects';
import DataRain from './ui/data-rain';

const featuredProjects = workProjects.filter(({ id }) => id === 'mira' || id === 'algae');
const integrations = [
 { label: 'Planning', color: '#2769b1', Icon: CalendarRange },
 { label: 'Finance', color: '#117b57', Icon: WalletCards },
 { label: 'Analytics', color: '#a45a13', Icon: ChartNoAxesCombined },
 { label: 'People', color: '#ac4070', Icon: UsersRound },
 { label: 'Intelligence', color: '#6947bb', Icon: BrainCircuit },
 { label: 'Security', color: '#157682', Icon: ShieldCheck },
];

export default function Connections() {
 const sectionRef=useRef(null);
 const beamId = useId();
 useEffect(() => {
 'use strict';
 const section=sectionRef.current,network=section.querySelector('.connections-rail'),svg=network.querySelector('.beam-lines'),core=section.querySelector('.futuretech-core'),copy=section.querySelector('.connections-copy');
 const nodes=Array.from(network.querySelectorAll('.integration'));
 const stage = section.querySelector('.connections-stage');
 const panel = section.querySelector('.connections-panel');
 const words = copy.querySelectorAll('.reveal-word');
 const details = copy.querySelector('.rain-story__details');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const clamp=x=>Math.max(0,Math.min(1,x));
 const smooth=(a,b,x)=>{const t=clamp((x-a)/(b-a));return t*t*(3-2*t)};
 let incoming = [], outgoing, frame = 0, current = null, lastTime = 0;

 function createBeam(d, color, id) {
  const group = document.createElementNS(svg.namespaceURI, 'g');
  group.style.color = color;
  const [track, ...pulse] = ['beam-track', 'beam-tail', 'beam-lit'].map(name => {
   const path = document.createElementNS(svg.namespaceURI, 'path');
   path.setAttribute('d', d);
   path.setAttribute('class', name);
   group.append(path);
   return path;
  });
  const gradient = document.createElementNS(svg.namespaceURI, 'linearGradient');
  gradient.id = `${beamId}-${id}`;
  gradient.setAttribute('gradientUnits', 'userSpaceOnUse');
  [[0, 0], [.55, .55], [.86, 1], [1, .7]].forEach(([offset, opacity]) => {
   const stop = document.createElementNS(svg.namespaceURI, 'stop');
   stop.setAttribute('offset', offset);
   stop.setAttribute('stop-color', 'currentColor');
   stop.setAttribute('stop-opacity', opacity);
   gradient.append(stop);
  });
  group.prepend(gradient);
  pulse.forEach(path => { path.style.stroke = `url(#${gradient.id})`; });
  svg.append(group);
  return { group, track, pulse, gradient, length: track.getTotalLength() };
 }

 function clearBeams() {
  incoming.forEach(({ group }) => group.remove());
  outgoing?.group.remove();
 }

 function layout() {
  clearBeams();
  const bounds = network.getBoundingClientRect();
  const point = (element) => {
   const rect = element.getBoundingClientRect();
   return { x: rect.left - bounds.left + rect.width / 2, y: rect.top - bounds.top + rect.height / 2 };
  };
  const center = point(core);
  svg.setAttribute('viewBox', `0 0 ${bounds.width} ${bounds.height}`);
  incoming = nodes.map((node, index) => {
   const start = point(node);
   const mid = (start.x + center.x) / 2;
   const curve = `M ${start.x} ${start.y} C ${mid} ${start.y}, ${mid} ${center.y}, ${center.x} ${center.y}`;
   return createBeam(curve, integrations[index].color, index);
  });
  const end = point(network.querySelector('.beam-destination'));
  outgoing = createBeam(`M ${center.x} ${center.y} L ${end.x} ${end.y}`, 'var(--beam-blue)', 'out');
  outgoing.group.classList.add('beam-outgoing');
  update();
 }

 function beam({ track, pulse, gradient, length }, progress) {
  const tailLength = Math.min(165, length * .4);
  const head = clamp(progress) * (length + tailLength);
  const start = Math.max(0, head - tailLength);
  const end = Math.min(head, length);
  const a = track.getPointAtLength(Math.min(start, length));
  const b = track.getPointAtLength(end);
  const opacity = Math.max(0, Math.min(1, progress * 12, (1 - progress) * 12));
  Object.entries({ x1: a.x, y1: a.y, x2: b.x, y2: b.y }).forEach(([key, value]) => {
   gradient.setAttribute(key, value);
  });
  pulse.forEach(path => {
   path.style.strokeDasharray = `${Math.max(0, end - start)} ${length + tailLength * 2}`;
   path.style.strokeDashoffset = -start;
   path.style.opacity = opacity;
  });
  track.style.opacity = .25 + .13 * smooth(.55, 1, progress);
 }
 function render(time) {
  frame = 0;
  const travel = Math.max(1, section.offsetHeight - stage.offsetHeight);
  const target = reduced.matches ? 1 : clamp(-section.getBoundingClientRect().top / travel);
  const dt = Math.min(64, time - lastTime || 16.7);
  lastTime = time;
  if (current === null || reduced.matches) current = target;
  else current += (target - current) * (1 - Math.exp(-dt / 95));
  if (Math.abs(target - current) < .0001) current = target;

  incoming.forEach((line, index) => {
   const progress = (current - .03 - (index % 3) * .025) / .28;
   beam(line, progress);
   nodes[index].style.setProperty('--node-charge', smooth(0, .2, progress));
  });
  core.style.setProperty('--charge', smooth(.29, .40, current));
  beam(outgoing, (current - .44) / .32);

  const birth = smooth(.72, .9, current);
  copy.style.setProperty('--rain-birth', birth);
  copy.style.setProperty('--rain-radius', `${birth * 150}%`);
  copy.style.setProperty('--source-glow', smooth(.70, .75, current) * (1 - smooth(.8, .91, current)));
  const transition = smooth(.48, .76, current);
  network.style.transform = reduced.matches ? 'none' : `translate3d(0,${-transition * stage.clientHeight}px,0)`;
  panel.style.opacity = reduced.matches ? 1 : 1 - smooth(.62, .76, current);

  words.forEach((word, index) => {
   const delay = index * .022;
   word.style.setProperty('--reveal', smooth(.78 + delay, .87 + delay, current));
  });
  const reveal = smooth(.87, .98, current);
  copy.style.setProperty('--copy-reveal', reveal);
  details.inert = reveal < .9;
  if (current !== target) update();
 }
 function update(){if(!frame)frame=requestAnimationFrame(render)}
 const observer=new ResizeObserver(layout);observer.observe(network);addEventListener('scroll',update,{passive:true});reduced.addEventListener('change',update);layout();

 return () => { observer.disconnect(); cancelAnimationFrame(frame); removeEventListener('scroll',update); reduced.removeEventListener('change',update); clearBeams(); };
 }, [beamId]);
 return (<section ref={sectionRef} className="connections" id="connections" aria-labelledby="connections-title">
 <div className="connections-stage">
 <div className="connections-rail">
 <svg className="beam-lines" aria-hidden="true" />
 <div className="connections-panel">
  <header className="connections-heading">
   <h2 id="connections-title" className="world-heading"><span className="world-heading-top">Your world.</span><span className="world-heading-bottom">Working as <em>one<span className="heading-period">.</span></em></span></h2>
  </header>
  <div className="beam-network" id="beam-network">

   {integrations.map(({ label, color, Icon }, index) => (
    <div key={label} className={`integration node-${index + 1}`} style={{ '--node-color': color }}>
     <Icon className="integration-icon" strokeWidth={1.65} aria-hidden="true" />
     <span className="integration-label">{label}</span>
    </div>
   ))}
   <div className="futuretech-core" id="futuretech-core"><div className="futuretech-logo"><img src="/journey/futuretechlogo.png" alt="Futuretech" width="80" height="80" /></div></div>

  </div>
 </div>
 <section className="connections-copy rain-story" aria-labelledby="possibilities-title">
  <DataRain fullscreen={false} count={1600} flowSpeed={0.8} obstacleRadius={85} autopilot={true} palette={{calm:'#326d9a',mid:'#182633',hot:'#2474ff'}} />
  <div className="beam-destination" aria-hidden="true"><span className="rain-source" /></div>
  <div className="rain-story__content">
   <h3 id="possibilities-title">
    <span className="reveal-line"><span className="reveal-word">Connected</span> <span className="reveal-word">intelligence.</span></span>
    <span className="reveal-line"><span className="reveal-word">Extraordinary</span> <span className="reveal-word accent-word">possibilities.</span></span>
   </h3>
   <div className="rain-story__details" inert>
    <p className="rain-story__lead">We connect data, software and the physical world. Here’s what that looks like in practice.</p>
    <ul className="rain-story__projects" aria-label="Selected projects">
     {featuredProjects.map(({ id, path, src, title, summary }) => (
      <li key={id}>
       <Link className="rain-story__project" to={path}>
        <img src={src} alt="" loading="lazy" decoding="async" />
        <div>
         <h4>{title}</h4>
         <p>{summary}</p>
        </div>
       </Link>
      </li>
     ))}
    </ul>
    <Link className="rain-story__work-link" to="/work">
     Explore our work <span aria-hidden="true">↗</span>
    </Link>
   </div>
  </div>
 </section>
 </div>
 </div>
</section>);
}
