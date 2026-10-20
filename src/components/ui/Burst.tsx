import type { CSSProperties, ReactNode } from 'react';

/** A two-tone starburst sticker. Decorative: hidden from assistive tech. */
export function Burst({
  children,
  size = 110,
  outer = '#E8432E',
  inner = '#F6B21B',
  ink = '#120B09',
  className = '',
  style,
  fontSize = 17,
}: {
  children: ReactNode;
  size?: number;
  outer?: string;
  inner?: string;
  ink?: string;
  className?: string;
  style?: CSSProperties;
  fontSize?: number;
}) {
  return (
    <div
      aria-hidden="true"
      className={`burst flex items-center justify-center ${className}`}
      style={{ width: size, height: size, background: outer, ...style }}
    >
      <div
        className="burst flex items-center justify-center text-center font-display leading-none"
        style={{ width: size * 0.86, height: size * 0.86, background: inner, color: ink, fontSize }}
      >
        <span>{children}</span>
      </div>
    </div>
  );
}
