// All site content lives here, so updating the portfolio never means digging through layout code.

/** Prefix files in /public with Vite's base URL so the site works from any sub-path. */
const asset = (file: string) => `${import.meta.env.BASE_URL}${file}`;

export const profile = {
  name: 'Mitansh Maheshwari',
  firstName: 'Mitansh',
  lastName: 'Maheshwari',
  email: 'mitanshm680@gmail.com',
  github: 'https://github.com/mitanshm680',
  linkedin: 'https://www.linkedin.com/in/mitansh-maheshwari/',
  resume: asset('mitansh_resume_s.pdf'),
  portrait: asset('1766505966559.jpg'),
  location: 'Tempe, Arizona',
  roles: ['data pipelines', 'full-stack web apps', 'AI-powered tools', 'clean, fast databases', 'things people actually use'],
};

export type ChannelId = 'top' | 'about' | 'work' | 'experience' | 'hackathons' | 'skills' | 'courses' | 'contact';

export const channels: { id: ChannelId; num: string; label: string }[] = [
  { id: 'about', num: '01', label: 'About' },
  { id: 'work', num: '02', label: 'Work' },
  { id: 'experience', num: '03', label: 'Experience' },
  { id: 'hackathons', num: '04', label: 'Hackathons' },
  { id: 'skills', num: '05', label: 'Skills' },
  { id: 'courses', num: '06', label: 'Courses' },
  { id: 'contact', num: '07', label: 'Contact' },
];

export const ticker = [
  'Now enrolled: M.S. Data Science, Analytics & Engineering at ASU, graduating May 2027',
  'SunHacks 2025: 3rd place out of 130+ teams',
  'Now filming: SentinelFlow, adaptive credit-card fraud detection under concept drift',
  'New on the air: BROKE U, a multiplayer finance RPG from Claude Hacks',
  'B.S. Computer Science, magna cum laude, class of 2026',
  'Open to software engineering and data internships',
  'Psst: try the Konami code',
];

export const education = [
  {
    degree: 'M.S. Data Science, Analytics and Engineering',
    school: 'Arizona State University, Ira A. Fulton Schools of Engineering',
    note: '4+1 accelerated program',
    dates: 'Graduating May 2027',
    status: 'in-progress' as const,
    coursework: ['Data Processing at Scale', 'Software Security', 'Data Mining', 'Statistics for Data Analysts'],
  },
  {
    degree: 'B.S. Computer Science, Magna Cum Laude',
    school: 'Arizona State University',
    note: 'Minor in Data Science',
    dates: 'Aug 2022 – May 2026',
    status: 'complete' as const,
    coursework: [],
  },
];

export const stats = [
  { value: '300+', label: 'first-year engineers mentored over three years' },
  { value: '500+', label: 'students reached through campus sustainability programs' },
  { value: '3RD', label: 'place out of 130+ teams at SunHacks 2025' },
];

export type Tag = 'data' | 'fullstack' | 'systems';
export type Cover =
  | 'waves'
  | 'graph'
  | 'route'
  | 'blocks'
  | 'vinyl'
  | 'bars'
  | 'diamond'
  | 'keyhole'
  | 'terrain'
  | 'waveform'
  | 'form'
  | 'radar';

export interface Palette {
  bg: string;
  ink: string;
  accent: string;
  accent2: string;
  title: string;
  shadow: string;
  spine: string;
  spineInk: string;
}

export interface Project {
  id: string;
  title: string;
  /** Short title for the tape cover. */
  coverTitle: string;
  year: string;
  context: string;
  tags: Tag[];
  logline: string;
  bullets: string[];
  tech: string[];
  code?: string;
  devpost?: string;
  cover: Cover;
  palette: Palette;
  sticker?: string;
  /** Collaborative project: team size. */
  team?: number;
  /** What I personally built on a team project. */
  role?: string;
}

const P = {
  ink: '#120B09',
  bark: '#2A1C17',
  news: '#F3E6CC',
  mari: '#F6B21B',
  tang: '#F07F23',
  tom: '#E8432E',
  avo: '#4F5D2F',
};

