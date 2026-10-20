import { forwardRef, useImperativeHandle, useLayoutEffect, useRef } from 'react';

/**
 * Mitansh as the MM-TV host: a TV for a head with his pixel face on the screen
 * (black hair, clear-frame glasses), black tee, jeans, sneakers.
 * Figure origin (0,0) is the base of the neck. Hands meet at (0,-72) when hanging;
 * the soles touch y = 82.
 */

export type Face = 'smile' | 'blink' | 'wow' | 'grin';
export interface AvatarState {
  /** 0 = hanging, 1 = flying, 2 = standing. Fractions blend between poses. */
  pose: number;
  /** Leg angles in degrees (left, right). Positive swings the foot to the right. */
  legL: number;
  legR: number;
  /** Waving arm angle offset in degrees (standing pose). */
  wave: number;
  face: Face;
}
export interface AvatarHandle {
  set: (s: AvatarState) => void;
}

export const HANDS_Y = -72;
export const FEET_Y = 82;

const FACES: Record<Face, string[]> = {
  smile: [
    '..hhhhhh..',
    '.hhhhhhhh.',
    '.hssssssh.',
    '.gggssggg.',
    '.gegssgeg.',
    '.gggssggg.',
    '.ssmssmss.',
    '..ssmmss..',
    '...ssss...',
  ],
  blink: [
    '..hhhhhh..',
    '.hhhhhhhh.',
    '.hssssssh.',
    '.gggssggg.',
    '.gggssggg.',
    '.gggssggg.',
    '.ssmssmss.',
    '..ssmmss..',
    '...ssss...',
  ],
  wow: [
    '..hhhhhh..',
    '.hhhhhhhh.',
    '.hssssssh.',
    '.gggssggg.',
    '.gegssgeg.',
    '.gggssggg.',
    '.sssmmsss.',
    '..smssms..',
    '...smms...',
  ],
  grin: [
    '..hhhhhh..',
    '.hhhhhhhh.',
    '.hssssssh.',
    '.gggssggg.',
    '.gegssgeg.',
    '.gggssggg.',
    '.smmmmmms.',
    '..smwwms..',
    '...ssss...',
  ],
};
const PIX: Record<string, string> = {
  h: '#1E1512',
  s: '#C98E62',
  g: '#FBF6EC',
  e: '#120B09',
  m: '#7A2E1F',
  w: '#FBF6EC',
};

const SHOULDER_L = { x: -13, y: 3 };
const SHOULDER_R = { x: 13, y: 3 };
// hand positions for each pose: hang, fly, stand
const HAND_L = [
  { x: -4, y: -70 },
  { x: -19, y: -60 },
  { x: -20, y: 31 },
];
const HAND_R = [
  { x: 4, y: -70 },
  { x: 19, y: -60 },
  { x: 25, y: -23 },
];
const LEG_SPREAD = [4, 24, 3];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
function blend<T extends { x: number; y: number }>(keys: T[], pose: number) {
  const i = Math.min(1, Math.floor(pose));
  const f = Math.min(1, Math.max(0, pose - i));
  return { x: lerp(keys[i].x, keys[i + 1].x, f), y: lerp(keys[i].y, keys[i + 1].y, f) };
}

function PixelFace({ face }: { face: Face }) {
  return (
    <>
      {FACES[face].flatMap((row, r) =>
        row
          .split('')
          .map((ch, c) =>
            ch === '.' ? null : (
              <rect key={`${r}-${c}`} x={-18 + c * 3} y={-39 + r * 3} width="3.05" height="3.05" fill={PIX[ch]} />
            ),
          ),
      )}
    </>
  );
}

interface ArmRefs {
  outline: SVGLineElement | null;
  skin: SVGLineElement | null;
  sleeveOut: SVGLineElement | null;
  sleeve: SVGLineElement | null;
  hand: SVGCircleElement | null;
}

