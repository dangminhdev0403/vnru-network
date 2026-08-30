"use client";

import { FormEvent, useState } from "react";
import { PasswordField } from "./PasswordField";

export type LoginFormCopy = {
  account: string;
  accountPlaceholder: string;
  password: string;
  passwordPlaceholder: string;
  showPassword: string;
  hidePassword: string;
  submit: string;
  submitting: string;
  error?: string;
};

export function LoginForm({
  destination,
  error,
  initialAccount = "",
  t,
}: Readonly<{
  destination: string;
  error?: string;
  initialAccount?: string;
  t: LoginFormCopy;
}>) {
  const [account, setAccount] = useState(initialAccount);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (isSubmitting) {
      event.preventDefault();
      return;
    }
    setIsSubmitting(true);
  }

  return (
    <>
      {error && (
        <p
          role="alert"
          className="mt-3 text-sm font-semibold text-rose-600"
        >
          {t.error || error}
        </p>
      )}

      <form
        action="/api/auth/login"
        method="post"
        onSubmit={handleSubmit}
        className="mt-5 space-y-5"
      >
        <input type="hidden" name="returnTo" value={destination} />
        <label className="block text-base font-bold text-slate-800">
          {t.account}
          <span className="relative mt-2 block">
            <svg
              viewBox="0 0 24 24"
              className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
            </svg>
            <input
              name="account"
              type="text"
              autoComplete="username"
              required
              autoFocus={!initialAccount}
              disabled={isSubmitting}
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              placeholder={t.accountPlaceholder}
              className="min-h-13 w-full rounded-xl border border-slate-300 bg-white py-3 pr-4 pl-12 text-base transition placeholder:text-slate-400 focus:border-blue-700 focus-visible:outline-none disabled:bg-slate-50 disabled:text-slate-500"
            />
          </span>
        </label>
        <div>
          <label
            htmlFor="login-password"
            className="block text-base font-bold text-slate-800"
          >
            {t.password}
          </label>
          <PasswordField
            placeholder={t.passwordPlaceholder}
            showLabel={t.showPassword}
            hideLabel={t.hidePassword}
            disabled={isSubmitting}
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex min-h-13 w-full items-center justify-center gap-2.5 rounded-xl bg-blue-700 px-5 text-base font-bold text-white shadow-[0_16px_34px_-16px_rgba(37,99,235,.9)] transition hover:bg-blue-800 active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-wait disabled:opacity-75"
        >
          {isSubmitting ? (
            <>
              <svg
                className="size-5 animate-spin motion-reduce:animate-none text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>{t.submitting}</span>
            </>
          ) : (
            <>
              <span>{t.submit}</span>
              <span aria-hidden="true">→</span>
            </>
          )}
        </button>
      </form>
    </>
  );
}
