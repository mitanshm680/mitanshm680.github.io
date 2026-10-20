export interface Pt {
  x: number;
  y: number;
}

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** 0 → 1 as p moves from a to b. */
export const range = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
export const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeInCubic = (t: number) => t * t * t;
export const easeOutBack = (t: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};
/** Triangle bump: 0 at a, 1 at peak, 0 at b. */
export const bump = (p: number, a: number, peak: number, b: number) =>
  p <= a || p >= b ? 0 : p < peak ? (p - a) / (peak - a) : (b - p) / (b - peak);

export const quad = (a: Pt, c: Pt, b: Pt, t: number): Pt => {
  const u = 1 - t;
  return { x: u * u * a.x + 2 * u * t * c.x + t * t * b.x, y: u * u * a.y + 2 * u * t * c.y + t * t * b.y };
};

/** Small deterministic PRNG so every visit explodes the same way. */
export function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Offset of `el` inside a positioned ancestor, ignoring transforms. */
export function offsetWithin(el: HTMLElement, root: HTMLElement) {
  let x = 0;
  let y = 0;
  let n: HTMLElement | null = el;
  while (n && n !== root) {
    x += n.offsetLeft;
    y += n.offsetTop;
    n = n.offsetParent as HTMLElement | null;
  }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight };
}

/**
 * Lay n boxes into a rectangle as a uniform grid, choosing the column count
 * that lets everything render largest. Returns slot centers and one shared scale.
 */
export function fitGrid(
  sizes: { w: number; h: number }[],
  box: { x: number; y: number; w: number; h: number },
  gap = 6,
  maxScale = 1,
) {
  const n = sizes.length;
  let best = { cols: 1, rows: n, scale: 0 };
  for (let cols = 1; cols <= n; cols++) {
    const rows = Math.ceil(n / cols);
    const sw = (box.w - gap * (cols - 1)) / cols;
    const sh = (box.h - gap * (rows - 1)) / rows;
    let s = maxScale;
    for (const z of sizes) s = Math.min(s, sw / z.w, sh / z.h);
    if (s > best.scale) best = { cols, rows, scale: s };
  }
  const { cols, rows, scale } = best;
  const sw = (box.w - gap * (cols - 1)) / cols;
  // rows hug their content, and the whole block sits centred in the box
  const rowH = Math.max(...sizes.map((z) => z.h)) * scale;
  const blockH = rows * rowH + gap * (rows - 1);
  const top = box.y + Math.max(0, (box.h - blockH) / 2);
  return {
    scale,
    centers: sizes.map((_, i) => {
      const c = i % cols;
      const r = Math.floor(i / cols);
      const lastRowCount = r === rows - 1 ? n - cols * (rows - 1) : cols;
      const rowOffset = ((cols - lastRowCount) * (sw + gap)) / 2;
      return { x: box.x + rowOffset + c * (sw + gap) + sw / 2, y: top + r * (rowH + gap) + rowH / 2 };
    }),
  };
}

/**
 * Lay boxes out left to right like listings in a TV guide, wrapping onto new lines,
 * at one shared scale. Prefers showing everything; if that would make things smaller
 * than `readable`, it shows as many as fit at a readable size and reports where a
 * "+N more" marker goes (hidden items are sent to that spot).
 */
export function flowFit(
  sizes: { w: number; h: number }[],
  box: { x: number; y: number; w: number; h: number },
  opts: { gap?: number; maxScale?: number; readable?: number; align?: 'start' | 'center'; moreW?: number } = {},
) {
  const { gap = 6, maxScale = 1, readable = 0.7, align = 'start', moreW = 44 } = opts;
  const moreH = 16;
  const n = sizes.length;

  const flow = (s: number, count: number, reserve: number) => {
    const lines: { items: number[]; w: number; h: number }[] = [];
    let cur = { items: [] as number[], w: 0, h: 0 };
    for (let i = 0; i < count; i++) {
      const w = sizes[i].w * s;
      const h = sizes[i].h * s;
      const next = cur.items.length ? cur.w + gap + w : w;
      if (cur.items.length && next > box.w) {
        lines.push(cur);
        cur = { items: [], w: 0, h: 0 };
      }
      cur.w = cur.items.length ? cur.w + gap + w : w;
      cur.h = Math.max(cur.h, h);
      cur.items.push(i);
    }
    if (cur.items.length) lines.push(cur);
    const H = lines.reduce((a, l) => a + l.h, 0) + gap * Math.max(0, lines.length - 1);
    const last = lines[lines.length - 1];
    const wide = lines.every((l) => l.w <= box.w + 0.5);
    // the "+N" marker sits at the end of the last line, or on a line of its own
    const inline = !reserve || !last || last.w + gap + reserve <= box.w + 0.5;
    const ownLine = !!reserve && !inline;
    const total = ownLine ? H + gap + moreH : H;
    return { lines, H: total, ok: wide && total <= box.h + 0.5, ownLine };
  };
  /** Largest scale in [lo, maxScale] at which the first `count` items fit, or 0. */
  const best = (count: number, lo: number, reserve: number) => {
    if (!flow(lo, count, reserve).ok) return 0;
    let a = lo;
    let b = maxScale;
    if (flow(b, count, reserve).ok) return b;
    for (let k = 0; k < 18; k++) {
      const m = (a + b) / 2;
      if (flow(m, count, reserve).ok) a = m;
      else b = m;
    }
    return a;
  };

  let shown = n;
  let scale = n ? best(n, readable, 0) || best(n, readable * 0.82, 0) : 1;
  if (n && !scale) {
    shown = n - 1;
    while (shown > 1 && !best(shown, readable, moreW)) shown--;
    scale = best(shown, readable, moreW) || best(shown, 0.2, moreW) || readable;
  }

  const { lines, H, ownLine } = flow(scale, shown, shown < n ? moreW : 0);
  const centers: Pt[] = new Array(n);
  let y = box.y + Math.max(0, (box.h - H) / 2);
  let more = null as Pt | null;
  lines.forEach((l, li) => {
    let x = align === 'center' ? box.x + (box.w - l.w) / 2 : box.x;
    for (const i of l.items) {
      const w = sizes[i].w * scale;
      centers[i] = { x: x + w / 2, y: y + l.h / 2 };
      x += w + gap;
    }
    if (li === lines.length - 1 && shown < n && !ownLine) more = { x, y: y + l.h / 2 };
    y += l.h + gap;
  });
  if (shown < n && ownLine) more = { x: align === 'center' ? box.x + (box.w - moreW) / 2 : box.x, y: y + moreH / 2 };
  const sink: Pt = (more as Pt | null) ?? { x: box.x + box.w - moreW / 2, y: box.y + box.h / 2 };
  for (let i = shown; i < n; i++) centers[i] = { x: sink.x + moreW / 2, y: sink.y };
  return { scale, centers, shown, more };
}
