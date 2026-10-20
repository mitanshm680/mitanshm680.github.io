import type { Ref } from 'react';
import { useStation } from '../../lib/station';
import { TILES, type TileEls } from './tiles';

export function ChannelGuide({
  mode,
  onTile,
  titleRef,
  gridRef,
}: {
  mode: 'animated' | 'static';
  onTile?: (i: number, els: Partial<TileEls>) => void;
  titleRef?: Ref<HTMLDivElement>;
  gridRef?: Ref<HTMLUListElement>;
}) {
  const { tuneTo } = useStation();
  const animated = mode === 'animated';
  return (
    <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-4 md:gap-6">
      <div ref={titleRef} className="flex flex-col gap-1 pr-[84px] md:pr-[120px]">
        <p
          className="m-0 font-display text-[clamp(30px,4.6vw,56px)] leading-none text-marigold"
          style={{ textShadow: '3px 3px 0 #E8432E' }}
        >
          Now on <span className="whitespace-nowrap">MM-TV</span>
        </p>
        <p className="rz-guide-sub m-0 max-w-[40rem] text-[clamp(14px,1.5vw,18px)] leading-snug text-parchment">
          My résumé, rebuilt as a TV station. Pick a channel, or keep scrolling to watch in order.
        </p>
      </div>
      <ul
        ref={gridRef}
        aria-label="Channel guide"
        className="rz-grid m-0 grid list-none grid-cols-2 gap-3 p-0 md:grid-cols-4 md:gap-[18px]"
      >
        {TILES.map((t, i) => (
          <li
            key={t.id}
            className="rz-tile"
            data-on={animated ? 'false' : 'true'}
            ref={(el) => {
              if (el) onTile?.(i, { bezel: el });
            }}
          >
            <a
              href={`#${t.target}`}
              onClick={(e) => {
                e.preventDefault();
                tuneTo(t.target);
              }}
              className="block rounded-[14px] no-underline"
              aria-label={`${t.ch}, ${t.label}: ${t.summary}`}
            >
              <div
                className="rz-tile-screen"
                ref={(el) => {
                  if (el) onTile?.(i, { screen: el });
                }}
              >
                <div className="rz-tile-osd" aria-hidden="true">
                  <span>{t.ch}</span>
                  <span className="text-marigold">{t.label.toUpperCase()}</span>
                </div>
                <div
                  className="rz-slot"
                  ref={(el) => {
                    if (el) onTile?.(i, { slot: el });
                  }}
                >
                  {!animated && <p className="m-0 font-screen text-[18px] leading-tight text-newsprint">{t.summary}</p>}
                </div>
                <div aria-hidden="true" className="scanlines pointer-events-none absolute inset-0 opacity-70" />
                <div
                  aria-hidden="true"
                  className="glass pointer-events-none absolute inset-0"
                  style={{ borderRadius: 'inherit' }}
                />
                <div
                  aria-hidden="true"
                  className="rz-tile-flash"
                  ref={(el) => {
                    if (el) onTile?.(i, { flash: el });
                  }}
                />
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
