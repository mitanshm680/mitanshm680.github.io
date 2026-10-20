import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { Github, Play } from 'lucide-react';
import { useState, type PointerEvent } from 'react';
import { filters, projects, type Project, type Tag, type FilterId, matchesFilter } from '../data/portfolio';
import { pad } from '../lib/hooks';
import { useStation } from '../lib/station';
import { Burst } from './ui/Burst';
import { SectionHeading } from './ui/SectionHeading';
import { TapeArt } from './TapeArt';

const RATING: Record<Tag, [string, string]> = {
  data: ['D', 'FOR DATA'],
  fullstack: ['F', 'FULL-STACK'],
  systems: ['S', 'SYSTEMS'],
};

function Sleeve({ p, vol }: { p: Project; vol: number }) {
  const [letter, label] = RATING[p.tags[0]];
  return (
    <>
      <div
        className="flex w-7 shrink-0 items-center justify-center whitespace-nowrap font-screen text-[14px] tracking-[3px] sm:w-10 sm:text-[19px] sm:tracking-[4px]"
        style={{
          background: p.palette.spine,
          color: p.palette.spineInk,
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
        }}
      >
        MM-TV · VOL. {pad(vol)}
      </div>
      <div
        className="relative flex min-w-0 flex-1 flex-col justify-between overflow-hidden p-2.5 sm:p-4"
        style={{ background: p.palette.bg, color: p.palette.ink }}
      >
        <TapeArt cover={p.cover} palette={p.palette} className="absolute -bottom-[6%] -right-[10%] h-[78%] w-[95%]" />
        <div className="relative flex justify-between gap-2 font-screen text-[13px] tracking-[2px] sm:text-[17px]">
          <span>MM VIDEO</span>
          <span className="hidden sm:inline">SP · T-120</span>
        </div>
        <div
          className="relative max-w-full break-words font-display text-[clamp(17px,2.1vw,30px)] leading-[0.98]"
          style={{ color: p.palette.title, textShadow: `3px 3px 0 ${p.palette.shadow}` }}
        >
          {p.coverTitle}
        </div>
        <div className="relative flex items-end justify-between gap-2">
          <span className="flex flex-col items-center border-2 border-ink bg-newsprint px-1.5 py-0.5 font-screen leading-none text-ink">
            <span className="text-[20px] sm:text-[26px]">{letter}</span>
            <span className="hidden text-[12px] tracking-[1px] sm:block">{label}</span>
          </span>
          {p.year && (
            <span className="bg-ink px-1.5 py-0.5 font-screen text-[12px] tracking-[1px] text-marigold sm:text-[15px]">
              {p.year.toUpperCase()}
            </span>
          )}
        </div>
      </div>
    </>
  );
}