export const projects: Project[] = [
  {
    id: 'smartbrief',
    title: 'SmartBrief: AI News Dashboard',
    coverTitle: 'SmartBrief',
    year: 'Summer 2025',
    context: 'Full-stack AI platform',
    tags: ['data', 'fullstack'],
    logline:
      'Collects news from many sources, summarizes it with Gemini, and sorts it into a dashboard you can search and filter.',
    bullets: [
      'Scheduled scrapers pull articles from configurable sources; Google’s Gemini 2.0 API writes concise summaries and clusters them by topic.',
      'React + TypeScript + Tailwind front end with category filters, search, saved articles, sharing and dark mode.',
      'Python/FastAPI back end with a MongoDB schema indexed for fast retrieval of articles and user preferences.',
    ],
    tech: ['React', 'TypeScript', 'Tailwind CSS', 'Python', 'FastAPI', 'MongoDB', 'Gemini API'],
    code: 'https://github.com/mitanshm680/AI-Powered-News-Dashboard',
    cover: 'waves',
    palette: {
      bg: P.bark,
      ink: P.news,
      accent: P.tang,
      accent2: P.mari,
      title: P.mari,
      shadow: P.tom,
      spine: P.tom,
      spineInk: P.ink,
    },
    sticker: 'Staff pick',
  },
  {
    id: 'sentinelflow',
    title: 'SentinelFlow: Adaptive Fraud Detection',
    coverTitle: 'Sentinel Flow',
    year: 'Fall 2026',
    context: 'Team ML research project',
    tags: ['data'],
    logline:
      'Do fraud models that adapt in real time beat models frozen on yesterday’s data? An experiment on card-not-present fraud as spending patterns drift.',
    bullets: [
      'Replays the ULB credit-card dataset (284,807 transactions, 492 of them fraud) as a chronological stream of batches, so models face fraud in the order it happened.',
      'Pits frozen baselines (class-weighted logistic regression and random forest) against incremental learners and sliding-window ensembles.',
      'Watches the stream with ADWIN and DDM drift detectors and retrains on recent data when behavior shifts, scored on precision, recall, F1, ROC-AUC and false-positive rate.',
      'Config-driven Python package with a CLI, pytest suite, Ruff linting and GitHub Actions CI.',
    ],
    tech: ['Python', 'scikit-learn', 'River', 'pandas', 'NumPy', 'pytest', 'GitHub Actions'],
    code: 'https://github.com/Sanjaysoralamavu/sentinelflow-fraud-detection',
    cover: 'radar',
    palette: {
      bg: P.ink,
      ink: P.news,
      accent: P.mari,
      accent2: P.news,
      title: P.mari,
      shadow: P.tom,
      spine: P.tom,
      spineInk: P.ink,
    },
    sticker: 'Now filming',
    team: 8,
  },
  {
    id: 'career-planner',
    title: 'Interactive Career Path Planner',
    coverTitle: 'Career Planner',
    year: '',
    context: 'Graph database + animated UI',
    tags: ['data', 'fullstack'],
    logline:
      'An animated flowchart that helps undecided first-year students map their interests to real careers and an 8-semester plan.',
    bullets: [
      'Modeled ~100 courses and 40+ career paths across 9 fields as a Neo4j graph, queried with Cypher to surface paths that match a student’s interests.',
      'Generates a semester-by-semester, 8-semester course schedule for each career path by walking the graph’s prerequisite chains.',
      'React + TypeScript front end that animates the interest → career flowchart so exploring options feels like play.',
    ],
    tech: ['React', 'TypeScript', 'Neo4j', 'Cypher'],
    cover: 'graph',
    palette: {
      bg: P.avo,
      ink: P.news,
      accent: P.mari,
      accent2: P.tang,
      title: P.news,
      shadow: P.ink,
      spine: P.mari,
      spineInk: P.ink,
    },
  },
  {
    id: 'jet2holiday',
    title: 'Jet2Holiday Flight Manager',
    coverTitle: 'Jet2Holiday',
    year: 'Fall 2025',
    context: 'CSE 412 Database Management',
    tags: ['data', 'fullstack', 'systems'],
    logline:
      'A PostgreSQL-backed flight route manager built on real OpenFlights data, with a REST API and a searchable React UI.',
    bullets: [
      'Normalized PostgreSQL schema for countries, airlines, airports, planes and routes, with foreign keys and a composite primary key on routes.',
      'Node/Express importer that loads OpenFlights .dat files into Postgres, plus REST endpoints to search, add, edit and delete routes.',
      'React + TypeScript (Vite) front end with flight search, a sortable route table and edit dialogs wired to the API.',
    ],
    team: 3,
    role: 'I wrote the insert, update and delete queries behind the route editor (the POST, PUT and DELETE endpoints in Express) and wired them into the React route table and edit dialog, then fixed updates so every field saves correctly.',
    tech: ['PostgreSQL', 'SQL', 'Node.js', 'Express', 'React', 'TypeScript', 'Vite'],
    code: 'https://github.com/mitanshm680/CSE412-Project-Jet2Holidays',
    cover: 'route',
    palette: {
      bg: P.mari,
      ink: P.ink,
      accent: P.tom,
      accent2: P.ink,
      title: P.news,
      shadow: P.ink,
      spine: P.ink,
      spineInk: P.mari,
    },
    sticker: 'New release',
  },
  {
    id: 'inventory',
    title: 'Inventory Management System',
    coverTitle: 'Inventory',
    year: 'Spring 2025',
    context: 'Full-stack web app',
    tags: ['fullstack'],
    logline:
      'Track stock across warehouses and suppliers, find the cheapest way to reorder, and get warned before anything runs out.',
    bullets: [
      'FastAPI + SQLAlchemy REST API with JWT auth and role-based access (Admin, Editor, Viewer).',
      'Multi-supplier pricing with a best-total-price finder (item + shipping), batch and expiry tracking, and automated low-stock alerts.',
      'React + TypeScript UI in Material UI with Chart.js dashboards, CSV import, bulk edits and a Ctrl+K global search.',
    ],
    tech: ['Python', 'FastAPI', 'SQLAlchemy', 'SQLite', 'React', 'TypeScript', 'Material UI', 'Chart.js', 'JWT'],
    code: 'https://github.com/mitanshm680/Inventory-Management-System',
    cover: 'blocks',
    palette: {
      bg: P.tom,
      ink: P.ink,
      accent: P.mari,
      accent2: P.news,
      title: P.news,
      shadow: P.ink,
      spine: P.ink,
      spineInk: P.news,
    },
  },
  {
    id: 'spotify',
    title: 'Spotify Listening Analysis & Recommender',
    coverTitle: 'Spotify Moods',
    year: 'Fall 2024',
    context: 'Data analysis in R',
    tags: ['data'],
    logline: 'What my listening history says about my moods, and a recommender built on top of it.',
    bullets: [
      'Parsed my Spotify streaming-history JSON and enriched it with audio features pulled from the Spotify API in Python.',
      'Explored listening habits over time and correlated audio features with mood using dplyr, lubridate and zoo.',
      'Built a preference-based recommendation model and published the analysis as an interactive plotly HTML report and a ggplot2 PDF.',
    ],
    tech: ['R', 'dplyr', 'ggplot2', 'plotly', 'R Markdown', 'Python', 'Spotify API'],
    code: 'https://github.com/mitanshm680/Spotify-Data-Analysis-and-music-recommendation-system',
    cover: 'vinyl',
    palette: {
      bg: P.bark,
      ink: P.news,
      accent: P.mari,
      accent2: P.tang,
      title: P.mari,
      shadow: P.ink,
      spine: P.avo,
      spineInk: P.news,
    },
  },
  {
    id: 'sentiment',
    title: 'Amazon Review Sentiment Analysis',
    coverTitle: 'Review Sentiment',
    year: 'Fall 2024',
    context: 'NLP on real-world data',
    tags: ['data'],
    logline:
      'How star ratings, price and review length line up with what customers actually write, across Amazon’s CDs & Vinyl reviews.',
    bullets: [
      'Cleaned and merged the McAuley Lab (UCSD) Amazon Reviews 2023 data for the CDs & Vinyl category with BeautifulSoup, regex and pandas.',
      'Scored review sentiment with NLTK and VADER, then compared it against ratings, price, category and word count.',
      'Visualized the findings with Matplotlib, Seaborn and word clouds.',
    ],
    tech: ['Python', 'pandas', 'NLTK', 'VADER', 'Matplotlib', 'Seaborn', 'WordCloud'],
    code: 'https://github.com/mitanshm680/Sentiment-Analysis---Amazon-Product-Reviews',
    cover: 'bars',
    palette: {
      bg: P.news,
      ink: P.ink,
      accent: P.tom,
      accent2: P.avo,
      title: P.tom,
      shadow: P.ink,
      spine: P.tom,
      spineInk: P.ink,
    },
  },
  {
    id: 'mlb',
    title: 'MLB Analysis in Alteryx & Tableau',
    coverTitle: 'MLB Analytics',
    year: 'Spring 2025',
    context: 'Analytics workflows + dashboards',
    tags: ['data'],
    logline:
      'Joining decades of baseball tables (teams, players, salaries, ballparks) into workflows and dashboards that answer real questions.',
    bullets: [
      'Built 14 Alteryx workflows to clean, join and aggregate multi-table MLB data covering teams, people, salaries, home games and parks.',
      'Visualized wins, runs and batting average by team and division, salary trends by league, and ballpark data in Tableau.',
    ],
    tech: ['Alteryx', 'Tableau', 'Excel', 'ETL'],
    code: 'https://github.com/mitanshm680/MLB-Data-Analysis-using-Alteryx-and-Tableau',
    cover: 'diamond',
    palette: {
      bg: P.avo,
      ink: P.news,
      accent: P.news,
      accent2: P.mari,
      title: P.mari,
      shadow: P.ink,
      spine: P.tang,
      spineInk: P.ink,
    },
  },
  {
    id: 'help-system',
    title: 'JavaFX Help System',
    coverTitle: 'Help Desk',
    year: 'Fall 2024',
    context: 'CSE 360 Software Engineering',
    tags: ['systems'],
    logline:
      'A role-based help center for ASU students and instructors, with invite codes, one-time passwords and encrypted article groups.',
    bullets: [
      'Multi-role users (Student, Instructor, Admin) with invitation-based sign-up, expiring invite codes and OTP-based password resets.',
      'Help articles organized into groups, with Special Access Groups that encrypt sensitive articles and control who can view them.',
      'Search by keyword and level (Beginner to Expert), plus a help-request inbox for instructors and admins.',
    ],
    tech: ['Java', 'JavaFX', 'Maven', 'FXML'],
    code: 'https://github.com/mitanshm680/ASU-CSE-360-Project',
    cover: 'keyhole',
    palette: {
      bg: P.tang,
      ink: P.ink,
      accent: P.ink,
      accent2: P.news,
      title: P.news,
      shadow: P.ink,
      spine: P.avo,
      spineInk: P.news,
    },
  },
  {
    id: 'terrain',
    title: 'Procedural Terrain Generator',
    coverTitle: 'Terrain Gen',
    year: 'Spring 2024',
    context: 'C++ simulation',
    tags: ['systems'],
    logline:
      'Drops thousands of virtual dirt balls onto a grid to grow islands, then floods them and renders the result in ASCII.',
    bullets: [
      'Simulates terrain by dropping randomized “dirt balls” on a 2D grid, then applies a water level to carve out land and sea.',
      'Outputs raw, normalized and polished ASCII maps of the landmass, using C++ STL containers and seeded randomness.',
    ],
    tech: ['C++', 'STL', 'Data Structures', 'Randomization'],
    code: 'https://github.com/mitanshm680/2D-terrainmaps',
    cover: 'terrain',
    palette: {
      bg: P.mari,
      ink: P.ink,
      accent: P.avo,
      accent2: P.ink,
      title: P.news,
      shadow: P.ink,
      spine: P.avo,
      spineInk: P.news,
    },
  },
  {
    id: 'transcripts',
    title: 'Video Transcript Generator',
    coverTitle: 'Transcriber',
    year: 'Summer 2024',
    context: 'Python automation',
    tags: ['data', 'systems'],
    logline: 'Turns any video into a timestamped transcript by chunking the audio and transcribing the pieces in parallel.',
    bullets: [
      'Extracts audio with moviepy, splits it into 30-second chunks with pydub, and transcribes the chunks concurrently with SpeechRecognition.',
      'Stitches results back together with timestamps and shows progress with tqdm.',
    ],
    tech: ['Python', 'moviepy', 'pydub', 'SpeechRecognition', 'Concurrency'],
    code: 'https://github.com/mitanshm680/video-transcript-generator',
    cover: 'waveform',
    palette: {
      bg: P.ink,
      ink: P.news,
      accent: P.mari,
      accent2: P.tang,
      title: P.news,
      shadow: P.tom,
      spine: P.mari,
      spineInk: P.ink,
    },
  },
  {
    id: 'pdf-filler',
    title: 'PDF Form Filler',
    coverTitle: 'Form Filler',
    year: 'Spring 2024',
    context: 'Python automation',
    tags: ['systems'],
    logline: 'Fills two long purchase-request PDFs from one short set of prompts, so nobody types the same vendor details twice.',
    bullets: [
      'Reads every form field from the source PDFs, maps prompted answers (vendor, cost center, amounts, line items) onto the right fields, and writes filled copies.',
      'Handles variable-length item tables, padding unused rows automatically.',
    ],
    tech: ['Python', 'fillpdf', 'Automation'],
    code: 'https://github.com/mitanshm680/PDFs-filler',
    cover: 'form',
    palette: {
      bg: P.news,
      ink: P.ink,
      accent: P.ink,
      accent2: P.tom,
      title: P.avo,
      shadow: P.ink,
      spine: P.tom,
      spineInk: P.ink,
    },
  },
];

