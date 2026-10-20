const TOP = ['#C0C0C0', '#C0C000', '#00C0C0', '#00C000', '#C000C0', '#C00000', '#0000C0'];
const MID = ['#0000C0', '#131313', '#C000C0', '#131313', '#00C0C0', '#131313', '#C0C0C0'];
const LOW: [string, number][] = [
  ['#00214C', 5],
  ['#FFFFFF', 5],
  ['#32006A', 5],
  ['#131313', 7],
  ['#090909', 2],
  ['#1D1D1D', 2],
  ['#131313', 4],
];

/** SMPTE-style test pattern. `strip` renders just the top row of bars. */
export function ColorBars({ variant = 'full', className = '' }: { variant?: 'full' | 'strip'; className?: string }) {
  if (variant === 'strip') {
    return (
      <div aria-hidden="true" className={`grid grid-cols-7 ${className}`}>
        {TOP.map((c) => (
          <div key={c} style={{ background: c }} />
        ))}
      </div>
    );
  }
  return (
    <div aria-hidden="true" className={`flex flex-col ${className}`}>
      <div className="grid grid-cols-7" style={{ flex: '0 0 66%' }}>
        {TOP.map((c) => (
          <div key={c} style={{ background: c }} />
        ))}
      </div>
      <div className="grid grid-cols-7" style={{ flex: '0 0 9%' }}>
        {MID.map((c, i) => (
          <div key={i} style={{ background: c }} />
        ))}
      </div>
      <div className="flex" style={{ flex: '1 1 auto' }}>
        {LOW.map(([c, f], i) => (
          <div key={i} style={{ background: c, flex: f }} />
        ))}
      </div>
    </div>
  );
}
