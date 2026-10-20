import { motion, useReducedMotion } from 'framer-motion';
import { ExternalLink, Github, Trophy } from 'lucide-react';
import { hackathons } from '../data/portfolio';
import { Burst } from './ui/Burst';
import { SectionHeading } from './ui/SectionHeading';
import { SplitFlap } from './ui/SplitFlap';

export function Hackathons() {
  const reduce = useReducedMotion();
  return (
    <section id="hackathons" aria-labelledby="hackathons-title" className="relative overflow-hidden bg-avocado py-20 lg:py-28">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-60"
        style={{
          background: 'repeating-conic-gradient(from 0deg at 50% 110%, rgba(18,11,9,.16) 0deg 5deg, rgba(18,11,9,0) 5deg 10deg)',
        }}
      />
      <div className="relative mx-auto flex max-w-station flex-col gap-14 px-4 sm:px-8">
        <SectionHeading
          num="04"
          id="hackathons-title"
          title="Game night"
          subtitle={`${hackathons.length} hackathons, each a blank repo, a ticking clock and a working demo at the buzzer.`}
        />

        <ol className="m-0 flex list-none flex-wrap items-end justify-center gap-x-8 gap-y-16 p-0 pt-8">
          {hackathons.map((h, i) => (
            <motion.li
              key={h.event}
              className={`relative flex w-full flex-col self-stretch md:w-[calc((100%-4rem)/3)]`}
              initial={reduce ? false : { y: 48, rotate: [-2, 1.5, -1, 2, -1.5][i % 5] }}
              whileInView={{ y: 0, rotate: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ delay: i * 0.12, type: 'spring', stiffness: 180, damping: 18 }}
            >
              {h.winner && (
                <Burst
                  size={118}
                  className="absolute -right-4 -top-16 z-10"
                  style={{ animation: 'wobble 2.6s ease-in-out infinite' }}
                  fontSize={16}
                >
                  3rd of
                  <br />
                  130+
                  <br />
                  teams!
                </Burst>
              )}
              {/* scoreboard */}
              <div className={`rounded-t-2xl p-3 ${h.winner ? 'bulbs' : 'bg-[#3A2010]'}`}>
                <div className="flex min-h-[96px] flex-col items-center justify-center gap-1 rounded-lg bg-ink px-4 py-3 text-center shadow-[inset_0_0_0_3px_#F07F23]">
                  <span className="font-screen text-[19px] tracking-[3px] text-tangerine">{h.event.toUpperCase()}</span>
                  {h.winner ? (
                    <span className="flex items-center gap-3">
                      <SplitFlap text="3RD" className="text-[30px]" />
                      <span className="font-screen text-[30px] tracking-[2px] text-marigold">PLACE</span>
                    </span>
                  ) : (
                    <span className="font-screen text-[30px] tracking-[2px] text-marigold">{h.award.toUpperCase()}</span>
                  )}
                </div>
              </div>
              {/* podium */}
              <div className="on-light flex flex-1 flex-col gap-3 rounded-b-2xl border-x-4 border-b-4 border-ink bg-newsprint p-6 text-ink shadow-[10px_10px_0_#120B09]">
                <p className="m-0 flex items-center gap-2 font-display text-[30px] leading-tight">
                  {h.winner && <Trophy className="h-7 w-7 text-brick" aria-label="Winner" />}
                  {h.project}
                </p>
                <p className="m-0 text-[16px] leading-relaxed">{h.description}</p>
                {h.role && (
                  <p className="m-0 rounded-md border-2 border-dashed border-ink bg-marigold/25 px-3 py-2 text-[15px] leading-relaxed">
                    <span className="font-screen text-[18px] tracking-[1px]">MY PART </span>
                    {h.role}
                  </p>
                )}
                <ul aria-label="Built with" className="m-0 flex list-none flex-wrap gap-1.5 p-0">
                  {h.tech.map((t) => (
                    <li key={t} className="chip border-ink text-[16px]">
                      {t}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex flex-wrap gap-x-5 gap-y-2 pt-2">
                  <a
                    href={h.code}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center gap-2 font-screen text-[22px] text-ink underline decoration-2 underline-offset-[6px] hover:text-brick"
                  >
                    <Github className="h-4 w-4" aria-hidden="true" />
                    Code
                  </a>
                  {h.devpost && (
                    <a
                      href={h.devpost}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[44px] items-center gap-2 font-screen text-[22px] text-ink underline decoration-2 underline-offset-[6px] hover:text-brick"
                    >
                      <ExternalLink className="h-4 w-4" aria-hidden="true" />
                      Devpost
                    </a>
                  )}
                </div>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