export const tvChannels = ['smartbrief', 'career-planner', 'jet2holiday', 'inventory'];

export type FilterId = 'all' | Tag | 'team';

export const filters: { id: FilterId; label: string }[] = [
  { id: 'all', label: 'Everything' },
  { id: 'data', label: 'Data & AI' },
  { id: 'fullstack', label: 'Full-stack' },
  { id: 'systems', label: 'Systems & tools' },
  { id: 'team', label: 'Team projects' },
];

export const matchesFilter = (p: Project, f: FilterId) => (f === 'all' ? true : f === 'team' ? !!p.team : p.tags.includes(f));

export const experience = [
  {
    org: 'Qualaces Inc.',
    role: 'Full Stack Developer Intern',
    where: 'Remote',
    dates: 'Oct 2025 – Apr 2026',
    slot: '’25–’26',
    genre: 'Drama',
    bullets: [
      'Designed and built the core Test Suite system from scratch: a suite → section → test-case hierarchy, sub-functionality filtering, manual test-case creation and a full localStorage persistence layer.',
      'Architected the Test Run and Milestone modules end to end, covering execution flow, user and role assignment, section linking and milestone tracking, with a complete UI redesign.',
      'Designed the User Management module from the ground up, delivering team management and role-based views across the platform.',
      'Built reusable UI components and integrated RESTful APIs in an Agile team, shipping through Git and code reviews.',
    ],
    tags: ['React', 'TypeScript', 'REST APIs', 'Agile'],
  },
  {
    org: 'Ira A. Fulton Schools of Engineering, ASU',
    role: 'Engineering Peer Mentor',
    where: 'Tempe, AZ',
    dates: 'Aug 2023 – May 2026',
    slot: '’23–’26',
    genre: 'Coming-of-age',
    bullets: [
      'Mentored 300+ first-year engineering students over three years as their first contact for advising and academic support.',
      'Planned and led weekly workshops on programming fundamentals, study strategies and campus resources.',
      'Worked with faculty and advisors to spot at-risk students early and connect them with support, tracking progress in Salesforce.',
    ],
    tags: ['Mentoring', 'Workshops', 'Salesforce'],
  },
  {
    org: 'Arizona State University',
    role: 'Sustainability Eco-Representative',
    where: 'Tempe, AZ',
    dates: 'Aug 2024 – May 2026',
    slot: '’24–’26',
    genre: 'Documentary',
    bullets: [
      'Led campus-wide sustainability outreach, engaging 500+ students through events and workshops.',
      'Designed awareness projects on fast fashion, responsible consumption, fair trade and environmental justice.',
      'Produced educational materials, presentations and digital content, and ran original events with staff and student leaders.',
    ],
    tags: ['Public speaking', 'Event planning', 'Content'],
  },
];

