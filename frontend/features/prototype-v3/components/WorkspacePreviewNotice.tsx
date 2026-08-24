type WorkspacePreviewNoticeProps = {
  scope: string;
};

export function WorkspacePreviewNotice({ scope }: WorkspacePreviewNoticeProps) {
  return (
    <aside
      aria-label="Thông báo dữ liệu minh họa"
      className="relative overflow-hidden rounded-2xl border border-blue-200/80 bg-blue-50/80 px-4 py-3 text-blue-950 shadow-xs dark:border-blue-800/70 dark:bg-blue-950/35 dark:text-blue-100 md:px-5"
    >
      <div aria-hidden="true" className="absolute inset-y-0 left-0 w-1 bg-blue-600" />
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="flex min-w-0 items-start gap-3">
          <span
            aria-hidden="true"
            className="mt-1.5 size-2 shrink-0 rounded-full bg-blue-500 shadow-[0_0_0_4px_rgba(59,130,246,0.14)]"
          />
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-blue-700 dark:text-blue-300">
              Dữ liệu minh họa · UI Preview
            </p>
            <p className="mt-0.5 text-sm leading-6 text-slate-700 dark:text-slate-300">
              Các thao tác trong <strong className="font-bold text-slate-900 dark:text-white">{scope}</strong> chỉ cập nhật giao diện cục bộ, chưa gửi hoặc ghi dữ liệu lên backend.
            </p>
          </div>
        </div>
        <span className="w-fit shrink-0 rounded-full border border-blue-200 bg-white/80 px-3 py-1 text-xs font-bold text-blue-800 dark:border-blue-800 dark:bg-slate-950/50 dark:text-blue-200">
          Chế độ xem trước
        </span>
      </div>
    </aside>
  );
}
