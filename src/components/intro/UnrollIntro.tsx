import { ChevronsDown } from 'lucide-react';
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useStation } from '../../lib/station';
import { Burst } from '../ui/Burst';
import { Avatar, FEET_Y, HANDS_Y, type AvatarHandle, type Face } from './Avatar';
import { ChannelGuide } from './ChannelGuide';
import { TILES, type TileEls, type TileId } from './tiles';
import {
  bump,
  clamp,
  easeInCubic,
  easeInOutCubic,
  easeOutBack,
  easeOutCubic,
  flowFit,
  lerp,
  offsetWithin,
  quad,
  range,
  rng,
  type Pt,
} from './math';
import { Resume } from './Resume';

/* ------------------------------------------------------------------
   The story runs from 0 to 1. Scrolling drives it up to `trig`, when the
   whole résumé is on screen. From there the explosion plays as a timed
   scene (scrolling is held so a flick can't skip it) and it ends on the
   channel guide.
   ------------------------------------------------------------------ */
const P = {
  tug0: 0.012,
  tug1: 0.07,
  u0: 0.06,
  u1: 0.56,
  bounce0: 0.56,
  bounce1: 0.63,
  z0: 0.58,
  z1: 0.665,
  trig: 0.675,
  shake0: 0.69,
  burst: 0.735,
  blast1: 0.757,
  play: 0.759,
  fly0: 0.759,
  flyDur: 0.055,
  flyStagger: 0.0115,
  flyInner: 0.003,
  avEnd: 0.875,
  land: 0.895,
  tiles0: 0.7595,
  tileStagger: 0.0115,
  title0: 0.888,
  title1: 0.912,
  ready: 0.925,
  settle: 0.93,
};

type Ease = (x: number) => number;
const lin: Ease = (x) => x;
const easeInQuad: Ease = (x) => x * x;

/** The timed scene, as [seconds, progress reached, easing]. */
const SCENE: [number, number, Ease][] = [
  [1.35, P.burst, easeInQuad], // the signal overloads
  [0.5, P.blast1, lin], // the blast
  [0.8, P.play, lin], // VHS pause on the debris
  [2.5, P.settle, lin], // everything flies to its channel
  [0.25, 1, lin],
];
interface Seg {
  t0: number;
  t1: number;
  p0: number;
  p1: number;
  ease: Ease;
}
interface Scene {
  segs: Seg[];
  dur: number;
}
function buildScene(from: number): Scene {
  // a fast scroller may arrive before the camera has finished pulling back
  const lead = clamp((P.trig - from) * 14, 0, 0.9);
  const spec: [number, number, Ease][] = lead > 0.02 ? [[lead, P.trig, easeOutCubic], ...SCENE] : SCENE;
  const segs: Seg[] = [];
  let t = 0;
  let p = from;
  for (const [d, to, ease] of spec) {
    segs.push({ t0: t, t1: t + d, p0: p, p1: to, ease });
    t += d;
    p = to;
  }
  return { segs, dur: t };
}
function sceneAt(s: Scene, tc: number) {
  for (const g of s.segs) if (tc < g.t1) return lerp(g.p0, g.p1, g.ease(range(tc, g.t0, g.t1)));
  return 1;
}

/** World geometry (CSS px at camera scale 1). The nail sits at (0,0). */
const ROD_Y = 30;
const PT = 38; // top edge of the paper
const BODY = FEET_Y - HANDS_Y; // hands → soles

const PARTICLE_COLORS = ['#F6B21B', '#F07F23', '#E8432E', '#F3E6CC', '#F6B21B', '#4F5D2F'];
const BITS = ['1', '0', '</>', '1', '★', '0', '{ }', '1'];
const GLITCH = ['#E8432E', '#F6B21B', '#F3E6CC', '#4FD1C5', '#120B09'];
const STICKERS = [
  { text: 'ZAP!', x: -0.38, y: -0.17, at: 0.0025, rot: -14, size: 128, outer: '#F6B21B', inner: '#F3E6CC' },
  { text: 'BZZT!', x: 0.33, y: 0.27, at: 0.008, rot: 11, size: 136, outer: '#F07F23', inner: '#F6B21B' },
  { text: 'BOOM!', x: -0.3, y: 0.3, at: 0.0135, rot: 7, size: 150, outer: '#E8432E', inner: '#F3E6CC' },
];
const RINGS = ['#F6B21B', '#E8432E', '#F3E6CC'];
const GLITCH_BARS = 7;

interface PieceL {
  el: HTMLElement;
  y: number;
  h: number;
  s: Pt; // screen centre at the blueprint camera
  d: Pt; // unit vector away from the blast
  a: Pt; // where the blast throws it
  a2: Pt; // where it has drifted to when it launches for its channel
  rA: number; // spin picked up in the blast
  sA: number; // scale picked up in the blast
  c: Pt; // bezier control point for the flight home
  t: Pt; // target centre in the tile
  ts: number; // target screen scale
  spin: number;
  ph: number;
  p0: number;
  p1: number;
  /** Didn't fit on its screen: tucks into the "+N" marker and fades. */
  hide: boolean;
  /** Which TV it lands on, and its turn in that TV's rotation. */
  ti: number;
  j: number;
  landed: boolean;
  o: number;
  moved: boolean;
}
interface ShardL {
  el: HTMLElement;
  dx: number;
  dy: number;
  rot: number;
}
interface PartL {
  el: HTMLElement;
  ang: number;
  dist: number;
  rot: number;
  shown: boolean;
}
interface TileL {
  els: TileEls;
  p0: number;
  on: number;
  isOn: boolean;
  s: number;
  /** Programme cards the landed pieces turn into (cycling TVs). */
  cards: HTMLElement[];
  cardO: number[];
  cycle: boolean;
  n: number;
  off: number;
  show: number;
  vis: number;
  noise: boolean;
}
interface SectionL {
  name: string;
  top: number;
  hl: HTMLElement | null;
}
interface Layout {
  ok: boolean;
  Vw: number;
  Vh: number;
  hdr: number;
  mobile: boolean;
  Wp: number;
  Lmax: number;
  trackTop: number;
  travel: number;
  pad: number;
  r0: number;
  r1: number;
  C0: number;
  C1: number;
  av: number;
  avLand: number;
  restY: number;
  followY: number;
  fitCs: number;
  fitTy: number;
  burstC: Pt;
  land: Pt;
  ringR: number;
  raysS: number;
  stkS: number;
  stickers: Pt[];
  sections: SectionL[];
  pieces: PieceL[];
  tiles: TileL[];
  shards: ShardL[];
  parts: PartL[];
  decos: HTMLElement[];
}

const SHARD_COLS = 3;
const SHARD_ROWS = 5;
const PARTICLES = 60;

/** Scroll track length for a given locked base: the scrolled part plus a little run-out. */
const trackH = (base: number, Vh: number, travel: number, pad: number) =>
  base >= P.trig ? Vh : Vh + (P.trig - base) * travel + pad;

const scrollToInstant = (y: number) => {
  const root = document.documentElement;
  const prev = root.style.scrollBehavior;
  root.style.scrollBehavior = 'auto';
  window.scrollTo(0, y);
  root.style.scrollBehavior = prev;
};

/*
 * The intro only plays forward. This lives at module level so the lock survives the
 * component remounting but resets on a page refresh.
 */
let lockedBase = 0;

type Mode = 'scroll' | 'scene' | 'done';

