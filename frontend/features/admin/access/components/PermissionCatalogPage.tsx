"use client";

import { useMemo, useState } from "react";
import { useLocale, type Locale } from "@/core/i18n/locale";
import {
  PERMISSION_CATALOG,
  SCOPE_DESCRIPTIONS,
  type AccessScope,
} from "../config/rbac-catalog";

const copy: Record<Locale, Record<string, string>> = {
  vi: {
    title: "Danh mục quyền hạn",
    desc: "Bảng tra cứu toàn bộ quyền hạn chức năng (Capabilities) được định nghĩa bởi mã nguồn và hệ thống.",
    readOnlyBanner:
      "Quyền hạn được định nghĩa cố định bởi Backend/Code (Read-Only). Quản trị viên có thể gán quyền vào các vai trò tùy chỉnh nhưng không thể tự ý tạo mã quyền tùy tiện.",
    searchPlaceholder: "Tìm theo mã quyền, tài nguyên hoặc thao tác…",
    allModules: "Tất cả module",
    allScopes: "Tất cả phạm vi",
    colKey: "Mã quyền hạn (Key)",
    colModule: "Phân hệ",
    colResource: "Tài nguyên",
    colAction: "Hành động",
    colScopes: "Phạm vi hỗ trợ",
    colDesc: "Mô tả chức năng",
    totalPerms: "Tổng số quyền hạn",
    noResults: "Không tìm thấy quyền hạn nào phù hợp.",
  },
  en: {
    title: "Permission Catalog",
    desc: "Complete dictionary of functional capabilities defined and governed by the system codebase.",
    readOnlyBanner:
      "Permissions are statically declared in Backend/Code (Read-Only). Administrators can assign permissions to custom roles but cannot create arbitrary permission keys.",
    searchPlaceholder: "Search by permission key, resource, or action...",
    allModules: "All modules",
    allScopes: "All scopes",
    colKey: "Permission Key",
    colModule: "Module",
    colResource: "Resource",
    colAction: "Action",
    colScopes: "Supported Scopes",
    colDesc: "Description",
    totalPerms: "Total Permissions",
    noResults: "No permissions matching your filters.",
  },
  ru: {
    title: "Каталог прав",
    desc: "Полный справочник функциональных полномочий, определенных кодовой базой системы.",
    readOnlyBanner:
      "Права фиксированы на уровне бэкенда/кода (Только для чтения). Администраторы могут назначать их ролям, но не могут создавать произвольные ключи прав.",
    searchPlaceholder: "Поиск по ключу, ресурсу или действию...",
    allModules: "Все модули",
    allScopes: "Все области",
    colKey: "Ключ права",
    colModule: "Модуль",
    colResource: "Ресурс",
    colAction: "Действие",
    colScopes: "Области действия",
    colDesc: "Описание",
    totalPerms: "Всего полномочий",
    noResults: "Полномочия не найдены.",
  },
};

