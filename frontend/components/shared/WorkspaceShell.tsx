"use client";

import { useLocale, type Locale } from "@/app/HomeMotion";
import { SheetContent, SheetOverlay, SheetTitle } from "@/components/tailgrids/core/sheet";
import { cn } from "@/lib/cn";
import React, { useState } from "react";
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
    <div className="flex min-h-screen bg-background text-on-background">
      {/* Desktop sidebar (xl+) — always in DOM, transitions width */}
      <aside
        style={{
          width: isSidebarOpen ? "272px" : "72px",
          minWidth: isSidebarOpen ? "272px" : "72px",
          transition: "width 300ms cubic-bezier(0.4, 0, 0.2, 1), min-width 300ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
        className="hidden shrink-0 overflow-hidden xl:block fixed inset-y-0 left-0 z-40"
      >
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </aside>

      {/* Mobile sidebar (< xl) — Sheet sliding from left */}
      <SheetOverlay isOpen={isMobileSheetOpen} onOpenChange={setIsMobileSheetOpen}>
        <SheetContent
          side="left"
          showCloseButton={false}
          className="w-72 max-w-72 border-r border-card-border bg-card-surface-area p-0"
        >
          <SheetTitle className="sr-only">{brand.brand}</SheetTitle>
          <Sidebar
            isSidebarOpen={true}
            toggleSidebar={() => setIsMobileSheetOpen(false)}
            onItemClick={() => setIsMobileSheetOpen(false)}
            isMobile
          />
        </SheetContent>
      </SheetOverlay>

      {/* Main content column with dynamic margin */}
      <div
        className={cn(
          "min-w-0 flex-1 flex flex-col transition-all duration-300",
          isSidebarOpen ? "xl:ml-[272px]" : "xl:ml-[72px]"
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
