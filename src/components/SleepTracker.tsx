import { useMemo } from 'react';
import { useStore } from '../lib/store';
import { addDays, todayKey } from '../lib/date';
import { Card, CardHeader, EmptyHint } from './ui';

export function SleepTracker({ day }: { day: string }) {
  const { state, dispatch } = useStore();
  const log = state.sleep[day];

  // 7-day average ending on `day`.
  const avg = useMemo(() => {
    let sum = 0;
    let n = 0;
    for (let i = 0; i < 7; i++) {
      const l = state.sleep[addDays(day, -i)];
      if (l) {
        sum += l.hours;
        n++;
      }
    }
    return n ? sum / n : null;
  }, [state.sleep, day]);

  function setHours(hours: number) {
    if (hours <= 0) {
      dispatch({ type: 'REMOVE_SLEEP', day });
    } else {
      dispatch({ type: 'SET_SLEEP', log: { ...log, day, hours } });
    }
  }

  const hours = log?.hours ?? 0;
  const isTonight = day === todayKey();

  return (
    <Card>
      <CardHeader
        title="Sleep"
        icon="😴"
        subtitle={avg ? `${avg.toFixed(1)}h avg this week` : 'Log your rest'}
        action={
          log && (
            <span className="text-sm font-semibold text-sky-600">{hours}h</span>
          )
        }
      />

      <div className="mb-3">
        <input
          type="range"
          min={0}
          max={12}
          step={0.5}
          value={hours}
          onChange={(e) => setHours(Number(e.target.value))}
          className="w-full accent-sky-500"
        />
        <div className="mt-1 flex justify-between text-[10px] text-slate-400">
          <span>0h</span>
          <span>6h</span>
          <span>12h</span>
        </div>
      </div>

      {log ? (
        <div className="flex items-center gap-1.5">
          {([1, 2, 3, 4, 5] as const).map((q) => (
            <button
              key={q}
              onClick={() => dispatch({ type: 'SET_SLEEP', log: { ...log, quality: q } })}
              className={`text-lg transition ${
                (log.quality ?? 0) >= q ? 'grayscale-0' : 'opacity-30 grayscale'
              }`}
              title={`Quality ${q}/5`}
            >
              ⭐
            </button>
          ))}
          <span className="ml-auto text-xs text-slate-400">
            {isTonight ? 'last night' : ''}
          </span>
        </div>
      ) : (
        <EmptyHint>Drag the slider to log how many hours you slept.</EmptyHint>
      )}
    </Card>
  );
}
