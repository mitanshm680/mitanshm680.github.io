import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { prefersReducedMotion } from '../lib/hooks';

const LINES: { text: string; status?: string }[] = [
  { text: 'MM-BIOS v6.80   (C) MAHESHWARI BROADCASTING SYSTEMS' },
  { text: '' },
  { text: 'CPU: CURIOSITY @ 4.00 GHz', status: 'OK' },
  { text: 'MEMORY TEST: 640K', status: 'OK' },
  { text: 'LOADING python.sys', status: 'OK' },
  { text: 'LOADING react.drv', status: 'OK' },
  { text: 'LOADING postgres.db', status: 'OK' },
  { text: 'LOADING gemini.ai', status: 'OK' },
  { text: 'MOUNTING /asu/ms-data-science', status: 'MAY 2027' },
  { text: 'TUNING TO CHANNEL 680', status: 'LOCKED' },
];

const KEY = 'mm680-booted';

function shouldBoot() {
  if (prefersReducedMotion()) return false;
  try {
    return !window.sessionStorage.getItem(KEY);
  } catch {
    return false;
  }
}

/** Amber-terminal power-on sequence. Plays once per browser session; any key or click skips it. */
export function BootSequence() {
  const [show, setShow] = useState(shouldBoot);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!show) return;
    try {
      window.sessionStorage.setItem(KEY, '1');
    } catch {
      /* ignore */
    }
    const iv = window.setInterval(() => setCount((c) => c + 1), 140);
    const done = window.setTimeout(() => setShow(false), 140 * (LINES.length + 4));
    const skip = () => setShow(false);
    window.addEventListener('keydown', skip);
    return () => {
      window.clearInterval(iv);
      window.clearTimeout(done);
      window.removeEventListener('keydown', skip);
    };
  }, [show]);

  const progress = Math.min(1, count / LINES.length);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="boot"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0b0806] px-5"
          onClick={() => setShow(false)}
          exit={{
            scaleY: [1, 0.006, 0.006],
            scaleX: [1, 1, 0],
            filter: ['brightness(1)', 'brightness(3)', 'brightness(6)'],
            transition: { duration: 0.55, times: [0, 0.65, 1], ease: 'easeIn' },
          }}
          role="dialog"
          aria-label="Loading"
        >
          <div className="pointer-events-none absolute inset-0 scanlines opacity-60" />
          <div className="relative w-full max-w-[680px] font-screen text-[clamp(17px,2.6vw,24px)] leading-snug text-phosphor">
            {LINES.slice(0, count).map((l, i) => (
              <div key={i} className="flex min-h-[1.375em] gap-2 whitespace-pre">
                <span className="shrink-0">{l.text}</span>
                {l.status ? (
                  <>
                    <span aria-hidden="true" className="min-w-0 flex-1 overflow-hidden opacity-50">
                      {'.'.repeat(90)}
                    </span>
                    <span className="shrink-0">{l.status}</span>
                  </>
                ) : null}
              </div>
            ))}
            <div className="mt-5 flex items-center gap-3">
              <div className="h-4 flex-1 overflow-hidden rounded-sm border-2 border-marigold/80 p-[2px]">
                <div
                  className="h-full bg-marigold transition-[width] duration-150"
                  style={{ width: `${progress * 100}%`, boxShadow: '0 0 10px rgba(246,178,27,.8)' }}
                />
              </div>
              <span>{Math.round(progress * 100)}%</span>
            </div>
            <p className="mt-6 opacity-70">
              PRESS ANY KEY TO SKIP<span style={{ animation: 'caret 1s steps(1) infinite' }}>_</span>
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
