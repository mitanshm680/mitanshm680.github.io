import { motion, useReducedMotion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { certifications, coursework } from '../data/portfolio';
import { Modal } from './ui/Modal';
import { SectionHeading } from './ui/SectionHeading';

function Floppy({ name, grad, index }: { name: string; grad: boolean; index: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.li
      className="group relative"
      initial={reduce ? false : { y: 18, rotate: index % 2 ? 5 : -5 }}
      whileInView={{ y: 0, rotate: index % 3 === 0 ? -1.5 : index % 3 === 1 ? 1 : 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ delay: (index % 6) * 0.05, type: 'spring', stiffness: 260, damping: 20 }}
    >
      <div
        className={`floppy-shape relative flex aspect-square flex-col justify-end gap-0 p-[9%] shadow-[0_6px_0_rgba(0,0,0,.35)] transition-transform duration-200 group-hover:-translate-y-2 ${
          grad ? 'bg-tomato' : 'bg-ink'
        }`}
      >
        {/* metal shutter */}
        <div aria-hidden="true" className="absolute left-[24%] right-[24%] top-0 h-[28%] overflow-hidden rounded-b-sm">
          <div className="absolute inset-0 bg-[#3A2A22]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#D8D2C4] to-[#9C968A] transition-transform duration-300 ease-out group-hover:translate-x-[55%]">
            <div className="absolute left-[16%] top-[18%] h-[62%] w-[22%] rounded-sm bg-[#3A2A22]" />
          </div>
        </div>
        <div aria-hidden="true" className="absolute bottom-[6%] left-[5%] h-[7%] w-[7%] bg-[#0B0806]" />
        {/* label */}
        <div className="relative flex h-[63%] flex-col justify-between gap-1 rounded-t-sm bg-newsprint px-[7%] py-[5%] text-ink">
          <div
            aria-hidden="true"
            className="h-[3px] w-full"
            style={{ background: 'linear-gradient(90deg,#E8432E 33%,#F07F23 33% 66%,#F6B21B 66%)' }}
          />
          <span className="line-clamp-4 text-[12.5px] font-bold leading-[1.13]">{name}</span>
          <span className="font-screen text-[14px] leading-none text-brick">{grad ? 'M.S.' : 'B.S.'} · 1.44 MB</span>
        </div>
      </div>
    </motion.li>
  );
}

export function Courses() {
  const [cert, setCert] = useState<number | null>(null);
  const active = cert === null ? null : certifications[cert];

  return (
    <section id="courses" aria-labelledby="courses-title" className="woodgrain relative overflow-hidden py-20 lg:py-28">
      <div aria-hidden="true" className="absolute inset-0 bg-black/25" />
      <div className="relative mx-auto flex max-w-station flex-col gap-14 px-4 sm:px-8">
        <SectionHeading
          num="06"
          id="courses-title"
          title="The disk library"
          subtitle="Coursework from both degrees, saved to floppy, plus the certificates hanging in the den."
        />

        <div className="flex flex-col gap-5">
          <p className="m-0 font-display text-[28px] leading-none text-marigold" style={{ textShadow: '3px 3px 0 #120B09' }}>
            Graduate, M.S. Data Science, Analytics &amp; Engineering
          </p>
          <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-5 p-0">
            {coursework.grad.map((c, i) => (
              <Floppy key={c} name={c} grad index={i} />
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-5">
          <p className="m-0 font-display text-[28px] leading-none text-newsprint" style={{ textShadow: '3px 3px 0 #120B09' }}>
            Undergraduate, B.S. Computer Science
          </p>
          <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-4 p-0">
            {coursework.undergrad.map((c, i) => (
              <Floppy key={c} name={c} grad={false} index={i} />
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-6">
          <p className="m-0 font-display text-[28px] leading-none text-newsprint" style={{ textShadow: '3px 3px 0 #120B09' }}>
            Certificates on the wall
          </p>
          <ul className="m-0 grid list-none grid-cols-1 gap-10 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {certifications.map((c, i) => (
              <li key={c.title} className="flex flex-col items-center gap-4">
                <button
                  type="button"
                  onClick={() => setCert(i)}
                  className={`group relative w-full rounded-sm bg-[#2A1810] p-3 shadow-[0_18px_30px_rgba(0,0,0,.45),inset_0_0_0_3px_#4A2C18] transition-transform duration-200 hover:-translate-y-1.5 hover:rotate-0 ${
                    i === 1 ? 'rotate-[1.2deg]' : '-rotate-[1.2deg]'
                  }`}
                  aria-label={`View certificate: ${c.title}`}
                >
                  <div className="bg-newsprint p-3">
                    <img
                      src={c.image}
                      alt=""
                      className="aspect-[4/3] w-full object-cover object-top"
                      loading="lazy"
                      width={1400}
                      height={1050}
                    />
                  </div>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-3 bg-gradient-to-br from-white/25 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100"
                  />
                </button>
                <div className="brushed rounded px-4 py-2 text-center text-ink shadow-[0_3px_0_#3A2010]">
                  <p className="m-0 font-wide text-[15px] font-extrabold leading-tight">{c.title}</p>
                  <p className="m-0 font-screen text-[17px]">{c.issuer}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Modal open={!!active} onClose={() => setCert(null)} label={active ? active.title : 'Certificate'} maxWidth={860}>
        {active && (
          <div className="on-light overflow-hidden rounded-xl border-4 border-ink bg-newsprint text-ink shadow-[14px_14px_0_#E8432E]">
            <img src={active.image} alt={`${active.title} certificate`} className="w-full bg-white object-contain" />
            <div className="flex flex-col gap-4 p-6 sm:p-8">
              <p className="m-0 font-display text-[clamp(28px,4vw,40px)] leading-tight">{active.title}</p>
              <p className="m-0 font-screen text-[20px] text-brick">{active.issuer}</p>
              <p className="m-0 text-[17px] leading-relaxed">{active.summary}</p>
              <ul aria-label="Skills" className="m-0 flex list-none flex-wrap gap-2 p-0">
                {active.skills.map((s) => (
                  <li key={s} className="chip border-ink">
                    {s}
                  </li>
                ))}
              </ul>
              <a href={active.link} target="_blank" rel="noopener noreferrer" className="btn-primary self-start">
                <ExternalLink className="h-5 w-5" aria-hidden="true" />
                Verify credential
              </a>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
