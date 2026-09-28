import { useState } from 'react';
import { todayKey } from '../lib/date';
import { quoteByOffset } from '../lib/quotes';

/**
 * A quiet, serif "quote of the day" from Tony Robbins' Unlimited Power.
 * Deterministic per day (same quote all day); the shuffle button cycles to
 * another without changing the day.
 */
export function QuoteOfTheDay() {
  const day = todayKey();
  const [offset, setOffset] = useState(0);
  const quote = quoteByOffset(day, offset);

  return (
    <div className="rounded-3xl border border-bloom-200/60 bg-bloom-50/40 px-6 py-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="mb-2 text-[10px] font-semibold tracking-[0.15em] text-bloom-700/70 uppercase">
            Quote of the day
          </p>
          <blockquote className="font-serif text-lg leading-relaxed text-slate-700">
            “{quote.text}”
          </blockquote>
          <p className="mt-2 text-xs font-medium text-slate-500">
            — Tony Robbins, <span className="italic">{quote.source}</span>
          </p>
        </div>

        <button
          onClick={() => setOffset((o) => o + 1)}
          title="Show another quote"
          aria-label="Show another quote"
          className="mt-1 shrink-0 rounded-full border border-bloom-200/70 p-2 text-bloom-700 transition hover:bg-bloom-500/10"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path
              d="M4 4v5h5M20 20v-5h-5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M20 9a8 8 0 0 0-14.5-3M4 15a8 8 0 0 0 14.5 3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
