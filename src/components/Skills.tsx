import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import { languages, projectById, signalChain, tools } from '../data/portfolio';
import { useStation } from '../lib/station';
import { SectionHeading } from './ui/SectionHeading';

const VU_COLORS = ['#4F5D2F', '#4F5D2F', '#4F5D2F', '#F6B21B', '#F6B21B', '#F07F23', '#E8432E'];

function VuMeter({ seed, hot }: { seed: number; hot: boolean }) {
  return (
    <div aria-hidden="true" className="flex h-12 items-end gap-[3px] rounded bg-ink p-1.5 shadow-[inset_0_0_0_2px_#000]">
      {VU_COLORS.map((c, i) => (
        <span
          key={i}
          className="w-full origin-bottom rounded-[1px]"
          style={{
            height: `${30 + i * 10}%`,
            background: c,
            opacity: hot ? 1 : 0.75,
            animation: `vu ${0.9 + ((seed + i) % 4) * 0.23}s ease-in-out ${-((seed * 3 + i) % 7) * 0.17}s infinite alternate`,
          }}
        />
      ))}
    </div>
  );
}

/** A patch cable between rack units, with data packets riding along it. */
function Cable({ hot, vertical }: { hot: boolean; vertical: boolean }) {
  const cable = vertical
    ? 'left-1/2 top-full h-9 w-2.5 -translate-x-1/2 lg:hidden'
    : 'left-full top-[86px] hidden h-2.5 w-7 lg:block';
  return (
    <div
      aria-hidden="true"
      className={`absolute z-10 rounded-full ${cable}`}
      style={{
        background: vertical
          ? 'repeating-linear-gradient(180deg, #E8432E 0 6px, #B8321F 6px 12px)'
          : 'repeating-linear-gradient(90deg, #E8432E 0 6px, #B8321F 6px 12px)',
        backgroundSize: vertical ? '100% 24px' : '24px 100%',
        animation: `${vertical ? 'cable-flow-y' : 'cable-flow'} ${hot ? 0.35 : 0.8}s linear infinite`,
        boxShadow: hot ? '0 0 10px rgba(246,178,27,.8)' : '0 2px 0 #000',
      }}
    >
      {[0, 0.5].map((d) => (
        <span
          key={d}
          className="absolute h-3 w-3 rounded-full bg-marigold"
          style={
            vertical
              ? {
                  left: '50%',
                  marginLeft: -6,
                  animation: `packet-down 1.1s linear ${-d * 1.1}s infinite`,
                  boxShadow: '0 0 8px #F6B21B',
                }
              : { top: '50%', marginTop: -6, animation: `packet 1.1s linear ${-d * 1.1}s infinite`, boxShadow: '0 0 8px #F6B21B' }
          }
        />
      ))}
    </div>
  );
}