export const hackathons = [
  {
    event: 'SunHacks 2025',
    project: 'Plz_Use_It',
    award: '3rd place',
    field: '130+',
    winner: true,
    description:
      'An AI study planner that reads Canvas assignments and Google Calendar events, then uses Gemini to build an optimized study schedule with smart conflict resolution and real-time adjustments.',
    tech: ['Next.js', 'TypeScript', 'Node.js', 'Gemini API', 'Google Calendar API', 'Tailwind CSS'],
    code: 'https://github.com/mitanshm680/SunHacks',
    devpost: 'https://devpost.com/software/plz_use_it',
    role: '',
  },
  {
    event: 'Claude Hacks 2026',
    project: 'BROKE U',
    award: 'Finance RPG',
    field: '',
    winner: false,
    description:
      'A browser game that teaches money by making you survive it: budget a salary, invest in stocks, index funds, real estate and crypto, and race a computer opponent or your friends to the highest net worth over 20 in-game years.',
    tech: ['React', 'TypeScript', 'Vite', 'WebSockets', 'Node.js', 'Python', 'yfinance'],
    code: 'https://github.com/UGD1001/claude_hacks_BrokeU',
    devpost: '',
    role: 'I built multiplayer: a Node WebSocket relay, lobbies with 6-character session codes, and a seeded random generator so every player sees the same market crashes and life events.',
  },
  {
    event: 'NexHack 2026',
    project: 'Minerva',
    award: 'AI dev tool',
    field: '',
    winner: false,
    description:
      'An AI sprint-report generator: it pulls GitHub commits, pull requests and Jira issues for a sprint, then has Gemini write a cited report with individual contributions, blockers, a velocity score and next steps.',
    tech: ['React', 'TypeScript', 'Vite', 'Gemini API', 'GitHub API', 'Jira API', 'Recharts'],
    code: 'https://github.com/ktruong0712/NexHack',
    devpost: '',
    role: 'When the team switched ideas, I built the first working version: the GitHub and Jira data services, the Gemini prompt and report schema, and the sprint setup, calendar and report screens. Teammates then redesigned the UI.',
  },
  {
    event: 'Opportunity Hack 2025',
    project: 'Sparky LMS',
    award: 'For a nonprofit',
    field: '',
    winner: false,
    description:
      'A learning management system for Neurologic Music Therapy Services of Arizona: role-based access, secure cloud storage for videos and PDFs, real-time content management and a mobile-friendly design.',
    tech: ['React', 'TypeScript', 'Firebase', 'Firestore', 'Firebase Storage', 'Tailwind CSS'],
    code: 'https://github.com/2025-Arizona-Opportunity-Hack/sharky-NMTSAEducationPlatfo',
    devpost: 'https://devpost.com/software/sharky-y52zxk',
    role: '',
  },
  {
    event: 'DevHacks S2',
    project: 'Thribble',
    award: 'Startup track',
    field: '',
    winner: false,
    description:
      'A students-only marketplace for buying, selling and trading campus essentials, with .edu verification, AI price suggestions, location-aware recommendations, messaging and a points-based rewards program.',
    tech: ['React', 'TypeScript', 'Node.js', 'Firebase'],
    code: 'https://github.com/mitanshm680/DevHacks-Startup-Track',
    devpost: 'https://devpost.com/software/thribble',
    role: '',
  },
];

