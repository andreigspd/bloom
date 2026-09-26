import type { AppState } from './types';
import { emptyState } from './types';
import { todayKey, addDays } from './date';
import { uid } from './id';

/**
 * A friendly starter state so the app doesn't look empty on first run.
 * Creates a few habits and some backdated activity to make the grids + garden
 * feel alive immediately. Users can delete any of it.
 */
export function seedState(): AppState {
  const s = emptyState();
  const today = todayKey();

  const habits = [
    { name: 'Read 20 min', emoji: '📚', color: 'sky' as const },
    { name: 'Exercise', emoji: '💪', color: 'rose' as const },
    { name: 'Drink water', emoji: '💧', color: 'sky' as const },
    { name: 'Meditate', emoji: '🧘', color: 'violet' as const },
  ];

  s.habits = habits.map((h, i) => ({
    id: uid(),
    name: h.name,
    emoji: h.emoji,
    color: h.color,
    createdAt: addDays(today, -60),
    order: i,
  }));

  // Backfill ~60 days of plausible activity so heatmaps/streaks look real.
  for (let i = 60; i >= 0; i--) {
    const day = addDays(today, -i);
    // deterministic-ish pseudo randomness from the day string
    const seed = [...day].reduce((a, c) => a + c.charCodeAt(0), 0);
    const rand = (n: number) => (seed * 9301 + n * 49297) % 233280 / 233280;

    const completed = s.habits
      .filter((_, idx) => rand(idx + 1) > 0.35)
      .map((h) => h.id);

    s.days[day] = {
      day,
      completedHabitIds: completed,
      leetcodeDone: rand(99) > 0.45,
      jobAppliedToday: rand(7) > 0.85,
    };

    if (rand(3) > 0.6) {
      s.sleep[day] = {
        day,
        hours: Math.round((6 + rand(11) * 3) * 2) / 2,
        quality: (Math.floor(rand(13) * 5) + 1) as 1 | 2 | 3 | 4 | 5,
      };
    }
  }

  const now = Date.now();
  s.journal = [
    {
      id: uid(),
      day: today,
      title: 'Planting the first seed',
      body:
        'Today I started using Bloom. The idea is simple: every small thing I ' +
        'do to take care of myself makes the garden grow a little. ' +
        "Let's see what a month of tiny wins looks like.",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uid(),
      day: addDays(today, -3),
      title: 'On slow mornings',
      body:
        'Woke up late but still got a walk in. Some days the garden only ' +
        'needs one sprout. That counts too.',
      createdAt: now - 3 * 86_400_000,
      updatedAt: now - 3 * 86_400_000,
    },
  ];

  s.jobs = [
    {
      id: uid(),
      company: 'Evergreen Labs',
      role: 'Frontend Engineer',
      status: 'interviewing',
      link: 'https://example.com',
      notes: 'Second round scheduled next week.',
      createdAt: addDays(today, -10),
      updatedAt: now,
    },
    {
      id: uid(),
      company: 'Meadow Systems',
      role: 'Full-stack Developer',
      status: 'applied',
      createdAt: addDays(today, -5),
      updatedAt: now,
    },
    {
      id: uid(),
      company: 'Sunrise Analytics',
      role: 'Software Engineer',
      status: 'wishlist',
      createdAt: addDays(today, -1),
      updatedAt: now,
    },
  ];

  return s;
}
