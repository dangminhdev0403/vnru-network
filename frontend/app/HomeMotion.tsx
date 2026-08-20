"use client";

import i18n from "i18next";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { initReactI18next } from "react-i18next";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import translations from "./home-translations.json";

type Locale = "vi" | "en" | "ru";

const resources = Object.fromEntries(Object.entries(translations).map(([locale, translation]) => [locale, { translation }]));
if (!i18n.isInitialized) void i18n.use(initReactI18next).init({ resources, lng: "vi", fallbackLng: "vi", interpolation: { escapeValue: false } });

const useLocale = create<{ locale: Locale; setLocale: (locale: Locale) => void }>()(persist((set) => ({ locale: "vi", setLocale: (locale) => set({ locale }) }), { name: "vnru-locale" }));

export function HomeMotion({ body, isAuthenticated }: { body: string; isAuthenticated: boolean }) {
  const { locale, setLocale } = useLocale();
  const shouldReduceMotion = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const originals = useRef(new Map<Text, string>());
  const [switcherSlot, setSwitcherSlot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!root.current) return;
    const walker = document.createTreeWalker(root.current, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode() as Text | null; node; node = walker.nextNode() as Text | null) {
      const original = originals.current.get(node) ?? node.data;
      originals.current.set(node, original);
      const key = original.trim();
      if (key) node.data = original.replace(key, i18n.getResource(locale, "translation", key) ?? key);
    }
    document.documentElement.lang = locale;
    void i18n.changeLanguage(locale);
  }, [locale]);

  useEffect(() => {
    if (!isAuthenticated || !root.current) return;
    const control = root.current.querySelector<HTMLAnchorElement>('a[href="/login"]');
    if (!control) return;
    control.textContent = locale === "ru" ? "Выйти →" : locale === "en" ? "Sign out →" : "Đăng xuất →";
    control.href = "#logout";
    control.onclick = async (event) => {
      event.preventDefault();
      const response = await fetch("/api/auth/logout", { method: "POST" });
      const { logoutUrl } = await response.json() as { logoutUrl?: string };
      window.location.assign(logoutUrl || "/");
    };
    return () => { control.onclick = null; };
  }, [isAuthenticated, locale]);

  return <>
    {switcherSlot && createPortal(<div className="language-switcher" role="group" aria-label="Ngôn ngữ / Language / Язык">
      {(["vi", "en", "ru"] as const).map((value) => <button key={value} type="button" aria-pressed={locale === value} onClick={() => setLocale(value)}>{value.toUpperCase()}</button>)}
    </div>, switcherSlot)}
    <motion.div
      ref={(node) => { root.current = node; if (node && !switcherSlot) setSwitcherSlot(node.querySelector<HTMLElement>("#language-switcher-slot")); }}
      initial={shouldReduceMotion ? { opacity: 0 } : { filter: "blur(10px)", opacity: 0, y: 20 }}
      animate={shouldReduceMotion ? { opacity: 1 } : { filter: "blur(0px)", opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0.2 : 0.8, ease: "easeOut" }}
      dangerouslySetInnerHTML={{ __html: body }}
    />
  </>;
}