function Arm({ refs }: { refs: ArmRefs }) {
  return (
    <g>
      <line ref={(el) => (refs.outline = el)} stroke="#120B09" strokeWidth="11" strokeLinecap="round" />
      <line ref={(el) => (refs.skin = el)} stroke="#C98E62" strokeWidth="6.5" strokeLinecap="round" />
      <line ref={(el) => (refs.sleeveOut = el)} stroke="#120B09" strokeWidth="14" strokeLinecap="round" />
      <line ref={(el) => (refs.sleeve = el)} stroke="#2B2220" strokeWidth="9.5" strokeLinecap="round" />
      <circle ref={(el) => (refs.hand = el)} r="5.6" fill="#C98E62" stroke="#120B09" strokeWidth="2.6" />
    </g>
  );
}

function Leg({ x, gRef }: { x: number; gRef: (el: SVGGElement | null) => void }) {
  return (
    <g ref={gRef}>
      <line x1={x} y1="34" x2={x} y2="72" stroke="#120B09" strokeWidth="13" strokeLinecap="round" />
      <line x1={x} y1="34" x2={x} y2="72" stroke="#3D5378" strokeWidth="8" strokeLinecap="round" />
      <ellipse cx={x + (x < 0 ? -2 : 2)} cy="76.5" rx="8" ry="5" fill="#F3E6CC" stroke="#120B09" strokeWidth="2.6" />
      <line
        x1={x - 6 + (x < 0 ? -2 : 2)}
        y1="80"
        x2={x + 6 + (x < 0 ? -2 : 2)}
        y2="80"
        stroke="#E8432E"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </g>
  );
}

