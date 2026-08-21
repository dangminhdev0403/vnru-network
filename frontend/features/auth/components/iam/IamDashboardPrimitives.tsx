import type { ReactNode } from "react";

type Tone = "blue" | "cyan" | "emerald" | "amber" | "rose" | "violet" | "slate";

const iconToneClasses: Record<Tone, string> = {
  blue: "bg-blue-50 text-blue-700 ring-blue-100",
  cyan: "bg-cyan-50 text-cyan-700 ring-cyan-100",
  emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  amber: "bg-amber-50 text-amber-700 ring-amber-100",
  rose: "bg-rose-50 text-rose-700 ring-rose-100",
  violet: "bg-violet-50 text-violet-700 ring-violet-100",
  slate: "bg-slate-100 text-slate-700 ring-slate-200",
};

const statusToneClasses: Record<Tone, string> = {
  blue: "border-blue-100 bg-blue-50 text-blue-700",
  cyan: "border-cyan-100 bg-cyan-50 text-cyan-700",
  emerald: "border-emerald-100 bg-emerald-50 text-emerald-700",
  amber: "border-amber-100 bg-amber-50 text-amber-800",
  rose: "border-rose-100 bg-rose-50 text-rose-700",
  violet: "border-violet-100 bg-violet-50 text-violet-700",
  slate: "border-slate-200 bg-slate-100 text-slate-700",
};

export function MetricCard({
  icon,
  label,
  value,
  note,
  tone = "blue",
}: Readonly<{
  icon: string;
  label: string;
  value: string;
  note: string;
  tone?: Tone;
}>) {
  return (
    <article className="rounded-[22px] border border-slate-200/90 bg-white p-4 shadow-[0_10px_30px_rgba(31,53,85,.05)] sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-slate-500">{label}</p>
          <strong className="mt-2 block text-2xl font-black tracking-[-0.04em] text-slate-950">{value}</strong>
        </div>
        <span className={`material-symbols-outlined grid h-11 w-11 place-items-center rounded-2xl ring-1 ${iconToneClasses[tone]}`} aria-hidden="true">
          {icon}
        </span>
      </div>
      <p className="mt-3 text-[11px] font-semibold leading-5 text-slate-500">{note}</p>
    </article>
  );
}

export function SectionCard({
  title,
  description,
  icon,
  action,
  children,
  className = "",
}: Readonly<{
  title: string;
  description?: string;
  icon?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}>) {
  return (
    <section className={`overflow-hidden rounded-[24px] border border-slate-200/90 bg-white shadow-[0_12px_36px_rgba(29,57,95,.05)] ${className}`}>
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200/80 px-4 py-4 sm:px-5">
        <div className="flex min-w-0 items-start gap-3">
          {icon ? (
            <span className="material-symbols-outlined mt-0.5 text-xl text-blue-600" aria-hidden="true">
              {icon}
            </span>
          ) : null}
          <div className="min-w-0">
            <h2 className="text-sm font-black tracking-[-0.01em] text-slate-950 sm:text-base">{title}</h2>
            {description ? <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p> : null}
          </div>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function StatusBadge({
  children,
  tone = "slate",
}: Readonly<{
  children: ReactNode;
  tone?: Tone;
}>) {
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-black ${statusToneClasses[tone]}`}>{children}</span>;
}

export function TableFrame({ children }: Readonly<{ children: ReactNode }>) {
  return <div className="overflow-x-auto">{children}</div>;
}

export const tableClassName = "w-full min-w-[760px] border-collapse text-left";
export const tableHeadClassName = "border-b border-slate-200 bg-slate-50/80 text-[10px] font-black uppercase tracking-[0.08em] text-slate-500";
export const tableHeadCellClassName = "px-4 py-3 whitespace-nowrap";
export const tableCellClassName = "border-b border-slate-100 px-4 py-3 text-xs text-slate-600 align-middle";

export function PreviewTag({ children = "UI preview · dữ liệu minh hoạ" }: Readonly<{ children?: ReactNode }>) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-amber-800">
      <span className="material-symbols-outlined text-sm" aria-hidden="true">visibility</span>
      {children}
    </span>
  );
}
