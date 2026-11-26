// Transverse sections traced in the reference's 1307 × 310 coordinate space.
// Each point stores distance along the ribbon, upper edge, lower edge, and
// projected curvature across its face. The edges exchange sides at the twist.
const sections = [
  [0,-161,142,0],[.14,-139,126,4],[.27,-114,106,8],
  [.36,-93,75,13],[.43,-60,29,22],[.495,-20,-24,58],
  [.55,40,-67,51],[.62,91,-84,16],[.69,78,-64,1],
  [.77,35,-34,-3],[.85,9,-10,0],[.93,2,-2,0],[1,0,0,0]
];

function ordinate(i, column, t) {
  const a=sections[i], b=sections[i+1];
  const prev=sections[Math.max(0,i-1)], next=sections[Math.min(sections.length-1,i+2)];
  const span=b[0]-a[0];
  const m0=(b[column]-prev[column])*span/(b[0]-prev[0]);
  const m1=(next[column]-a[column])*span/(next[0]-a[0]);
  const t2=t*t, t3=t2*t;
  return (2*t3-3*t2+1)*a[column]+(t3-2*t2+t)*m0+
    (-2*t3+3*t2)*b[column]+(t3-t2)*m1;
}

export function ribbonPoint(u,lane) {
  const i=sections.findIndex((point,index)=>index>0 && u<=point[0])-1;
  const segment=Math.max(0,i);
  const t=(u-sections[segment][0])/(sections[segment+1][0]-sections[segment][0]);
  const top=ordinate(segment,1,t), bottom=ordinate(segment,2,t);
  const bow=ordinate(segment,3,t);
  return top+(bottom-top)*lane+bow*4*lane*(1-lane);
}
