"use client";

import { useLocale, type Locale } from "@/app/HomeMotion";
import { SheetContent, SheetOverlay, SheetTitle } from "@/components/tailgrids/core/sheet";
import { cn } from "@/lib/cn";
import React, { Suspense, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

const shellCopy: Record<Locale, Record<string, string>> = {
  vi: { brand: "Mạng lưới KH&CN Việt - Nga", subtitle: "Khoa học · Công nghệ · Hợp tác" },
  en: { brand: "VN-RU Science & Technology Network", subtitle: "Science · Technology · Cooperation" },
  ru: { brand: "Научно-технологическая сеть Россия — Вьетнам", subtitle: "Наука · Технологии · Сотрудничество" },
};

export default function WorkspaceShell({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { locale } = useLocale();
  const brand = shellCopy[locale];

  // Desktop sidebar (xl+) expand/collapse state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // Mobile sheet open state (< xl breakpoint)
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className="workspace-background flex min-h-screen text-on-background">
      {/* Desktop sidebar (xl+) — always in DOM, transitions width */}
      <aside
        style={{
          width: isSidebarOpen ? "256px" : "76px",
          minWidth: isSidebarOpen ? "256px" : "76px",
        }}
        className="fixed inset-y-0 left-0 z-40 hidden shrink-0 overflow-hidden transition-[width,min-width] duration-500 ease-out motion-reduce:transition-none xl:block"
      >
        <Suspense fallback={null}>
          <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        </Suspense>
      </aside>

      {/* Mobile sidebar (< xl) — Sheet sliding from left */}
      <SheetOverlay isOpen={isMobileSheetOpen} onOpenChange={setIsMobileSheetOpen}>
        <SheetContent
          side="left"
          showCloseButton={false}
          className="w-72 max-w-72 border-r border-card-border bg-card-surface-area p-0"
        >
          <SheetTitle className="sr-only">{brand.brand}</SheetTitle>
          <Suspense fallback={null}>
            <Sidebar
              isSidebarOpen={true}
              toggleSidebar={() => setIsMobileSheetOpen(false)}
              onItemClick={() => setIsMobileSheetOpen(false)}
              isMobile
            />
          </Suspense>
        </SheetContent>
      </SheetOverlay>

      {/* Main content column with dynamic margin */}
      <div
        className={cn(
          "min-w-0 flex-1 flex flex-col transition-[margin] duration-500 ease-out motion-reduce:transition-none",
          isSidebarOpen ? "xl:ml-[256px]" : "xl:ml-[76px]"
        )}
      >
        <Header onMenuClick={() => setIsMobileSheetOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
