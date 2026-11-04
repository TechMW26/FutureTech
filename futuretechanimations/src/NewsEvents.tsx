import { useEffect, useRef, useState } from 'react';
import SiteHeader from './SiteHeader';
import NewsJournal from './NewsJournal';
import './NewsEvents.css';

export default function NewsEvents() {
  const video = useRef<HTMLVideoElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    document.title = 'News & Events — MW Futuretech';
    const media = video.current!;
    const surface = canvas.current!;
    const ctx = surface.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    // The fingertips reach their closest point at this frame in the supplied clip.
    const contactTime = 3.65;
    let phase: 'approach' | 'hold' | 'scroll' = 'approach';
    let holdScroll = 0;
    let scrollProgress = 0;
    let disposed = false;
    let scrollFrames: ImageBitmap[] = [];
    let lastScrollFrame = -1;
    // Decode the departure once; scrolling only draws an already decoded bitmap.
    const prepareFrames = async () => {
      const response = await fetch('/videos/hands-frames/manifest.json');
      const { count } = await response.json() as { count: number };
      const decoded = await Promise.all(Array.from({ length: count }, async (_, index) => {
        const response = await fetch('/videos/hands-frames/' + String(index).padStart(3, '0') + '.png');
        return createImageBitmap(await response.blob());
      }));
      if (disposed) decoded.forEach(image => image.close());
      else scrollFrames = decoded;
    };
    prepareFrames().catch(() => {});
    let frame = 0;
    const start = () => {
      media.currentTime = 1.5;
      media.play().catch(() => {
        media.currentTime = contactTime;
        phase = 'hold';
        holdScroll = window.scrollY;
      });
    };
    const updateScroll = () => {
      if (phase === 'approach') return;
      const distance = window.scrollY - holdScroll;
      if (phase === 'hold' && distance <= 0) return;
      phase = 'scroll';
      const available = Math.max(window.innerHeight * .5,
        (track.current?.getBoundingClientRect().bottom ?? window.innerHeight * 2) + window.scrollY - window.innerHeight - holdScroll);
      const progress = Math.max(0, Math.min(1, distance / available));
      scrollProgress = progress;
    };
    media.addEventListener('loadedmetadata', start);
    window.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('resize', updateScroll);
    if (media.readyState >= 1) start();
    let lastTime = -1;
    const draw = () => {
      if (phase === 'approach' && media.currentTime >= contactTime) {
        media.pause();
        media.currentTime = contactTime;
        phase = 'hold';
        holdScroll = window.scrollY;
      }
      if (phase !== 'approach' && scrollFrames.length) {
        const index = Math.round(scrollProgress * (scrollFrames.length - 1));
        if (index !== lastScrollFrame) {
          ctx.clearRect(0, 0, surface.width, surface.height);
          ctx.drawImage(scrollFrames[index], 0, 0, surface.width, surface.height);
          lastScrollFrame = index;
          setReady(true);
        }
      } else if (!media.seeking && media.readyState >= 2 && media.currentTime !== lastTime) {
        lastTime = media.currentTime;
        ctx.clearRect(0, 0, surface.width, surface.height);
        ctx.drawImage(media, 0, 0, surface.width, surface.height);
        const pixels = ctx.getImageData(0, 0, surface.width, surface.height);
        const data = pixels.data;
        for (let i = 0; i < data.length; i += 4) {
          const light = Math.min(data[i], data[i + 1], data[i + 2]);
          data[i + 3] = Math.round(255 * (1 - Math.max(0, Math.min(1, (light - 222) / 30))));
        }
        ctx.putImageData(pixels, 0, 0);
        setReady(true);
      }
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => {
      disposed = true;
      scrollFrames.forEach(image => image.close());
      cancelAnimationFrame(frame);
      media.pause();
      media.removeEventListener('loadedmetadata', start);
      window.removeEventListener('scroll', updateScroll);
      window.removeEventListener('resize', updateScroll);
    };
  }, []);

  return (
    <main className="news-page">
      <SiteHeader news />
      <div ref={track} className="news-hero-track">
      <section className={`news-hero ${ready ? 'is-ready' : ''}`} aria-labelledby="news-title">
        <video ref={video} className="news-video" src="/videos/human-robot-hands.mp4" poster="/images/hands-poster.jpg" muted playsInline preload="auto" aria-hidden="true" />
        <div className="news-type">
          <h1 id="news-title">Human ideas.<br /><span>Extraordinary</span><br /><em>connections.</em></h1>
          <p className="news-tagline">The future is a conversation.</p>
        </div>
        <canvas ref={canvas} className="news-hands" width={1280} height={720} aria-hidden="true" />
      </section>
      </div>
      <NewsJournal />
    </main>
  );
}