export const Avatar = forwardRef<AvatarHandle, { idPrefix: string; initial?: AvatarState }>(function Avatar(
  { idPrefix, initial },
  ref,
) {
  const armL = useRef<ArmRefs>({ outline: null, skin: null, sleeveOut: null, sleeve: null, hand: null }).current;
  const armR = useRef<ArmRefs>({ outline: null, skin: null, sleeveOut: null, sleeve: null, hand: null }).current;
  const legL = useRef<SVGGElement | null>(null);
  const legR = useRef<SVGGElement | null>(null);
  const faces = useRef<Record<string, SVGGElement | null>>({});
  const last = useRef<{ face: Face | '' }>({ face: '' });

  const placeArm = (a: ArmRefs, sh: { x: number; y: number }, hand: { x: number; y: number }) => {
    const dx = hand.x - sh.x;
    const dy = hand.y - sh.y;
    const len = Math.hypot(dx, dy) || 1;
    const sx = sh.x + (dx / len) * 9;
    const sy = sh.y + (dy / len) * 9;
    for (const l of [a.outline, a.skin]) {
      if (!l) continue;
      l.setAttribute('x1', String(sh.x));
      l.setAttribute('y1', String(sh.y));
      l.setAttribute('x2', String(hand.x));
      l.setAttribute('y2', String(hand.y));
    }
    for (const l of [a.sleeveOut, a.sleeve]) {
      if (!l) continue;
      l.setAttribute('x1', String(sh.x));
      l.setAttribute('y1', String(sh.y));
      l.setAttribute('x2', String(sx));
      l.setAttribute('y2', String(sy));
    }
    a.hand?.setAttribute('cx', String(hand.x));
    a.hand?.setAttribute('cy', String(hand.y));
  };

  const apply = (s: AvatarState) => {
    const hl = blend(HAND_L, s.pose);
    let hr = blend(HAND_R, s.pose);
    if (s.wave && s.pose > 1) {
      const a = (s.wave * Math.PI) / 180;
      const dx = hr.x - SHOULDER_R.x;
      const dy = hr.y - SHOULDER_R.y;
      hr = { x: SHOULDER_R.x + dx * Math.cos(a) - dy * Math.sin(a), y: SHOULDER_R.y + dx * Math.sin(a) + dy * Math.cos(a) };
    }
    placeArm(armL, SHOULDER_L, hl);
    placeArm(armR, SHOULDER_R, hr);
    const spread = blend(
      LEG_SPREAD.map((v) => ({ x: v, y: 0 })),
      s.pose,
    ).x;
    legL.current?.setAttribute('transform', `rotate(${(spread + s.legL).toFixed(2)} -7 34)`);
    legR.current?.setAttribute('transform', `rotate(${(-spread + s.legR).toFixed(2)} 7 34)`);
    if (last.current.face !== s.face) {
      for (const [k, el] of Object.entries(faces.current)) if (el) el.style.display = k === s.face ? '' : 'none';
      last.current.face = s.face;
    }
  };

  useImperativeHandle(ref, () => ({ set: apply }));

  const filterId = `${idPrefix}-outline`;
  const init = initial ?? { pose: 0, legL: 0, legR: 0, wave: 0, face: 'smile' as Face };
  useLayoutEffect(() => {
    apply(init);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <svg
      viewBox="-80 -100 160 200"
      width="160"
      height="200"
      style={{ position: 'absolute', left: -80, top: -100, overflow: 'visible' }}
      aria-hidden="true"
    >
      <defs>
        <filter id={filterId} x="-30%" y="-30%" width="160%" height="160%">
          <feMorphology in="SourceAlpha" operator="dilate" radius="2.4" result="fat" />
          <feFlood floodColor="#F3E6CC" />
          <feComposite in2="fat" operator="in" result="rim" />
          <feMerge>
            <feMergeNode in="rim" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter={`url(#${filterId})`}>
        <Leg x={-7} gRef={(el) => (legL.current = el)} />
        <Leg x={7} gRef={(el) => (legR.current = el)} />
        {/* jeans waistband */}
        <rect x="-14" y="27" width="28" height="11" rx="4" fill="#3D5378" stroke="#120B09" strokeWidth="2.8" />
        {/* torso */}
        <rect x="-15.5" y="-3" width="31" height="35" rx="8" fill="#2B2220" stroke="#120B09" strokeWidth="3" />
        <path d="M-7 -3 L0 6 L7 -3" fill="#3A2D29" stroke="#120B09" strokeWidth="2" strokeLinejoin="round" />
        {/* MM-TV staff pin */}
        <circle cx="7" cy="13" r="4" fill="#F6B21B" stroke="#120B09" strokeWidth="1.8" />
        <Arm refs={armL} />
        <Arm refs={armR} />
        {/* neck */}
        <rect x="-5" y="-9" width="10" height="9" fill="#A8714A" stroke="#120B09" strokeWidth="2.4" />
        {/* TV head */}
        <line x1="-6" y1="-44" x2="-15" y2="-59" stroke="#120B09" strokeWidth="2.6" strokeLinecap="round" />
        <line x1="5" y1="-44" x2="13" y2="-58" stroke="#120B09" strokeWidth="2.6" strokeLinecap="round" />
        <circle cx="-15" cy="-59" r="3" fill="#E8432E" stroke="#120B09" strokeWidth="1.6" />
        <circle cx="13" cy="-58" r="3" fill="#E8432E" stroke="#120B09" strokeWidth="1.6" />
        <rect x="-25" y="-45" width="50" height="39" rx="9" fill="#F6B21B" stroke="#120B09" strokeWidth="3" />
        <rect x="-20" y="-41" width="34" height="31" rx="6" fill="#F3E6CC" stroke="#120B09" strokeWidth="2.2" />
        {(Object.keys(FACES) as Face[]).map((f) => (
          <g key={f} ref={(el) => (faces.current[f] = el)} style={{ display: f === init.face ? undefined : 'none' }}>
            <PixelFace face={f} />
          </g>
        ))}
        <rect x="-20" y="-41" width="34" height="31" rx="6" fill="none" stroke="#120B09" strokeWidth="2.2" />
        <circle cx="19.5" cy="-33" r="2.6" fill="#120B09" />
        <circle cx="19.5" cy="-22" r="2.6" fill="#120B09" />
        <path d="M17 -14 H22" stroke="#120B09" strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  );
});
