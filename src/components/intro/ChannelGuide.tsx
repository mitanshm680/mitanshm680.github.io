import { useEffect, useState, type CSSProperties, type Ref } from 'react';
import { profile } from '../../data/portfolio';
import { useStation } from '../../lib/station';
import { ColorBars } from '../ui/ColorBars';
import { TILES, type TileEls } from './tiles';

/*
 * The MM-TV channel wall: eight little wood-cabinet TV sets, one per channel.
 * In the animated intro the résumé pieces land on the screens; the static
 * version (reduced motion) prints each channel's listings as text.
 */

const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

function GuideClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const iv = window.setInterval(() => setNow(new Date()), 15000);
    return () => window.clearInterval(iv);
  }, []);
  const h = now.getHours() % 12 || 12;
  const m = String(now.getMinutes()).padStart(2, '0');
  return (
    <p className="pg-clock">
      <span className="pg-clock-day">
        {DAYS[now.getDay()]} {MONTHS[now.getMonth()]} {now.getDate()}
      </span>
      <span className="text-marigold">
        {h}
        <span className="pg-colon">:</span>
        {m} {now.getHours() < 12 ? 'AM' : 'PM'}
      </span>
    </p>
  );
}

export function ChannelGuide({
  mode,
  onTile,
  titleRef,
}: {
  mode: 'animated' | 'static';
  onTile?: (i: number, els: Partial<TileEls>) => void;
  titleRef?: Ref<HTMLDivElement>;
}) {
  const { tuneTo } = useStation();
  const animated = mode === 'animated';
  const reg = (i: number, key: keyof TileEls) => (el: HTMLElement | null) => {
    if (el) onTile?.(i, { [key]: el });
  };

  return (
    <div className="pg" data-mode={mode}>
      <div className="pg-head">
        <div ref={titleRef} className="pg-titleblock">
          <p className="pg-kicker">MM-TV · CABLE 680 · ALL CHANNELS</p>
          <p className="pg-title">
            Now on <span className="whitespace-nowrap">MM-TV</span>
          </p>
        </div>
        <div className="pg-headinfo">
          <GuideClock />
          <p className="pg-hint">Pick a channel, or keep scrolling to watch them in order.</p>
        </div>
      </div>

      <ul className="tv-wall" aria-label="Channel guide">
        {TILES.map((t, i) => (
          <li
            key={t.id}
            className="tv"
            data-tv={t.id}
            ref={reg(i, 'bezel')}
            data-on={animated ? 'false' : 'true'}
            style={{ ['--scr' as string]: t.scr, ['--rot' as string]: `${i * 41 - 60}deg` } as CSSProperties}
          >
            <a
              href={`#${t.target}`}
              onClick={(e) => {
                e.preventDefault();
                tuneTo(t.target);
              }}
              className="tv-link"
              aria-label={`${t.ch}, ${t.label}: ${t.summary}`}
            >
              <span className="tv-cab woodgrain">
                <span className="tv-frame">
                  <span className="tv-screen" ref={reg(i, 'screen')}>
                    {t.id === 'main' && (
                      // the main set tunes in to the test pattern, like the big TV
                      <span className="tv-cards tv-cards-full" ref={reg(i, 'cards')} aria-hidden="true">
                        <span className="tv-card tv-card-test">
                          <ColorBars className="absolute inset-0" />
                          <span className="tv-test-label">
                            <span className="tv-test-name">{profile.name}</span>
                            <span className="tv-test-sub">DATA SCIENCE · FULL-STACK</span>
                          </span>
                        </span>
                      </span>
                    )}
                    <span className="tv-osd" aria-hidden="true">
                      <span>{t.ch}</span>
                      <span className="tv-osd-label">{t.label.toUpperCase()}</span>
                    </span>
                    <span className="tv-slot" ref={reg(i, 'slot')}>
                      {t.cards ? (
                        <span className="tv-cards" ref={reg(i, 'cards')} aria-hidden="true">
                          {t.cards.map((c) => (
                            <span key={c.title} className="tv-card">
                              {c.big && <span className="tv-card-big">{c.big}</span>}
                              <span className="tv-card-title">{c.title}</span>
                              {c.sub && <span className="tv-card-sub">{c.sub}</span>}
                              {c.meta && <span className="tv-card-meta">{c.meta}</span>}
                            </span>
                          ))}
                        </span>
                      ) : (
                        !animated && t.id !== 'main' && <span className="tv-static-text">{t.summary}</span>
                      )}
                      <span className="tv-more" ref={reg(i, 'more')} aria-hidden="true" />
                    </span>
                    <span className="tv-count" ref={reg(i, 'count')} aria-hidden="true" />
                    <span className="tv-tune" aria-hidden="true">
                      ▶ TUNE IN
                    </span>
                    <span className="static-noise tv-noise" ref={reg(i, 'noise')} aria-hidden="true" />
                    <span className="scanlines tv-scan" aria-hidden="true" />
                    <span className="tv-glass" aria-hidden="true" />
                    <span className="tv-flash" ref={reg(i, 'flash')} aria-hidden="true" />
                  </span>
                </span>
                <span className="tv-panel brushed" aria-hidden="true">
                  <span className="tv-dial">
                    <span className="tv-dial-face" />
                  </span>
                  <span className="tv-num">{t.num}</span>
                  <span className="tv-grille grille" />
                  <span className="tv-led" />
                </span>
              </span>
              <span className="tv-legs" aria-hidden="true">
                <span />
                <span />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
