import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';
import type {
  AppState,
  DayRecord,
  Habit,
  JournalEntry,
  JobApplication,
  SleepLog,
} from './types';
import { emptyDay } from './types';
import { seedState } from './seed';
import { uid } from './id';

const STORAGE_KEY = 'bloom.state.v1';

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as AppState;
  } catch {
    /* ignore corrupt state */
  }
  return seedState();
}

function saveState(state: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage full / unavailable — app still works in-memory */
  }
}

type Action =
  | { type: 'ADD_HABIT'; name: string; emoji: string; color: Habit['color']; createdAt: string }
  | { type: 'UPDATE_HABIT'; id: string; patch: Partial<Habit> }
  | { type: 'DELETE_HABIT'; id: string }
  | { type: 'TOGGLE_HABIT'; day: string; habitId: string }
  | { type: 'TOGGLE_LEETCODE'; day: string }
  | { type: 'SET_SLEEP'; log: SleepLog }
  | { type: 'REMOVE_SLEEP'; day: string }
  | { type: 'SAVE_JOURNAL'; entry: JournalEntry }
  | { type: 'DELETE_JOURNAL'; id: string }
  | { type: 'SAVE_JOB'; job: JobApplication }
  | { type: 'DELETE_JOB'; id: string }
  | { type: 'RESET_ALL' };

function ensureDay(state: AppState, day: string): DayRecord {
  return state.days[day] ?? emptyDay(day);
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ADD_HABIT': {
      const order = state.habits.length
        ? Math.max(...state.habits.map((h) => h.order)) + 1
        : 0;
      const habit: Habit = {
        id: uid(),
        name: action.name,
        emoji: action.emoji,
        color: action.color,
        createdAt: action.createdAt,
        order,
      };
      return { ...state, habits: [...state.habits, habit] };
    }
    case 'UPDATE_HABIT':
      return {
        ...state,
        habits: state.habits.map((h) =>
          h.id === action.id ? { ...h, ...action.patch } : h,
        ),
      };
    case 'DELETE_HABIT': {
      const days = Object.fromEntries(
        Object.entries(state.days).map(([k, d]) => [
          k,
          { ...d, completedHabitIds: d.completedHabitIds.filter((id) => id !== action.id) },
        ]),
      );
      return {
        ...state,
        habits: state.habits.filter((h) => h.id !== action.id),
        days,
      };
    }
    case 'TOGGLE_HABIT': {
      const d = ensureDay(state, action.day);
      const has = d.completedHabitIds.includes(action.habitId);
      const completedHabitIds = has
        ? d.completedHabitIds.filter((id) => id !== action.habitId)
        : [...d.completedHabitIds, action.habitId];
      return {
        ...state,
        days: { ...state.days, [action.day]: { ...d, completedHabitIds } },
      };
    }
    case 'TOGGLE_LEETCODE': {
      const d = ensureDay(state, action.day);
      return {
        ...state,
        days: { ...state.days, [action.day]: { ...d, leetcodeDone: !d.leetcodeDone } },
      };
    }
    case 'SET_SLEEP':
      return { ...state, sleep: { ...state.sleep, [action.log.day]: action.log } };
    case 'REMOVE_SLEEP': {
      const sleep = { ...state.sleep };
      delete sleep[action.day];
      return { ...state, sleep };
    }
    case 'SAVE_JOURNAL': {
      const exists = state.journal.some((e) => e.id === action.entry.id);
      return {
        ...state,
        journal: exists
          ? state.journal.map((e) => (e.id === action.entry.id ? action.entry : e))
          : [action.entry, ...state.journal],
      };
    }
    case 'DELETE_JOURNAL':
      return { ...state, journal: state.journal.filter((e) => e.id !== action.id) };
    case 'SAVE_JOB': {
      const exists = state.jobs.some((j) => j.id === action.job.id);
      return {
        ...state,
        jobs: exists
          ? state.jobs.map((j) => (j.id === action.job.id ? action.job : j))
          : [action.job, ...state.jobs],
      };
    }
    case 'DELETE_JOB':
      return { ...state, jobs: state.jobs.filter((j) => j.id !== action.id) };
    case 'RESET_ALL':
      return seedState();
    default:
      return state;
  }
}

interface StoreContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}

// ---- Selectors / derived helpers -----------------------------------------

export function getDay(state: AppState, day: string): DayRecord {
  return state.days[day] ?? emptyDay(day);
}

export function activeHabits(state: AppState): Habit[] {
  return state.habits
    .filter((h) => !h.archived)
    .sort((a, b) => a.order - b.order);
}

/** Fraction (0..1) of the day's habits completed. */
export function dayProgress(state: AppState, day: string): number {
  const habits = activeHabits(state);
  if (habits.length === 0) return 0;
  const done = getDay(state, day).completedHabitIds.filter((id) =>
    habits.some((h) => h.id === id),
  ).length;
  return done / habits.length;
}

/** A single 0..N "activity score" for a day, used to color the master heatmap. */
export function dayScore(state: AppState, day: string): number {
  const d = getDay(state, day);
  const habits = activeHabits(state);
  const habitDone = d.completedHabitIds.filter((id) =>
    habits.some((h) => h.id === id),
  ).length;
  let score = habitDone;
  if (d.leetcodeDone) score += 1;
  if (state.sleep[day]) score += 1;
  if (state.journal.some((e) => e.day === day)) score += 1;
  if (d.jobAppliedToday) score += 1;
  return score;
}