function Tape({ p, vol, rest }: { p: Project; vol: number; rest: number }) {
  const { openProject } = useStation();
  const reduce = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const gx = useMotionValue(50);
  const gy = useMotionValue(30);
  const srx = useSpring(rx, { stiffness: 220, damping: 16 });
  const sry = useSpring(ry, { stiffness: 220, damping: 16 });
  const glare = useMotionTemplate`radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,.28), rgba(255,255,255,0) 55%)`;

  const onMove = (e: PointerEvent<HTMLButtonElement>) => {
    if (reduce || e.pointerType === 'touch') return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    ry.set((x - 0.5) * 18);
    rx.set(-(y - 0.5) * 14);
    gx.set(x * 100);
    gy.set(y * 100);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.article
      layout={!reduce}
      initial={reduce ? false : { opacity: 0, scale: 0.85, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={reduce ? undefined : { opacity: 0, scale: 0.8, transition: { duration: 0.18 } }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      className="relative flex flex-col gap-5"
    >
      <div style={{ perspective: 900 }}>
        <motion.button
          type="button"
          onClick={() => openProject(p.id)}
          onPointerMove={onMove}
          onPointerLeave={onLeave}
          aria-label={`Watch ${p.title}`}
          className="relative flex aspect-[3/4] w-full overflow-hidden rounded-md text-left"
          style={{
            rotateX: srx,
            rotateY: sry,
            rotate: rest,
            boxShadow: `0 0 0 3px #F3E6CC, 10px 10px 0 ${p.palette.spine === '#120B09' ? '#E8432E' : p.palette.spine}`,
          }}
          whileHover={reduce ? undefined : { y: -8, rotate: 0 }}
          whileTap={reduce ? undefined : { scale: 0.97 }}
        >
          <Sleeve p={p} vol={vol} />
          <motion.span aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: glare }} />
        </motion.button>
      </div>
      {p.sticker && (
        <Burst
          size={96}
          outer="#F3E6CC"
          inner="#E8432E"
          fontSize={15}
          className="pointer-events-none absolute -right-2 -top-5 z-10 origin-top-right rotate-12 scale-[.7] sm:-right-3 sm:scale-100"
        >
          {p.sticker.split(' ').map((w, i) => (
            <span key={i} className="block">
              {w}
            </span>
          ))}
        </Burst>
      )}
      <div className="flex flex-col items-start gap-2">
        <p className="m-0 font-screen text-[16px] tracking-[1px] text-marigold sm:text-[19px]">
          {[p.year, p.context, p.team ? `Team of ${p.team}` : ''].filter(Boolean).join(' · ')}
        </p>
        <h3 className="m-0 font-expanded text-[16px] font-extrabold uppercase leading-tight sm:text-[21px]">{p.title}</h3>
        <p className="m-0 hidden text-[16px] leading-relaxed text-parchment sm:block">{p.logline}</p>
        <div className="mt-1 flex flex-wrap items-center gap-x-5 gap-y-2">
          <button
            type="button"
            onClick={() => openProject(p.id)}
            className="inline-flex min-h-[44px] items-center gap-2 font-screen text-[19px] tracking-[1px] text-marigold underline decoration-2 underline-offset-[6px] hover:text-tangerine sm:text-[22px]"
          >
            <Play className="h-4 w-4 fill-current" aria-hidden="true" />
            Watch details
          </button>
          {p.code ? (
            <a
              href={p.code}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2 font-screen text-[19px] tracking-[1px] text-newsprint underline decoration-2 underline-offset-[6px] hover:text-marigold sm:text-[22px]"
            >
              <Github className="h-4 w-4" aria-hidden="true" />
              Code
            </a>
          ) : (
            <span className="font-screen text-[16px] text-parchment sm:text-[19px]">Private repo · demo on request</span>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export function Projects() {
  const [filter, setFilter] = useState<FilterId>('all');
  const shown = projects.filter((p) => matchesFilter(p, filter));

  return (
    <section id="work" aria-labelledby="work-title" className="relative overflow-hidden bg-ink py-20 lg:py-28">
      <div className="mx-auto flex max-w-station flex-col gap-14 px-4 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-10">
          <SectionHeading
            num="02"
            id="work-title"
            title="Now showing"
            subtitle={`${projects.length} projects on tape, solo and team, from fraud-detection ML and AI dashboards to a C++ terrain simulator. Press any tape to watch the details.`}
          />
          {/* marquee lights */}
          <div
            aria-hidden="true"
            className="bulbs hidden rounded-2xl p-[22px] shadow-[0_0_0_4px_#120B09,0_0_0_8px_#E8432E,0_0_48px_rgba(246,178,27,.35)] lg:block"
          >
            <div className="rounded-lg bg-espresso px-10 py-4 text-center shadow-[inset_0_0_0_3px_#F07F23]">
              <p className="m-0 font-screen text-[22px] tracking-[6px] text-tangerine">TONIGHT ONLY</p>
              <p
                className="m-0 font-display text-[40px] leading-none text-marigold"
                style={{ textShadow: '0 0 14px rgba(246,178,27,.5)' }}
              >
                {pad(shown.length)} features
              </p>
            </div>
          </div>
        </div>

        <div role="group" aria-label="Filter projects" className="flex flex-wrap gap-2.5">
          {filters.map((f) => {
            const n = projects.filter((p) => matchesFilter(p, f.id)).length;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                aria-pressed={filter === f.id}
                aria-current={filter === f.id ? 'true' : undefined}
                className="chbtn"
              >
                {f.label}
                <span className="chnum">{n}</span>
              </button>
            );
          })}
        </div>

        <motion.div
          layout
          className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-[repeat(auto-fill,minmax(250px,1fr))] sm:gap-x-9 sm:gap-y-14"
        >
          <AnimatePresence mode="popLayout">
            {shown.map((p) => (
              <Tape key={p.id} p={p} vol={projects.indexOf(p) + 1} rest={projects.indexOf(p) % 2 ? 1.4 : -1.6} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
