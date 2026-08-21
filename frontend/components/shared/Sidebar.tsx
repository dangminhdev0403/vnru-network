"use client";

import { useLocale, type Locale } from "@/app/HomeMotion";
import { Tooltip, TooltipTrigger } from "@/components/tailgrids/core/tooltip";
import { cn } from "@/lib/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const brandCopy: Record<Locale, { brand: string; subtitle: string }> = {
  vi: {
    brand: "Mạng lưới KH&CN Việt - Nga",
    subtitle: "Khoa học · Công nghệ · Hợp tác",
  },
  en: {
    brand: "VN-RU Science & Technology Network",
    subtitle: "Science · Technology · Cooperation",
  },
  ru: {
    brand: "Научно-технологическая сеть Россия — Вьетнам",
    subtitle: "Наука · Технологии · Сотрудничество",
  },
};

interface NavItemData {
  href: string;
  label: string;
  icon: string;
  badge?: string;
}

interface NavSection {
  label: string;
  items: NavItemData[];
}

export interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  isMobile?: boolean;
  onItemClick?: () => void;
}

export default function Sidebar({
  isSidebarOpen,
  toggleSidebar,
  isMobile = false,
  onItemClick,
}: SidebarProps) {
  const pathname = usePathname();
  const { locale } = useLocale();
  const brand = brandCopy[locale] || brandCopy.vi;

  const navSections: NavSection[] = [
    {
      label: "WORKSPACE",
      items: [
        {
          href: "/workspace",
          label: locale === "ru" ? "Обзор" : locale === "en" ? "Overview" : "Tổng quan",
          icon: "space_dashboard",
        },
        {
          href: "/workspace/knowledge",
          label: locale === "ru" ? "База знаний & Эксперты" : locale === "en" ? "Knowledge & Experts" : "Kho tri thức & Chuyên gia",
          icon: "hub",
          badge: "M02",
        },
        {
          href: "/workspace/iam",
          label: locale === "ru" ? "IAM & Управление" : locale === "en" ? "IAM & Governance" : "IAM & Governance",
          icon: "shield_person",
          badge: "M01",
        },
      ],
    },
    {
      label: "GOVERNANCE",
      items: [
        {
          href: "/security",
          label: locale === "ru" ? "Безопасность & Сессии" : locale === "en" ? "Security & Sessions" : "Security & Sessions",
          icon: "verified_user",
        },
        {
          href: "/admin/iam",
          label: locale === "ru" ? "Администрирование IAM" : locale === "en" ? "IAM Administration" : "IAM Administration",
          icon: "admin_panel_settings",
        },
      ],
    },
  ];

  const isLinkActive = (href: string) => {
    if (href === "/workspace") return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside className="signal-surface flex h-full w-full flex-col justify-between overflow-hidden border-r border-white/10 px-4 py-5 text-white shadow-2xl transition-all">
      {/* Brand Header */}
      <div>
        <div
          className={cn(
            "flex items-center pb-4",
            isSidebarOpen ? "justify-between" : "flex-col justify-center gap-3"
          )}
        >
          <Link
            href="/"
            onClick={onItemClick}
            className="flex items-center gap-3 overflow-hidden outline-none rounded-2xl p-1"
          >
            {/* Original Flag Badge */}
            <span className="relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl border border-white/15 bg-white shadow-lg">
              <span className="absolute inset-y-0 left-0 w-[62%] -skew-x-12 bg-[#2370ff]" />
              <span className="absolute inset-y-0 right-0 w-[48%] -skew-x-12 bg-[#e74762]" />
            </span>
            {isSidebarOpen && (
              <div className="min-w-0 flex-1 leading-tight">
                <strong className="block truncate text-sm font-bold tracking-tight text-white">
                  {brand.brand}
                </strong>
                <small className="block truncate text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {brand.subtitle}
                </small>
              </div>
            )}
          </Link>

          {!isMobile && (
            <button
              type="button"
              onClick={toggleSidebar}
              aria-label={isSidebarOpen ? "Thu gọn sidebar" : "Mở rộng sidebar"}
              className="flex size-8 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white/10 hover:text-white cursor-pointer outline-none"
            >
              <span className="material-symbols-outlined text-lg">
                {isSidebarOpen ? "chevron_left" : "chevron_right"}
              </span>
            </button>
          )}

          {isMobile && (
            <button
              type="button"
              onClick={toggleSidebar}
              aria-label="Đóng menu"
              className="flex size-8 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white/10 hover:text-white cursor-pointer outline-none"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          )}
        </div>

        {/* Module Quick Switch Pills */}
        {isSidebarOpen && (
          <div className="my-3 grid grid-cols-2 gap-1 rounded-2xl border border-white/10 bg-white/5 p-1 text-center text-xs font-black">
            <Link
              href="/workspace/iam"
              onClick={onItemClick}
              className={cn(
                "rounded-xl px-2 py-2 transition",
                pathname.startsWith("/workspace/iam")
                  ? "bg-white/10 text-white shadow-xs"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              Module 01 · IAM
            </Link>
            <Link
              href="/workspace/knowledge"
              onClick={onItemClick}
              className={cn(
                "rounded-xl px-2 py-2 transition",
                pathname.startsWith("/workspace/knowledge")
                  ? "bg-white/10 text-white shadow-xs"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              Module 02 · Knowledge
            </Link>
          </div>
        )}

        {/* Navigation Sections */}
        <nav className="mt-4 space-y-6 overflow-y-auto">
          {navSections.map((section) => (
            <div key={section.label}>
              {isSidebarOpen ? (
                <p className="px-3 pb-2 text-xs font-black uppercase tracking-wider text-slate-400">
                  {section.label}
                </p>
              ) : (
                <div className="my-2 border-t border-white/10" />
              )}

              <div className="grid gap-1">
                {section.items.map((item) => {
                  const active = isLinkActive(item.href);

                  if (!isSidebarOpen) {
                    return (
                      <div key={item.href} className="flex justify-center">
                        <TooltipTrigger>
                          <Link
                            href={item.href}
                            onClick={onItemClick}
                            className={cn(
                              "flex size-10 items-center justify-center rounded-xl transition-all",
                              active
                                ? "border border-sky-400/30 bg-blue-500/20 text-white shadow-sm"
                                : "text-white/70 hover:bg-white/10 hover:text-white"
                            )}
                          >
                            <span className="material-symbols-outlined text-xl text-sky-300">
                              {item.icon}
                            </span>
                          </Link>
                          <Tooltip placement="right">{item.label}</Tooltip>
                        </TooltipTrigger>
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onItemClick}
                      className={cn(
                        "relative flex items-center justify-between rounded-xl border px-3 py-3 text-sm font-bold transition",
                        active
                          ? "border-sky-400/25 bg-blue-500/15 text-white before:absolute before:inset-y-2 before:left-0 before:w-0.5 before:rounded-full before:bg-sky-300"
                          : "border-transparent text-white/75 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="material-symbols-outlined text-xl text-sky-300 shrink-0">
                          {item.icon}
                        </span>
                        <span className="truncate">{item.label}</span>
                      </div>

                      {item.badge && (
                        <span
                          className={cn(
                            "rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase",
                            active
                              ? "bg-white/20 text-white"
                              : "bg-white/10 text-slate-300"
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom Footer Notice */}
      {isSidebarOpen && (
        <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4 text-white">
          <p className="text-xs font-black uppercase tracking-wider text-slate-400">
            Active Context
          </p>
          <strong className="mt-1.5 block text-sm font-bold">
            Authenticated workspace
          </strong>
          <span className="mt-1 block text-xs leading-5 text-slate-300">
            Identity, context và capability do Module 01 cung cấp. Backend luôn authoritative.
          </span>
        </div>
      )}
    </aside>
  );
}
