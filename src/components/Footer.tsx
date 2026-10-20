import { ChevronUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { profile } from '../data/portfolio';
import { pad } from '../lib/hooks';
import { useStation } from '../lib/station';
import { ColorBars } from './ui/ColorBars';

const BADGES: [string, string, string, string][] = [
  ['REACT', 'BUILT WITH', '#F6B21B', '#120B09'],
  ['TS', 'TYPE SCRIPT', '#E8432E', '#F3E6CC'],
  ['CSS', 'TAILWIND', '#4F5D2F', '#F3E6CC'],
  ['FM', 'FRAMER MOTION', '#F07F23', '#120B09'],
  ['GH', 'PAGES HOSTED', '#F3E6CC', '#120B09'],
];

function Uptime() {
  const [s, setS] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const iv = window.setInterval(() => setS(Math.floor((Date.now() - start) / 1000)), 1000);
    return () => window.clearInterval(iv);
  }, []);
  const digits = `${pad(Math.floor(s / 3600))}${pad(Math.floor((s % 3600) / 60))}${pad(s % 60)}`;
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <span className="font-screen text-[22px] tracking-[3px]">YOU’VE BEEN TUNED IN FOR</span>
      <span className="flex gap-1" aria-label={`${Math.floor(s / 60)} minutes ${s % 60} seconds`} role="timer">
        {digits.split('').map((d, i) => (
          <span key={i} className="flex items-center">
            <span className="inline-flex h-11 w-8 items-center justify-center rounded border-2 border-umber bg-gradient-to-b from-bark from-50% to-espresso to-50% font-screen text-[34px] text-marigold">
              {d}
            </span>
            {(i === 1 || i === 3) && <span className="px-0.5 font-screen text-[28px] text-marigold">:</span>}
          </span>
        ))}
      </span>
    </div>
  );
}

export function Footer() {
  const { tuneTo } = useStation();
  return (
    <footer className="relative bg-ink text-newsprint">
      <ColorBars variant="strip" className="h-[22px]" />
      <div className="mx-auto flex max-w-station flex-col items-center gap-9 px-4 py-16 text-center sm:px-8 lg:pb-24">
        <p className="m-0 max-w-[16em] font-display text-[clamp(36px,5vw,64px)] leading-none">
          This concludes our broadcast day.
        </p>
        <p className="m-0 max-w-[36em] text-[17px] leading-relaxed text-parchment">
          Thanks for watching Channel 680. Designed and built by {profile.name} with React, TypeScript, Tailwind and one stubborn
          cathode-ray heart.
        </p>
        <Uptime />
        <ul aria-label="Built with" className="m-0 flex list-none flex-wrap justify-center gap-2 p-0">
          {BADGES.map(([a, b, bg, fg]) => (
            <li
              key={b}
              className="flex h-[31px] w-[88px] overflow-hidden border border-newsprint font-screen text-[14px] leading-none"
            >
              <span className="flex w-9 shrink-0 items-center justify-center" style={{ background: bg, color: fg }}>
                {a}
              </span>
              <span className="flex flex-1 items-center justify-center bg-ink px-0.5 text-center text-marigold">{b}</span>
            </li>
          ))}
        </ul>
        <p className="m-0 font-screen text-[19px] tracking-[1px] text-parchment">Secret channel: ↑ ↑ ↓ ↓ ← → ← → B A</p>
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            tuneTo('top');
          }}
          className="chbtn border-marigold bg-marigold px-5 text-ink no-underline"
        >
          <ChevronUp className="h-5 w-5" aria-hidden="true" />
          Back to the top
        </a>
        <p className="m-0 font-screen text-[18px] tracking-[2px] text-parchment">
          © {new Date().getFullYear()} MITANSH MAHESHWARI · PLEASE BE KIND, REWIND
        </p>
      </div>
    </footer>
  );
}
