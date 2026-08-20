export default function Loading() {
  return (
    <div className="mx-auto max-w-[1280px] animate-pulse px-4 py-8 sm:px-6 lg:px-8">
      <div className="h-10 w-72 rounded-xl bg-surface-container-high" />
      <div className="mt-3 h-5 w-96 rounded-lg bg-surface-container" />
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_auto]">
        <div className="h-11 rounded-xl bg-surface-container" />
        <div className="h-11 w-24 rounded-xl bg-surface-container-high" />
      </div>
      <div className="mt-6 space-y-4">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="space-y-2 py-4">
            <div className="h-4 w-3/4 rounded bg-surface-container" />
            <div className="h-3 w-1/2 rounded bg-surface-container" />
          </div>
        ))}
      </div>
    </div>
  );
}
