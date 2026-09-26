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
        icon="🌿"
        subtitle={`${done.length}/${habits.length} done today`}
        action={
          <Button size="sm" variant="soft" onClick={() => setEditing('new')}>
            + Add
          </Button>
        }
      />

      {habits.length === 0 ? (
        <EmptyHint>No habits yet. Add one to start growing your garden.</EmptyHint>
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
                    isDone ? `${c.chipBg} ${c.chipBorder}` : 'border-slate-100 bg-white'
                  }`}
                >
                  <button
                    onClick={() => dispatch({ type: 'TOGGLE_HABIT', day, habitId: h.id })}
                    aria-pressed={isDone}
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-lg transition ${
                      isDone ? 'scale-105' : 'grayscale-[35%] hover:grayscale-0'
                    }`}
                    style={{ backgroundColor: isDone ? c.flower + '22' : '#f1f5f9' }}
                    title={isDone ? 'Completed — click to undo' : 'Mark complete'}
                  >
                    {h.emoji}
                  </button>

                  <div className="min-w-0 flex-1">
                    <p className={`truncate text-sm font-medium ${isDone ? c.chipText : 'text-slate-700'}`}>
                      {h.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {streak.current > 0 ? `🔥 ${streak.current} day streak` : 'No active streak'}
                      {streak.longest > 1 && ` · best ${streak.longest}`}
                    </p>
                  </div>

                  <button
                    onClick={() => setEditing(h)}
                    className="rounded-lg px-2 py-1 text-xs text-slate-300 opacity-0 transition group-hover:opacity-100 hover:text-slate-600"
                    title="Edit habit"
                  >
                    ✏️
                  </button>

                  <button
                    onClick={() => dispatch({ type: 'TOGGLE_HABIT', day, habitId: h.id })}
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs transition ${
                      isDone
                        ? 'border-transparent text-white'
                        : 'border-slate-200 text-transparent hover:border-slate-300'
                    }`}
                    style={{ backgroundColor: isDone ? c.flower : 'transparent' }}
                    aria-label={isDone ? 'Completed' : 'Not completed'}
                  >
                    ✓
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
