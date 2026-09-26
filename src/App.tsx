import { useState } from 'react';
import { StoreProvider, useStore } from './lib/store';
import { dayProgress } from './lib/store';
import { todayKey } from './lib/date';
import { Dashboard } from './components/Dashboard';
import { Journal } from './components/Journal';

type View = 'garden' | 'journal';

const NAV: { id: View; label: string }[] = [
  { id: 'garden', label: 'Garden' },
  { id: 'journal', label: 'Journal' },
];

function Header({ view, setView }: { view: View; setView: (v: View) => void }) {
  const { state } = useStore();
  const progress = dayProgress(state, todayKey());

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/50 bg-white/40 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3">
        <div className="leading-tight">
          <h1 className="text-lg font-bold text-slate-800">Bloom</h1>
          <p className="hidden text-[11px] text-slate-400 sm:block">grow your day</p>
        </div>

        <nav className="flex items-center gap-1 rounded-full border border-slate-200/60 p-1">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => setView(n.id)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition ${
                view === n.id
                  ? 'bg-bloom-500/15 text-bloom-700'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {n.label}
            </button>
          ))}
        </nav>

        <div
          className="hidden items-center gap-2 sm:flex"
          title={`${Math.round(progress * 100)}% of today's habits done`}
        >
          <div className="h-2 w-20 overflow-hidden rounded-full bg-slate-200/70">
            <div
              className="h-full rounded-full bg-bloom-500 transition-all"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

function Shell() {
  const [view, setView] = useState<View>('garden');

  return (
    <div className="min-h-full">
      <Header view={view} setView={setView} />
      <main className="mx-auto max-w-4xl px-4 py-5">
        {view === 'garden' && <Dashboard />}
        {view === 'journal' && <Journal />}
      </main>
      <footer className="mx-auto max-w-4xl px-4 pb-8 pt-2 text-center text-xs text-slate-400">
        Bloom · your data lives only in this browser
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  );
}