export const languages = ['Python', 'Java', 'C++', 'C', 'JavaScript', 'TypeScript', 'SQL', 'R'];

export const signalChain = [
  {
    id: 'collect',
    name: 'Collect',
    blurb: 'Getting the raw signal in',
    skills: ['REST APIs', 'Web scraping', 'Spotify API', 'Google APIs', 'Canvas iCal', 'CSV & Excel'],
    usedIn: ['smartbrief', 'spotify', 'jet2holiday'],
  },
  {
    id: 'transform',
    name: 'Clean & transform',
    blurb: 'Scrubbing the noise out',
    skills: ['pandas', 'NumPy', 'SQL', 'dplyr', 'Alteryx', 'Apache Spark'],
    usedIn: ['sentiment', 'mlb', 'sentinelflow'],
  },
  {
    id: 'store',
    name: 'Store',
    blurb: 'Somewhere it can live',
    skills: ['PostgreSQL', 'MySQL', 'MongoDB', 'SQLite', 'Neo4j', 'Firebase', 'Hadoop'],
    usedIn: ['jet2holiday', 'career-planner', 'inventory'],
  },
  {
    id: 'model',
    name: 'Model & analyze',
    blurb: 'Finding what it means',
    skills: ['scikit-learn', 'River (stream ML)', 'TensorFlow', 'NLTK', 'Statistics', 'Gemini / LLMs'],
    usedIn: ['sentinelflow', 'sentiment', 'smartbrief'],
  },
  {
    id: 'ship',
    name: 'Ship & show',
    blurb: 'Putting it on the air',
    skills: ['React', 'Next.js', 'FastAPI', 'Node.js', 'WebSockets', 'Tableau', 'AWS'],
    usedIn: ['smartbrief', 'inventory', 'mlb'],
  },
];

