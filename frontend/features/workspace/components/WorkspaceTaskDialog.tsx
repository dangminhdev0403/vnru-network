"use client";

import React from "react";
import { Dialog, Heading, Modal, ModalOverlay } from "react-aria-components";

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
  return (
    <ModalOverlay
      isOpen
      isDismissable
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm transition-opacity duration-200 data-entering:opacity-0 data-exiting:opacity-0 motion-reduce:transition-none"
    >
      <Modal className="max-h-[88vh] w-full max-w-3xl overflow-hidden rounded-2xl border border-card-border bg-card-surface-area shadow-2xl outline-none transition duration-200 data-entering:translate-y-3 data-entering:opacity-0 data-exiting:translate-y-2 data-exiting:opacity-0 motion-reduce:transition-none">
        <Dialog className="flex max-h-[88vh] flex-col outline-none">
          <header className="flex shrink-0 items-start justify-between gap-5 border-b border-card-border px-5 py-4 md:px-6">
            <div>
              <p className={`text-xs font-extrabold uppercase tracking-[0.14em] ${toneClass[tone]}`}>{eyebrow}</p>
              <Heading slot="title" className="mt-1 text-xl font-bold text-slate-950 dark:text-white md:text-2xl">{title}</Heading>
            </div>
            <button type="button" onClick={onClose} aria-label="Đóng hộp thoại" className="grid size-10 shrink-0 place-items-center rounded-lg border border-card-border text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:bg-slate-800 dark:hover:text-white">
              <span className="material-symbols-outlined" aria-hidden="true">close</span>
            </button>
          </header>
          <div className="min-h-0 overflow-y-auto px-5 py-5 md:px-6">{children}</div>
          {footer && <footer className="flex shrink-0 flex-wrap justify-end gap-3 border-t border-card-border bg-slate-50/70 px-5 py-4 dark:bg-slate-950/40 md:px-6">{footer}</footer>}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
