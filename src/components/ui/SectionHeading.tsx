import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

/**
 * Section title: channel number (matches the nav), a display headline
 * that lands with a little bounce, and a plain-language subtitle.
 */
export function SectionHeading({
  num,
  title,
  subtitle,
  tone = 'dark',
  align = 'left',
  id,
  children,
}: {
  num: string;
  title: string;
  subtitle: string;
  tone?: 'dark' | 'light' | 'marigold';
  align?: 'left' | 'center';
  id?: string;
  children?: ReactNode;
}) {
  const reduce = useReducedMotion();
  const titleColor = tone === 'dark' ? 'text-marigold' : 'text-ink';
  const subColor = tone === 'dark' ? 'text-parchment' : 'text-ink';
  const badge = tone === 'dark' ? 'bg-marigold text-ink' : 'bg-ink text-marigold';
  const shadow =
    tone === 'dark' ? '4px 4px 0 #E8432E' : tone === 'light' ? '4px 4px 0 #F6B21B' : '4px 4px 0 #F3E6CC, 8px 8px 0 #E8432E';

  return (
    <div className={`flex flex-col gap-3 ${align === 'center' ? 'items-center text-center' : 'items-start'}`}>
      <span className={`inline-flex items-center gap-2 rounded px-2 py-0.5 font-screen text-[20px] leading-tight ${badge}`}>
        CH {num}
      </span>
      <motion.h2
        id={id}
        className={`font-display text-[clamp(44px,6.4vw,92px)] font-normal leading-[0.95] ${titleColor}`}
        style={{ textShadow: shadow }}
        initial={reduce ? false : { y: 18, rotate: -3, scale: 0.96 }}
        whileInView={{ y: 0, rotate: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
      >
        {title}
      </motion.h2>
      <p className={`max-w-[36rem] text-[19px] leading-relaxed ${subColor}`}>{subtitle}</p>
      {children}
    </div>
  );
}
