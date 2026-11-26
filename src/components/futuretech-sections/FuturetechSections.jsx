import React, {useRef} from 'react';
import './style.css';
import Signals from './Signals';
import DotGrid from './DotGrid';

function Label({children}){return <div className="label">{children}</div>}
function Computer(){
  return <div className="computer">
    <div className="rack-art"><img src="/futuretech-sections/supercomputer.png" width="690" height="660" alt="Supercomputer receiving signals from both sides"/></div>
    <div className="computer-caption"><Label>Signal hub</Label><strong>LIVE EVENT MESH</strong></div>
    <div className="outgoing-signal" aria-hidden="true"><i/></div>
  </div>;
}
export default function FuturetechSections() {
  const stage=useRef(null);
  return <div className="futuretech-sections"><div ref={stage} id="home" className="scroll-stage">
    <div className="pinned">
      <DotGrid stage={stage} className="particles" dotSize={2.6} gap={22}
        baseColor="#f5f5f5" activeColor="#087cff" proximity={360}
        strength={1.15} bounce={0.7} tension={0.35} swell={1.4}
        stretch={0.5} glow={1.15} opacity={0.55} shockRadius={380}
        shockStrength={4} intro={false} dpr={Math.min(devicePixelRatio, 1.5)}/>
      <section className="opening">
        <h1 className="intro-title">From artificial intelligence to cleaner air. <span>Many industries. One group.</span></h1>

      </section>
      <section aria-labelledby="systems-heading">
        <h2 id="systems-heading" className="system-title">Revolutionising the operations <span>with scalable systems</span></h2>
        <Computer/>
      </section>
    </div>
    <div id="systems" aria-hidden="true"/>
  </div><div className="signal-entry" aria-hidden="true"/><Signals/></div>;
}
