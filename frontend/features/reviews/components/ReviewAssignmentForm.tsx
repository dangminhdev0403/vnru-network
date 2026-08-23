"use client";

import { useState } from "react";
import { useCurrentUser } from "@/features/auth/server-state";
import { useCreateReviewAssignment } from "../hooks";
import { confirmAction, showError, showSuccess } from "@/lib/alerts";
import { useLocale, type Locale } from "@/app/HomeMotion";

const copy: Record<Locale, { open: string; confirm: string; success: string; error: string; requestFailed: string; creating: string; create: string; fields: Record<string, string> }> = {
  vi: { open: "Tạo phân công", confirm: "Xác nhận tạo phân công?", success: "Đã tạo phân công", error: "Không thể tạo phân công", requestFailed: "Yêu cầu thất bại", creating: "Đang tạo…", create: "Tạo phân công", fields: { proposalRef: "Mã đề xuất", reviewerId: "Mã người phản biện", boardRef: "Mã hội đồng" } },
  en: { open: "Create assignment", confirm: "Create this assignment?", success: "Assignment created", error: "Failed to create assignment", requestFailed: "Request failed", creating: "Creating…", create: "Create assignment", fields: { proposalRef: "Proposal reference", reviewerId: "Reviewer ID", boardRef: "Board reference" } },
  ru: { open: "Создать назначение", confirm: "Создать назначение?", success: "Назначение создано", error: "Не удалось создать назначение", requestFailed: "Запрос не выполнен", creating: "Создание…", create: "Создать назначение", fields: { proposalRef: "Код заявки", reviewerId: "Код рецензента", boardRef: "Код совета" } },
};

const initial = {
  proposalRef: "",
  reviewerId: "",
  boardRef: "",
};

export function ReviewAssignmentForm({ onCreated }: { onCreated: () => void | Promise<unknown> }) {
  const { locale } = useLocale();
  const t = copy[locale] ?? copy.vi;
  const { data: user } = useCurrentUser();
  const canManage = ((user as { capabilities?: string[] })?.capabilities ?? []).includes("reviews.assignments.manage");
  const { createAssignment, isPending } = useCreateReviewAssignment();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initial);
  if (!canManage) return null;

  return <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
    <button type="button" onClick={() => setOpen(!open)} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white">
      {t.open}
    </button>
    {open && <form className="mt-4 grid gap-3" onSubmit={async (event) => {
      event.preventDefault();
      if (!(await confirmAction({ title: t.confirm })).isConfirmed) return;
      try {
        await createAssignment({ proposalRef: form.proposalRef.trim(), reviewerId: form.reviewerId.trim(), boardRef: form.boardRef.trim() });
        setForm(initial);
        setOpen(false);
        await onCreated();
        await showSuccess(t.success);
      } catch (error) {
        await showError(t.error, error instanceof Error ? error.message : t.requestFailed);
      }
    }}>
      {(["proposalRef", "reviewerId", "boardRef"] as const).map((field) =>
        <label key={field} className="text-xs font-bold text-text-primary">{t.fields[field]}
          <input id={`assignment-${field}`} name={field} required value={form[field]} onChange={(event) => setForm({ ...form, [field]: event.target.value })} className="mt-1 block w-full rounded-lg border border-[var(--border)] bg-[var(--surface-secondary)] p-2 font-normal" />
        </label>
      )}
      <button type="submit" disabled={isPending} aria-busy={isPending} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50">
        {isPending ? t.creating : t.create}
      </button>
    </form>}
  </section>;
}
