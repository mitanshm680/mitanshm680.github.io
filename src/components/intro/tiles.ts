import {
  certifications,
  coursework,
  education,
  experience,
  hackathons,
  projects,
  type ChannelId,
} from '../../data/portfolio';

export type TileId = 'main' | 'about' | 'work' | 'experience' | 'hackathons' | 'skills' | 'courses' | 'contact';

export interface TileEls {
  /** The whole TV set (fades in, carries data-on). */
  bezel: HTMLElement;
  /** The picture tube: powers on like a CRT. */
  screen: HTMLElement;
  /** Where the résumé pieces land. */
  slot: HTMLElement;
  flash: HTMLElement;
  /** Static shown between programmes on TVs that cycle. */
  noise?: HTMLElement;
  /** "1/3" counter on TVs that cycle. */
  count?: HTMLElement;
  /** "+N" marker for pieces that don't fit. */
  more?: HTMLElement;
  /** Programme cards a TV cycles through once its pieces have landed. */
  cards?: HTMLElement;
}

/** One programme on a cycling TV: a big number or headline, then details. */
export interface Card {
  big?: string;
  title: string;
  sub?: string;
  meta?: string;
}

export interface Tile {
  id: TileId;
  target: ChannelId;
  /** 'cycle' shows one big piece at a time like a channel; 'flow' lays them all out. */
  fit: 'cycle' | 'flow';
  /** Screen tint: pale versions of the colour-bar test pattern. */
  scr: string;
  num: string;
  ch: string;
  label: string;
  short: string;
  summary: string;
  /** Text listings for the static (reduced-motion) guide. */
  listings: string[];
  /** Cycling TVs: the programmes the landed pieces turn into. */
  cards?: Card[];
}

export const TILES: Tile[] = [
  {
    id: 'main',
    target: 'top',
    fit: 'cycle',
    scr: '#F3E6CC',
    num: '680',
    ch: 'CH 680',
    label: 'Main',
    short: 'Main',
    summary: 'Name, roles and the channel-surfing TV',
    listings: [],
  },
  {
    id: 'about',
    target: 'about',
    fit: 'cycle',
    scr: '#F4E3A0',
    num: '01',
    ch: 'CH 01',
    label: 'About',
    short: 'About',
    summary: 'M.S. and B.S. at ASU, 300+ students mentored',
    listings: [
      `M.S. Data Science · ${education[0].dates.replace('Graduating ', '')}`,
      'B.S. Computer Science, magna cum laude',
      '300+ first-years mentored',
    ],
    cards: [
      { title: 'M.S. Data Science, Analytics & Engineering', sub: 'Arizona State University · 4+1', meta: 'MAY 2027' },
      { title: 'B.S. Computer Science', sub: 'Magna cum laude · Minor in Data Science', meta: 'MAY 2026' },
      { big: '300+', title: 'first-year engineers mentored' },
      { big: '500+', title: 'students reached as an Eco-Rep' },
    ],
  },
  {
    id: 'work',
    target: 'work',
    fit: 'flow',
    scr: '#C3E4DC',
    num: '02',
    ch: 'CH 02',
    label: 'Work',
    short: 'Work',
    summary: `${projects.length} projects on tape`,
    listings: [...projects.slice(0, 4).map((p) => p.title), `+${projects.length - 4} more`],
  },
  {
    id: 'experience',
    target: 'experience',
    fit: 'cycle',
    scr: '#D2E4B4',
    num: '03',
    ch: 'CH 03',
    label: 'Experience',
    short: 'Exp.',
    summary: `${experience.length} roles, newest first`,
    listings: experience.map((e) => `${e.role} · ${e.org}`),
    cards: experience.map((e) => ({ title: e.role, sub: e.org, meta: e.slot })),
  },
  {
    id: 'hackathons',
    target: 'hackathons',
    fit: 'cycle',
    scr: '#EDC9DF',
    num: '04',
    ch: 'CH 04',
    label: 'Hackathons',
    short: 'Hacks',
    summary: `${hackathons.length} hackathons, 3rd at SunHacks`,
    listings: ['3rd of 130+ teams · SunHacks 2025', `${hackathons.length} hackathons shipped`],
    cards: [
      { big: '3rd', title: 'of 130+ teams', sub: 'SunHacks 2025' },
      {
        big: String(hackathons.length),
        title: 'hackathons shipped',
        sub: hackathons.map((h) => h.event.replace(/ \d{4}$/, '')).join(' · '),
      },
    ],
  },
  {
    id: 'skills',
    target: 'skills',
    fit: 'flow',
    scr: '#F6C9B9',
    num: '05',
    ch: 'CH 05',
    label: 'Skills',
    short: 'Skills',
    summary: 'Python, SQL, React and the data pipeline',
    listings: ['Python', 'SQL', 'TypeScript', 'React', 'FastAPI', 'PostgreSQL', 'scikit-learn'],
  },
  {
    id: 'courses',
    target: 'courses',
    fit: 'flow',
    scr: '#CCD5EF',
    num: '06',
    ch: 'CH 06',
    label: 'Courses',
    short: 'Courses',
    summary: `${coursework.grad.length + coursework.undergrad.length} courses, ${certifications.length} certificates`,
    listings: [...coursework.grad.slice(0, 3), `${certifications.length} certificates`],
  },
  {
    id: 'contact',
    target: 'contact',
    fit: 'flow',
    scr: '#F7DDB4',
    num: '07',
    ch: 'CH 07',
    label: 'Contact',
    short: 'Contact',
    summary: 'Email, GitHub, LinkedIn',
    listings: ['Email', 'GitHub', 'LinkedIn', 'Résumé PDF'],
  },
];
