import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { channels, type ChannelId } from '../data/portfolio';
import { useScrollProgress } from '../lib/hooks';
import { useStation } from '../lib/station';
import { VcrOsd } from './Overlays';

export function StationBug({ size = 44 }: { size?: number }) {
  return (
    <span
      aria-hidden="true"
      className="flex shrink-0 items-center justify-center rounded-full bg-marigold font-display leading-none text-ink"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.6,
        boxShadow: `0 0 0 ${size * 0.07}px #120B09, 0 0 0 ${size * 0.14}px #E8432E, 0 0 0 ${size * 0.21}px #F07F23`,
      }}
    >
      M
    </span>
  );
}

export function Header() {
  const { tuneTo, active } = useStation();
  const progress = useScrollProgress();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const go = (id: ChannelId) => {
    setMenuOpen(false);
    tuneTo(id);
  };

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 border-b-[3px] border-marigold bg-ink/95 backdrop-blur-sm"
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        <div className="mx-auto flex h-[68px] max-w-station items-center justify-between gap-4 px-4 sm:px-8">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              go('top');
            }}
            className="flex min-h-[48px] items-center gap-5 pl-2 text-newsprint no-underline"
            aria-label="Mitansh Maheshwari, back to top"
          >
            <StationBug size={38} />
            <span className="flex flex-col leading-none">
              <span className="whitespace-nowrap font-screen text-[28px] tracking-[3px]">MM-TV</span>
              <span className="flex items-center gap-1.5 font-screen text-[16px] tracking-[2px] text-parchment">
                <span
                  className="inline-block h-2 w-2 rounded-full bg-tomato"
                  style={{ boxShadow: '0 0 8px 2px #E8432E', animation: 'blink 1.4s steps(1) infinite' }}
                />
                ON AIR<span className="hidden sm:inline"> · CH 680</span>
              </span>
            </span>
          </a>

          <nav aria-label="Channels" className="hidden items-center gap-1.5 xl:flex">
            {channels.map((c) => (
              <a
                key={c.id}
                href={`#${c.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  go(c.id);
                }}
                aria-current={active === c.id ? 'true' : undefined}
                className="chbtn px-3 text-[20px] no-underline"
              >
                <span className="chnum hidden 2xl:inline">{c.num}</span>
                {c.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <VcrOsd />
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="chbtn px-3 text-[19px] xl:hidden"
              aria-expanded={menuOpen}
              aria-controls="channel-guide"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
              Guide
            </button>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="absolute -bottom-[3px] left-0 h-[3px] bg-tomato"
          style={{ width: `${progress * 100}%`, boxShadow: '0 0 8px #E8432E' }}
        />
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="channel-guide"
            role="dialog"
            aria-modal="true"
            aria-label="Channel guide"
            className="fixed inset-0 z-[90] overflow-y-auto bg-ink px-5 pb-10 pt-6"
            initial={{ scaleY: 0.005, opacity: 0.8 }}
            animate={{ scaleY: 1, opacity: 1, transition: { duration: 0.32, ease: 'easeOut' } }}
            exit={{ scaleY: 0.005, opacity: 0, transition: { duration: 0.22 } }}
          >
            <div className="pointer-events-none fixed inset-0 scanlines opacity-50" />
            <div className="relative mx-auto flex max-w-xl flex-col gap-6">
              <div className="flex items-center justify-between">
                <p className="font-display text-[34px] text-marigold" style={{ textShadow: '3px 3px 0 #E8432E' }}>
                  Channel guide
                </p>
                <button type="button" onClick={() => setMenuOpen(false)} className="chbtn" aria-label="Close channel guide">
                  <X className="h-5 w-5" aria-hidden="true" />
                  Close
                </button>
              </div>
              <ul className="flex flex-col gap-3">
                {channels.map((c, i) => (
                  <motion.li
                    key={c.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0, transition: { delay: 0.08 + i * 0.04 } }}
                  >
                    <a
                      href={`#${c.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        go(c.id);
                      }}
                      aria-current={active === c.id ? 'true' : undefined}
                      className="chbtn w-full justify-start py-3 text-[30px] no-underline"
                    >
                      <span className="chnum w-14">{c.num}</span>
                      {c.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
