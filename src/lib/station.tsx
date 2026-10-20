import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { channels, type ChannelId } from '../data/portfolio';
import { prefersReducedMotion } from './hooks';

interface StationContext {
  /** Section currently on screen. */
  active: ChannelId;
  /** Jump to a section with a channel-change burst of static. */
  tuneTo: (id: ChannelId) => void;
  /** Static overlay visible right now. */
  staticOn: boolean;
  /** On-screen display shown after a channel change. */
  osd: { num: string; label: string; key: number } | null;
  /** Bottom-of-screen message. */
  toast: (message: string) => void;
  toastMessage: { text: string; key: number } | null;
  /** Project modal. */
  openProject: (id: string) => void;
  closeProject: () => void;
  projectId: string | null;
}

const Ctx = createContext<StationContext | null>(null);

export function StationProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<ChannelId>('top');
  const [staticOn, setStaticOn] = useState(false);
  const [osd, setOsd] = useState<StationContext['osd']>(null);
  const [toastMessage, setToastMessage] = useState<StationContext['toastMessage']>(null);
  const [projectId, setProjectId] = useState<string | null>(null);
  const timers = useRef<number[]>([]);

  // Track which section is on air.
  useEffect(() => {
    const ids: ChannelId[] = ['top', ...channels.map((c) => c.id)];
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!els.length || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id as ChannelId);
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: [0, 0.01] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  const tuneTo = useCallback((id: ChannelId) => {
    const el = document.getElementById(id);
    if (!el) return;
    const ch = channels.find((c) => c.id === id);
    const reduce = prefersReducedMotion();
    // lets the intro finish on the spot instead of playing on underneath
    window.dispatchEvent(new CustomEvent('mm:tune', { detail: id }));
    if (ch) setOsd({ num: ch.num, label: ch.label, key: Date.now() });
    later(() => setOsd(null), 1700);
    // a channel change is a hard cut, hidden under a burst of static
    const cut = () => {
      const root = document.documentElement;
      const prev = root.style.scrollBehavior;
      root.style.scrollBehavior = 'auto';
      el.scrollIntoView({ behavior: 'auto', block: 'start' });
      root.style.scrollBehavior = prev;
    };
    if (reduce) {
      cut();
    } else {
      setStaticOn(true);
      later(cut, 140);
      later(() => setStaticOn(false), 360);
    }
    try {
      history.replaceState(null, '', id === 'top' ? '#' : `#${id}`);
    } catch {
      /* ignore */
    }
  }, []);

  const toast = useCallback((text: string) => {
    setToastMessage({ text, key: Date.now() });
    later(() => setToastMessage((t) => (t && Date.now() - t.key >= 2400 ? null : t)), 2500);
  }, []);

  const openProject = useCallback((id: string) => setProjectId(id), []);
  const closeProject = useCallback(() => setProjectId(null), []);

  const value = useMemo(
    () => ({ active, tuneTo, staticOn, osd, toast, toastMessage, openProject, closeProject, projectId }),
    [active, tuneTo, staticOn, osd, toast, toastMessage, openProject, closeProject, projectId],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useStation() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useStation must be used inside <StationProvider>');
  return ctx;
}
