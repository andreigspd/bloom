// Core domain types for Bloom. All data is local-first (persisted in localStorage).

export type ID = string;

/** A user-defined habit that can be checked off each day. */
export interface Habit {
  id: ID;
  name: string;
  /** Accent color key used for theming the card + the tree's blossoms. */
  color: HabitColor;
  createdAt: string; // day key
  archived?: boolean;
  order: number;
}

export type HabitColor =
  | 'green'
  | 'emerald'
  | 'lime'
  | 'sky'
  | 'violet'
  | 'rose'
  | 'amber'
  | 'orange';

/** A journal entry. One or more allowed per day; each has its own id. */
export interface JournalEntry {
  id: ID;
  day: string; // day key
  title: string;
  body: string;
  createdAt: number; // epoch ms
  updatedAt: number; // epoch ms
}

/** A sleep log for a given night (attributed to the wake-up day). */
export interface SleepLog {
  day: string; // day key
  hours: number; // e.g. 7.5
  quality?: 1 | 2 | 3 | 4 | 5;
  note?: string;
}

/** Per-day state that isn't tied to a specific habit. */
export interface DayRecord {
  day: string; // day key
  /** ids of habits completed this day */
  completedHabitIds: ID[];
  /** simple daily checkmark */
  leetcodeDone: boolean;
}

export interface AppState {
  version: number;
  habits: Habit[];
  journal: JournalEntry[];
  sleep: Record<string, SleepLog>; // keyed by day
  days: Record<string, DayRecord>; // keyed by day
}

export function emptyState(): AppState {
  return {
    version: 1,
    habits: [],
    journal: [],
    sleep: {},
    days: {},
  };
}

export function emptyDay(day: string): DayRecord {
  return {
    day,
    completedHabitIds: [],
    leetcodeDone: false,
  };
}
