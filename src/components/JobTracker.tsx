import { useState } from 'react';
import { useStore } from '../lib/store';
import type { JobApplication, JobStatus } from '../lib/types';
import { uid } from '../lib/id';
import { todayKey } from '../lib/date';
import { Card, CardHeader, Button, EmptyHint } from './ui';

const STATUS_META: Record<JobStatus, { label: string; cls: string; dot: string }> = {
  wishlist: { label: 'Wishlist', cls: 'bg-slate-100 text-slate-600', dot: 'bg-slate-400' },
  applied: { label: 'Applied', cls: 'bg-sky-50 text-sky-700', dot: 'bg-sky-500' },
  interviewing: { label: 'Interviewing', cls: 'bg-violet-50 text-violet-700', dot: 'bg-violet-500' },
  offer: { label: 'Offer', cls: 'bg-bloom-50 text-bloom-700', dot: 'bg-bloom-500' },
  rejected: { label: 'Rejected', cls: 'bg-rose-50 text-rose-700', dot: 'bg-rose-400' },
};

const STATUS_ORDER: JobStatus[] = ['wishlist', 'applied', 'interviewing', 'offer', 'rejected'];

export function JobTracker() {
  const { state, dispatch } = useStore();
  const [adding, setAdding] = useState(false);
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');

  const counts = STATUS_ORDER.reduce(
    (acc, s) => ({ ...acc, [s]: state.jobs.filter((j) => j.status === s).length }),
    {} as Record<JobStatus, number>,
  );

  function add() {
    if (!company.trim() || !role.trim()) return;
    const job: JobApplication = {
      id: uid(),
      company: company.trim(),
      role: role.trim(),
      status: 'wishlist',
      createdAt: todayKey(),
      updatedAt: Date.now(),
    };
    dispatch({ type: 'SAVE_JOB', job });
    setCompany('');
    setRole('');
    setAdding(false);
  }

  function cycleStatus(job: JobApplication) {
    const idx = STATUS_ORDER.indexOf(job.status);
    const next = STATUS_ORDER[(idx + 1) % STATUS_ORDER.length];
    dispatch({ type: 'SAVE_JOB', job: { ...job, status: next, updatedAt: Date.now() } });
  }

  return (
    <Card>
      <CardHeader
        title="Job Search"
        icon="💼"
        subtitle={`${state.jobs.length} tracked · ${counts.offer} offer${counts.offer === 1 ? '' : 's'}`}
        action={
          <Button size="sm" variant="soft" onClick={() => setAdding((v) => !v)}>
            {adding ? 'Close' : '+ Add'}
          </Button>
        }
      />

      {adding && (
        <div className="mb-3 flex flex-col gap-2 rounded-2xl bg-slate-50 p-3">
          <input
            autoFocus
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Company"
            className="rounded-xl border border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-bloom-400"
          />
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Role"
            className="rounded-xl border border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-bloom-400"
            onKeyDown={(e) => e.key === 'Enter' && add()}
          />
          <Button size="sm" onClick={add} disabled={!company.trim() || !role.trim()}>
            Add to pipeline
          </Button>
        </div>
      )}

      {state.jobs.length === 0 ? (
        <EmptyHint>Track companies you’re eyeing, applying to, or interviewing with.</EmptyHint>
      ) : (
        <ul className="space-y-2">
          {[...state.jobs]
            .sort(
              (a, b) =>
                STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status) ||
                b.updatedAt - a.updatedAt,
            )
            .map((job) => {
              const meta = STATUS_META[job.status];
              return (
                <li
                  key={job.id}
                  className="group flex items-center gap-3 rounded-2xl border border-slate-100 px-3 py-2.5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-800">{job.company}</p>
                    <p className="truncate text-xs text-slate-400">{job.role}</p>
                  </div>
                  <button
                    onClick={() => cycleStatus(job)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${meta.cls}`}
                    title="Click to advance status"
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                    {meta.label}
                  </button>
                  <button
                    onClick={() => dispatch({ type: 'DELETE_JOB', id: job.id })}
                    className="text-xs text-slate-300 opacity-0 transition group-hover:opacity-100 hover:text-rose-500"
                    title="Remove"
                  >
                    ✕
                  </button>
                </li>
              );
            })}
        </ul>
      )}
    </Card>
  );
}
