import { AnimatePresence, motion } from 'framer-motion';
import { channels, ticker } from '../data/portfolio';
import { pad, useScrollProgress } from '../lib/hooks';
import { useStation } from '../lib/station';

/** Burst of static + channel number when you change sections from the nav. */
export function ChannelOverlay() {
  const { staticOn, osd } = useStation();
  return (
    <>
      {staticOn && (
        <div aria-hidden="true" className="static-noise pointer-events-none fixed inset-0 z-[75] opacity-90 mix-blend-normal">
          <div className="absolute inset-0 scanlines" />
        </div>
      )}
      <AnimatePresence>
        {osd && (
          <motion.div
            key={osd.key}
            aria-live="polite"
            className="pointer-events-none fixed right-5 top-[88px] z-[76] text-right font-screen text-white sm:right-8"
            style={{ textShadow: '0 0 8px rgba(255,255,255,.7), 3px 3px 0 #000' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
          >
            <div className="text-[clamp(40px,6vw,64px)] leading-none">CH {osd.num}</div>
            <div className="text-[24px] tracking-[3px]">{osd.label.toUpperCase()}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/** VCR-style counter for the header: scroll position as tape time. */
export function VcrOsd() {
  const p = useScrollProgress();
  const { active } = useStation();
  const total = 12 * 60 + 34; // a 12:34 "runtime"
  const t = Math.round(p * total);
  const label = channels.find((c) => c.id === active);
  return (
    <div
      aria-hidden="true"
      className="hidden select-none items-center gap-2 rounded-md bg-[#0F0C0A] px-3 py-1 font-screen text-[20px] leading-none text-phosphor shadow-[inset_0_0_0_2px_#000] min-[1360px]:flex"
    >
      <span>▶</span>
      <span className="tabular-nums">
        0:{pad(Math.floor(t / 60))}:{pad(t % 60)}
      </span>
      <span className="opacity-70">{label ? `CH${label.num}` : 'CH680'}</span>
    </div>
  );
}

export function Toast() {
  const { toastMessage } = useStation();
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-6 z-[85] flex justify-center px-4"
      role="status"
      aria-live="polite"
    >
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            key={toastMessage.key}
            initial={{ opacity: 0, y: 20, scaleY: 0.2 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: 10 }}
            className="rounded-md border-[3px] border-marigold bg-ink px-5 py-2 font-screen text-[24px] tracking-wider text-phosphor shadow-[6px_6px_0_#E8432E]"
          >
            {toastMessage.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Ticker() {
  const items = ticker.map((t) => (
    <span key={t} className="flex items-center gap-4">
      <span aria-hidden="true" className="text-tomato">
        ★
      </span>
      {t}
    </span>
  ));
  return (
    <div className="relative z-10 overflow-hidden border-b-[3px] border-ink bg-marigold text-ink">
      <p className="sr-only">{ticker.join('. ')}</p>
      <div aria-hidden="true" className="flex w-max" style={{ animation: 'ticker 55s linear infinite' }}>
        <div className="flex gap-12 whitespace-nowrap py-2 pr-12 font-screen text-[24px] tracking-wide">{items}</div>
        <div className="flex gap-12 whitespace-nowrap py-2 pr-12 font-screen text-[24px] tracking-wide">{items}</div>
      </div>
    </div>
  );
}
