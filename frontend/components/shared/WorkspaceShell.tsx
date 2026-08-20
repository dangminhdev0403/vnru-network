"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const primaryNavigation = [
  { href: "/workspace", label: "Tổng quan", icon: "space_dashboard" },
  { href: "/workspace/iam", label: "IAM & Governance", icon: "shield_person" },
  { href: "/workspace/knowledge", label: "Kho tri thức & Chuyên gia", icon: "hub" },
];

const governanceNavigation = [
  { href: "/security", label: "Security & Sessions", icon: "verified_user" },
  { href: "/admin/iam", label: "Access Administration", icon: "admin_panel_settings" },
];

function isActive(pathname: string, href: string) {
  if (href === "/workspace") return pathname === href;
  return pathname.startsWith(href);
}

export default function WorkspaceShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const current = [...primaryNavigation, ...governanceNavigation].find((item) => isActive(pathname, item.href));

  const sidebar = (
    <aside className="flex h-full w-68 flex-col border-r border-white/10 bg-[#06152f] px-4 py-5 text-white shadow-2xl">
      <Link href="/" className="flex items-center gap-3 rounded-2xl px-2 py-2">
        <span className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-xl border border-white/15 bg-white shadow-lg">
          <span className="absolute inset-y-0 left-0 w-[62%] -skew-x-12 bg-[#2370ff]" />
          <span className="absolute inset-y-0 right-0 w-[48%] -skew-x-12 bg-[#e74762]" />
        </span>
        <span className="leading-tight">
          <strong className="block text-sm tracking-tight">RU–VN Portal</strong>
          <small className="text-xs font-bold uppercase tracking-wider text-slate-400">Knowledge Network</small>
        </span>
      </Link>

      <div className="mt-3 grid grid-cols-2 gap-1 rounded-2xl border border-white/10 bg-white/5 p-1">
        <Link href="/workspace/iam" className={`rounded-xl px-2 py-2 text-center text-xs font-black ${pathname.startsWith("/workspace/iam") ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}>
          Module 01 · IAM
        </Link>
        <Link href="/workspace/knowledge" className={`rounded-xl px-2 py-2 text-center text-xs font-black ${pathname.startsWith("/workspace/knowledge") ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}>
          Module 02 · Knowledge
        </Link>
      </div>

      <p className="px-3 pb-2 pt-6 text-xs font-black uppercase tracking-wider text-slate-400">Workspace</p>
      <nav className="grid gap-1">
        {primaryNavigation.map((item) => (
          <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-2xl border px-3 py-3 text-sm font-bold transition ${isActive(pathname, item.href) ? "border-sky-400/15 bg-linear-to-r from-blue-500/20 to-blue-500/5 text-white" : "border-transparent text-slate-300 hover:bg-white/5 hover:text-white"}`}>
            <span className="material-symbols-outlined text-xl text-sky-300">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <p className="px-3 pb-2 pt-6 text-xs font-black uppercase tracking-wider text-slate-400">Governance</p>
      <nav className="grid gap-1">
        {governanceNavigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 rounded-2xl border px-3 py-3 text-sm font-bold transition ${
              isActive(pathname, item.href)
                ? "border-sky-400/15 bg-linear-to-r from-blue-500/20 to-blue-500/5 text-white"
                : "border-transparent text-slate-300 hover:bg-white/5 hover:text-white"
            }`}
          >
            <span className="material-symbols-outlined text-xl text-sky-300">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs font-black uppercase tracking-wider text-slate-400">Active context</p>
        <strong className="mt-2 block text-sm">Authenticated workspace</strong>
        <span className="mt-1 block text-xs leading-5 text-slate-300">Identity, context và capability do Module 01 cung cấp. Backend vẫn là security boundary.</span>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-950 lg:grid lg:grid-cols-[272px_minmax(0,1fr)]">
      <div className="fixed inset-y-0 left-0 z-40 hidden lg:block">{sidebar}</div>

      <AnimatePresence>
        {open ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.button
              type="button"
              aria-label="Đóng menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { x: "-100%" }}
              animate={shouldReduceMotion ? { opacity: 1 } : { x: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="relative h-full w-68"
            >
              {sidebar}
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      <main className="min-w-0 lg:col-start-2">
        <header className="sticky top-0 z-30 flex h-18.5 items-center gap-3 border-b border-slate-200/80 bg-[#f4f7fb]/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <button type="button" aria-label="Mở menu" onClick={() => setOpen(true)} className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 lg:hidden">
            <span className="material-symbols-outlined text-xl">menu</span>
          </button>

          <div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex">
            <Link href="/workspace" className="hover:text-blue-600">Workspace</Link>
            <span>/</span>
            <strong className="text-slate-700">{current?.label ?? "RU–VN Portal"}</strong>
          </div>

          <label className="relative ml-auto hidden w-[min(460px,44vw)] md:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-xl text-slate-400">search</span>
            <input ref={searchRef} type="search" aria-label="Tìm kiếm toàn Portal" placeholder="Tìm chuyên gia, công bố, chủ đề…" className="h-11 w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-16 text-sm outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100" />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-bold text-slate-500">⌘K</kbd>
          </label>

          <div className="flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 text-xs font-black text-slate-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
            <span className="hidden xl:inline">Context active</span>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}
