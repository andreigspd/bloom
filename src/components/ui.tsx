import type { ReactNode } from 'react';

export function Card({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-3xl border border-white/70 bg-white/80 p-5 shadow-sm backdrop-blur ${className}`}
    >
      {children}
    </section>
  );
}

export function CardHeader({
  title,
  icon,
  action,
  subtitle,
}: {
  title: string;
  icon?: ReactNode;
  action?: ReactNode;
  subtitle?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div className="flex items-center gap-2.5">
        {icon && <span className="text-xl leading-none">{icon}</span>}
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-slate-800 uppercase">
            {title}
          </h2>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled,
  className = '',
  title,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'ghost' | 'soft' | 'danger';
  size?: 'sm' | 'md';
  type?: 'button' | 'submit';
  disabled?: boolean;
  className?: string;
  title?: string;
}) {
  const base =
    'inline-flex items-center justify-center gap-1.5 rounded-full font-medium transition disabled:opacity-40 disabled:cursor-not-allowed';
  const sizes = { sm: 'px-3 py-1 text-xs', md: 'px-4 py-2 text-sm' };
  const variants = {
    primary: 'bg-bloom-600 text-white hover:bg-bloom-700 shadow-sm',
    ghost: 'text-slate-600 hover:bg-slate-100',
    soft: 'bg-bloom-50 text-bloom-700 hover:bg-bloom-100',
    danger: 'text-rose-600 hover:bg-rose-50',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export function StatPill({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-2xl bg-slate-50 px-3 py-2">
      <span className="text-lg font-bold text-slate-800">{value}</span>
      <span className="text-[10px] font-medium tracking-wide text-slate-500 uppercase">
        {label}
      </span>
    </div>
  );
}

export function EmptyHint({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 px-4 py-6 text-center text-sm text-slate-400">
      {children}
    </p>
  );
}
