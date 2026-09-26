import { useState } from 'react';
import { useStore, activeHabits, getDay, dayProgress } from '../lib/store';
import { todayKey, addDays, formatLong, isToday, isFuture } from '../lib/date';
import { Garden } from './Garden';
import { MonthTrees } from './MonthTrees';
import { HabitTracker } from './HabitTracker';
import { SleepTracker } from './SleepTracker';
import { LeetCodeCheck } from './DailyChecks';
import { Stats } from './Stats';
import { Card } from './ui';

export function Dashboard() {
  const { state } = useStore();
  const [day, setDay] = useState(todayKey());

  const habits = activeHabits(state);
  const record = getDay(state, day);
  const progress = dayProgress(state, day);

  const canGoForward = !isToday(day);

  return (
    <div className="space-y-4">
      {/* Garden hero + day switcher */}
      <Card className="!border-slate-200/50 !p-4">
        <div className="mb-3 flex items-center justify-between">
          <button
            onClick={() => setDay(addDays(day, -1))}
            className="rounded-full px-3 py-1 text-slate-400 transition hover:bg-slate-500/10 hover:text-slate-700"
            aria-label="Previous day"
          >
            ‹
          </button>
          <div className="text-center">
            <p className="text-sm font-semibold text-slate-800">
              {isToday(day) ? 'Today' : formatLong(day)}
            </p>
            {isToday(day) && <p className="text-xs text-slate-400">{formatLong(day)}</p>}
          </div>
          <button
            onClick={() => !isFuture(addDays(day, 1)) && setDay(addDays(day, 1))}
            disabled={!canGoForward}
            className="rounded-full px-3 py-1 text-slate-400 transition enabled:hover:bg-slate-500/10 enabled:hover:text-slate-700 disabled:opacity-30"
            aria-label="Next day"
          >
            ›
          </button>
        </div>

        <Garden
          habits={habits}
          completedIds={record.completedHabitIds}
          progress={progress}
          day={day}
        />

        {!isToday(day) && (
          <div className="mt-3 text-center">
            <button
              onClick={() => setDay(todayKey())}
              className="text-xs font-medium text-bloom-600 hover:underline"
            >
              ← Back to today
            </button>
          </div>
        )}
      </Card>

      {/* Tracker grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <HabitTracker day={day} />
        <div className="space-y-4">
          <SleepTracker day={day} />
          <LeetCodeCheck day={day} />
        </div>
      </div>

      {/* Whole-month view of daily trees — click a day to load it above */}
      <MonthTrees onPickDay={(d) => setDay(d)} />

      {/* Contribution grids on the main screen */}
      <Stats />
    </div>
  );
}
