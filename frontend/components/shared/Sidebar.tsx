"use client";

import { useLocale, type Locale } from "@/app/HomeMotion";
import { Tooltip, TooltipTrigger } from "@/components/tailgrids/core/tooltip";
import { cn } from "@/lib/cn";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

interface Copy {
  brand: string;
  subtitle: string;
  overview: string;
  access: string;
  security: string;
  governance: string;
  iamOverview: string;
  users: string;
  roles: string;
  sessions: string;
  workspaceOverview: string;
  knowledge: string;
  iam: string;
  admin: string;
  currentContext: string;
  authenticated: string;
  active: string;
  collapse: string;
  expand: string;
  close: string;
}

const copy: Record<Locale, Copy> = {
  vi: {
    brand: "Mạng lưới KH&CN Việt – Nga", subtitle: "Khoa học · Công nghệ · Hợp tác",
    overview: "TỔNG QUAN", access: "QUẢN LÝ TRUY CẬP", security: "BẢO MẬT", governance: "QUẢN TRỊ",
    iamOverview: "Tổng quan IAM", users: "Quản lý người dùng", roles: "Vai trò & quyền", sessions: "Phiên & bảo mật",
    workspaceOverview: "Tổng quan", knowledge: "Kho tri thức & Chuyên gia", iam: "Quản trị danh tính & truy cập", admin: "Quản trị phân quyền",
    currentContext: "Ngữ cảnh hiện tại", authenticated: "Không gian đã xác thực", active: "Phiên hoạt động",
    collapse: "Thu gọn thanh điều hướng", expand: "Mở rộng thanh điều hướng", close: "Đóng thanh điều hướng",
  },
  en: {
    brand: "VN–RU Science & Technology Network", subtitle: "Science · Technology · Cooperation",
    overview: "OVERVIEW", access: "ACCESS MANAGEMENT", security: "SECURITY", governance: "GOVERNANCE",
    iamOverview: "IAM Overview", users: "User Management", roles: "Roles & Permissions", sessions: "Security & Sessions",
    workspaceOverview: "Overview", knowledge: "Knowledge & Experts", iam: "Identity & Access", admin: "Access Administration",
    currentContext: "Active context", authenticated: "Authenticated workspace", active: "Session active",
    collapse: "Collapse navigation", expand: "Expand navigation", close: "Close navigation",
  },
  ru: {
    brand: "Сеть НТИ РФ — СРВ", subtitle: "Наука · Технологии · Сотрудничество",
    overview: "ОБЗОР", access: "УПРАВЛЕНИЕ ДОСТУПОМ", security: "БЕЗОПАСНОСТЬ", governance: "УПРАВЛЕНИЕ",
    iamOverview: "Обзор IAM", users: "Управление пользователями", roles: "Роли и права", sessions: "Сессии и безопасность",
    workspaceOverview: "Обзор", knowledge: "База знаний и эксперты", iam: "Управление доступом", admin: "Администрирование IAM",
    currentContext: "Текущий контекст", authenticated: "Защищённое пространство", active: "Сессия активна",
    collapse: "Свернуть панель", expand: "Развернуть панель", close: "Закрыть панель",
  },
};

interface NavItem { href: string; label: string; icon: string }
interface NavSection { label: string; items: NavItem[] }
export interface SidebarProps { isSidebarOpen: boolean; toggleSidebar: () => void; isMobile?: boolean; onItemClick?: () => void }

