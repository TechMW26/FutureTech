import React from 'react';
import { useEffect, useRef } from 'react';

export default function Journey() {
 const sectionRef=useRef(null);
 useEffect(() => {
 let disposed=false;
 const count=200, images=new Array(count), canvas=sectionRef.current.querySelector('#sequence'), ctx=canvas.getContext('2d',{alpha:false});
 const journey=sectionRef.current, reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const intro=sectionRef.current.querySelector('#intro'), inside=sectionRef.current.querySelector('#inside'), future=sectionRef.current.querySelector('#future');
 const shade=sectionRef.current.querySelector('#interiorShade'), progress=sectionRef.current.querySelector('#progress');
 const clouds=Array.from(sectionRef.current.querySelectorAll('.entry-cloud'));
 const cloudEntry=sectionRef.current.querySelector('.cloud-entry');
 let target=0,current=0,lastTime=0,raf=0,ready=false,width=0,height=0,travel=1,loaded=0,failed=0;
 const clamp=v=>Math.max(0,Math.min(1,v));
 const smooth=(a,b,v)=>{const x=clamp((v-a)/(b-a));return x*x*(3-2*x)};
 function resize(){width=innerWidth;height=sectionRef.current.querySelector('.stage').clientHeight;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);travel=journey.offsetHeight-height;updateTarget();wake()}
 function updateTarget(){target=clamp(-journey.getBoundingClientRect().top/travel);wake()}
 function nearest(index){if(images[index])return images[index];for(let d=1;d<count;d++){if(images[index-d])return images[index-d];if(images[index+d])return images[index+d]}return null}
 function paint(im,alpha){if(!im)return;const scale=Math.max(width/im.naturalWidth,height/im.naturalHeight);const w=im.naturalWidth*scale,h=im.naturalHeight*scale;ctx.globalAlpha=alpha;ctx.drawImage(im,(width-w)/2,(height-h)/2,w,h)}
 function scene(el,opacity){el.style.opacity=opacity;el.style.transform=`translateY(calc(-50% + ${reduced?0:(1-opacity)*12}px))`;el.classList.toggle('active',opacity>.85);el.inert=opacity<.85;el.setAttribute('aria-hidden',String(opacity<.1))}
 function render(time){raf=0;const dt=Math.min(time-lastTime||16.7,64);lastTime=time;current=reduced?target:current+(target-current)*(1-Math.exp(-dt/85));if(Math.abs(target-current)<.00003)current=target;
 // Reserve the added opening distance, then preserve the original sequence timing.
 const openingDistance=reduced?0:height*1.4;
 const opening=reduced?1:clamp(current*travel/openingDistance);
 const sequence=clamp((current*travel-openingDistance)/(travel-openingDistance));
 const part=smooth(0,1,opening);
 clouds.forEach((cloud,index)=>{
  const direction=index%2===0?-1:1;
  const near=index>1;
  cloud.style.transform=`translate3d(${direction*part*(near?100:78)}%, ${part*(near?10:-6)}%, 0) scale(${1+part*(near?.18:.07)})`;
 });
 cloudEntry.style.opacity=1-smooth(.72,1,opening);
 cloudEntry.style.visibility=opening>=1?'hidden':'visible';
 const frame=sequence*(count-1),low=Math.floor(frame),fraction=frame-low;ctx.globalAlpha=1;ctx.fillStyle='#141b1d';ctx.fillRect(0,0,width,height);paint(nearest(low),1);if(fraction>.001)paint(nearest(Math.min(low+1,count-1)),fraction);ctx.globalAlpha=1;
 scene(intro,smooth(.3,.85,opening)*(1-smooth(.08,.25,sequence)));scene(inside,smooth(.535,.59,sequence)*(1-smooth(.735,.8,sequence)));scene(future,smooth(.815,.88,sequence));shade.style.opacity=smooth(.52,.59,sequence)*.95;progress.style.transform=`scaleX(${current})`;
 if(current!==target)wake();}
 function wake(){if(!disposed&&!raf&&ready)raf=requestAnimationFrame(render)}
 async function load(index){const im=new Image();im.src=`/ezgif-frame-${String(index+1).padStart(3,'0')}.jpg`;try{await im.decode();if(disposed)return;images[index]=im;loaded++;if(!ready){ready=true;current=target}wake()}catch{failed++}}
 async function start(){resize();await load(0);let next=1;await Promise.all(Array.from({length:8},async()=>{while(!disposed&&next<count){const index=next++;await load(index)}}));if(failed)console.warn(`${failed} unavailable frames; using nearest loaded frames.`);wake()}
 addEventListener('scroll',updateTarget,{passive:true});addEventListener('resize',resize);start();

 return () => { disposed=true; cancelAnimationFrame(raf); removeEventListener('scroll',updateTarget); removeEventListener('resize',resize); };
 }, []);
 return (<section ref={sectionRef} className="journey" id="journey" aria-label="Scroll through our creative technology studio">
<div className="stage">
<canvas id="sequence" aria-label="A journey through clouds into a futuristic technology studio" role="img"></canvas>
<div className="shade"></div><div className="interior-shade" id="interiorShade"></div>
<div className="scene intro" id="intro"><h1><span className="headline-line">Next is</span><span className="headline-line outline">an inside job.</span></h1></div>
<div className="scene" id="inside"><h2><span className="headline-line">Bold ideas.</span><span className="headline-line">Built here.</span></h2></div>
<div className="scene" id="future"><h2><span className="headline-line">Human vision.</span><span className="headline-line">Digital impact.</span></h2></div>
<div className="cloud-entry" aria-hidden="true">
 <div className="entry-cloud cloud-far cloud-left" />
 <div className="entry-cloud cloud-far cloud-right" />
 <div className="entry-cloud cloud-near cloud-left" />
 <div className="entry-cloud cloud-near cloud-right" />
</div>
<div className="progress" id="progress"></div>
</div>
</section>);
}
