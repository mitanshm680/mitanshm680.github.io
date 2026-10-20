import { useEffect, useState } from 'react';
import { projectById, tvChannels, type Project } from '../data/portfolio';
import { pad } from '../lib/hooks';
import { useStation } from '../lib/station';
import { Burst } from './ui/Burst';
import { ColorBars } from './ui/ColorBars';
import { TapeArt } from './TapeArt';

type Channel =
  | { kind: 'bars'; short: string; name: string }
  | { kind: 'project'; short: string; name: string; project: Project }
  | { kind: 'terminal'; short: string; name: string };

const SHORT: Record<string, string> = {
  smartbrief: 'NEWS',
  'career-planner': 'PATH',
  jet2holiday: 'FLY',
  inventory: 'STOCK',
};

const CHANNELS: Channel[] = [
  { kind: 'bars', short: 'TEST', name: 'Test pattern' },
  ...tvChannels.map((id) => {
    const project = projectById(id)!;
    return { kind: 'project' as const, short: SHORT[id] ?? id.toUpperCase(), name: project.title, project };
  }),
  { kind: 'terminal', short: 'SQL', name: 'Terminal' },
];

const QUERY = `mm680=> SELECT project, stack
         FROM portfolio
         WHERE shipped = true
         ORDER BY impact DESC
         LIMIT 4;`;
const RESULT = ` project        | stack
----------------+-------------------
 smartbrief     | fastapi, mongodb
 career_planner | neo4j, react
 jet2holiday    | postgres, express
 inventory_ms   | fastapi, sqlite
(4 rows)

mm680=> `;

function Terminal({ live }: { live: boolean }) {
  const [n, setN] = useState(0);
  const full = QUERY + '\n' + RESULT;
  useEffect(() => {
    if (!live) return;
    setN(0);
    let i = 0;
    const iv = window.setInterval(() => {
      // type the query a character at a time, then dump the result rows fast
      i += i < QUERY.length ? 1 : 9;
      setN(Math.min(i, full.length));
      if (i >= full.length) window.clearInterval(iv);
    }, 28);
    return () => window.clearInterval(iv);
  }, [live, full.length]);
  return (
    <div className="absolute inset-0 flex flex-col justify-end overflow-hidden bg-[#0d0a07] px-[7%] pb-[7%] pt-[16%] font-screen text-[clamp(10px,1.1vw,15px)] leading-[1.15] text-phosphor">
      <pre className="m-0 whitespace-pre font-screen">
        {full.slice(0, n)}
        <span style={{ animation: 'caret 1s steps(1) infinite' }}>█</span>
      </pre>
    </div>
  );
}