export function Skills() {
  const { openProject } = useStation();
  const reduce = useReducedMotion();
  const [solo, setSolo] = useState<string | null>(null);

  return (
    <section id="skills" aria-labelledby="skills-title" className="relative overflow-hidden bg-espresso py-20 lg:py-28">
      <div className="mx-auto flex max-w-station flex-col gap-12 px-4 sm:px-8">
        <SectionHeading
          num="05"
          id="skills-title"
          title="The signal chain"
          subtitle="My skills, wired in the order data actually flows through them: in from the source, cleaned, stored, modeled, then put on the air. Hover a unit to solo it."
        />

        <div className="flex flex-col gap-4">
          <p className="m-0 font-display text-[26px] leading-none text-newsprint">Languages</p>
          <ul aria-label="Programming languages" className="m-0 flex list-none flex-wrap gap-3 p-0">
            {languages.map((l, i) => (
              <motion.li
                key={l}
                initial={reduce ? false : { y: -12 }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, type: 'spring', stiffness: 400, damping: 20 }}
                className="min-w-[64px] rounded-lg border-2 border-ink bg-gradient-to-b from-newsprint to-[#CDBB9A] px-4 pb-2.5 pt-1.5 text-center font-screen text-[24px] text-ink shadow-[0_6px_0_#120B09,0_7px_0_#000] transition-transform hover:translate-y-1 hover:shadow-[0_2px_0_#120B09]"
              >
                {l}
              </motion.li>
            ))}
          </ul>
        </div>

        <ol
          aria-label="Skills by pipeline stage"
          className="m-0 grid list-none grid-cols-1 gap-9 p-0 sm:grid-cols-2 lg:grid-cols-5 lg:gap-7"
        >
          {signalChain.map((stage, i) => {
            const hot = solo === stage.id;
            const dim = solo !== null && !hot;
            return (
              <li
                key={stage.id}
                className="relative"
                onMouseEnter={() => setSolo(stage.id)}
                onMouseLeave={() => setSolo(null)}
                onFocus={() => setSolo(stage.id)}
                onBlur={() => setSolo(null)}
              >
                <motion.div
                  className="relative flex h-full flex-col gap-4 rounded-xl border-2 border-[#3A2A22] bg-bark p-4 pt-5 shadow-[0_10px_0_#0B0806]"
                  animate={{ opacity: dim ? 0.45 : 1, y: hot ? -6 : 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ boxShadow: hot ? '0 0 0 3px #F6B21B, 0 10px 0 #0B0806' : undefined }}
                >
                  {['left-2 top-2', 'right-2 top-2', 'bottom-2 left-2', 'bottom-2 right-2'].map((pos) => (
                    <span
                      key={pos}
                      aria-hidden="true"
                      className={`absolute ${pos} h-2 w-2 rounded-full bg-umber shadow-[inset_0_0_0_2px_#2A1C17]`}
                    />
                  ))}
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-screen text-[18px] tracking-[2px] text-parchment">STAGE {i + 1}</span>
                    <span
                      aria-hidden="true"
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ background: hot ? '#E8432E' : '#4A3A30', boxShadow: hot ? '0 0 8px #E8432E' : 'none' }}
                    />
                  </div>
                  <h3 className="m-0 self-start rounded-sm bg-ink px-2 py-1 font-expanded text-[17px] font-extrabold uppercase leading-tight tracking-wide text-newsprint shadow-[inset_0_-2px_0_rgba(255,255,255,.12)]">
                    {stage.name}
                  </h3>
                  <VuMeter seed={i} hot={hot} />
                  <p className="m-0 text-[15px] leading-snug text-parchment">{stage.blurb}</p>
                  <ul aria-label={`${stage.name} skills`} className="m-0 flex list-none flex-col gap-1.5 p-0">
                    {stage.skills.map((s) => (
                      <li key={s} className="flex items-center gap-2.5 text-[16px] text-newsprint">
                        <span
                          aria-hidden="true"
                          className="h-3.5 w-3.5 shrink-0 rounded-full border-[3px] border-[#8A7858] bg-ink"
                          style={{ boxShadow: hot ? '0 0 6px #F6B21B' : 'none' }}
                        />
                        {s}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto flex flex-col gap-2 border-t border-dashed border-umber pt-3">
                    <span className="font-screen text-[17px] tracking-[1px] text-parchment">USED IN</span>
                    <div className="flex flex-wrap gap-1.5">
                      {stage.usedIn.map((id) => {
                        const p = projectById(id);
                        if (!p) return null;
                        return (
                          <button
                            key={id}
                            type="button"
                            onClick={() => openProject(id)}
                            className="rounded-sm border-2 border-ink px-2 py-1 font-screen text-[16px] leading-none transition-transform hover:-translate-y-0.5"
                            style={{ background: p.palette.bg, color: p.palette.ink }}
                          >
                            {p.coverTitle}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
                {i < signalChain.length - 1 && (
                  <>
                    <Cable hot={hot || solo === signalChain[i + 1].id} vertical={false} />
                    <div className="sm:hidden">
                      <Cable hot={hot || solo === signalChain[i + 1].id} vertical />
                    </div>
                  </>
                )}
              </li>
            );
          })}
        </ol>

        <div className="flex flex-wrap items-center gap-3">
          <span className="font-display text-[22px] text-newsprint">Also on the bench</span>
          <ul aria-label="Tools" className="m-0 flex list-none flex-wrap gap-2 p-0">
            {tools.map((t) => (
              <li key={t} className="chip border-umber text-parchment">
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
