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
    <aside className="relative isolate flex h-full w-full flex-col overflow-hidden border-r border-[#dfe6ef] bg-[#fbfdff] px-3 py-4 text-[#10213a] dark:border-[#253445] dark:bg-[#0e1720] dark:text-[#f4f7fb]">
      <svg
        aria-hidden="true"
        viewBox="0 0 112 920"
        preserveAspectRatio="none"
        className="pointer-events-none absolute -right-3 top-16 -z-0 h-[calc(100%-5rem)] w-[112px] text-[#2f7df4] opacity-[0.18] dark:text-[#4c8dff] dark:opacity-[0.16]"
      >
        <g fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M84 5 52 72l42 54-54 66 45 77-52 63 52 75-46 70 44 68-55 78 57 62-48 78 44 69-56 74" />
          <path d="M108 46 52 72l-8 59 50-5-9 143-52 63 80 13-28 62-46 70 79 25-35 43-55 78 85 19-28 43-48 78 76 12-32 57" />
          <path d="M52 72 18 104l26 27-4 61 45 77 28 76-28 62 33 95-35 43 29 61-47 17-28 61 44 69-6 62" />
        </g>
        <g fill="currentColor">
          <circle cx="84" cy="5" r="3" /><circle cx="52" cy="72" r="4" /><circle cx="94" cy="126" r="3" />
          <circle cx="40" cy="192" r="3" /><circle cx="85" cy="269" r="4" /><circle cx="33" cy="332" r="3" />
          <circle cx="85" cy="407" r="3" /><circle cx="39" cy="477" r="4" /><circle cx="83" cy="545" r="3" />
          <circle cx="28" cy="623" r="3" /><circle cx="85" cy="685" r="4" /><circle cx="37" cy="763" r="3" />
          <circle cx="81" cy="832" r="3" /><circle cx="25" cy="906" r="4" />
        </g>
        <g fill="var(--accent-network)">
          <circle cx="18" cy="104" r="3" /><circle cx="113" cy="345" r="3.5" /><circle cx="118" cy="502" r="3" />
          <circle cx="28" cy="684" r="3.5" /><circle cx="113" cy="844" r="3" />
        </g>
      </svg>

      <div className={cn("relative z-10 flex shrink-0 items-center border-b border-[#e7edf4] pb-4 dark:border-white/8", isSidebarOpen ? "justify-between" : "flex-col gap-2")}>
        <Link href="/" onClick={onItemClick} className="flex min-w-0 flex-1 items-center gap-3 rounded-xl p-1">
          <span className="relative grid size-10 shrink-0 overflow-hidden rounded-[14px] bg-white shadow-[0_6px_18px_-12px_rgba(15,23,42,.45)] ring-1 ring-[#e3eaf3] dark:ring-white/10">
            <span className="absolute -inset-y-1 left-[-8px] w-[65%] -skew-x-12 bg-[var(--accent-primary)]" />
            <span className="absolute -inset-y-1 right-[-8px] w-[55%] -skew-x-12 bg-[var(--accent-network)]" />
          </span>
          {isSidebarOpen && <span className="min-w-0 leading-tight">
            <strong className="block truncate text-sm font-semibold text-[#0d1d35] dark:text-white">{t.brand}</strong>
            <small className="mt-1 block truncate text-[10px] font-semibold uppercase tracking-[.08em] text-[#718198] dark:text-[#8fa2b8]">{t.subtitle}</small>
          </span>}
        </Link>
        <button type="button" onClick={toggleSidebar} aria-label={isMobile ? t.close : isSidebarOpen ? t.collapse : t.expand} className="grid size-9 shrink-0 place-items-center rounded-xl text-[#75859a] transition-colors hover:bg-[#eef3f8] hover:text-[#155bd7] dark:text-[#8fa2b8] dark:hover:bg-[#162432] dark:hover:text-white">
          <span className="material-symbols-outlined text-xl">{isMobile ? "close" : isSidebarOpen ? "chevron_left" : "chevron_right"}</span>
        </button>
      </div>

      <nav className="relative z-10 min-h-0 flex-1 space-y-5 overflow-x-hidden overflow-y-auto py-5" aria-label="Workspace navigation">
        {sections.map((section) => <section key={section.label}>
          {isSidebarOpen ? <h2 className="px-3 pb-2 text-[10px] font-bold tracking-[.12em] text-[#718198] dark:text-[#8fa2b8]">{section.label}</h2> : <div className="mb-2 border-t border-[#e7edf4] dark:border-white/8" />}
          <div className="grid gap-1">
            {section.items.map((item) => {
              const active = isActive(item.href);
              const link = <Link href={item.href} onClick={onItemClick} className={cn(
                "relative flex min-h-11 w-full items-center rounded-xl text-sm font-semibold transition-colors before:absolute before:inset-y-2 before:left-0 before:w-[3px] before:rounded-r-full before:bg-transparent",
                isSidebarOpen ? "gap-3 px-3" : "justify-center px-0",
                active
                  ? "bg-[#eaf2ff] text-[#155bd7] before:bg-[#1769ff] dark:bg-[#182b43] dark:text-[#73a5ff] dark:before:bg-[#4c8dff]"
                  : "text-[#25364e] hover:bg-[#f0f4f9] hover:text-[#155bd7] dark:text-[#d4deea] dark:hover:bg-[#162432] dark:hover:text-white",
              )}>
                <span className={cn("material-symbols-outlined text-[21px]", active ? "text-[#1769ff] dark:text-[#5f95ff]" : "text-[#6f8097] dark:text-[#8fa2b8]")}>{item.icon}</span>
                {isSidebarOpen && <span className="min-w-0 truncate">{item.label}</span>}
              </Link>;
              return isSidebarOpen ? <div key={item.href}>{link}</div> : <div key={item.href}><TooltipTrigger>{link}<Tooltip placement="right">{item.label}</Tooltip></TooltipTrigger></div>;
            })}
          </div>
        </section>)}
      </nav>

      {isSidebarOpen && <div className="relative z-10 shrink-0 rounded-2xl border border-[#dfe6ef] bg-white/88 p-3.5 shadow-[0_10px_30px_-24px_rgba(15,23,42,.45)] backdrop-blur-sm dark:border-[#2b3b4c] dark:bg-[#111d28]/92 dark:shadow-none">
        <p className="text-[10px] font-bold uppercase tracking-[.12em] text-[#718198] dark:text-[#8fa2b8]">{t.currentContext}</p>
        <strong className="mt-1.5 block text-sm font-semibold text-[#14243c] dark:text-[#f4f7fb]">{t.authenticated}</strong>
        <p className="mt-2 flex items-center gap-2 border-t border-[#e7edf4] pt-2 text-xs text-[#68788e] dark:border-white/8 dark:text-[#9bacc0]"><span className="size-2 rounded-full bg-[var(--success)]" />{t.active}</p>
      </div>}
    </aside>
  );
}
