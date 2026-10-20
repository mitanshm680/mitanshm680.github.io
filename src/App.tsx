import { MotionConfig, useReducedMotion } from 'framer-motion';
import { useEffect } from 'react';
import { About } from './components/About';
import { BootSequence } from './components/BootSequence';
import { Contact } from './components/Contact';
import { Courses } from './components/Courses';
import { Experience } from './components/Experience';
import { Footer } from './components/Footer';
import { Hackathons } from './components/Hackathons';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { IntroStatic, UnrollIntro } from './components/intro/UnrollIntro';
import { ChannelOverlay, Toast } from './components/Overlays';
import { ProjectModal } from './components/ProjectModal';
import { Projects } from './components/Projects';
import { Skills } from './components/Skills';
import { useKonami, useStoredBoolean } from './lib/hooks';
import { StationProvider, useStation } from './lib/station';

function Station() {
  const [phosphor, setPhosphor] = useStoredBoolean('mm680-phosphor', false);
  const { toast } = useStation();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    document.documentElement.classList.toggle('phosphor', phosphor);
  }, [phosphor]);

  useKonami(() => {
    setPhosphor((p) => {
      toast(p ? 'FULL COLOR RESTORED' : 'GREEN PHOSPHOR MODE UNLOCKED');
      return !p;
    });
  });

  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#work"
        className="sr-only z-[120] rounded bg-marigold px-4 py-2 font-bold text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to projects
      </a>
      <BootSequence />
      <Header />
      <main>
        {reduceMotion ? <IntroStatic /> : <UnrollIntro />}
        <Hero />
        <About />
        <Projects />
        <Experience />
        <Hackathons />
        <Skills />
        <Courses />
        <Contact />
      </main>
      <Footer />
      <ProjectModal />
      <ChannelOverlay />
      <Toast />
      <div aria-hidden="true" className="crt-overlay" />
    </MotionConfig>
  );
}

export default function App() {
  return (
    <StationProvider>
      <Station />
    </StationProvider>
  );
}
