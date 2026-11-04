const clamp = (value: number) => Math.max(0, Math.min(1, value));
const ease = (value: number) => { const t = clamp(value); return t * t * t * (t * (t * 6 - 15) + 10); };
const range = (value: number, start: number, end: number) => clamp((value - start) / (end - start));

export function newsBatchPose(progress: number, index: number, stageHeight: number) {
  const incoming = index === 0 ? 1 : ease(range(progress - index + 1, .18, .94));
  const outgoing = ease(range(progress - index, .02, .42));
  const fadeBack = ease(range(progress - index, .48, .94));
  return {
    y: (1 - incoming) * (stageHeight + 35) - outgoing * 25,
    z: -outgoing * 85,
    scale: 1 - outgoing * .055,
    opacity: ease(range(incoming, 0, .28)) * (1 - fadeBack * .66),
    blur: outgoing * 1.2,
  };
}

export function groupNews<T>(items: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(items.length / size) }, (_, index) => items.slice(index * size, (index + 1) * size));
}
