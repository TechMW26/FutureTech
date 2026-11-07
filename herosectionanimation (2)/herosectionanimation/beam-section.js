// Animated Beam adapted from Magic UI by Dillion Verma.
// Copyright (c) Magic UI. MIT: https://github.com/magicuidesign/magicui/blob/main/LICENSE.md
// Native, scroll-driven adaptation for this project's buildless HTML page.
(() => {
 'use strict';
 const section=document.querySelector('.connections'),network=document.querySelector('.beam-network'),svg=network.querySelector('svg'),core=document.querySelector('.futuretech-core'),copy=document.querySelector('.connections-copy');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const clamp=x=>Math.max(0,Math.min(1,x));
 const smooth=(a,b,x)=>{const t=clamp((x-a)/(b-a));return t*t*(3-2*t)};
 let paths=[],frame=0,current=null,lastTime=0;
 function point(el){const a=el.getBoundingClientRect(),b=network.getBoundingClientRect();return {x:a.left-b.left+a.width/2,y:a.top-b.top+a.height/2}}
 function path(d){const group=document.createElementNS('http://www.w3.org/2000/svg','g');const pieces=['beam-track','beam-tail','beam-lit'].map(name=>{const p=document.createElementNS(svg.namespaceURI,'path');p.setAttribute('d',d);p.setAttribute('class',name);group.append(p);return p});svg.append(group);return {group,pieces,length:pieces[0].getTotalLength()}}
 function layout(){paths.forEach(p=>p.group.remove());paths=[];const c=point(core);svg.setAttribute('viewBox',`0 0 ${network.clientWidth} ${network.clientHeight}`);network.querySelectorAll('.integration').forEach(el=>{const a=point(el),mid=(a.x+c.x)/2;paths.push(path(`M ${a.x} ${a.y} C ${mid} ${a.y}, ${mid} ${c.y}, ${c.x} ${c.y}`))});const end=point(network.querySelector('.beam-destination'));paths.push(path(`M ${c.x} ${c.y} L ${end.x} ${end.y}`));update()}
 function beam(p,t){const tail=Math.min(95,p.length*.35),head=clamp(t)*(p.length+tail),start=Math.max(0,head-tail),length=Math.max(0,Math.min(head,p.length)-start);p.pieces.slice(1).forEach(el=>{el.style.strokeDasharray=`${length} ${p.length+tail*2}`;el.style.strokeDashoffset=-start;el.style.opacity=t<=0||t>=1?0:Math.min(1,t*12,(1-t)*12)});p.pieces[0].style.stroke=t>=1?'var(--beam-blue)':'';p.pieces[0].style.opacity=t>=1?.22:1}
 function render(time){frame=0;const travel=Math.max(1,section.offsetHeight-section.querySelector('.connections-stage').offsetHeight),target=reduced.matches?1:clamp(-section.getBoundingClientRect().top/travel),dt=Math.min(64,time-lastTime||16.7);lastTime=time;if(current===null||reduced.matches)current=target;else current+=(target-current)*(1-Math.exp(-dt/95));if(Math.abs(target-current)<.0001)current=target;const p=current;paths.slice(0,6).forEach((line,i)=>beam(line,(p-.06-(i%3)*.035)/.4));const charge=smooth(.53,.63,p);core.style.setProperty('--charge',charge);if(paths[6])beam(paths[6],(p-.65)/.19);const reveal=smooth(.84,.97,p);copy.style.opacity=reveal;copy.style.transform=`translateY(${(1-reveal)*15}px)`;copy.style.filter=`blur(${(1-reveal)*5}px)`;if(current!==target)update()}
 function update(){if(!frame)frame=requestAnimationFrame(render)}
 network.querySelectorAll('[data-icon]').forEach(el=>{el.querySelector('.integration-icon').innerHTML=window.futuretechBeamIcons[el.dataset.icon]||''});
 new ResizeObserver(layout).observe(network);addEventListener('scroll',update,{passive:true});reduced.addEventListener('change',update);layout();
})();
