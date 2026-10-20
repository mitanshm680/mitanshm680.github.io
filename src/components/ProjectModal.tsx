import { motion, useReducedMotion } from 'framer-motion';
import { ExternalLink, Github, Users } from 'lucide-react';
import { projectById, projects } from '../data/portfolio';
import { pad } from '../lib/hooks';
import { useStation } from '../lib/station';
import { Modal } from './ui/Modal';
import { Scramble } from './ui/Scramble';
import { TapeArt } from './TapeArt';

/** The VCR: a project plays on the screen, the details sit on the deck below. */
export function ProjectModal() {
  const { projectId, closeProject } = useStation();
  const reduce = useReducedMotion();
  const p = projectId ? projectById(projectId) : undefined;
  const vol = p ? projects.indexOf(p) + 1 : 0;

  return (
    <Modal open={!!p} onClose={closeProject} label={p ? p.title : 'Project'}>
      {p && (
        <div className="overflow-hidden rounded-[22px] border-4 border-ink bg-[#1A1714] shadow-[14px_14px_0_#E8432E]">
          <div className="p-3 sm:p-4">
            <div
              className="relative flex min-h-[230px] flex-col justify-between overflow-hidden p-6 sm:aspect-[16/7] sm:min-h-0 sm:p-8"
              style={{ background: p.palette.bg, color: p.palette.ink, borderRadius: '26px / 20px' }}
            >
              <motion.div
                className="absolute -right-[2%] top-[4%] h-[96%] w-[52%] sm:w-[40%]"
                initial={reduce ? false : { opacity: 0, x: 40, rotate: 6 }}
                animate={{ opacity: 0.95, x: 0, rotate: 0 }}
                transition={{ delay: 0.35, type: 'spring', stiffness: 160, damping: 16 }}
              >
                <TapeArt cover={p.cover} palette={p.palette} className="h-full w-full" />
              </motion.div>
              <div
                className="relative flex items-center gap-3 font-screen text-[22px] tracking-[2px]"
                style={{ textShadow: 'none' }}
              >
                <span style={{ animation: 'blink 1.2s steps(1) infinite' }}>▶</span> PLAY
                <span className="opacity-80">VOL. {pad(vol)}</span>
              </div>
              <motion.h2
                className="relative max-w-[70%] font-display text-[clamp(32px,5vw,58px)] font-normal leading-[0.95]"
                style={{ color: p.palette.title, textShadow: `4px 4px 0 ${p.palette.shadow}` }}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
              >
                {p.title}
              </motion.h2>
              <div aria-hidden="true" className="scanlines pointer-events-none absolute inset-0 opacity-60" />
              <div
                aria-hidden="true"
                className="glass pointer-events-none absolute inset-0"
                style={{ borderRadius: '26px / 20px' }}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 bg-gradient-to-b from-[#3A3530] to-[#221E1A] px-5 py-3 shadow-[inset_0_2px_0_rgba(255,255,255,.12)]">
            <div
              aria-hidden="true"
              className="h-4 min-w-[80px] flex-1 rounded-sm bg-[#0B0908] shadow-[inset_0_3px_4px_rgba(0,0,0,.8)]"
            />
            <div className="rounded-md bg-[#0F0C0A] px-4 py-1 font-screen text-[24px] tracking-[3px] text-phosphor shadow-[inset_0_0_0_2px_#000]">
              <Scramble text={`${(p.year || 'NOW').toUpperCase()} · ${p.context.toUpperCase()}`} speed={22} />
            </div>
          </div>

          <motion.div
            className="on-light flex flex-col gap-5 bg-newsprint p-6 text-ink sm:p-8"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="m-0 text-[20px] font-medium leading-relaxed">{p.logline}</p>
            {p.team && (
              <div className="flex flex-col gap-2 rounded-lg border-[3px] border-dashed border-ink bg-marigold/25 p-4">
                <p className="m-0 flex flex-wrap items-center gap-2 font-screen text-[20px] tracking-[2px]">
                  <Users className="h-5 w-5" aria-hidden="true" />
                  TEAM PROJECT · {p.team} PEOPLE
                </p>
                {p.role ? (
                  <p className="m-0 text-[17px] leading-relaxed">
                    <span className="font-bold">My part: </span>
                    {p.role}
                  </p>
                ) : (
                  <p className="m-0 text-[17px] leading-relaxed">
                    Ongoing project. I’m one of {p.team} teammates building it this semester.
                  </p>
                )}
              </div>
            )}
            <ul className="m-0 flex list-none flex-col gap-3 p-0">
              {p.bullets.map((b, i) => (
                <motion.li
                  key={i}
                  className="flex gap-3 text-[17px] leading-relaxed"
                  initial={reduce ? false : { opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.55 + i * 0.08 }}
                >
                  <span aria-hidden="true" className="mt-[9px] h-2.5 w-2.5 shrink-0 rotate-45 bg-tomato" />
                  <span>{b}</span>
                </motion.li>
              ))}
            </ul>
            <ul aria-label="Built with" className="m-0 flex list-none flex-wrap gap-2 p-0">
              {p.tech.map((t) => (
                <li key={t} className="chip border-ink bg-white/50">
                  {t}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3 pt-1">
              {p.code ? (
                <a href={p.code} target="_blank" rel="noopener noreferrer" className="btn-primary">
                  <Github className="h-5 w-5" aria-hidden="true" />
                  View code on GitHub
                </a>
              ) : (
                <a href="#contact" className="btn-primary" onClick={() => closeProject()}>
                  <ExternalLink className="h-5 w-5" aria-hidden="true" />
                  Ask me for a demo
                </a>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </Modal>
  );
}
