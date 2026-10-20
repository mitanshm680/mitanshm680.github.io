import { useEffect, useState } from 'react';
import { prefersReducedMotion, useSeenOnce } from '../../lib/hooks';

const GLYPHS = '0123456789+#%ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/** One split-flap tile that riffles through glyphs before landing on `char`. */
function Flap({ char, delay, run, dark }: { char: string; delay: number; run: boolean; dark: boolean }) {
  const [shown, setShown] = useState(run ? ' ' : char);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!run) {
      setShown(char);
      return;
    }
    if (prefersReducedMotion()) {
      setShown(char);
      return;
    }
    let n = 0;
    const flips = 8 + Math.floor(delay / 60);
    let iv = 0;
    const start = window.setTimeout(() => {
      iv = window.setInterval(() => {
        n += 1;
        setTick((t) => t + 1);
        if (n >= flips) {
          window.clearInterval(iv);
          setShown(char);
        } else {
          setShown(GLYPHS[Math.floor(Math.random() * GLYPHS.length)]);
        }
      }, 55);
    }, delay);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(iv);
    };
  }, [char, delay, run]);

  return (
    <span
      className={`relative inline-flex h-[1.35em] w-[0.86em] items-center justify-center overflow-hidden rounded-[4px] font-screen leading-none ${
        dark ? 'bg-ink text-marigold' : 'bg-bark text-marigold'
      }`}
      style={{ boxShadow: 'inset 0 -2px 0 rgba(0,0,0,.5), 0 1px 0 rgba(255,255,255,.08)' }}
    >
      <span key={tick} className="relative z-0" style={{ animation: run ? 'osd-in 60ms linear' : undefined }}>
        {shown === ' ' ? ' ' : shown}
      </span>
      <span aria-hidden="true" className="absolute inset-x-0 top-1/2 z-10 h-px bg-black/70" />
    </span>
  );
}

/** A split-flap departure-board readout. Text is announced once, as a whole. */
export function SplitFlap({ text, className = '', dark = false }: { text: string; className?: string; dark?: boolean }) {
  const [ref, seen] = useSeenOnce<HTMLSpanElement>(0.6);
  return (
    <span ref={ref} className={`inline-flex gap-[3px] ${className}`}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="inline-flex gap-[3px]">
        {text.split('').map((c, i) => (
          <Flap key={i} char={c} delay={i * 90} run={seen} dark={dark} />
        ))}
      </span>
    </span>
  );
}
