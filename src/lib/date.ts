// Date helpers working in the user's LOCAL timezone.
// A "day key" is an ISO date string like "2026-09-25" (no time, local).

export function dayKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function parseDayKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function todayKey(): string {
  return dayKey(new Date());
}

export function addDays(key: string, delta: number): string {
  const d = parseDayKey(key);
  d.setDate(d.getDate() + delta);
  return dayKey(d);
}

export function isToday(key: string): boolean {
  return key === todayKey();
}

export function isFuture(key: string): boolean {
  return key > todayKey();
}

/** Difference in whole days between two day keys (a - b). */
export function diffDays(a: string, b: string): number {
  const ms = parseDayKey(a).getTime() - parseDayKey(b).getTime();
  return Math.round(ms / 86_400_000);
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const MONTHS_SHORT = MONTHS.map((m) => m.slice(0, 3));

export function formatLong(key: string): string {
  const d = parseDayKey(key);
  return `${WEEKDAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export function formatShort(key: string): string {
  const d = parseDayKey(key);
  return `${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}`;
}

export function monthLabel(monthIndex: number): string {
  return MONTHS_SHORT[monthIndex];
}

/** Returns the day key for `weeks` weeks ago (aligned to that same weekday). */
export function weeksAgoKey(weeks: number): string {
  return addDays(todayKey(), -weeks * 7);
}

/** All day keys from `start` to `end` inclusive. */
export function rangeKeys(start: string, end: string): string[] {
  const out: string[] = [];
  let cur = start;
  while (cur <= end) {
    out.push(cur);
    cur = addDays(cur, 1);
  }
  return out;
}


/** Full month name + year for a given month, e.g. "September 2026". */
export function monthTitle(year: number, monthIndex: number): string {
  return `${MONTHS[monthIndex]} ${year}`;
}

/** All day keys in the given calendar month (year, monthIndex 0-11). */
export function monthDayKeys(year: number, monthIndex: number): string[] {
  const out: string[] = [];
  const d = new Date(year, monthIndex, 1);
  while (d.getMonth() === monthIndex) {
    out.push(dayKey(d));
    d.setDate(d.getDate() + 1);
  }
  return out;
}
