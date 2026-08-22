"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { showError, showToast } from "@/lib/alerts";
import { useMfa } from "@/features/iam/hooks";
import { ApiError } from "@/features/iam/repository";

const copy = {
  vi: {
    on: "Đã bật",
    off: "Chưa bật",
    enable: "Bật MFA",
    disable: "Tắt MFA",
    confirm: "Tắt xác thực hai yếu tố?",
    warning: "Tài khoản sẽ chỉ còn được bảo vệ bằng mật khẩu.",
    cancel: "Hủy",
    done: "Đã tắt 2FA",
  },
  en: {
    on: "Enabled",
    off: "Not enabled",
    enable: "Enable 2FA",
    disable: "Disable 2FA",
    confirm: "Disable two-factor authentication?",
    warning: "Your account will only be protected by its password.",
    cancel: "Cancel",
    done: "2FA disabled",
  },
  ru: {
    on: "Включена",
    off: "Не включена",
    enable: "Включить 2FA",
    disable: "Отключить 2FA",
    confirm: "Отключить двухфакторную аутентификацию?",
    warning: "Аккаунт останется защищён только паролем.",
    cancel: "Отмена",
    done: "2FA отключена",
  },
};

export default function MfaControl({ locale }: { locale: "vi" | "en" | "ru" }) {
  const router = useRouter();
  const t = copy[locale];
  const state = useMfa();
  const enabled = state.mfa.data?.enabled ?? null;
  const [confirming, setConfirming] = useState(false);
  const loading = state.mfa.isPending || state.disableMfa.isPending;

  async function disable() {
    try {
      await state.disableMfa.mutateAsync();
      setConfirming(false);
      showToast({ title: t.done, icon: "success" });
    } catch (error) {
      if (error instanceof ApiError && error.status === 403) {
        router.push("/api/auth/login?prompt=login&returnTo=/workspace/iam/security");
        return;
      }
      showError("2FA", "Unable to disable MFA");
    }
  }

  return (
    <>
      <div className="flex shrink-0 items-center gap-3">
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${enabled ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200" : "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200"}`}
        >
          {enabled === null ? "…" : enabled ? t.on : t.off}
        </span>
        {enabled ? (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="min-h-11 rounded-xl border border-red-300 px-4 text-sm font-semibold text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950/40"
          >
            {t.disable}
          </button>
        ) : (
          <Link
            href="/api/auth/login?action=CONFIGURE_TOTP&returnTo=/workspace/iam/security"
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700"
          >
            {t.enable}
          </Link>
        )}
      </div>
      {confirming && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="disable-mfa-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 p-4 backdrop-blur-sm"
        >
          <div className="w-full max-w-md space-y-4 rounded-2xl border border-card-border bg-card-background p-6 shadow-xl">
            <h2
              id="disable-mfa-title"
              className="text-xl font-bold text-text-primary"
            >
              {t.confirm}
            </h2>
            <p className="text-sm text-text-secondary">{t.warning}</p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="min-h-11 rounded-xl border border-card-border px-4 text-sm font-semibold text-text-primary"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={disable}
                className="min-h-11 rounded-xl bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {t.disable}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
