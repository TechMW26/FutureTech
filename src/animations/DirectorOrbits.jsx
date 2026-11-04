import { useId } from 'react';

/** Two fine luminous orbital paths, split behind and in front of the portrait. */
export default function DirectorOrbits({ front = false }) {
  const id = useId().replace(/:/g, '');
  return <svg className={`director-light-orbits director-light-orbits--${front ? 'front' : 'back'}`} viewBox="0 0 1000 800" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id={id} x1="100" y1="650" x2="880" y2="170" gradientUnits="userSpaceOnUse"><stop stopColor="#8faecb" stopOpacity=".12" /><stop offset=".35" stopColor="#5d9dce" stopOpacity=".65" /><stop offset=".55" stopColor="#f6fcff" /><stop offset=".8" stopColor="#81b4dc" stopOpacity=".5" /><stop offset="1" stopColor="#97b2cc" stopOpacity=".12" /></linearGradient>
    </defs>
    {[0, 1].map(index => <g key={index} className={`director-light-orbit director-light-orbit--${index}`} transform={`rotate(${index ? 18 : -28} 500 440)`}>
      <path className="director-orbit-glow" d={front ? 'M 85 440 A 415 200 0 0 0 915 440' : 'M 85 440 A 415 200 0 0 1 915 440'} stroke={`url(#${id})`} strokeWidth="5" />
      <path d={front ? 'M 85 440 A 415 200 0 0 0 915 440' : 'M 85 440 A 415 200 0 0 1 915 440'} stroke={`url(#${id})`} strokeWidth={index ? '.8' : '1.2'} />
      <path className="director-orbit-spark" d={front ? 'M 85 440 A 415 200 0 0 0 915 440' : 'M 85 440 A 415 200 0 0 1 915 440'} pathLength="100" stroke="#d7f0ff" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 96" />
    </g>)}
  </svg>;
}
