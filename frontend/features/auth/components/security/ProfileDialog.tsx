"use client";

import { type FormEvent, useMemo, useState } from "react";
import { confirmAction, showError, showToast } from "@/lib/alerts";
import { useProfile } from "@/features/iam/hooks";
import { z } from "zod";
import { getFieldErrors } from "@/lib/form-validation";

const schema = z.object({
  firstName: z.string().trim().max(100, "Tối đa 100 ký tự"),
  lastName: z.string().trim().max(100, "Tối đa 100 ký tự"),
});

export default function ProfileDialog({
  onClose,
  locale,
}: {
  onClose: () => void;
  locale: "vi" | "en" | "ru";
}) {
  const state = useProfile();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const labels = useMemo(
    () =>
      locale === "vi"
        ? ["Hồ sơ cá nhân", "Tên", "Họ", "Hủy", "Lưu thay đổi", "Email", "Không thể tải hồ sơ", "Đang cập nhật hồ sơ…", "Không thể cập nhật hồ sơ"]
        : locale === "ru"
          ? ["Личный профиль", "Имя", "Фамилия", "Отмена", "Сохранить", "Email", "Не удалось загрузить профиль", "Обновление профиля…", "Не удалось обновить профиль"]
          : ["Personal profile", "First name", "Last name", "Cancel", "Save changes", "Email", "Unable to load profile", "Updating profile…", "Unable to update profile"],
    [locale],
  );

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const parsed = schema.safeParse({ firstName: form.get("firstName"), lastName: form.get("lastName") });
    if (!parsed.success) return setErrors(getFieldErrors(parsed.error));
    setErrors({});
    if (!(await confirmAction({ title: labels[4] + "?" })).isConfirmed) return;
    try {
      await state.updateProfile.mutateAsync({
        ...parsed.data,
      });
      showToast({ title: labels[0], icon: "success" });
      onClose();
    } catch {
      showError(labels[0], labels[8]);
    }
  }

  const profile = state.profile.data;
  const loading = state.profile.isPending || state.updateProfile.isPending;
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="profile-dialog-title" className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 p-4 backdrop-blur-sm">
      <form key={profile?.email} noValidate onSubmit={save} className="w-full max-w-lg space-y-5 rounded-2xl border border-card-border bg-card-background p-6 shadow-xl">
        <h2 id="profile-dialog-title" className="text-xl font-bold text-text-primary">{labels[0]}</h2>
        {state.profile.isError ? <p role="alert" className="text-sm text-red-700">{labels[6]}</p> : null}
        {state.profile.isFetching && profile ? <p role="status" className="text-sm text-blue-700">{labels[7]}</p> : null}
        <label className="block space-y-2 text-sm font-semibold text-text-primary">
          {labels[5]}
          <input type="email" readOnly value={profile?.email ?? ""} aria-readonly="true" className="min-h-11 w-full cursor-text rounded-xl border border-card-border bg-card-surface-area px-3 font-normal text-text-secondary" />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm font-semibold text-text-primary">{labels[1]}<input name="firstName" disabled={!profile || loading} defaultValue={profile?.firstName ?? ""} aria-invalid={Boolean(errors.firstName)} aria-describedby={errors.firstName ? "profile-first-name-error" : undefined} className="min-h-11 w-full rounded-xl border border-card-border bg-card-background px-3 font-normal outline-none focus:border-blue-600 aria-invalid:border-rose-500" />{errors.firstName && <span id="profile-first-name-error" role="alert" className="block text-xs text-rose-600 dark:text-rose-300">{errors.firstName}</span>}</label>
          <label className="space-y-2 text-sm font-semibold text-text-primary">{labels[2]}<input name="lastName" disabled={!profile || loading} defaultValue={profile?.lastName ?? ""} aria-invalid={Boolean(errors.lastName)} aria-describedby={errors.lastName ? "profile-last-name-error" : undefined} className="min-h-11 w-full rounded-xl border border-card-border bg-card-background px-3 font-normal outline-none focus:border-blue-600 aria-invalid:border-rose-500" />{errors.lastName && <span id="profile-last-name-error" role="alert" className="block text-xs text-rose-600 dark:text-rose-300">{errors.lastName}</span>}</label>
        </div>
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="min-h-11 rounded-xl border border-card-border px-4 text-sm font-semibold text-text-primary">{labels[3]}</button>
          <button type="submit" disabled={!profile || loading} aria-busy={loading} className="min-h-11 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">{labels[4]}</button>
        </div>
      </form>
    </div>
  );
}
