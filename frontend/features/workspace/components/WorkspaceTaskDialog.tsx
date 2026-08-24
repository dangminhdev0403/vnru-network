"use client";

import React from "react";

type WorkspaceTaskDialogProps = {
  title: string;
  eyebrow?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  tone?: "blue" | "teal" | "purple" | "slate";
};

const toneClass = {
  blue: "text-blue-700 dark:text-blue-300",
  teal: "text-teal-700 dark:text-teal-300",
  purple: "text-purple-700 dark:text-purple-300",
  slate: "text-slate-600 dark:text-slate-300",
};

export function WorkspaceTaskDialog({
  title,
  eyebrow = "UI Preview",
  onClose,
  children,
  footer,
  tone = "blue",
}: WorkspaceTaskDialogProps) {
  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm" onMouseDown={(event) => {
      if (event.currentTarget === event.target) onClose();
    }}>
      <section role="dialog" aria-modal="true" aria-labelledby="workspace-task-dialog-title" className="max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-card-border bg-card-surface-area shadow-2xl">
        <header className="flex items-start justify-between gap-5 border-b border-card-border px-5 py-4 md:px-6">
          <div>
            <p className={`text-xs font-extrabold uppercase tracking-[0.14em] ${toneClass[tone]}`}>{eyebrow}</p>
            <h2 id="workspace-task-dialog-title" className="mt-1 text-xl font-bold text-slate-950 dark:text-white md:text-2xl">{title}</h2>
          </div>
          <button autoFocus type="button" onClick={onClose} aria-label="Đóng hộp thoại" className="grid size-10 shrink-0 place-items-center rounded-lg border border-card-border text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white">
            <span className="material-symbols-outlined" aria-hidden="true">close</span>
          </button>
        </header>
        <div className="px-5 py-5 md:px-6">{children}</div>
        {footer && <footer className="flex flex-wrap justify-end gap-3 border-t border-card-border bg-slate-50/70 px-5 py-4 dark:bg-slate-950/40 md:px-6">{footer}</footer>}
      </section>
    </div>
  );
}
