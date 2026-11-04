import { useEffect, useRef } from 'react';

/** A reflective cylindrical ribbon, projected in 3D and split around the portrait. */
export default function MetalRibbon({ layer = 'all', director = false }) {
  const canvas = useRef(null);
  useEffect(() => {
    const node = canvas.current;
    const ctx = node?.getContext('2d');
    if (!node || !ctx) return;
    const host = node.closest(director ? '.director-experience' : '.about-continuous');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0, visible = true, lastPaint = 0;
    const started = performance.now();
    const draw = (time = performance.now()) => {
      frame = 0;
      if (!visible) return;
      if (!reduced.matches && !director && time - lastPaint < 1000 / 30) { frame = requestAnimationFrame(draw); return; }
      lastPaint = time;
      const rect = node.getBoundingClientRect();
      const w = rect.width, h = rect.height;
      if (!w || !h) return;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      if (node.width !== Math.round(w * dpr) || node.height !== Math.round(h * dpr)) { node.width = Math.round(w * dpr); node.height = Math.round(h * dpr); }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h);
      const bounds = host?.getBoundingClientRect();
      const p = reduced.matches || !bounds ? 0 : Math.max(0, Math.min(1, -bounds.top / Math.max(1, director ? bounds.height - innerHeight : innerHeight * .8)));
      const drift = reduced.matches ? 0 : (time - started) * .00012;
      const phase = p * 1.6 + drift;
      const angle = (-22 + Math.sin(phase) * 8) * Math.PI / 180;
      const rx = w * .455, ry = h * (director ? .285 : .32) * (.94 + .06 * Math.cos(phase));
      const band = h * (director ? .095 : .074);
      const cy = h * (director ? .58 : .53);
      function point(t, v) {
        const twist = Math.sin(t + phase) * .28;
        const perspective = 1 + Math.sin(t) * .035;
        const x = Math.cos(t) * (rx + v * band * twist) * perspective;
        const y = (Math.sin(t) * ry + v * band) * perspective;
        return [w / 2 + x * Math.cos(angle) - y * Math.sin(angle), cy + x * Math.sin(angle) + y * Math.cos(angle)];
      }
      const slices = 240, lanes = 20;
      const order = Array.from({ length: slices }, (_, i) => i).sort((a, b) => Math.sin(a / slices * Math.PI * 2) - Math.sin(b / slices * Math.PI * 2));
      for (const i of order) {
        const t = i / slices * Math.PI * 2, end = (i + 1.025) / slices * Math.PI * 2;
        const front = Math.sin(t) >= 0;
        if ((layer === 'front' && !front) || (layer === 'back' && front)) continue;
        for (let j = 0; j < lanes; j++) {
          const v = j / lanes - .5, next = (j + 1.08) / lanes - .5;
          const reflection = Math.sin(t * 2 + phase + v * 3.7);
          const highlight = Math.pow(Math.max(0, Math.cos(t * 3 - phase * 1.5 + v * 3)), 18);
          const edge = Math.pow(Math.abs(v) * 2, 9);
          const light = Math.max(.12, Math.min(1, .57 + reflection * .33 + highlight * .34 - edge * .1));
          const blue = front ? [67, 117, 163] : [116, 150, 184];
          const rgb = blue.map(c => Math.round(c + (255 - c) * light));
          const a = point(t, v), b = point(end, v), c = point(end, next), d = point(t, next);
          ctx.fillStyle = `rgb(${rgb.join(',')})`;
          ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.lineTo(c[0], c[1]); ctx.lineTo(d[0], d[1]); ctx.closePath(); ctx.fill();
        }
      }
      // Fine polished edges and two restrained studio-light reflections.
      for (const side of [-.5, .5]) {
        ctx.beginPath(); let started = false;
        for (let i = 0; i <= slices; i++) {
          const t = i / slices * Math.PI * 2, front = Math.sin(t) >= 0;
          if ((layer === 'front' && !front) || (layer === 'back' && front)) { started = false; continue; }
          const pt = point(t, side); if (!started) ctx.moveTo(pt[0], pt[1]); else ctx.lineTo(pt[0], pt[1]); started = true;
        }
        ctx.strokeStyle = side < 0 ? '#ffffffed' : '#6b9bc27a'; ctx.lineWidth = side < 0 ? 1.6 : .8; ctx.stroke();
      }
      for (const t of [.85 * Math.PI + phase * .12, 1.85 * Math.PI + phase * .12]) {
        const front = Math.sin(t) >= 0;
        if ((layer === 'front' && !front) || (layer === 'back' && front)) continue;
        const pt = point(t, -.45), radius = Math.min(w, h) * .07;
        const glow = ctx.createRadialGradient(pt[0], pt[1], 0, pt[0], pt[1], radius);
        glow.addColorStop(0, '#ffffffed'); glow.addColorStop(.16, '#fff9'); glow.addColorStop(.45, '#c5eaff40'); glow.addColorStop(1, '#c5eaff00');
        ctx.fillStyle = glow; ctx.fillRect(pt[0] - radius, pt[1] - radius, radius * 2, radius * 2);
      }
      if (!reduced.matches && !director) frame = requestAnimationFrame(draw);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(draw); };
    const observer = new ResizeObserver(schedule); observer.observe(node);
    const visibility = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) schedule(); }); visibility.observe(node);
    addEventListener('scroll', schedule, { passive: true }); reduced.addEventListener('change', schedule); draw();
    return () => { cancelAnimationFrame(frame); observer.disconnect(); visibility.disconnect(); removeEventListener('scroll', schedule); reduced.removeEventListener('change', schedule); };
  }, [layer, director]);
  return <canvas ref={canvas} className={`metal-ribbon metal-ribbon--${layer}`} aria-hidden="true" />;
}
