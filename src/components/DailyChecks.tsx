import { useStore, getDay } from '../lib/store';
import { computeStreaks } from '../lib/streaks';
import { Card, CardHeader } from './ui';

/** LeetCode daily checkmark + streak. */
export function LeetCodeCheck({ day }: { day: string }) {
  const { state, dispatch } = useStore();
  const done = getDay(state, day).leetcodeDone;
  const streak = computeStreaks((d) => getDay(state, d).leetcodeDone);

  return (
    <Card>
      <CardHeader
        title="LeetCode"
        subtitle={streak.current > 0 ? `${streak.current} day streak` : 'Daily problem'}
      />
      <button
        onClick={() => dispatch({ type: 'TOGGLE_LEETCODE', day })}
        className={`flex w-full items-center justify-center gap-2 rounded-2xl border-2 py-4 text-sm font-semibold transition ${
          done
            ? 'border-transparent bg-amber-400 text-white'
            : 'border-dashed border-slate-300/60 text-slate-400 hover:border-amber-300 hover:text-amber-500'
        }`}
      >
        {done && (
          <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none">
            <path
              d="M3.5 8.5l3 3 6-6.5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        {done ? 'Solved today' : 'Mark today’s problem solved'}
      </button>
      {streak.longest > 1 && (
        <p className="mt-2 text-center text-xs text-slate-400">
          Best streak: {streak.longest} days
        </p>
      )}
    </Card>
  );
}