export default function Sidebar({ isSidebarOpen, toggleSidebar, isMobile = false, onItemClick }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { locale } = useLocale();
  const t = copy[locale] || copy.vi;
  const iam = pathname.startsWith("/workspace/iam") || pathname.startsWith("/admin/iam") || pathname.startsWith("/security");
  const sections: NavSection[] = iam ? [
    { label: t.overview, items: [{ href: "/workspace/iam", label: t.iamOverview, icon: "dashboard" }] },
    { label: t.access, items: [
      { href: "/workspace/iam/admin?view=overview", label: t.users, icon: "group" },
      { href: "/workspace/iam/admin?view=roles", label: t.roles, icon: "policy" },
    ] },
    { label: t.security, items: [{ href: "/workspace/iam/security", label: t.sessions, icon: "shield_lock" }] },
  ] : [
    { label: t.overview, items: [
      { href: "/workspace", label: t.workspaceOverview, icon: "dashboard" },
      { href: "/workspace/knowledge", label: t.knowledge, icon: "hub" },
      { href: "/workspace/iam", label: t.iam, icon: "badge" },
    ] },
    { label: t.governance, items: [
      { href: "/workspace/iam/security", label: t.sessions, icon: "shield_lock" },
      { href: "/workspace/iam/admin", label: t.admin, icon: "policy" },
    ] },
  ];

  const isActive = (href: string) => {
    const [path, query] = href.split("?");
    if (query) return pathname === path && searchParams.toString() === query;
    if (href === "/workspace" || href === "/workspace/iam") return pathname === href && !searchParams.toString();
    return pathname.startsWith(path);
  };

  return (
    <aside className="flex h-full w-full flex-col overflow-hidden border-r border-[var(--border)] bg-[var(--nav-bg)] px-3 py-4 text-[#f3f5f7]">
      <div className={cn("flex shrink-0 items-center border-b border-white/8 pb-4", isSidebarOpen ? "justify-between" : "flex-col gap-2")}>
        <Link href="/" onClick={onItemClick} className="flex min-w-0 flex-1 items-center gap-3 rounded-xl p-1">
          <span className="relative grid size-10 shrink-0 overflow-hidden rounded-[14px] bg-white">
            <span className="absolute -inset-y-1 left-[-8px] w-[65%] -skew-x-12 bg-[var(--accent-primary)]" />
            <span className="absolute -inset-y-1 right-[-8px] w-[55%] -skew-x-12 bg-[var(--accent-network)]" />
          </span>
          {isSidebarOpen && <span className="min-w-0 leading-tight">
            <strong className="block truncate text-sm font-semibold">{t.brand}</strong>
            <small className="mt-1 block truncate text-[10px] font-semibold uppercase tracking-[.08em] text-[#a7b0bc]">{t.subtitle}</small>
          </span>}
        </Link>
        <button type="button" onClick={toggleSidebar} aria-label={isMobile ? t.close : isSidebarOpen ? t.collapse : t.expand} className="grid size-9 shrink-0 place-items-center rounded-xl text-[#a7b0bc] hover:bg-[var(--nav-hover)] hover:text-white">
          <span className="material-symbols-outlined text-xl">{isMobile ? "close" : isSidebarOpen ? "chevron_left" : "chevron_right"}</span>
        </button>
      </div>

      <nav className="min-h-0 flex-1 space-y-5 overflow-x-hidden overflow-y-auto py-5" aria-label="Workspace navigation">
        {sections.map((section) => <section key={section.label}>
          {isSidebarOpen ? <h2 className="px-3 pb-2 text-[10px] font-bold tracking-[.12em] text-[#8f99a7]">{section.label}</h2> : <div className="mb-2 border-t border-white/8" />}
          <div className="grid gap-1">
            {section.items.map((item) => {
              const active = isActive(item.href);
              const link = <Link href={item.href} onClick={onItemClick} className={cn(
                "relative flex min-h-11 items-center rounded-xl text-sm font-semibold transition-colors before:absolute before:inset-y-2 before:left-0 before:w-[3px] before:rounded-r-full before:bg-transparent",
                isSidebarOpen ? "gap-3 px-3" : "justify-center px-0",
                active ? "bg-[var(--nav-active)] text-white before:bg-[var(--accent-primary)]" : "text-[#c8d0da] hover:bg-[var(--nav-hover)] hover:text-white",
              )}>
                <span className={cn("material-symbols-outlined text-[21px]", active ? "text-[#6ea0ff]" : "text-[#8f99a7]")}>{item.icon}</span>
                {isSidebarOpen && <span className="min-w-0 truncate">{item.label}</span>}
              </Link>;
              return isSidebarOpen ? <div key={item.href}>{link}</div> : <div key={item.href}><TooltipTrigger>{link}<Tooltip placement="right">{item.label}</Tooltip></TooltipTrigger></div>;
            })}
          </div>
        </section>)}
      </nav>

      {isSidebarOpen && <div className="shrink-0 rounded-2xl border border-white/8 bg-[var(--nav-hover)] p-3.5">
        <p className="text-[10px] font-bold uppercase tracking-[.12em] text-[#8f99a7]">{t.currentContext}</p>
        <strong className="mt-1.5 block text-sm font-semibold">{t.authenticated}</strong>
        <p className="mt-2 flex items-center gap-2 border-t border-white/8 pt-2 text-xs text-[#a7b0bc]"><span className="size-2 rounded-full bg-[var(--success)]" />{t.active}</p>
      </div>}
    </aside>
  );
}
