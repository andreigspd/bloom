import { addDays, todayKey } from './date';

/**
 * Given a predicate that says whether a given day "counts", compute the
 * current streak ending today (or yesterday, if today isn't done yet) and the
 * longest streak within a lookback window.
 */
export function computeStreaks(
  done: (day: string) => boolean,
  lookbackDays = 400,
): { current: number; longest: number; doneToday: boolean } {
  const today = todayKey();
  const doneToday = done(today);

  // Current streak: walk backwards from today. If today isn't done, start from
  // yesterday so an in-progress day doesn't break the streak.
  let current = 0;
  let cursor = doneToday ? today : addDays(today, -1);
  while (done(cursor)) {
    current += 1;
    cursor = addDays(cursor, -1);
  }

  // Longest streak within window.
  let longest = 0;
  let run = 0;
  let day = addDays(today, -lookbackDays);
  while (day <= today) {
    if (done(day)) {
      run += 1;
      if (run > longest) longest = run;
    } else {
      run = 0;
    }
    day = addDays(day, 1);
  }

  return { current, longest, doneToday };
}
