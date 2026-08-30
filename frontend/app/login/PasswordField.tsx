"use client";

import { useState } from "react";

type PasswordFieldProps = Readonly<{
  placeholder: string;
  showLabel: string;
  hideLabel: string;
  disabled?: boolean;
}>;

export function PasswordField({
  placeholder,
  showLabel,
  hideLabel,
  disabled = false,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <span className="relative mt-2 block">
      <svg
        viewBox="0 0 24 24"
        className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-500"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <rect x="5" y="10" width="14" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </svg>
      <input
        id="login-password"
        name="password"
        type={visible ? "text" : "password"}
        autoComplete="current-password"
        required
        readOnly={disabled}
        placeholder={placeholder}
        className="min-h-13 w-full rounded-xl border border-slate-300 bg-white py-3 pr-14 pl-12 text-base transition placeholder:text-slate-400 focus:border-blue-700 focus-visible:outline-none read-only:bg-slate-50 read-only:text-slate-500"
      />
      <button
        type="button"
        disabled={disabled}
        aria-label={visible ? hideLabel : showLabel}
        aria-pressed={visible}
        onClick={() => setVisible((current) => !current)}
        className="absolute right-1 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-lg text-slate-500 transition-colors hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-blue-700 disabled:pointer-events-none disabled:opacity-50"
      >
        {visible ? (
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M3 3l18 18" />
            <path d="M10.6 10.7a2 2 0 0 0 2.7 2.7" />
            <path d="M9.9 4.3A10.8 10.8 0 0 1 12 4c5.5 0 9 5.5 9 5.5a14.7 14.7 0 0 1-2.1 2.7M6.6 6.6C4.3 8.1 3 10.5 3 10.5S6.5 16 12 16c1 0 1.9-.2 2.8-.5" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M3 12s3.5-5.5 9-5.5 9 5.5 9 5.5-3.5 5.5-9 5.5S3 12 3 12Z" />
            <circle cx="12" cy="12" r="2.5" />
          </svg>
        )}
      </button>
    </span>
  );
}
