import { useMemo, useState } from 'react';
import { addDays, todayKey, parseDayKey, monthLabel, formatLong } from '../lib/date';

export interface HeatmapProps {
  /** returns an intensity 0..1 (or a boolean) for a given day key */
  value: (day: string) => number;
  /** number of weeks to show (columns). Default ~ 1 year. */
  weeks?: number;
  /** base color for filled cells (hex) */
  color?: string;
  /** optional custom tooltip text per day */
  tooltip?: (day: string) => string;
}

const LEVELS = 4; // number of non-empty shades

/** Map 0..1 intensity to one of LEVELS+1 buckets. */
function bucket(v: number): number {
  if (v <= 0) return 0;
  return Math.min(LEVELS, Math.ceil(v * LEVELS));
}

/** Blend a hex color toward white for lighter buckets. */
function shade(hex: string, level: number): string {
  if (level === 0) return '#ebedf0';
  const t = level / LEVELS; // 0.25..1
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const mix = (c: number) => Math.round(c + (255 - c) * (1 - t) * 0.85);
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}

export function Heatmap({ value, weeks = 53, color = '#22c55e', tooltip }: HeatmapProps) {
  const [hover, setHover] = useState<{ day: string; x: number; y: number } | null>(null);

  // Build columns of weeks. Align so the last column ends today, and each
  // column starts on Sunday (GitHub-style).
  const { columns, monthMarks } = useMemo(() => {
    const today = todayKey();
    const todayDow = parseDayKey(today).getDay(); // 0 = Sun
    // last cell is today; fill the rest of this week with future (empty) days
    const end = addDays(today, 6 - todayDow);
    const start = addDays(end, -(weeks * 7 - 1));

    const cols: string[][] = [];
    const marks: { col: number; label: string }[] = [];
    let cur = start;
    let lastMonth = -1;

    for (let w = 0; w < weeks; w++) {
      const col: string[] = [];
      for (let d = 0; d < 7; d++) {
        col.push(cur);
        cur = addDays(cur, 1);
      }
      const firstOfCol = parseDayKey(col[0]);
      if (firstOfCol.getMonth() !== lastMonth) {
        lastMonth = firstOfCol.getMonth();
        marks.push({ col: w, label: monthLabel(lastMonth) });
      }
      cols.push(col);
    }
    return { columns: cols, monthMarks: marks };
  }, [weeks]);

  const today = todayKey();
  const cell = 12;
  const gap = 3;
  const step = cell + gap;

  return (
    <div className="relative">
      <div className="overflow-x-auto pb-1">
        <svg
          width={columns.length * step + 4}
          height={7 * step + 18}
          className="block"
        >
          {/* month labels */}
          {monthMarks.map((m, i) => {
            // avoid overlapping labels that are too close together
            const prev = monthMarks[i - 1];
            if (prev && m.col - prev.col < 3) return null;
            return (
              <text
                key={`${m.label}-${m.col}`}
                x={m.col * step}
                y={10}
                fontSize={9}
                fill="#94a3b8"
              >
                {m.label}
              </text>
            );
          })}

          <g transform="translate(0, 16)">
            {columns.map((col, ci) =>
              col.map((day, ri) => {
                const isFuture = day > today;
                const v = isFuture ? 0 : value(day);
                const lvl = bucket(v);
                return (
                  <rect
                    key={day}
                    x={ci * step}
                    y={ri * step}
                    width={cell}
                    height={cell}
                    rx={2.5}
                    fill={isFuture ? 'transparent' : shade(color, lvl)}
                    opacity={isFuture ? 0 : 1}
                    onMouseEnter={(e) => {
                      const rect = (e.target as SVGRectElement).getBoundingClientRect();
                      setHover({ day, x: rect.left + rect.width / 2, y: rect.top });
                    }}
                    onMouseLeave={() => setHover(null)}
                    style={{ cursor: isFuture ? 'default' : 'pointer' }}
                  />
                );
              }),
            )}
          </g>
        </svg>
      </div>

      {/* legend */}
      <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-slate-400">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((l) => (
          <span
            key={l}
            className="inline-block h-2.5 w-2.5 rounded-sm"
            style={{ backgroundColor: shade(color, l) }}
          />
        ))}
        <span>More</span>
      </div>

      {hover && (
        <div
          className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-full rounded-lg bg-slate-800 px-2 py-1 text-xs text-white shadow-lg"
          style={{ left: hover.x, top: hover.y - 6 }}
        >
          {tooltip ? tooltip(hover.day) : formatLong(hover.day)}
        </div>
      )}
    </div>
  );
}
