import { motion, useReducedMotion } from 'framer-motion';
import { Download } from 'lucide-react';
import { experience, profile } from '../data/portfolio';

export function Experience() {
  const reduce = useReducedMotion();
  return (
    <section id="experience" aria-labelledby="experience-title" className="on-light halftone relative py-20 text-ink lg:py-28">
      <div className="mx-auto flex max-w-station flex-col gap-10 px-4 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4 border-b-[9px] border-double border-ink pb-4">
          <div className="flex flex-col items-start gap-2">
            <span className="rounded bg-ink px-2 py-0.5 font-screen text-[20px] text-marigold">CH 03</span>
            <h2
              id="experience-title"
              className="m-0 font-condensed text-[clamp(76px,13vw,184px)] font-black uppercase leading-[0.8] tracking-[-2px]"
            >
              What’s on
            </h2>
          </div>
          <div className="flex max-w-[24rem] flex-col gap-2 pb-2">
            <p className="m-0 font-display text-[32px] leading-[1.05] text-brick">Experience listings</p>
            <p className="m-0 text-[17px] leading-relaxed">Where I’ve worked and led, newest episodes first.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-12">
          <ol aria-label="Work experience" className="m-0 flex min-w-0 flex-[999_1_560px] list-none flex-col p-0">
            {experience.map((job, i) => (
              <motion.li
                key={job.org + job.role}
                className={`grid grid-cols-[88px_minmax(0,1fr)] gap-5 py-7 sm:grid-cols-[120px_minmax(0,1fr)] ${
                  i < experience.length - 1 ? 'border-b-2 border-ink' : ''
                }`}
                initial={reduce ? false : { x: -24 }}
                whileInView={{ x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
              >
                <div className="flex flex-col items-start gap-2">
                  <span className="font-condensed text-[clamp(34px,4vw,48px)] font-black leading-none">{job.slot}</span>
                  <span className="rounded-sm bg-ink px-1.5 font-screen text-[17px] text-newsprint">
                    {job.where.toUpperCase()}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="m-0 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="font-expanded text-[clamp(19px,2vw,23px)] font-extrabold uppercase leading-tight">
                      {job.org}
                    </span>
                    <span className="font-screen text-[20px]">{job.dates}</span>
                  </p>
                  <p className="m-0 text-[17px] font-bold">
                    <motion.span
                      className="bg-no-repeat"
                      style={{ backgroundImage: 'linear-gradient(#F6B21B, #F6B21B)', backgroundPosition: '0 88%' }}
                      initial={reduce ? false : { backgroundSize: '0% 42%' }}
                      whileInView={{ backgroundSize: '100% 42%' }}
                      viewport={{ once: true, amount: 1 }}
                      transition={{ delay: 0.35, duration: 0.6, ease: 'easeInOut' }}
                    >
                      {job.role}
                    </motion.span>{' '}
                    <span className="font-normal">({job.genre})</span>
                  </p>
                  <ul className="m-0 flex list-none flex-col gap-2 p-0">
                    {job.bullets.map((b) => (
                      <li key={b} className="flex gap-3 text-[16px] leading-relaxed">
                        <span aria-hidden="true" className="mt-[10px] h-1.5 w-1.5 shrink-0 bg-ink" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <ul aria-label="Skills used" className="m-0 mt-1 flex list-none flex-wrap gap-2 p-0">
                    {job.tags.map((t) => (
                      <li key={t} className="chip border-ink">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.li>
            ))}
          </ol>

          <aside aria-label="Highlights" className="flex flex-[1_1_300px] flex-col gap-6 self-start">
            <div className="rounded bg-ink p-6 text-newsprint shadow-[8px_8px_0_#E8432E]">
              <p className="m-0 mb-2 font-screen text-[20px] tracking-[3px] text-marigold">★ PICK OF THE WEEK ★</p>
              <p className="m-0 mb-3 font-display text-[32px] leading-[1.05]">The full résumé</p>
              <p className="m-0 mb-5 text-[16px] leading-relaxed text-parchment">
                One page, every detail. Available for home viewing as a PDF.
              </p>
              <a
                href={profile.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary min-h-[52px] px-6 text-[15px]"
              >
                <Download className="h-5 w-5" aria-hidden="true" />
                Download résumé
              </a>
            </div>
            <div className="rounded border-[3px] border-ink p-5">
              <p className="m-0 mb-3 font-condensed text-[36px] font-black uppercase leading-none">Now airing</p>
              <ul className="m-0 flex list-none flex-col gap-3 p-0 text-[16px] leading-snug">
                <li className="flex gap-3">
                  <span className="w-[68px] shrink-0 font-screen text-[19px] text-brick">LIVE</span>
                  M.S. coursework in data processing at scale, data mining and software security
                </li>
                <li className="flex gap-3">
                  <span className="w-[68px] shrink-0 font-screen text-[19px] text-brick">NEXT</span>
                  Looking for software engineering and data internships
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
