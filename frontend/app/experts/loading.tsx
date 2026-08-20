export default function Loading() {
  return (
    <div className="mx-auto max-w-[1580px] animate-pulse px-4 py-7 sm:px-6 lg:px-8 lg:py-8">
      <div className="h-10 w-48 rounded-xl bg-slate-200" />
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_auto_auto_auto_auto_auto]">
        <div className="h-11 rounded-xl bg-slate-200" />
        <div className="h-11 w-28 rounded-xl bg-slate-200" />
        <div className="h-11 w-28 rounded-xl bg-slate-200" />
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-40 rounded-2xl bg-slate-200" />
        ))}
      </div>
    </div>
  );
}
