import type { Locale } from "@/core/i18n/locale";

const roleLabels: Record<Locale, Record<string, string>> = {
  vi: {
    READER: "Bạn đọc",
    PORTAL_MEMBER: "Thành viên Portal",
    SYSTEM_ADMIN: "Quản trị hệ thống",
  },
  en: {
    READER: "Reader",
    PORTAL_MEMBER: "Portal Member",
    SYSTEM_ADMIN: "System Administrator",
  },
  ru: {
    READER: "Читатель",
    PORTAL_MEMBER: "Участник портала",
    SYSTEM_ADMIN: "Системный администратор",
  },
};

export function formatRoleName(name: string, locale: Locale): string {
  const normalized = name.trim().toUpperCase();
  const knownLabel = roleLabels[locale][normalized];
  if (knownLabel) return knownLabel;

  const words = normalized.split(/[\s_-]+/).filter(Boolean);
  const visibleWords = words[0] === "CUSTOM" ? words.slice(1) : words;

  return (visibleWords.length ? visibleWords : words)
    .map((word) => `${word.charAt(0)}${word.slice(1).toLocaleLowerCase(locale)}`)
    .join(" ");
}