/** The hero TV. Turn the dial or punch a preset to surf featured projects. */
export function RetroTV() {
  const { openProject } = useStation();
  const [ch, setCh] = useState(0);
  const [power, setPower] = useState(true);
  const [tuning, setTuning] = useState(false);
  const current = CHANNELS[ch];

  const change = (next: number) => {
    setPower(true);
    setTuning(true);
    window.setTimeout(() => setTuning(false), 220);
    setCh((next + CHANNELS.length) % CHANNELS.length);
  };

  const step = 360 / CHANNELS.length;

  return (
    <div className="flex w-full flex-col items-center gap-5">
      <div className="relative w-full max-w-[580px] pt-[108px]">
        {/* rabbit ears */}
        <div aria-hidden="true" className="absolute left-1/2 top-0 h-[112px] w-0">
          <div className="absolute bottom-3 left-[-2px] h-[126px] w-1 origin-bottom -rotate-[32deg] rounded bg-[#BFAE90]">
            <div className="absolute -left-[5px] -top-[7px] h-3.5 w-3.5 rounded-full bg-newsprint" />
          </div>
          <div className="absolute bottom-3 left-[-2px] h-[116px] w-1 origin-bottom rotate-[26deg] rounded bg-[#BFAE90]">
            <div className="absolute -left-[5px] -top-[7px] h-3.5 w-3.5 rounded-full bg-newsprint" />
          </div>
          <div className="absolute -left-9 bottom-0 h-8 w-[72px] rounded-t-[36px] rounded-b-md bg-[#3A2A22] shadow-[inset_0_3px_0_rgba(255,255,255,.14)]" />
        </div>

        <Burst size={112} className="absolute -right-3 top-[64px] z-10" style={{ animation: 'wobble 3s ease-in-out infinite' }}>
          Now in
          <br />
          color!
        </Burst>

        {/* cabinet */}
        <div className="woodgrain relative flex flex-wrap gap-5 rounded-[30px] p-6 shadow-[inset_0_0_0_4px_#3A2010,inset_0_8px_0_rgba(255,255,255,.10),inset_0_-10px_0_rgba(0,0,0,.25),0_36px_60px_rgba(0,0,0,.55)]">
          <div className="flex min-w-0 flex-[1_1_300px] flex-col justify-center rounded-[26px] bg-[#1A1714] p-3.5 shadow-[inset_0_0_0_3px_#0B0908,inset_0_0_24px_rgba(0,0,0,.8),0_2px_0_rgba(255,255,255,.15)]">
            <div
              className="relative aspect-[4/3] overflow-hidden bg-[#0A0A0A]"
              style={{ borderRadius: '34px / 28px', animation: 'flicker 7s linear infinite' }}
            >
              {power && current.kind === 'bars' && (
                <div className="absolute inset-0">
                  <ColorBars className="absolute inset-0" />
                  <div className="absolute left-1/2 top-[36%] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-0.5 whitespace-nowrap rounded-[10px] border-[3px] border-newsprint bg-ink px-4 py-2 text-center">
                    <span className="font-display text-[clamp(20px,2.4vw,28px)] leading-tight text-marigold">MM-TV 680</span>
                    <span className="font-screen text-[clamp(14px,1.5vw,18px)] tracking-[2px] text-newsprint">
                      TURN THE DIAL TO TUNE IN
                    </span>
                  </div>
                </div>
              )}

              {power && current.kind === 'project' && (
                <button
                  type="button"
                  onClick={() => openProject(current.project.id)}
                  className="group absolute inset-0 flex flex-col justify-between overflow-hidden p-[8%] text-left"
                  style={{ background: current.project.palette.bg, color: current.project.palette.ink }}
                  aria-label={`Open project: ${current.project.title}`}
                >
                  <TapeArt
                    cover={current.project.cover}
                    palette={current.project.palette}
                    className="absolute -right-[6%] top-[6%] h-[72%] w-[62%] opacity-90 transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="relative font-screen text-[clamp(14px,1.6vw,20px)] tracking-[2px]">EPISODE {pad(ch)}</span>
                  <span className="relative flex flex-col gap-2">
                    <span
                      className="max-w-[78%] font-display text-[clamp(24px,3.2vw,40px)] leading-[0.95]"
                      style={{ color: current.project.palette.title, textShadow: `3px 3px 0 ${current.project.palette.shadow}` }}
                    >
                      {current.project.coverTitle}
                    </span>
                    <span className="font-screen text-[clamp(14px,1.5vw,19px)] tracking-[1px] underline decoration-2 underline-offset-4 group-hover:no-underline">
                      ▶ PRESS TO WATCH
                    </span>
                  </span>
                </button>
              )}

              {power && current.kind === 'terminal' && <Terminal live={power && current.kind === 'terminal'} />}

              {!power && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-7 bg-[#050505]">
                  <div aria-hidden="true" className="h-2 w-2 rounded-full bg-white shadow-[0_0_18px_6px_rgba(255,255,255,.55)]" />
                  <span className="font-screen text-[18px] tracking-[3px] text-[#9A9A9A]">SIGNAL OFF · PRESS POWER</span>
                </div>
              )}

              {tuning && <div aria-hidden="true" className="static-noise absolute inset-0" />}

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-[22%]"
                style={{
                  background: 'linear-gradient(rgba(255,255,255,0), rgba(255,255,255,.08), rgba(255,255,255,0))',
                  animation: 'roll 6s linear infinite',
                }}
              />
              <div aria-hidden="true" className="scanlines pointer-events-none absolute inset-0" />
              <div
                aria-hidden="true"
                className="glass pointer-events-none absolute inset-0"
                style={{ borderRadius: '34px / 28px' }}
              />
              {power && (
                <div
                  aria-live="polite"
                  className="pointer-events-none absolute right-[8%] top-[7%] font-screen text-[clamp(20px,2.6vw,30px)] tracking-[2px] text-white"
                  style={{ textShadow: '0 0 6px rgba(255,255,255,.7), 2px 2px 0 #000' }}
                >
                  <span className="sr-only">
                    Channel {ch}: {current.name}
                  </span>
                  <span aria-hidden="true">CH {pad(ch)}</span>
                </div>
              )}
            </div>
          </div>

          {/* control panel */}
          <div className="brushed flex flex-[1_1_112px] flex-col items-center justify-between gap-4 rounded-[18px] px-3 py-4 text-ink shadow-[inset_0_0_0_3px_#3A2010,inset_0_4px_0_rgba(255,255,255,.35)] max-[520px]:flex-row max-[520px]:flex-wrap max-[520px]:justify-around">
            <span className="font-display text-[18px] leading-none">MM·Vision</span>
            <div className="flex flex-col items-center gap-1.5">
              <button
                type="button"
                onClick={() => change(ch + 1)}
                aria-label="Next channel"
                className="relative h-[76px] w-[76px] rounded-full border-[3px] border-ink p-0 shadow-[0_4px_0_#120B09,inset_0_-4px_6px_rgba(0,0,0,.25)]"
                style={{ background: 'radial-gradient(circle at 35% 30%, #F3E6CC, #9C8A6C 70%)' }}
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-2 rounded-full"
                  style={{
                    background: 'repeating-conic-gradient(#8A7858 0deg 6deg, #B5A27F 6deg 12deg)',
                    transform: `rotate(${ch * step}deg)`,
                    transition: 'transform .45s cubic-bezier(.3,1.6,.5,1)',
                  }}
                >
                  <span className="absolute left-1/2 top-[3px] h-[18px] w-1.5 -translate-x-1/2 rounded bg-tomato" />
                </span>
              </button>
              <span className="font-screen text-[17px] tracking-[2px]">CHANNEL</span>
            </div>
            <div
              aria-hidden="true"
              className="grille min-h-[56px] w-full flex-auto rounded-[10px] shadow-[inset_0_0_0_2px_#3A2010] max-[520px]:hidden"
            />
            <button
              type="button"
              onClick={() => setPower((p) => !p)}
              aria-pressed={power}
              className="flex min-h-[44px] items-center gap-2 rounded-full border-[3px] border-ink bg-ink px-3.5 font-screen text-[18px] tracking-[2px] text-newsprint"
            >
              <span
                aria-hidden="true"
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: power ? '#E8432E' : '#4A3A30', boxShadow: power ? '0 0 8px #E8432E' : 'none' }}
              />
              POWER
            </button>
          </div>
        </div>
        <div aria-hidden="true" className="flex justify-between px-16">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="h-[22px] w-12 bg-[#2A1810]"
              style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 20% 100%)' }}
            />
          ))}
        </div>
      </div>

      <div role="group" aria-label="Channel presets" className="flex flex-wrap justify-center gap-2.5">
        {CHANNELS.map((c, i) => {
          const on = power && i === ch;
          return (
            <button
              key={c.short}
              type="button"
              onClick={() => change(i)}
              aria-label={`Channel ${i}: ${c.name}`}
              aria-pressed={on}
              className={`flex min-h-[56px] min-w-[64px] flex-col items-center justify-center rounded-lg border-[3px] border-ink px-2.5 font-screen leading-none transition-transform ${
                on
                  ? 'translate-y-1 bg-marigold text-ink shadow-[0_1px_0_#120B09]'
                  : 'bg-bark text-newsprint shadow-[0_5px_0_#120B09] hover:bg-umber'
              }`}
            >
              <span className="text-[28px]">{i}</span>
              <span className="text-[15px] tracking-[1px]">{c.short}</span>
            </button>
          );
        })}
      </div>
      <p className="m-0 text-center font-screen text-[20px] tracking-[1px] text-parchment">
        Turn the dial, punch a preset, or press the screen to watch a project.
      </p>
    </div>
  );
}
