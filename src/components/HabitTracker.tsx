import { useState } from 'react';
import { useStore, activeHabits, getDay } from '../lib/store';
import { computeStreaks } from '../lib/streaks';
import { HABIT_COLORS } from '../lib/colors';
import type { Habit } from '../lib/types';
import { Card, CardHeader, Button, EmptyHint } from './ui';
import { HabitEditor } from './HabitEditor';

export function HabitTracker({ day }: { day: string }) {
  const { state, dispatch } = useStore();
  const habits = activeHabits(state);
  const record = getDay(state, day);
  const [editing, setEditing] = useState<Habit | 'new' | null>(null);

  const done = record.completedHabitIds;

  return (
    <Card>
      <CardHeader
        title="Habits"
        subtitle={`${done.length}/${habits.length} done today`}
        action={
          <Button size="sm" variant="soft" onClick={() => setEditing('new')}>
            + Add
          </Button>
        }
      />

      {habits.length === 0 ? (
        <EmptyHint>No habits yet. Add one to start growing your tree.</EmptyHint>
      ) : (
        <ul className="space-y-2">
          {habits.map((h) => {
            const isDone = done.includes(h.id);
            const c = HABIT_COLORS[h.color];
            const streak = computeStreaks((d) =>
              getDay(state, d).completedHabitIds.includes(h.id),
            );
            return (
              <li key={h.id}>
                <div
                  className={`group flex items-center gap-3 rounded-2xl border px-3 py-2.5 transition ${
                    isDone ? c.chipBorder : 'border-slate-200/60'
                  }`}
                  style={isDone ? { backgroundColor: c.flower + '14' } : undefined}
                >
                  {/* color dot */}
                  <span
                    className="h-3.5 w-3.5 shrink-0 rounded-full ring-2 ring-white/60"
                    style={{ backgroundColor: c.flower, opacity: isDone ? 1 : 0.5 }}
                    aria-hidden
                  />

                  <div className="min-w-0 flex-1">
                    <p className={`truncate text-sm font-medium ${isDone ? c.chipText : 'text-slate-700'}`}>
                      {h.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {streak.current > 0 ? `${streak.current} day streak` : 'No active streak'}
                      {streak.longest > 1 && ` · best ${streak.longest}`}
                    </p>
                  </div>

                  <button
                    onClick={() => setEditing(h)}
                    className="rounded-lg px-2 py-1 text-xs text-slate-400 opacity-0 transition group-hover:opacity-100 hover:text-slate-700"
                    title="Edit habit"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => dispatch({ type: 'TOGGLE_HABIT', day, habitId: h.id })}
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition ${
                      isDone ? 'border-transparent' : 'border-slate-300 hover:border-slate-400'
                    }`}
                    style={{ backgroundColor: isDone ? c.flower : 'transparent' }}
                    aria-label={isDone ? 'Completed — click to undo' : 'Mark complete'}
                    title={isDone ? 'Completed — click to undo' : 'Mark complete'}
                  >
                    {isDone && (
                      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
                        <path
                          d="M3.5 8.5l3 3 6-6.5"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {editing === 'new' && (
        <HabitEditor
          onCancel={() => setEditing(null)}
          onSave={(data) => {
            dispatch({ type: 'ADD_HABIT', ...data, createdAt: day });
            setEditing(null);
          }}
        />
      )}
      {editing && editing !== 'new' && (
        <HabitEditor
          initial={editing}
          onCancel={() => setEditing(null)}
          onDelete={() => {
            dispatch({ type: 'DELETE_HABIT', id: editing.id });
            setEditing(null);
          }}
          onSave={(data) => {
            dispatch({ type: 'UPDATE_HABIT', id: editing.id, patch: data });
            setEditing(null);
          }}
        />
      )}
    </Card>
  );
}
