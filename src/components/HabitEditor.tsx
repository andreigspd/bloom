import { useState } from 'react';
import type { Habit, HabitColor } from '../lib/types';
import { COLOR_KEYS, EMOJI_CHOICES, HABIT_COLORS } from '../lib/colors';
import { Button } from './ui';

export function HabitEditor({
  initial,
  onSave,
  onCancel,
  onDelete,
}: {
  initial?: Habit;
  onSave: (data: { name: string; emoji: string; color: HabitColor }) => void;
  onCancel: () => void;
  onDelete?: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? '');
  const [emoji, setEmoji] = useState(initial?.emoji ?? '🌱');
  const [color, setColor] = useState<HabitColor>(initial?.color ?? 'green');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl animate-float-up"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-4 text-lg font-semibold text-slate-800">
          {initial ? 'Edit habit' : 'New habit'}
        </h3>

        <label className="mb-1 block text-xs font-medium text-slate-500">Name</label>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Read 20 minutes"
          className="mb-4 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-bloom-400 focus:ring-2 focus:ring-bloom-100"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && name.trim()) onSave({ name: name.trim(), emoji, color });
          }}
        />

        <label className="mb-1 block text-xs font-medium text-slate-500">Icon</label>
        <div className="mb-4 flex flex-wrap gap-1.5">
          {EMOJI_CHOICES.map((e) => (
            <button
              key={e}
              onClick={() => setEmoji(e)}
              className={`h-9 w-9 rounded-xl text-lg transition ${
                emoji === e ? 'bg-bloom-100 ring-2 ring-bloom-400' : 'hover:bg-slate-100'
              }`}
            >
              {e}
            </button>
          ))}
        </div>

        <label className="mb-1 block text-xs font-medium text-slate-500">Color</label>
        <div className="mb-6 flex flex-wrap gap-2">
          {COLOR_KEYS.map((k) => (
            <button
              key={k}
              onClick={() => setColor(k)}
              aria-label={k}
              className={`h-8 w-8 rounded-full transition ${
                color === k ? 'ring-2 ring-offset-2 ring-slate-400' : ''
              }`}
              style={{ backgroundColor: HABIT_COLORS[k].flower }}
            />
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div>
            {onDelete && (
              <Button variant="danger" size="sm" onClick={onDelete}>
                Delete
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              onClick={() => name.trim() && onSave({ name: name.trim(), emoji, color })}
              disabled={!name.trim()}
            >
              {initial ? 'Save' : 'Plant it'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
