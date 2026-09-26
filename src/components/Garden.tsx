import { useMemo } from 'react';
import { Plant } from './Plant';
import type { Habit } from '../lib/types';

interface GardenProps {
  habits: Habit[];
  completedIds: string[];
  /** overall 0..1 progress used to set the growth stage of completed plants */
  progress: number;
}

/**
 * The daily garden. Every active habit gets a slot in the plot. A habit that
 * has been completed today grows a plant; the growth *stage* is driven by the
 * day's overall progress, so finishing more of your day makes the whole garden
 * blossom, not just individual plants.
 */
export function Garden({ habits, completedIds, progress }: GardenProps) {
  const slots = habits.length || 1;

  // Stage 0..4. At 100% progress everything is in full flower.
  const globalStage = useMemo(() => {
    if (progress >= 1) return 4;
    if (progress >= 0.75) return 3;
    if (progress >= 0.5) return 2;
    if (progress > 0) return 1;
    return 0;
  }, [progress]);

  const isFull = progress >= 1 && habits.length > 0;
  const isEmpty = completedIds.length === 0;

  // Layout: distribute plant slots evenly across the plot width (0..320).
  const plotW = 320;
  const margin = 34;
  const usable = plotW - margin * 2;
  const step = slots > 1 ? usable / (slots - 1) : 0;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/60 shadow-sm">
      <svg viewBox="0 0 320 200" className="w-full block" role="img" aria-label="Your daily garden">
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={isFull ? '#bfdbfe' : '#e0f2fe'} />
            <stop offset="100%" stopColor="#f0f9ff" />
          </linearGradient>
          <linearGradient id="soil" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a97c58" />
            <stop offset="100%" stopColor="#7c5a3a" />
          </linearGradient>
        </defs>

        {/* sky */}
        <rect x="0" y="0" width="320" height="200" fill="url(#sky)" />

        {/* sun — brightens as the day fills up */}
        <g style={{ animation: 'sunPulse 5s ease-in-out infinite' }}>
          <circle cx="272" cy="42" r={16 + progress * 8} fill="#fde047" opacity={0.5 + progress * 0.5} />
          <circle cx="272" cy="42" r={11 + progress * 5} fill="#facc15" />
        </g>

        {/* distant hills */}
        <path d="M0 150 Q 80 120 160 150 T 320 150 V200 H0 Z" fill="#bbf7d0" opacity="0.7" />
        <path d="M0 165 Q 100 140 200 165 T 320 165 V200 H0 Z" fill="#86efac" opacity="0.7" />

        {/* soil bed */}
        <rect x="0" y="150" width="320" height="50" fill="url(#soil)" />
        <ellipse cx="160" cy="150" rx="180" ry="10" fill="#8b5e3c" opacity="0.4" />

        {/* plants — each slot maps to a habit */}
        {habits.map((h, i) => {
          const x = margin + step * i;
          const done = completedIds.includes(h.id);
          const stage = done ? globalStage : 0;
          return (
            <g key={h.id} transform={`translate(${x - 30}, 60)`}>
              <Plant
                stage={stage}
                color={h.color}
                emoji={h.emoji}
                swayDelay={(i % 5) * 0.4}
              />
            </g>
          );
        })}

        {/* butterflies appear when the garden is in full bloom */}
        {isFull && (
          <>
            <text x="60" y="70" fontSize="16" style={{ animation: 'sway 3s ease-in-out infinite' }}>🦋</text>
            <text x="230" y="95" fontSize="14" style={{ animation: 'sway 3.5s ease-in-out .5s infinite' }}>🐝</text>
          </>
        )}
      </svg>

      {/* overlay caption */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between p-3">
        <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-soil-700 backdrop-blur">
          {isEmpty
            ? 'Plant your first seed today 🌱'
            : isFull
              ? 'Your garden is in full bloom! 🌸'
              : `${Math.round(progress * 100)}% grown`}
        </span>
      </div>
    </div>
  );
}
