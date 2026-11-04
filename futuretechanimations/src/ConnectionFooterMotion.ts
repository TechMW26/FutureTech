export const CONNECTION_FRAME_COUNT = 16;
const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => { const t = clamp(value); return t * t * t * (t * (t * 6 - 15) + 10); };

export function connectionMotion(progress: number, reduced = false) {
  const p = clamp(progress);
  const position = reduced ? CONNECTION_FRAME_COUNT - 1 : clamp(p / .78) * (CONNECTION_FRAME_COUNT - 1);
  return {
    first: Math.floor(position), second: Math.min(CONNECTION_FRAME_COUNT - 1, Math.floor(position) + 1),
    blend: position - Math.floor(position),
    invitation: reduced ? 1 : smooth((p - .72) / .25),
  };
}

export function coverFrame(sourceWidth: number, sourceHeight: number, width: number, height: number) {
  const mobile = width < 700;
  const zoneHeight = mobile ? Math.min(height * .55, width / 1.6) : height;
  const zoneTop = mobile ? height - zoneHeight - 45 : 0;
  const scale = Math.max(width / sourceWidth, zoneHeight / sourceHeight);
  return { x: (width - sourceWidth * scale) / 2, y: zoneTop + (zoneHeight - sourceHeight * scale) * .4, width: sourceWidth * scale, height: sourceHeight * scale };
}
