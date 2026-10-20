import { certifications, coursework, experience, hackathons, projects, type ChannelId } from '../../data/portfolio';

export type TileId = 'main' | 'about' | 'work' | 'experience' | 'hackathons' | 'skills' | 'courses' | 'contact';

export interface TileEls {
  bezel: HTMLElement;
  screen: HTMLElement;
  slot: HTMLElement;
  flash: HTMLElement;
}

export const TILES: { id: TileId; target: ChannelId; ch: string; label: string; summary: string }[] = [
  { id: 'main', target: 'top', ch: 'CH 680', label: 'Main', summary: 'Name, roles and the channel-surfing TV' },
  { id: 'about', target: 'about', ch: 'CH 01', label: 'About', summary: 'M.S. and B.S. at ASU, 300+ students mentored' },
  { id: 'work', target: 'work', ch: 'CH 02', label: 'Work', summary: `${projects.length} projects on tape` },
  {
    id: 'experience',
    target: 'experience',
    ch: 'CH 03',
    label: 'Experience',
    summary: `${experience.length} roles, newest first`,
  },
  {
    id: 'hackathons',
    target: 'hackathons',
    ch: 'CH 04',
    label: 'Hackathons',
    summary: `${hackathons.length} hackathons, 3rd at SunHacks`,
  },
  { id: 'skills', target: 'skills', ch: 'CH 05', label: 'Skills', summary: 'Python, SQL, React and the data pipeline' },
  {
    id: 'courses',
    target: 'courses',
    ch: 'CH 06',
    label: 'Courses',
    summary: `${coursework.grad.length + coursework.undergrad.length} courses, ${certifications.length} certificates`,
  },
  { id: 'contact', target: 'contact', ch: 'CH 07', label: 'Contact', summary: 'Email, GitHub, LinkedIn' },
];
