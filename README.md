# 🌱 Bloom — grow your day

A local-first productivity app where a **daily garden grows as you complete the
habits you care about**. Everything is your own: you choose your habits, write
your journal, and watch your streaks fill in GitHub-style contribution grids.

Your data never leaves the browser — it's persisted in `localStorage`, no
account or backend required.

## Features

- **🌻 Daily garden** — an SVG scene where each habit is a plant. Completing
  habits sprouts them, and the whole garden blossoms (buds → flowers →
  butterflies) as your day fills up. Browse previous days with the day switcher.
- **🌿 Custom habits** — define your own habits with an icon and color; check
  them off each day. Each habit tracks its own current and best streak.
- **📓 Journal** — a distraction-free, serif writing space for daily reflections
  or full essays. Autosaves as you type, with a browsable list of past entries
  and a running word count.
- **🧩 LeetCode daily check** — a simple daily checkmark with a streak counter.
- **😴 Sleep tracker** — log hours slept and rate quality; see your weekly
  average.
- **💼 Job search tracker** — a pipeline of applications (Wishlist → Applied →
  Interviewing → Offer / Rejected); click a status to advance it.
- **🔥 Contribution grids** — GitHub-style heatmaps for overall activity plus a
  per-habit grid, a LeetCode grid, and a sleep grid, with headline streak stats.

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check + production build
npm run preview  # serve the production build
```

The app ships with a little seeded sample data (a few habits, ~60 days of
history, a couple of journal entries, some job applications) so the garden and
grids look alive on first run. You can delete any of it — or wipe everything and
start fresh from the reset in code (`RESET_ALL`).

## Tech

- React 19 + TypeScript
- Vite 8
- Tailwind CSS v4
- No backend — state lives in `localStorage` (`bloom.state.v1`)

## Project structure

```
src/
  lib/
    types.ts      # domain types + AppState
    store.tsx     # reducer, context, persistence, selectors
    date.ts       # local-timezone day-key helpers
    streaks.ts    # current/longest streak computation
    seed.ts       # first-run sample data
    colors.ts     # habit color + emoji palettes
    id.ts
  components/
    Garden.tsx / Plant.tsx      # the growing garden
    HabitTracker.tsx / HabitEditor.tsx
    Journal.tsx
    SleepTracker.tsx
    DailyChecks.tsx             # LeetCode check
    JobTracker.tsx
    Heatmap.tsx / Stats.tsx     # contribution grids
    Dashboard.tsx               # main view
    ui.tsx                      # shared UI kit
  App.tsx                       # shell + navigation
```
