"use client";

import { useState } from "react";
import { useLocale, type Locale } from "@/core/i18n/locale";
import { useProfile } from "@/features/iam/hooks";
import ProfileDialog from "../security/ProfileDialog";

const copy: Record<Locale, { kicker: string; title: string; description: string; email: string; name: string; edit: string; unavailable: string }> = {
  vi: { kicker: "Tài khoản", title: "Hồ sơ cá nhân", description: "Xem và cập nhật thông tin tài khoản gắn với danh tính đăng nhập của bạn.", email: "Email", name: "Họ và tên", edit: "Chỉnh sửa hồ sơ", unavailable: "Không thể tải hồ sơ lúc này." },
  en: { kicker: "Account", title: "Personal profile", description: "Review and update the account details linked to your sign-in identity.", email: "Email", name: "Name", edit: "Edit profile", unavailable: "Your profile is unavailable right now." },
  ru: { kicker: "Учётная запись", title: "Личный профиль", description: "Просматривайте и обновляйте данные учётной записи, связанные с вашей идентификацией.", email: "Email", name: "Имя", edit: "Изменить профиль", unavailable: "Сейчас профиль недоступен." },
};

export default function AccountClientPage() {
  const { locale } = useLocale();
  const t = copy[locale] ?? copy.vi;
  const profile = useProfile();
  const [editing, setEditing] = useState(false);
  const fullName = [profile.profile.data?.firstName, profile.profile.data?.lastName].filter(Boolean).join(" ") || "—";

  return (
    <main className="mx-auto w-full max-w-5xl space-y-6 p-4 sm:p-6 lg:p-8">
      <header>
        <p className="text-xs font-bold uppercase tracking-[.12em] text-[var(--accent-primary)]">{t.kicker}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-text-primary">{t.title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">{t.description}</p>
      </header>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-soft)] sm:p-6" aria-labelledby="account-details-title">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div className="min-w-0 space-y-4">
            <h2 id="account-details-title" className="sr-only">{t.title}</h2>
            {profile.profile.isError ? <p role="alert" className="text-sm text-rose-700 dark:text-rose-300">{t.unavailable}</p> : null}
            <div>
              <p className="text-xs font-bold uppercase tracking-[.1em] text-text-secondary">{t.name}</p>
              <p className="mt-1 break-words text-base font-semibold text-text-primary">{fullName}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[.1em] text-text-secondary">{t.email}</p>
              <p className="mt-1 break-all text-base text-text-primary">{profile.profile.data?.email ?? "—"}</p>
            </div>
          </div>
          <button type="button" onClick={() => setEditing(true)} disabled={!profile.profile.data} className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-primary)] px-5 text-sm font-semibold text-white hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60">
            {t.edit}
          </button>
        </div>
      </section>

      {editing ? <ProfileDialog locale={locale} onClose={() => setEditing(false)} /> : null}
    </main>
  );
}
