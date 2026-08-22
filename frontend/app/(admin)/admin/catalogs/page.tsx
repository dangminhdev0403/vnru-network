"use client";

import { useLocale, type Locale } from "@/app/HomeMotion";
import Link from "next/link";
import React from "react";

const catalogCopy: Record<
  Locale,
  {
    title: string;
    kicker: string;
    description: string;
    backToAdmin: string;
    categories: { name: string; desc: string; count: string; icon: string }[];
  }
> = {
  vi: {
    kicker: "Quản trị Dữ liệu & Danh mục",
    title: "Danh mục Chuẩn hóa Hệ thống",
    description: "Quản lý các bảng phân loại lĩnh vực nghiên cứu, danh sách tổ chức đối tác, và quy chuẩn dữ liệu song phương.",
    backToAdmin: "← Quay lại Quản trị Phân quyền",
    categories: [
      { name: "Lĩnh vực nghiên cứu (OECD / FOS)", desc: "Phân loại chuyên ngành KH&CN Việt – Nga", count: "12 nhóm chính", icon: "category" },
      { name: "Viện / Trường đối tác", desc: "Danh sách pháp nhân tổ chức nghiên cứu đã xác thực", count: "84 đơn vị", icon: "domain" },
      { name: "Từ khóa khoa học chuẩn", desc: "Hệ thống từ khóa song ngữ cho thuật toán tìm kiếm", count: "1,240 từ khóa", icon: "label" },
    ],
  },
  en: {
    kicker: "Data & Catalog Governance",
    title: "System Standardized Catalogs",
    description: "Manage research classification tables, verified institutional directories, and bilateral data taxonomies.",
    backToAdmin: "← Back to Access Administration",
    categories: [
      { name: "Research Fields (OECD / FOS)", desc: "Vietnam–Russia S&T domain taxonomies", count: "12 main groups", icon: "category" },
      { name: "Partner Institutions", desc: "Verified research universities and academies", count: "84 entities", icon: "domain" },
      { name: "Standardized Keywords", desc: "Bilingual controlled vocabulary for discovery", count: "1,240 keywords", icon: "label" },
    ],
  },
  ru: {
    kicker: "Управление данными и каталогами",
    title: "Стандартизированные каталоги системы",
    description: "Управление классификаторами научных направлений, реестрами организаций и двусторонней терминологией.",
    backToAdmin: "← Назад к администрированию",
    categories: [
      { name: "Научные направления (OECD / FOS)", desc: "Классификатор областей науки и технологий РФ — СРВ", count: "12 групп", icon: "category" },
      { name: "Партнёрские организации", desc: "Верифицированные университеты и институты РАН/VAST", count: "84 организации", icon: "domain" },
      { name: "Нормативные ключевые слова", desc: "Двуязычный тезаурус для поисковых механизмов", count: "1,240 терминов", icon: "label" },
    ],
  },
};

export default function AdminCatalogsPage() {
  const { locale } = useLocale();
  const t = catalogCopy[locale] || catalogCopy.vi;

  return (
    <div className="mx-auto max-w-[1580px] px-4 py-7 sm:px-6 lg:px-8 lg:py-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="module-kicker inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em]">
            <span className="size-1.5 rounded-full bg-[var(--accent-network)]" />
            <span>{t.kicker}</span>
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-[-0.035em] text-text-primary">
            {t.title}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-text-secondary">
            {t.description}
          </p>
        </div>
        <Link
          href="/admin/access"
          className="inline-flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          {t.backToAdmin}
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {t.categories.map((cat) => (
          <div
            key={cat.name}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-soft)] transition hover:border-[var(--accent-primary)]"
          >
            <span className="material-symbols-outlined text-3xl text-blue-600 dark:text-blue-400">{cat.icon}</span>
            <strong className="mt-3 block text-base font-bold text-text-primary">{cat.name}</strong>
            <p className="mt-1 text-xs leading-5 text-text-secondary">{cat.desc}</p>
            <span className="mt-4 inline-block rounded-lg bg-[var(--surface-secondary)] px-2.5 py-1 text-xs font-bold text-text-secondary">
              {cat.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