export default function PermissionCatalogPage() {
  const { locale } = useLocale();
  const t = copy[locale] ?? copy.vi;

  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("");
  const [scopeFilter, setScopeFilter] = useState("");

  const filtered = useMemo(() => {
    return PERMISSION_CATALOG.filter((item) => {
      if (moduleFilter && item.moduleKey !== moduleFilter) return false;
      if (
        scopeFilter &&
        !item.supportedScopes.includes(scopeFilter as AccessScope)
      )
        return false;

      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const matchesKey = item.key.toLowerCase().includes(q);
        const matchesAction = (item.action[locale] ?? item.action.vi)
          .toLowerCase()
          .includes(q);
        const matchesRes = (item.resource[locale] ?? item.resource.vi)
          .toLowerCase()
          .includes(q);
        const matchesDesc = (item.description[locale] ?? item.description.vi)
          .toLowerCase()
          .includes(q);
        if (!matchesKey && !matchesAction && !matchesRes && !matchesDesc)
          return false;
      }
      return true;
    });
  }, [search, moduleFilter, scopeFilter, locale]);

  return (
    <div className="min-w-0 space-y-6 p-4 text-text-primary sm:p-6 lg:p-8">
      {/* ── Header ── */}
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          {t.title}
        </h1>
        <p className="mt-1 text-sm text-text-secondary">{t.desc}</p>
      </header>

      {/* ── Read-only Alert Banner ── */}
      <div className="flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50/70 p-4 text-xs leading-relaxed text-blue-900 dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-200">
        <span className="material-symbols-outlined shrink-0 text-lg text-blue-600 dark:text-blue-400">
          lock
        </span>
        <p>{t.readOnlyBanner}</p>
      </div>

      {/* ── Search & Filter Toolbar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-2xs">
        <div className="flex min-w-0 basis-full items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] px-3 py-2 sm:basis-auto sm:min-w-[280px] sm:flex-1">
          <span className="material-symbols-outlined text-lg text-text-secondary">
            search
          </span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full bg-transparent text-sm outline-none placeholder:text-text-secondary"
          />
        </div>

        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="w-full max-w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold text-text-primary outline-none sm:w-auto"
          >
            <option value="">{t.allModules}</option>
            <option value="iam">Quản trị danh tính (IAM)</option>
            <option value="content">Nội dung & Portal</option>
            <option value="collab">Hợp tác & Đề xuất</option>
            <option value="knowledge">Tri thức & Ấn phẩm</option>
          </select>

          <select
            value={scopeFilter}
            onChange={(e) => setScopeFilter(e.target.value)}
            className="w-full max-w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold text-text-primary outline-none sm:w-auto"
          >
            <option value="">{t.allScopes}</option>
            <option value="Own">Own Scope</option>
            <option value="Organization">Organization Scope</option>
            <option value="Portal">Portal Scope</option>
            <option value="Global">Global Scope</option>
          </select>
        </div>
      </div>

      {/* ── Catalog Table ── */}
      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-[var(--border)] bg-[var(--surface-secondary)] text-[11px] font-bold uppercase tracking-[.06em] text-text-secondary">
              <tr>
                <th className="px-5 py-3.5">{t.colKey}</th>
                <th className="px-5 py-3.5">{t.colModule}</th>
                <th className="px-5 py-3.5">{t.colResource}</th>
                <th className="px-5 py-3.5">{t.colAction}</th>
                <th className="px-5 py-3.5">{t.colScopes}</th>
                <th className="px-5 py-3.5">{t.colDesc}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filtered.map((item) => (
                <tr
                  key={item.key}
                  className="hover:bg-[var(--surface-secondary)]/50"
                >
                  <td className="px-5 py-4 font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                    {item.key}
                  </td>
                  <td className="px-5 py-4 font-medium text-slate-800 dark:text-slate-200">
                    {item.module[locale] ?? item.module.vi}
                  </td>
                  <td className="px-5 py-4 font-semibold text-slate-900 dark:text-white">
                    {item.resource[locale] ?? item.resource.vi}
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {item.action[locale] ?? item.action.vi}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1">
                      {item.supportedScopes.map((sc) => (
                        <span
                          key={sc}
                          className={`rounded px-1.5 py-0.5 text-[10px] font-bold border ${SCOPE_DESCRIPTIONS[sc].color}`}
                        >
                          {SCOPE_DESCRIPTIONS[sc].label[locale] ?? sc}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-xs leading-relaxed text-text-secondary">
                    {item.description[locale] ?? item.description.vi}
                  </td>
                </tr>
              ))}

              {!filtered.length && (
                <tr>
                  <td
                    colSpan={6}
                    className="p-12 text-center text-sm text-text-secondary"
                  >
                    {t.noResults}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-[var(--border)] px-5 py-3 text-xs text-text-secondary">
          {t.totalPerms}:{" "}
          <strong className="text-text-primary">{filtered.length}</strong> /{" "}
          {PERMISSION_CATALOG.length}
        </div>
      </div>
    </div>
  );
}
