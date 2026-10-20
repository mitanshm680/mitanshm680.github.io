import { motion, useReducedMotion } from 'framer-motion';
import { Download, Github, Linkedin, Play } from 'lucide-react';
import { TypeAnimation } from 'react-type-animation';
import { profile } from '../data/portfolio';
import { useStation } from '../lib/station';
import { Ticker } from './Overlays';
import { RetroTV } from './RetroTV';

export function Hero() {
  const { tuneTo } = useStation();
  const reduce = useReducedMotion();
  const sequence = profile.roles.flatMap((r) => [r, 2200]);

  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { delay, duration: 0.5, ease: 'easeOut' as const },
        };

  return (
    <section
      id="top"
      aria-label="Introduction"
      className="relative overflow-hidden border-b-[6px] border-ink"
      style={{ scrollMarginTop: -16 }}
    >
      <Ticker />
      <div
        aria-hidden="true"
        className="sunburst absolute left-[58%] top-1/2 -ml-[650px] -mt-[650px] h-[1300px] w-[1300px] rounded-full opacity-90"
        style={{ animation: 'spin 240s linear infinite' }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 68% 55%, rgba(28,18,16,0) 0%, rgba(28,18,16,0) 26%, #1C1210 70%)' }}
      />

      <div className="relative mx-auto flex max-w-station flex-wrap items-center gap-x-14 gap-y-16 px-4 pb-20 pt-14 sm:px-8 lg:pb-24 lg:pt-20">
        <div className="flex min-w-0 flex-[1.2_1_460px] flex-col items-start gap-7">
          <motion.h1
            className="mb-3 font-display text-[clamp(48px,6.5vw,94px)] font-normal leading-[0.92] text-newsprint text-extrude"
            style={{ transformOrigin: 'left bottom' }}
            initial={reduce ? false : { opacity: 0, rotate: -12, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, rotate: -4, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 170, damping: 14, delay: 0.15 }}
          >
            {profile.firstName}
            <br />
            {profile.lastName}
          </motion.h1>

          <motion.p
            {...rise(0.35)}
            className="m-0 flex flex-wrap items-baseline gap-x-2 font-screen text-[clamp(24px,2.6vw,32px)] leading-tight"
          >
            <span className="text-tangerine">&gt;</span>
            <span className="text-newsprint">I build</span>
            <span className="text-phosphor">
              <TypeAnimation sequence={sequence} wrapper="span" speed={55} deletionSpeed={70} repeat={Infinity} cursor />
            </span>
          </motion.p>

          <motion.p {...rise(0.45)} className="m-0 max-w-[34rem] text-[19px] leading-relaxed text-parchment">
            Data science grad student at Arizona State and a full-stack developer. I like taking messy data all the way from the
            database to a screen people actually want to use.
          </motion.p>

          <motion.div {...rise(0.55)} className="flex flex-wrap items-center gap-3 pt-1">
            <a
              href="#work"
              onClick={(e) => {
                e.preventDefault();
                tuneTo('work');
              }}
              className="btn-primary"
            >
              <Play className="h-5 w-5 fill-current" aria-hidden="true" />
              See my work
            </a>
            <a href={profile.resume} target="_blank" rel="noopener noreferrer" className="btn-ghost">
              <Download className="h-5 w-5" aria-hidden="true" />
              Résumé
            </a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="icon-btn" aria-label="LinkedIn">
              <Linkedin className="h-6 w-6" aria-hidden="true" />
            </a>
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="icon-btn" aria-label="GitHub">
              <Github className="h-6 w-6" aria-hidden="true" />
            </a>
          </motion.div>

          <motion.ul
            {...rise(0.65)}
            aria-label="At a glance"
            className="m-0 mt-1 flex list-none flex-wrap gap-x-5 gap-y-2.5 p-0 font-screen text-[20px] text-parchment"
          >
            <li className="flex items-center gap-2">
              <span className="rounded border-2 border-parchment px-1.5 text-newsprint">M.S.</span>
              Data Science, Analytics &amp; Eng., May 2027
            </li>
            <li className="flex items-center gap-2">
              <span className="rounded border-2 border-parchment px-1.5 text-newsprint">B.S.</span>
              Computer Science, magna cum laude
            </li>
            <li className="flex items-center gap-2">
              <span className="rounded border-2 border-tomato bg-tomato/20 px-1.5 text-newsprint">LIVE</span>
              Open to SWE &amp; data internships
            </li>
          </motion.ul>
        </div>

        <motion.div
          className="flex min-w-0 flex-[1_1_420px] justify-center"
          initial={reduce ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
        >
          <RetroTV />
        </motion.div>
      </div>
    </section>
  );
}
