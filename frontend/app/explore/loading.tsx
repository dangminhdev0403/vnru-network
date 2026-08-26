function Bar({ className = "" }: { className?: string }) {
  return <span className={`block rounded-full bg-white/85 ${className}`} />;
}

function ImageIcon() {
  return (
    <span
      className="grid size-11 place-items-center rounded-xl bg-blue-400/30 text-white"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 24 24"
        className="size-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M4 5h16v14H4z" />
        <circle cx="9" cy="10" r="2" />
        <path d="m4 17 4-4 3 3 3-4 6 5" />
      </svg>
    </span>
  );
}

export default function Loading() {
  return (
    <main
      role="status"
      aria-label="Đang tải tin tức"
      className="mx-auto max-w-[1480px] animate-pulse px-4 py-9 motion-reduce:animate-none sm:px-6 lg:px-8"
    >
      <section className="relative min-h-[520px] overflow-hidden rounded-3xl bg-gradient-to-br from-blue-100 via-indigo-100 to-blue-200">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_25%,rgba(255,255,255,.55)_48%,transparent_70%)]" />
        <div className="absolute inset-x-0 bottom-0 p-7 sm:p-10">
          <ImageIcon />
          <span className="mt-6 inline-flex rounded-xl bg-white px-4 py-2 text-xs font-black uppercase text-blue-600">
            Tiêu điểm
          </span>
          <Bar className="mt-5 h-8 w-[78%]" />
          <Bar className="mt-3 h-4 w-[55%]" />
          <div className="mt-6 flex gap-2">
            <Bar className="h-3 w-24" />
            <span className="size-3 rounded-full bg-white/85" />
            <Bar className="h-3 w-20" />
            <span className="size-3 rounded-full bg-white/85" />
            <Bar className="h-3 w-16" />
          </div>
        </div>
        <div className="absolute bottom-7 right-7 flex gap-2">
          <Bar className="h-2 w-8" />
          {Array.from({ length: 4 }, (_, index) => (
            <span key={index} className="size-2 rounded-full bg-white/60" />
          ))}
        </div>
      </section>

      <section className="mt-12">
        <div>
          <h2 className="border-l-4 border-blue-600 pl-3 text-lg font-black uppercase text-slate-950">
            Tin mới nhất
          </h2>
        </div>
        <div className="mt-6 divide-y divide-slate-100">
          {Array.from({ length: 3 }, (_, index) => (
            <article
              key={index}
              className="grid grid-cols-[180px_minmax(0,1fr)] gap-6 py-6 first:pt-0"
            >
              <div className="grid h-28 place-items-center rounded-2xl bg-gradient-to-br from-blue-100 via-indigo-100 to-blue-200">
                <ImageIcon />
              </div>
              <div className="min-w-0">
                <span className="block h-3 w-28 rounded-full bg-blue-100" />
                <span className="mt-4 block h-5 w-[72%] rounded-full bg-slate-200" />
                <span className="mt-3 block h-4 w-[58%] rounded-full bg-slate-100" />
                <div className="mt-5 flex gap-2">
                  <span className="h-3 w-20 rounded-full bg-slate-100" />
                  <span className="size-3 rounded-full bg-slate-100" />
                  <span className="h-3 w-16 rounded-full bg-slate-100" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
      <span className="sr-only">Đang tải dữ liệu…</span>
    </main>
  );
}
