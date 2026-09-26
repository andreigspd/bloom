import type { HabitColor } from './types';

interface ColorSpec {
  /** primary flower / accent */
  flower: string;
  flowerDark: string;
  /** button / chip tints (tailwind classes) */
  chipBg: string;
  chipText: string;
  chipBorder: string;
  ring: string;
  /** solid accent for filled states */
  solidBg: string;
}

export const HABIT_COLORS: Record<HabitColor, ColorSpec> = {
  green: {
    flower: '#22c55e', flowerDark: '#15803d',
    chipBg: 'bg-green-50', chipText: 'text-green-700', chipBorder: 'border-green-200',
    ring: 'ring-green-400', solidBg: 'bg-green-500',
  },
  emerald: {
    flower: '#10b981', flowerDark: '#047857',
    chipBg: 'bg-emerald-50', chipText: 'text-emerald-700', chipBorder: 'border-emerald-200',
    ring: 'ring-emerald-400', solidBg: 'bg-emerald-500',
  },
  lime: {
    flower: '#84cc16', flowerDark: '#4d7c0f',
    chipBg: 'bg-lime-50', chipText: 'text-lime-700', chipBorder: 'border-lime-200',
    ring: 'ring-lime-400', solidBg: 'bg-lime-500',
  },
  sky: {
    flower: '#0ea5e9', flowerDark: '#0369a1',
    chipBg: 'bg-sky-50', chipText: 'text-sky-700', chipBorder: 'border-sky-200',
    ring: 'ring-sky-400', solidBg: 'bg-sky-500',
  },
  violet: {
    flower: '#8b5cf6', flowerDark: '#6d28d9',
    chipBg: 'bg-violet-50', chipText: 'text-violet-700', chipBorder: 'border-violet-200',
    ring: 'ring-violet-400', solidBg: 'bg-violet-500',
  },
  rose: {
    flower: '#f43f5e', flowerDark: '#be123c',
    chipBg: 'bg-rose-50', chipText: 'text-rose-700', chipBorder: 'border-rose-200',
    ring: 'ring-rose-400', solidBg: 'bg-rose-500',
  },
  amber: {
    flower: '#f59e0b', flowerDark: '#b45309',
    chipBg: 'bg-amber-50', chipText: 'text-amber-700', chipBorder: 'border-amber-200',
    ring: 'ring-amber-400', solidBg: 'bg-amber-500',
  },
  orange: {
    flower: '#f97316', flowerDark: '#c2410c',
    chipBg: 'bg-orange-50', chipText: 'text-orange-700', chipBorder: 'border-orange-200',
    ring: 'ring-orange-400', solidBg: 'bg-orange-500',
  },
};

export const COLOR_KEYS = Object.keys(HABIT_COLORS) as HabitColor[];