export function UnrollIntro() {
  const { tuneTo } = useStation();

  const trackRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const shakerRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const hangerRef = useRef<HTMLDivElement>(null);
  const hangerSvgRef = useRef<SVGSVGElement>(null);
  const hangerLineL = useRef<SVGLineElement>(null);
  const hangerLineR = useRef<SVGLineElement>(null);
  const winRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const paperBgRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const haloRef = useRef<HTMLDivElement>(null);
  const scanRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const shardsRef = useRef<HTMLDivElement>(null);
  const curlRef = useRef<HTMLDivElement>(null);
  const rollRef = useRef<HTMLDivElement>(null);
  const spiralRef = useRef<SVGGElement>(null);
  const bowRef = useRef<HTMLDivElement>(null);
  const cordOutRef = useRef<SVGPathElement>(null);
  const cordRef = useRef<SVGPathElement>(null);
  const knotRef = useRef<SVGCircleElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const avatarApi = useRef<AvatarHandle>(null);
  const partsRef = useRef<HTMLDivElement>(null);
  const powRef = useRef<HTMLDivElement>(null);
  const raysRef = useRef<HTMLDivElement>(null);
  const ringsRef = useRef<SVGSVGElement>(null);
  const stickersRef = useRef<HTMLDivElement>(null);
  const glitchRef = useRef<HTMLDivElement>(null);
  const vhsRef = useRef<HTMLParagraphElement>(null);
  const vhsBandRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const staticRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const osdTopRef = useRef<HTMLParagraphElement>(null);
  const osdRef = useRef<HTMLSpanElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const guideRef = useRef<HTMLDivElement>(null);
  const guideTitleRef = useRef<HTMLDivElement>(null);
  const tileEls = useRef<Partial<TileEls>[]>(TILES.map(() => ({})));

  const lay = useRef<Layout>({ ok: false } as Layout);
  const finished = lockedBase >= P.trig;
  const st = useRef({
    mode: (finished ? 'done' : 'scroll') as Mode,
    scene: null as Scene | null,
    t0: 0,
    /** Progress the intro can no longer scroll back past. */
    pBase: finished ? 1 : lockedBase,
    /** Furthest progress the visitor has scrolled to. */
    pMax: finished ? 1 : lockedBase,
    p: 0,
    pPrev: 0,
    snap: true,
    vel: 0,
    velPrev: 0,
    th: 0,
    thV: 0,
    phi: 0,
    phiV: 0,
    legPhase: 0,
    burst: false,
    decoO: 1,
    osd: '',
    alert: false,
    vhs: '',
    ready: false,
    shk: false,
    jitY: 0,
    jitT: 0,
    glitch: false,
    rays: false,
    ti: -1,
    readyT: 0,
  });

  // Jittered grid that the parchment shatters along (shared vertices so the pieces tile).
  const shardVerts = useMemo(() => {
    const r = rng(680);
    return Array.from({ length: SHARD_ROWS + 1 }, (_, j) =>
      Array.from({ length: SHARD_COLS + 1 }, (_, i) => {
        const edgeX = i === 0 || i === SHARD_COLS;
        const edgeY = j === 0 || j === SHARD_ROWS;
        return {
          x: i / SHARD_COLS + (edgeX ? 0 : (r() - 0.5) * 0.18),
          y: j / SHARD_ROWS + (edgeY ? 0 : (r() - 0.5) * 0.12),
        };
      }),
    );
  }, []);

  const deckle = useMemo(() => {
    // torn left/right edges for the parchment
    const r = rng(42);
    const left: string[] = [];
    const right: string[] = [];
    for (let i = 0; i <= 40; i++) {
      const y = (i / 40) * 100;
      left.push(`${(r() * 1.4).toFixed(2)}% ${y.toFixed(2)}%`);
      right.unshift(`${(100 - r() * 1.4).toFixed(2)}% ${y.toFixed(2)}%`);
    }
    return `polygon(${[...left, ...right].join(',')})`;
  }, []);

  const particleSpecs = useMemo(() => {
    const r = rng(7);
    return Array.from({ length: PARTICLES }, (_, i) => {
      const glyph = i % 4 === 3 ? BITS[(i >> 2) % BITS.length] : null;
      return {
        glyph,
        size: glyph ? 22 + Math.floor(r() * 3) * 7 : 5 + Math.floor(r() * 3) * 3,
        color: glyph ? (i % 8 === 3 ? '#F6B21B' : '#F3E6CC') : PARTICLE_COLORS[i % PARTICLE_COLORS.length],
        ang: r() * Math.PI * 2,
        dist: 0.45 + r() * 0.85,
        rot: (r() - 0.5) * (glyph ? 260 : 540),
      };
    });
  }, []);

  /* --------------------------- measurement --------------------------- */
  const applyTrackHeight = (Vh = lay.current.Vh, travel = lay.current.travel, pad = lay.current.pad) => {
    const track = trackRef.current;
    if (!track || !Vh) return;
    track.style.height = `${Math.round(trackH(st.current.pBase, Vh, travel, pad))}px`;
  };

  const layout = () => {
    const stage = stageRef.current;
    const world = worldRef.current;
    const content = contentRef.current;
    const track = trackRef.current;
    if (!stage || !world || !content || !track) return;

    const Vw = stage.clientWidth;
    const Vh = stage.clientHeight;
    const hdr = (document.querySelector('header') as HTMLElement | null)?.offsetHeight ?? 68;
    const mobile = Vw < 640;
    const Wp = Math.round(Math.min(720, Vw - (mobile ? 44 : 96)));
    const r0 = mobile ? 24 : 30;
    const r1 = mobile ? 10 : 13;
    world.style.setProperty('--wp', `${Wp}px`);
    world.style.setProperty('--r0', `${r0}px`);
    stage.style.setProperty('--hdr', `${hdr}px`);
    stage.style.setProperty('--wp', `${Wp}px`);

    const Lmax = content.offsetHeight;
    world.style.setProperty('--lmax', `${Lmax}px`);

    // hanger strings from the nail to the rod ends
    const half = Wp / 2 + 20;
    if (hangerSvgRef.current) {
      hangerSvgRef.current.setAttribute('viewBox', `${-half} -6 ${half * 2} ${ROD_Y + 6}`);
      hangerSvgRef.current.setAttribute('width', String(half * 2));
      hangerSvgRef.current.style.left = `${-half}px`;
    }
    hangerLineL.current?.setAttribute('x2', String(-Wp * 0.36));
    hangerLineR.current?.setAttribute('x2', String(Wp * 0.36));

    const C0 = mobile ? 40 : 54;
    const C1 = mobile ? 54 : 74;
    const av = mobile ? (Vh < 700 ? 0.62 : 0.74) : Vh < 820 ? 0.84 : 1;
    const restY = hdr + (mobile ? 14 : 22);
    const followY = hdr + (Vh - hdr) * (mobile ? 0.5 : 0.52);

    const total = PT + Lmax + 2 * r1 + C1 + BODY * av + 14;
    const availH = Vh - hdr - (mobile ? 20 : 44);
    const fitCs = Math.min(1, availH / total, (Vw - 24) / (Wp + 70));
    const fitTy = hdr + (Vh - hdr - fitCs * total) / 2;
    const burstC = { x: Vw / 2, y: fitTy + fitCs * (PT + Lmax / 2) };

    // headline sits under the dangling avatar at rest
    const restBottom = restY + PT + 2 * r0 + C0 + BODY * av;
    if (headlineRef.current) headlineRef.current.style.top = `${Math.round(restBottom + (mobile ? 18 : 26))}px`;

    // sections
    const sections: SectionL[] = Array.from(content.querySelectorAll<HTMLElement>('[data-section]'))
      .filter((s) => s.dataset.section !== 'Header')
      .map((s) => ({
        name: s.dataset.section ?? '',
        top: offsetWithin(s, content).y,
        hl: s.querySelector<HTMLElement>('[data-hl]'),
      }));

    // tiles + slots (stage coordinates, transforms ignored)
    const tiles: TileL[] = [];
    const slotBoxes = tileEls.current.map((t) => (t.slot ? offsetWithin(t.slot, stage) : { x: 0, y: 0, w: 1, h: 1 }));

    // pieces: blown outward, then flown home to their listings
    const r = rng(2026);
    const all = Array.from(content.querySelectorAll<HTMLElement>('[data-piece]'));
    const pieces: PieceL[] = [];
    TILES.forEach((tile, ti) => {
      const mine = all.filter((el) => (el.dataset.tile as TileId) === tile.id);
      const sizes = mine.map((el) => ({ w: el.offsetWidth, h: el.offsetHeight }));
      const box = slotBoxes[ti];
      const cycle = tile.fit === 'cycle';
      // cycling TVs show each piece on its own, as big as the screen allows
      const fit = cycle
        ? {
            scale: 1,
            shown: sizes.length,
            more: null,
            centers: sizes.map(() => ({ x: box.x + box.w / 2, y: box.y + box.h / 2 })),
          }
        : flowFit(sizes, box, {
            gap: mobile ? 3 : 5,
            maxScale: 1,
            readable: mobile ? 0.55 : 0.68,
            align: 'center',
            moreW: mobile ? 26 : 34,
          });
      const fitOne = (z: { w: number; h: number }) =>
        Math.min(tile.id === 'main' ? 1.3 : 1.1, box.w / z.w, box.h / z.h);
      const els = tileEls.current[ti] as TileEls;
      const cardEls = els.cards ? (Array.from(els.cards.children) as HTMLElement[]) : [];
      if (els.more) {
        const hidden = sizes.length - fit.shown;
        els.more.textContent = hidden > 0 ? `+${hidden}` : '';
        if (fit.more) {
          els.more.style.left = `${(fit.more.x - box.x).toFixed(1)}px`;
          els.more.style.top = `${(fit.more.y - box.y).toFixed(1)}px`;
        }
      }
      let last = 0;
      mine.forEach((el, j) => {
        const o = offsetWithin(el, content);
        const wx = -Wp / 2 + o.x + o.w / 2;
        const wy = PT + o.y + o.h / 2;
        const s = { x: Vw / 2 + fitCs * wx, y: fitTy + fitCs * wy };
        let dx = s.x - burstC.x;
        let dy = s.y - burstC.y;
        const len = Math.hypot(dx, dy) || 1;
        dx /= len;
        dy /= len;
        const mag = (mobile ? 55 : 100) + r() * (mobile ? 70 : 150);
        const side = (r() - 0.5) * (mobile ? 40 : 80);
        const a = {
          x: clamp(s.x + dx * mag - dy * side, 36, Vw - 36),
          y: clamp(s.y + dy * mag + dx * side, hdr + 30, Vh - 30),
        };
        const p0 = P.fly0 + ti * P.flyStagger + j * P.flyInner;
        const p1 = p0 + P.flyDur;
        last = Math.max(last, p1);
        const ph = r() * Math.PI * 2;
        const a2 = { x: a.x + dx * 14, y: a.y + dy * 14 - 10 + Math.sin(p0 * 90 + ph) * 3 };
        const hide = j >= fit.shown;
        const t = fit.centers[j];
        // arc home along a sideways bow, lifted a little
        const mx = (a2.x + t.x) / 2;
        const my = (a2.y + t.y) / 2;
        let nx = -(t.y - a2.y);
        let ny = t.x - a2.x;
        const nl = Math.hypot(nx, ny) || 1;
        nx /= nl;
        ny /= nl;
        const off = (r() - 0.5) * (mobile ? 140 : 260);
        const spinPick = r();
        pieces.push({
          el,
          y: o.y,
          h: o.h,
          s,
          d: { x: dx, y: dy },
          a,
          a2,
          rA: (r() - 0.5) * 70,
          sA: 1.1 + r() * 0.3,
          c: { x: mx + nx * off, y: my + ny * off - (mobile ? 50 : 100) },
          t,
          // on card TVs the pieces sink into the screen as they arrive
          ts: cycle ? fitOne(sizes[j]) * 0.8 : hide ? fit.scale * 0.35 : fit.scale,
          spin: spinPick < 0.3 ? -360 : spinPick < 0.6 ? 360 : 0,
          ph,
          p0,
          p1,
          hide,
          ti,
          j,
          landed: el.dataset.landed === 'true',
          o: -1,
          moved: true,
        });
      });
      tiles.push({
        els,
        p0: P.tiles0 + ti * P.tileStagger,
        on: last || P.ready,
        isOn: els.bezel?.dataset.on === 'true',
        s: -1,
        cards: cardEls,
        cardO: cardEls.map(() => -1),
        cycle: cardEls.length > 1,
        n: cardEls.length,
        off: ti * 0.37,
        show: -1,
        vis: 1,
        noise: false,
      });
    });

    // landing spot: standing on top of the top-right TV
    const sets = tiles.filter((tl) => tl.els.bezel).map((tl) => offsetWithin(tl.els.bezel, stage));
    const topY = sets.length ? Math.min(...sets.map((b) => b.y)) : hdr + 120;
    const corner = sets.filter((b) => b.y <= topY + 2).sort((a, b) => b.x - a.x)[0] ?? { x: Vw - 200, y: topY, w: 160, h: 120 };
    const land = { x: corner.x + corner.w * 0.78, y: corner.y + 1 };
    const avLand = clamp((land.y - hdr - 8) / 150, 0.4, av);
    if (guideTitleRef.current) guideTitleRef.current.style.transformOrigin = '0 60%';

    // parchment shards (bounding boxes + local polygons so each stays small)
    const shards: ShardL[] = [];
    const shardEls = shardsRef.current ? (Array.from(shardsRef.current.children) as HTMLElement[]) : [];
    let k = 0;
    const sr = rng(99);
    for (let j = 0; j < SHARD_ROWS; j++) {
      for (let i = 0; i < SHARD_COLS; i++) {
        const el = shardEls[k++];
        if (!el) continue;
        const v = [shardVerts[j][i], shardVerts[j][i + 1], shardVerts[j + 1][i + 1], shardVerts[j + 1][i]].map((q) => ({
          x: q.x * Wp,
          y: q.y * Lmax,
        }));
        const minX = Math.min(...v.map((q) => q.x));
        const minY = Math.min(...v.map((q) => q.y));
        const maxX = Math.max(...v.map((q) => q.x));
        const maxY = Math.max(...v.map((q) => q.y));
        el.style.left = `${minX}px`;
        el.style.top = `${minY}px`;
        el.style.width = `${maxX - minX}px`;
        el.style.height = `${maxY - minY}px`;
        el.style.clipPath = `polygon(${v.map((q) => `${(q.x - minX).toFixed(1)}px ${(q.y - minY).toFixed(1)}px`).join(',')})`;
        el.style.backgroundSize = `100% 100%, ${Wp}px ${Lmax}px, ${Wp}px ${Lmax}px, 22px 22px, 22px 22px`;
        const bp = `${-minX}px ${-minY}px`;
        el.style.backgroundPosition = `0 0, ${bp}, ${bp}, ${bp}, ${bp}`;
        const cx = (minX + maxX) / 2;
        const cy = (minY + maxY) / 2;
        let dx = cx - Wp / 2;
        let dy = cy - Lmax / 2;
        const len = Math.hypot(dx, dy) || 1;
        const mag = (mobile ? 220 : 360) + sr() * 260;
        dx = (dx / len) * mag;
        dy = (dy / len) * mag;
        shards.push({ el, dx, dy, rot: (sr() - 0.5) * 220 });
      }
    }

    const parts: PartL[] = partsRef.current
      ? (Array.from(partsRef.current.children) as HTMLElement[]).map((el, i) => ({
          el,
          ang: particleSpecs[i].ang,
          dist: particleSpecs[i].dist * Math.min(Vw, Vh) * 0.6,
          rot: particleSpecs[i].rot,
          shown: false,
        }))
      : [];

    // comic stickers around the blast, kept on screen
    const stkS = mobile ? 0.62 : Vh < 820 ? 0.85 : 1;
    const stickers = STICKERS.map((s) => {
      const m = (s.size * stkS) / 2 + 10;
      return {
        x: clamp(burstC.x + s.x * Math.min(Vw, 1000), m, Vw - m),
        y: clamp(burstC.y + s.y * Math.min(Vh, 860), hdr + m, Vh - m),
      };
    });

    // scroll distance per unit of progress, and the run-out after the trigger
    const travel = Vh * (mobile ? 3.7 : 4.2);
    const pad = Math.round(Vh * 0.6);
    applyTrackHeight(Vh, travel, pad);
    const trackTop = track.getBoundingClientRect().top + window.scrollY;

    // reset per-piece caches so the next frame rewrites everything
    const S = st.current;
    S.burst = !S.burst;
    S.ready = !S.ready;
    S.decoO = -1;
    S.osd = '';
    S.vhs = '?';
    S.rays = !S.rays;
    S.ti = -1;

    lay.current = {
      ok: true,
      Vw,
      Vh,
      hdr,
      mobile,
      Wp,
      Lmax,
      trackTop,
      travel,
      pad,
      r0,
      r1,
      C0,
      C1,
      av,
      avLand,
      restY,
      followY,
      fitCs,
      fitTy,
      burstC,
      land,
      ringR: Math.hypot(Vw, Vh) * 0.62,
      raysS: Math.max(Vw, Vh) / 750, // the rays layer is drawn small and scaled up: it's a soft gradient
      stkS,
      stickers,
      sections,
      pieces,
      tiles,
      shards,
      parts,
      decos: Array.from(content.querySelectorAll<HTMLElement>('[data-deco]')),
    };
  };

  /** Where the scroll position puts us on the timeline (scroll-driven part only). */
  const rawProgress = () => {
    const W = lay.current;
    const S = st.current;
    if (!W.ok) return S.pBase;
    return clamp(S.pBase + (window.scrollY - W.trackTop) / W.travel, S.pBase, P.trig);
  };
  /** The furthest milestone reached: fully unrolled, then finished. */
  const pendingBase = () => {
    const S = st.current;
    return S.pMax >= 1 ? 1 : S.pMax >= P.u1 + 0.004 ? Math.max(S.pBase, P.u1) : S.pBase;
  };
  /** What to show: never earlier than a milestone already reached. */
  const readProgress = () => {
    const S = st.current;
    if (S.mode === 'done') return 1;
    if (S.mode === 'scene') return S.p;
    return Math.max(rawProgress(), pendingBase());
  };

  /**
   * One-way ratchet: drop everything before `pNew` from the track and scroll up by the
   * same amount, so nothing moves on screen but scrolling up can't replay it.
   */
  const lock = (pNew: number) => {
    const S = st.current;
    const W = lay.current;
    if (!W.ok || pNew <= S.pBase) return;
    const before = window.scrollY;
    const delta = trackH(S.pBase, W.Vh, W.travel, W.pad) - trackH(pNew, W.Vh, W.travel, W.pad);
    S.pBase = pNew;
    lockedBase = pNew;
    applyTrackHeight();
    scrollToInstant(Math.max(0, before - delta));
  };

  /* ----------------------------- rendering ----------------------------- */
  const render = (p: number, t: number) => {
    const W = lay.current;
    const S = st.current;
    if (!W.ok) return;
    const world = worldRef.current!;

    // --- paper length, roll, cord
    const L = W.Lmax * range(p, P.u0, P.u1);
    const frac = W.Lmax > 0 ? L / W.Lmax : 0;
    const r = Math.sqrt(W.r1 * W.r1 + (W.r0 * W.r0 - W.r1 * W.r1) * (1 - frac));
    const rollCy = PT + L + r - 4;
    const knotY = rollCy + r - 2;
    let C = lerp(W.C0, W.C1, easeOutCubic(range(p, P.tug0, P.tug1)));
    const bs = range(p, P.bounce0, P.bounce1);
    if (bs > 0 && bs < 1) C += (W.mobile ? 12 : 18) * Math.exp(-4 * bs) * Math.sin(bs * Math.PI * 3);

    // --- camera: follow the roll down, then pull back to show the whole sheet
    const tyFollow = Math.min(W.restY, W.followY - rollCy);
    const z = easeInOutCubic(range(p, P.z0, P.z1));
    const cs = lerp(1, W.fitCs, z);
    const ty = lerp(tyFollow, W.fitTy, z);
    const tx = W.Vw / 2;
    const th = S.th * (1 - z);
    world.style.transform = `translate3d(${tx.toFixed(2)}px,${ty.toFixed(2)}px,0) scale(${cs.toFixed(4)}) rotate(${th.toFixed(4)}rad)`;
    const toScreen = (x: number, y: number): Pt => ({
      x: tx + cs * (x * Math.cos(th) - y * Math.sin(th)),
      y: ty + cs * (x * Math.sin(th) + y * Math.cos(th)),
    });

    // --- the sliding window that reveals the sheet
    winRef.current!.style.transform = `translate3d(0,${(L - W.Lmax).toFixed(2)}px,0)`;
    innerRef.current!.style.transform = `translate3d(0,${(W.Lmax - L).toFixed(2)}px,0)`;

    const burst = p >= P.burst;
    const be = easeOutCubic(range(p, P.burst, P.burst + 0.05));
    const ov = burst ? 0 : range(p, P.shake0, P.burst); // signal overload
    const paused = p >= P.blast1 && p < P.play;
    const resumed = p >= P.play && p < P.play + 0.022;

    const curl = curlRef.current!;
    curl.style.transform = `translate3d(0,${(PT + L - 30).toFixed(2)}px,0)`;
    curl.style.opacity = burst ? '0' : String(clamp(L / 40));

    const roll = rollRef.current!;
    roll.style.transform = `translate3d(0,${(rollCy - W.r0 + 260 * be).toFixed(2)}px,0) scaleY(${(r / W.r0).toFixed(4)}) rotate(${(8 * be).toFixed(2)}deg)`;
    roll.style.opacity = String(1 - be);
    roll.style.backgroundPosition = `0 ${(L * 0.9).toFixed(1)}px, 0 0`;
    spiralRef.current?.setAttribute('transform', `rotate(${((L / ((W.r0 + W.r1) / 2)) * 57.3).toFixed(1)})`);

    const bowS = 1 - easeInCubic(range(p, 0.016, 0.052));
    const bow = bowRef.current!;
    bow.style.display = bowS <= 0.001 ? 'none' : '';
    bow.style.transform = `translate3d(0,${knotY.toFixed(2)}px,0) rotate(${(50 * (1 - bowS)).toFixed(1)}deg) scale(${bowS.toFixed(3)})`;

    const hanger = hangerRef.current!;
    hanger.style.transform = `translate3d(0,${(-170 * be).toFixed(1)}px,0) rotate(${(-9 * be).toFixed(2)}deg)`;
    hanger.style.opacity = String(1 - be);

    // --- blueprint glow builds before the blast
    const glow = clamp(range(p, P.z1 - 0.03, P.burst) * (0.78 + 0.22 * Math.sin(t * (20 + 30 * ov))));
    glowRef.current!.style.opacity = glow.toFixed(3);
    const halo = haloRef.current!;
    halo.style.opacity = burst ? '0' : (glow * (0.9 + 0.5 * ov)).toFixed(3);
    const sc = range(p, P.z1 - 0.01, P.burst - 0.004);
    const scan = scanRef.current!;
    scan.style.opacity = sc > 0 && sc < 1 ? '1' : '0';
    scan.style.transform = `translate3d(0,${(PT + W.Lmax * easeInOutCubic(sc)).toFixed(1)}px,0)`;

    // --- section reveal + on-screen display
    let cur = -1;
    for (let i = 0; i < W.sections.length; i++) {
      const s = W.sections[i];
      if (s.hl) s.hl.style.transform = `scaleX(${range(L, s.top + 6, s.top + 60).toFixed(3)})`;
      if (L > s.top + 24) cur = i;
    }
    let osd: string;
    if (p < P.u0) osd = 'STANDBY · PULL THE CORD';
    else if (p < P.u1)
      osd = cur < 0 ? 'UNROLLING…' : `UNROLLING ${W.sections[cur].name.toUpperCase()} · ${cur + 1}/${W.sections.length}`;
    else if (p < P.shake0) osd = 'FULL RÉSUMÉ ON SCREEN';
    else if (p < P.burst) osd = 'WARNING · SIGNAL OVERLOAD';
    else if (p < P.blast1) osd = 'SIGNAL LOST';
    else if (p < P.ready) osd = 'REBUILDING AS A WEBSITE…';
    else osd = 'CH 680 · READY';
    if (osd !== S.osd && osdRef.current) {
      osdRef.current.textContent = osd;
      S.osd = osd;
    }
    const alert = p >= P.shake0 && p < P.blast1;
    if (alert !== S.alert && osdTopRef.current) {
      osdTopRef.current.dataset.alert = alert ? 'true' : 'false';
      S.alert = alert;
    }

    // --- VHS pause on the debris
    const vhs = paused ? '❚❚ PAUSE' : resumed ? '▶ PLAY' : '';
    if (vhs !== S.vhs) {
      const v = vhsRef.current!;
      v.textContent = vhs;
      v.style.display = vhs ? 'block' : 'none';
      if (osdTopRef.current) osdTopRef.current.style.visibility = vhs ? 'hidden' : 'visible';
      vhsBandRef.current!.style.display = paused ? 'block' : 'none';
      S.vhs = vhs;
    }
    if (paused) {
      const bandH = W.Vh * 0.12;
      const y = ((t * 0.55) % 1) * (W.Vh + bandH) - bandH;
      vhsBandRef.current!.style.transform = `translate3d(0,${y.toFixed(1)}px,0)`;
    }

    // --- camera shake: rattle while overloading, a big kick at the blast, VHS jitter, the title slam
    let sx = 0;
    let sy = 0;
    if (ov > 0) {
      const a = 7 * ov * ov;
      sx += Math.sin(t * 61) * a;
      sy += Math.cos(t * 53) * a * 0.7;
    }
    if (burst && p < P.blast1) {
      const k = range(p, P.burst, P.blast1);
      const a = (W.mobile ? 14 : 24) * (1 - k) * (1 - k);
      sx += Math.sin(t * 73) * a;
      sy += Math.cos(t * 59) * a * 0.8;
    }
    if (paused) {
      if (t > S.jitT) {
        S.jitY = Math.random() < 0.45 ? 0 : (Math.random() - 0.5) * 7;
        S.jitT = t + 0.05 + Math.random() * 0.12;
      }
      sy += S.jitY;
    }
    const tk = range(p, lerp(P.title0, P.title1, 0.6), P.title1 + 0.008);
    if (tk > 0 && tk < 1) sy += Math.sin(tk * Math.PI * 5) * (W.mobile ? 6 : 10) * (1 - tk);
    const shaking = sx !== 0 || sy !== 0;
    if (shaking || S.shk) {
      shakerRef.current!.style.transform = shaking ? `translate3d(${sx.toFixed(2)}px,${sy.toFixed(2)}px,0)` : '';
      S.shk = shaking;
    }

    // --- glitch bars tear across the picture as the signal overloads
    const gl = ov > 0.12 || (burst && p < P.burst + 0.004);
    if ((gl || S.glitch) && glitchRef.current) {
      const bars = glitchRef.current.children as HTMLCollectionOf<HTMLElement>;
      const amt = Math.max(ov, 0.5);
      for (let i = 0; i < bars.length; i++) {
        const bar = bars[i];
        if (!gl || Math.random() > 0.15 + 0.7 * amt) {
          bar.style.opacity = '0';
          continue;
        }
        const h = 2 + Math.random() * Math.random() * 38 * amt;
        bar.style.transform = `translate3d(${((Math.random() - 0.5) * 60 * amt).toFixed(1)}px,${(Math.random() * W.Vh).toFixed(1)}px,0) scaleY(${h.toFixed(1)})`;
        bar.style.background = GLITCH[(Math.random() * GLITCH.length) | 0];
        bar.style.opacity = (0.3 + Math.random() * 0.55).toFixed(2);
      }
      S.glitch = gl;
    }

    // --- the blast
    if (burst !== S.burst) {
      S.burst = burst;
      winRef.current!.style.overflow = burst ? 'visible' : 'hidden';
      paperBgRef.current!.style.visibility = burst ? 'hidden' : 'visible';
      shardsRef.current!.style.visibility = burst ? 'visible' : 'hidden';
    }
    const decoO = 1 - range(p, P.burst, P.burst + 0.018);
    if (Math.abs(decoO - S.decoO) > 0.005) {
      for (const d of W.decos) d.style.opacity = decoO.toFixed(3);
      S.decoO = decoO;
    }

    if (burst) {
      const se = easeOutCubic(range(p, P.burst, P.burst + 0.075));
      const sf = 1 - range(p, P.burst + 0.03, P.burst + 0.075);
      for (const sh of W.shards) {
        sh.el.style.transform = `translate3d(${(sh.dx * se).toFixed(1)}px,${(sh.dy * se + 260 * se * se).toFixed(1)}px,0) rotate(${(sh.rot * se).toFixed(1)}deg) scale(${(1 - 0.35 * se).toFixed(3)})`;
        sh.el.style.opacity = sf.toFixed(3);
      }
    }

    // --- card TVs: tune in once their pieces land, then flick between programmes
    const CYCLE = 3.4;
    if (p >= P.ready && !S.readyT) S.readyT = t;
    for (const tl of W.tiles) {
      if (!tl.n) continue;
      const live = p >= tl.on;
      let show = 0;
      let vis = 1;
      if (tl.cycle && p >= P.ready) {
        const c = (t - S.readyT) / CYCLE + 1 - tl.off / CYCLE;
        show = Math.floor(c) % tl.n;
        const u = c - Math.floor(c);
        vis = Math.min(1, u / 0.05, (1 - u) / 0.05);
      }
      tl.vis = vis;
      for (let i = 0; i < tl.n; i++) {
        const o = live && i === show ? vis : 0;
        if (Math.abs(o - tl.cardO[i]) > 0.001) {
          tl.cards[i].style.opacity = o.toFixed(3);
          tl.cardO[i] = o;
        }
      }
      if (show !== tl.show) {
        tl.show = show;
        if (tl.els.count && tl.cycle) tl.els.count.textContent = `${show + 1}/${tl.n}`;
      }
      if (tl.els.count && tl.cycle) tl.els.count.style.opacity = live ? '1' : '0';
      // a flick of static as the set tunes in, and between programmes
      const flick = bump(p, tl.on - 0.002, tl.on + 0.001, tl.on + 0.009);
      const nz = Math.max(flick, 1 - vis);
      const noise = nz > 0.001;
      if (noise !== tl.noise && tl.els.noise) {
        tl.els.noise.style.display = noise ? 'block' : 'none';
        tl.noise = noise;
      }
      if (noise && tl.els.noise) tl.els.noise.style.opacity = (0.95 * nz).toFixed(3);
    }

    // --- résumé pieces: ink in while unrolling, rattle, blow apart, then fly to their channels
    const fcs = W.fitCs;
    const blastE = easeOutCubic(range(p, P.burst, P.blast1));
    for (const pc of W.pieces) {
      if (!burst) {
        const o = 0.16 + 0.84 * range(L, pc.y + pc.h * 0.4, pc.y + pc.h * 0.4 + 70);
        if (Math.abs(o - pc.o) > 0.01) {
          pc.el.style.opacity = o.toFixed(3);
          pc.o = o;
        }
        if (ov > 0.02) {
          const j = ov * ov;
          pc.el.style.transform = `translate3d(${(Math.sin(t * 47 + pc.ph) * 2.6 * j).toFixed(2)}px,${(Math.cos(t * 41 + pc.ph * 1.7) * 1.8 * j).toFixed(2)}px,0) rotate(${(Math.sin(t * 33 + pc.ph) * 2.4 * j).toFixed(2)}deg)`;
          pc.moved = true;
        } else if (pc.moved) {
          pc.el.style.transform = '';
          pc.moved = false;
        }
        if (pc.landed) {
          pc.el.dataset.landed = 'false';
          pc.landed = false;
        }
        continue;
      }
      const k = range(p, pc.p0, pc.p1);
      const tv = W.tiles[pc.ti];
      let o = 1;
      if (pc.hide) o = 1 - range(k, 0.6, 1);
      else if (tv.n) o = 1 - range(k, 0.5, 1);
      if (o !== pc.o) {
        pc.el.style.opacity = o.toFixed(3);
        pc.o = o;
      }
      let pos: Pt;
      let s: number;
      let rot: number;
      if (k <= 0) {
        // thrown out by the blast, then drifting while it waits its turn
        const dr = range(p, P.blast1, pc.p0);
        const bob = Math.sin(p * 90 + pc.ph) * 3 * Math.min(1, dr * 4);
        pos = {
          x: lerp(pc.s.x, pc.a.x, blastE) + pc.d.x * 14 * dr,
          y: lerp(pc.s.y, pc.a.y, blastE) + pc.d.y * 14 * dr - 10 * dr + bob,
        };
        s = fcs * lerp(1, pc.sA, blastE);
        rot = pc.rA * blastE * (1 + 0.15 * dr);
      } else {
        const e = easeInOutCubic(k);
        pos = quad(pc.a2, pc.c, pc.t, e);
        s = lerp(fcs * pc.sA, pc.ts, e) * (1 + 0.2 * Math.sin(Math.PI * e));
        rot = lerp(pc.rA * 1.15, pc.spin, e);
        if (k >= 1) s = pc.ts * (1 + 0.16 * Math.sin(Math.PI * range(p, pc.p1, pc.p1 + 0.01)));
      }
      pc.el.style.transform = `translate3d(${((pos.x - pc.s.x) / fcs).toFixed(2)}px,${((pos.y - pc.s.y) / fcs).toFixed(2)}px,0) rotate(${rot.toFixed(2)}deg) scale(${(s / fcs).toFixed(4)})`;
      pc.moved = true;
      const landed = k >= 1;
      if (landed !== pc.landed) {
        pc.el.dataset.landed = landed ? 'true' : 'false';
        pc.landed = landed;
      }
    }

    // --- channel tiles power on
    for (const tl of W.tiles) {
      const s = range(p, tl.p0, tl.p0 + 0.035);
      if (Math.abs(s - tl.s) > 0.0005) {
        tl.els.bezel.style.opacity = s > 0 ? String(Math.min(1, s * 2.5)) : '0';
        // each set powers on like a CRT
        tl.els.screen.style.transform = s >= 1 ? '' : `scaleY(${lerp(0.02, 1, easeOutCubic(s)).toFixed(4)})`;
        tl.els.flash.style.opacity = s > 0 ? (1 - s).toFixed(3) : '0';
        tl.s = s;
      }
      const on = p >= tl.on;
      if (on !== tl.isOn) {
        tl.els.bezel.dataset.on = on ? 'true' : 'false';
        if (tl.els.more) tl.els.more.style.opacity = on ? '1' : '0';
        tl.isOn = on;
      }
    }

    // --- "Now on MM-TV" slams down onto the screen
    const ti = range(p, P.title0, P.title1);
    if (Math.abs(ti - S.ti) > 0.0005) {
      const gt = guideTitleRef.current!;
      const sl = range(ti, 0, 0.6);
      const ts = ti < 0.6 ? lerp(1.9, 1, easeInCubic(sl)) : 1 - 0.05 * Math.sin(Math.PI * range(ti, 0.6, 1));
      gt.style.opacity = Math.min(1, ti * 4).toFixed(3);
      gt.style.transform = ti >= 1 ? '' : `rotate(${lerp(-6, 0, easeOutCubic(sl)).toFixed(2)}deg) scale(${ts.toFixed(4)})`;
      S.ti = ti;
    }
    const ready = p >= P.ready;
    if (ready !== S.ready) {
      S.ready = ready;
      const g = guideRef.current!;
      g.style.pointerEvents = ready ? 'auto' : 'none';
      (g as HTMLElement & { inert: boolean }).inert = !ready;
    }

    // --- headline + skip (the status line bows out once the guide is up)
    if (osdTopRef.current) osdTopRef.current.style.opacity = (1 - range(p, P.title0, P.ready)).toFixed(3);
    const hd = range(p, 0, 0.035);
    headlineRef.current!.style.opacity = (1 - hd).toFixed(3);
    headlineRef.current!.style.transform = `translate3d(-50%,${(40 * hd).toFixed(1)}px,0)`;
    headlineRef.current!.style.visibility = hd >= 1 ? 'hidden' : 'visible';
    skipRef.current!.style.opacity = (1 - range(p, P.title0, P.ready)).toFixed(3);
    skipRef.current!.style.visibility = p >= P.ready ? 'hidden' : 'visible';

    // --- pixels and bits
    const pe = range(p, P.burst, P.burst + 0.11);
    const showParts = pe > 0 && pe < 1;
    for (const pt of W.parts) {
      if (showParts !== pt.shown) {
        pt.el.style.display = showParts ? 'block' : 'none';
        pt.shown = showParts;
      }
      if (!showParts) continue;
      const d = pt.dist * easeOutCubic(pe);
      const x = W.burstC.x + Math.cos(pt.ang) * d;
      const y = W.burstC.y + Math.sin(pt.ang) * d + 320 * pe * pe;
      pt.el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) translate(-50%,-50%) rotate(${(pt.rot * pe).toFixed(1)}deg)`;
      pt.el.style.opacity = (1 - pe * pe).toFixed(3);
    }

    // --- shockwave rings
    if (ringsRef.current) {
      const rings = ringsRef.current.children;
      for (let i = 0; i < rings.length; i++) {
        const c = rings[i] as SVGCircleElement;
        const a = P.burst + i * 0.0035;
        const k = range(p, a, a + 0.024 + i * 0.004);
        if (k <= 0 || k >= 1) {
          if (c.style.opacity !== '0') c.style.opacity = '0';
          continue;
        }
        const e = easeOutCubic(k);
        c.setAttribute('cx', W.burstC.x.toFixed(1));
        c.setAttribute('cy', W.burstC.y.toFixed(1));
        c.setAttribute('r', (W.ringR * (0.05 + 0.95 * e) * (1 - i * 0.12)).toFixed(1));
        c.setAttribute('stroke-width', ((1 - e) * (W.mobile ? 16 : 28) * (1 - i * 0.22) + 1.5).toFixed(1));
        c.style.opacity = (1 - k * k).toFixed(3);
      }
    }

    // --- light rays behind the blast
    const rk = range(p, P.burst - 0.002, P.play + 0.02);
    const raysOn = rk > 0 && rk < 1;
    const rays = raysRef.current!;
    if (raysOn !== S.rays) {
      rays.style.visibility = raysOn ? 'visible' : 'hidden';
      S.rays = raysOn;
    }
    if (raysOn) {
      const grow = easeOutCubic(range(p, P.burst - 0.002, P.blast1));
      const o = Math.min(1, rk * 14) * (1 - range(p, P.play, P.play + 0.02));
      rays.style.opacity = (0.95 * o).toFixed(3);
      rays.style.transform = `translate3d(${W.burstC.x.toFixed(1)}px,${W.burstC.y.toFixed(1)}px,0) rotate(${(70 * rk).toFixed(2)}deg) scale(${((0.2 + 1.15 * grow) * W.raysS).toFixed(3)})`;
    }

    // --- comic stickers pop one after another
    if (stickersRef.current) {
      const els = stickersRef.current.children as HTMLCollectionOf<HTMLElement>;
      for (let i = 0; i < els.length; i++) {
        const sk = STICKERS[i];
        const el = els[i];
        const k = range(p, P.burst + sk.at, P.burst + sk.at + 0.032);
        if (k <= 0 || k >= 1) {
          if (el.style.opacity !== '0') el.style.opacity = '0';
          continue;
        }
        const s = easeOutBack(range(k, 0, 0.22)) * (1 + 0.15 * range(k, 0.7, 1)) * W.stkS;
        const at = W.stickers[i];
        el.style.opacity = (1 - range(k, 0.7, 1)).toFixed(3);
        el.style.transform = `translate3d(${at.x.toFixed(1)}px,${at.y.toFixed(1)}px,0) translate(-50%,-50%) rotate(${sk.rot}deg) scale(${s.toFixed(3)})`;
      }
    }

    // --- POW, flash, static
    const pw = range(p, P.burst - 0.003, P.burst + 0.07);
    const pow = powRef.current!;
    if (pw <= 0 || pw >= 1) pow.style.opacity = '0';
    else {
      pow.style.opacity = (1 - range(pw, 0.62, 1)).toFixed(3);
      const ps = easeOutBack(range(pw, 0, 0.22)) * (1 + 0.2 * range(pw, 0.62, 1)) * (W.mobile ? 0.72 : 1);
      pow.style.transform = `translate3d(${W.burstC.x}px,${W.burstC.y}px,0) translate(-50%,-50%) rotate(-9deg) scale(${ps.toFixed(3)})`;
    }
    flashRef.current!.style.opacity = (0.92 * bump(p, P.burst - 0.006, P.burst, P.burst + 0.012)).toFixed(3);
    const staticOn = (p > P.burst - 0.004 && p < P.burst + 0.006) || (p >= P.play && p < P.play + 0.0035);
    staticRef.current!.style.display = staticOn ? 'block' : 'none';

    // --- cord + avatar
    const api = avatarApi.current;
    const avEl = avatarRef.current!;
    const knot = toScreen(0, knotY);
    const alpha = th + S.phi;
    const down = { x: -Math.sin(alpha), y: Math.cos(alpha) };
    const speed = Math.abs(S.vel);
    const blink = t % 3.7 < 0.12;
    if (!burst) {
      const Cs = C * cs;
      const hands = { x: knot.x + down.x * Cs, y: knot.y + down.y * Cs };
      const bend = clamp(-S.phiV * 9, -16, 16) * cs;
      const mid = { x: (knot.x + hands.x) / 2 + down.y * bend, y: (knot.y + hands.y) / 2 - down.x * bend };
      const d = `M${knot.x.toFixed(1)} ${knot.y.toFixed(1)} Q${mid.x.toFixed(1)} ${mid.y.toFixed(1)} ${hands.x.toFixed(1)} ${hands.y.toFixed(1)}`;
      cordOutRef.current!.setAttribute('d', d);
      cordRef.current!.setAttribute('d', d);
      cordOutRef.current!.style.strokeWidth = String(10 * cs);
      cordRef.current!.style.strokeWidth = String(6 * cs);
      knotRef.current!.setAttribute('cx', knot.x.toFixed(1));
      knotRef.current!.setAttribute('cy', knot.y.toFixed(1));
      knotRef.current!.setAttribute('r', String(6 * cs));
      cordOutRef.current!.parentElement!.style.opacity = '1';

      const avS = W.av * cs;
      const neck = { x: hands.x - down.x * HANDS_Y * avS, y: hands.y - down.y * HANDS_Y * avS };
      avEl.style.transform = `translate3d(${neck.x.toFixed(1)}px,${neck.y.toFixed(1)}px,0) rotate(${alpha.toFixed(4)}rad) scale(${avS.toFixed(4)})`;
      const amp = 5 + Math.min(26, speed * 0.014) + 18 * ov;
      const face: Face = (p > P.tug0 && p < P.tug1 + 0.01) || speed > 650 || ov > 0.2 ? 'wow' : blink ? 'blink' : 'smile';
      const lp = S.legPhase + (ov > 0 ? t * 14 : 0);
      api?.set({ pose: 0, legL: amp * Math.sin(lp), legR: amp * Math.sin(lp + 2.3), wave: 0, face });
    } else {
      cordOutRef.current!.parentElement!.style.opacity = '0';
      // where he was hanging when the sheet blew
      const knotFit = { x: W.Vw / 2, y: W.fitTy + W.fitCs * (PT + W.Lmax + W.r1 * 2 - 6) };
      const hangDown = { x: -Math.sin(S.phi), y: Math.cos(S.phi) };
      const avFit = W.av * W.fitCs;
      const hands0 = { x: knotFit.x + hangDown.x * W.C1 * W.fitCs, y: knotFit.y + hangDown.y * W.C1 * W.fitCs };
      const neck0 = { x: hands0.x - hangDown.x * HANDS_Y * avFit, y: hands0.y - hangDown.y * HANDS_Y * avFit };
      const sq = range(p, P.avEnd, P.land);
      const sy2 = 1 - 0.2 * Math.sin(Math.PI * sq);
      const sx2 = 1 + 0.14 * Math.sin(Math.PI * sq);
      const neck1 = { x: W.land.x, y: W.land.y - FEET_Y * W.avLand * sy2 };
      // blown up and over, upside down, frozen there during the pause
      const apex = {
        x: lerp(neck0.x, W.land.x, 0.55),
        y: Math.max(W.hdr + (W.mobile ? 70 : 100), neck0.y - (W.mobile ? 200 : 300)),
      };
      const big = avFit * 1.3;
      let pos: Pt;
      let rot: number;
      let scl: number;
      let pose: number;
      let flail: number;
      if (p < P.blast1) {
        const a = easeOutCubic(range(p, P.burst, P.blast1));
        pos = quad(neck0, { x: neck0.x, y: apex.y }, apex, a);
        rot = lerp(S.phi, Math.PI * 0.92, a);
        scl = lerp(avFit, big, a);
        pose = range(a, 0, 0.5);
        flail = 1;
      } else if (p < P.play) {
        const k = range(p, P.blast1, P.play);
        pos = { x: apex.x, y: apex.y - 6 * k };
        rot = Math.PI * (0.92 + 0.08 * k);
        scl = big;
        pose = 1;
        flail = 1;
      } else {
        const e = easeInOutCubic(range(p, P.play, P.avEnd));
        const ctrl = {
          x: lerp(apex.x, neck1.x, 0.6),
          y: Math.max(W.hdr - 40, Math.min(apex.y - 6, neck1.y) - (W.mobile ? 110 : 170)),
        };
        pos = quad({ x: apex.x, y: apex.y - 6 }, ctrl, neck1, e);
        rot = lerp(Math.PI, Math.PI * 4, e);
        scl = lerp(big, W.avLand, e);
        pose = e < 0.82 ? 1 : 1 + range(e, 0.82, 1);
        flail = 1 - range(e, 0.7, 0.9);
      }
      avEl.style.transform = `translate3d(${pos.x.toFixed(1)}px,${pos.y.toFixed(1)}px,0) rotate(${rot.toFixed(4)}rad) scale(${(scl * sx2).toFixed(4)},${(scl * sy2).toFixed(4)})`;
      const landed = p >= P.land;
      const face: Face = landed ? (blink ? 'blink' : 'grin') : 'wow';
      api?.set({
        pose,
        legL: 22 * flail * Math.sin(p * 700),
        legR: 22 * flail * Math.sin(p * 700 + 2.1),
        wave: landed ? 26 * Math.sin(t * 7) : 0,
        face,
      });
    }
  };

  /* ------------------------------ lifecycle ------------------------------ */
  useLayoutEffect(() => {
    layout();
    const S = st.current;
    S.p = readProgress();
    S.pPrev = S.p;
    render(S.p, performance.now() / 1000);
    stageRef.current?.style.setProperty('visibility', 'visible');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const S = st.current;
    const root = document.documentElement;
    let raf = 0;
    let running = false;
    let last = performance.now();
    let releaseT = 0;

    /* -- holding the page still while the scene plays -- */
    let held = false;
    const prevent = (e: Event) => {
      if (e.cancelable) e.preventDefault();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') finish(true);
    };
    const hold = (on: boolean) => {
      if (on === held) return;
      held = on;
      root.classList.toggle('rz-hold', on);
      if (on) {
        window.addEventListener('wheel', prevent, { passive: false });
        window.addEventListener('touchmove', prevent, { passive: false });
        window.addEventListener('keydown', onKey);
      } else {
        window.removeEventListener('wheel', prevent);
        window.removeEventListener('touchmove', prevent);
        window.removeEventListener('keydown', onKey);
      }
    };

    const startScene = () => {
      const W = lay.current;
      S.mode = 'scene';
      S.scene = buildScene(Math.min(S.p, P.trig));
      S.t0 = performance.now() / 1000;
      // the scrolled part is over: collapse the track to one screen and pin it
      S.pBase = P.trig;
      S.pMax = Math.max(S.pMax, P.trig);
      lockedBase = P.trig;
      applyTrackHeight();
      hold(true);
      scrollToInstant(W.trackTop);
      if (!running) start();
    };

    /** End the intro on the channel guide. `now` releases the page immediately. */
    const finish = (now: boolean) => {
      window.clearTimeout(releaseT);
      if (S.mode !== 'done') {
        const was = S.mode;
        S.mode = 'done';
        S.pMax = 1;
        if (was === 'scene') {
          S.pBase = 1;
          lockedBase = 1;
          applyTrackHeight();
        } else lock(1);
        S.p = 1;
        S.pPrev = 1;
        if (!running) render(1, performance.now() / 1000);
      }
      if (now) hold(false);
      else releaseT = window.setTimeout(() => hold(false), 350);
    };

    /** Reaching the end of the unroll starts the scene; jumping far past it skips the show. */
    const checkTrigger = () => {
      const W = lay.current;
      if (S.mode !== 'scroll' || !W.ok) return;
      const u = S.pBase + (window.scrollY - W.trackTop) / W.travel;
      if (u < P.trig) return;
      if ((u - P.trig) * W.travel <= W.pad + W.Vh * 0.3) startScene();
      else {
        S.mode = 'done';
        S.pMax = 1;
      }
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
      last = now;
      const t = now / 1000;
      const W = lay.current;
      let v = 0;
      if (S.mode === 'scroll') checkTrigger();
      if (S.mode === 'scene' && S.scene) {
        const tc = t - S.t0;
        S.p = sceneAt(S.scene, tc);
        S.pPrev = S.p;
        S.snap = false;
        if (tc >= S.scene.dur) finish(false);
      } else {
        const target = readProgress();
        if (S.snap) {
          S.p = target;
          S.pPrev = target;
          S.snap = false;
        } else S.p += (target - S.p) * (1 - Math.exp(-dt * 7.5));
        if (Math.abs(target - S.p) < 0.00002) S.p = target;
        // velocity of the smoothed progress, in px/s
        v = ((S.p - S.pPrev) / dt) * (W.travel || 1);
        S.pPrev = S.p;
      }
      S.vel += (v - S.vel) * (1 - Math.exp(-dt * 12));
      const acc = (S.vel - S.velPrev) / dt;
      S.velPrev = S.vel;

      // the whole sheet sways a touch with scroll speed
      const thT = clamp(S.vel * 1.6e-5, -0.045, 0.045);
      S.thV += (-38 * (S.th - thT) - 7 * S.thV) * dt;
      S.th += S.thV * dt;
      // he swings on the cord: kicked by changes in speed, otherwise a lazy idle sway
      const idle = 0.055 * Math.sin(t * 2.2);
      S.phiV += (-20 * (S.phi - idle) - 2.2 * S.phiV - clamp(acc * 9e-4, -30, 30)) * dt;
      S.phi = clamp(S.phi + S.phiV * dt, -0.55, 0.55);
      const speed = Math.abs(S.vel);
      S.legPhase += dt * (speed > 120 ? 11 : 2.6);

      render(S.p, t);
      raf = requestAnimationFrame(frame);
    };

    function start() {
      if (running) return;
      running = true;
      // coming back into view: show the current state instead of fast-forwarding to it
      S.snap = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && !document.hidden) start();
        else stop();
      },
      { rootMargin: '100px 0px' },
    );
    if (trackRef.current) io.observe(trackRef.current);
    const onVis = () => {
      if (document.hidden) stop();
      else if (trackRef.current) {
        const r = trackRef.current.getBoundingClientRect();
        if (r.bottom > 0 && r.top < window.innerHeight) start();
      }
    };
    document.addEventListener('visibilitychange', onVis);

    // Remember the furthest point reached on every scroll. The track itself is only
    // shortened once scrolling pauses, so a momentum scroll is never cut short.
    let idle = 0;
    const commitLock = () => {
      if (S.mode === 'scene') return;
      const b = pendingBase();
      if (b > S.pBase) lock(b);
    };
    const onScroll = () => {
      const W = lay.current;
      if (S.mode === 'scene') {
        if (W.ok && Math.abs(window.scrollY - W.trackTop) > 1) scrollToInstant(W.trackTop);
        return;
      }
      if (S.mode === 'scroll') {
        const raw = rawProgress();
        if (raw > S.pMax) S.pMax = raw;
        checkTrigger();
      }
      window.clearTimeout(idle);
      idle = window.setTimeout(commitLock, 180);
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // any channel change (nav, Skip intro, a tile) ends the intro on the spot
    const onTune = () => finish(true);
    window.addEventListener('mm:tune', onTune);

    const relayout = () => {
      layout();
      if (S.mode === 'scene') {
        if (Math.abs(window.scrollY - lay.current.trackTop) > 1) scrollToInstant(lay.current.trackTop);
      } else S.snap = true;
      render(readProgress(), performance.now() / 1000);
    };
    let rt = 0;
    const ro = new ResizeObserver(() => {
      window.clearTimeout(rt);
      rt = window.setTimeout(relayout, 60);
    });
    if (stageRef.current) ro.observe(stageRef.current);
    if (contentRef.current) ro.observe(contentRef.current);
    document.fonts?.ready.then(relayout).catch(() => undefined);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      window.clearTimeout(rt);
      window.clearTimeout(releaseT);
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mm:tune', onTune);
      window.clearTimeout(idle);
      if (S.mode === 'scene') lockedBase = 1;
      hold(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const skip = () => tuneTo('top');

  return (
    <section
      ref={trackRef}
      id="intro"
      aria-labelledby="intro-title"
      className="rz-track relative bg-espresso"
      style={{ overflowAnchor: 'none' }}
    >
      <h2 id="intro-title" className="sr-only">
        Unrolling the story: an animated résumé that turns into this website
      </h2>
      <div ref={stageRef} className="rz-stage" style={{ visibility: 'hidden' }}>
        <div ref={shakerRef} className="rz-shaker">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="sunburst absolute left-1/2 top-[38%] -ml-[700px] -mt-[700px] h-[1400px] w-[1400px] rounded-full" />
            <div
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(ellipse at 50% 40%, rgba(28,18,16,0) 0%, rgba(28,18,16,.25) 30%, #1C1210 75%)',
              }}
            />
          </div>

          <div ref={guideRef} className="rz-guide" style={{ pointerEvents: 'none' }}>
            <ChannelGuide
              mode="animated"
              titleRef={guideTitleRef}
              onTile={(i, els) => {
                tileEls.current[i] = { ...tileEls.current[i], ...els };
              }}
            />
          </div>

          <div ref={headlineRef} className="rz-headline">
            <p className="m-0 font-screen text-[clamp(18px,2vw,24px)] tracking-[5px] text-tangerine">MM-TV PRESENTS</p>
            <p className="m-0 font-display text-[clamp(40px,min(7vw,10.5vh),100px)] leading-[0.95] text-newsprint text-extrude">
              Unrolling the story
            </p>
            <p className="m-0 mx-auto max-w-[34rem] text-[clamp(16px,1.6vw,19px)] leading-relaxed text-parchment">
              Every portfolio starts as a résumé. Scroll, and my weight will pull mine open.
            </p>
            <p className="m-0 flex items-center justify-center gap-2 font-screen text-[22px] tracking-[2px] text-marigold">
              <ChevronsDown className="h-5 w-5" aria-hidden="true" style={{ animation: 'float-y 1.2s ease-in-out infinite' }} />
              SCROLL TO PULL THE CORD
            </p>
          </div>

          <div ref={raysRef} className="rz-rays" aria-hidden="true" style={{ visibility: 'hidden' }} />

          {/* everything that hangs from the nail lives in "world" space */}
          <div ref={worldRef} className="rz-world" aria-hidden="true">
            <div ref={hangerRef} className="rz-hanger">
              <svg ref={hangerSvgRef} className="rz-hanger-svg" height={ROD_Y + 6} overflow="visible">
                <line ref={hangerLineL} x1="0" y1="0" x2="-200" y2={ROD_Y} stroke="#BFAE90" strokeWidth="2" />
                <line ref={hangerLineR} x1="0" y1="0" x2="200" y2={ROD_Y} stroke="#BFAE90" strokeWidth="2" />
                <circle cx="0" cy="0" r="5.5" fill="#F6B21B" stroke="#120B09" strokeWidth="2" />
              </svg>
              <div className="rz-rod">
                <span className="rz-finial rz-finial-l" />
                <span className="rz-finial rz-finial-r" />
              </div>
            </div>

            <div ref={haloRef} className="rz-halo" />
            <div ref={winRef} className="rz-window">
              <div ref={innerRef} className="rz-inner">
                <div ref={paperBgRef} className="rz-parchment rz-paper-bg" style={{ clipPath: deckle }}>
                  <div ref={glowRef} className="rz-glow" />
                </div>
                <div ref={shardsRef} className="rz-shards" style={{ visibility: 'hidden' }}>
                  {Array.from({ length: SHARD_COLS * SHARD_ROWS }, (_, i) => (
                    <div key={i} className="rz-parchment rz-shard" />
                  ))}
                </div>
                <div ref={contentRef} className="rz-paper-content">
                  <Resume />
                </div>
              </div>
            </div>

            <div ref={curlRef} className="rz-curl" />
            <div ref={scanRef} className="rz-scan" />

            <div ref={rollRef} className="rz-roll">
              <span className="rz-band" />
              <svg className="rz-cap" viewBox="-30 -30 60 60" preserveAspectRatio="none">
                <ellipse cx="0" cy="0" rx="29" ry="29" fill="#D9B98C" stroke="#7A5233" strokeWidth="2" />
                <g ref={spiralRef}>
                  <path
                    d="M0 0 m0 -3 a3 3 0 1 1 -3 3 a6 6 0 1 1 6 6 a10 10 0 1 1 -10 -10 a15 15 0 1 1 15 15 a20 20 0 1 1 -20 -20"
                    fill="none"
                    stroke="#8A5E3A"
                    strokeWidth="2.6"
                  />
                </g>
              </svg>
            </div>

            <div ref={bowRef} className="rz-bow">
              <svg viewBox="-60 -40 120 80" width="120" height="80" overflow="visible">
                <path d="M0 0 C -30 -34, -58 -8, -36 8 C -24 16, -10 8, 0 0Z" fill="#F6B21B" stroke="#B8721A" strokeWidth="3" />
                <path d="M0 0 C 30 -34, 58 -8, 36 8 C 24 16, 10 8, 0 0Z" fill="#F6B21B" stroke="#B8721A" strokeWidth="3" />
                <path d="M-2 2 C -14 18, -24 26, -34 40" fill="none" stroke="#F07F23" strokeWidth="6" strokeLinecap="round" />
                <path d="M2 2 C 10 16, 22 22, 30 36" fill="none" stroke="#F07F23" strokeWidth="6" strokeLinecap="round" />
                <circle r="6.5" fill="#F07F23" stroke="#B8721A" strokeWidth="2.5" />
              </svg>
            </div>
          </div>

          <svg className="rz-cordsvg" aria-hidden="true">
            <g>
              <path ref={cordOutRef} fill="none" stroke="#B8721A" strokeLinecap="round" />
              <path ref={cordRef} fill="none" stroke="#F6B21B" strokeLinecap="round" />
              <circle ref={knotRef} fill="#F07F23" stroke="#B8721A" strokeWidth="2" />
            </g>
          </svg>

          <svg ref={ringsRef} className="rz-rings" aria-hidden="true">
            {RINGS.map((c, i) => (
              <circle key={i} fill="none" stroke={c} style={{ opacity: 0 }} />
            ))}
          </svg>

          <div ref={avatarRef} className="rz-avatar" aria-hidden="true">
            <Avatar ref={avatarApi} idPrefix="intro" />
          </div>

          <div ref={partsRef} aria-hidden="true">
            {particleSpecs.map((s, i) =>
              s.glyph ? (
                <span key={i} className="rz-bit" style={{ fontSize: s.size, color: s.color, display: 'none' }}>
                  {s.glyph}
                </span>
              ) : (
                <span
                  key={i}
                  className="rz-pixel"
                  style={{ width: s.size, height: s.size, background: s.color, display: 'none' }}
                />
              ),
            )}
          </div>

          <div ref={stickersRef} aria-hidden="true">
            {STICKERS.map((s) => (
              <div key={s.text} className="rz-sticker" style={{ opacity: 0 }}>
                <Burst size={s.size} outer={s.outer} inner={s.inner} fontSize={Math.round(s.size * 0.21)}>
                  {s.text}
                </Burst>
              </div>
            ))}
          </div>

          <div ref={powRef} className="rz-pow" aria-hidden="true">
            <Burst size={200} outer="#E8432E" inner="#F6B21B" fontSize={40}>
              KA-
              <br />
              POW!
            </Burst>
          </div>
        </div>

        <div ref={glitchRef} className="rz-glitch" aria-hidden="true">
          {Array.from({ length: GLITCH_BARS }, (_, i) => (
            <span key={i} />
          ))}
        </div>
        <div ref={vhsBandRef} className="rz-vhs-band" aria-hidden="true">
          <div className="static-noise absolute inset-0" />
        </div>
        <div ref={staticRef} className="static-noise rz-static" aria-hidden="true" />
        <div ref={flashRef} className="rz-flash" aria-hidden="true" />

        <p ref={vhsRef} className="rz-vhs" aria-hidden="true" />
        <p ref={osdTopRef} className="rz-osd-top" aria-hidden="true">
          <span className="text-marigold" style={{ animation: 'blink 1.2s steps(1) infinite' }}>
            ▶
          </span>
          <span ref={osdRef}>STANDBY · PULL THE CORD</span>
        </p>
        <button ref={skipRef} type="button" onClick={skip} className="rz-skip chbtn">
          Skip intro
          <ChevronsDown className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}

/** Reduced-motion version: the finished channel guide, no scroll-driven animation. */
export function IntroStatic() {
  return (
    <section
      id="intro"
      aria-labelledby="intro-static-title"
      className="relative overflow-hidden bg-espresso px-4 pb-16 pt-[96px] sm:px-8"
    >
      <div
        aria-hidden="true"
        className="sunburst absolute left-1/2 top-1/2 -ml-[700px] -mt-[700px] h-[1400px] w-[1400px] rounded-full opacity-80"
      />
      <div className="relative">
        <h2 id="intro-static-title" className="sr-only">
          Channel guide
        </h2>
        <ChannelGuide mode="static" />
      </div>
    </section>
  );
}
