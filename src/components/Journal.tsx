import { useEffect, useMemo, useRef, useState } from 'react';
import { useStore } from '../lib/store';
import type { JournalEntry } from '../lib/types';
import { uid } from '../lib/id';
import { todayKey, formatLong, formatShort } from '../lib/date';
import { Button } from './ui';

function wordCount(text: string): number {
  const t = text.trim();
  return t ? t.split(/\s+/).length : 0;
}

function preview(body: string): string {
  const t = body.trim().replace(/\s+/g, ' ');
  return t.length > 90 ? t.slice(0, 90) + '…' : t || 'Empty entry';
}

export function Journal() {
  const { state, dispatch } = useStore();

  const entries = useMemo(
    () => [...state.journal].sort((a, b) => b.updatedAt - a.updatedAt),
    [state.journal],
  );

  const [selectedId, setSelectedId] = useState<string | null>(entries[0]?.id ?? null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [saved, setSaved] = useState(true);
  const saveTimer = useRef<number | null>(null);

  const selected = entries.find((e) => e.id === selectedId) ?? null;

  // Load selected entry into the editor.
  useEffect(() => {
    if (selected) {
      setTitle(selected.title);
      setBody(selected.body);
      setSaved(true);
    }
  }, [selectedId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Debounced autosave.
  useEffect(() => {
    if (!selected) return;
    if (title === selected.title && body === selected.body) return;
    setSaved(false);
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      const updated: JournalEntry = {
        ...selected,
        title: title.trim() || 'Untitled',
        body,
        updatedAt: Date.now(),
      };
      dispatch({ type: 'SAVE_JOURNAL', entry: updated });
      setSaved(true);
    }, 600);
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, [title, body]); // eslint-disable-line react-hooks/exhaustive-deps

  function newEntry() {
    const now = Date.now();
    const entry: JournalEntry = {
      id: uid(),
      day: todayKey(),
      title: '',
      body: '',
      createdAt: now,
      updatedAt: now,
    };
    dispatch({ type: 'SAVE_JOURNAL', entry });
    setSelectedId(entry.id);
    setTitle('');
    setBody('');
  }

  function deleteEntry(id: string) {
    dispatch({ type: 'DELETE_JOURNAL', id });
    const remaining = entries.filter((e) => e.id !== id);
    setSelectedId(remaining[0]?.id ?? null);
  }

  return (
    <div className="grid h-[calc(100vh-8rem)] grid-cols-1 gap-4 md:grid-cols-[300px_1fr]">
      {/* Entry list */}
      <div className="flex flex-col rounded-3xl border border-white/70 bg-white/80 shadow-sm backdrop-blur">
        <div className="flex items-center justify-between border-b border-slate-100 p-4">
          <h2 className="text-sm font-semibold tracking-wide text-slate-800 uppercase">
            📓 Journal
          </h2>
          <Button size="sm" onClick={newEntry}>
            + New
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {entries.length === 0 ? (
            <p className="p-6 text-center text-sm text-slate-400">
              No entries yet. Start writing your first one.
            </p>
          ) : (
            <ul className="space-y-1">
              {entries.map((e) => (
                <li key={e.id}>
                  <button
                    onClick={() => setSelectedId(e.id)}
                    className={`w-full rounded-2xl px-3 py-2.5 text-left transition ${
                      e.id === selectedId ? 'bg-bloom-50 ring-1 ring-bloom-200' : 'hover:bg-slate-50'
                    }`}
                  >
                    <p className="truncate text-sm font-medium text-slate-800">
                      {e.title || 'Untitled'}
                    </p>
                    <p className="truncate text-xs text-slate-400">{preview(e.body)}</p>
                    <p className="mt-0.5 text-[10px] font-medium tracking-wide text-slate-400 uppercase">
                      {formatShort(e.day)} · {wordCount(e.body)} words
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="flex flex-col rounded-3xl border border-white/70 bg-white/90 shadow-sm backdrop-blur">
        {selected ? (
          <>
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-3">
              <span className="text-xs font-medium text-slate-400">
                {formatLong(selected.day)}
              </span>
              <div className="flex items-center gap-3">
                <span className={`text-xs ${saved ? 'text-bloom-600' : 'text-amber-500'}`}>
                  {saved ? '✓ Saved' : 'Saving…'}
                </span>
                <span className="text-xs text-slate-400">{wordCount(body)} words</span>
                <Button variant="danger" size="sm" onClick={() => deleteEntry(selected.id)}>
                  Delete
                </Button>
              </div>
            </div>
            <div className="flex flex-1 flex-col overflow-y-auto px-6 py-5 md:px-10 md:py-8">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title your entry…"
                className="mb-4 w-full border-none bg-transparent font-serif text-3xl font-bold text-slate-800 outline-none placeholder:text-slate-300"
              />
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Start writing. This space is yours — reflect on the day, draft an essay, or just empty your head…"
                className="min-h-[50vh] flex-1 resize-none border-none bg-transparent font-serif text-lg leading-relaxed text-slate-700 outline-none placeholder:text-slate-300"
              />
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-slate-400">
            <span className="text-4xl">✍️</span>
            <p className="text-sm">Select an entry, or start a new one.</p>
            <Button onClick={newEntry}>+ New entry</Button>
          </div>
        )}
      </div>
    </div>
  );
}
