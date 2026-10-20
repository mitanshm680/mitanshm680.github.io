import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, useRef, type ReactNode } from 'react';

/**
 * A dialog that switches on like a CRT: the picture opens from a bright
 * horizontal line, and collapses back to it on close.
 */
export function Modal({
  open,
  onClose,
  label,
  children,
  maxWidth = 920,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  children: ReactNode;
  maxWidth?: number;
}) {
  const reduce = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    restoreRef.current = document.activeElement as HTMLElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const t = window.setTimeout(() => closeRef.current?.focus(), 30);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])',
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      restoreRef.current?.focus?.();
    };
  }, [open, onClose]);

  const crt = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { scaleY: 0.004, scaleX: 0.55, opacity: 0.9, filter: 'brightness(4)' },
        animate: {
          scaleY: [0.004, 0.004, 1],
          scaleX: [0.55, 1, 1],
          opacity: 1,
          filter: ['brightness(4)', 'brightness(3)', 'brightness(1)'],
          transition: { duration: 0.5, times: [0, 0.35, 1], ease: 'easeOut' as const },
        },
        exit: {
          scaleY: [1, 0.004, 0.004],
          scaleX: [1, 1, 0],
          filter: ['brightness(1)', 'brightness(3)', 'brightness(5)'],
          transition: { duration: 0.35, times: [0, 0.6, 1] },
        },
      };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] overflow-y-auto bg-black/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { delay: reduce ? 0 : 0.2, duration: 0.2 } }}
        >
          <div
            className="flex min-h-full items-center justify-center px-3 py-8 sm:px-6 sm:py-12"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) onClose();
            }}
          >
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label={label}
              className="relative w-full origin-center"
              style={{ maxWidth }}
              {...crt}
            >
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="absolute -top-3 right-2 z-20 inline-flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-ink bg-marigold text-ink shadow-[4px_4px_0_#120B09] transition-transform hover:-translate-y-0.5 sm:-right-3"
              >
                <X className="h-6 w-6" strokeWidth={3} />
              </button>
              {children}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
