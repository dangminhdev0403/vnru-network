"use client";

import { type FormEvent, useMemo } from "react";
import { showError, showToast } from "@/lib/alerts";
import { useProfile } from "@/features/iam/hooks";

export default function ProfileDialog({
  onClose,
  locale,
}: {
  onClose: () => void;
  locale: "vi" | "en" | "ru";
}) {
  const state = useProfile();
  const labels = useMemo(
    () =>
      locale === "vi"
        ? ["Hồ sơ cá nhân", "Tên", "Họ", "Hủy", "Lưu thay đổi", "Email"]
        : locale === "ru"
          ? ["Личный профиль", "Имя", "Фамилия", "Отмена", "Сохранить", "Email"]
          : ["Personal profile", "First name", "Last name", "Cancel", "Save changes", "Email"],
    [locale],
  );

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      await state.updateProfile.mutateAsync({
        firstName: String(form.get("firstName") ?? ""),
        lastName: String(form.get("lastName") ?? ""),
      });
      showToast({ title: labels[0], icon: "success" });
      onClose();
    } catch {
      showError(labels[0], "Unable to update profile");
    }
  }

  const profile = state.profile.data;
  const loading = state.profile.isPending || state.updateProfile.isPending;
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="profile-dialog-title" className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 p-4 backdrop-blur-sm">
      <form key={profile?.email} onSubmit={save} className="w-full max-w-lg space-y-5 rounded-2xl border border-card-border bg-card-background p-6 shadow-xl">
        <h2 id="profile-dialog-title" className="text-xl font-bold text-text-primary">{labels[0]}</h2>
        {state.profile.isError ? <p role="alert" className="text-sm text-red-700">Unable to load profile</p> : null}
        {state.profile.isFetching && profile ? <p role="status" className="text-sm text-blue-700">Updating profile…</p> : null}
        <label className="block space-y-2 text-sm font-semibold text-text-primary">
          {labels[5]}
          <input type="email" readOnly value={profile?.email ?? ""} aria-readonly="true" className="min-h-11 w-full cursor-text rounded-xl border border-card-border bg-card-surface-area px-3 font-normal text-text-secondary" />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm font-semibold text-text-primary">{labels[1]}<input name="firstName" disabled={!profile || loading} defaultValue={profile?.firstName ?? ""} maxLength={100} className="min-h-11 w-full rounded-xl border border-card-border bg-card-background px-3 font-normal outline-none focus:border-blue-600" /></label>
          <label className="space-y-2 text-sm font-semibold text-text-primary">{labels[2]}<input name="lastName" disabled={!profile || loading} defaultValue={profile?.lastName ?? ""} maxLength={100} className="min-h-11 w-full rounded-xl border border-card-border bg-card-background px-3 font-normal outline-none focus:border-blue-600" /></label>
        </div>
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="min-h-11 rounded-xl border border-card-border px-4 text-sm font-semibold text-text-primary">{labels[3]}</button>
          <button type="submit" disabled={!profile || loading} className="min-h-11 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">{labels[4]}</button>
        </div>
      </form>
    </div>
  );
}
