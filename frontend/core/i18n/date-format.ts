import type { Locale } from "./locale";

const localeNames: Record<Locale, string> = {
  vi: "vi-VN",
  en: "en-US",
  ru: "ru-RU",
};

function parseDate(value?: string | null) {
  if (!value) return;
  const localDate = value.match(/^(\d{2})[/.](\d{2})[/.](\d{4})$/);
  const date = localDate
    ? new Date(+localDate[3], +localDate[2] - 1, +localDate[1])
    : new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export function formatDate(value: string | null | undefined, locale: Locale) {
  const date = parseDate(value);
  return date
    ? new Intl.DateTimeFormat(localeNames[locale], {
        year: "numeric",
        month: locale === "en" ? "short" : "2-digit",
        day: "2-digit",
      }).format(date)
    : "—";
}

export function formatDateTime(
  value: string | null | undefined,
  locale: Locale,
) {
  const date = parseDate(value);
  return date
    ? new Intl.DateTimeFormat(localeNames[locale], {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(date)
    : "—";
}
