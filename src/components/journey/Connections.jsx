// Animated Beam adapted from Magic UI by Dillion Verma.
// Copyright (c) Magic UI. MIT: https://github.com/magicuidesign/magicui/blob/main/LICENSE.md
// Scroll-driven React adaptation preserving the original page behavior.
import { useEffect, useRef } from 'react';
import IntegrationIcon from './IntegrationIcon';
import DataRain from './ui/data-rain';

export default function Connections() {
 const sectionRef=useRef(null);
 useEffect(() => {
 'use strict';
 const section=sectionRef.current,network=section.querySelector('.connections-rail'),svg=network.querySelector('.beam-lines'),core=section.querySelector('.futuretech-core'),copy=section.querySelector('.connections-copy');
 const nodes=Array.from(network.querySelectorAll('.integration'));
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const clamp=x=>Math.max(0,Math.min(1,x));
 const smooth=(a,b,x)=>{const t=clamp((x-a)/(b-a));return t*t*(3-2*t)};
 let paths=[],frame=0,current=null,lastTime=0;
 function point(el){const a=el.getBoundingClientRect(),b=network.getBoundingClientRect();return {x:a.left-b.left+a.width/2,y:a.top-b.top+a.height/2}}
 function path(d){const group=document.createElementNS('http://www.w3.org/2000/svg','g');const pieces=['beam-track','beam-tail','beam-lit'].map(name=>{const p=document.createElementNS(svg.namespaceURI,'path');p.setAttribute('d',d);p.setAttribute('class',name);group.append(p);return p});const gradient=document.createElementNS(svg.namespaceURI,'linearGradient');const id=`signal-${paths.length}`;gradient.id=id;gradient.setAttribute('gradientUnits','userSpaceOnUse');[[0,0],[.65,.45],[1,1]].forEach(([offset,opacity])=>{const stop=document.createElementNS(svg.namespaceURI,'stop');stop.setAttribute('offset',offset);stop.setAttribute('stop-color','#397ba8');stop.setAttribute('stop-opacity',opacity);gradient.append(stop)});group.append(gradient);pieces.slice(1).forEach(el=>el.style.stroke=`url(#${id})`);svg.append(group);return {group,pieces,gradient,length:pieces[0].getTotalLength()}}
 function layout(){paths.forEach(p=>p.group.remove());paths=[];const c=point(core);svg.setAttribute('viewBox',`0 0 ${network.clientWidth} ${network.clientHeight}`);network.querySelectorAll('.integration').forEach(el=>{const a=point(el),mid=(a.x+c.x)/2;paths.push(path(`M ${a.x} ${a.y} C ${mid} ${a.y}, ${mid} ${c.y}, ${c.x} ${c.y}`))});const end=point(network.querySelector('.beam-destination'));paths.push(path(`M ${c.x} ${c.y} L ${end.x} ${end.y}`));paths[6].group.classList.add('beam-outgoing');update()}
 function beam(p,t){const tail=Math.min(140,p.length*.4),head=clamp(t)*(p.length+tail),start=Math.max(0,head-tail),length=Math.max(0,Math.min(head,p.length)-start);const a=p.pieces[0].getPointAtLength(Math.min(start,p.length)),b=p.pieces[0].getPointAtLength(Math.min(head,p.length));Object.entries({x1:a.x,y1:a.y,x2:b.x,y2:b.y}).forEach(([key,value])=>p.gradient.setAttribute(key,value));p.pieces.slice(1).forEach(el=>{el.style.strokeDasharray=`${length} ${p.length+tail*2}`;el.style.strokeDashoffset=-start;el.style.opacity=t<=0||t>=1?0:Math.min(1,t*12,(1-t)*12)});p.pieces[0].style.stroke=t>=1?'var(--beam-blue)':'';p.pieces[0].style.opacity=t>=1?.22:1}
 function render(time){frame=0;const travel=Math.max(1,section.offsetHeight-section.querySelector('.connections-stage').offsetHeight),target=reduced.matches?1:clamp(-section.getBoundingClientRect().top/travel),dt=Math.min(64,time-lastTime||16.7);lastTime=time;if(current===null||reduced.matches)current=target;else current+=(target-current)*(1-Math.exp(-dt/95));if(Math.abs(target-current)<.0001)current=target;const p=current;paths.slice(0,6).forEach((line,i)=>{const t=(p-.03-(i%3)*.025)/.28;beam(line,t);nodes[i].style.setProperty('--node-charge',smooth(0,.2,t))});const charge=smooth(.29,.40,p);core.style.setProperty('--charge',charge);if(paths[6])beam(paths[6],(p-.44)/.32);const birth=smooth(.72,.9,p);copy.style.setProperty('--rain-birth',birth);copy.style.setProperty('--rain-radius',`${birth*150}%`);copy.style.setProperty('--source-glow',smooth(.70,.75,p)*(1-smooth(.8,.91,p)));const transition=smooth(.48,.76,p);network.style.transform=reduced.matches?'none':`translate3d(0,${-transition*section.querySelector('.connections-stage').clientHeight}px,0)`;section.querySelector('.connections-panel').style.opacity=reduced.matches?1:1-smooth(.62,.76,p);copy.querySelectorAll('.reveal-word').forEach((word,i)=>{const reveal=smooth(.78+i*.022,.87+i*.022,p);word.style.setProperty('--reveal',reveal)});const reveal=smooth(.87,.98,p);copy.style.setProperty('--copy-reveal',reveal);if(current!==target)update()}
 function update(){if(!frame)frame=requestAnimationFrame(render)}
 const observer=new ResizeObserver(layout);observer.observe(network);addEventListener('scroll',update,{passive:true});reduced.addEventListener('change',update);layout();

 return () => { observer.disconnect(); cancelAnimationFrame(frame); removeEventListener('scroll',update); reduced.removeEventListener('change',update); paths.forEach(p=>p.group.remove()); };
 }, []);
 return (<section ref={sectionRef} className="connections" id="connections" aria-labelledby="connections-title">
 <div className="connections-stage">
 <div className="connections-rail">
 <svg className="beam-lines" aria-hidden="true"><defs><filter id="beam-glow"><feGaussianBlur stdDeviation="2" /></filter></defs></svg>
 <div className="connections-panel">
  <header className="connections-heading">
   <h2 id="connections-title" className="world-heading"><span className="world-heading-top">Your world.</span><span className="world-heading-bottom">Working as <em>one<span className="heading-period">.</span></em></span></h2>
  </header>
  <div className="beam-network" id="beam-network">

   <div className="integration node-1" data-icon="calendar"><span className="integration-icon"><IntegrationIcon name="calendar" /></span><span className="integration-label">Planning</span></div>
   <div className="integration node-2" data-icon="finance"><span className="integration-icon"><IntegrationIcon name="finance" /></span><span className="integration-label">Finance</span></div>
   <div className="integration node-3" data-icon="analytics"><span className="integration-icon"><IntegrationIcon name="analytics" /></span><span className="integration-label">Analytics</span></div>
   <div className="integration node-4" data-icon="people"><span className="integration-icon"><IntegrationIcon name="people" /></span><span className="integration-label">People</span></div>
   <div className="integration node-5" data-icon="intelligence"><span className="integration-icon"><IntegrationIcon name="intelligence" /></span><span className="integration-label">Intelligence</span></div>
   <div className="integration node-6" data-icon="security"><span className="integration-icon"><IntegrationIcon name="security" /></span><span className="integration-label">Security</span></div>
   <div className="futuretech-core" id="futuretech-core"><div className="futuretech-logo"><img src="/journey/futuretechlogo.png" alt="Futuretech" width="80" height="80" /></div></div>

  </div>
 </div>
 <section className="connections-copy rain-story" aria-labelledby="possibilities-title">
  <DataRain fullscreen={false} count={1600} flowSpeed={0.8} obstacleRadius={85} autopilot={true} palette={{calm:'#326d9a',mid:'#182633',hot:'#2474ff'}} />
  <div className="beam-destination" aria-hidden="true"><span className="rain-source" /></div>
  <h3 id="possibilities-title"><span className="reveal-line"><span className="reveal-word">Connected</span> <span className="reveal-word">intelligence.</span></span><span className="reveal-line"><span className="reveal-word">Extraordinary</span> <span className="reveal-word accent-word">possibilities.</span></span></h3>
 </section>
 </div>
 </div>
</section>);
}
