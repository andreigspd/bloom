import { useMemo } from 'react';
import { Tree } from './Tree';
import type { Habit } from '../lib/types';
import { parseDayKey } from '../lib/date';

interface GardenProps {
  habits: Habit[];
  completedIds: string[];
  /** overall 0..1 progress used to set the growth stage of the tree */
  progress: number;
  /** the day this garden represents (used as a stable seed) */
  day: string;
}

/**
 * The daily garden — now a single tree that grows with the day's overall
 * progress. Every completed habit adds a blossom (in that habit's color), so
 * the tree reflects both how much and which of the day's habits you finished.
 */
export function Garden({ habits, completedIds, progress, day }: GardenProps) {
  const blossomColors = useMemo(
    () =>
      habits
        .filter((h) => completedIds.includes(h.id))
        .map((h) => h.color),
    [habits, completedIds],
  );

  const seed = useMemo(() => {
    const d = parseDayKey(day);
    return d.getFullYear() * 372 + (d.getMonth() + 1) * 31 + d.getDate();
  }, [day]);

  const isFull = progress >= 1 && habits.length > 0;
  const isEmpty = completedIds.length === 0;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/50">
      <svg viewBox="0 0 320 220" className="block w-full" role="img" aria-label="Your daily tree">
        <defs>
          <linearGradient id="gardenSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={isFull ? '#cfe8ff' : '#e3f2fd'} stopOpacity="0.7" />
            <stop offset="100%" stopColor="#f5fbff" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* soft sky wash (mostly transparent) */}
        <rect x="0" y="0" width="320" height="220" fill="url(#gardenSky)" />

        {/* subtle sun that brightens with progress */}
        <circle cx="270" cy="46" r={14 + progress * 8} fill="#fde047" opacity={0.25 + progress * 0.45} />

        {/* faint horizon line */}
        <line x1="0" y1="188" x2="320" y2="188" stroke="#94a3b8" strokeWidth="1" opacity="0.25" />

        {/* the tree, scaled up from its 100-wide local space and centered.
            local (50,100) -> canvas (160, 196); scale 1.8 => 180 wide, 180 tall */}
        <g transform="translate(70, 16) scale(1.8)">
          <Tree progress={progress} blossomColors={blossomColors} seed={seed} />
        </g>
      </svg>

      {/* caption */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-center p-3">
        <span className="rounded-full border border-white/50 bg-white/50 px-3 py-1 text-xs font-medium text-slate-600 backdrop-blur-sm">
          {isEmpty
            ? 'Plant your first seed today'
            : isFull
              ? 'Your tree is in full bloom'
              : `${Math.round(progress * 100)}% grown`}
        </span>
      </div>
    </div>
  );
}
