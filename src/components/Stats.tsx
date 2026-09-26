import { useMemo } from 'react';
import { useStore, getDay, activeHabits, dayScore } from '../lib/store';
import { computeStreaks } from '../lib/streaks';
import { HABIT_COLORS } from '../lib/colors';
import { formatLong } from '../lib/date';
import { Card, CardHeader, StatPill } from './ui';
import { Heatmap } from './Heatmap';

export function Stats() {
  const { state } = useStore();
  const habits = activeHabits(state);

  // Max possible daily score = habits + leetcode + sleep + journal
  const maxScore = habits.length + 3;

  const overallStreak = useMemo(
    () => computeStreaks((d) => dayScore(state, d) > 0),
    [state],
  );

  const leetStreak = useMemo(
    () => computeStreaks((d) => getDay(state, d).leetcodeDone),
    [state],
  );

  const totalActiveDays = useMemo(
    () => Object.keys(state.days).filter((d) => dayScore(state, d) > 0).length,
    [state],
  );

  const journalWords = useMemo(
    () =>
      state.journal.reduce(
        (sum, e) => sum + (e.body.trim() ? e.body.trim().split(/\s+/).length : 0),
        0,
      ),
    [state.journal],
  );

  return (
    <div className="space-y-4">
      {/* headline stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatPill label="Current streak" value={`${overallStreak.current}d`} />
        <StatPill label="Longest streak" value={`${overallStreak.longest}d`} />
        <StatPill label="Active days" value={totalActiveDays} />
        <StatPill label="Words journaled" value={journalWords.toLocaleString()} />
      </div>

      {/* master activity heatmap */}
      <Card>
        <CardHeader
          title="Activity"
          subtitle="Every green square is a day you grew something"
        />
        <Heatmap
          value={(d) => (maxScore ? dayScore(state, d) / maxScore : 0)}
          color="#16a34a"
          tooltip={(d) => {
            const score = dayScore(state, d);
            return `${formatLong(d)} — ${score} activit${score === 1 ? 'y' : 'ies'}`;
          }}
        />
      </Card>

      {/* per-habit grids */}
      {habits.length > 0 && (
        <Card>
          <CardHeader title="Habit grids" subtitle="One row of history per habit" />
          <div className="space-y-5">
            {habits.map((h) => {
              const streak = computeStreaks((d) =>
                getDay(state, d).completedHabitIds.includes(h.id),
              );
              return (
                <div key={h.id}>
                  <div className="mb-1 flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: HABIT_COLORS[h.color].flower }}
                    />
                    <span className="text-sm font-medium text-slate-700">{h.name}</span>
                    <span className="text-xs text-slate-400">
                      {streak.current > 0 && `${streak.current}d`}
                      {streak.longest > 1 && ` · best ${streak.longest}d`}
                    </span>
                  </div>
                  <Heatmap
                    weeks={30}
                    color={HABIT_COLORS[h.color].flower}
                    value={(d) => (getDay(state, d).completedHabitIds.includes(h.id) ? 1 : 0)}
                    tooltip={(d) =>
                      `${formatLong(d)} — ${
                        getDay(state, d).completedHabitIds.includes(h.id) ? 'done' : 'not done'
                      }`
                    }
                  />
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* leetcode grid */}
      <Card>
        <CardHeader
          title="LeetCode grid"
          subtitle={`${leetStreak.current}d current · best ${leetStreak.longest}d`}
        />
        <Heatmap
          color="#f59e0b"
          value={(d) => (getDay(state, d).leetcodeDone ? 1 : 0)}
          tooltip={(d) =>
            `${formatLong(d)} — ${getDay(state, d).leetcodeDone ? 'solved' : 'no problem'}`
          }
        />
      </Card>

      {/* sleep grid — intensity by hours */}
      <Card>
        <CardHeader title="Sleep grid" subtitle="Darker = more rest (8h+ is full)" />
        <Heatmap
          color="#0ea5e9"
          value={(d) => {
            const l = state.sleep[d];
            return l ? Math.min(1, l.hours / 8) : 0;
          }}
          tooltip={(d) => {
            const l = state.sleep[d];
            return `${formatLong(d)} — ${l ? `${l.hours}h` : 'no log'}`;
          }}
        />
      </Card>
    </div>
  );
}
