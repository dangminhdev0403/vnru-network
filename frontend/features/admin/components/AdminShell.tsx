"use client";

import { useLocale, type Locale } from "@/core/i18n/locale";
import {
  SheetContent,
  SheetOverlay,
  SheetTitle,
} from "@/components/tailgrids/core/sheet";
import { cn } from "@/lib/cn";
import Header from "@/components/shared/Header";
import AdminSidebar from "./AdminSidebar";
import ContentAdminSidebar from "@/features/news/ContentAdminSidebar";
import React, { Suspense, useState } from "react";

const shellCopy: Record<Locale, Record<string, string>> = {
  vi: { brand: "Mạng lưới tri thức Nga - Việt" },
  en: { brand: "Russia - Vietnam Knowledge Network" },
  ru: { brand: "Сеть знаний Россия – Вьетнам" },
};

export default function AdminShell({
  children,
  area = "iam",
}: Readonly<{ children: React.ReactNode; area?: "iam" | "content" }>) {
  const { locale } = useLocale();
  const brand = shellCopy[locale] || shellCopy.vi;

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);
  const Sidebar = area === "content" ? ContentAdminSidebar : AdminSidebar;

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className="workspace-background flex min-h-screen text-on-background">
      {/* Desktop sidebar (xl+) */}
      <aside
        style={{
          width: isSidebarOpen ? "280px" : "76px",
          minWidth: isSidebarOpen ? "280px" : "76px",
        }}
        className="fixed inset-y-0 left-0 z-40 hidden shrink-0 overflow-hidden transition-[width,min-width] duration-500 ease-out motion-reduce:transition-none xl:block"
      >
        <Suspense fallback={null}>
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
          />
        </Suspense>
      </aside>

      {/* Mobile sidebar (< xl) */}
      <SheetOverlay
        isOpen={isMobileSheetOpen}
        onOpenChange={setIsMobileSheetOpen}
      >
        <SheetContent
          side="left"
          showCloseButton={false}
          className="w-[min(20rem,calc(100vw-1rem))] max-w-[calc(100vw-1rem)] border-r border-card-border bg-card-surface-area p-0"
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

      {/* Main content */}
      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col transition-[margin] duration-500 ease-out motion-reduce:transition-none",
          isSidebarOpen ? "xl:ml-[280px]" : "xl:ml-[76px]",
        )}
      >
        <Header onMenuClick={() => setIsMobileSheetOpen(true)} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
