import { Github, Linkedin, Mail, FileText } from 'lucide-react';
import { coursework, education, experience, hackathons, profile, projectById, type Project } from '../../data/portfolio';

/**
 * The résumé printed on the parchment. Every element tagged `data-piece` breaks off
 * in the explosion and flies to the channel tile named in `data-tile`.
 * Elements tagged `data-deco` dissolve instead.
 */

const RESUME_PROJECTS = ['sentinelflow', 'smartbrief', 'jet2holiday', 'career-planner', 'inventory'];
const RESUME_SKILLS = [
  'Python',
  'Java',
  'C++',
  'TypeScript',
  'SQL',
  'R',
  'React',
  'FastAPI',
  'PostgreSQL',
  'MongoDB',
  'Neo4j',
  'scikit-learn',
];

function Heading({ children }: { children: string }) {
  return (
    <div className="rz-heading" data-deco="">
      <span className="rz-heading-label">
        <span className="rz-hl" data-hl="" aria-hidden="true" />
        <span className="relative">{children}</span>
      </span>
      <span className="rz-rule" aria-hidden="true" />
    </div>
  );
}

export function Resume() {
  const projects = RESUME_PROJECTS.map((id) => projectById(id)).filter(Boolean) as Project[];
  const ms = education[0];
  const bs = education[1];
  return (
    <div className="rz-content">
      <header className="rz-head" data-section="Header">
        <div className="rz-piece rz-name" data-piece="" data-tile="main">
          <span className="rz-name-title">{profile.name}</span>
          <span className="rz-name-sub">Data science grad · Full-stack developer · Tempe, AZ</span>
        </div>
        <div className="rz-stamp" data-deco="" aria-hidden="true">
          <span>RÉSUMÉ</span>
          <span>REV. 2026</span>
        </div>
      </header>

      <section className="rz-section" data-section="Education">
        <Heading>Education</Heading>
        <div className="rz-rows">
          <div className="rz-piece rz-row" data-piece="" data-tile="about">
            <span className="rz-title">M.S. Data Science, Analytics &amp; Engineering</span>
            <span className="rz-meta">{ms.dates.replace('Graduating ', '')}</span>
            <span className="rz-sub">Arizona State University · 4+1</span>
          </div>
          <div className="rz-piece rz-row" data-piece="" data-tile="about">
            <span className="rz-title">B.S. Computer Science, magna cum laude</span>
            <span className="rz-meta">{bs.dates.split('–')[1]?.trim() ?? bs.dates}</span>
            <span className="rz-sub">Arizona State University · Minor in Data Science</span>
          </div>
        </div>
        <div className="rz-chips">
          <span className="rz-chip-label" data-deco="">
            Coursework
          </span>
          {coursework.grad.slice(0, 4).map((c) => (
            <span key={c} className="rz-piece rz-chip" data-piece="" data-tile="courses">
              {c}
            </span>
          ))}
        </div>
      </section>

      <section className="rz-section" data-section="Experience">
        <Heading>Experience</Heading>
        <div className="rz-rows">
          {experience.map((job) => (
            <div key={job.role} className="rz-piece rz-row" data-piece="" data-tile="experience">
              <span className="rz-title">{job.role}</span>
              <span className="rz-meta">{job.slot}</span>
              <span className="rz-sub">{job.org}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="rz-section" data-section="Projects">
        <Heading>Projects</Heading>
        <div className="rz-chips">
          {projects.map((p) => (
            <span
              key={p.id}
              className="rz-piece rz-tape"
              data-piece=""
              data-tile="work"
              style={{
                ['--tape-bg' as string]: p.palette.bg,
                ['--tape-ink' as string]: p.palette.ink,
                ['--tape-spine' as string]: p.palette.spine,
              }}
            >
              <span className="rz-tape-spine" aria-hidden="true" />
              {p.coverTitle}
            </span>
          ))}
          <span className="rz-piece rz-tape rz-tape-more" data-piece="" data-tile="work">
            +7 more tapes
          </span>
        </div>
      </section>

      <section className="rz-section" data-section="Skills">
        <Heading>Skills</Heading>
        <div className="rz-chips">
          {RESUME_SKILLS.map((s) => (
            <span key={s} className="rz-piece rz-chip rz-skill" data-piece="" data-tile="skills">
              {s}
            </span>
          ))}
        </div>
      </section>

      <section className="rz-section" data-section="Leadership & awards">
        <Heading>Leadership &amp; awards</Heading>
        <div className="rz-stats">
          <div className="rz-piece rz-stat" data-piece="" data-tile="hackathons">
            <span className="rz-stat-num">3rd</span>
            <span className="rz-stat-label">of 130+ teams, SunHacks 2025</span>
          </div>
          <div className="rz-piece rz-stat" data-piece="" data-tile="hackathons">
            <span className="rz-stat-num">{hackathons.length}</span>
            <span className="rz-stat-label">hackathons shipped</span>
          </div>
          <div className="rz-piece rz-stat" data-piece="" data-tile="about">
            <span className="rz-stat-num">300+</span>
            <span className="rz-stat-label">first-year engineers mentored</span>
          </div>
          <div className="rz-piece rz-stat" data-piece="" data-tile="about">
            <span className="rz-stat-num">500+</span>
            <span className="rz-stat-label">students reached as Eco-Rep</span>
          </div>
        </div>
      </section>

      <section className="rz-section" data-section="Contact">
        <Heading>Contact</Heading>
        <div className="rz-chips">
          <span className="rz-piece rz-btn" data-piece="" data-tile="contact">
            <Mail aria-hidden="true" />
            {profile.email}
          </span>
          <span className="rz-piece rz-btn" data-piece="" data-tile="contact">
            <Github aria-hidden="true" />
            GitHub
          </span>
          <span className="rz-piece rz-btn" data-piece="" data-tile="contact">
            <Linkedin aria-hidden="true" />
            LinkedIn
          </span>
          <span className="rz-piece rz-btn" data-piece="" data-tile="contact">
            <FileText aria-hidden="true" />
            Résumé PDF
          </span>
        </div>
      </section>

      <footer className="rz-foot" data-deco="" aria-hidden="true">
        <span>SHEET 1 OF 1</span>
        <span>MM-TV BROADCAST BLUEPRINT</span>
        <span>CH 680</span>
      </footer>
    </div>
  );
}
