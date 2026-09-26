import { useMemo, useState } from 'react';
import { Tree } from './Tree';
import { useStore, dayProgress } from '../lib/store';
import {
  monthDayKeys,
  monthTitle,
  parseDayKey,
  todayKey,
  isFuture,
} from '../lib/date';

function seedFor(day: string): number {
  const d = parseDayKey(day);
  return d.getFullYear() * 372 + (d.getMonth() + 1) * 31 + d.getDate();
}

/**
 * A whole-month view: one small tree per day, each grown to that day's
 * completion level. Rendered inline inside the garden box (no card wrapper).
 * `selectedDay` is highlighted to tie it to the large tree shown above.
 */
export function MonthTrees({
  selectedDay,
  onPickDay,
}: {
  selectedDay: string;
  onPickDay?: (day: string) => void;
}) {
  const { state } = useStore();
  const today = parseDayKey(todayKey());

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const days = useMemo(() => monthDayKeys(year, month), [year, month]);

  const grown = days.filter((d) => !isFuture(d) && dayProgress(state, d) > 0).length;
  const trackedSoFar = days.filter((d) => !isFuture(d)).length;

  function shift(delta: number) {
    let m = month + delta;
    let y = year;
    if (m < 0) {
      m = 11;
      y -= 1;
    } else if (m > 11) {
      m = 0;
      y += 1;
    }
    setMonth(m);
    setYear(y);
  }

  // don't allow navigating past the current month
  const atCurrentMonth = year === today.getFullYear() && month === today.getMonth();

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold tracking-wide text-slate-700 uppercase">
            This month
          </h3>
          <p className="text-xs text-slate-500">{grown} of {trackedSoFar} days grown</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => shift(-1)}
            className="rounded-full px-2.5 py-1 text-slate-400 transition hover:bg-bloom-500/10 hover:text-bloom-700"
            aria-label="Previous month"
          >
            ‹
          </button>
          <span className="min-w-[9rem] text-center text-xs font-medium text-slate-600">
            {monthTitle(year, month)}
          </span>
          <button
            onClick={() => !atCurrentMonth && shift(1)}
            disabled={atCurrentMonth}
            className="rounded-full px-2.5 py-1 text-slate-400 transition enabled:hover:bg-bloom-500/10 enabled:hover:text-bloom-700 disabled:opacity-30"
            aria-label="Next month"
          >
            ›
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {days.map((d) => {
          const future = isFuture(d);
          const progress = future ? 0 : dayProgress(state, d);
          const dayNum = parseDayKey(d).getDate();
          const highlight = d === selectedDay;

          return (
            <button
              key={d}
              onClick={() => !future && onPickDay?.(d)}
              disabled={future}
              title={future ? undefined : `${d} — ${Math.round(progress * 100)}% grown`}
              className={`relative rounded-xl border p-0.5 transition ${
                highlight
                  ? 'border-bloom-400/70 bg-bloom-500/10'
                  : 'border-bloom-100/60 hover:border-bloom-300/70'
              } ${future ? 'opacity-30' : 'cursor-pointer'}`}
            >
              <span className="absolute left-1 top-0.5 text-[9px] font-medium text-slate-400">
                {dayNum}
              </span>
              <svg viewBox="0 0 100 100" className="block w-full">
                <Tree progress={progress} animate={false} seed={seedFor(d)} />
              </svg>
            </button>
          );
        })}
      </div>
    </div>
  );
}