export const tools = [
  'Git & GitHub',
  'GitHub Actions',
  'pytest',
  'Linux',
  'Docker',
  'Figma',
  'VS Code',
  'Salesforce',
  'Tailwind CSS',
];

export const coursework = {
  grad: ['Data Processing at Scale', 'Software Security', 'Data Mining', 'Statistics for Data Analysts'],
  undergrad: [
    'Machine Learning for Data Science',
    'Statistical Modeling & Inference for Data Science',
    'Mathematical Tools for Data Science',
    'Industry Tools for Data Science',
    'Data in R & Python',
    'Data Structures & Algorithms',
    'Operating Systems',
    'Software Engineering',
    'Information Assurance & Security',
    'Principles of Programming Languages',
    'Theoretical Computer Science',
    'Human-Computer Interaction',
    'Computer Organization & Assembly',
    'Digital Design Fundamentals',
    'Object-Oriented Programming',
    'Discrete Mathematics',
    'Applied Linear Algebra',
    'Probability & Statistics for Engineers',
  ],
};

export const certifications = [
  {
    title: 'IBM Data Science Professional Certificate',
    issuer: 'IBM · Coursera',
    image: asset('cert-ibm-data-science.webp'),
    summary: 'Data science fundamentals end to end: Python, SQL, data analysis and visualization, and machine learning.',
    skills: ['Python', 'SQL', 'Machine Learning', 'Data Visualization'],
    link: 'https://www.coursera.org/account/accomplishments/specialization/NUT3R5BS2ZQC',
  },
  {
    title: 'Alteryx Designer Core',
    issuer: 'Alteryx',
    image: asset('cert-alteryx-designer-core.webp'),
    summary: 'Proficiency in data preparation, blending and analysis, building repeatable ETL workflows in Alteryx Designer.',
    skills: ['Alteryx', 'ETL', 'Data Cleaning', 'Automation'],
    link: 'https://www.credly.com/badges/e7753713-1644-4456-889e-69c443c338e9/linked_in_profile',
  },
  {
    title: 'MongoDB Python Developer Path',
    issuer: 'MongoDB University',
    image: asset('cert-mongodb-python.webp'),
    summary: 'Building Python applications on MongoDB: data modeling, CRUD operations and database design.',
    skills: ['MongoDB', 'Python', 'Data Modeling', 'CRUD'],
    link: 'https://learn.mongodb.com/c/gnslx7wWQ2aLHfg1fa7RXA',
  },
];

export const projectById = (id: string) => projects.find((p) => p.id === id);
