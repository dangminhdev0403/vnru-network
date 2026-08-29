"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Locale = "vi" | "en" | "ru";

export const useLocale = create<{
  locale: Locale;
  setLocale: (locale: Locale) => void;
}>()(
  persist(
    (set) => ({
      locale: "vi",
      setLocale: (locale) => {
        document.cookie = `vnru_locale=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`;
        document.documentElement.lang = locale;
        set({ locale });
      },
    }),
    { name: "vnru-locale" },
  ),
);
