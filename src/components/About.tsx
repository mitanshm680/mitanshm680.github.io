import { GraduationCap, MapPin } from 'lucide-react';
import { education, profile, stats } from '../data/portfolio';
import { Burst } from './ui/Burst';
import { SectionHeading } from './ui/SectionHeading';
import { SplitFlap } from './ui/SplitFlap';

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="on-light relative overflow-hidden bg-marigold text-ink">
      {/* 70s racing stripes */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
        {[
          ['#120B09', 64, 40, 150],
          ['#E8432E', 90, 66, 124],
          ['#F07F23', 116, 92, 98],
        ].map(([c, right, top, r]) => (
          <div
            key={c as string}
            className="absolute bottom-0 left-0"
            style={{
              right: right as number,
              top: top as number,
              borderTop: `18px solid ${c}`,
              borderRight: `18px solid ${c}`,
              borderTopRightRadius: r as number,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-station px-4 pb-20 pt-24 sm:px-8 md:pr-[170px] md:pt-[150px] lg:pb-28">
        <div className="flex flex-wrap items-start gap-14">
          <figure className="relative m-0 w-full max-w-[420px] flex-[1_1_300px]">
            <div className="rounded-[36px] bg-ink p-[18px] shadow-[12px_12px_0_#E8432E]">
              <div className="group relative aspect-[3/4] overflow-hidden" style={{ borderRadius: '44px / 34px' }}>
                <img
                  src={profile.portrait}
                  alt="Mitansh Maheshwari smiling, wearing clear-framed glasses and a black shirt"
                  className="h-full w-full object-cover object-top transition-[filter] duration-500 [filter:sepia(.35)_saturate(1.2)_contrast(1.05)] group-hover:[filter:none]"
                  width={720}
                  height={960}
                  loading="lazy"
                />
                <div
                  aria-hidden="true"
                  className="scanlines absolute inset-0 opacity-70 transition-opacity duration-500 group-hover:opacity-20"
                />
                <div aria-hidden="true" className="glass absolute inset-0" style={{ borderRadius: '44px / 34px' }} />
                <span
                  aria-hidden="true"
                  className="absolute left-[8%] top-[6%] flex items-center gap-2 font-screen text-[22px] tracking-[2px] text-white"
                  style={{ textShadow: '2px 2px 0 #000' }}
                >
                  <span className="h-2.5 w-2.5 rounded-full bg-tomato" style={{ animation: 'blink 1.4s steps(1) infinite' }} />
                  LIVE
                </span>
              </div>
            </div>
            <Burst size={116} outer="#120B09" inner="#F3E6CC" fontSize={15} className="absolute -right-5 bottom-14 -rotate-12">
              Live from
              <br />
              Tempe, AZ
            </Burst>
          </figure>

          <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-6">
            <SectionHeading
              num="01"
              id="about-title"
              title="Meet your host"
              subtitle="About me, my degrees, and a few numbers I’m proud of."
              tone="marigold"
            />
            <p className="m-0 text-[21px] font-medium leading-relaxed">
              Hi, I’m Mitansh. I finished my B.S. in Computer Science at ASU magna cum laude in May 2026, and I’m now in the 4+1
              M.S. in Data Science, Analytics and Engineering, graduating May 2027.
            </p>
            <p className="m-0 text-[18px] leading-relaxed">
              My favorite work sits where data meets product: schemas, pipelines and models on one end, the React screen someone
              actually clicks on at the other. Most recently I built test-management modules from scratch as a full-stack intern
              at Qualaces. Off the clock I mentor first-year engineers, fall into Wikipedia rabbit holes, and get outside around
              Arizona.
            </p>

            <div className="flex flex-col gap-4 rounded-xl border-[3px] border-ink bg-newsprint p-5 shadow-[6px_6px_0_#120B09]">
              <p className="m-0 flex items-center gap-2 font-display text-[24px] leading-none">
                <GraduationCap className="h-6 w-6" aria-hidden="true" />
                Report card
              </p>
              {education.map((e) => (
                <div key={e.degree} className="flex flex-col gap-1.5 border-t-2 border-dashed border-ink/40 pt-3">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <p className="m-0 font-wide text-[17px] font-extrabold">{e.degree}</p>
                    <p className="m-0 font-screen text-[20px]">{e.dates}</p>
                  </div>
                  <p className="m-0 text-[15px] leading-snug">
                    {e.school} · {e.note}
                  </p>
                  <div className="mt-1 flex items-center gap-3">
                    <div className="h-4 flex-1 overflow-hidden rounded-sm border-2 border-ink bg-white/60 p-[2px]">
                      {e.status === 'complete' ? (
                        <div className="h-full w-full bg-avocado" />
                      ) : (
                        <div
                          className="h-full w-full bg-tomato"
                          style={{
                            backgroundImage:
                              'repeating-linear-gradient(-45deg, rgba(255,255,255,.35) 0 10px, rgba(255,255,255,0) 10px 20px)',
                            animation: 'loading-stripes 1s linear infinite',
                          }}
                        />
                      )}
                    </div>
                    <span className="w-[104px] text-right font-screen text-[19px]">
                      {e.status === 'complete' ? 'COMPLETE' : 'IN PROGRESS'}
                    </span>
                  </div>
                </div>
              ))}
              <p className="m-0 flex items-center gap-2 border-t-2 border-dashed border-ink/40 pt-3 text-[15px]">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                Based in {profile.location}
              </p>
            </div>
          </div>
        </div>

        <ul aria-label="By the numbers" className="m-0 mt-16 grid list-none grid-cols-1 gap-5 p-0 md:grid-cols-3">
          {stats.map((s) => (
            <li key={s.label} className="flex flex-col gap-3 rounded-xl bg-ink p-5 text-newsprint shadow-[6px_6px_0_#E8432E]">
              <SplitFlap text={s.value} className="text-[clamp(40px,4.6vw,56px)]" />
              <span className="text-[16px] leading-snug text-parchment">{s.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
