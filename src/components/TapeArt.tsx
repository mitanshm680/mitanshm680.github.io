import type { Cover, Palette } from '../data/portfolio';

/** Geometric cover art for each project: one motif per subject. Purely decorative. */
export function TapeArt({ cover, palette, className = '' }: { cover: Cover; palette: Palette; className?: string }) {
  const { accent: a, accent2: b, bg, ink } = palette;
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true" preserveAspectRatio="xMidYMid meet">
      {cover === 'waves' && (
        <g>
          {[30, 55, 80, 105, 130, 155, 180].map((r, i) => (
            <circle key={r} cx="100" cy="212" r={r} fill="none" stroke={a} strokeWidth="9" opacity={1 - i * 0.11} />
          ))}
          <path
            d="M100 118 L80 200 M100 118 L120 200 M86 172 L114 172 M90 152 L110 152"
            stroke={b}
            strokeWidth="6"
            strokeLinecap="round"
          />
          <circle cx="100" cy="112" r="8" fill={b} />
        </g>
      )}

      {cover === 'graph' && (
        <g>
          {[
            [40, 62, 100, 38],
            [100, 38, 160, 72],
            [40, 62, 70, 122],
            [100, 38, 70, 122],
            [100, 38, 142, 132],
            [160, 72, 142, 132],
            [70, 122, 100, 176],
            [142, 132, 100, 176],
            [70, 122, 30, 162],
            [142, 132, 176, 172],
          ].map(([x1, y1, x2, y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={a} strokeWidth="4" strokeLinecap="round" />
          ))}
          {[
            [40, 62, 11, a],
            [100, 38, 14, b],
            [160, 72, 11, a],
            [70, 122, 13, a],
            [142, 132, 13, b],
            [100, 176, 15, a],
            [30, 162, 9, b],
            [176, 172, 9, b],
          ].map(([cx, cy, r, f], i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill={f as string}
              stroke={ink === '#F3E6CC' ? '#120B09' : ink}
              strokeWidth="3"
            />
          ))}
        </g>
      )}

      {cover === 'route' && (
        <g>
          <circle cx="100" cy="128" r="72" fill="none" stroke={b} strokeWidth="3" opacity="0.35" />
          <ellipse cx="100" cy="128" rx="34" ry="72" fill="none" stroke={b} strokeWidth="3" opacity="0.35" />
          <line x1="28" y1="128" x2="172" y2="128" stroke={b} strokeWidth="3" opacity="0.35" />
          <path d="M40 98 H160 M40 158 H160" stroke={b} strokeWidth="3" opacity="0.25" />
          <path d="M44 160 Q96 20 162 112" fill="none" stroke={a} strokeWidth="5" strokeDasharray="10 8" strokeLinecap="round" />
          <circle cx="44" cy="160" r="9" fill={a} stroke={b} strokeWidth="3" />
          <circle cx="162" cy="112" r="9" fill={a} stroke={b} strokeWidth="3" />
          <path d="M104 62 l20 6 -20 6 4 -6z" fill={b} transform="rotate(14 112 68)" />
        </g>
      )}

      {cover === 'blocks' && (
        <g stroke={ink === '#F3E6CC' ? '#120B09' : ink} strokeWidth="3">
          {[
            [28, 148, a],
            [80, 148, b],
            [132, 148, a],
            [54, 104, b],
            [106, 104, a],
            [80, 60, a],
          ].map(([x, y, f], i) => (
            <g key={i}>
              <rect x={x as number} y={y as number} width="48" height="42" rx="3" fill={f as string} />
              <line x1={(x as number) + 24} y1={y as number} x2={(x as number) + 24} y2={(y as number) + 14} />
              <line x1={(x as number) + 8} y1={(y as number) + 30} x2={(x as number) + 22} y2={(y as number) + 30} />
            </g>
          ))}
        </g>
      )}

      {cover === 'vinyl' && (
        <g style={{ transformOrigin: '118px 122px', animation: 'spin 9s linear infinite' }}>
          <circle cx="118" cy="122" r="80" fill="#120B09" />
          {[72, 62, 52, 42].map((r) => (
            <circle key={r} cx="118" cy="122" r={r} fill="none" stroke="#3A2A22" strokeWidth="2.5" />
          ))}
          <circle cx="118" cy="122" r="26" fill={a} />
          <circle cx="118" cy="122" r="26" fill="none" stroke={b} strokeWidth="5" />
          <rect x="116" y="100" width="4" height="12" fill="#120B09" />
          <circle cx="118" cy="122" r="4" fill="#120B09" />
        </g>
      )}

      {cover === 'bars' && (
        <g>
          {[
            [24, 70, '#E8432E'],
            [50, 104, '#E8432E'],
            [76, 52, '#F07F23'],
            [102, 88, '#F6B21B'],
            [128, 120, '#4F5D2F'],
            [154, 150, '#4F5D2F'],
          ].map(([x, h, f]) => (
            <rect
              key={x as number}
              x={x as number}
              y={186 - (h as number)}
              width="22"
              height={h as number}
              fill={f as string}
              stroke="#120B09"
              strokeWidth="3"
            />
          ))}
          <line x1="14" y1="186" x2="188" y2="186" stroke="#120B09" strokeWidth="4" />
        </g>
      )}

      {cover === 'diamond' && (
        <g>
          <path d="M22 150 Q100 40 178 150" fill="none" stroke={b} strokeWidth="5" />
          <polygon points="100,92 146,138 100,184 54,138" fill="none" stroke={a} strokeWidth="5" />
          {[
            [100, 92],
            [146, 138],
            [54, 138],
          ].map(([x, y]) => (
            <rect key={`${x}-${y}`} x={x - 7} y={y - 7} width="14" height="14" fill={a} transform={`rotate(45 ${x} ${y})`} />
          ))}
          <polygon points="100,178 107,184 100,192 93,184" fill={a} />
          <circle cx="100" cy="140" r="7" fill={b} />
          <circle cx="158" cy="46" r="20" fill="#F3E6CC" />
          <path d="M146 32 q8 14 0 28 M170 32 q-8 14 0 28" fill="none" stroke="#E8432E" strokeWidth="2.5" />
        </g>
      )}

      {cover === 'keyhole' && (
        <g>
          <path d="M66 104 V78 a34 34 0 0 1 68 0 V104" fill="none" stroke={a} strokeWidth="14" />
          <rect x="44" y="100" width="112" height="90" rx="12" fill={a} />
          <circle cx="100" cy="134" r="14" fill={bg} />
          <polygon points="93,140 107,140 112,170 88,170" fill={bg} />
        </g>
      )}

      {cover === 'terrain' && (
        <g>
          <polygon points="0,170 40,96 70,128 104,66 140,120 168,92 200,140 200,200 0,200" fill={b} opacity="0.28" />
          <polygon points="0,180 34,132 64,150 96,108 132,148 166,124 200,160 200,200 0,200" fill={a} />
          <polygon points="96,108 106,122 88,122" fill="#F3E6CC" />
          <rect x="0" y="172" width="200" height="28" fill="#120B09" />
          <path
            d="M8 182 q8 -6 16 0 t16 0 t16 0 M72 190 q8 -6 16 0 t16 0 t16 0 M136 182 q8 -6 16 0 t16 0 t16 0"
            fill="none"
            stroke="#F6B21B"
            strokeWidth="2.5"
          />
        </g>
      )}

      {cover === 'waveform' && (
        <g>
          {[18, 34, 52, 26, 70, 92, 60, 40, 84, 110, 74, 48, 30, 56, 38, 20].map((h, i) => (
            <rect key={i} x={10 + i * 11.5} y={130 - h / 2} width="7" height={h} rx="3" fill={i % 5 === 4 ? b : a} />
          ))}
          <line x1="104" y1="60" x2="104" y2="200" stroke="#E8432E" strokeWidth="3" />
          <polygon points="96,56 112,56 104,66" fill="#E8432E" />
        </g>
      )}

      {cover === 'radar' && (
        <g>
          <circle cx="104" cy="118" r="78" fill="none" stroke={a} strokeWidth="4" />
          {[54, 30].map((r) => (
            <circle key={r} cx="104" cy="118" r={r} fill="none" stroke={a} strokeWidth="2.5" opacity="0.55" />
          ))}
          <path d="M26 118 H182 M104 40 V196" stroke={a} strokeWidth="2" opacity="0.4" />
          <g style={{ transformOrigin: '104px 118px', animation: 'spin 4s linear infinite' }}>
            <path d="M104 118 L104 40 A78 78 0 0 1 170 76 Z" fill={a} opacity="0.32" />
            <line x1="104" y1="118" x2="104" y2="40" stroke={a} strokeWidth="3" />
          </g>
          <circle cx="138" cy="92" r="7" fill="#E8432E" stroke="#120B09" strokeWidth="2" />
          <circle cx="74" cy="146" r="4.5" fill={b} />
          <circle cx="122" cy="162" r="4.5" fill={b} />
          <circle cx="66" cy="96" r="4" fill={b} opacity="0.7" />
        </g>
      )}

      {cover === 'form' && (
        <g>
          <rect
            x="44"
            y="34"
            width="120"
            height="156"
            rx="4"
            fill="#FFF8EA"
            stroke="#120B09"
            strokeWidth="3"
            transform="rotate(-6 104 112)"
          />
          <g transform="rotate(-6 104 112)">
            {[62, 84, 106, 128].map((y) => (
              <g key={y}>
                <rect x="58" y={y - 8} width="14" height="14" fill="none" stroke="#120B09" strokeWidth="2.5" />
                <path d={`M61 ${y - 1} l4 4 7 -9`} fill="none" stroke={b} strokeWidth="3" strokeLinecap="round" />
                <line x1="80" y1={y} x2="148" y2={y} stroke="#120B09" strokeWidth="3" opacity="0.6" />
              </g>
            ))}
            <path d="M62 166 q10 -16 18 0 t18 0 t18 -4 t16 4" fill="none" stroke={b} strokeWidth="3" strokeLinecap="round" />
          </g>
        </g>
      )}
    </svg>
  );
}
