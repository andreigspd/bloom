import type { HabitColor } from './types';

interface ColorSpec {
  /** primary accent (dot / heatmap) */
  flower: string;
  flowerDark: string;
  /** chip tints (tailwind classes) */
  chipText: string;
  chipBorder: string;
}

/**
 * Minimalist, low-saturation earthy palette — muted greens and warm straws.
 * The HabitColor keys are kept stable so existing saved habits keep working;
 * only their appearance is retuned to the calmer scheme.
 */
export const HABIT_COLORS: Record<HabitColor, ColorSpec> = {
  green: {
    flower: '#7fa876', flowerDark: '#52724d',
    chipText: 'text-[#52724d]', chipBorder: 'border-[#b6cc9c]',
  },
  emerald: {
    flower: '#6fae94', flowerDark: '#436b58',
    chipText: 'text-[#436b58]', chipBorder: 'border-[#aacdba]',
  },
  lime: {
    flower: '#a6b56a', flowerDark: '#6c7a3c',
    chipText: 'text-[#6c7a3c]', chipBorder: 'border-[#cdd69e]',
  },
  sky: {
    flower: '#7ba0ac', flowerDark: '#4c6a74',
    chipText: 'text-[#4c6a74]', chipBorder: 'border-[#b3c8cf]',
  },
  violet: {
    flower: '#9d94b5', flowerDark: '#655d7d',
    chipText: 'text-[#655d7d]', chipBorder: 'border-[#c8c2d6]',
  },
  rose: {
    flower: '#c19191', flowerDark: '#8a5d5d',
    chipText: 'text-[#8a5d5d]', chipBorder: 'border-[#dcc2c2]',
  },
  amber: {
    flower: '#d8c46f', flowerDark: '#a08a3f',
    chipText: 'text-[#8a752f]', chipBorder: 'border-[#e9db9a]',
  },
  orange: {
    flower: '#cfa06f', flowerDark: '#9c6f40',
    chipText: 'text-[#8a6236]', chipBorder: 'border-[#e3c7a4]',
  },
};

export const COLOR_KEYS = Object.keys(HABIT_COLORS) as HabitColor[];
