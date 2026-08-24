"use client";

import { useDemoActivity, type DemoScope } from "../demo-backend";

const titles: Record<DemoScope, string> = {
  researcher: "Nhật ký thao tác nghiên cứu",
  reviewer: "Lịch sử phản biện",
  organization: "Hoạt động tổ chức",
  manager: "Nhật ký điều phối hợp tác",
  decision: "Lịch sử quyết định demo",
};

export function DemoActivityPanel({ scope }: { scope: DemoScope }) {
  const activity = useDemoActivity(scope);

  return (
    <section
      data-workspace-view={scope === "researcher" ? "academic" : scope === "reviewer" ? "history" : scope === "organization" ? "activity" : undefined}
      tabIndex={-1}
      className="scroll-mt-24 rounded-2xl border border-card-border bg-card-surface-area p-5 outline-none md:p-6"
    >
      <div className="flex flex-col gap-1 border-b border-card-border pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">{titles[scope]}</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Mock service lưu cục bộ để phục vụ kiểm thử flow; không ghi vào backend nghiệp vụ.</p>
        </div>
        <span className="text-xs font-bold text-blue-700 dark:text-blue-300">{activity.length} sự kiện demo</span>
      </div>
      {activity.length > 0 ? (
        <ul className="divide-y divide-card-border">
          {activity.slice(0, 5).map((item) => (
            <li key={item.id} className="flex gap-3 py-3 text-sm">
              <span aria-hidden="true" className="material-symbols-outlined mt-0.5 text-lg text-blue-600">check_circle</span>
              <div className="min-w-0">
                <strong className="block text-slate-900 dark:text-white">{item.action}</strong>
                <span className="block break-words text-slate-600 dark:text-slate-300">{item.detail}</span>
              </div>
              <time className="ml-auto shrink-0 text-xs text-slate-500" dateTime={item.createdAt}>
                {new Intl.DateTimeFormat("vi-VN", { hour: "2-digit", minute: "2-digit" }).format(new Date(item.createdAt))}
              </time>
            </li>
          ))}
        </ul>
      ) : (
        <p className="py-5 text-sm text-slate-500 dark:text-slate-400">Chưa có thao tác trong phiên demo này. Hãy thử một hành động ở phía trên.</p>
      )}
    </section>
  );
}
