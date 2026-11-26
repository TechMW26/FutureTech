import React, {useState} from 'react';

const signals = [
  ['Model health','Uptime 99.8%'], ['Intake pipeline','12K/min','Signals normalized'],
  ['Deployment','Global edge'], ['Model router','99.4%','Intent classified'],
  ['Ops signal','Escalation ready','Agent routed high-priority work to the right team.'],
  ['Automation run','1.2s','Workflow dispatched'], ['Control','Human-in-loop'],
  ['Service','AI workflow orchestration'], ['Stack','RAG · Agents / Vision models']
];

// Axonometric projection keeps each piece of equipment on the same drawing plane.
const project = ([x,y,z]) => [64+(x-y)*.87,70+(x+y)*.42-z].join(',');
function Block({x=0,y=0,z=0,w,d,h}) {
  const a=[x,y,z+h], b=[x+w,y,z+h], c=[x+w,y+d,z+h], e=[x,y+d,z+h];
  const face=(pts,color)=><polygon points={pts.map(project).join(' ')} fill={color}/>;
  return <g stroke="#789ab1" strokeWidth=".8" strokeLinejoin="round">
    {face([e,c,[x+w,y+d,z],[x,y+d,z]],'#c7dce9')}
    {face([b,c,[x+w,y+d,z],[x+w,y,z]],'#8daec4')}
    {face([a,b,c,e],'#eff7fc')}
  </g>;
}
function Instrument({index}){
  const cube=(x,y,z,w,d,h,key)=> <Block {...{x,y,z,w,d,h}} key={key}/>;
  const series=(n,fn)=>Array.from({length:n},(_,i)=>fn(i));
  const models=[
    ()=>series(5,i=>cube(-23+i*9,-6,2,6,12,[10,19,14,29,35][i],i)),
    ()=>series(4,i=>cube(-22+i*11,-6,2+i*3,9,18,8,i)),
    ()=>series(3,i=>cube(-21+i*15,-9,2,11,17,20+i*6,i)),
    ()=> <>{cube(-18,-15,2,36,30,9)}{series(5,i=>cube(-14+i*6,7,11,3,5,1,i))}{series(2,i=>cube(-15+i*26,-13,11,2,2,19,i))}</>,
    ()=> <>{cube(-11,-10,2,22,20,5)}{cube(-3,-3,7,6,6,30)}{series(3,i=>cube(-8,-7,17+i*7,16,14,3,i))}</>,
    ()=> <>{cube(-22,-10,2,41,20,5)}{series(4,i=>cube(-18+i*10,-7,7,7,14,6,i))}</>,
    ()=> <>{cube(-22,-12,2,44,25,6)}{series(3,i=>cube(-16+i*12,-8,8,3,17,1,i))}{series(3,i=>cube(-18+i*12,-6+i*4,9,7,4,4,i))}</>,
    ()=> <>{cube(-20,-13,2,13,12,19)}{cube(4,-12,2,14,12,28)}{cube(-4,8,2,14,12,12)}</>,
    ()=>series(4,i=>cube(-17,-12,2+i*7,34,24,4,i))
  ];
  return <svg viewBox="0 0 128 104" aria-hidden="true"><ellipse cx="64" cy="79" rx="40" ry="10" fill="#e4edf3"/>
    <g className="hardware">{cube(-26,-20,0,52,40,2)}{models[index]()}
    <path d="m43 78 13 6" stroke="#178cff" strokeWidth="2.3" className="equipment-led"/></g></svg>;
}
function Signal({data,index}){
  const [replay,setReplay]=useState(0);
  return <button className="readout" onClick={()=>setReplay(n=>n+1)} type="button">
    <span className="readout-text"><small>{data[0]}</small><strong>{data[1]}</strong>{data[2]&&<span>{data[2]}</span>}
    {index===8&&<><small>Memory layer</small><span>Context graph / Client signals</span></>}</span>
    <span className="equipment" key={replay}><Instrument index={index}/></span>
  </button>;
}
export default function Signals(){
  return <section className="readouts" aria-label="System signals">{signals.map((data,index)=><Signal key={data[0]} {...{data,index}}/>)}</section>;
}
