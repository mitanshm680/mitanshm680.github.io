import { useEffect, useState } from 'react';
import { prefersReducedMotion, useSeenOnce } from '../../lib/hooks';

const NOISE = '!<>-_\\/[]{}—=+*^?#01';

/** Decodes text from noise the first time it scrolls into view (terminal-style). */
export function Scramble({ text, className = '', speed = 28 }: { text: string; className?: string; speed?: number }) {
  const [ref, seen] = useSeenOnce<HTMLSpanElement>(0.5);
  const [out, setOut] = useState(text);

  useEffect(() => {
    if (!seen || prefersReducedMotion()) {
      setOut(text);
      return;
    }
    let frame = 0;
    const total = text.length + 12;
    const iv = window.setInterval(() => {
      frame += 1;
      const revealed = Math.max(0, frame - 6);
      setOut(
        text
          .split('')
          .map((ch, i) => (ch === ' ' || i < revealed ? ch : NOISE[Math.floor(Math.random() * NOISE.length)]))
          .join(''),
      );
      if (frame >= total) {
        window.clearInterval(iv);
        setOut(text);
      }
    }, speed);
    return () => window.clearInterval(iv);
  }, [seen, text, speed]);

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{out}</span>
    </span>
  );
}
