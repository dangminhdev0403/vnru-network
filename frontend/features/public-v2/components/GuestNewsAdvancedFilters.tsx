"use client";

import { useRef } from "react";
import {
  DEFAULT_NEWS_ADVANCED_FILTERS,
  type NewsAdvancedFilters,
} from "./GuestNewsFilterNav";

type GuestNewsAdvancedFiltersProps = {
  filters: NewsAdvancedFilters;
  onApply: (filters: NewsAdvancedFilters) => void;
  onFiltersChange: (filters: NewsAdvancedFilters) => void;
  triggerLabel: string;
};

export function GuestNewsAdvancedFilters({
  filters,
  onApply,
  onFiltersChange,
  triggerLabel,
}: GuestNewsAdvancedFiltersProps) {
  const detailsRef = useRef<HTMLDetailsElement | null>(null);

  const update = (patch: Partial<NewsAdvancedFilters>) => {
    onFiltersChange({ ...filters, ...patch });
  };

  return (
    <details ref={detailsRef} className="group">
      <summary
        title={triggerLabel}
        aria-label={triggerLabel}
        className="grid size-11 shrink-0 list-none cursor-pointer place-items-center rounded-xl border border-slate-200 bg-slate-50 text-blue-950 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 motion-reduce:transition-none [&::-webkit-details-marker]:hidden"
      >
        <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
          <path
            d="M4 7h3M11 7h9M4 17h9M17 17h3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <circle
            cx="9"
            cy="7"
            r="2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <circle
            cx="15"
            cy="17"
            r="2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          />
        </svg>
      </summary>

      <div className="absolute -left-px -right-px top-full z-50 -mt-px overflow-hidden rounded-b-lg border-x border-b border-slate-200 bg-white shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <fieldset className="border-b border-slate-200 p-5">
            <legend className="flex items-center gap-2 text-base font-black text-slate-900">
              <span className="text-xl font-normal text-blue-600" aria-hidden="true">
                ◎
              </span>
              Phạm vi
            </legend>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {[
                ["all", "Tất cả"],
                ["vietnam", "Việt Nam"],
                ["russia", "Liên bang Nga"],
                ["bilateral", "Hợp tác Việt - Nga"],
              ].map(([value, label]) => (
                <label
                  key={value}
                  className="flex min-h-11 cursor-pointer items-center gap-2 text-base text-slate-700 hover:text-blue-700"
                >
                  <input
                    type="radio"
                    name="filter-scope"
                    value={value}
                    checked={filters.scope === value}
                    onChange={() =>
                      update({
                        scope: value as NewsAdvancedFilters["scope"],
                      })
                    }
                    className="size-4 accent-blue-600"
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="border-b border-slate-200 p-5 md:border-b-0 md:border-r">
            <legend className="flex items-center gap-2 text-base font-black text-slate-900">
              <span className="text-xl font-normal text-blue-600" aria-hidden="true">
                ▣
              </span>
              Loại nội dung
            </legend>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {[
                ["ARTICLE", "Bài viết"],
                ["EVENT", "Sự kiện"],
                ["ANNOUNCEMENT", "Công bố"],
                ["PROJECT", "Dự án"],
                ["OPPORTUNITY", "Cơ hội"],
                ["PUBLICATION", "Ấn phẩm"],
              ].map(([value, label]) => (
                <label
                  key={value}
                  className="flex min-h-11 cursor-pointer items-center gap-2 text-base text-slate-700 hover:text-blue-700"
                >
                  <input
                    type="checkbox"
                    checked={filters.contentTypes.includes(
                      value as NewsAdvancedFilters["contentTypes"][number],
                    )}
                    onChange={() => {
                      const type =
                        value as NewsAdvancedFilters["contentTypes"][number];
                      update({
                        contentTypes: filters.contentTypes.includes(type)
                          ? filters.contentTypes.filter((item) => item !== type)
                          : [...filters.contentTypes, type],
                      });
                    }}
                    className="size-4 rounded accent-blue-600"
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="p-5">
            <legend className="flex items-center gap-2 text-base font-black text-slate-900">
              <span className="text-xl font-normal text-blue-600" aria-hidden="true">
                ◷
              </span>
              Thời gian
            </legend>
            <div className="mt-3 grid grid-cols-3 overflow-hidden rounded-lg border border-slate-200">
              {[
                ["newest", "Mới nhất"],
                ["7days", "7 ngày"],
                ["30days", "30 ngày"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    update({
                      period: value as NewsAdvancedFilters["period"],
                    })
                  }
                  aria-pressed={filters.period === value}
                  className={`min-h-11 border-r border-slate-200 px-3 text-base font-semibold text-blue-950 last:border-r-0 ${
                    filters.period === value
                      ? "bg-blue-50 ring-1 ring-inset ring-blue-600"
                      : "bg-white hover:bg-slate-50"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="grid grid-cols-2 gap-3 border-t border-slate-200 p-5 md:col-span-2">
            <button
              type="button"
              onClick={() =>
                onFiltersChange({
                  ...DEFAULT_NEWS_ADVANCED_FILTERS,
                  contentTypes: [],
                })
              }
              className="min-h-11 rounded-lg border border-slate-200 bg-white px-4 text-base font-bold text-slate-700 transition hover:bg-slate-50 motion-reduce:transition-none"
            >
              Đặt lại
            </button>
            <button
              type="button"
              onClick={() => {
                onApply(filters);
                if (detailsRef.current) detailsRef.current.open = false;
              }}
              className="min-h-11 rounded-lg bg-blue-600 px-4 text-base font-bold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 motion-reduce:transition-none"
            >
              Áp dụng bộ lọc
            </button>
          </div>
        </div>
      </div>
    </details>
  );
}
